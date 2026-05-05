package com.drivesafe.vehicle.api;

import com.drivesafe.vehicle.api.VehicleDtos.*;
import com.drivesafe.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleService service;
    public VehicleController(VehicleService service) { this.service = service; }

    @GetMapping public List<VehicleResponse> list() { return service.list(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse create(@Valid @RequestBody CreateVehicleRequest request) { return service.create(request); }
    @PutMapping("/{id}/mileage")
    public VehicleResponse mileage(@PathVariable Long id, @Valid @RequestBody UpdateMileageRequest request) { return service.updateMileage(id, request); }
    @PostMapping("/{id}/maintenance/oil-change")
    public VehicleResponse oilChange(@PathVariable Long id, @Valid @RequestBody RecordOilChangeRequest request) { return service.recordOilChange(id, request); }
    @GetMapping("/{id}/readiness")
    public VehicleReadinessResponse readiness(@PathVariable Long id) { return service.readiness(id); }
}
