package com.drivesafe.rental.service;

import com.drivesafe.rental.api.RentalDtos.VehicleReadinessResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class VehicleClient {
    private final RestClient client;
    public VehicleClient(RestClient vehicleRestClient) { this.client = vehicleRestClient; }

    public VehicleReadinessResponse readiness(Long vehicleId, String authorization) {
        try {
            return client.get().uri("/api/vehicles/{id}/readiness", vehicleId)
                    .header("Authorization", authorization)
                    .retrieve().body(VehicleReadinessResponse.class);
        } catch (HttpClientErrorException.BadRequest ex) {
            throw new IllegalArgumentException("Vehicle was not found for this agency");
        } catch (RestClientException ex) {
            throw new IllegalStateException("Unable to verify vehicle readiness right now");
        }
    }
}
