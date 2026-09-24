package com.vehiclerental.service;

import com.vehiclerental.model.Booking;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final JdbcTemplate jdbcTemplate;

    public BookingService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Booking> getAllBookings() {

        String sql = """
                SELECT b.id,
                       c.name AS customer_name,
                       c.phone,
                       c.email,
                       v.name AS vehicle_name,
                       b.vehicle_id,
                       b.start_date,
                       b.end_date,
                       b.total,
                       b.status
                FROM bookings b
                JOIN customers c ON b.customer_id = c.id
                JOIN vehicle v ON b.vehicle_id = v.id
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            Booking booking = new Booking();

            booking.setId(rs.getLong("id"));
            booking.setCustomer(rs.getString("customer_name"));
            booking.setPhone(rs.getString("phone"));
            booking.setEmail(rs.getString("email"));
            booking.setVehicle(rs.getString("vehicle_name"));
            booking.setVehicleId(rs.getInt("vehicle_id"));
            booking.setStart(rs.getString("start_date"));
            booking.setEnd(rs.getString("end_date"));
            booking.setTotal(rs.getDouble("total"));
            booking.setStatus(rs.getString("status"));

            return booking;
        });
    }

    public Booking getBookingById(long id) {

        String sql = """
                SELECT b.id,
                       c.name AS customer_name,
                       c.phone,
                       c.email,
                       v.name AS vehicle_name,
                       b.vehicle_id,
                       b.start_date,
                       b.end_date,
                       b.total,
                       b.status
                FROM bookings b
                JOIN customers c ON b.customer_id = c.id
                JOIN vehicle v ON b.vehicle_id = v.id
                WHERE b.id = ?
                """;

        List<Booking> bookings = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {

                    Booking booking = new Booking();

                    booking.setId(rs.getLong("id"));
                    booking.setCustomer(rs.getString("customer_name"));
                    booking.setPhone(rs.getString("phone"));
                    booking.setEmail(rs.getString("email"));
                    booking.setVehicle(rs.getString("vehicle_name"));
                    booking.setVehicleId(rs.getInt("vehicle_id"));
                    booking.setStart(rs.getString("start_date"));
                    booking.setEnd(rs.getString("end_date"));
                    booking.setTotal(rs.getDouble("total"));
                    booking.setStatus(rs.getString("status"));

                    return booking;
                },
                id
        );

        if (bookings.isEmpty()) {
            return null;
        }

        return bookings.get(0);
    }

    public Booking addBooking(Booking booking) {

        String findCustomer = "SELECT id FROM customers WHERE email = ?";

        List<Integer> customerIds = jdbcTemplate.query(
                findCustomer,
                (rs, rowNum) -> rs.getInt("id"),
                booking.getEmail()
        );

        if (customerIds.isEmpty()) {
            return null;
        }

        int customerId = customerIds.get(0);

        if (booking.getStatus() == null ||
                booking.getStatus().isEmpty()) {
            booking.setStatus("pending");
        }

        String sql = """
                INSERT INTO bookings
                (customer_id, vehicle_id, start_date, end_date, total, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                customerId,
                booking.getVehicleId(),
                booking.getStart(),
                booking.getEnd(),
                booking.getTotal(),
                booking.getStatus()
        );

        String findId = "SELECT LAST_INSERT_ID()";

        long newId = jdbcTemplate.queryForObject(
                findId,
                Long.class
        );

        return getBookingById(newId);
    }

    public Booking updateStatus(long id, String status) {

        Booking booking = getBookingById(id);

        if (booking == null) {
            return null;
        }

        String sql = "UPDATE bookings SET status = ? WHERE id = ?";

        jdbcTemplate.update(sql, status, id);

        if (status.equalsIgnoreCase("confirmed")) {

            String vehicleSql =
                    "UPDATE vehicle SET status = 'Booked' WHERE id = ?";

            jdbcTemplate.update(
                    vehicleSql,
                    booking.getVehicleId()
            );

        } else if (status.equalsIgnoreCase("completed")
                || status.equalsIgnoreCase("cancelled")) {

            String vehicleSql =
                    "UPDATE vehicle SET status = 'Available' WHERE id = ?";

            jdbcTemplate.update(
                    vehicleSql,
                    booking.getVehicleId()
            );
        }

        return getBookingById(id);
    }

    public boolean deleteBooking(long id) {

        Booking booking = getBookingById(id);

        if (booking == null) {
            return false;
        }

        String sql = "DELETE FROM bookings WHERE id = ?";

        int rows = jdbcTemplate.update(sql, id);

        if (rows > 0 &&
                booking.getStatus().equalsIgnoreCase("confirmed")) {

            String vehicleSql =
                    "UPDATE vehicle SET status = 'Available' WHERE id = ?";

            jdbcTemplate.update(
                    vehicleSql,
                    booking.getVehicleId()
            );
        }

        return rows > 0;
    }
}