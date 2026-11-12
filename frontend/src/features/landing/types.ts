export type Locale = "en" | "es";

export type LandingCopy = {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; lede: string };
  waitlist: {
    label: string;
    placeholder: string;
    button: string;
    finePrint: string;
    invalid: string;
    success: string;
    closed: string;
    error: string;
  };
  demo: {
    forecast: string;
    hint: string;
    known: string;
    learning: string;
    markKnown: string;
    markLearning: string;
    close: string;
  };
  method: {
    label: string;
    title: string;
    body: string;
    tooEasy: string;
    nextStep: string;
    tooHard: string;
    caption: string;
  };
  helps: {
    label: string;
    title: string;
    items: { title: string; body: string }[];
  };
  status: {
    label: string;
    title: string;
    todayTitle: string;
    today: string[];
    nextTitle: string;
    next: string[];
    preview: string;
  };
  closing: { title: string };
  footer: { openSource: string; repoUrl: string };
  switcher: { label: string; footerLabel: string };
};

export type LandingMetadata = {
  title: string;
  description: string;
  metadataBase: URL;
  alternates: {
    canonical: string;
    languages: Record<"en" | "es" | "x-default", string>;
  };
  openGraph: { title: string; description: string; locale: string };
};
