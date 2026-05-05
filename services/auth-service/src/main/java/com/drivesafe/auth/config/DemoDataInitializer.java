package com.drivesafe.auth.config;

import com.drivesafe.auth.domain.Agency;
import com.drivesafe.auth.domain.Role;
import com.drivesafe.auth.domain.UserAccount;
import com.drivesafe.auth.repository.AgencyRepository;
import com.drivesafe.auth.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DemoDataInitializer implements ApplicationRunner {
    private final AgencyRepository agencies;
    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;
    private final boolean enabled;

    public DemoDataInitializer(AgencyRepository agencies, UserAccountRepository users, PasswordEncoder passwordEncoder,
                               @Value("${app.demo-data:false}") boolean enabled) {
        this.agencies = agencies;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.enabled = enabled;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!enabled || users.findByEmailIgnoreCase("demo@drivesafe.app").isPresent()) return;

        Agency agency = agencies.save(new Agency("Northline Rentals"));
        String password = passwordEncoder.encode("DriveSafe123!");
        users.save(new UserAccount(agency.getId(), "Maya Chen", "demo@drivesafe.app", password, Role.ADMIN));
        users.save(new UserAccount(agency.getId(), "Daniel Ortiz", "daniel@northlinerentals.com", passwordEncoder.encode("DriveSafe123!"), Role.EMPLOYEE));
        users.save(new UserAccount(agency.getId(), "Avery Patel", "avery@northlinerentals.com", passwordEncoder.encode("DriveSafe123!"), Role.EMPLOYEE));
    }
}
