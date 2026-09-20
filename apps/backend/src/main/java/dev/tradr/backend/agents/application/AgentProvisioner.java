package dev.tradr.backend.agents.application;

import dev.tradr.backend.agents.domain.Agent;
import dev.tradr.backend.agents.domain.AgentBudget;
import dev.tradr.backend.agents.domain.AgentConfig;
import dev.tradr.backend.agents.domain.AgentStrategy;
import dev.tradr.backend.agents.domain.StrategyProfile;
import dev.tradr.backend.agents.repository.AgentConfigRepository;
import dev.tradr.backend.agents.repository.AgentRepository;
import dev.tradr.backend.agents.repository.AgentEquityPointRepository;
import dev.tradr.backend.agents.repository.AgentWalletRepository;
import dev.tradr.backend.agents.web.dto.CreateAgentRequest;
import dev.tradr.backend.agents.domain.AgentEquityPoint;
import dev.tradr.backend.agents.domain.AgentWallet;
import dev.tradr.backend.agents.exception.AgentAllocationException;
import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.repository.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Locale;
import java.util.UUID;

@Service
public class AgentProvisioner {

    private final AgentRepository agents;
    private final AgentConfigRepository configs;
    private final AccountRepository accounts;
    private final AgentWalletRepository wallets;
    private final AgentEquityPointRepository equityPoints;

    public AgentProvisioner(AgentRepository agents, AgentConfigRepository configs, AccountRepository accounts,
                            AgentWalletRepository wallets, AgentEquityPointRepository equityPoints) {
        this.agents = agents;
        this.configs = configs;
        this.accounts = accounts;
        this.wallets = wallets;
        this.equityPoints = equityPoints;
    }

    @Transactional
    public Agent provision(UUID accountId, CreateAgentRequest request) {
        AgentStrategy strategy = strategy(request.strategy());
        StrategyProfile profile = strategy.profile();
        BigDecimal signal = profile.randomSignal();
        AgentBudget budget = AgentBudget.fromNullable(request.budgetLimit());
        Account account = accounts.findById(accountId).orElseThrow(() -> new IllegalStateException("Account not found"));
        if (account.getBalance().compareTo(budget.limit()) < 0) {
            throw new AgentAllocationException("Недостаточно денег в резерве для этого агента");
        }
        Agent agent = agents.save(new Agent(accountId, request.name().trim(), strategy, profile.rangeLabel(), signal));
        configs.save(new AgentConfig(
                agent.getId(),
                profileJson(profile, signal),
                budget,
                "{}"
        ));
        account.debit(budget.limit());
        wallets.save(new AgentWallet(agent.getId(), budget.limit(), account.getCurrency()));
        equityPoints.save(new AgentEquityPoint(agent.getId(), budget.limit(), BigDecimal.ZERO));
        return agent;
    }

    private AgentStrategy strategy(String value) {
        try {
            return AgentStrategy.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (Exception exception) {
            throw new IllegalArgumentException("strategy must be aggressive, careful or random");
        }
    }

    private String profileJson(StrategyProfile profile, BigDecimal signal) {
        return "{\"name\":\"" + profile.name() + "\",\"minimumChange\":" + profile.minimumChange()
                + ",\"maximumChange\":" + profile.maximumChange() + ",\"signal\":" + signal + "}";
    }
}
