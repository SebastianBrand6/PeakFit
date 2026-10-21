package com.peakfit.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/** Configura el endpoint STOMP y los prefijos para mensajes WebSocket de aforo. */
@Configuration
@EnableWebSocketMessageBroker
public class CapacityWebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /** Habilita el broker de notificaciones y el prefijo para mensajes dirigidos a la API. */
    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    /** Registra el endpoint de conexión y los orígenes web que pueden conectarse. */
    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:*", "https://*.peakfit.local");
    }
}
