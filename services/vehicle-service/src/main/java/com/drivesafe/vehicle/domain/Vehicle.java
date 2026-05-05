package com.drivesafe.vehicle.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "vehicles", uniqueConstraints = @UniqueConstraint(columnNames = {"agency_id", "vin"}))
public class Vehicle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "agency_id", nullable = false)
    private Long agencyId;
    @Column(nullable = false, length = 40)
    private String vin;
    @Column(nullable = false, length = 60)
    private String make;
    @Column(nullable = false, length = 60)
    private String model;
    @Column(nullable = false)
    private Integer modelYear;
    @Column(nullable = false)
    private Integer currentMileage;
    @Column(nullable = false)
    private Integer lastOilChangeMileage;
    @Column(nullable = false)
    private Integer serviceIntervalMiles;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VehicleAvailability availability = VehicleAvailability.ACTIVE;
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Vehicle() {}

    public Vehicle(Long agencyId, String vin, String make, String model, Integer modelYear,
                   Integer currentMileage, Integer lastOilChangeMileage, Integer serviceIntervalMiles) {
        this.agencyId = agencyId;
        this.vin = vin.toUpperCase();
        this.make = make;
        this.model = model;
        this.modelYear = modelYear;
        this.currentMileage = currentMileage;
        this.lastOilChangeMileage = lastOilChangeMileage;
        this.serviceIntervalMiles = serviceIntervalMiles;
    }

    public Long getId() { return id; }
    public Long getAgencyId() { return agencyId; }
    public String getVin() { return vin; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public Integer getModelYear() { return modelYear; }
    public Integer getCurrentMileage() { return currentMileage; }
    public Integer getLastOilChangeMileage() { return lastOilChangeMileage; }
    public Integer getServiceIntervalMiles() { return serviceIntervalMiles; }
    public VehicleAvailability getAvailability() { return availability; }
    public Instant getCreatedAt() { return createdAt; }

    public void updateMileage(int mileage) { this.currentMileage = mileage; }
    public void recordOilChange(int mileage) { this.lastOilChangeMileage = mileage; }
    public void setAvailability(VehicleAvailability availability) { this.availability = availability; }
}
