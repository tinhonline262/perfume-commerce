package com.perfume.ecommerce.service;

import java.util.Map;

public interface DashboardService {
    Map<String, Object> getStatistics();
    void sendPromotionalEmail(String subject, String message);
}
