package com.drivesafe.rental.service;

import com.drivesafe.rental.domain.Rental;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class RentalDatePolicy {
    public void validateRange(LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Rental end date cannot be before start date");
        }
    }

    public boolean hasConflict(List<Rental> existingRentals,
                               Long excludedRentalId,
                               LocalDate requestedStart,
                               LocalDate requestedEnd) {
        return existingRentals.stream()
                .filter(rental -> excludedRentalId == null || !rental.getId().equals(excludedRentalId))
                .anyMatch(rental -> overlaps(
                        rental.getStartDate(),
                        rental.getEndDate(),
                        requestedStart,
                        requestedEnd));
    }

    boolean overlaps(LocalDate existingStart,
                     LocalDate existingEnd,
                     LocalDate requestedStart,
                     LocalDate requestedEnd) {
        return !existingStart.isAfter(requestedEnd)
                && !existingEnd.isBefore(requestedStart);
    }
}
