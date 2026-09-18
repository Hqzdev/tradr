package dev.tradr.backend.market.websocket;

import dev.tradr.backend.market.application.MarketService;
import dev.tradr.backend.market.application.QuoteSnapshot;
import dev.tradr.backend.market.exception.InstrumentNotFoundException;
import dev.tradr.backend.market.web.dto.MarketTickResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MarketWebSocketHandler extends TextWebSocketHandler {

    private final MarketService marketService;
    private final ObjectMapper objectMapper;
    private final Map<String, Set<WebSocketSession>> sessionsByTicker = new ConcurrentHashMap<>();

    public MarketWebSocketHandler(MarketService marketService, ObjectMapper objectMapper) {
        this.marketService = marketService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String ticker = ticker(session);
        try {
            QuoteSnapshot quote = marketService.quote(ticker);
            sessionsByTicker.computeIfAbsent(ticker, ignored -> ConcurrentHashMap.newKeySet()).add(session);
            send(session, quote);
        } catch (InstrumentNotFoundException exception) {
            session.close(CloseStatus.POLICY_VIOLATION);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        remove(session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        remove(session);
        session.close(CloseStatus.SERVER_ERROR);
    }

    public void broadcast(QuoteSnapshot quote) {
        Set<WebSocketSession> sessions = sessionsByTicker.get(quote.instrument().getTicker());
        if (sessions == null) {
            return;
        }
        for (WebSocketSession session : sessions) {
            try {
                send(session, quote);
            } catch (IOException exception) {
                remove(session);
            }
        }
    }

    private void send(WebSocketSession session, QuoteSnapshot quote) throws IOException {
        MarketTickResponse response = new MarketTickResponse(
                quote.instrument().getTicker(),
                quote.price(),
                quote.changePercent(),
                quote.timestamp()
        );
        try {
            synchronized (session) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
                }
            }
        } catch (JacksonException exception) {
            throw new IllegalStateException(exception);
        }
    }

    private String ticker(WebSocketSession session) {
        String path = session.getUri().getPath();
        return path.substring(path.lastIndexOf('/') + 1).toUpperCase(Locale.ROOT);
    }

    private void remove(WebSocketSession session) {
        sessionsByTicker.values().forEach(sessions -> sessions.remove(session));
    }
}
