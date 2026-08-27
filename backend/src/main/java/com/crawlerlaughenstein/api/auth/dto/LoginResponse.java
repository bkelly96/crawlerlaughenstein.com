package com.crawlerlaughenstein.api.auth.dto;

public record LoginResponse(String token, UserResponse user) {
}
