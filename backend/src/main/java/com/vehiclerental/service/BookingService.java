package com.vehiclerental.service;

import com.vehiclerental.model.Booking;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

private final JdbcTemplate jdbcTemplate;

public BookingService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
}


@Scheduled(fixedRate = 60000)
public void automaticallyCompleteExpiredBookings() {

        String findExpiredBookings = """
                SELECT id, vehicle_id
                FROM bookings
                WHERE LOWER(status) = 'confirmed'
                AND end_date <= CURDATE()
                """;

        List<ExpiredBooking> expiredBookings =
                jdbcTemplate.query(
                        findExpiredBookings,
                        (rs, rowNum) ->
                                new ExpiredBooking(
                                        rs.getLong("id"),
                                        rs.getInt("vehicle_id")
                                )
                );


        for (ExpiredBooking booking : expiredBookings) {

            // Change booking to completed
            String bookingSql = """
                    UPDATE bookings
                    SET status = 'completed'
                    WHERE id = ?
                    AND LOWER(status) = 'confirmed'
                    """;

            jdbcTemplate.update(
                    bookingSql,
                    booking.id()
            );


            // Change vehicle to maintenance
            String vehicleSql = """
                    UPDATE vehicle
                    SET status = 'maintenance'
                    WHERE id = ?
                    """;

            jdbcTemplate.update(
                    vehicleSql,
                    booking.vehicleId()
            );
        }


        if (!expiredBookings.isEmpty()) {

            System.out.println(
                    expiredBookings.size()
                    + " expired booking(s) automatically completed."
            );
        }
    }


    /*
     * =========================================
     * SMALL RECORD FOR EXPIRED BOOKINGS
     * =========================================
     */

    private record ExpiredBooking(
            long id,
            int vehicleId
    ) {
    }


    /*
     * =========================================
     * GET ALL BOOKINGS
     * =========================================
     */

    public List<Booking> getAllBookings() {

        // Check expired bookings before returning data
        automaticallyCompleteExpiredBookings();


        String sql = """
                SELECT b.id,
                       b.customer_id,
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
                ORDER BY b.id DESC
                """;


        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {

                    Booking booking = new Booking();


                    booking.setId(
                            rs.getLong("id")
                    );


                    // Customer ID
                    booking.setCustomerId(
                            rs.getInt("customer_id")
                    );


                    booking.setCustomer(
                            rs.getString("customer_name")
                    );


                    booking.setPhone(
                            rs.getString("phone")
                    );


                    booking.setEmail(
                            rs.getString("email")
                    );


                    booking.setVehicle(
                            rs.getString("vehicle_name")
                    );


                    booking.setVehicleId(
                            rs.getInt("vehicle_id")
                    );


                    booking.setStart(
                            rs.getString("start_date")
                    );


                    booking.setEnd(
                            rs.getString("end_date")
                    );


                    booking.setTotal(
                            rs.getDouble("total")
                    );


                    booking.setStatus(
                            rs.getString("status")
                    );


                    return booking;
                }
        );
    }


    /*
     * =========================================
     * GET BOOKING BY ID
     * =========================================
     */

    public Booking getBookingById(long id) {

        // Check expired bookings
        automaticallyCompleteExpiredBookings();


        String sql = """
                SELECT b.id,
                       b.customer_id,
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


        List<Booking> bookings =
                jdbcTemplate.query(
                        sql,
                        (rs, rowNum) -> {

                            Booking booking =
                                    new Booking();


                            booking.setId(
                                    rs.getLong("id")
                            );


                            // Customer ID
                            booking.setCustomerId(
                                    rs.getInt("customer_id")
                            );


                            booking.setCustomer(
                                    rs.getString(
                                            "customer_name"
                                    )
                            );


                            booking.setPhone(
                                    rs.getString("phone")
                            );


                            booking.setEmail(
                                    rs.getString("email")
                            );


                            booking.setVehicle(
                                    rs.getString("vehicle_name")
                            );


                            booking.setVehicleId(
                                    rs.getInt("vehicle_id")
                            );


                            booking.setStart(
                                    rs.getString("start_date")
                            );


                            booking.setEnd(
                                    rs.getString("end_date")
                            );


                            booking.setTotal(
                                    rs.getDouble("total")
                            );


                            booking.setStatus(
                                    rs.getString("status")
                            );


                            return booking;
                        },
                        id
                );


        if (bookings.isEmpty()) {
            return null;
        }


        return bookings.get(0);
    }


    /*
     * =========================================
     * ADD BOOKING
     * =========================================
     */

    public Booking addBooking(Booking booking) {

        /*
         * Find customer using email.
         */
        String findCustomer =
                "SELECT id FROM customers WHERE email = ?";


        List<Integer> customerIds =
                jdbcTemplate.query(
                        findCustomer,
                        (rs, rowNum) ->
                                rs.getInt("id"),
                        booking.getEmail()
                );


        if (customerIds.isEmpty()) {

            return null;
        }


        int customerId =
                customerIds.get(0);


        /*
         * Store customer ID in the Java object.
         */
        booking.setCustomerId(customerId);


        /*
         * New bookings are pending.
         */
        if (booking.getStatus() == null ||
                booking.getStatus().trim().isEmpty()) {

            booking.setStatus("pending");
        }


        String sql = """
                INSERT INTO bookings
                (customer_id, vehicle_id, start_date,
                 end_date, total, status)
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


        /*
         * Get newly created booking ID.
         */
        String findId =
                "SELECT LAST_INSERT_ID()";


        Long newId =
                jdbcTemplate.queryForObject(
                        findId,
                        Long.class
                );


        return getBookingById(newId);
    }


    /*
     * =========================================
     * UPDATE BOOKING STATUS
     * =========================================
     */

    public Booking updateStatus(
            long id,
            String status) {


        Booking booking =
                getBookingById(id);


        if (booking == null) {

            return null;
        }


        if (status == null ||
                status.trim().isEmpty()) {

            return booking;
        }


        String newStatus =
                status.trim().toLowerCase();


        /*
         * Update booking status.
         */
        String sql =
                "UPDATE bookings SET status = ? WHERE id = ?";


        jdbcTemplate.update(
                sql,
                newStatus,
                id
        );


        /*
         * =====================================
         * CONFIRMED
         * =====================================
         *
         * Booking:
         * pending -> confirmed
         *
         * Vehicle:
         * available -> booked
         */

        if (newStatus.equals("confirmed")) {

            String vehicleSql = """
                    UPDATE vehicle
                    SET status = 'booked'
                    WHERE id = ?
                    """;


            jdbcTemplate.update(
                    vehicleSql,
                    booking.getVehicleId()
            );
        }


        /*
         * =====================================
         * COMPLETED
         * =====================================
         *
         * Booking:
         * confirmed -> completed
         *
         * Vehicle:
         * booked -> maintenance
         */

        else if (newStatus.equals("completed")) {

            String vehicleSql = """
                    UPDATE vehicle
                    SET status = 'maintenance'
                    WHERE id = ?
                    """;


            jdbcTemplate.update(
                    vehicleSql,
                    booking.getVehicleId()
            );
        }


        /*
         * =====================================
         * CANCELLED
         * =====================================
         *
         * Booking:
         * confirmed -> cancelled
         *
         * Vehicle:
         * booked -> available
         */

        else if (newStatus.equals("cancelled")) {

            String vehicleSql = """
                    UPDATE vehicle
                    SET status = 'available'
                    WHERE id = ?
                    """;


            jdbcTemplate.update(
                    vehicleSql,
                    booking.getVehicleId()
            );
        }


        /*
         * Return updated booking.
         */
        return getBookingById(id);
    }


    /*
     * =========================================
     * DELETE BOOKING
     * =========================================
     */

    public boolean deleteBooking(long id) {

        Booking booking =
                getBookingById(id);


        if (booking == null) {

            return false;
        }


        String sql =
                "DELETE FROM bookings WHERE id = ?";


        int rows =
                jdbcTemplate.update(
                        sql,
                        id
                );


        /*
         * If confirmed booking is deleted,
         * make vehicle available again.
         */

        if (rows > 0 &&
                booking.getStatus()
                        .equalsIgnoreCase("confirmed")) {

            String vehicleSql = """
                    UPDATE vehicle
                    SET status = 'available'
                    WHERE id = ?
                    """;


            jdbcTemplate.update(
                    vehicleSql,
                    booking.getVehicleId()
            );
        }


        return rows > 0;
    }
}