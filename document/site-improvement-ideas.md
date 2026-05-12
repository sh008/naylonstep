# Nylon Steps - Site Improvement Ideas

Printable review document

Date: 2026-05-12

Purpose: This document lists improvement ideas for Nylon Steps from two viewpoints: a music education specialist and a software/product engineering specialist. The goal is to help decide which ideas are worth implementing next.

## Executive Summary

Nylon Steps already has a strong base: interactive scale practice, position-based fretboard learning, related chord shapes, local profiles, and audio playback. The next improvements should make the app more useful as a learning path, not only as a scale viewer.

Recommended first implementation batch:

1. Add guided practice goals for each scale.
2. Add interval ear and visual recognition drills.
3. Add a metronome and tempo progression system.
4. Add fretboard note quiz mode.
5. Split music data from UI code for easier maintenance.
6. Add automated tests around scale generation and fretboard logic.

These changes improve the educational value while keeping the technical risk controlled.

## Current Product Strengths

- Clear focus on guitar scales, modes, positions, and related chords.
- Useful scale set covering major, minor, pentatonic, blues, harmonic minor, and modes.
- Interactive fretboard with note names, scale degrees, finger numbers, and root-only views.
- Related chord diagrams make the scale-to-harmony connection visible.
- Tone.js audio gives the app a practical practice component.
- Local profiles allow the app to remember student preferences and progress.
- Existing validation script protects music theory data from accidental mistakes.

## Current Limitations

- The app explains scale data, but it does not yet guide a full learning sequence.
- Practice playback exists, but there is no metronome, tempo target, or structured repetition plan.
- The student can see notes, but there are no quiz modes to test recall.
- There is no ear-training layer for hearing intervals, roots, modes, or chord-scale relationships.
- Most application data and UI live in one large `src/main.jsx` file, which will become harder to maintain as features grow.
- Progress exists locally, but it could become more meaningful with measurable practice sessions and achievements.

## Music Education Specialist Ideas

### 1. Guided Practice Plans

Create structured practice plans for each scale: warm-up, slow accuracy, position shift, root targeting, sequence pattern, and improvisation prompt.

Student value: Beginners often do not know what to do after opening a scale diagram. A guided plan turns the app into a teacher-like workflow.

Implementation notes: Add a `practicePlan` field to each scale and render it in the practice room.

Priority: High

Difficulty: Medium

### 2. Interval Recognition Mode

Add a mode where the student identifies intervals inside the selected scale, such as root to b3, root to 5, or b7 to root.

Student value: Scale learning becomes musical instead of purely visual. This improves improvisation and fretboard understanding.

Implementation notes: Use existing scale interval data and Tone.js playback. Ask the student to choose the interval label or target note.

Priority: High

Difficulty: Medium

### 3. Root Note Mastery Drill

Add a root-only drill where the app highlights or asks for root locations across the fretboard.

Student value: Root awareness is one of the fastest ways to make scale practice useful in real music.

Implementation notes: The app already has root-only display behavior, so this can become an active quiz mode.

Priority: High

Difficulty: Low

### 4. Fretboard Note Quiz

Show a fret/string position and ask the student to name the note, or show a note and ask the student to find it on the fretboard.

Student value: Builds fretboard fluency beyond memorizing scale boxes.

Implementation notes: Reuse `TUNING`, `noteFromMidi`, and fretboard rendering logic.

Priority: High

Difficulty: Medium

### 5. Metronome and Tempo Ladder

Add a metronome and a tempo ladder: start slow, repeat accurately, then increase BPM.

Student value: Encourages clean timing and real practice discipline.

Implementation notes: Use Tone.js transport or a lightweight scheduling loop. Store preferred BPM per profile.

Priority: High

Difficulty: Medium

### 6. Scale Sequence Patterns

Add common practice patterns: 3-note groups, 4-note groups, thirds, descending groups, and root-return patterns.

Student value: Helps students turn static scale shapes into musical movement.

Implementation notes: Extend `getPracticeSequence()` with named sequence strategies.

