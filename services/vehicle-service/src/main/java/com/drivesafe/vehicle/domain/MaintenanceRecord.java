package com.drivesafe.vehicle.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "agency_id", nullable = false)
    private Long agencyId;
    @Column(nullable = false)
    private Long vehicleId;
    @Column(nullable = false, length = 40)
    private String serviceType;
    @Column(nullable = false)
    private Integer serviceMileage;
    @Column(nullable = false, updatable = false)
    private Instant recordedAt = Instant.now();

    protected MaintenanceRecord() {}
    public MaintenanceRecord(Long agencyId, Long vehicleId, String serviceType, Integer serviceMileage) {
        this.agencyId = agencyId;
        this.vehicleId = vehicleId;
        this.serviceType = serviceType;
        this.serviceMileage = serviceMileage;
    }
}
