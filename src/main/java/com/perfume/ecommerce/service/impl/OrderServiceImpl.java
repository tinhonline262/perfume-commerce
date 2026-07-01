package com.perfume.ecommerce.service.impl;

import com.perfume.ecommerce.domain.Order;
import com.perfume.ecommerce.domain.OrderItem;
import com.perfume.ecommerce.domain.InventoryLog;
import com.perfume.ecommerce.domain.OrderStatusHistory;
import com.perfume.ecommerce.repository.InventoryLogRepository;
import com.perfume.ecommerce.domain.Perfume;
import com.perfume.ecommerce.enums.OrderStatus;
import com.perfume.ecommerce.enums.PaymentMethod;
import com.perfume.ecommerce.enums.PaymentStatus;
import com.perfume.ecommerce.exception.ApiRequestException;
import com.perfume.ecommerce.repository.OrderItemRepository;
import com.perfume.ecommerce.repository.OrderRepository;
import com.perfume.ecommerce.repository.OrderStatusHistoryRepository;
import com.perfume.ecommerce.repository.PerfumeRepository;
import com.perfume.ecommerce.service.OrderService;
import com.perfume.ecommerce.service.email.MailSender;

import graphql.schema.DataFetcher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.perfume.ecommerce.constants.ErrorMessage.ORDER_NOT_FOUND;
import static com.perfume.ecommerce.constants.ErrorMessage.PERFUME_NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final Set<OrderStatus> TERMINAL_STATUSES =
            EnumSet.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED);

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final PerfumeRepository perfumeRepository;
    private final MailSender mailSender;

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiRequestException(ORDER_NOT_FOUND, HttpStatus.NOT_FOUND));
    }

    @Override
    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        Order order = getOrderById(orderId);
        return order.getOrderItems();
    }

    @Override
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByIdAsc(pageable);
    }

    @Override
    public Page<Order> getUserOrders(String email, Pageable pageable) {
        return orderRepository.findOrderByEmail(email, pageable);
    }

    @Override
    @Transactional
    public Order postOrder(Order order, Map<Long, Long> perfumesId) {
        List<OrderItem> orderItemList = new ArrayList<>();

        for (Map.Entry<Long, Long> entry : perfumesId.entrySet()) {
            Perfume perfume = perfumeRepository.findById(entry.getKey())
                    .orElseThrow(() -> new ApiRequestException(PERFUME_NOT_FOUND, HttpStatus.NOT_FOUND));
            
            // Check stock
            if (perfume.getInventory() < entry.getValue()) {
                throw new ApiRequestException("Not enough stock for perfume: " + perfume.getPerfumeTitle(), HttpStatus.BAD_REQUEST);
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setPerfume(perfume);
            orderItem.setAmount((perfume.getPrice() * entry.getValue()));
            orderItem.setQuantity(entry.getValue());
            orderItemList.add(orderItem);
            orderItemRepository.save(orderItem);
        }
        order.getOrderItems().addAll(orderItemList);
        orderRepository.save(order);

        if (PaymentMethod.COD.equals(order.getPaymentMethod())) {
            // COD -> reserve inventory immediately
            reserveInventory(order.getOrderItems(), null);

            String subject = "Order #" + order.getId();
            String template = "order-template";
            Map<String, Object> attributes = new HashMap<>();
            attributes.put("order", order);
            mailSender.sendMessageHtml(order.getEmail(), subject, template, attributes);
            order.setPaymentStatus(PaymentStatus.UNPAID);
            orderRepository.save(order);
        }

        return order;
    }

    public void reserveInventory(List<OrderItem> items, Long adminId) {
        for (OrderItem item : items) {
            Perfume p = item.getPerfume();
            p.setInventory(p.getInventory() - item.getQuantity().intValue());
            perfumeRepository.save(p);
            logInventory(p, -item.getQuantity().intValue(), "RESERVE", adminId);
        }
    }

    public void restoreInventory(List<OrderItem> items, Long adminId) {
        for (OrderItem item : items) {
            Perfume p = item.getPerfume();
            p.setInventory(p.getInventory() + item.getQuantity().intValue());
            perfumeRepository.save(p);
            logInventory(p, item.getQuantity().intValue(), "RESTORE", adminId);
        }
    }

    public void markInventorySold(List<OrderItem> items) {
        for (OrderItem item : items) {
            Perfume p = item.getPerfume();
            p.setSoldQuantity(p.getSoldQuantity() + item.getQuantity().intValue());
            perfumeRepository.save(p);
        }
    }

    private void logInventory(Perfume p, int change, String type, Long adminId) {
        InventoryLog logRecord = new InventoryLog();
        logRecord.setPerfume(p);
        logRecord.setQuantityChanged(change);
        logRecord.setType(type);
        // We'll leave admin as null if adminId is null
        inventoryLogRepository.save(logRecord);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, Long adminId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiRequestException(ORDER_NOT_FOUND, HttpStatus.NOT_FOUND));

        OrderStatus oldStatus = order.getOrderStatus();

        // Validate: cannot update terminal statuses
        if (TERMINAL_STATUSES.contains(oldStatus)) {
            throw new ApiRequestException(
                    "Cannot update order status: order is already in terminal state " + oldStatus,
                    HttpStatus.BAD_REQUEST
            );
        }

        // Validate: cannot set same status
        if (oldStatus == newStatus) {
            throw new ApiRequestException(
                    "Order is already in status " + newStatus,
                    HttpStatus.BAD_REQUEST
            );
        }

        // Validate transition rules
        validateTransition(oldStatus, newStatus);

        // Inventory logic based on status changes
        if (newStatus == OrderStatus.DELIVERED && oldStatus != OrderStatus.DELIVERED) {
            markInventorySold(order.getOrderItems());
        } else if (newStatus == OrderStatus.CANCELLED && oldStatus != OrderStatus.CANCELLED) {
            restoreInventory(order.getOrderItems(), adminId);
        }

        // Persist status change
        order.setOrderStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        // Record history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setAdminId(adminId);
        history.setChangedAt(LocalDateTime.now());
        orderStatusHistoryRepository.save(history);

        // Log the change
        log.info("[ORDER STATUS CHANGE] orderId={} | oldStatus={} | newStatus={} | adminId={} | timestamp={}",
                orderId, oldStatus, newStatus, adminId, history.getChangedAt());

        // Send email notification
        sendStatusChangeEmail(order, newStatus);

        return order;
    }

    private void validateTransition(OrderStatus from, OrderStatus to) {
        boolean valid;
        if (from == OrderStatus.PENDING) {
            valid = to == OrderStatus.PREPARING || to == OrderStatus.CANCELLED;
        } else if (from == OrderStatus.PREPARING) {
            valid = to == OrderStatus.READY_TO_SHIP || to == OrderStatus.CANCELLED;
        } else if (from == OrderStatus.READY_TO_SHIP) {
            valid = to == OrderStatus.SHIPPING || to == OrderStatus.CANCELLED;
        } else if (from == OrderStatus.SHIPPING) {
            valid = to == OrderStatus.DELIVERED;
        } else {
            valid = false;
        }

        if (!valid) {
            throw new ApiRequestException(
                    "Invalid status transition from " + from + " to " + to,
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private void sendStatusChangeEmail(Order order, OrderStatus newStatus) {
        String subject;
        switch (newStatus) {
            case PREPARING:
                subject = "Your order is being prepared";
                break;
            case READY_TO_SHIP:
                subject = "Your order is ready to ship";
                break;
            case SHIPPING:
                subject = "Your order has been shipped";
                break;
            case DELIVERED:
                subject = "Your order has been delivered";
                break;
            case CANCELLED:
                subject = "Your order has been cancelled";
                break;
            default:
                return; // No email for other statuses
        }

        try {
            Map<String, Object> attributes = new HashMap<>();
            attributes.put("order", order);
            attributes.put("newStatus", newStatus.name());
            mailSender.sendMessageHtml(order.getEmail(), subject, "order-status-update-template", attributes);
        } catch (Exception e) {
            log.error("[ORDER STATUS EMAIL FAILED] orderId={} | status={} | error={}", order.getId(), newStatus, e.getMessage());
        }
    }

    @Override
    @Transactional
    public String deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiRequestException(ORDER_NOT_FOUND, HttpStatus.NOT_FOUND));
        orderRepository.delete(order);
        return "Order deleted successfully";
    }

    @Override
    public DataFetcher<List<Order>> getAllOrdersByQuery() {
        return dataFetchingEnvironment -> orderRepository.findAllByOrderByIdAsc();
    }

    @Override
    public DataFetcher<List<Order>> getUserOrdersByEmailQuery() {
        return dataFetchingEnvironment -> {
            String email = dataFetchingEnvironment.getArgument("email").toString();
            return orderRepository.findOrderByEmail(email);
        };
    }
}
