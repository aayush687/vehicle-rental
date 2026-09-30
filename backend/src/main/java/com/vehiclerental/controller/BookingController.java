package com.vehiclerental.controller;

import com.vehiclerental.config.SessionUtil;
import com.vehiclerental.model.Booking;
import com.vehiclerental.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // admin gets every booking; a customer only gets their own
    @GetMapping
    public ResponseEntity<?> getBookings(HttpServletRequest request) {

        if (SessionUtil.role(request) == null) {
            return ResponseEntity.status(401).body("Please log in.");
        }

        List<Booking> all = bookingService.getAllBookings();

        if (SessionUtil.isAdmin(request)) {
            return ResponseEntity.ok(all);
        }

        int me = SessionUtil.userId(request);

        return ResponseEntity.ok(
                all.stream()
                        .filter(b -> b.getCustomerId() == me)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable long id,
                                        HttpServletRequest request) {

        if (SessionUtil.role(request) == null) {
            return ResponseEntity.status(401).body("Please log in.");
        }

        Booking booking = bookingService.getBookingById(id);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        if (!SessionUtil.isAdmin(request)
                && booking.getCustomerId() != SessionUtil.userId(request)) {
            return ResponseEntity.status(403).body("This is not your booking.");
        }

        return ResponseEntity.ok(booking);
    }

    @PostMapping
    public ResponseEntity<?> addBooking(@RequestBody Booking booking,
                                        HttpServletRequest request) {

        if (SessionUtil.role(request) == null) {
            return ResponseEntity.status(401).body("Please log in.");
        }

        // a customer can only book for themselves
        if (!SessionUtil.isAdmin(request)) {
            booking.setCustomerId(SessionUtil.userId(request));
        }

        return ResponseEntity.ok(bookingService.addBooking(booking));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable long id,
                                          @RequestParam String status,
                                          HttpServletRequest request) {

        if (SessionUtil.role(request) == null) {
            return ResponseEntity.status(401).body("Please log in.");
        }

        if (!SessionUtil.isAdmin(request)) {

            // customers may only cancel their own bookings
            Booking existing = bookingService.getBookingById(id);

            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            if (existing.getCustomerId() != SessionUtil.userId(request)
                    || !"cancelled".equalsIgnoreCase(status)) {
                return ResponseEntity.status(403).body("You are not allowed to do that.");
            }
        }

        Booking booking = bookingService.updateStatus(id, status);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable long id,
                                           HttpServletRequest request) {

        ResponseEntity<String> denied = SessionUtil.requireRole(request, "admin");
        if (denied != null) {
            return denied;
        }

        if (!bookingService.deleteBooking(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Booking deleted successfully.");
    }
}