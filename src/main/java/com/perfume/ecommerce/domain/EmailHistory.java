package com.perfume.ecommerce.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "email_history")
public class EmailHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "email_history_seq")
    @SequenceGenerator(name = "email_history_seq", sequenceName = "email_history_seq", allocationSize = 1)
    private Long id;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "body", columnDefinition = "TEXT")
    private String body;

    @Column(name = "target_audience")
    private String targetAudience;

    @Column(name = "sent_date", nullable = false)
    private LocalDateTime sentDate;

    public EmailHistory() {
        this.sentDate = LocalDateTime.now();
    }
}
