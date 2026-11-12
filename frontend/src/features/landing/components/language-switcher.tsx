"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Locale } from "../types";

type LanguageSwitcherProps = { locale: Locale; label: string };

const options: { locale: Locale; href: string; text: string }[] = [
  { locale: "en", href: "/", text: "EN" },
  { locale: "es", href: "/es", text: "ES" },
];

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  return (
    <nav aria-label={label} className="flex items-center gap-3 text-[14px]">
      {options.map((option) => (
        <Link
          key={option.locale}
          href={option.href}
          hrefLang={option.locale}
          aria-current={option.locale === locale ? "true" : undefined}
          onClick={(event) => {
            if (!window.location.hash) return;
            event.preventDefault();
            window.location.assign(option.href + window.location.hash);
          }}
          className={cn(
            "no-underline",
            option.locale === locale ? "text-ink" : "text-faint hover:text-ink",
          )}
        >
          {option.text}
        </Link>
      ))}
    </nav>
  );
}
