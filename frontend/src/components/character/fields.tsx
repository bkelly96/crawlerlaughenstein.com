export function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col text-sm gap-1">
      <span className="text-gray-600">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const input = (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-20 border border-gray-300 rounded px-2 py-1"
    />
  );

  if (!label) return input;

  return (
    <label className="flex flex-col text-sm gap-1">
      <span className="text-gray-600">{label}</span>
      {input}
    </label>
  );
}
