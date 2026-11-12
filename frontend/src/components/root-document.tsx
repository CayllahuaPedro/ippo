import type { Viewport } from "next";
import { Figtree, Zen_Kaku_Gothic_New } from "next/font/google";
import { cn } from "@/lib/cn";
import { themeBootScript } from "@/lib/theme";
import "@/app/globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-figtree",
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-zen-kaku",
  display: "swap",
  preload: false,
});

/* `viewport-fit=cover` lets the tab bar and sheets paint into the home-indicator
   area, which the safe-area insets then pad back. */
export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#14122b" },
  ],
};

export function RootDocument({
  lang,
  children,
}: {
  lang: "en" | "es";
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      className={cn(figtree.variable, zenKaku.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
