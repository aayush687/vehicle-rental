package com.vehiclerental.service;

import com.vehiclerental.model.Admin;
import com.vehiclerental.model.Customer;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CustomerService customerService;
    private final AdminService adminService;

    public AuthService(CustomerService customerService,
                    AdminService adminService) {
        this.customerService = customerService;
        this.adminService = adminService;
    }

    public Customer register(String name, String email, String phone, String password) {

        if (customerService.findByEmail(email) != null) {
            return null;
        }

        Customer customer =
                new Customer(0, name, email, phone, password);

        return customerService.addCustomer(customer);
    }

    public Object login(String email, String password, String role) {

        // Admin login
        if ("admin".equalsIgnoreCase(role)) {

            Admin admin = adminService.findByEmail(email);

            if (admin != null &&
                    admin.getPassword().equals(password)) {
                return admin;
            }

            return null;
        }

        // Customer login
        Customer customer =
                customerService.findByEmail(email);

        if (customer != null &&
                customer.getPassword().equals(password)) {
            return customer;
        }

        return null;
    }
}