package com.vehiclerental.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final JdbcTemplate jdbcTemplate;

    public DashboardService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getDashboardData() {

        Map<String, Object> data = new HashMap<>();

        Integer totalVehicles = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM vehicle",
                Integer.class
        );

        Integer availableVehicles = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM vehicle WHERE status = 'Available'",
                Integer.class
        );

        Integer bookedVehicles = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM vehicle WHERE status = 'Booked'",
                Integer.class
        );

        Integer totalCustomers = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM customers",
                Integer.class
        );

        Integer totalBookings = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM bookings",
                Integer.class
        );

        Integer pendingBookings = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM bookings WHERE status = 'pending'",
                Integer.class
        );

        Double totalPayments = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(amount), 0) FROM payment",
                Double.class
        );

        data.put("totalVehicles", totalVehicles);
        data.put("availableVehicles", availableVehicles);
        data.put("bookedVehicles", bookedVehicles);
        data.put("totalCustomers", totalCustomers);
        data.put("totalBookings", totalBookings);
        data.put("pendingBookings", pendingBookings);
        data.put("totalPayments", totalPayments);

        return data;
    }
}