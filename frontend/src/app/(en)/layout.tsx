import { RootDocument, rootViewport } from "@/components/root-document";

export const viewport = rootViewport;

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
