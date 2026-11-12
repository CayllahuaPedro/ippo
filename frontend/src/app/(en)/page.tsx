import type { Metadata } from "next";
import { LandingPage, landingMetadata } from "@/features/landing";

export const metadata: Metadata = landingMetadata("en");

export default function Page() {
  return <LandingPage locale="en" />;
}
