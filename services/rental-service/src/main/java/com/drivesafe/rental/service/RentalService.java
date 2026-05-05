package com.drivesafe.rental.service;

import com.drivesafe.rental.api.RentalDtos.*;
import com.drivesafe.rental.domain.*;
import com.drivesafe.rental.repository.*;
import com.drivesafe.rental.security.CurrentUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class RentalService {
    private static final Set<RentalStatus> BLOCKING_STATUSES = EnumSet.of(RentalStatus.RESERVED, RentalStatus.ACTIVE);

    private final RentalRepository rentals;
    private final InspectionRepository inspections;
    private final VehicleClient vehicleClient;
    private final RentalDatePolicy rentalDatePolicy;

    public RentalService(RentalRepository rentals, InspectionRepository inspections, VehicleClient vehicleClient, RentalDatePolicy rentalDatePolicy) {
        this.rentals = rentals;
        this.inspections = inspections;
        this.vehicleClient = vehicleClient;
        this.rentalDatePolicy = rentalDatePolicy;
    }

    public List<RentalResponse> list() {
        return rentals.findAllByAgencyIdOrderByCreatedAtDesc(CurrentUser.get().agencyId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public RentalResponse create(CreateRentalRequest request, String authorization) {
        rentalDatePolicy.validateRange(request.startDate(), request.endDate());
        var readiness = vehicleClient.readiness(request.vehicleId(), authorization);
        if (readiness == null || !readiness.rentable()) {
            String reason = readiness == null ? "Vehicle is not available" : readiness.reason();
            throw new IllegalArgumentException("Vehicle cannot be assigned: " + reason);
        }
        Long agencyId = CurrentUser.get().agencyId();
        var existingRentals = rentals.findAllByAgencyIdAndVehicleIdAndStatusIn(agencyId, request.vehicleId(), BLOCKING_STATUSES);
        if (rentalDatePolicy.hasConflict(existingRentals, null, request.startDate(), request.endDate())) {
            throw new IllegalArgumentException("Vehicle already has a rental during the requested dates");
        }
        Rental rental = new Rental(agencyId, request.vehicleId(), request.customerName().trim(), request.customerEmail().trim(), request.startDate(), request.endDate());
        return toResponse(rentals.save(rental));
    }

    @Transactional
    public RentalResponse extend(Long rentalId, ExtendRentalRequest request) {
        Rental rental = get(rentalId);
        if (!request.requestedEndDate().isAfter(rental.getEndDate())) {
            throw new IllegalArgumentException("Extension date must be after the current end date");
        }
        var existingRentals = rentals.findAllByAgencyIdAndVehicleIdAndStatusIn(
                rental.getAgencyId(), rental.getVehicleId(), BLOCKING_STATUSES);
        if (rentalDatePolicy.hasConflict(existingRentals, rental.getId(), rental.getStartDate(), request.requestedEndDate())) {
            throw new IllegalArgumentException("Extension denied: vehicle is already reserved during the requested period");
        }
        rental.extendTo(request.requestedEndDate());
        return toResponse(rental);
    }

    @Transactional
    public InspectionResponse addInspection(Long rentalId, CreateInspectionRequest request) {
        Rental rental = get(rentalId);
        Inspection inspection = inspections.save(new Inspection(rental.getAgencyId(), rental.getId(), request.type(), request.photoUrl().trim(), request.notes()));
        return toResponse(inspection);
    }

    public List<InspectionResponse> inspections(Long rentalId) {
        Rental rental = get(rentalId);
        return inspections.findAllByAgencyIdAndRentalIdOrderByCreatedAtAsc(rental.getAgencyId(), rental.getId()).stream().map(this::toResponse).toList();
    }

    private Rental get(Long id) {
        return rentals.findByIdAndAgencyId(id, CurrentUser.get().agencyId()).orElseThrow(() -> new IllegalArgumentException("Rental not found"));
    }
    private RentalResponse toResponse(Rental rental) {
        RentalStatus status = effectiveStatus(rental);
        return new RentalResponse(rental.getId(), rental.getVehicleId(), rental.getCustomerName(), rental.getCustomerEmail(),
                rental.getStartDate(), rental.getEndDate(), status);
    }

    private RentalStatus effectiveStatus(Rental rental) {
        if (rental.getStatus() == RentalStatus.CANCELLED) return RentalStatus.CANCELLED;
        var today = java.time.LocalDate.now();
        if (today.isBefore(rental.getStartDate())) return RentalStatus.RESERVED;
        if (today.isAfter(rental.getEndDate())) return RentalStatus.COMPLETED;
        return RentalStatus.ACTIVE;
    }
    private InspectionResponse toResponse(Inspection i) { return new InspectionResponse(i.getId(), i.getRentalId(), i.getType(), i.getPhotoUrl(), i.getNotes(), i.getCreatedAt()); }
}
