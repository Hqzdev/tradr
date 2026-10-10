package dev.tradr.backend.agents.application;

import dev.tradr.backend.agents.domain.*;
import dev.tradr.backend.agents.exception.AgentAllocationException;
import dev.tradr.backend.agents.repository.*;
import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgentProfitWithdrawalTest {
    @Mock AccountRepository accounts;
    @Mock AgentRepository agents;
    @Mock AgentWalletRepository wallets;
    @Mock AgentPositionRepository positions;
    @Mock AgentEquityPointRepository equityPoints;
    @Mock AgentDecisionLogRepository logs;
    @Mock AgentConfigRepository configs;
    @InjectMocks AgentService service;

    private final UUID userId = UUID.randomUUID();
    private final UUID agentId = UUID.randomUUID();
    private Account account;
    private Agent agent;
    private AgentWallet wallet;

    @BeforeEach void prepare() {
        account = new Account(userId, BigDecimal.ZERO, "USD");
        agent = mock(Agent.class);
        wallet = new AgentWallet(agentId, new BigDecimal("100000"), "USD");
        when(accounts.findByUserIdForUpdate(userId)).thenReturn(Optional.of(account));
        when(accounts.findByUserId(userId)).thenReturn(Optional.of(account));
        when(agents.findByIdAndAccountId(agentId, account.getId())).thenReturn(Optional.of(agent));
    }

    @Test void transfersOnlyProfitAndPreservesTotalCapitalAndBudget() {
        when(agent.getStatus()).thenReturn(AgentStatus.PAUSED);
        when(agent.getId()).thenReturn(agentId);
        when(agent.getStrategy()).thenReturn(AgentStrategy.CAREFUL);
        when(wallets.findById(agentId)).thenReturn(Optional.of(wallet));
        wallet.credit(new BigDecimal("6000"));

        service.withdrawProfit(userId, agentId);

        assertEquals(new BigDecimal("6000.00"), account.getBalance());
        assertEquals(new BigDecimal("100000.00"), wallet.getCashBalance());
        assertEquals(new BigDecimal("100000.00"), wallet.getInitialCash());
        assertEquals(new BigDecimal("106000.00"), account.getBalance().add(wallet.getCashBalance()));
        assertThrows(AgentAllocationException.class, () -> service.withdrawProfit(userId, agentId));
    }

    @Test void cannotWithdrawPrincipalWhenThereIsNoProfit() {
        when(agent.getStatus()).thenReturn(AgentStatus.PAUSED);
        when(wallets.findById(agentId)).thenReturn(Optional.of(wallet));
        assertThrows(AgentAllocationException.class, () -> service.withdrawProfit(userId, agentId));
        assertEquals(new BigDecimal("100000.00"), wallet.getCashBalance());
        assertEquals(BigDecimal.ZERO, account.getBalance());
    }

    @Test void activeAgentMustBePausedBeforeTransfer() {
        when(agent.getStatus()).thenReturn(AgentStatus.ACTIVE);
        assertThrows(AgentAllocationException.class, () -> service.withdrawProfit(userId, agentId));
        verifyNoInteractions(wallets);
    }

    @Test void capitalCanGrowAboveStartingAmountAndUpdatesConfiguration() {
        when(agent.getStatus()).thenReturn(AgentStatus.PAUSED);
        when(agent.getId()).thenReturn(agentId);
        when(agent.getStrategy()).thenReturn(AgentStrategy.CAREFUL);
        when(wallets.findById(agentId)).thenReturn(Optional.of(wallet));
        AgentConfig config = new AgentConfig(agentId, "{}", new AgentBudget(new BigDecimal("100000"), "USD"), "{}");
        when(configs.findById(agentId)).thenReturn(Optional.of(config));
        account.credit(new BigDecimal("6000"));
        service.allocation(userId, agentId, new BigDecimal("106000"));
        assertEquals(new BigDecimal("106000.00"), wallet.getInitialCash());
        assertEquals(new BigDecimal("106000.00"), config.getBudget().limit());
        assertEquals(new BigDecimal("0.00"), account.getBalance());
        assertEquals(new BigDecimal("106000.00"), wallet.getCashBalance());
        service.allocation(userId, agentId, new BigDecimal("100000"));
        assertEquals(new BigDecimal("6000.00"), account.getBalance());
        assertEquals(new BigDecimal("100000.00"), wallet.getCashBalance());
        assertEquals(new BigDecimal("100000.00"), config.getBudget().limit());
    }

    @Test void capitalCannotConsumeUnavailableReserveOrSellPositionsImplicitly() {
        when(agent.getStatus()).thenReturn(AgentStatus.PAUSED);
        when(wallets.findById(agentId)).thenReturn(Optional.of(wallet));
        assertThrows(AgentAllocationException.class, () -> service.allocation(userId, agentId, new BigDecimal("106000")));
        wallet.debit(new BigDecimal("90000"));
        assertThrows(AgentAllocationException.class, () -> service.allocation(userId, agentId, new BigDecimal("5000")));
        assertEquals(new BigDecimal("100000.00"), wallet.getInitialCash());
        assertEquals(new BigDecimal("10000.00"), wallet.getCashBalance());
        assertEquals(BigDecimal.ZERO, account.getBalance());
    }
}
