# Nylon Steps

Nylon Steps is an interactive guitar scale practice app for learning scales, modes, fretboard positions, and related chord shapes. It is built as a React and Vite single-page app with an interactive fretboard, practice sequencing, saved student profiles, and browser-based audio playback.

## What It Does

The app helps guitar players practice scale shapes in a focused, position-based workflow:

- Explore common guitar scales and modes on a visual fretboard.
- Practice by fretboard position, including open, III, V, VII, IX, and XII positions.
- Show notes, scale degrees, finger numbers, or root notes only.
- Play scale practice sequences with browser audio powered by Tone.js.
- Review related chords for each scale with chord diagrams and fingerings.
- Track practice progress through saved local profiles.
- Use a responsive interface with desktop sidebar navigation and mobile navigation.

## Included Scales

Nylon Steps currently includes 12 scale and mode studies:

- A Minor Pentatonic
- C Major
- A Natural Minor
- E Harmonic Minor
- A Blues
- D Dorian
- E Phrygian
- F Lydian
- G Mixolydian
- B Locrian
- E Phrygian Dominant
- C Major Pentatonic

Each scale defines its root, interval formula, pitch intervals, default practice position, educational description, and related chord options.

## Main Features

### Interactive Fretboard

The fretboard maps each scale across standard guitar tuning and highlights the notes available in the selected position. The display can be switched between note names, scale degrees, finger numbers, and root-only views.

### Practice Room

The practice room creates playable note sequences from the selected scale and position. Users can practice ascending, descending, or combined movement while controlling playback and display preferences.

### Scale Library

The library groups scales by category:

- Major & Modes
- Minor & Harmonic
- Pentatonic & Blues

Each scale card includes the scale identity, formula, description, and a quick path into practice.

### Related Chords

Every scale links to a curated set of chord shapes that fit the scale. Chord diagrams include fret positions, muted/open strings, and finger numbers.

### Local Profiles

Profiles are stored in the browser using local storage. Each profile keeps the selected scale, practice preferences, progress data, and personalized settings.

## Tech Stack

- React 18
- Vite
- Tone.js
- lucide-react icons
- Plain CSS
- Browser local storage

## Project Structure

```text
.
+-- index.html
+-- package.json
+-- public/
|   +-- robots.txt
|   +-- sitemap.xml
+-- scripts/
|   +-- validate-scales.mjs
+-- src/
    +-- main.jsx
    +-- styles.css
```

Key implementation areas:

- `src/main.jsx` contains the app data, scale helpers, profile state, audio hook, routing state, and React components.
- `src/styles.css` contains the responsive app layout and visual system.
- `scripts/validate-scales.mjs` validates scale formulas, interval spelling, fretboard mapping, chord notes, and related chord references.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Validate music data:

```bash
npm run validate:scales
```

## Data Validation

The project includes a validation script to keep the music data reliable. It checks:

- Scale IDs are unique.
- Scale formulas match expected formulas.
- Interval arrays match the formulas.
- Spelled notes match each scale root and mode.
- Fretboard pitch classes map correctly across 19 frets.
- Chord fingerings produce the expected chord notes.
- Related chord names point to existing chord definitions.

Current validation result:

```text
Validated 12 scales and 24 chord shapes: formulas, intervals, note spelling, fretboard mapping and chord fingerings are consistent.
```

## SEO

The HTML entry point includes metadata for search engines and social sharing, plus structured data for the website, web application, and included guitar scales.

## Knowledge Graph

This repository has Graphify enabled. The generated project graph lives in `graphify-out/` and includes:

- `graphify-out/graph.html` for interactive graph navigation
- `graphify-out/graph.json` for raw graph data
- `graphify-out/GRAPH_REPORT.md` for the architecture report

After code changes, update the graph with:

```bash
graphify update .
```
