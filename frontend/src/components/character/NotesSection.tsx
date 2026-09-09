import type { CharacterSheet } from "../../types/character";

export function NotesSection({
  character,
  onChange,
}: {
  character: CharacterSheet;
  onChange: (patch: Partial<CharacterSheet>) => void;
}) {
  return (
    <label className="flex flex-col text-sm gap-1">
      <span className="text-gray-600">Notes</span>
      <textarea
        value={character.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
        rows={16}
        className="w-full border border-gray-300 rounded px-2 py-1"
      />
    </label>
  );
}
