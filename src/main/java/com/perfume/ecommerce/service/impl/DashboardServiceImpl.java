package com.perfume.ecommerce.service.impl;

import com.perfume.ecommerce.domain.EmailHistory;
import com.perfume.ecommerce.domain.User;
import com.perfume.ecommerce.repository.EmailHistoryRepository;
import com.perfume.ecommerce.repository.OrderItemRepository;
import com.perfume.ecommerce.repository.OrderRepository;
import com.perfume.ecommerce.repository.PerfumeRepository;
import com.perfume.ecommerce.repository.UserRepository;
import com.perfume.ecommerce.service.DashboardService;
import com.perfume.ecommerce.service.email.MailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final PerfumeRepository perfumeRepository;
    private final UserRepository userRepository;
    private final MailSender mailSender;
    private final EmailHistoryRepository emailHistoryRepository;

    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate startOfMonth = today.withDayOfMonth(1);
        
        stats.put("dailyRevenue", orderRepository.sumRevenueByDate(today));
        stats.put("weeklyRevenue", orderRepository.sumRevenueByDateBetween(startOfWeek, today));
        stats.put("monthlyRevenue", orderRepository.sumRevenueByDateBetween(startOfMonth, today));
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalCustomers", userRepository.count());
        stats.put("totalProducts", perfumeRepository.count());
        stats.put("lowStockProducts", perfumeRepository.countLowStockProducts());
        
        return stats;
    }

    @Override
    public void sendPromotionalEmail(String subject, String message) {
        List<User> users = userRepository.findAll();
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("message", message);
        for (User user : users) {
            try {
                mailSender.sendMessageHtml(user.getEmail(), subject, "promo-template", attributes);
            } catch (Exception e) {
                // Ignore for now
            }
        }
        
        EmailHistory emailHistory = new EmailHistory();
        emailHistory.setSubject(subject);
        emailHistory.setBody(message);
        emailHistory.setTargetAudience("ALL_USERS");
        emailHistoryRepository.save(emailHistory);
    }
}
