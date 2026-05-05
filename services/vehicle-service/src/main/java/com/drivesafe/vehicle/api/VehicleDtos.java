package com.drivesafe.vehicle.api;

import com.drivesafe.vehicle.domain.MaintenanceStatus;
import com.drivesafe.vehicle.domain.VehicleAvailability;
import jakarta.validation.constraints.*;

public final class VehicleDtos {
    private VehicleDtos() {}

    public record CreateVehicleRequest(
            @NotBlank @Size(max = 40) String vin,
            @NotBlank @Size(max = 60) String make,
            @NotBlank @Size(max = 60) String model,
            @Min(1990) @Max(2100) int modelYear,
            @PositiveOrZero int currentMileage,
            @PositiveOrZero int lastOilChangeMileage,
            @Positive int serviceIntervalMiles) {}

    public record UpdateMileageRequest(@PositiveOrZero int currentMileage) {}
    public record RecordOilChangeRequest(@PositiveOrZero int serviceMileage) {}

    public record VehicleResponse(Long id, String vin, String make, String model, int modelYear,
                                  int currentMileage, int lastOilChangeMileage, int serviceIntervalMiles,
                                  int milesToService, MaintenanceStatus maintenanceStatus,
                                  VehicleAvailability availability, boolean rentable) {}

    public record VehicleReadinessResponse(Long vehicleId, boolean rentable, MaintenanceStatus maintenanceStatus,
                                           int milesToService, String reason) {}
}
