export type CharacterTabId =
  | "overview"
  | "abilities"
  | "attacks-skills"
  | "inventory-gear"
  | "race-class"
  | "notes";

const TABS: { id: CharacterTabId; label: string }[] = [
  { id: "overview", label: "Overview & Combat" },
  { id: "abilities", label: "Abilities" },
  { id: "attacks-skills", label: "Attacks & Skills" },
  { id: "inventory-gear", label: "Inventory & Gear" },
  { id: "race-class", label: "Race & Class" },
  { id: "notes", label: "Notes" },
];

export function CharacterSheetTabs({
  activeTab,
  onChange,
}: {
  activeTab: CharacterTabId;
  onChange: (tab: CharacterTabId) => void;
}) {
  return (
    <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-300">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={
            "shrink-0 px-4 py-3 text-sm font-medium border-b-2 -mb-px " +
            (activeTab === tab.id
              ? "border-purple-500 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-800")
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
