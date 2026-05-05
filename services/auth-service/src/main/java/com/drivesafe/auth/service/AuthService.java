package com.drivesafe.auth.service;

import com.drivesafe.auth.api.AuthDtos.*;
import com.drivesafe.auth.domain.Agency;
import com.drivesafe.auth.domain.Role;
import com.drivesafe.auth.domain.UserAccount;
import com.drivesafe.auth.repository.AgencyRepository;
import com.drivesafe.auth.repository.UserAccountRepository;
import com.drivesafe.auth.security.CurrentUser;
import com.drivesafe.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {
    private final AgencyRepository agencyRepository;
    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AgencyRepository agencyRepository, UserAccountRepository userRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.agencyRepository = agencyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse registerAgency(RegisterAgencyRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
            throw new IllegalArgumentException("An account already exists for this email");
        }
        Agency agency = agencyRepository.save(new Agency(request.agencyName().trim()));
        UserAccount admin = userRepository.save(new UserAccount(
                agency.getId(), request.adminName().trim(), request.email().trim(),
                passwordEncoder.encode(request.password()), Role.ADMIN));
        return response(admin);
    }

    public AuthResponse login(LoginRequest request) {
        UserAccount user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return response(user);
    }

    @Transactional
    public UserResponse createEmployee(CreateEmployeeRequest request) {
        Long agencyId = CurrentUser.get().agencyId();
        if (userRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
            throw new IllegalArgumentException("An account already exists for this email");
        }
        UserAccount employee = userRepository.save(new UserAccount(
                agencyId, request.name().trim(), request.email().trim(),
                passwordEncoder.encode(request.password()), Role.EMPLOYEE));
        return new UserResponse(employee.getId(), employee.getName(), employee.getEmail(), employee.getRole());
    }

    public List<UserResponse> employees() {
        return userRepository.findAllByAgencyIdOrderByNameAsc(CurrentUser.get().agencyId()).stream()
                .map(user -> new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole()))
                .toList();
    }

    private AuthResponse response(UserAccount user) {
        String agencyName = agencyRepository.findById(user.getAgencyId()).map(Agency::getName).orElse("Agency");
        return new AuthResponse(jwtService.createToken(user), user.getAgencyId(), agencyName, user.getId(),
                user.getName(), user.getEmail(), user.getRole());
    }
}
