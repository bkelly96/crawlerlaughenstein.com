import { useState } from "react";
import type { HealthBarState } from "../../types/character";

const SLOT_COUNT = 10;

export function HealthBar({
  slotValue,
  marked,
  onChange,
}: {
  slotValue: number;
  marked: HealthBarState["marked"];
  onChange: (marked: HealthBarState["marked"]) => void;
}) {
  const [damageInput, setDamageInput] = useState("");

  const remainingSlots = marked.filter((isMarked) => !isMarked).length;
  const remainingPercent = remainingSlots * 10;

  function toggleSlot(index: number) {
    const next = [...marked] as HealthBarState["marked"];
    next[index] = !next[index];
    onChange(next);
  }

  function applyDamage() {
    const damage = Number(damageInput);
    if (!Number.isFinite(damage) || damage <= 0) return;

    const next = [...marked] as HealthBarState["marked"];
    let remaining = damage;
    // Mark off slots from the 100% (green) end toward the 10% (red) end.
    // Leftover damage below a slot's value is discarded, not carried over.
    for (let i = SLOT_COUNT - 1; i >= 0; i--) {
      if (next[i]) continue;
      if (remaining < slotValue) break;
      next[i] = true;
      remaining -= slotValue;
    }
    onChange(next);
    setDamageInput("");
  }

  return (
    <div>
      <div className="flex gap-1">
        {marked.map((isMarked, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggleSlot(i)}
            aria-pressed={isMarked}
            title={`${(i + 1) * 10}% slot`}
            className="relative flex-1 h-12 rounded border border-black/20 flex items-center justify-center text-sm font-semibold text-white"
            style={{ backgroundColor: `hsl(${(i / (SLOT_COUNT - 1)) * 120}, 65%, 42%)` }}
          >
            <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">{slotValue}</span>
            <span
              className={"absolute top-0.5 right-0.5 w-2.5 h-2.5 " + (isMarked ? "bg-black/80" : "bg-white/30")}
              style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
            />
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>10%</span>
        <span>100%</span>
      </div>
      <p className="mt-1 text-sm">
        <strong>{remainingPercent}%</strong> remaining ({remainingSlots}/{SLOT_COUNT} slots)
      </p>

      <div className="flex items-end gap-2 mt-2">
        <label className="flex flex-col text-sm gap-1">
          <span className="text-gray-600">Damage to apply</span>
          <input
            type="number"
            min={0}
            value={damageInput}
            onChange={(e) => setDamageInput(e.target.value)}
            className="w-32 border border-gray-300 rounded px-2 py-1"
          />
        </label>
        <button
          type="button"
          onClick={applyDamage}
          className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
        >
          Apply Damage
        </button>
      </div>
    </div>
  );
}
