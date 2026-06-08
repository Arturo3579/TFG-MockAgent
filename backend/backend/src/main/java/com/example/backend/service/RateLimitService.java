package com.example.backend.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    // Minute window: userId -> {windowStart, count}
    private final ConcurrentHashMap<Long, MinuteWindow> minuteWindows = new ConcurrentHashMap<>();

    // Daily window: userId -> {day, count}
    private final ConcurrentHashMap<Long, DailyWindow> dailyWindows = new ConcurrentHashMap<>();

    private static final long MINUTE_WINDOW_MS = 60_000; // 1 minuto
    private static final int STARTER_MINUTE_LIMIT = 100;
    private static final int PRO_MINUTE_LIMIT = 1_000;
    private static final int PREMIUM_MINUTE_LIMIT = 1_500;

    private static final int STARTER_DAILY_LIMIT = 100;
    private static final int PRO_DAILY_LIMIT = 5_000;
    private static final int PREMIUM_DAILY_LIMIT = 10_000;

    public boolean isAllowed(Long userId, String plan) {
        String p = plan.toLowerCase();
        if (p.equals("premium") || p.equals("enterprise")) {
            return isDailyAllowed(userId, PREMIUM_DAILY_LIMIT) && isMinuteAllowed(userId, PREMIUM_MINUTE_LIMIT);
        }
        if (p.equals("pro")) {
            return isDailyAllowed(userId, PRO_DAILY_LIMIT) && isMinuteAllowed(userId, PRO_MINUTE_LIMIT);
        }
        return isDailyAllowed(userId, STARTER_DAILY_LIMIT) && isMinuteAllowed(userId, STARTER_MINUTE_LIMIT);
    }

    private boolean isMinuteAllowed(Long userId, int limit) {
        Instant now = Instant.now();
        long currentWindow = now.toEpochMilli() / MINUTE_WINDOW_MS;

        MinuteWindow window = minuteWindows.compute(userId, (k, v) -> {
            if (v == null || v.window != currentWindow) {
                return new MinuteWindow(currentWindow, 1);
            }
            v.count++;
            return v;
        });

        return window.count <= limit;
    }

    private boolean isDailyAllowed(Long userId, int limit) {
        long today = Instant.now().atZone(ZoneId.systemDefault()).toLocalDate().toEpochDay();

        DailyWindow window = dailyWindows.compute(userId, (k, v) -> {
            if (v == null || v.day != today) {
                return new DailyWindow(today, 1);
            }
            v.count++;
            return v;
        });

        return window.count <= limit;
    }

    public void resetDailyForTesting() {
        dailyWindows.clear();
        minuteWindows.clear();
    }

    private static class MinuteWindow {
        long window;
        int count;

        MinuteWindow(long window, int count) {
            this.window = window;
            this.count = count;
        }
    }

    private static class DailyWindow {
        long day;
        int count;

        DailyWindow(long day, int count) {
            this.day = day;
            this.count = count;
        }
    }
}
