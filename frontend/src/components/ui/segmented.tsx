"use client";

import { cn } from "@/lib/cn";

type SegmentedProps<T extends string> = {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  size?: "sm" | "md";
};

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  size = "md",
}: SegmentedProps<T>) {
  const padding = size === "sm" ? "px-3 py-1.5 text-[14px]" : "px-4 py-2 text-[15px]";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex max-w-full gap-0.5 overflow-x-auto rounded-[var(--radius-control)] border border-hairline bg-ground p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              padding,
              "flex-none cursor-pointer rounded-[6px] transition-colors",
              selected
                ? "bg-tint font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-accent)]"
                : "text-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
