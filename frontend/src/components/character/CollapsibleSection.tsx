import { useState, type ReactNode } from "react";

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border border-gray-200 rounded">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold"
      >
        <span>{title}</span>
        <span className={"transition-transform " + (open ? "rotate-180" : "")} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
}
