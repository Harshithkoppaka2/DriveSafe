package com.drivesafe.auth.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "agencies")
public class Agency {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Agency() {}

    public Agency(String name) { this.name = name; }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Instant getCreatedAt() { return createdAt; }
}
