package dev.tradr.backend.config;

import dev.tradr.backend.market.websocket.MarketWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class MarketWebSocketConfig implements WebSocketConfigurer {

    private final MarketWebSocketHandler marketWebSocketHandler;
    private final CorsProperties corsProperties;

    public MarketWebSocketConfig(MarketWebSocketHandler marketWebSocketHandler, CorsProperties corsProperties) {
        this.marketWebSocketHandler = marketWebSocketHandler;
        this.corsProperties = corsProperties;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(marketWebSocketHandler, "/ws/market/*")
                .setAllowedOriginPatterns(corsProperties.allowedOrigins().toArray(String[]::new));
    }
}
