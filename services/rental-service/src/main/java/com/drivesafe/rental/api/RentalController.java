package com.drivesafe.rental.api;

import com.drivesafe.rental.api.RentalDtos.*;
import com.drivesafe.rental.service.RentalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {
    private final RentalService service;
    public RentalController(RentalService service) { this.service = service; }

    @GetMapping public List<RentalResponse> list() { return service.list(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public RentalResponse create(@Valid @RequestBody CreateRentalRequest request, @RequestHeader("Authorization") String authorization) {
        return service.create(request, authorization);
    }
    @PutMapping("/{id}/extend")
    public RentalResponse extend(@PathVariable Long id, @Valid @RequestBody ExtendRentalRequest request) { return service.extend(id, request); }
    @PostMapping("/{id}/inspections") @ResponseStatus(HttpStatus.CREATED)
    public InspectionResponse inspect(@PathVariable Long id, @Valid @RequestBody CreateInspectionRequest request) { return service.addInspection(id, request); }
    @GetMapping("/{id}/inspections")
    public List<InspectionResponse> inspections(@PathVariable Long id) { return service.inspections(id); }
}
