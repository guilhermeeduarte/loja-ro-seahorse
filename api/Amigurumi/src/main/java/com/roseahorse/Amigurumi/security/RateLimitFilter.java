package com.roseahorse.Amigurumi.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitFilter implements Filter {

    private final ConcurrentHashMap<String, AttemptInfo> loginAttempts = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final long BLOCK_TIME_MS = TimeUnit.MINUTES.toMillis(15);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        if ("/api/usuario/login".equals(httpRequest.getRequestURI())
                && "POST".equals(httpRequest.getMethod())) {

            String ip = getClientIP(httpRequest);
            AttemptInfo info = loginAttempts.computeIfAbsent(ip, k -> new AttemptInfo());

            if (info.isBlocked()) {
                httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                httpResponse.getWriter().write(
                        "{\"erro\": \"Muitas tentativas de login. Tente novamente em 15 minutos.\"}"
                );
                return;
            }
        }

        chain.doFilter(request, response);
    }

    public void recordFailedAttempt(String ip) {
        AttemptInfo info = loginAttempts.computeIfAbsent(ip, k -> new AttemptInfo());
        info.incrementAttempts();
    }

    public void resetAttempts(String ip) {
        loginAttempts.remove(ip);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private static class AttemptInfo {
        private int attempts = 0;
        private long lastAttemptTime = 0;

        public void incrementAttempts() {
            attempts++;
            lastAttemptTime = System.currentTimeMillis();
        }

        public boolean isBlocked() {
            if (attempts >= MAX_ATTEMPTS) {
                long elapsedTime = System.currentTimeMillis() - lastAttemptTime;
                if (elapsedTime < BLOCK_TIME_MS) {
                    return true;
                } else {
                    // Reset após o tempo de bloqueio
                    attempts = 0;
                    return false;
                }
            }
            return false;
        }
    }
}