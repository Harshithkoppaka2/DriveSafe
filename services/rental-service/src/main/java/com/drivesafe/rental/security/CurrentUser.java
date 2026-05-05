package com.drivesafe.rental.security;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
public final class CurrentUser {
    private CurrentUser() {}
    public static RequestUser get() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !(a.getDetails() instanceof RequestUser user)) throw new IllegalStateException("Authenticated user details are unavailable");
        return user;
    }
}
