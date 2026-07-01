package com.perfume.ecommerce.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "inventory_logs")
public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "inventory_logs_seq")
    @SequenceGenerator(name = "inventory_logs_seq", sequenceName = "inventory_logs_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfume_id", nullable = false)
    private Perfume perfume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin; // Null if system action (e.g., successful order)

    @Column(name = "quantity_changed", nullable = false)
    private Integer quantityChanged;

    @Column(name = "type", nullable = false)
    private String type; // e.g., RESTOCK, RESERVE, RESTORE, MANUAL

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public InventoryLog() {
        this.createdAt = LocalDateTime.now();
    }
}
