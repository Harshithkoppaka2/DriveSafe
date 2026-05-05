package com.drivesafe.vehicle.service;

import com.drivesafe.vehicle.api.VehicleDtos.*;
import com.drivesafe.vehicle.domain.*;
import com.drivesafe.vehicle.repository.MaintenanceRecordRepository;
import com.drivesafe.vehicle.repository.VehicleRepository;
import com.drivesafe.vehicle.security.CurrentUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository vehicles;
    private final MaintenanceRecordRepository maintenanceRecords;
    private final MaintenancePolicy maintenancePolicy;

    public VehicleService(VehicleRepository vehicles, MaintenanceRecordRepository maintenanceRecords, MaintenancePolicy maintenancePolicy) {
        this.vehicles = vehicles;
        this.maintenanceRecords = maintenanceRecords;
        this.maintenancePolicy = maintenancePolicy;
    }

    public List<VehicleResponse> list() {
        return vehicles.findAllByAgencyIdOrderByCreatedAtDesc(CurrentUser.get().agencyId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public VehicleResponse create(CreateVehicleRequest request) {
        Long agencyId = CurrentUser.get().agencyId();
        if (request.lastOilChangeMileage() > request.currentMileage()) {
            throw new IllegalArgumentException("Last oil-change mileage cannot exceed current mileage");
        }
        if (vehicles.existsByAgencyIdAndVinIgnoreCase(agencyId, request.vin())) {
            throw new IllegalArgumentException("A vehicle with this VIN already exists in your agency");
        }
        Vehicle vehicle = new Vehicle(agencyId, request.vin().trim(), request.make().trim(), request.model().trim(),
                request.modelYear(), request.currentMileage(), request.lastOilChangeMileage(), request.serviceIntervalMiles());
        return toResponse(vehicles.save(vehicle));
    }

    @Transactional
    public VehicleResponse updateMileage(Long id, UpdateMileageRequest request) {
        Vehicle vehicle = get(id);
        if (request.currentMileage() < vehicle.getCurrentMileage()) {
            throw new IllegalArgumentException("Current mileage cannot move backwards");
        }
        vehicle.updateMileage(request.currentMileage());
        return toResponse(vehicle);
    }

    @Transactional
    public VehicleResponse recordOilChange(Long id, RecordOilChangeRequest request) {
        Vehicle vehicle = get(id);
        if (request.serviceMileage() > vehicle.getCurrentMileage()) {
            throw new IllegalArgumentException("Service mileage cannot exceed current mileage");
        }
        vehicle.recordOilChange(request.serviceMileage());
        maintenanceRecords.save(new MaintenanceRecord(vehicle.getAgencyId(), vehicle.getId(), "ENGINE_OIL", request.serviceMileage()));
        return toResponse(vehicle);
    }

    public VehicleReadinessResponse readiness(Long id) {
        Vehicle vehicle = get(id);
        MaintenancePolicy.Snapshot snapshot = maintenancePolicy.evaluate(vehicle.getCurrentMileage(), vehicle.getLastOilChangeMileage(), vehicle.getServiceIntervalMiles());
        boolean rentable = vehicle.getAvailability() == VehicleAvailability.ACTIVE && snapshot.status() != MaintenanceStatus.OVERDUE;
        String reason = rentable ? "Vehicle is ready for rental" :
                snapshot.status() == MaintenanceStatus.OVERDUE ? "Engine-oil service is overdue" : "Vehicle is out of service";
        return new VehicleReadinessResponse(vehicle.getId(), rentable, snapshot.status(), snapshot.milesToService(), reason);
    }

    private Vehicle get(Long id) {
        return vehicles.findByIdAndAgencyId(id, CurrentUser.get().agencyId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        MaintenancePolicy.Snapshot snapshot = maintenancePolicy.evaluate(vehicle.getCurrentMileage(), vehicle.getLastOilChangeMileage(), vehicle.getServiceIntervalMiles());
        boolean rentable = vehicle.getAvailability() == VehicleAvailability.ACTIVE && snapshot.status() != MaintenanceStatus.OVERDUE;
        return new VehicleResponse(vehicle.getId(), vehicle.getVin(), vehicle.getMake(), vehicle.getModel(), vehicle.getModelYear(),
                vehicle.getCurrentMileage(), vehicle.getLastOilChangeMileage(), vehicle.getServiceIntervalMiles(), snapshot.milesToService(),
                snapshot.status(), vehicle.getAvailability(), rentable);
    }
}
