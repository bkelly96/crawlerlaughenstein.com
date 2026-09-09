export interface AbilityScore {
  enhanced: number;
  unenhanced: number;
  mod: number;
}

export interface Attack {
  name: string;
  toHitRank: number;
  toHitStatMod: number;
  damageDice: string;
  damageStatMod: number;
  effects: string;
}

export interface SkillRow {
  name: string;
  rank: number;
  statMod: number;
  checkType: string;
}

export interface SkillUpgrade {
  text: string;
  checked: boolean;
}

export interface InventoryItem {
  name: string;
  quantity: number;
}

export interface GearSlots {
  head: string;
  torso: string;
  arms: string;
  handsHolding: string;
  legs: string;
  feet: string;
}

export interface HealthBarState {
  slotValue: number;
  /** index 0 = 10% (red, leftmost) ... index 9 = 100% (green, rightmost). true = marked off/lost. */
  marked: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
}

export interface CharacterSheet {
  id: string;
  name: string;
  raceName: string;
  genderPronouns: string;
  level: number;
  crawlerNumber: string;
  className: string;
  portraitUrl: string | null;
  health: HealthBarState;
  evade: { rank: number; dexMod: number; buffs: number };
  move: number;
  step: number;
  damageResistance: { armor: number; buffs: number };
  aiFavor: number;
  size: string;
  externalBuffs: [string, string, string];
  abilities: {
    strength: AbilityScore;
    intelligence: AbilityScore;
    constitution: AbilityScore;
    dexterity: AbilityScore;
    charisma: AbilityScore;
  };
  attacks: Attack[];
  hotlist: string[];
  gear: GearSlots;
  accessories: string[];
  skills: SkillRow[];
  skillUpgrades: SkillUpgrade[];
  inventoryNotes: string;
  inventoryItems: InventoryItem[];
  racialBenefits: string;
  classBenefits: string;
  notes: string;
}
