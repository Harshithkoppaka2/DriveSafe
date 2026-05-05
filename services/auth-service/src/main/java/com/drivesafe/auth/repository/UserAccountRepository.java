package com.drivesafe.auth.repository;

import com.drivesafe.auth.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    boolean existsByAgencyIdAndEmailIgnoreCase(Long agencyId, String email);
    List<UserAccount> findAllByAgencyIdOrderByNameAsc(Long agencyId);
}
