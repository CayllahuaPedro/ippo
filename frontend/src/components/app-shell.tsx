"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/cn";
import { learner } from "@/lib/fixtures";

/** SRS is planned but not built, so it shows as a future section rather than
 *  as a link that goes nowhere. */
const nav = [
  { label: "SRS", href: null },
  { label: "Reader", href: "/reader" },
  { label: "Discover", href: "/discover" },
  { label: "Tutor", href: "/tutor" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const action =
    pathname === "/reader"
      ? { label: "Find your next read", href: "/discover" }
      : { label: "Continue reading", href: "/reader" };

  return (
    <div className="flex min-h-svh flex-col bg-ground text-ink">
      <header className="sticky top-0 z-40 flex h-[var(--header-h)] flex-none items-center gap-6 border-b border-hairline bg-ground px-4 sm:px-8 lg:gap-10 lg:px-12">
        <Link
          href="/reader"
          aria-label="Nihon AI"
          className="flex-none text-[19px] font-medium text-ink no-underline"
        >
          <span lang="ja" className="font-jp">
            日本
          </span>{" "}
          AI
        </Link>

        <nav aria-label="Sections" className="hidden items-stretch gap-7 self-stretch lg:flex">
          {nav.map((item) => (
            <DeskLink key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="flex-1" />

        <p className="hidden text-[14px] text-muted tabular-nums xl:block">
          {learner.knownWords.toLocaleString()} words known
        </p>
        <ThemeToggle />
        <Link
          href={action.href}
          className="flex-none rounded-[var(--radius-control)] bg-accent px-3.5 py-2 text-[15px] text-on-accent no-underline transition-colors hover:bg-accent-hover sm:px-[18px] sm:py-2.5"
        >
          {action.label}
        </Link>
      </header>

      {/* Grows with its content, so a long passage scrolls the page. Panels
          that scroll internally bound their own height rather than relying on
          a clamp here. */}
      <main className="flex flex-1 flex-col">{children}</main>

      {/* Phones get the sections as a thumb-reachable bar instead of a header
          row that would have to shrink past the point of being tappable. */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-30 flex flex-none border-t border-hairline bg-ground pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {nav.map((item) => (
          <TabLink key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>
    </div>
  );
}

type NavItem = (typeof nav)[number];

function Soon() {
  return (
    <span className="rounded-[4px] border border-hairline px-1 text-[12px] leading-[1.4] text-faint">
      soon
    </span>
  );
}

function DeskLink({ item, pathname }: { item: NavItem; pathname: string }) {
  if (!item.href) {
    return (
      <span
        aria-disabled="true"
        title="Planned, not built yet"
        className="flex cursor-default items-center gap-1.5 text-[15px] text-faint"
      >
        {item.label}
        <Soon />
      </span>
    );
  }

  const current = item.href === pathname;
  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "relative flex items-center text-[15px] no-underline transition-colors",
        current
          ? "font-medium text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-accent"
          : "text-muted hover:text-ink",
      )}
    >
      {item.label}
    </Link>
  );
}

function TabLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const shared =
    "relative flex h-[var(--tabbar-h)] flex-1 items-center justify-center gap-1.5 text-[14px] no-underline";

  if (!item.href) {
    return (
      <span aria-disabled="true" className={cn(shared, "cursor-default text-faint")}>
        {item.label}
        <Soon />
      </span>
    );
  }

  const current = item.href === pathname;
  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        shared,
        current
          ? "font-medium text-ink before:absolute before:inset-x-5 before:-top-px before:h-0.5 before:bg-accent"
          : "text-muted",
      )}
    >
      {item.label}
    </Link>
  );
}