Priority: High

Difficulty: Medium

### 7. Chord Tone Highlighting

Let users select a related chord and highlight its chord tones inside the current scale.

Student value: This connects lead playing to harmony and teaches which notes sound stable over each chord.

Implementation notes: Use `SCALE_CHORDS` and `CHORD_SHAPES`; add chord tone pitch classes and a secondary highlight style.

Priority: High

Difficulty: Medium

### 8. Mode Comparison View

Add a comparison view for similar modes, such as natural minor vs Dorian, Phrygian vs Phrygian Dominant, major vs Lydian.

Student value: Students understand the "color note" that defines each mode.

Implementation notes: Compare formulas and intervals, then highlight changed degrees.

Priority: Medium

Difficulty: Medium

### 9. Improvisation Prompts

Add short prompts such as "Target the b3", "Resolve b7 to root", or "Use only three notes for one minute."

Student value: Bridges technical scale practice and real musical phrasing.

Implementation notes: Add prompt arrays per scale or category.

Priority: Medium

Difficulty: Low

### 10. Backing Drone

Add a root drone or simple tonal pad while practicing a scale.

Student value: Helps students hear the tonal center and the sound of each degree against the root.

Implementation notes: Tone.js can generate a sustained root note. Provide volume control and off switch.

Priority: Medium

Difficulty: Medium

### 11. Mistake-Aware Practice Log

Let students mark a position or note as difficult and revisit it later.

Student value: Creates intentional repetition instead of random practice.

Implementation notes: Store weak spots per profile and scale.

Priority: Medium

Difficulty: Medium

### 12. Add More Practical Scale Context

For each scale, show a short "Use it over" section: compatible chords, common genres, and one simple phrase idea.

Student value: Students learn when and why a scale matters.

Implementation notes: Extend scale metadata with `usage`, `commonChords`, and `phraseHint`.

Priority: Medium

Difficulty: Low

## Software and Product Engineering Ideas

### 1. Split Data from UI Components

Move scale data, chord data, constants, and music helpers out of `src/main.jsx` into focused modules.

Engineering value: The current single-file structure is manageable now, but it will slow down future features.

Suggested structure:

```text
src/
+-- data/
|   +-- scales.js
|   +-- chords.js
|   +-- tuning.js
+-- lib/
|   +-- music.js
|   +-- practice.js
|   +-- storage.js
+-- components/
|   +-- Fretboard.jsx
|   +-- PracticeRoom.jsx
|   +-- ScaleLibrary.jsx
```

Priority: High

Difficulty: Medium

### 2. Add Unit Tests for Music Logic

Convert the existing validation script into a broader automated test suite.

Engineering value: Scale generation, note spelling, fretboard mapping, and chord notes are core business logic and should be protected.

Implementation notes: Add Vitest and test helpers for pitch classes, note spelling, sequence generation, and position ranges.

Priority: High

Difficulty: Medium

### 3. Add Practice Session Data Model

Track practice sessions with date, scale, position, BPM, duration, and completed drill type.

Product value: Progress becomes measurable and useful.

Implementation notes: Store session records in local storage first. Keep the model simple enough to migrate later.

Priority: High

Difficulty: Medium

### 4. Improve Routing

Use a lightweight router or a clearer internal routing layer for home, dashboard, library, practice, and about pages.

Engineering value: Reduces manual path handling and makes deep links easier.

Implementation notes: React Router is an option, but the current app can also keep a small custom router if bundle simplicity matters.

Priority: Medium

Difficulty: Medium

### 5. Add Error Boundaries and Audio Fallbacks

Handle browser audio permission failures, unsupported audio contexts, or Tone.js initialization errors gracefully.

Product value: Users get clear recovery behavior instead of silent failure.

Implementation notes: Add explicit audio state: locked, loading, ready, failed.

Priority: Medium

Difficulty: Low

### 6. Accessibility Improvements

Improve keyboard navigation, focus states, button labels, modal focus traps, and color contrast validation.

