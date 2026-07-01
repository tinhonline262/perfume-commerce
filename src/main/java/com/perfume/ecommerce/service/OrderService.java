package com.perfume.ecommerce.service;

import com.perfume.ecommerce.domain.Order;
import com.perfume.ecommerce.domain.OrderItem;
import com.perfume.ecommerce.enums.PaymentStatus;
import graphql.schema.DataFetcher;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    Order getOrderById(Long orderId);

    List<OrderItem> getOrderItemsByOrderId(Long orderId);
    
    Page<Order> getAllOrders(Pageable pageable);

    Page<Order> getUserOrders(String email, Pageable pageable);

    Order postOrder(Order validOrder, Map<Long, Long> perfumesId);

    Order updateOrderStatus(Long orderId, com.perfume.ecommerce.enums.OrderStatus newStatus, Long adminId);

    String deleteOrder(Long orderId);

    DataFetcher<List<Order>> getAllOrdersByQuery();

    DataFetcher<List<Order>> getUserOrdersByEmailQuery();
}
