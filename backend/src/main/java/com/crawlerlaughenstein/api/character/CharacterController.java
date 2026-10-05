package com.crawlerlaughenstein.api.character;

import com.crawlerlaughenstein.api.auth.UserPrincipal;
import com.crawlerlaughenstein.api.character.dto.CharacterResponse;
import com.crawlerlaughenstein.api.character.dto.CharacterSummary;
import com.crawlerlaughenstein.api.character.dto.CharacterUpdateRequest;
import com.crawlerlaughenstein.api.common.exception.ConflictException;
import com.crawlerlaughenstein.api.common.exception.ResourceNotFoundException;
import com.crawlerlaughenstein.api.user.Role;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Access rules (docs/adr/0008): a PLAYER sees and edits only their own characters; a DM can read
 * every character but not edit (PUT is restricted to PLAYER in SecurityConfig).
 */
@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterRepository characterRepository;

    @GetMapping
    public List<CharacterSummary> list(@AuthenticationPrincipal UserPrincipal principal) {
        List<CharacterSheet> characters = principal.getRole() == Role.DM
                ? characterRepository.findAll()
                : characterRepository.findByPlayerId(principal.getId());
        return characters.stream()
                .map(c -> new CharacterSummary(c.getId(), c.getName(), c.getLevel()))
                .toList();
    }

    @GetMapping("/{id}")
    public CharacterResponse get(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return toResponse(findReadable(id, principal));
    }

    @PutMapping("/{id}")
    public CharacterResponse update(@PathVariable UUID id,
                                    @Valid @RequestBody CharacterUpdateRequest request,
                                    @AuthenticationPrincipal UserPrincipal principal) {
        CharacterSheet character = findReadable(id, principal);
        // Optimistic locking (docs/adr/0008): reject saves based on a stale copy. @Version on the
        // entity also catches a concurrent write landing between this check and the save.
        if (!character.getVersion().equals(request.version())) {
            throw new ConflictException("This character was changed elsewhere since you loaded it");
        }
        character.setName(request.name());
        character.setLevel(request.level());
        character.setBody(request.body());
        return toResponse(characterRepository.save(character));
    }

    /** Returns 404 rather than 403 for another player's character so ids can't be probed. */
    private CharacterSheet findReadable(UUID id, UserPrincipal principal) {
        return characterRepository.findById(id)
                .filter(c -> principal.getRole() == Role.DM || c.getPlayer().getId().equals(principal.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));
    }

    private CharacterResponse toResponse(CharacterSheet character) {
        return new CharacterResponse(character.getId(), character.getName(), character.getLevel(),
                character.getVersion(), character.getBody());
    }
}
