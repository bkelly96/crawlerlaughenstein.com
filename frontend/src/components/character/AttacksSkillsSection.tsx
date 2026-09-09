import type { Attack, CharacterSheet, SkillRow, SkillUpgrade } from "../../types/character";
import { NumberField } from "./fields";

const MAX_ATTACKS = 10;

const EMPTY_ATTACK: Attack = {
  name: "",
  toHitRank: 0,
  toHitStatMod: 0,
  damageDice: "",
  damageStatMod: 0,
  effects: "",
};
const EMPTY_SKILL: SkillRow = { name: "", rank: 0, statAndMod: "", checkType: "" };
const EMPTY_UPGRADE: SkillUpgrade = { text: "", checked: false };

export function AttacksSkillsSection({
  character,
  onChange,
}: {
  character: CharacterSheet;
  onChange: (patch: Partial<CharacterSheet>) => void;
}) {
  function updateAttack(index: number, patch: Partial<Attack>) {
    onChange({ attacks: character.attacks.map((a, i) => (i === index ? { ...a, ...patch } : a)) });
  }
  function addAttack() {
    if (character.attacks.length >= MAX_ATTACKS) return;
    onChange({ attacks: [...character.attacks, { ...EMPTY_ATTACK }] });
  }
  function removeAttack(index: number) {
    onChange({ attacks: character.attacks.filter((_, i) => i !== index) });
  }

  function updateSkill(index: number, patch: Partial<SkillRow>) {
    onChange({ skills: character.skills.map((s, i) => (i === index ? { ...s, ...patch } : s)) });
  }
  function addSkill() {
    onChange({ skills: [...character.skills, { ...EMPTY_SKILL }] });
  }
  function removeSkill(index: number) {
    onChange({ skills: character.skills.filter((_, i) => i !== index) });
  }

  function updateUpgrade(index: number, patch: Partial<SkillUpgrade>) {
    onChange({ skillUpgrades: character.skillUpgrades.map((u, i) => (i === index ? { ...u, ...patch } : u)) });
  }
  function addUpgrade() {
    onChange({ skillUpgrades: [...character.skillUpgrades, { ...EMPTY_UPGRADE }] });
  }
  function removeUpgrade(index: number) {
    onChange({ skillUpgrades: character.skillUpgrades.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Attacks</h3>
          <button
            type="button"
            onClick={addAttack}
            disabled={character.attacks.length >= MAX_ATTACKS}
            className="text-sm px-2 py-1 rounded bg-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Attack
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[42rem]">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">To Hit (Rank + Stat Mod)</th>
                <th className="py-2 pr-4">Damage (Dice + Stat Mod)</th>
                <th className="py-2 pr-4">Effects</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {character.attacks.map((attack, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      value={attack.name}
                      onChange={(e) => updateAttack(i, { name: e.target.value })}
                      className="w-32 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-1">
                      <NumberField value={attack.toHitRank} onChange={(v) => updateAttack(i, { toHitRank: v })} />
                      <span>+</span>
                      <NumberField
                        value={attack.toHitStatMod}
                        onChange={(v) => updateAttack(i, { toHitStatMod: v })}
                      />
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={attack.damageDice}
                        onChange={(e) => updateAttack(i, { damageDice: e.target.value })}
                        placeholder="1d6"
                        className="w-16 border border-gray-300 rounded px-2 py-1"
                      />
                      <span>+</span>
                      <NumberField
                        value={attack.damageStatMod}
                        onChange={(v) => updateAttack(i, { damageStatMod: v })}
                      />
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      value={attack.effects}
                      onChange={(e) => updateAttack(i, { effects: e.target.value })}
                      className="w-40 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2">
                    <button type="button" onClick={() => removeAttack(i)} className="text-red-600 text-sm">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Skills</h3>
          <button type="button" onClick={addSkill} className="text-sm px-2 py-1 rounded bg-purple-600 text-white">
            Add Skill
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[34rem]">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Rank</th>
                <th className="py-2 pr-4">Stat & Mod</th>
                <th className="py-2 pr-4">Check Type</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {character.skills.map((skill, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(i, { name: e.target.value })}
                      className="w-32 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <NumberField value={skill.rank} onChange={(v) => updateSkill(i, { rank: v })} />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      value={skill.statAndMod}
                      onChange={(e) => updateSkill(i, { statAndMod: e.target.value })}
                      className="w-24 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      value={skill.checkType}
                      onChange={(e) => updateSkill(i, { checkType: e.target.value })}
                      className="w-28 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2">
                    <button type="button" onClick={() => removeSkill(i)} className="text-red-600 text-sm">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Notes & Upgrades</h3>
          <button type="button" onClick={addUpgrade} className="text-sm px-2 py-1 rounded bg-purple-600 text-white">
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {character.skillUpgrades.map((upgrade, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={upgrade.checked}
                onChange={(e) => updateUpgrade(i, { checked: e.target.checked })}
              />
              <input
                type="text"
                value={upgrade.text}
                onChange={(e) => updateUpgrade(i, { text: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button type="button" onClick={() => removeUpgrade(i)} className="text-red-600 text-sm">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
