package com.drivesafe.rental.security;
public record RequestUser(Long agencyId, Long userId, String email, String role) {}
