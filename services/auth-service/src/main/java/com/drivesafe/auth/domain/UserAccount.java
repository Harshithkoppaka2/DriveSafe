package com.drivesafe.auth.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class UserAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "agency_id", nullable = false)
    private Long agencyId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected UserAccount() {}

    public UserAccount(Long agencyId, String name, String email, String passwordHash, Role role) {
        this.agencyId = agencyId;
        this.name = name;
        this.email = email.toLowerCase();
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public Long getId() { return id; }
    public Long getAgencyId() { return agencyId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public Role getRole() { return role; }
    public Instant getCreatedAt() { return createdAt; }
}
