package com.drivesafe.rental.domain;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "rentals")
public class Rental {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "agency_id", nullable = false)
    private Long agencyId;
    @Column(nullable = false)
    private Long vehicleId;
    @Column(nullable = false, length = 100)
    private String customerName;
    @Column(nullable = false, length = 180)
    private String customerEmail;
    @Column(nullable = false)
    private LocalDate startDate;
    @Column(nullable = false)
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RentalStatus status = RentalStatus.RESERVED;
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Rental() {}
    public Rental(Long agencyId, Long vehicleId, String customerName, String customerEmail, LocalDate startDate, LocalDate endDate) {
        this.agencyId = agencyId; this.vehicleId = vehicleId; this.customerName = customerName;
        this.customerEmail = customerEmail.toLowerCase(); this.startDate = startDate; this.endDate = endDate;
    }
    public Long getId() { return id; }
    public Long getAgencyId() { return agencyId; }
    public Long getVehicleId() { return vehicleId; }
    public String getCustomerName() { return customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public RentalStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public void extendTo(LocalDate requestedEndDate) { this.endDate = requestedEndDate; }
}
