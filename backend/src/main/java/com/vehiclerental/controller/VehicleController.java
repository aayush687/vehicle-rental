package com.vehiclerental.controller;

import com.vehiclerental.model.Vehicle;
import com.vehiclerental.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public List<Vehicle> getVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicle(@PathVariable int id) {

        Vehicle vehicle = vehicleService.getVehicleById(id);

        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(vehicle);
    }

    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable int id,
            @RequestBody Vehicle vehicle) {

        Vehicle updatedVehicle =
                vehicleService.updateVehicle(id, vehicle);

        if (updatedVehicle == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedVehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable int id) {

        if (!vehicleService.deleteVehicle(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Vehicle deleted successfully.");
    }
}
