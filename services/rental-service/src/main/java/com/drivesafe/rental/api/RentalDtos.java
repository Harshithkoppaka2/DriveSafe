package com.drivesafe.rental.api;

import com.drivesafe.rental.domain.InspectionType;
import com.drivesafe.rental.domain.RentalStatus;
import jakarta.validation.constraints.*;
import java.time.*;

public final class RentalDtos {
    private RentalDtos() {}
    public record CreateRentalRequest(@NotNull Long vehicleId, @NotBlank @Size(max=100) String customerName,
                                      @NotBlank @Email String customerEmail, @NotNull LocalDate startDate, @NotNull LocalDate endDate) {}
    public record ExtendRentalRequest(@NotNull LocalDate requestedEndDate) {}
    public record RentalResponse(Long id, Long vehicleId, String customerName, String customerEmail,
                                 LocalDate startDate, LocalDate endDate, RentalStatus status) {}
    public record CreateInspectionRequest(@NotNull InspectionType type, @NotBlank @Size(max=500) String photoUrl,
                                          @Size(max=1000) String notes) {}
    public record InspectionResponse(Long id, Long rentalId, InspectionType type, String photoUrl, String notes, Instant createdAt) {}
    public record VehicleReadinessResponse(Long vehicleId, boolean rentable, String maintenanceStatus, int milesToService, String reason) {}
}
