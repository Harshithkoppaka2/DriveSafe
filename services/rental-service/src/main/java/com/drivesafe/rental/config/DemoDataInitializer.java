package com.drivesafe.rental.config;

import com.drivesafe.rental.domain.Inspection;
import com.drivesafe.rental.domain.InspectionType;
import com.drivesafe.rental.domain.Rental;
import com.drivesafe.rental.repository.InspectionRepository;
import com.drivesafe.rental.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class DemoDataInitializer implements ApplicationRunner {
    private final RentalRepository rentals;
    private final InspectionRepository inspections;
    private final boolean enabled;

    public DemoDataInitializer(RentalRepository rentals, InspectionRepository inspections,
                               @Value("${app.demo-data:false}") boolean enabled) {
        this.rentals = rentals;
        this.inspections = inspections;
        this.enabled = enabled;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        long agencyId = 1L;
        if (!enabled || !rentals.findAllByAgencyIdOrderByCreatedAtDesc(agencyId).isEmpty()) return;

        LocalDate today = LocalDate.now();
        Rental activeOne = rentals.save(new Rental(agencyId, 1L, "Jordan Lee", "jordan.lee@example.com", today.minusDays(1), today.plusDays(2)));
        Rental activeTwo = rentals.save(new Rental(agencyId, 3L, "Sofia Martinez", "sofia.m@example.com", today, today.plusDays(4)));
        Rental upcomingOne = rentals.save(new Rental(agencyId, 7L, "Marcus Reed", "marcus.reed@example.com", today.plusDays(2), today.plusDays(6)));
        Rental upcomingTwo = rentals.save(new Rental(agencyId, 8L, "Priya Shah", "priya.shah@example.com", today.plusDays(5), today.plusDays(8)));
        Rental completed = rentals.save(new Rental(agencyId, 5L, "Noah Williams", "noah.w@example.com", today.minusDays(9), today.minusDays(5)));

        inspections.saveAll(List.of(
                new Inspection(agencyId, activeOne.getId(), InspectionType.PICKUP,
                        "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80",
                        "Walk-around complete. Small paint chip on the lower passenger-side bumper."),
                new Inspection(agencyId, activeTwo.getId(), InspectionType.PICKUP,
                        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
                        "No exterior damage noted. Fuel level and mileage verified at pickup."),
                new Inspection(agencyId, completed.getId(), InspectionType.PICKUP,
                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
                        "Existing curb rash on front-right wheel documented before handoff."),
                new Inspection(agencyId, completed.getId(), InspectionType.RETURN,
                        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
                        "Return inspection matched pickup condition. No new damage observed.")
        ));
    }
}
