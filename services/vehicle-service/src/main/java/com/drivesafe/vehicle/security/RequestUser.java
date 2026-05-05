package com.drivesafe.vehicle.security;
public record RequestUser(Long agencyId, Long userId, String email, String role) {}
