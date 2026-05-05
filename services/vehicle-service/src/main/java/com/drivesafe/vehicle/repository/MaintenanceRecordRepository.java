package com.drivesafe.vehicle.repository;
import com.drivesafe.vehicle.domain.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {}
