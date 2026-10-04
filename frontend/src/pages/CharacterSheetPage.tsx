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
  const [savedCharacter, setSavedCharacter] = useState<CharacterSheet>(mockCharacter);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(character) !== JSON.stringify(savedCharacter);

  function updateCharacter(patch: Partial<CharacterSheet>) {
    setCharacter((prev) => ({ ...prev, ...patch }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      // TODO: persist via the characters API once the backend endpoint exists.
      setSavedCharacter(character);
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pb-24">
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

      <div className="fixed bottom-0 inset-x-0 border-t border-gray-300 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm">
            {error ? (
              <span role="alert" className="text-red-600">
                {error}
              </span>
            ) : isDirty ? (
              "Unsaved changes"
            ) : (
              "All changes saved"
            )}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="px-4 py-1 rounded bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
