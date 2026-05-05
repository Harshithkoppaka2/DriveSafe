package com.drivesafe.auth.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {
    private CurrentUser() {}

    public static RequestUser get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getDetails() instanceof RequestUser user)) {
            throw new IllegalStateException("Authenticated user details are unavailable");
        }
        return user;
    }
}
