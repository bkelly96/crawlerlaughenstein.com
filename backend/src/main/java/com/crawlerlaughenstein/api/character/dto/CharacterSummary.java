package com.crawlerlaughenstein.api.character.dto;

import java.util.UUID;

public record CharacterSummary(UUID id, String name, Integer level) {
}
