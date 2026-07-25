# DriveSafe

DriveSafe is a rental fleet operations application built for small and independent car rental agencies.

The idea came from problems I personally experienced while renting cars.

On a few trips, I picked up vehicles that started showing oil or service warnings shortly after leaving the rental location. That meant contacting the rental company, visiting one of their service partners, or swapping the car during the trip.

I also ran into another issue: existing scratches or damage were not always properly documented before pickup. After returning the vehicle, it could become difficult to prove whether damage was already present.

DriveSafe is my attempt to handle those problems before the vehicle leaves the rental lot.

---

## What DriveSafe Does

DriveSafe helps rental agency employees answer a simple question before handing over a vehicle:

**Is this vehicle actually ready to be rented?**

The application combines vehicle maintenance, rental management, and pickup/return inspections in one place.

A vehicle can be available in the fleet but still not be ready for a customer.

For example, it may:

- be overdue for maintenance
- be approaching its service interval
- be missing its pickup inspection
- already have another reservation that conflicts with an extension

DriveSafe keeps those checks as part of the rental workflow.

---

## Dashboard

The dashboard gives agency staff a quick overview of current fleet operations.

It shows:

- total vehicles
- vehicles ready for rental
- vehicles due for service
- overdue maintenance
- active rentals
- upcoming returns
- operational alerts

![DriveSafe Dashboard](docs/screenshots/overview.png)


---

## Vehicle Readiness

Each vehicle stores its current mileage and maintenance information.

DriveSafe calculates the vehicle status as:

- `READY`
- `DUE SOON`
- `OVERDUE`

An overdue vehicle should not be assigned to a new rental until the required service is completed and recorded.

![Vehicle Management](docs/screenshots/vehicles.png)

---

## Maintenance Tracking

Employees can see:

- current vehicle mileage
- last service mileage
- service interval
- mileage remaining before service
- maintenance status

The goal is to identify maintenance requirements before the customer discovers them during a trip.

![Maintenance Tracking](docs/screenshots/maintainance.png)

---

## Rental Management

DriveSafe keeps track of active, upcoming, and completed rentals.

If a customer wants to extend a rental, the system checks the vehicle's upcoming reservations before approving the new return date.

This prevents one customer's extension from creating a conflict with the next reservation.

![Rental Management](docs/screenshots/rentals.png)

---

## Pickup and Return Inspections

Before a vehicle is handed to a customer, its pickup condition can be documented with photos and notes.

The return condition is recorded separately.

This creates a before-and-after record connected to the same rental.

The goal is to protect both sides:

- customers should not be blamed for damage that was already present
- rental agencies should have evidence when new damage occurs

![Vehicle Inspections](docs/screenshots/inspections.png)

---

## Team Management

DriveSafe supports two basic user roles:

### Admin

Admins can manage the agency, employees, vehicles, and operational data.

### Employee

Employees can work with rentals, inspections, vehicle mileage, and everyday fleet operations.

![Team Management](docs/screenshots/team.png)

---

## Architecture

I intentionally kept the architecture small.

The backend is split into three Spring Boot services:

### Auth Service

Handles:

- authentication
- JWT tokens
- agency users
- Admin / Employee roles

### Vehicle Service

Handles:

- vehicle records
- mileage
- maintenance information
- vehicle readiness

### Rental Service

Handles:

- rentals
- rental extensions
- reservation conflicts
- pickup inspections
- return inspections

The React frontend communicates with these services through REST APIs.

```text
                    React
                      |
        -----------------------------
        |             |             |
   Auth Service  Vehicle Service  Rental Service
        |             |             |
        ----------- MySQL -----------
