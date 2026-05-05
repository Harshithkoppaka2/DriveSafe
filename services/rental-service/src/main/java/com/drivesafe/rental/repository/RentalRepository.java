package com.drivesafe.rental.repository;

import com.drivesafe.rental.domain.Rental;
import com.drivesafe.rental.domain.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findAllByAgencyIdOrderByCreatedAtDesc(Long agencyId);
    Optional<Rental> findByIdAndAgencyId(Long id, Long agencyId);
    List<Rental> findAllByAgencyIdAndVehicleIdAndStatusIn(
            Long agencyId,
            Long vehicleId,
            Collection<RentalStatus> statuses);
}
