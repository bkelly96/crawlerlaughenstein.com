package com.crawlerlaughenstein.api.auth.dto;

import com.crawlerlaughenstein.api.user.Role;

import java.util.UUID;

public record UserResponse(UUID id, String username, Role role) {
}
