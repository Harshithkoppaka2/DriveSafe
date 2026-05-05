package com.drivesafe.vehicle.config;

import com.drivesafe.vehicle.domain.MaintenanceRecord;
import com.drivesafe.vehicle.domain.Vehicle;
import com.drivesafe.vehicle.repository.MaintenanceRecordRepository;
import com.drivesafe.vehicle.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DemoDataInitializer implements ApplicationRunner {
    private final VehicleRepository vehicles;
    private final MaintenanceRecordRepository maintenanceRecords;
    private final boolean enabled;

    public DemoDataInitializer(VehicleRepository vehicles, MaintenanceRecordRepository maintenanceRecords,
                               @Value("${app.demo-data:false}") boolean enabled) {
        this.vehicles = vehicles;
        this.maintenanceRecords = maintenanceRecords;
        this.enabled = enabled;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        long agencyId = 1L;
        if (!enabled || !vehicles.findAllByAgencyIdOrderByCreatedAtDesc(agencyId).isEmpty()) return;

        List<Vehicle> demoVehicles = List.of(
                new Vehicle(agencyId, "1HGCM82633A004352", "Toyota", "Camry", 2023, 48210, 45000, 5000),
                new Vehicle(agencyId, "2T1BURHE5JC078214", "Honda", "Accord", 2022, 61340, 56500, 5000),
                new Vehicle(agencyId, "3FA6P0H73KR154902", "Nissan", "Rogue", 2024, 21980, 18500, 5000),
                new Vehicle(agencyId, "1C4RJFBG8LC284512", "Jeep", "Grand Cherokee", 2022, 55820, 50000, 5000),
                new Vehicle(agencyId, "5YJ3E1EA7KF317620", "Hyundai", "Elantra", 2023, 37420, 33000, 5000),
                new Vehicle(agencyId, "1FMCU0F73MUA45822", "Ford", "Escape", 2021, 71220, 66200, 5000),
                new Vehicle(agencyId, "KL8CD6SA8MC702184", "Chevrolet", "Malibu", 2022, 44610, 41000, 5000),
                new Vehicle(agencyId, "JTMZFREV1JJ145870", "Toyota", "RAV4", 2024, 16440, 14000, 5000)
        );
        List<Vehicle> saved = vehicles.saveAll(demoVehicles);
        for (Vehicle vehicle : saved) {
            maintenanceRecords.save(new MaintenanceRecord(agencyId, vehicle.getId(), "ENGINE_OIL", vehicle.getLastOilChangeMileage()));
        }
    }
}
