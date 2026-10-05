package com.crawlerlaughenstein.api.character.dto;

import com.crawlerlaughenstein.api.character.CharacterSheetBody;

import java.util.UUID;

public record CharacterResponse(UUID id, String name, Integer level, CharacterSheetBody body) {
}
