import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "../api/client";
import { getCharacter, listCharacters, saveCharacter } from "../api/characterApi";
import { AbilitiesSection } from "../components/character/AbilitiesSection";
import { AttacksSkillsSection } from "../components/character/AttacksSkillsSection";
import { CollapsibleSection } from "../components/character/CollapsibleSection";
import { InventoryGearSection } from "../components/character/InventoryGearSection";
import { NotesSection } from "../components/character/NotesSection";
import { OverviewCombatSection } from "../components/character/OverviewCombatSection";
import { RaceClassSection } from "../components/character/RaceClassSection";
import type { CharacterSheet } from "../types/character";

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

export function CharacterSheetPage() {
  const [character, setCharacter] = useState<CharacterSheet | null>(null);
  const [savedCharacter, setSavedCharacter] = useState<CharacterSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);

  // No character picker yet (docs/adr/0008): open the player's first character.
  useEffect(() => {
    listCharacters()
      .then((characters) => (characters.length > 0 ? getCharacter(characters[0].id) : null))
      .then((loaded) => {
        setCharacter(loaded);
        setSavedCharacter(loaded);
      })
      .catch((err) => setLoadError(errorMessage(err, "Could not load character")))
      .finally(() => setLoading(false));
  }, []);

  function updateCharacter(patch: Partial<CharacterSheet>) {
    setCharacter((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function applySaved(saved: CharacterSheet) {
    setSavedCharacter(saved);
    // Keep any edits made while the save was in flight; only adopt the new version.
    setCharacter((prev) => (prev ? { ...prev, version: saved.version } : saved));
  }

  async function runSave(toSave: CharacterSheet) {
    setError(null);
    setSaving(true);
    try {
      applySaved(await saveCharacter(toSave));
      setConflict(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setConflict(true);
      } else {
        setError(errorMessage(err, "Save failed"));
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLoadLatest() {
    if (!character) return;
    setError(null);
    setSaving(true);
    try {
      const latest = await getCharacter(character.id);
      setCharacter(latest);
      setSavedCharacter(latest);
      setConflict(false);
    } catch (err) {
      setError(errorMessage(err, "Could not load latest version"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAnyway() {
    if (!character) return;
    setSaving(true);
    let latestVersion: number;
    try {
      latestVersion = (await getCharacter(character.id)).version;
    } catch (err) {
      setError(errorMessage(err, "Save failed"));
      setSaving(false);
      return;
    }
    // Deliberate overwrite: re-save the player's edits on top of the newest version.
    await runSave({ ...character, version: latestVersion });
  }

  if (loading) {
    return <p className="p-4">Loading character...</p>;
  }

  if (loadError || !character) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <p role={loadError ? "alert" : undefined}>{loadError ?? "You don't have a character yet."}</p>
        <Link to="/dashboard/player" className="text-sm text-purple-700 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isDirty = JSON.stringify(character) !== JSON.stringify(savedCharacter);

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
            ) : conflict ? (
              <span role="alert" className="text-red-600">
                This character was changed elsewhere since you loaded it.
              </span>
            ) : isDirty ? (
              "Unsaved changes"
            ) : (
              "All changes saved"
            )}
          </p>
          {conflict ? (
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={handleLoadLatest}
                disabled={saving}
                className="px-4 py-1 rounded border border-purple-600 text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load latest
              </button>
              <button
                type="button"
                onClick={handleSaveAnyway}
                disabled={saving}
                className="px-4 py-1 rounded bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save anyway"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => runSave(character)}
              disabled={!isDirty || saving}
              className="px-4 py-1 rounded bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
