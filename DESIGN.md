---
name: Nihon AI
description: A Japanese reader that forecasts how much of every text you will understand.
colors:
  ground: "#ffffff"
  wash: "#f7f7fa"
  track: "#f4f5f7"
  ink: "#1b1547"
  muted: "#4b5165"
  faint: "#636880"
  hairline: "#e6e7ee"
  handle: "#c9cbd6"
  accent: "#6b5ce7"
  accent-hover: "#5a4bd6"
  tint: "#efedfc"
  on-accent: "#ffffff"
  scrim: "#1b1547"
  forecast-low: "#7fd8d0"
  forecast-mid: "#c9b8f0"
  forecast-high: "#5b4fd6"
  ground-dark: "#14122b"
  wash-dark: "#1c1a38"
  track-dark: "#2a2745"
  ink-dark: "#e8e6f5"
  muted-dark: "#a5a3bd"
  faint-dark: "#8f8daa"
  hairline-dark: "#2c2948"
  handle-dark: "#4a4668"
  accent-dark: "#8b7ff0"
  accent-hover-dark: "#a296f5"
  tint-dark: "#252050"
  on-accent-dark: "#14122b"
  scrim-dark: "#05040f"
  forecast-low-dark: "#6fd0c7"
  forecast-mid-dark: "#c3b1f2"
  forecast-high-dark: "#8b7ff0"
typography:
  forecast-figure:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "88px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  display-jp:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.25
  reading-jp:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 2.3
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  control: "8px"
  panel: "12px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "32px"
  gutter-desk: "48px"
  stack: "24px"
  section: "48px"
  card-pad: "20px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-outline:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.accent}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
  button-outline-hover:
    backgroundColor: "{colors.tint}"
  chip-suggestion:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
    typography: "{typography.caption}"
  input-composer:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "6px 6px 6px 16px"
  segmented-selected:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink}"
    padding: "8px 16px"
  panel:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px"
  header-bar:
    backgroundColor: "{colors.ground}"
    height: "72px"
  forecast-track:
    backgroundColor: "{colors.track}"
    height: "12px"
    width: "320px"
---

# Design System: Nihon AI

## Overview

**Creative North Star: "The Civic Prospectus"**

A plain, trustworthy bureau document about one question: how much of this text will you understand? Everything on the page is ink on a white (or deep indigo) ground, ruled with 1px hairlines, set in a quiet humanist sans for English and Zen Kaku Gothic New for Japanese. The only place the page spends colour is the comprehension forecast: a large tabular percentage above an uncertainty band that runs teal to lilac to violet. Violet otherwise appears only where you can act.

Density is calm and editorial. The reading column is held to about 36 Japanese characters with generous line height so furigana has room above the line. Surfaces are flat and separated by hairlines rather than fills; a panel is a 12px-radius hairline box, never a card inside a card. Elevation is reserved for things that float over the text: the word popup, the floating action on phones, and the bottom sheet.

