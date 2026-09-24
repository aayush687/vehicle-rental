package com.vehiclerental.service;

import com.vehiclerental.model.Vehicle;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final JdbcTemplate jdbcTemplate;

    public VehicleService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Vehicle> getAllVehicles() {

        String sql = "SELECT id, name, type, price, status FROM vehicle";

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    Vehicle vehicle = new Vehicle();

                    vehicle.setId(rs.getInt("id"));
                    vehicle.setName(rs.getString("name"));
                    vehicle.setCategory(rs.getString("type"));
                    vehicle.setPricePerDay(rs.getDouble("price"));
                    vehicle.setStatus(rs.getString("status"));

                    return vehicle;
                }
        );
    }

    public Vehicle getVehicleById(int id) {

        String sql = "SELECT id, name, type, price, status " +
                     "FROM vehicle WHERE id = ?";

        List<Vehicle> vehicles = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    Vehicle vehicle = new Vehicle();

                    vehicle.setId(rs.getInt("id"));
                    vehicle.setName(rs.getString("name"));
                    vehicle.setCategory(rs.getString("type"));
                    vehicle.setPricePerDay(rs.getDouble("price"));
                    vehicle.setStatus(rs.getString("status"));

                    return vehicle;
                },
                id
        );

        if (vehicles.isEmpty()) {
            return null;
        }

        return vehicles.get(0);
    }

    public Vehicle addVehicle(Vehicle vehicle) {

        String sql = "INSERT INTO vehicle (name, type, price, status) " +
                     "VALUES (?, ?, ?, ?)";

        jdbcTemplate.update(
                sql,
                vehicle.getName(),
                vehicle.getCategory(),
                vehicle.getPricePerDay(),
                vehicle.getStatus()
        );

        String findSql = "SELECT id, name, type, price, status " +
                         "FROM vehicle WHERE id = LAST_INSERT_ID()";

        return jdbcTemplate.queryForObject(
                findSql,
                (rs, rowNum) -> {
                    Vehicle newVehicle = new Vehicle();

                    newVehicle.setId(rs.getInt("id"));
                    newVehicle.setName(rs.getString("name"));
                    newVehicle.setCategory(rs.getString("type"));
                    newVehicle.setPricePerDay(rs.getDouble("price"));
                    newVehicle.setStatus(rs.getString("status"));

                    return newVehicle;
                }
        );
    }

    public Vehicle updateVehicle(int id, Vehicle newVehicle) {

        String sql = "UPDATE vehicle SET name = ?, type = ?, price = ?, status = ? " +
                     "WHERE id = ?";

        int rows = jdbcTemplate.update(
                sql,
                newVehicle.getName(),
                newVehicle.getCategory(),
                newVehicle.getPricePerDay(),
                newVehicle.getStatus(),
                id
        );

        if (rows == 0) {
            return null;
        }

        return getVehicleById(id);
    }

    public boolean deleteVehicle(int id) {

        String sql = "DELETE FROM vehicle WHERE id = ?";

        int rows = jdbcTemplate.update(sql, id);

        return rows > 0;
    }
}