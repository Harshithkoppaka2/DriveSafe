package com.drivesafe.vehicle.service;

import com.drivesafe.vehicle.domain.MaintenanceStatus;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class MaintenancePolicyTest {
    private final MaintenancePolicy policy = new MaintenancePolicy();

    @Test
    void marksVehicleOverdueWhenServiceMileageHasPassed() {
        var result = policy.evaluate(61_420, 56_000, 5_000);
        assertThat(result.status()).isEqualTo(MaintenanceStatus.OVERDUE);
        assertThat(result.milesToService()).isEqualTo(-420);
    }

    @Test
    void marksVehicleDueSoonWithinFiveHundredMiles() {
        var result = policy.evaluate(60_700, 56_000, 5_000);
        assertThat(result.status()).isEqualTo(MaintenanceStatus.DUE_SOON);
        assertThat(result.milesToService()).isEqualTo(300);
    }
}
