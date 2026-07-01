package com.perfume.ecommerce.domain;

import com.perfume.ecommerce.enums.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "order_status_history")
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_status_history_seq")
    @SequenceGenerator(name = "order_status_history_seq", sequenceName = "order_status_history_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private OrderStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private OrderStatus newStatus;

    @Column(name = "admin_id")
    private Long adminId;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    public OrderStatusHistory() {
        this.changedAt = LocalDateTime.now();
    }
}
