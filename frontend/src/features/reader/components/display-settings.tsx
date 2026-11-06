"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReaderSettings } from "../hooks/use-reader-settings";
import { Segmented } from "@/components/ui/segmented";
import { Sheet } from "@/components/ui/sheet";
import type { FuriganaMode } from "../types";

const furiganaOptions: { value: FuriganaMode; label: string }[] = [
  { value: "hover", label: "On tap" },
  { value: "always", label: "Always" },
  { value: "off", label: "Off" },
];

/** Phone-only. Furigana is a setting you change once, not a control you reach
 *  for while reading, so it comes out of the page and stops competing with the
 *  passage for attention. */
export function DisplaySettings() {
  const { furigana, setFurigana } = useReaderSettings();
  const [open, setOpen] = useState(false);
  // Widening the window past the breakpoint puts these controls back in the
  // page, so the sheet holding them must not stay up as a stray modal.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-[var(--radius-control)] border border-accent bg-ground px-4 py-2 text-[15px] text-accent transition-colors hover:bg-tint"
      >
        Display
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} label="Display settings" height="auto">
        <div className="flex flex-col gap-5 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <h2 className="text-[19px] font-medium">Display</h2>

          <Field label="Furigana" hint="Readings above the kanji">
            <Segmented
              label="Furigana"
              size="sm"
              value={furigana}
              options={furiganaOptions}
              onChange={setFurigana}
            />
          </Field>
        </div>
      </Sheet>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[15px] font-medium">
        {label}
        <span className="ml-2 font-normal text-muted">{hint}</span>
      </p>
      {children}
    </div>
  );
}