Product value: Makes the app more usable and more professional.

Implementation notes: Add ARIA labels for icon-only controls, escape handling for modals, and keyboard interaction for fretboard cells.

Priority: High

Difficulty: Medium

### 7. Performance Review for Fretboard Rendering

Memoize heavy derived values and avoid unnecessary re-renders during playback.

Engineering value: Keeps interaction smooth on mobile devices.

Implementation notes: Profile `Fretboard`, `PracticeRoom`, and audio playback state changes.

Priority: Medium

Difficulty: Medium

### 8. Print-Friendly Lesson Pages

Create printable pages for each scale: formula, notes, fretboard position, related chords, and practice plan.

Product value: Fits the education use case and can help GitHub/demo presentation.

Implementation notes: Add CSS print styles and a print button for selected scale.

Priority: Medium

Difficulty: Medium

### 9. Add PWA Support

Make the app installable and usable offline.

Product value: Guitar practice often happens away from a stable connection.

Implementation notes: Add web manifest, service worker, icons, and offline cache strategy.

Priority: Medium

Difficulty: Medium

### 10. Analytics Without Tracking Personal Data

Track anonymous local stats such as most practiced scale, total sessions, and common weak positions.

Product value: Gives feedback to the student without requiring accounts.

Implementation notes: Keep all data local unless a future backend is added.

Priority: Low

Difficulty: Low

### 11. Data Authoring Format

Move scale and chord definitions to JSON or structured JS modules with schema validation.

Engineering value: Makes it safer to add more scales and chord shapes.

Implementation notes: Use a Zod schema or custom validation in the existing script.

Priority: Medium

Difficulty: Medium

### 12. Visual Regression Checks

Add screenshot tests for the main views at desktop and mobile widths.

Engineering value: Protects a visual practice app from layout regressions.

Implementation notes: Use Playwright after the app structure is more modular.

Priority: Low

Difficulty: Medium

## Prioritized Roadmap

### Phase 1 - Learning Value Fast Wins

1. Root note mastery drill
2. Improvisation prompts
3. "Use it over" scale context
4. Audio fallback states
5. Accessibility labels for icon buttons

Why first: These are useful, visible improvements with relatively low implementation risk.

### Phase 2 - Practice System

1. Metronome and BPM setting
2. Tempo ladder
3. Scale sequence patterns
4. Practice session tracking
5. Progress summary per profile

Why second: This turns Nylon Steps from a reference app into a real practice tool.

### Phase 3 - Deeper Musicianship

1. Interval recognition mode
2. Fretboard note quiz
3. Chord tone highlighting
4. Mode comparison view
5. Backing drone

Why third: These features create deeper musical understanding and longer-term student value.

### Phase 4 - Technical Foundation

1. Split `src/main.jsx` into data, helpers, and components.
2. Add Vitest unit tests for music logic.
3. Add Playwright visual checks.
4. Add PWA support.
5. Add print-friendly lesson pages.

Why fourth: This keeps the project maintainable as features grow.

## Best Next Three Features

If only three features are selected for the next implementation cycle, choose:

1. Root Note Mastery Drill
2. Metronome and Tempo Ladder
3. Split Music Data and Helpers from UI

Reason: This combination improves the student experience immediately while reducing future engineering friction.

## Implementation Risk Notes

- Audio timing can become complex. Start with simple metronome behavior before advanced scheduling.
- Quiz modes should not block normal exploration; keep them as optional practice modes.
- Refactoring `src/main.jsx` should be done before adding many new features, or future changes will become harder to review.
- Keep all music theory data covered by validation tests.
- Preserve mobile usability; guitar practice apps are often used on phones.

## Review Checklist

Use this checklist when choosing what to build next:

- Does the idea help a student practice better, not just browse more information?
- Can the feature reuse existing scale, chord, fretboard, or profile data?
- Is the first version small enough to test quickly?
- Does the feature work on mobile?
- Can the music theory data be validated automatically?
- Does the change make the codebase easier or harder to maintain?

