import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { RootDocument, rootViewport } from "@/components/root-document";
import { ReaderSettingsProvider } from "@/features/reader";

export const metadata: Metadata = {
  title: "Ippo — read Japanese at your level",
  description:
    "A reader that forecasts how much of every text you will understand, so you always read at the edge of what you know.",
};

export const viewport = rootViewport;

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootDocument lang="en">
      <ReaderSettingsProvider>
        <AppShell>{children}</AppShell>
      </ReaderSettingsProvider>
    </RootDocument>
  );
}
