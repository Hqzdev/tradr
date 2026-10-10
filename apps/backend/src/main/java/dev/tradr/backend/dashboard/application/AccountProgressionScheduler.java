package dev.tradr.backend.dashboard.application;

import dev.tradr.backend.agents.application.AgentService;
import dev.tradr.backend.agents.web.dto.AgentResponse;
import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.repository.AccountRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
public class AccountProgressionScheduler {
    private final AccountRepository accounts;
    private final AgentService agents;
    private final AccountProgression progression;

    public AccountProgressionScheduler(AccountRepository accounts, AgentService agents,
                                       AccountProgression progression) {
        this.accounts = accounts;
        this.agents = agents;
        this.progression = progression;
    }

    @Scheduled(fixedDelayString = "${app.account.progression-interval-ms:5000}")
    @Transactional
    public void advanceAccounts() {
        for (Account existing : accounts.findAll()) {
            Account account = accounts.findByUserIdForUpdate(existing.getUserId()).orElse(null);
            if (account == null) continue;

            BigDecimal agentValue = agents.list(account.getUserId()).stream()
                    .map(AgentResponse::totalValue).reduce(BigDecimal.ZERO, BigDecimal::add);
            progression.advanceFor(account, account.getBalance().add(agentValue));
        }
    }
}
