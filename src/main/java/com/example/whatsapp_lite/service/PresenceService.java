package com.example.whatsapp_lite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

@Service
public class PresenceService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final long Presence_TTL_SECONDS = 90;

    public void heartbeat(String userId) {
        String key = "user:" + userId + ":lastActive";
        redisTemplate.opsForValue().set(key, String.valueOf(Instant.now().getEpochSecond()), Presence_TTL_SECONDS, TimeUnit.SECONDS);
    }

    public boolean isOnline(String userId) {
        String key = "user:" + userId + ":lastActive";
        return redisTemplate.hasKey(key);
    }
}
