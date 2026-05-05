package com.drivesafe.auth.api;

import com.drivesafe.auth.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterAgencyRequest(
            @NotBlank @Size(max = 120) String agencyName,
            @NotBlank @Size(max = 100) String adminName,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 72) String password) {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record AuthResponse(String token, Long agencyId, String agencyName, Long userId, String name, String email, Role role) {}

    public record CreateEmployeeRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 72) String password) {}

    public record UserResponse(Long id, String name, String email, Role role) {}
}
