package com.drivesafe.rental.repository;
import com.drivesafe.rental.domain.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface InspectionRepository extends JpaRepository<Inspection, Long> {
    List<Inspection> findAllByAgencyIdAndRentalIdOrderByCreatedAtAsc(Long agencyId, Long rentalId);
}
