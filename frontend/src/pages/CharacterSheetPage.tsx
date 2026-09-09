import { useState } from "react";
import { Link } from "react-router-dom";
import { AbilitiesSection } from "../components/character/AbilitiesSection";
import { AttacksSkillsSection } from "../components/character/AttacksSkillsSection";
import { CollapsibleSection } from "../components/character/CollapsibleSection";
import { InventoryGearSection } from "../components/character/InventoryGearSection";
import { NotesSection } from "../components/character/NotesSection";
import { OverviewCombatSection } from "../components/character/OverviewCombatSection";
import { RaceClassSection } from "../components/character/RaceClassSection";
import { mockCharacter } from "../mocks/character";
import type { CharacterSheet } from "../types/character";

export function CharacterSheetPage() {
  const [character, setCharacter] = useState<CharacterSheet>(mockCharacter);

  function updateCharacter(patch: Partial<CharacterSheet>) {
    setCharacter((prev) => ({ ...prev, ...patch }));
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{character.name}</h1>
        <Link to="/dashboard/player" className="text-sm text-purple-700 hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <div className="space-y-3">
        <CollapsibleSection title="Overview & Combat" defaultOpen>
          <OverviewCombatSection character={character} onChange={updateCharacter} />
        </CollapsibleSection>
        <CollapsibleSection title="Abilities">
          <AbilitiesSection character={character} onChange={updateCharacter} />
        </CollapsibleSection>
        <CollapsibleSection title="Attacks & Skills">
          <AttacksSkillsSection character={character} onChange={updateCharacter} />
        </CollapsibleSection>
        <CollapsibleSection title="Inventory & Gear">
          <InventoryGearSection character={character} onChange={updateCharacter} />
        </CollapsibleSection>
        <CollapsibleSection title="Race & Class">
          <RaceClassSection character={character} onChange={updateCharacter} />
        </CollapsibleSection>
        <CollapsibleSection title="Notes">
          <NotesSection character={character} onChange={updateCharacter} />
        </CollapsibleSection>
      </div>
    </div>
  );
}
