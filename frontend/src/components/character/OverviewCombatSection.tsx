import type { CharacterSheet } from "../../types/character";
import { HealthBar } from "./HealthBar";
import { NumberField, TextField } from "./fields";

export function OverviewCombatSection({
  character,
  onChange,
}: {
  character: CharacterSheet;
  onChange: (patch: Partial<CharacterSheet>) => void;
}) {
  const evadeTotal = character.evade.dexMod + character.evade.buffs;
  const drTotal = character.damageResistance.armor + character.damageResistance.buffs;

  function updateExternalBuff(index: number, value: string) {
    const next = [...character.externalBuffs] as CharacterSheet["externalBuffs"];
    next[index] = value;
    onChange({ externalBuffs: next });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6">
        <div className="w-28 h-36 shrink-0 border border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-400 text-center p-2">
          Portrait
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 min-w-[16rem]">
          <TextField label="Name" value={character.name} onChange={(v) => onChange({ name: v })} />
          <TextField label="Race" value={character.raceName} onChange={(v) => onChange({ raceName: v })} />
          <TextField
            label="Gender/Pronouns"
            value={character.genderPronouns}
            onChange={(v) => onChange({ genderPronouns: v })}
          />
          <NumberField label="Level" value={character.level} onChange={(v) => onChange({ level: v })} />
          <TextField
            label="Crawler Number"
            value={character.crawlerNumber}
            onChange={(v) => onChange({ crawlerNumber: v })}
          />
          <TextField label="Class" value={character.className} onChange={(v) => onChange({ className: v })} />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Health Bar</h3>
        <HealthBar
          slotValue={character.health.slotValue}
          marked={character.health.marked}
          onChange={(marked) => onChange({ health: { ...character.health, marked } })}
        />
        <div className="mt-2 w-24">
          <NumberField
            label="Slot Value"
            value={character.health.slotValue}
            onChange={(v) => onChange({ health: { ...character.health, slotValue: v } })}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded p-3">
          <h3 className="font-semibold mb-2">Evade</h3>
          <div className="flex flex-wrap items-end gap-2 mb-2">
            <NumberField
              label="DEX Mod"
              value={character.evade.dexMod}
              onChange={(v) => onChange({ evade: { ...character.evade, dexMod: v } })}
            />
            <NumberField
              label="Buffs"
              value={character.evade.buffs}
              onChange={(v) => onChange({ evade: { ...character.evade, buffs: v } })}
            />
            <NumberField label="Move" value={character.move} onChange={(v) => onChange({ move: v })} />
            <NumberField label="Step" value={character.step} onChange={(v) => onChange({ step: v })} />
          </div>
          <p className="text-sm text-gray-600">
            d20 + {character.evade.dexMod} + {character.evade.buffs} = <strong>{evadeTotal}</strong> Evade Total
          </p>
        </div>

        <div className="border border-gray-200 rounded p-3">
          <h3 className="font-semibold mb-2">Damage Resistance</h3>
          <div className="flex flex-wrap items-end gap-2 mb-2">
            <NumberField
              label="Armor"
              value={character.damageResistance.armor}
              onChange={(v) => onChange({ damageResistance: { ...character.damageResistance, armor: v } })}
            />
            <NumberField
              label="Buffs"
              value={character.damageResistance.buffs}
              onChange={(v) => onChange({ damageResistance: { ...character.damageResistance, buffs: v } })}
            />
            <NumberField label="AI Favor" value={character.aiFavor} onChange={(v) => onChange({ aiFavor: v })} />
            <TextField label="Size" value={character.size} onChange={(v) => onChange({ size: v })} />
          </div>
          <p className="text-sm text-gray-600">
            {character.damageResistance.armor} + {character.damageResistance.buffs} = <strong>{drTotal}</strong> DR
            Total
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">External Buffs</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {character.externalBuffs.map((buff, i) => (
            <input
              key={i}
              type="text"
              value={buff}
              onChange={(e) => updateExternalBuff(i, e.target.value)}
              placeholder={`Buff ${i + 1}`}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
