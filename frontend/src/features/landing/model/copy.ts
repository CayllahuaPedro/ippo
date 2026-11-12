import type { LandingCopy, Locale } from "../types";

const repoUrl = "https://github.com/CayllahuaPedro/ippo";

const en: LandingCopy = {
  meta: {
    title: "Ippo: read Japanese at the edge of what you know",
    description:
      "Ippo forecasts how much of every Japanese text you'll understand, so each thing you read is one step past your level. Join the waitlist.",
  },
  hero: {
    eyebrow: "一歩 · one step",
    title: "Read Japanese at the edge of what you know.",
    lede: "Ippo forecasts how much of every text you'll understand, so each thing you read is one step past your level.",
  },
  waitlist: {
    label: "Email",
    placeholder: "you@example.com",
    button: "Join the waitlist",
    finePrint: "One email when it opens. Nothing else.",
    invalid: "Enter a valid email address.",
    success: "You're on the list. We'll email you once when it opens.",
    closed: "The waitlist isn't open yet.",
    error: "Something went wrong. Try again in a moment.",
  },
  demo: {
    forecast: "You'll understand about {pct}%",
    hint: "Tap a word to mark it.",
    known: "Known",
    learning: "Learning",
    markKnown: "I know it",
    markLearning: "Learning",
    close: "Close",
    lookUp: "Look up {word}",
  },
  method: {
    label: "The method",
    title: "The immersion community already knows how fluency happens.",
    body: "Krashen called it i+1: you acquire a language from input that sits just one step above your level. Text that is too easy teaches nothing, and text that is too hard teaches nothing either. The hard part is finding the next step, and that is what Ippo measures.",
    tooEasy: "Too easy",
    nextStep: "Your next step",
    tooHard: "Too hard",
    caption: "Example: a learner around N4",
  },
  helps: {
    label: "How Ippo helps",
    title: "Less hunting, more reading.",
    items: [
      {
        title: "Find what to read",
        body: "Discover ranks texts by how much of them you'll understand, not by a JLPT label.",
      },
      {
        title: "Understand without leaving the page",
        body: "Tap a word for its reading and meaning, in Ippo and on any site with Ippo for Chrome.",
      },
      {
        title: "Get unstuck",
        body: "Ask the tutor about a word, a grammar point or a sentence. It answers at your level.",
      },
    ],
  },
  snippets: {
    shelf: {
      title: "Comfortable",
      band: "90%+ expected",
      guidance: "read for pleasure, look up almost nothing",
      format: "Format",
      source: "Source",
      notes: "Notes",
      empty: "Nothing of this type on this shelf.",
      kinds: { video: "video", article: "article", book: "book" },
      noForecast: "No forecast",
      abstains: "No forecast · the model abstains on this text",
      understand: "you'll understand · likely {low}–{high}%",
    },
    entry: {
      derivation: "From the form in the text to the dictionary form",
      cardFront: "Card front",
      cardBack: "back: gloss and this sentence",
      frequencyRank: "frequency rank",
      addToSrs: "Add to SRS",
      inSrs: "In your SRS",
      askTutor: "Ask the tutor",
      states: { known: "known", learning: "learning", selected: "selected" },
    },
  },
  status: {
    label: "Where it stands",
    title: "Honest about what exists.",
    todayTitle: "Working today",
    today: [
      "Reader with forecasts",
      "Discover",
      "Level-aware tutor",
      "Ippo for Chrome",
    ],
    nextTitle: "Coming next",
    next: [
      "Spaced repetition",
      "Mining queue",
      "Progress",
      "Your learner model, synced",
    ],
    preview: "Preview",
  },
  closing: { title: "Take the first step." },
  footer: { openSource: "open source (AGPL)", repoUrl },
  switcher: { label: "Language", footerLabel: "Footer language" },
};

