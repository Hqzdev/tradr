package dev.tradr.backend.dashboard.application;

import dev.tradr.backend.agents.application.AgentService;
import dev.tradr.backend.agents.domain.Agent;
import dev.tradr.backend.agents.domain.AgentDecisionLog;
import dev.tradr.backend.agents.repository.AgentDecisionLogRepository;
import dev.tradr.backend.agents.repository.AgentRepository;
import dev.tradr.backend.agents.web.dto.AgentResponse;
import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.repository.AccountRepository;
import dev.tradr.backend.dashboard.web.dto.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.*;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");
    private final AccountRepository accounts;
    private final AgentRepository agents;
    private final AgentDecisionLogRepository logs;
    private final AgentService agentService;

    public DashboardService(AccountRepository accounts, AgentRepository agents,
                            AgentDecisionLogRepository logs, AgentService agentService) {
        this.accounts = accounts;
        this.agents = agents;
        this.logs = logs;
        this.agentService = agentService;
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard(UUID userId) {
        Account account = account(userId);
        List<AgentResponse> agentResponses = agentService.list(userId);
        BigDecimal agentValue = agentResponses.stream().map(AgentResponse::totalValue).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal allocated = agentResponses.stream().map(AgentResponse::budgetLimit).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal total = account.getBalance().add(agentValue).setScale(2);
        BigDecimal profit = total.subtract(account.getInitialBalance()).setScale(2);
        BigDecimal profitPercent = percent(profit, account.getInitialBalance());
        BigDecimal targetGain = account.getGoalValue().subtract(account.getInitialBalance());
        BigDecimal progress = targetGain.signum() <= 0 ? ONE_HUNDRED : profit.divide(targetGain, 4, RoundingMode.HALF_UP).multiply(ONE_HUNDRED).max(BigDecimal.ZERO).min(ONE_HUNDRED).setScale(2);
        return new DashboardResponse(account.getInitialBalance(), total, account.getBalance(), allocated, profit,
                profitPercent, account.getGoalValue(), progress, account.isAccelerationEnabled(), agentResponses,
                activity(account.getId()));
    }

    @Transactional
    public DashboardResponse update(UUID userId, AccountPreferencesRequest request) {
        Account account = account(userId);
        account.updatePreferences(request.goalValue(), request.accelerationEnabled());
        return dashboard(userId);
    }

    private List<DashboardActivityResponse> activity(UUID accountId) {
        List<Agent> accountAgents = agents.findByAccountIdOrderByCreatedAtDesc(accountId);
        if (accountAgents.isEmpty()) return List.of();
        Map<UUID, Agent> byId = accountAgents.stream().collect(Collectors.toMap(Agent::getId, Function.identity()));
        return logs.findByAgentIdInOrderByTimestampDesc(byId.keySet(), PageRequest.of(0, 30)).stream()
                .map(log -> activity(log, byId.get(log.getAgentId()))).toList();
    }

    private DashboardActivityResponse activity(AgentDecisionLog log, Agent agent) {
        return new DashboardActivityResponse(log.getId(), log.getAgentId(), agent.getName(),
                log.getAction().name().toLowerCase(Locale.ROOT), log.getReason(), log.getTimestamp());
    }

    private BigDecimal percent(BigDecimal value, BigDecimal base) { return base.signum() == 0 ? BigDecimal.ZERO : value.divide(base, 4, RoundingMode.HALF_UP).multiply(ONE_HUNDRED).setScale(2); }
    private Account account(UUID userId) { return accounts.findByUserId(userId).orElseThrow(() -> new IllegalStateException("Account not found")); }
}
