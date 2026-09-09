import type { CharacterSheet } from "../../types/character";
import { TextField } from "./fields";

export function RaceClassSection({
  character,
  onChange,
}: {
  character: CharacterSheet;
  onChange: (patch: Partial<CharacterSheet>) => void;
}) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-semibold mb-2">Race</h3>
        <div className="space-y-2">
          <TextField label="Name of Race" value={character.raceName} onChange={(v) => onChange({ raceName: v })} />
          <label className="flex flex-col text-sm gap-1">
            <span className="text-gray-600">Racial Benefits</span>
            <textarea
              value={character.racialBenefits}
              onChange={(e) => onChange({ racialBenefits: e.target.value })}
              rows={6}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Class</h3>
        <div className="space-y-2">
          <TextField label="Name of Class" value={character.className} onChange={(v) => onChange({ className: v })} />
          <label className="flex flex-col text-sm gap-1">
            <span className="text-gray-600">Class Benefits</span>
            <textarea
              value={character.classBenefits}
              onChange={(e) => onChange({ classBenefits: e.target.value })}
              rows={6}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
