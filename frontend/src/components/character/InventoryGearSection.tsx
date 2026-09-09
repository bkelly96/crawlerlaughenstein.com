import type { CharacterSheet, GearSlots, InventoryItem } from "../../types/character";
import { NumberField } from "./fields";

const GEAR_SLOT_LABELS: { key: keyof GearSlots; label: string }[] = [
  { key: "head", label: "Head" },
  { key: "torso", label: "Torso" },
  { key: "arms", label: "Arms" },
  { key: "handsHolding", label: "Hands/Holding" },
  { key: "legs", label: "Legs" },
  { key: "feet", label: "Feet" },
];

const EMPTY_ITEM: InventoryItem = { name: "", quantity: 0 };

export function InventoryGearSection({
  character,
  onChange,
}: {
  character: CharacterSheet;
  onChange: (patch: Partial<CharacterSheet>) => void;
}) {
  function updateGearSlot(key: keyof GearSlots, value: string) {
    onChange({ gear: { ...character.gear, [key]: value } });
  }

  function updateAccessory(index: number, value: string) {
    const next = [...character.accessories];
    next[index] = value;
    onChange({ accessories: next });
  }

  function updateHotlist(index: number, value: string) {
    const next = [...character.hotlist];
    next[index] = value;
    onChange({ hotlist: next });
  }

  function updateItem(index: number, patch: Partial<InventoryItem>) {
    onChange({ inventoryItems: character.inventoryItems.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
  }
  function addItem() {
    onChange({ inventoryItems: [...character.inventoryItems, { ...EMPTY_ITEM }] });
  }
  function removeItem(index: number) {
    onChange({ inventoryItems: character.inventoryItems.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-semibold mb-2">Gear Slots / Tattoos / Patches</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {GEAR_SLOT_LABELS.map(({ key, label }) => (
            <label key={key} className="flex flex-col text-sm gap-1">
              <span className="text-gray-600">{label}</span>
              <textarea
                value={character.gear[key]}
                onChange={(e) => updateGearSlot(key, e.target.value)}
                rows={2}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Accessories (Max 10)</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {character.accessories.map((accessory, i) => (
            <input
              key={i}
              type="text"
              value={accessory}
              onChange={(e) => updateAccessory(i, e.target.value)}
              placeholder={`Accessory ${i + 1}`}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Hotlist</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {character.hotlist.map((entry, i) => (
            <input
              key={i}
              type="text"
              value={entry}
              onChange={(e) => updateHotlist(i, e.target.value)}
              placeholder={`Hotlist ${i + 1}`}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Inventory Notes</h3>
        <textarea
          value={character.inventoryNotes}
          onChange={(e) => onChange({ inventoryNotes: e.target.value })}
          rows={4}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Inventory Items</h3>
          <button type="button" onClick={addItem} className="text-sm px-2 py-1 rounded bg-purple-600 text-white">
            Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[22rem]">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="py-2 pr-4">Item</th>
                <th className="py-2 pr-4">Quantity</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {character.inventoryItems.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(i, { name: e.target.value })}
                      className="w-40 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <NumberField value={item.quantity} onChange={(v) => updateItem(i, { quantity: v })} />
                  </td>
                  <td className="py-2">
                    <button type="button" onClick={() => removeItem(i)} className="text-red-600 text-sm">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
