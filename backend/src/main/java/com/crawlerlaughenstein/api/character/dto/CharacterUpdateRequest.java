package com.crawlerlaughenstein.api.character.dto;

import com.crawlerlaughenstein.api.character.CharacterSheetBody;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CharacterUpdateRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull @Min(1) Integer level,
        @NotNull CharacterSheetBody body,
        @NotNull Long version
) {
}
