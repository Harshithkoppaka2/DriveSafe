package com.drivesafe.vehicle.repository;

import com.drivesafe.vehicle.domain.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findAllByAgencyIdOrderByCreatedAtDesc(Long agencyId);
    Optional<Vehicle> findByIdAndAgencyId(Long id, Long agencyId);
    boolean existsByAgencyIdAndVinIgnoreCase(Long agencyId, String vin);
}
