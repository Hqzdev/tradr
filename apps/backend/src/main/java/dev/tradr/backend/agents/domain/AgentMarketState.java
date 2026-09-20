package dev.tradr.backend.agents.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "agent_market_states")
public class AgentMarketState {
    @EmbeddedId private AgentPositionId id;
    @Column(name = "last_trade_step", nullable = false) private long lastTradeStep;
    protected AgentMarketState() {}
    public AgentMarketState(UUID agentId, UUID instrumentId, long lastTradeStep) { this.id = new AgentPositionId(agentId, instrumentId); this.lastTradeStep = lastTradeStep; }
    public void tradedAt(long step) { this.lastTradeStep = step; }
    public AgentPositionId getId() { return id; }
    public long getLastTradeStep() { return lastTradeStep; }
}
