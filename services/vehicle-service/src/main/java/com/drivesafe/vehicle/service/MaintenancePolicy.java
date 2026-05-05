package com.drivesafe.vehicle.service;

import com.drivesafe.vehicle.domain.MaintenanceStatus;
import org.springframework.stereotype.Component;

@Component
public class MaintenancePolicy {
    public record Snapshot(MaintenanceStatus status, int milesToService) {}

    public Snapshot evaluate(int currentMileage, int lastOilChangeMileage, int serviceIntervalMiles) {
        if (currentMileage < 0 || lastOilChangeMileage < 0 || serviceIntervalMiles <= 0) {
            throw new IllegalArgumentException("Mileage values must be valid positive numbers");
        }
        int milesToService = lastOilChangeMileage + serviceIntervalMiles - currentMileage;
        if (milesToService < 0) return new Snapshot(MaintenanceStatus.OVERDUE, milesToService);
        if (milesToService <= 500) return new Snapshot(MaintenanceStatus.DUE_SOON, milesToService);
        return new Snapshot(MaintenanceStatus.READY, milesToService);
    }
}
