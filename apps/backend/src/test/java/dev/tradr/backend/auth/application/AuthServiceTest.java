package dev.tradr.backend.auth.application;

import dev.tradr.backend.agents.application.AgentProvisioner;
import dev.tradr.backend.agents.domain.Agent;
import dev.tradr.backend.agents.web.dto.CreateAgentRequest;
import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.domain.User;
import dev.tradr.backend.auth.repository.AccountRepository;
import dev.tradr.backend.auth.repository.RefreshTokenRepository;
import dev.tradr.backend.auth.repository.UserRepository;
import dev.tradr.backend.auth.security.JwtProperties;
import dev.tradr.backend.auth.security.JwtService;
import dev.tradr.backend.auth.web.dto.AuthResponse;
import dev.tradr.backend.auth.web.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthServiceTest {

    @Mock private UserRepository users;
    @Mock private AccountRepository accounts;
    @Mock private RefreshTokenRepository refreshTokens;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwt;
    @Mock private AgentProvisioner provisioner;

    private AuthService service;
    private User savedUser;
    private Account savedAccount;

    @BeforeEach
    void setUp() {
        service = new AuthService(
                users,
                accounts,
                refreshTokens,
                passwordEncoder,
                jwt,
                new JwtProperties("test-secret", 15, 30),
                provisioner
        );
        savedUser = org.mockito.Mockito.mock(User.class);
        savedAccount = org.mockito.Mockito.mock(Account.class);
        when(users.existsByEmail("user@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hash");
        when(users.save(any(User.class))).thenReturn(savedUser);
        when(savedUser.getId()).thenReturn(UUID.randomUUID());
        when(savedUser.getEmail()).thenReturn("user@example.com");
        when(savedUser.getDisplayName()).thenReturn("User");
        when(accounts.save(any(Account.class))).thenReturn(savedAccount);
        when(savedAccount.getId()).thenReturn(UUID.randomUUID());
        when(jwt.generateAccessToken(any(UUID.class), any(String.class))).thenReturn("access");
    }

    @Test
    void registersAccountAndFirstAgentInOneFlow() {
        CreateAgentRequest firstAgent = new CreateAgentRequest("Альфа", "careful", new BigDecimal("25000"));
        Agent agent = org.mockito.Mockito.mock(Agent.class);
        UUID agentId = UUID.randomUUID();
        when(agent.getId()).thenReturn(agentId);
        when(provisioner.provision(savedAccount.getId(), firstAgent)).thenReturn(agent);

        AuthResponse response = service.register(new RegisterRequest(
                "user@example.com", "password123", "User", firstAgent
        ));

        assertEquals(agentId, response.firstAgentId());
        verify(provisioner).provision(savedAccount.getId(), firstAgent);
    }

    @Test
    void keepsRegistrationCompatibleWithoutFirstAgent() {
        AuthResponse response = service.register(new RegisterRequest(
                "user@example.com", "password123", "User", null
        ));

        assertNull(response.firstAgentId());
        verifyNoInteractions(provisioner);
    }

    @Test
    void doesNotIssueSessionWhenFirstAgentProvisioningFails() {
        CreateAgentRequest firstAgent = new CreateAgentRequest("Альфа", "careful", new BigDecimal("25000"));
        when(provisioner.provision(savedAccount.getId(), firstAgent)).thenThrow(new IllegalStateException("agent failed"));

        assertThrows(IllegalStateException.class, () -> service.register(new RegisterRequest(
                "user@example.com", "password123", "User", firstAgent
        )));

        verify(jwt, never()).generateAccessToken(any(UUID.class), any(String.class));
        verify(refreshTokens, never()).save(any());
    }
}
