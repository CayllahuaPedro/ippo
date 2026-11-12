import { RootDocument, rootViewport } from "@/components/root-document";

export const viewport = rootViewport;

export default function EsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
