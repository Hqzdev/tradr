package dev.tradr.backend.dashboard.web;

import dev.tradr.backend.dashboard.application.DashboardService;
import dev.tradr.backend.dashboard.web.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class DashboardController {
    private final DashboardService service;
    public DashboardController(DashboardService service) { this.service = service; }
    @GetMapping("/dashboard") public DashboardResponse dashboard(Authentication auth) { return service.dashboard(user(auth)); }
    @PatchMapping("/account/preferences") public DashboardResponse preferences(Authentication auth, @Valid @RequestBody AccountPreferencesRequest request) { return service.update(user(auth), request); }
    private UUID user(Authentication auth) { return (UUID) auth.getPrincipal(); }
}
