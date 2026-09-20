package dev.tradr.backend.dashboard.web.dto;

import java.time.Instant;
import java.util.UUID;

public record DashboardActivityResponse(long id, UUID agentId, String agentName, String action,
                                        String reason, Instant timestamp) {}
