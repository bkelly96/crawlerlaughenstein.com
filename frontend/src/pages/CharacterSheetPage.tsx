import { useState } from "react";
import { Link } from "react-router-dom";
import { CharacterSheetTabs, type CharacterTabId } from "../components/character/CharacterSheetTabs";
import { mockCharacter } from "../mocks/character";

export function CharacterSheetPage() {
  const character = mockCharacter;
  const [activeTab, setActiveTab] = useState<CharacterTabId>("overview");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{character.name}</h1>
        <Link to="/dashboard/player" className="text-sm text-purple-700 hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <CharacterSheetTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="py-6">
        {activeTab === "overview" && <Placeholder label="Overview & Combat" />}
        {activeTab === "abilities" && <Placeholder label="Abilities" />}
        {activeTab === "attacks-skills" && <Placeholder label="Attacks & Skills" />}
        {activeTab === "inventory-gear" && <Placeholder label="Inventory & Gear" />}
        {activeTab === "race-class" && <Placeholder label="Race & Class" />}
        {activeTab === "notes" && <Placeholder label="Notes" />}
      </div>
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return <p className="text-gray-500 italic">{label} — coming soon.</p>;
}