Dark is a token swap, never a component fork: the same world at night on a deep indigo ground (#14122b), reached by an explicit theme choice or by the system preference when no choice was made. The world refuses the JLPT-badge-on-a-card arrangement and the warm "Japan app" palette; the text's own level is stated in muted metadata, kept apart from the personal forecast.

**Key Characteristics:**
- Ink (never pure black) on white; deep indigo ground in dark.
- Colour budget: the forecast gradient, plus the violet interactive accent.
- 1px hairlines as the main structural device; two radii only (8px controls, 12px panels).
- Figtree 400/500 for UI, Zen Kaku Gothic New 400/500 for Japanese; no bold anywhere.
- Word state carried by underline style (none, dotted, solid), not by hue.
- One shadow token, used only on elements that float above the text.

## Colors

A cool, near-monochrome indigo palette with one violet voice and a single three-stop gradient reserved for the forecast. Every token has a light and a dark value (`-dark` keys); components reference the role, and the theme swaps the value.

### Primary
- **Prospectus Violet** (accent; accent-dark): fills the one primary action per view (header action, Add to SRS, composer send, phone floating action), outlines secondary actions, draws the current-nav underline, the focus ring (2px, 2px offset), the caret, and word-state underlines. Hover deepens in light (accent-hover) and lightens in dark (accent-hover-dark).
- **Violet Tint** (tint; tint-dark): selected word background, selected segment, text selection, outline-button hover. The only violet fill that sits behind text.
- **On Accent** (on-accent; on-accent-dark): text on violet fills; white in light, the indigo ground in dark.

### Tertiary
- **Forecast Teal / Lilac / Deep Violet** (forecast-low, forecast-mid, forecast-high and their `-dark` values): the three stops of the uncertainty band, left to right, filling only the likely range on the 0 to 100 track. Never used as a status colour, a fill, or a chart series elsewhere.

### Neutral
- **Bureau Ink** (ink; ink-dark): all primary text, the forecast figure, the point-estimate tick on the band.
- **Muted Slate** (muted; muted-dark): secondary text, metadata, furigana, inactive nav, the English subtitle.
- **Faint Slate** (faint; faint-dark): placeholders, disabled labels, the abstained-forecast dash, "soon" markers.
- **Paper White / Night Indigo** (ground; ground-dark): page, header, tab bar, panels and sheets.
- **Wash** (wash; wash-dark): learner chat bubbles, icon-button hover, disabled button fill.
- **Track** (track; track-dark): the empty forecast track and disabled send button.
- **Hairline** (hairline; hairline-dark): every 1px rule, border and column rule.
- **Handle** (handle; handle-dark): sheet grab handle and scrollbar thumb.
- **Scrim** (scrim; scrim-dark): sheet backdrop at 50% opacity.

### Named Rules
**The Forecast Spends the Colour Rule.** The teal-lilac-violet gradient appears only inside the forecast band. If a surface has colour that is neither the forecast nor something you can act on, it is wrong.

**The One Violet Rule.** Violet means "interactive" or "your current state". It is never decoration, never a heading colour, never a background panel.

**The Token Swap Rule.** Dark mode changes token values only. A component never branches on theme.

## Typography

**Display Font:** Zen Kaku Gothic New (with Hiragino Sans, Noto Sans JP, sans-serif) for all Japanese text
**Body Font:** Figtree (with system-ui, sans-serif) for all UI and English text

**Character:** A friendly geometric-humanist sans paired with a clean Japanese gothic; both capped at weight 500 so hierarchy comes from size and colour, not heaviness.

### Hierarchy
- **Forecast figure** (500, 56/72/88px by breakpoint in large blocks, 44px in cards; line-height 1; -0.03em; tabular figures): the comprehension percentage. The largest English thing on any page.
- **Display JP** (500, 40px phone / 56px up; 1.1; 0.01em): the passage title. The English title sits beneath it in muted Figtree 400 at 20/24px.
- **Headline** (500, 32/40px on Discover, 28/36px on Tutor; leading tight; -0.01em): page titles.
- **Title** (500, 22px): shelf and section headings; 19px for the brand mark and panel headings.
- **Reading JP** (400, 20px phone / 23px up, line-height 2.3, max 36em): the passage in "learn" layout; "book" layout is 19/23px at 2.2 and justified; the compact two-column layout is 17/19px at 2.0. Furigana is 0.5em, weight 400, muted.
- **Body** (400, 16px, 1.55): default text and chat turns (16px at 1.6).
- **Label** (400 or 500, 15px): buttons, nav, forecast caption, card metadata. The most-used size.
- **Caption** (400, 14px): margin notes, legend, hints, tab bar.

### Named Rules
**The Medium Ceiling Rule.** Only weights 400 and 500 are loaded and used. Emphasis is 500 plus ink colour; nothing is bold.

**The Tabular Numbers Rule.** Every percentage, range and count is set with tabular figures.

## Layout

A sticky header (56px on phones, 72px from 1024px) carries the mark, section nav, the theme toggle and a single filled violet action; below 1024px the nav moves to a fixed bottom tab bar (56px) padded by the safe-area inset. Header and tab-bar heights are exposed as `--header-h` and `--tabbar-h` so internally scrolling panels can bound themselves.

Page gutters step 16px, 32px (from 640px), 48px (from 1024px). Vertical rhythm uses 24px within a group and 48px between sections. The Reader is a two-column grid on desktop (fluid text column plus a 320px word panel) with a 140px muted margin note beside the passage from 1280px; the passage itself is capped at 36em. Discover is centred at 1240px max with a 1, 2, 3-column card grid; Tutor is centred at 760px. Running prose is capped near 52 to 60ch. Phones get bottom sheets instead of side rails and popups.

## Elevation & Depth

Flat by default. Structure comes from 1px hairlines and the wash tone, not from shadows. One shadow token, `float`, lifts only what floats over the reading surface: the desktop word popup and the phone floating action. Sheets rise from the bottom over a 50% scrim instead of casting shadow.

### Shadow Vocabulary
- **Float, light** (`box-shadow: 0 12px 32px -12px rgb(27 21 71 / 0.18)`): ink-tinted, soft, below the element.
- **Float, dark** (`box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.55)`): deeper and black so it reads on the indigo ground.

### Named Rules
**The Only-What-Floats Rule.** A shadow means "this sits above the text and will go away". Cards, panels in the layout flow and the header never carry one.

## Shapes

Two radii. Controls (buttons, inputs, chips, segmented groups, icon buttons) are 8px; panels (word popup, recommendation cards, chat bubbles, top of sheets) are 12px. Nested elements step down (segment buttons 6px inside an 8px group; word hit areas 3px). Borders are always 1px hairline; the selected or focused state upgrades the border to violet, optionally with a 1px violet ring. The forecast band and its track are square-ended. Icons are custom 20px line drawings at 1.75 stroke with round caps, drawn in `currentColor`.

## Components

### Buttons
- **Shape:** gently rounded (8px).
- **Primary:** violet fill, on-accent text, 15px label, 10px by 18px to 20px padding (8px by 14px on phones in the header). One per view.
- **Hover / Focus:** fill shifts to accent-hover via colour transition; focus is the global 2px violet outline at 2px offset.
- **Outline:** ground fill, 1px violet border, violet text; hover fills with tint.
- **Disabled:** wash fill, hairline border, muted text; send button disables to track fill and faint icon.
- **Icon button:** 36 to 40px square, muted icon; hover adds wash and ink.
- **Theme toggle:** a 40px icon button in the header on every width, the app's only theme control. It shows the moon in light and the sun in dark (where a click leads), picked by CSS so first paint is right; hover adds wash and turns the icon violet. The choice is global and persisted; with none stored, the system decides.

### Chips
- **Style:** suggestion prompts above the tutor composer: ground fill, 1px hairline, 8px radius, 14px ink text.
- **State:** hover turns border and text violet; disabled goes faint.
- **Soon marker:** a 4px-radius hairline tag at 12px faint text marks a planned, unbuilt section.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** ground.
- **Shadow Strategy:** none in flow; see Elevation.
- **Border:** 1px hairline; internal sections divided by a hairline rule.
- **Internal Padding:** 20px for recommendation cards, 22px for the word popup.

### Inputs / Fields
- **Style:** composer is a ground-filled, 1px hairline, 8px container wrapping a 16px borderless input and a 40px violet send button.
- **Focus:** the container border turns violet with a 1px violet ring (`focus-within`); placeholder is faint.
- **Segmented control:** hairline 8px group with 2px inner padding; the selected segment gets tint fill, medium weight and a 1px inset violet ring; unselected segments are muted, ink on hover.

### Navigation
- **Desktop:** Figtree 15px links in the header; current is ink at 500 with a 2px violet underline sitting on the header hairline; others muted, ink on hover.
- **Phone:** fixed bottom tab bar, 14px labels; current is ink at 500 with a 2px violet bar on its top edge.

### Forecast Block (signature)
The one place the page spends colour. A large tabular percentage in ink; beneath it a 12px-tall, up-to-320px track in the track tone; the likely range filled with the teal to lilac to violet gradient; a 2px ink tick extending 4px past the band at the point estimate; then a 15px muted caption "you'll understand · likely 66–88%". When the model abstains, the figure becomes a faint dash, the track stays empty and the caption says so. Aligns right on desktop in the Reader header, left elsewhere.

### Word Marks (signature)
Word state reads from underline style: known carries no mark; learning gets a 2px dotted violet underline; selected gets a 3px solid violet underline over the tint fill. Underline offset is 0.32em so it clears the text. A legend sets the kanji 字 in each style beside its label. Furigana is hidden until hover by default, shown for the selected word on touch, and can be set to always or off.

### Bottom Sheet
Native dialog rising from the bottom (sheet-rise, 0.22s ease-out) over a 50% scrim (veil-in, 0.18s); 12px top corners, hairline top border, a 40 by 4px handle. Default height 78svh.

## Do's and Don'ts

### Do:
- **Do** keep colour to the forecast gradient and the violet accent; everything else is ink, muted, faint and hairline.
- **Do** state the text's own level ("Text level N4") as muted metadata, separate from the personal forecast.
- **Do** mark word state with underline style (none, dotted 2px, solid 3px), so it survives colour-vision differences.
- **Do** use 8px for controls and 12px for panels, with 1px hairline borders.
- **Do** set every number tabular, and cap weight at 500.
- **Do** define both a light and a dark value for any new colour token and swap them at the root.
- **Do** honour reduced motion; all animation and transition collapses to near zero.

### Don't:
- **Don't** put a JLPT badge on a card or tint a card by level.
- **Don't** use warm "Japan app" palettes (reds, cream, terracotta) or pure black text.
- **Don't** nest a card inside a card.
- **Don't** use the forecast gradient anywhere outside the forecast band.
- **Don't** add shadows to anything that sits in the layout flow.
- **Don't** fork a component for dark mode.
