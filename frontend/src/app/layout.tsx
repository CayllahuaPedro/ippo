import type { Metadata, Viewport } from "next";
import { Figtree, Zen_Kaku_Gothic_New } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/cn";
import { ReaderSettingsProvider } from "@/features/reader";
import { themeBootScript } from "@/lib/theme";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Ippo — read Japanese at your level",
  description:
    "A reader that forecasts how much of every text you will understand, so you always read at the edge of what you know.",
};

/* `viewport-fit=cover` lets the tab bar and sheets paint into the home-indicator
   area, which the safe-area insets then pad back. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#14122b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(figtree.variable, zenKaku.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <ReaderSettingsProvider>
          <AppShell>{children}</AppShell>
        </ReaderSettingsProvider>
      </body>
    </html>
  );
}
