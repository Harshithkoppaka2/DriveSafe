package com.drivesafe.rental.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inspections")
public class Inspection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "agency_id", nullable = false)
    private Long agencyId;
    @Column(nullable = false)
    private Long rentalId;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InspectionType type;
    @Column(nullable = false, length = 500)
    private String photoUrl;
    @Column(length = 1000)
    private String notes;
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Inspection() {}
    public Inspection(Long agencyId, Long rentalId, InspectionType type, String photoUrl, String notes) {
        this.agencyId = agencyId; this.rentalId = rentalId; this.type = type; this.photoUrl = photoUrl; this.notes = notes;
    }
    public Long getId() { return id; }
    public Long getRentalId() { return rentalId; }
    public InspectionType getType() { return type; }
    public String getPhotoUrl() { return photoUrl; }
    public String getNotes() { return notes; }
    public Instant getCreatedAt() { return createdAt; }
}
