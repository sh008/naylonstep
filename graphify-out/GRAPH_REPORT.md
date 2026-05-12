# Graph Report - naylonSteps  (2026-05-12)

## Corpus Check
- 4 files · ~8,097 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 80 nodes · 99 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59783f21`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `getFretboardNotes()` - 9 edges
2. `pitchClass()` - 6 edges
3. `getOrderedScaleNotes()` - 5 edges
4. `getScaleNoteLabels()` - 4 edges
5. `getPositionLabel()` - 4 edges
6. `getScalePitchClasses()` - 3 edges
7. `getScaleDegreeLabels()` - 3 edges
8. `getDefaultPositionStart()` - 3 edges
9. `getPositionRange()` - 3 edges
10. `App()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `getFretboardNotes()` --calls--> `getPositionRange()`  [EXTRACTED]
  src/main.jsx → src/main.jsx  _Bridges community 3 → community 2_

## Communities (8 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (10): CHORD_SHAPES, NATURAL_PITCH_CLASSES, NOTE_LETTERS, NOTE_NAMES, PRACTICE_POSITIONS, ROUTES, SCALE_CATEGORIES, SCALE_CHORDS (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (17): CHORD_SHAPES, CHORD_TUNING, EXPECTED_FORMULAS, EXPECTED_NOTES, ids, inScale, INTERVAL_BY_DEGREE, NATURAL_PITCH_CLASSES (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.27
Nodes (11): getDefaultPositionStart(), getFretboardNotes(), getOrderedScaleNotes(), getRelatedChords(), getScaleDegreeLabels(), getScaleNoteLabels(), getScalePitchClasses(), MiniScalePreview() (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.5
Nodes (4): Fretboard(), getPositionLabel(), getPositionRange(), PracticeRoom()

### Community 4 - "Community 4"
Cohesion: 0.67
Nodes (3): App(), usePersistedState(), useToneSampler()

## Knowledge Gaps
- **28 isolated node(s):** `source`, `SCALES`, `CHORD_SHAPES`, `SCALE_CHORDS`, `NOTE_NAMES` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getFretboardNotes()` connect `Community 2` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `getOrderedScaleNotes()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **Why does `pitchClass()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **What connects `source`, `SCALES`, `CHORD_SHAPES` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._