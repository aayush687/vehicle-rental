package com.vehiclerental.service;

import com.vehiclerental.model.Admin;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final JdbcTemplate jdbcTemplate;

    public AdminService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Admin findByEmail(String email) {

        String sql = "SELECT id, name, email, password FROM admin WHERE email = ?";

        List<Admin> admins = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new Admin(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("password")
                ),
                email
        );

        if (admins.isEmpty()) {
            return null;
        }

        return admins.get(0);
    }
}