const es: LandingCopy = {
  meta: {
    title: "Ippo: lee japonés al borde de lo que sabes",
    description:
      "Ippo calcula cuánto entenderás de cada texto en japonés, para que todo lo que leas esté un paso por encima de tu nivel. Únete a la lista de espera.",
  },
  hero: {
    eyebrow: "一歩 · un paso",
    title: "Lee japonés al borde de lo que sabes.",
    lede: "Ippo calcula cuánto entenderás de cada texto, para que todo lo que leas esté un paso por encima de tu nivel.",
  },
  waitlist: {
    label: "Correo electrónico",
    placeholder: "tu@correo.com",
    button: "Unirme a la lista de espera",
    finePrint: "Un correo cuando abra. Nada más.",
    invalid: "Escribe un correo válido.",
    success: "Ya estás en la lista. Te escribiremos una sola vez cuando abra.",
    closed: "La lista de espera aún no está abierta.",
    error: "Algo salió mal. Inténtalo de nuevo en un momento.",
  },
  demo: {
    forecast: "Entenderás cerca de un {pct}%",
    hint: "Toca una palabra para marcarla.",
    known: "Conocida",
    learning: "Aprendiendo",
    markKnown: "La conozco",
    markLearning: "Aprendiendo",
    close: "Cerrar",
    lookUp: "Buscar {word}",
  },
  method: {
    label: "El método",
    title: "La comunidad de inmersión ya sabe cómo se llega a la fluidez.",
    body: "Krashen lo llamó i+1: adquieres un idioma a partir de material que está un solo paso por encima de tu nivel. Un texto demasiado fácil no enseña nada, y uno demasiado difícil tampoco. Lo difícil es encontrar el siguiente paso, y eso es lo que mide Ippo.",
    tooEasy: "Demasiado fácil",
    nextStep: "Tu siguiente paso",
    tooHard: "Demasiado difícil",
    caption: "Ejemplo: un estudiante de nivel N4",
  },
  helps: {
    label: "Cómo ayuda Ippo",
    title: "Menos buscar, más leer.",
    items: [
      {
        title: "Encuentra qué leer",
        body: "Discover ordena los textos según cuánto entenderás de ellos, no según una etiqueta JLPT.",
      },
      {
        title: "Entiende sin salir de la página",
        body: "Toca una palabra para ver su lectura y su significado, en Ippo y en cualquier sitio con Ippo for Chrome.",
      },
      {
        title: "Sal del atasco",
        body: "Pregunta al tutor por una palabra, un punto de gramática o una oración. Responde a tu nivel.",
      },
    ],
  },
  snippets: {
    shelf: {
      title: "Cómodos",
      band: "90%+ esperado",
      guidance: "lee por placer, casi sin buscar nada",
      format: "Formato",
      source: "Fuente",
      notes: "Notas",
      empty: "Nada de este tipo en este estante.",
      kinds: { video: "video", article: "artículo", book: "libro" },
      noForecast: "Sin pronóstico",
      abstains: "Sin pronóstico · el modelo se abstiene con este texto",
      understand: "entenderás · probable {low}–{high}%",
    },
    entry: {
      derivation: "De la forma en el texto a la forma del diccionario",
      cardFront: "Anverso de la tarjeta",
      cardBack: "reverso: significado y esta oración",
      frequencyRank: "rango de frecuencia",
      addToSrs: "Añadir al SRS",
      inSrs: "En tu SRS",
      askTutor: "Preguntar al tutor",
      states: { known: "conocida", learning: "aprendiendo", selected: "seleccionada" },
    },
  },
  status: {
    label: "Dónde estamos",
    title: "Sinceros sobre lo que existe.",
    todayTitle: "Funciona hoy",
    today: [
      "Lector con pronósticos",
      "Discover",
      "Tutor que se adapta a tu nivel",
      "Ippo for Chrome",
    ],
    nextTitle: "Lo que viene",
    next: [
      "Repetición espaciada",
      "Cola de minado",
      "Progreso",
      "Tu modelo de aprendizaje, sincronizado",
    ],
    preview: "Versión preliminar",
  },
  closing: { title: "Da el primer paso." },
  footer: { openSource: "código abierto (AGPL)", repoUrl },
  switcher: { label: "Idioma", footerLabel: "Idioma del pie de página" },
};

export const copy: Record<Locale, LandingCopy> = { en, es };

export function formatTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function formatForecast(template: string, pct: number): string {
  return template.replace("{pct}", String(pct));
}
