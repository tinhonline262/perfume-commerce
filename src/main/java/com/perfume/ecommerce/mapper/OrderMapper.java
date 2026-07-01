package com.perfume.ecommerce.mapper;

import com.perfume.ecommerce.domain.Order;
import com.perfume.ecommerce.dto.HeaderResponse;
import com.perfume.ecommerce.dto.order.OrderItemResponse;
import com.perfume.ecommerce.dto.order.OrderRequest;
import com.perfume.ecommerce.dto.order.OrderResponse;
import com.perfume.ecommerce.dto.order.UpdateOrderStatusRequest;
import com.perfume.ecommerce.enums.PaymentMethod;
import com.perfume.ecommerce.enums.PaymentStatus;
import com.perfume.ecommerce.exception.ApiRequestException;
import com.perfume.ecommerce.exception.InputFieldException;
import com.perfume.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final CommonMapper commonMapper;
    private final OrderService orderService;
    
    public OrderResponse getOrderById(Long orderId) {
        return commonMapper.convertToResponse(orderService.getOrderById(orderId), OrderResponse.class);
    }
    
    public List<OrderItemResponse> getOrderItemsByOrderId(Long orderId) {
        return commonMapper.convertToResponseList(orderService.getOrderItemsByOrderId(orderId), OrderItemResponse.class);
    }

    public HeaderResponse<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return commonMapper.getHeaderResponse(orders.getContent(), orders.getTotalPages(), orders.getTotalElements(), OrderResponse.class);
    }

    public HeaderResponse<OrderResponse> getUserOrders(String email, Pageable pageable) {
        Page<Order> orders = orderService.getUserOrders(email, pageable);
        return commonMapper.getHeaderResponse(orders.getContent(), orders.getTotalPages(), orders.getTotalElements(), OrderResponse.class);
    }

    public String deleteOrder(Long orderId) {
        return orderService.deleteOrder(orderId);
    }

    public OrderResponse postOrder(OrderRequest orderRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new InputFieldException(bindingResult);
        }
        Order orderEntity = commonMapper.convertToEntity(orderRequest, Order.class);
        if (orderRequest.getPaymentMethod() != null) {
            try {
                orderEntity.setPaymentMethod(PaymentMethod.valueOf(orderRequest.getPaymentMethod().toUpperCase()));
            } catch (IllegalArgumentException e) {
                orderEntity.setPaymentMethod(PaymentMethod.COD);
            }
        }
        Order order = orderService.postOrder(orderEntity, orderRequest.getPerfumesId());
        return commonMapper.convertToResponse(order, OrderResponse.class);
    }

    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, Long adminId) {
        com.perfume.ecommerce.enums.OrderStatus newStatus;
        try {
            newStatus = com.perfume.ecommerce.enums.OrderStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiRequestException("Invalid status value: " + request.getStatus(), HttpStatus.BAD_REQUEST);
        }
        Order updated = orderService.updateOrderStatus(orderId, newStatus, adminId);
        return commonMapper.convertToResponse(updated, OrderResponse.class);
    }
}
