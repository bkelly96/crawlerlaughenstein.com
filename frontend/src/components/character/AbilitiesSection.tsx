import type { AbilityScore, CharacterSheet } from "../../types/character";
import { NumberField } from "./fields";

const ABILITY_KEYS = ["strength", "intelligence", "constitution", "dexterity", "charisma"] as const;
type AbilityKey = (typeof ABILITY_KEYS)[number];

const LABELS: Record<AbilityKey, string> = {
  strength: "Strength",
  intelligence: "Intelligence",
  constitution: "Constitution",
  dexterity: "Dexterity",
  charisma: "Charisma",
};

export function AbilitiesSection({
  character,
  onChange,
}: {
  character: CharacterSheet;
  onChange: (patch: Partial<CharacterSheet>) => void;
}) {
  function updateAbility(key: AbilityKey, field: keyof AbilityScore, value: number) {
    onChange({
      abilities: {
        ...character.abilities,
        [key]: { ...character.abilities[key], [field]: value },
      },
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th className="py-2 pr-4">Ability</th>
            <th className="py-2 pr-4">Enhanced</th>
            <th className="py-2 pr-4">Unenhanced</th>
            <th className="py-2 pr-4">Mod</th>
          </tr>
        </thead>
        <tbody>
          {ABILITY_KEYS.map((key) => {
            const score = character.abilities[key];
            return (
              <tr key={key} className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">{LABELS[key]}</td>
                <td className="py-2 pr-4">
                  <NumberField value={score.enhanced} onChange={(v) => updateAbility(key, "enhanced", v)} />
                </td>
                <td className="py-2 pr-4">
                  <NumberField value={score.unenhanced} onChange={(v) => updateAbility(key, "unenhanced", v)} />
                </td>
                <td className="py-2 pr-4">
                  <NumberField value={score.mod} onChange={(v) => updateAbility(key, "mod", v)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
