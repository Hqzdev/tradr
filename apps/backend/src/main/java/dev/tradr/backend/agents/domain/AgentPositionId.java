package dev.tradr.backend.agents.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class AgentPositionId implements Serializable {
    @Column(name = "agent_id") private UUID agentId;
    @Column(name = "instrument_id") private UUID instrumentId;

    protected AgentPositionId() {}
    public AgentPositionId(UUID agentId, UUID instrumentId) { this.agentId = agentId; this.instrumentId = instrumentId; }
    public UUID getAgentId() { return agentId; }
    public UUID getInstrumentId() { return instrumentId; }
    @Override public boolean equals(Object other) { return other instanceof AgentPositionId id && Objects.equals(agentId, id.agentId) && Objects.equals(instrumentId, id.instrumentId); }
    @Override public int hashCode() { return Objects.hash(agentId, instrumentId); }
}
