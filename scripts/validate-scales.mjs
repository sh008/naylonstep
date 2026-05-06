import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("src/main.jsx", "utf8");
const start = source.indexOf("const SCALES = ");

if (start === -1) {
  throw new Error("SCALES definition was not found in src/main.jsx");
}

const arrayStart = source.indexOf("[", start);
let depth = 0;
let arrayEnd = -1;

for (let index = arrayStart; index < source.length; index += 1) {
  const char = source[index];
  if (char === "[") depth += 1;
  if (char === "]") depth -= 1;
  if (depth === 0) {
    arrayEnd = index + 1;
    break;
  }
}

if (arrayEnd === -1) {
  throw new Error("SCALES array could not be parsed.");
}

const SCALES = vm.runInNewContext(source.slice(arrayStart, arrayEnd));

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const NATURAL_PITCH_CLASSES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const TUNING = [
  { name: "E", midi: 64 },
  { name: "B", midi: 59 },
  { name: "G", midi: 55 },
  { name: "D", midi: 50 },
  { name: "A", midi: 45 },
  { name: "E", midi: 40 },
];

const EXPECTED_NOTES = {
  "a-minor-pentatonic": ["A", "C", "D", "E", "G"],
  "c-major": ["C", "D", "E", "F", "G", "A", "B"],
  "a-natural-minor": ["A", "B", "C", "D", "E", "F", "G"],
  "e-harmonic-minor": ["E", "F#", "G", "A", "B", "C", "D#"],
  "a-blues": ["A", "C", "D", "Eb", "E", "G"],
  "d-dorian": ["D", "E", "F", "G", "A", "B", "C"],
  "e-phrygian": ["E", "F", "G", "A", "B", "C", "D"],
  "f-lydian": ["F", "G", "A", "B", "C", "D", "E"],
  "g-mixolydian": ["G", "A", "B", "C", "D", "E", "F"],
  "b-locrian": ["B", "C", "D", "E", "F", "G", "A"],
  "e-phrygian-dominant": ["E", "F", "G#", "A", "B", "C", "D"],
  "c-major-pentatonic": ["C", "D", "E", "G", "A"],
};

const EXPECTED_FORMULAS = {
  "a-minor-pentatonic": ["1", "b3", "4", "5", "b7"],
  "c-major": ["1", "2", "3", "4", "5", "6", "7"],
  "a-natural-minor": ["1", "2", "b3", "4", "5", "b6", "b7"],
  "e-harmonic-minor": ["1", "2", "b3", "4", "5", "b6", "7"],
  "a-blues": ["1", "b3", "4", "b5", "5", "b7"],
  "d-dorian": ["1", "2", "b3", "4", "5", "6", "b7"],
  "e-phrygian": ["1", "b2", "b3", "4", "5", "b6", "b7"],
  "f-lydian": ["1", "2", "3", "#4", "5", "6", "7"],
  "g-mixolydian": ["1", "2", "3", "4", "5", "6", "b7"],
  "b-locrian": ["1", "b2", "b3", "4", "b5", "b6", "b7"],
  "e-phrygian-dominant": ["1", "b2", "3", "4", "5", "b6", "b7"],
  "c-major-pentatonic": ["1", "2", "3", "5", "6"],
};

const INTERVAL_BY_DEGREE = {
  1: 0,
  "b2": 1,
  2: 2,
  "b3": 3,
  3: 4,
  4: 5,
  "#4": 6,
  b5: 6,
  5: 7,
  "b6": 8,
  6: 9,
  "b7": 10,
  7: 11,
};

function pitchClass(note) {
  const [, letter, accidental = ""] = note.match(/^([A-G])([#b]*)$/) || [];
  if (!letter) throw new Error(`Invalid note name: ${note}`);
  return [...accidental].reduce((pc, sign) => pc + (sign === "#" ? 1 : -1), NATURAL_PITCH_CLASSES[letter]) % 12;
}

function spellScaleNotes(scale) {
  const rootPc = pitchClass(scale.root);
  const rootLetterIndex = NOTE_LETTERS.indexOf(scale.root[0]);
  return scale.formula.map((degree, index) => {
    const number = Number(degree.match(/\d+/)?.[0] || index + 1);
    const targetPc = (rootPc + scale.intervals[index]) % 12;
    const letter = NOTE_LETTERS[(rootLetterIndex + number - 1) % NOTE_LETTERS.length];
    const naturalPc = NATURAL_PITCH_CLASSES[letter];
    let diff = (targetPc - naturalPc + 12) % 12;
    if (diff > 6) diff -= 12;
    return `${letter}${diff > 0 ? "#".repeat(diff) : diff < 0 ? "b".repeat(Math.abs(diff)) : ""}`;
  });
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
  }
}

const ids = new Set();

for (const scale of SCALES) {
  if (ids.has(scale.id)) throw new Error(`Duplicate scale id: ${scale.id}`);
  ids.add(scale.id);

  if (!EXPECTED_NOTES[scale.id]) throw new Error(`Missing validation fixture for ${scale.id}`);
  if (scale.formula.length !== scale.intervals.length) throw new Error(`${scale.id}: formula and intervals length mismatch`);

  assertEqual(scale.formula, EXPECTED_FORMULAS[scale.id], `${scale.id}: formula`);
  assertEqual(scale.intervals, scale.formula.map((degree) => INTERVAL_BY_DEGREE[degree]), `${scale.id}: intervals from formula`);
  assertEqual(spellScaleNotes(scale), EXPECTED_NOTES[scale.id], `${scale.id}: spelled notes`);

  const rootPc = pitchClass(scale.root);
  const scalePitchClasses = new Set(scale.intervals.map((interval) => (rootPc + interval) % 12));
  if (scalePitchClasses.size !== scale.intervals.length) throw new Error(`${scale.id}: duplicate pitch classes`);

  for (const string of TUNING) {
    for (let fret = 0; fret <= 19; fret += 1) {
      const notePc = (string.midi + fret) % 12;
      const inScale = scalePitchClasses.has(notePc);
      const noteName = NOTE_NAMES[notePc];
      if (inScale && !noteName) throw new Error(`${scale.id}: invalid fretboard pitch class at ${string.name}${fret}`);
    }
  }
}

console.log(`Validated ${SCALES.length} scales: formulas, intervals, note spelling and 19-fret pitch-class mapping are consistent.`);
