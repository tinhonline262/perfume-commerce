package com.perfume.ecommerce.repository;

import com.perfume.ecommerce.domain.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByIdAsc();

    Page<Order> findAllByOrderByIdAsc(Pageable pageable);

    List<Order> findOrderByEmail(String email);

    Page<Order> findOrderByEmail(String email, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.date = :date")
    Double sumRevenueByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.date BETWEEN :startDate AND :endDate")
    Double sumRevenueByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.date = :date")
    Long countByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.date BETWEEN :startDate AND :endDate")
    Long countByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
