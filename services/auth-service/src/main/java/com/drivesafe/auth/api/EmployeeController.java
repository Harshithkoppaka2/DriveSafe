package com.drivesafe.auth.api;

import com.drivesafe.auth.api.AuthDtos.CreateEmployeeRequest;
import com.drivesafe.auth.api.AuthDtos.UserResponse;
import com.drivesafe.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeController {
    private final AuthService authService;

    public EmployeeController(AuthService authService) { this.authService = authService; }

    @GetMapping
    public List<UserResponse> list() { return authService.employees(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody CreateEmployeeRequest request) {
        return authService.createEmployee(request);
    }
}
