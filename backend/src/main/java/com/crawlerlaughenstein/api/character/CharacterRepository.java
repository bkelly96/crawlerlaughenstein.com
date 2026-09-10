package com.crawlerlaughenstein.api.character;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CharacterRepository extends JpaRepository<CharacterSheet, UUID> {

    List<CharacterSheet> findByPlayerId(UUID playerId);
}
