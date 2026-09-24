package com.vehiclerental.service;

import com.vehiclerental.model.Booking;
import com.vehiclerental.model.Customer;
import com.vehiclerental.model.Vehicle;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataStore {

    private final List<Vehicle> vehicles = new ArrayList<>();
    private final List<Booking> bookings = new ArrayList<>();
    private final List<Customer> customers = new ArrayList<>();

    public DataStore() {

        vehicles.add(new Vehicle(
                1, "Hyundai Creta", "Car", "Hyundai",
                4500, "available", "images/HyundaiCreta.png",
                "2026-06-01", "Automatic", 5, 8.4
        ));

        vehicles.add(new Vehicle(
                2, "Honda City", "Car", "Honda",
                4000, "available", "images/hondacity.avif",
                "2026-05-20", "Manual", 5, 8.1
        ));

        vehicles.add(new Vehicle(
                3, "Yamaha FZ", "Bike", "Yamaha",
                1200, "booked", "images/yamahafz.jpg",
                "2026-04-15", "Manual", 2, 7.9
        ));

        vehicles.add(new Vehicle(
                4, "TVS Apache", "Bike", "TVS",
                1000, "available", "images/apache.png",
                "2026-03-10", "Manual", 2, 7.6
        ));

        vehicles.add(new Vehicle(
                5, "Toyota Hiace", "Van", "Toyota",
                8000, "maintenance", "images/hiace.webp",
                "2026-02-01", "Manual", 12, 8.0
        ));

        vehicles.add(new Vehicle(
                6, "Mahindra Scorpio", "Car", "Mahindra",
                5200, "available", "images/scorpio.jpg",
                "2026-07-05", "Manual", 7, 8.3
        ));

        vehicles.add(new Vehicle(
                7, "Bajaj Pulsar", "Bike", "Bajaj",
                900, "available", "images/pulsar.webp",
                "2026-01-12", "Manual", 2, 7.5
        ));

        vehicles.add(new Vehicle(
                8, "Suzuki Ertiga", "Car", "Suzuki",
                4700, "booked", "images/arrival.avif",
                "2026-08-01", "Automatic", 7, 8.2
        ));

        customers.add(new Customer(
                1, "Aayush Subedi", "aayush@gmail.com", "", "password"
        ));
    }

    public List<Vehicle> getVehicles() {
        return vehicles;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public List<Customer> getCustomers() {
        return customers;
    }
}
