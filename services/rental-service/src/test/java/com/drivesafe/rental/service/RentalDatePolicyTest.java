package com.drivesafe.rental.service;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class RentalDatePolicyTest {
    private final RentalDatePolicy policy = new RentalDatePolicy();

    @Test
    void detectsOverlappingDates() {
        boolean overlaps = policy.overlaps(
                LocalDate.of(2026, 9, 6),
                LocalDate.of(2026, 9, 10),
                LocalDate.of(2026, 9, 1),
                LocalDate.of(2026, 9, 8));

        assertThat(overlaps).isTrue();
    }

    @Test
    void allowsDatesThatEndBeforeNextReservation() {
        boolean overlaps = policy.overlaps(
                LocalDate.of(2026, 9, 9),
                LocalDate.of(2026, 9, 10),
                LocalDate.of(2026, 9, 1),
                LocalDate.of(2026, 9, 8));

        assertThat(overlaps).isFalse();
    }
}
