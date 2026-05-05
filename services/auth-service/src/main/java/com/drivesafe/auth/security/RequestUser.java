package com.drivesafe.auth.security;

import com.drivesafe.auth.domain.Role;

public record RequestUser(Long agencyId, Long userId, String email, Role role) {}
