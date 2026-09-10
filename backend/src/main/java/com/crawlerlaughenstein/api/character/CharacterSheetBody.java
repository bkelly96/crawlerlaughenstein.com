package com.crawlerlaughenstein.api.character;

import java.util.List;

public record CharacterSheetBody(
        String raceName,
        String genderPronouns,
        String crawlerNumber,
        String className,
        String portraitUrl,
        HealthBarState health,
        Evade evade,
        int move,
        int step,
        DamageResistance damageResistance,
        int aiFavor,
        String size,
        List<String> externalBuffs,
        AbilityScores abilities,
        List<Attack> attacks,
        List<String> hotlist,
        GearSlots gear,
        List<String> accessories,
        List<SkillRow> skills,
        List<SkillUpgrade> skillUpgrades,
        String inventoryNotes,
        List<InventoryItem> inventoryItems,
        String racialBenefits,
        String classBenefits,
        String notes
) {

    public record HealthBarState(int resistance, List<Boolean> marked) {
    }

    public record Evade(int dexMod, int buffs) {
    }

    public record DamageResistance(int armor, int buffs) {
    }

    public record AbilityScore(int enhanced, int unenhanced, int mod) {
    }

    public record AbilityScores(
            AbilityScore strength,
            AbilityScore intelligence,
            AbilityScore constitution,
            AbilityScore dexterity,
            AbilityScore charisma
    ) {
    }

    public record Attack(
            String name,
            int toHitRank,
            int toHitStatMod,
            String damageDice,
            int damageStatMod,
            String effects
    ) {
    }

    public record GearSlots(
            String head,
            String torso,
            String arms,
            String handsHolding,
            String legs,
            String feet
    ) {
    }

    public record SkillRow(String name, int rank, String statAndMod, String checkType) {
    }

    public record SkillUpgrade(String text, boolean checked) {
    }

    public record InventoryItem(String name, int quantity) {
    }
}
