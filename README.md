# DriveSafe

DriveSafe is a lightweight B2B rental-operations workspace for independent car-rental agencies. It is intentionally not a customer booking marketplace. The product is built around a few operational mistakes that are easy to make in small fleets: assigning a vehicle that is overdue for service, extending a rental into the next reservation, and losing the pickup/return condition trail.

## Product scope

- Fleet overview with vehicle readiness, active rentals, service alerts and utilization.
- Vehicle inventory with odometer and oil-service tracking.
- Automatic maintenance status: `READY`, `DUE_SOON`, `OVERDUE`.
- Rental creation with a readiness gate and date-conflict validation.
- Rental extensions that check future reservations before approval.
- Pickup/return condition evidence with photos and notes.
- Agency-scoped users with `ADMIN` and `EMPLOYEE` roles.
- Demo workspace with realistic fleet, rental and inspection records for portfolio review.

## Architecture

```text
React frontend
      |
      +---- Auth Service (Spring Boot) ------- drivesafe_auth
      +---- Vehicle Service (Spring Boot) ---- drivesafe_vehicle
      +---- Rental Service (Spring Boot) ----- drivesafe_rental
                    |
                    +---- calls Vehicle Service for readiness

MySQL 8.4 hosts the three service databases.
```

The services are deliberately small. There is no Kafka, Redis, Kubernetes, service discovery or distributed tracing because those would add complexity without helping the problems this project is trying to solve.

## Stack

React 18, Vite, Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, MySQL, Docker Compose, JUnit 5 and GitHub Actions.

## Run

```bash
cp .env.example .env
docker compose up --build
```

Open **http://localhost:3000**.

MySQL is exposed on host port **3307** so the project can run even when a local MySQL installation is already using 3306. Inside Docker, the Spring services still connect to MySQL on port 3306.

### Portfolio demo login

```text
Email:    demo@drivesafe.app
Password: DriveSafe123!
```

The login screen has a **Use demo account** button that fills these credentials.

If you previously ran an older DriveSafe build and want the new demo data, reset the Docker volume once:

```bash
docker compose down -v
docker compose up --build
```

`down -v` deletes the local DriveSafe database volume, so only use it when you are fine resetting local project data.

## Services

| Service | Port | Responsibility |
| --- | ---: | --- |
| auth-service | 8081 | Agency registration, login, employee accounts and JWTs |
| vehicle-service | 8082 | Vehicles, mileage, service records and readiness |
| rental-service | 8083 | Rentals, extension conflicts and condition inspections |
| frontend | 3000 | Staff-facing operations workspace |
| MySQL | 3307 host / 3306 container | Service databases |

## Core business rules

### 1. Maintenance gate

Vehicle Service calculates the next engine-oil service from the last service mileage, current odometer and service interval. An `OVERDUE` vehicle is returned as not rentable. Rental Service checks that readiness before creating the rental.

### 2. Extension conflict check

A requested extension is compared with the other blocking rentals for the same vehicle. The extension is rejected when the new range overlaps another reservation.

### 3. Condition evidence

Pickup and return photos/notes are stored against the rental rather than as a loose vehicle note, leaving a clear before/after trail for staff.

## Project evolution

DriveSafe is a modern rebuild of an earlier JavaFX/JDBC vehicle project. The original project helped establish the vehicle and database domain. This version separates the UI from backend business logic with React and Spring Boot and reframes the product as an operations tool for independent rental agencies.
