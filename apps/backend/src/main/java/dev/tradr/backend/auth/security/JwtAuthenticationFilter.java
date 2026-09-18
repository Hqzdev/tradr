package dev.tradr.backend.auth.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

// Выполняется один раз на каждый запрос (см. OncePerRequestFilter), до
// того как Spring Security решит, пускать запрос дальше или нет.
// Разбирает заголовок "Authorization: Bearer <jwt>": если токен валиден —
// кладёт userId (UUID) как principal в SecurityContext, дальше
// authorizeHttpRequests() в SecurityConfig считает такой запрос
// аутентифицированным. Если токена нет или он невалиден — просто не
// аутентифицирует и идёт дальше по цепочке; заблокирует запрос уже
// authorizeHttpRequests(), если путь требует авторизации.
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                UUID userId = jwtService.validateAndGetUserId(token);
                var authentication = new UsernamePasswordAuthenticationToken(userId, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException e) {
                // Просроченный, подделанный или битый токен — не аутентифицируем.
                // Не бросаем исключение здесь: пусть authorizeHttpRequests() сам
                // решит, публичный это путь или нет, и вернёт 401 где нужно.
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
