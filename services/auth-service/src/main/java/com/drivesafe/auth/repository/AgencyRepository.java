package com.drivesafe.auth.repository;

import com.drivesafe.auth.domain.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgencyRepository extends JpaRepository<Agency, Long> {}
