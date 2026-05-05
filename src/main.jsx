import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  ChevronLeft,
  Gauge,
  Grid2X2,
  Heart,
  HelpCircle,
  Home,
  Info,
  Library,
  ListMusic,
  Menu,
  Music2,
  Pause,
  Plus,
  Play,
  Search,
  Settings,
  SlidersHorizontal,
  Timer,
  Trophy,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import "./styles.css";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const NATURAL_PITCH_CLASSES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const TUNING = [
  { name: "E", midi: 64, label: "E4" },
  { name: "B", midi: 59, label: "B3" },
  { name: "G", midi: 55, label: "G3" },
  { name: "D", midi: 50, label: "D3" },
  { name: "A", midi: 45, label: "A2" },
  { name: "E", midi: 40, label: "E2" },
];

const PRACTICE_POSITIONS = [
  { label: "Open", start: 0, end: 4 },
  { label: "III", start: 3, end: 6 },
  { label: "V", start: 5, end: 8 },
  { label: "VII", start: 7, end: 10 },
  { label: "IX", start: 9, end: 12 },
  { label: "XII", start: 12, end: 15 },
];

const SCALES = [
  {
    id: "a-minor-pentatonic",
    name: "A Minor Pentatonic",
    short: "A Minor Pentatonic",
    root: "A",
    category: "Pentatonic & Blues",
    formula: ["1", "b3", "4", "5", "b7"],
    intervals: [0, 3, 5, 7, 10],
    defaultPositionStart: 5,
    description: "A five-note minor sound used for rock, blues and first improvisation work.",
    education: "Start here for clear fingering, strong root awareness and simple ascending/descending scale practice.",
  },
  {
    id: "c-major",
    name: "Major Scale (Ionian)",
    short: "C Major",
    root: "C",
    category: "Major & Modes",
    formula: ["1", "2", "3", "4", "5", "6", "7"],
    intervals: [0, 2, 4, 5, 7, 9, 11],
    defaultPositionStart: 0,
    description: "The major scale, also called Ionian, is the reference for interval formulas.",
    education: "Use this to learn whole-step and half-step spacing before comparing modes.",
  },
  {
    id: "a-natural-minor",
    name: "Natural Minor (Aeolian)",
    short: "A Natural Minor",
    root: "A",
    category: "Minor & Harmonic",
    formula: ["1", "2", "b3", "4", "5", "b6", "b7"],
    intervals: [0, 2, 3, 5, 7, 8, 10],
    defaultPositionStart: 5,
    description: "The natural minor scale, also called Aeolian, gives the basic minor sound.",
    education: "Compare it with harmonic minor: only the seventh degree changes.",
  },
  {
    id: "e-harmonic-minor",
    name: "E Harmonic Minor",
    short: "E Harmonic Minor",
    root: "E",
    category: "Minor & Harmonic",
    formula: ["1", "2", "b3", "4", "5", "b6", "7"],
    intervals: [0, 2, 3, 5, 7, 8, 11],
    defaultPositionStart: 0,
    description: "Natural minor with a raised seventh, useful for classical and neoclassical cadences.",
    education: "Listen for the wide step between b6 and 7; practice it slowly for intonation and hand placement.",
  },
  {
    id: "a-blues",
    name: "A Blues Scale",
    short: "A Blues",
    root: "A",
    category: "Pentatonic & Blues",
    formula: ["1", "b3", "4", "b5", "5", "b7"],
    intervals: [0, 3, 5, 6, 7, 10],
    defaultPositionStart: 5,
    description: "Minor pentatonic plus the blue note: b5.",
    education: "Use the b5 as a passing color, not a resting note, until the sound feels natural.",
  },
  {
    id: "d-dorian",
    name: "D Dorian",
    short: "D Dorian",
    root: "D",
    category: "Major & Modes",
    formula: ["1", "2", "b3", "4", "5", "6", "b7"],
    intervals: [0, 2, 3, 5, 7, 9, 10],
    defaultPositionStart: 5,
    description: "A minor mode with a natural sixth, common in jazz, funk and modal practice.",
    education: "The natural 6 is the color note. Compare it against natural minor to hear the lift.",
  },
  {
    id: "e-phrygian",
    name: "E Phrygian",
    short: "E Phrygian",
    root: "E",
    category: "Major & Modes",
    formula: ["1", "b2", "b3", "4", "5", "b6", "b7"],
    intervals: [0, 1, 3, 5, 7, 8, 10],
    defaultPositionStart: 0,
    description: "A darker minor mode defined by the flat second.",
    education: "Keep the b2 close to the root in your ear; that half-step is the identity of the mode.",
  },
  {
    id: "f-lydian",
    name: "F Lydian",
    short: "F Lydian",
    root: "F",
    category: "Major & Modes",
    formula: ["1", "2", "3", "#4", "5", "6", "7"],
    intervals: [0, 2, 4, 6, 7, 9, 11],
    defaultPositionStart: 5,
    description: "A bright major mode with a raised fourth.",
    education: "Target #4 as the floating color, then resolve to 5 for a clean modal phrase.",
  },
  {
    id: "g-mixolydian",
    name: "G Mixolydian",
    short: "G Mixolydian",
    root: "G",
    category: "Major & Modes",
    formula: ["1", "2", "3", "4", "5", "6", "b7"],
    intervals: [0, 2, 4, 5, 7, 9, 10],
    defaultPositionStart: 3,
    description: "A dominant major mode with a flat seventh.",
    education: "Great over dominant 7 chords; hear how b7 softens the major scale.",
  },
  {
    id: "b-locrian",
    name: "B Locrian",
    short: "B Locrian",
    root: "B",
    category: "Major & Modes",
    formula: ["1", "b2", "b3", "4", "b5", "b6", "b7"],
    intervals: [0, 1, 3, 5, 6, 8, 10],
    defaultPositionStart: 7,
    description: "The unstable diminished mode with b2 and b5.",
    education: "Use it as a reference sound; it is less common but important for modal completeness.",
  },
  {
    id: "e-phrygian-dominant",
    name: "E Phrygian Dominant",
    short: "E Phrygian Dominant",
    root: "E",
    category: "Minor & Harmonic",
    formula: ["1", "b2", "3", "4", "5", "b6", "b7"],
    intervals: [0, 1, 4, 5, 7, 8, 10],
    defaultPositionStart: 0,
    description: "The fifth mode of harmonic minor, with a strong Spanish/classical color.",
    education: "The b2-to-3 shape is the signature sound; practice it slowly before speeding up.",
  },
  {
    id: "c-major-pentatonic",
    name: "C Major Pentatonic",
    short: "C Major Pentatonic",
    root: "C",
    category: "Pentatonic & Blues",
    formula: ["1", "2", "3", "5", "6"],
    intervals: [0, 2, 4, 7, 9],
    defaultPositionStart: 0,
    description: "A simple five-note major sound with no half-step tension.",
    education: "Good for clean melodic phrasing and first-position confidence.",
  },
];

const SCALE_CATEGORIES = ["All", "Major & Modes", "Minor & Harmonic", "Pentatonic & Blues"];

const STORAGE_KEY = "fretflow-state-v1";

function createProfile(name = "New Student") {
  const id = `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    id,
    name,
    selectedScaleId: "a-minor-pentatonic",
    positionStart: 5,
    bpm: 80,
    sound: true,
    minutes: 0,
    streak: 0,
    hasPracticeStarted: false,
    lastPracticeAt: null,
  };
}

function pitchClass(note) {
  return NOTE_NAMES.indexOf(note);
}

function noteFromMidi(midi) {
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { name, label: `${name}${octave}`, midi };
}

function displayNote(note) {
  return note;
}

function getScalePitchClasses(scale) {
  const root = pitchClass(scale.root);
  return new Set(scale.intervals.map((interval) => (root + interval) % 12));
}

function getScaleNoteLabels(scale) {
  const rootPc = pitchClass(scale.root);
  const rootLetterIndex = NOTE_LETTERS.indexOf(scale.root[0]);
  const labels = new Map();

  scale.formula.forEach((degree, index) => {
    const number = Number(degree.match(/\d+/)?.[0] || index + 1);
    const targetPc = (rootPc + scale.intervals[index]) % 12;
    const letter = NOTE_LETTERS[(rootLetterIndex + number - 1) % NOTE_LETTERS.length];
    const naturalPc = NATURAL_PITCH_CLASSES[letter];
    let diff = (targetPc - naturalPc + 12) % 12;
    if (diff > 6) diff -= 12;
    const accidental = diff === 2 ? "##" : diff === 1 ? "#" : diff === -1 ? "b" : diff === -2 ? "bb" : "";
    labels.set(targetPc, `${letter}${accidental}`);
  });

  return labels;
}

function getDefaultPositionStart(scale) {
  return scale.defaultPositionStart ?? 0;
}

function getPositionRange(positionStart) {
  return (
    PRACTICE_POSITIONS.find((position) => position.start === Number(positionStart)) || {
      label: `Fret ${positionStart}`,
      start: Number(positionStart),
      end: Math.min(19, Number(positionStart) + 3),
    }
  );
}

function getPositionLabel(positionStart) {
  const position = getPositionRange(positionStart);
  return position.label === "Open" ? "Open Position" : `Position ${position.label}`;
}

function getFretboardNotes(scale, positionStart, fretCount = 19) {
  const pcs = getScalePitchClasses(scale);
  const rootPc = pitchClass(scale.root);
  const noteLabels = getScaleNoteLabels(scale);
  const position = getPositionRange(positionStart ?? getDefaultPositionStart(scale));
  const cells = [];

  TUNING.forEach((string, stringIndex) => {
    for (let fret = 0; fret <= fretCount; fret += 1) {
      const note = noteFromMidi(string.midi + fret);
      const pc = note.midi % 12;
      const inScale = pcs.has(pc);
      const inPosition = fret >= position.start && fret <= position.end;
      if (inScale && inPosition) {
        cells.push({
          id: `${stringIndex}-${fret}`,
          stringIndex,
          fret,
          note,
          displayName: noteLabels.get(pc) || note.name,
          isRoot: pc === rootPc,
        });
      }
    }
  });

  return cells.sort((a, b) => a.note.midi - b.note.midi || b.stringIndex - a.stringIndex || a.fret - b.fret);
}

function usePersistedState() {
  const [state, setState] = useState(() => {
    const firstProfile = createProfile("Mastery Level");
    const fallback = {
      activeProfileId: firstProfile.id,
      profiles: [firstProfile],
    };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (Array.isArray(saved.profiles) && saved.profiles.length > 0) {
        return {
          activeProfileId: saved.activeProfileId || saved.profiles[0].id,
          profiles: saved.profiles.map((profile) => ({
            ...createProfile(profile.name || "Student"),
            ...profile,
            hasPracticeStarted: Boolean(profile.hasPracticeStarted),
            positionStart: Number(profile.positionStart ?? getDefaultPositionStart(SCALES.find((scale) => scale.id === profile.selectedScaleId) || SCALES[0])),
            minutes: Number(profile.minutes || 0),
            streak: Number(profile.streak || 0),
          })),
        };
      }
      if (saved.selectedScaleId || saved.bpm || saved.sound !== undefined) {
        return {
          activeProfileId: firstProfile.id,
          profiles: [
            {
              ...firstProfile,
              selectedScaleId: saved.selectedScaleId || firstProfile.selectedScaleId,
              positionStart: Number(saved.positionStart ?? firstProfile.positionStart),
              bpm: Number(saved.bpm || firstProfile.bpm),
              sound: saved.sound !== undefined ? Boolean(saved.sound) : firstProfile.sound,
              minutes: 0,
              streak: 0,
              hasPracticeStarted: false,
            },
          ],
        };
      }
      return fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

function useToneSampler(sound) {
  const samplerRef = useRef(null);

  const trigger = useCallback(async (noteLabel) => {
    if (!sound) return;
    const Tone = await import("tone");
    await Tone.start();
    if (!samplerRef.current) {
      samplerRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.004, decay: 0.14, sustain: 0.18, release: 0.35 },
      }).toDestination();
      samplerRef.current.volume.value = -15;
    }
    samplerRef.current.triggerAttackRelease(noteLabel, "8n");
  }, [sound]);

  return trigger;
}

function App() {
  const [view, setView] = useState("dashboard");
  const [appState, setAppState] = usePersistedState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [deleteProfileOpen, setDeleteProfileOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const activeProfile = appState.profiles.find((profile) => profile.id === appState.activeProfileId) || appState.profiles[0];
  const prefs = activeProfile;
  const selectedScale = SCALES.find((scale) => scale.id === prefs.selectedScaleId) || SCALES[0];
  const sequence = useMemo(() => getFretboardNotes(selectedScale, prefs.positionStart), [selectedScale, prefs.positionStart]);
  const triggerNote = useToneSampler(prefs.sound);

  const setPrefs = useCallback((updater) => {
    setAppState((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => {
        if (profile.id !== current.activeProfileId) return profile;
        const next = typeof updater === "function" ? updater(profile) : updater;
        return { ...profile, ...next };
      }),
    }));
  }, [setAppState]);

  useEffect(() => {
    if (!isPlaying || sequence.length === 0) return undefined;
    triggerNote(sequence[step % sequence.length].note.label);
    const interval = window.setInterval(() => {
      setStep((current) => {
        const next = (current + 1) % sequence.length;
        triggerNote(sequence[next].note.label);
        return next;
      });
    }, 60000 / prefs.bpm);

    return () => window.clearInterval(interval);
  }, [isPlaying, prefs.bpm, sequence, triggerNote]);

  function openPractice(scaleId = prefs.selectedScaleId, markStarted = true) {
    const nextScale = SCALES.find((scale) => scale.id === scaleId) || selectedScale;
    const scaleChanged = scaleId !== prefs.selectedScaleId;
    setPrefs((current) => ({
      ...current,
      selectedScaleId: scaleId,
      positionStart: scaleChanged ? getDefaultPositionStart(nextScale) : current.positionStart,
      hasPracticeStarted: markStarted ? true : current.hasPracticeStarted,
      lastPracticeAt: markStarted ? new Date().toISOString() : current.lastPracticeAt,
    }));
    setStep(0);
    setView("practice");
  }

  function updateActiveProfileName(name) {
    setPrefs({ name });
  }

  function createNewProfile(name) {
    const cleanName = name.trim() || `Student ${appState.profiles.length + 1}`;
    const next = createProfile(cleanName);
    setAppState((current) => ({
      activeProfileId: next.id,
      profiles: [...current.profiles, next],
    }));
    setIsPlaying(false);
    setStep(0);
    setView("dashboard");
  }

  function switchProfile(profileId) {
    setAppState((current) => ({ ...current, activeProfileId: profileId }));
    setIsPlaying(false);
    setStep(0);
    setView("dashboard");
  }

  function deleteActiveProfile() {
    setAppState((current) => {
      if (current.profiles.length <= 1) return current;
      const remaining = current.profiles.filter((profile) => profile.id !== current.activeProfileId);
      return {
        activeProfileId: remaining[0].id,
        profiles: remaining,
      };
    });
    setIsPlaying(false);
    setStep(0);
    setView("dashboard");
    setDeleteProfileOpen(false);
  }

  function goToPracticeOrLibrary() {
    if (prefs.hasPracticeStarted) {
      openPractice();
      return;
    }
    setView("library");
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        view={view}
        setView={setView}
        openPractice={openPractice}
        goToPracticeOrLibrary={goToPracticeOrLibrary}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        profiles={appState.profiles}
        activeProfile={activeProfile}
        switchProfile={switchProfile}
        openCreateProfile={() => setProfileModalOpen(true)}
        openDeleteProfile={() => setDeleteProfileOpen(true)}
        canDeleteProfile={appState.profiles.length > 1}
        updateActiveProfileName={updateActiveProfileName}
      />
      <main className={`main-area ${view === "practice" ? "practice-main" : ""}`}>
        {view !== "practice" && (
          <TopBar
            view={view}
            profiles={appState.profiles}
            activeProfile={activeProfile}
            switchProfile={switchProfile}
            openCreateProfile={() => setProfileModalOpen(true)}
            openDeleteProfile={() => setDeleteProfileOpen(true)}
            canDeleteProfile={appState.profiles.length > 1}
            updateActiveProfileName={updateActiveProfileName}
          />
        )}
        {view === "dashboard" && (
          <Dashboard profile={activeProfile} prefs={prefs} selectedScale={selectedScale} openPractice={openPractice} setView={setView} />
        )}
        {view === "library" && (
          <ScaleLibrary
            selectedScaleId={prefs.selectedScaleId}
            setSelectedScaleId={(id) => {
              const nextScale = SCALES.find((scale) => scale.id === id) || SCALES[0];
              setPrefs((current) => ({ ...current, selectedScaleId: id, positionStart: getDefaultPositionStart(nextScale) }));
            }}
            openPractice={openPractice}
          />
        )}
        {view === "about" && <About />}
        {view === "practice" && (
          <PracticeRoom
            selectedScale={selectedScale}
            prefs={prefs}
            setPrefs={setPrefs}
            positionStart={prefs.positionStart}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            step={step}
            setStep={setStep}
            sequence={sequence}
            setView={setView}
          />
        )}
      </main>
      {view !== "practice" && <SiteFooter />}
      {view !== "practice" && <MobileNav view={view} setView={setView} goToPracticeOrLibrary={goToPracticeOrLibrary} />}
      <NewProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onCreate={(name) => {
          createNewProfile(name);
          setProfileModalOpen(false);
        }}
      />
      <ConfirmDeleteProfileModal
        open={deleteProfileOpen}
        profileName={activeProfile.name}
        canDelete={appState.profiles.length > 1}
        onClose={() => setDeleteProfileOpen(false)}
        onConfirm={deleteActiveProfile}
      />
    </div>
  );
}

function Sidebar({
  view,
  setView,
  openPractice,
  goToPracticeOrLibrary,
  collapsed,
  setCollapsed,
  profiles,
  activeProfile,
  switchProfile,
  openCreateProfile,
  openDeleteProfile,
  canDeleteProfile,
  updateActiveProfileName,
}) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(activeProfile.name);

  useEffect(() => {
    setDraftName(activeProfile.name);
    setEditingName(false);
  }, [activeProfile.id, activeProfile.name]);

  const items = [
    { id: "dashboard", label: "Dashboard", icon: Grid2X2 },
    { id: "library", label: "Library", icon: BookOpen },
    { id: "practice", label: "Practice", icon: Music2 },
    { id: "about", label: "About", icon: Info },
  ];
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <span className="brand">FretFlow</span>
        <button className="menu-toggle" onClick={() => setCollapsed((current) => !current)} aria-label={collapsed ? "Open menu" : "Close menu"}>
          <Menu size={22} />
        </button>
      </div>
      <div className="profile">
        <div className="avatar">{activeProfile.name.slice(0, 2).toUpperCase()}</div>
        <div className="profile-body">
          {editingName ? (
            <form
              className="profile-edit"
              onSubmit={(event) => {
                event.preventDefault();
                const nextName = draftName.trim() || "Student";
                updateActiveProfileName(nextName);
                setEditingName(false);
              }}
            >
              <input value={draftName} onChange={(event) => setDraftName(event.target.value)} aria-label="Profile name" />
              <button type="submit">Save</button>
            </form>
          ) : (
            <button className="profile-name" onClick={() => setEditingName(true)}>
              <strong>{activeProfile.name}</strong>
              <span>{activeProfile.hasPracticeStarted ? "Active Student" : "New Student"}</span>
            </button>
          )}
        </div>
        <button className="delete-profile profile-delete-inline" onClick={openDeleteProfile} disabled={!canDeleteProfile} aria-label="Delete current profile">
          <Trash2 size={16} />
        </button>
      </div>
      <button className="sidebar-new-profile" onClick={openCreateProfile} aria-label="Create student profile">
        <Plus size={16} />
        <span>New student</span>
      </button>
      <div className="profile-switcher">
        <label>
          <span>Profile</span>
          <select value={activeProfile.id} onChange={(event) => switchProfile(event.target.value)}>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <nav className="side-links">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              className={`side-link ${active ? "active" : ""}`}
              onClick={() => (item.id === "practice" ? goToPracticeOrLibrary() : setView(item.id))}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button className="primary full start-practice" onClick={goToPracticeOrLibrary}>
        <Play size={19} />
        <span>{activeProfile.hasPracticeStarted ? "Resume Practice" : "Choose Scale"}</span>
      </button>
    </aside>
  );
}

function TopBar({
  view,
  profiles,
  activeProfile,
  switchProfile,
  openCreateProfile,
  openDeleteProfile,
  canDeleteProfile,
  updateActiveProfileName,
}) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">FretFlow</span>
        <strong>{view === "library" ? "Scale Library" : view === "about" ? "Support" : "Dashboard"}</strong>
      </div>
      <div className="top-actions">
        {view === "library" && (
          <label className="searchbox">
            <Search size={16} />
            <input placeholder="Search scales..." />
          </label>
        )}
        <TopProfileControls
          profiles={profiles}
          activeProfile={activeProfile}
          switchProfile={switchProfile}
          openCreateProfile={openCreateProfile}
          openDeleteProfile={openDeleteProfile}
          canDeleteProfile={canDeleteProfile}
          updateActiveProfileName={updateActiveProfileName}
        />
        <button className="icon-btn" aria-label="Settings">
          <Settings size={22} />
        </button>
        <button className="icon-btn" aria-label="Help">
          <HelpCircle size={22} />
        </button>
      </div>
    </header>
  );
}

function TopProfileControls({
  profiles,
  activeProfile,
  switchProfile,
  openCreateProfile,
  openDeleteProfile,
  canDeleteProfile,
  updateActiveProfileName,
}) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(activeProfile.name);

  useEffect(() => {
    setDraftName(activeProfile.name);
    setEditing(false);
  }, [activeProfile.id, activeProfile.name]);

  return (
    <div className="top-profile-controls">
      {editing ? (
        <form
          className="top-profile-edit"
          onSubmit={(event) => {
            event.preventDefault();
            updateActiveProfileName(draftName.trim() || "Student");
            setEditing(false);
          }}
        >
          <input value={draftName} onChange={(event) => setDraftName(event.target.value)} aria-label="Profile name" />
          <button type="submit">Save</button>
        </form>
      ) : (
        <button className="top-profile-name" onClick={() => setEditing(true)} aria-label="Edit profile name">
          {activeProfile.name}
        </button>
      )}
      <button className="top-profile-delete" onClick={openDeleteProfile} disabled={!canDeleteProfile} aria-label="Delete current profile">
        <Trash2 size={16} />
      </button>
      <select aria-label="Active profile" value={activeProfile.id} onChange={(event) => switchProfile(event.target.value)}>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
          </option>
        ))}
      </select>
      <button className="top-profile-add" onClick={openCreateProfile} aria-label="Create student profile">
        <Plus size={17} />
      </button>
    </div>
  );
}

function NewProfileModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setName("");
      return undefined;
    }
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="new-profile-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-mark">
          <Music2 size={28} />
        </div>
        <span className="section-kicker">New Student</span>
        <h2 id="new-profile-title">Who is practicing?</h2>
        <p>Create a separate practice space with its own BPM, selected scales and progress history.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCreate(name);
          }}
        >
          <label>
            Student name
            <input ref={inputRef} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Sara, Ali, Nika" />
          </label>
          <div className="modal-actions">
            <button type="button" className="ghost-action" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary modal-primary">
              <Plus size={18} />
              Create Profile
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ConfirmDeleteProfileModal({ open, profileName, canDelete, onClose, onConfirm }) {
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop danger-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="profile-modal confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-profile-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-mark danger-mark">
          <Trash2 size={26} />
        </div>
        <span className="section-kicker">Delete Profile</span>
        <h2 id="delete-profile-title">Remove {profileName}?</h2>
        <p>
          This deletes this student's local progress, selected scale and practice settings from this browser.
        </p>
        {!canDelete && <div className="modal-warning">You need at least one student profile.</div>}
        <div className="modal-actions">
          <button type="button" className="ghost-action" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="danger-action" onClick={onConfirm} disabled={!canDelete}>
            Delete Profile
          </button>
        </div>
      </section>
    </div>
  );
}

function Dashboard({ profile, prefs, selectedScale, openPractice, setView }) {
  const categories = [
    { name: "Classical Scales", text: "Major, minor and harmonic foundations.", accent: "amber" },
    { name: "Minor Scales", text: "Natural, melodic and pentatonic variations.", accent: "blue" },
    { name: "Blues Scales", text: "Essential patterns for improvisation.", accent: "steel" },
  ];

  const hasPracticeStarted = Boolean(profile.hasPracticeStarted);

  return (
    <section className="page dashboard-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="section-kicker">{hasPracticeStarted ? "Current Session" : "Ready to Practice"}</span>
          <h1>{hasPracticeStarted ? selectedScale.name : `Welcome, ${profile.name}`}</h1>
          <p>
            {hasPracticeStarted
              ? "Pick up right where you left off. Focus on clean timing, relaxed hands and note awareness across the neck."
              : "Choose a scale and begin your first guided fretboard session. Your progress will start counting after you practice."}
          </p>
          <button className="primary hero-cta" onClick={() => (hasPracticeStarted ? openPractice() : setView("library"))}>
            <Play size={22} />
            {hasPracticeStarted ? `Resume Practice: ${prefs.bpm} BPM` : "Choose a Scale"}
          </button>
        </div>
        <MiniFretDiagram />
      </div>
      <h2>Your Progress</h2>
      <div className="progress-grid">
        <MetricCard label="Current Streak" value={prefs.streak} suffix="Days" icon={Gauge} tone="amber" empty={!hasPracticeStarted} />
        <MetricCard label="Time Practiced" value={prefs.minutes} suffix="Minutes" icon={Timer} tone="blue" empty={!hasPracticeStarted} />
        <div className="metric-card">
          <div className="metric-head">
            <span>Next Milestone</span>
            <Trophy color="#ffc107" />
          </div>
          <strong className="milestone">{hasPracticeStarted ? "Master Dorian Mode" : "Complete First Session"}</strong>
          <p>{hasPracticeStarted ? "Achieve 120 BPM clean alternate picking across all 5 positions." : "Start any scale to unlock milestones and practice history."}</p>
          <div className="meter">
            <span style={{ width: hasPracticeStarted ? "72%" : "0%" }} />
          </div>
        </div>
      </div>
      <div className="section-title-row">
        <h2>Explore Collections</h2>
        <button className="link-button" onClick={() => setView("library")}>
          View Library
          <ChevronLeft className="rtl-arrow" size={16} />
        </button>
      </div>
      <div className="collection-grid">
        {categories.map((category) => (
          <button key={category.name} className={`collection-card ${category.accent}`} onClick={() => setView("library")}>
            <div className="collection-strings" />
            <strong>{category.name}</strong>
            <span>{category.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value, suffix, icon: Icon, tone, empty }) {
  const zeroAfterStart = !empty && Number(value) === 0;
  return (
    <div className="metric-card">
      <div className="metric-head">
        <span>{label}</span>
        <Icon color={tone === "amber" ? "#ffc107" : "#90cdff"} />
      </div>
      <div className="metric-value">
        <strong>{value}</strong>
        <span>{suffix}</span>
      </div>
      <small>
        {empty
          ? "No practice recorded yet"
          : zeroAfterStart
            ? "First session started"
            : label === "Time Practiced"
              ? "+15 min compared to last week"
              : "7-day rhythm held"}
      </small>
    </div>
  );
}

function MiniFretDiagram() {
  return (
    <div className="mini-fret" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((line) => (
        <span className="mini-string" key={line} />
      ))}
      <i style={{ left: "28%", top: "28%" }} />
      <i className="root" style={{ left: "54%", top: "48%" }} />
      <i style={{ left: "78%", top: "68%" }} />
    </div>
  );
}

function ScaleLibrary({ selectedScaleId, setSelectedScaleId, openPractice }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const selectedScale = SCALES.find((scale) => scale.id === selectedScaleId) || SCALES[0];
  const visibleScales = activeCategory === "All" ? SCALES : SCALES.filter((scale) => scale.category === activeCategory);

  return (
    <section className="page library-page">
      <div className="library-heading">
        <h1>Scale Library</h1>
        <p>Choose a sound, study its formula, then move it across positions on the fretboard.</p>
      </div>
      <div className="category-tabs" aria-label="Scale categories">
        {SCALE_CATEGORIES.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => {
              setActiveCategory(category);
              const nextVisible = category === "All" ? SCALES : SCALES.filter((scale) => scale.category === category);
              if (!nextVisible.some((scale) => scale.id === selectedScaleId)) {
                setSelectedScaleId(nextVisible[0].id);
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <ScaleLesson scale={selectedScale} onPractice={() => openPractice(selectedScale.id)} />
      <div className="scale-grid">
        {visibleScales.map((scale) => (
          <ScaleCard
            key={scale.id}
            scale={scale}
            active={selectedScaleId === scale.id}
            onSelect={() => setSelectedScaleId(scale.id)}
            onPractice={() => openPractice(scale.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ScaleLesson({ scale, onPractice }) {
  return (
    <article className="scale-lesson">
      <div>
        <span className="section-kicker">{scale.category}</span>
        <h2>{scale.name}</h2>
        <p>{scale.education}</p>
      </div>
      <div className="lesson-formula">
        <span>Formula</span>
        <div className="formula-row large">
          {scale.formula.map((step, index) => (
            <span key={`${scale.id}-lesson-${step}-${index}`} className={step.includes("b") || step.includes("#") ? "blue-chip" : index === 0 ? "root-chip" : ""}>
              {step}
            </span>
          ))}
        </div>
      </div>
      <div className="lesson-actions">
        <button className="primary" onClick={onPractice}>
          <Play size={18} />
          Practice This Scale
        </button>
      </div>
    </article>
  );
}

function ScaleCard({ scale, active, onSelect, onPractice }) {
  return (
    <article className={`scale-card ${active ? "selected" : ""}`}>
      <button className="heart" onClick={onSelect} aria-label={`Select ${scale.name}`}>
        <Heart size={24} fill={active ? "#2bb1ff" : "none"} />
      </button>
      <h3>{scale.name}</h3>
      <div className="formula-row">
        {scale.formula.map((step, index) => (
          <span key={`${step}-${index}`} className={step.includes("b") ? "blue-chip" : index === 0 ? "root-chip" : ""}>
            {step}
          </span>
        ))}
      </div>
      <MiniScalePreview scale={scale} />
      <p>{scale.description}</p>
      <div className="scale-card-actions">
        <button className="secondary-action muted" onClick={onSelect}>
          Select
        </button>
        <button className="secondary-action" onClick={onPractice}>
          Practice
        </button>
      </div>
    </article>
  );
}

function MiniScalePreview({ scale }) {
  const notes = getFretboardNotes(scale, getDefaultPositionStart(scale)).slice(0, 7);
  return (
    <div className="mini-scale-preview">
      {[0, 1, 2, 3, 4, 5].map((line) => (
        <span key={line} className="preview-string" />
      ))}
      {notes.map((cell, index) => (
        <i
          key={cell.id}
          className={cell.isRoot ? "root" : ""}
          style={{
            left: `${10 + index * 12}%`,
            top: `${16 + cell.stringIndex * 12}%`,
          }}
        />
      ))}
    </div>
  );
}

function PracticeRoom({ selectedScale, prefs, setPrefs, positionStart, isPlaying, setIsPlaying, step, setStep, sequence, setView }) {
  const activeCell = sequence[step % Math.max(sequence.length, 1)];

  return (
    <section className="practice-room">
      <header className="practice-header">
        <button className="icon-btn mobile-back" onClick={() => setView("dashboard")} aria-label="Back to dashboard">
          <Home size={21} />
        </button>
        <strong className="practice-brand">FretFlow</strong>
        <h1>{selectedScale.short} - {getPositionLabel(positionStart)}</h1>
        <div className="practice-actions">
          <button className="icon-btn" aria-label="Settings">
            <Settings size={22} />
          </button>
          <button className="icon-btn" aria-label="Help">
            <HelpCircle size={22} />
          </button>
        </div>
      </header>
      <div className="position-toolbar" aria-label="Scale position selector">
        <div>
          <span>Neck Position</span>
          <strong>{getPositionLabel(positionStart)}</strong>
        </div>
        <div className="position-buttons">
          {PRACTICE_POSITIONS.map((position) => (
            <button
              key={position.start}
              className={Number(positionStart) === position.start ? "active" : ""}
              onClick={() => {
                setIsPlaying(false);
                setStep(0);
                setPrefs((current) => ({ ...current, positionStart: position.start }));
              }}
            >
              {position.label}
            </button>
          ))}
        </div>
      </div>
      <div className="practice-stage">
        <Fretboard scale={selectedScale} positionStart={positionStart} activeCellId={activeCell?.id} />
      </div>
      <div className="control-bar">
        <div className="control-cluster">
          <button
            className="round-btn"
            onClick={() => setPrefs((current) => ({ ...current, sound: !current.sound }))}
            aria-label={prefs.sound ? "Mute sound" : "Enable sound"}
          >
            {prefs.sound ? <Volume2 size={23} /> : <VolumeX size={23} />}
          </button>
          <button className="round-btn" aria-label="Practice settings">
            <SlidersHorizontal size={23} />
          </button>
        </div>
        <div className="transport">
          <button className="transport-step" onClick={() => setStep((current) => Math.max(0, current - 1))} aria-label="Previous note">
            <ChevronLeft size={28} />
          </button>
          <button className="play-big" onClick={() => setIsPlaying((current) => !current)} aria-label={isPlaying ? "Pause sequencer" : "Start sequencer"}>
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={34} fill="currentColor" />}
          </button>
          <button
            className="transport-step"
            onClick={() => setStep((current) => (sequence.length ? (current + 1) % sequence.length : current))}
            aria-label="Next note"
          >
            <ChevronLeft className="next-icon" size={28} />
          </button>
        </div>
        <label className="bpm-control">
          <Timer size={22} />
          <span>BPM</span>
          <input
            type="range"
            min="40"
            max="200"
            value={prefs.bpm}
            onChange={(event) => setPrefs((current) => ({ ...current, bpm: Number(event.target.value) }))}
          />
          <strong>{prefs.bpm}</strong>
        </label>
      </div>
    </section>
  );
}

function Fretboard({ scale, positionStart, activeCellId }) {
  const fretCount = 19;
  const cells = getFretboardNotes(scale, positionStart, fretCount);
  const fretPercents = Array.from({ length: fretCount + 1 }, (_, fret) => {
    const maxDistance = 1 - 1 / 2 ** (fretCount / 12);
    const distance = fret === 0 ? 0 : 1 - 1 / 2 ** (fret / 12);
    return (distance / maxDistance) * 100;
  });

  function notePosition(fret, stringIndex) {
    const left = fret === 0 ? 1.7 : (fretPercents[fret - 1] + fretPercents[fret]) / 2;
    const top = 12 + stringIndex * 15.2;
    return { left: `${left}%`, top: `${top}%` };
  }

  return (
    <div className="fretboard-wrap">
      <div className="fretboard" role="img" aria-label={`${scale.name} guitar fretboard, ${getPositionLabel(positionStart)}`}>
        <div className="nut" />
        {fretPercents.slice(1).map((left, index) => (
          <span key={index} className={`fret-wire fret-${index + 1}`} style={{ left: `${left}%` }}>
            <em>{index + 1}</em>
          </span>
        ))}
        {TUNING.map((string, index) => (
          <span
            key={string.label}
            className="guitar-string"
            style={{ top: `${12 + index * 15.2}%`, height: `${Math.max(2, 5 - index * 0.45)}px` }}
          >
            <b>{string.name}</b>
          </span>
        ))}
        {[3, 5, 7, 9, 15, 17].map((fret) => (
          <i key={fret} className="inlay" style={{ left: `${(fretPercents[fret - 1] + fretPercents[fret]) / 2}%` }} />
        ))}
        <i className="inlay double top" style={{ left: `${(fretPercents[11] + fretPercents[12]) / 2}%` }} />
        <i className="inlay double bottom" style={{ left: `${(fretPercents[11] + fretPercents[12]) / 2}%` }} />
        {cells.map((cell) => {
          const active = cell.id === activeCellId;
          return (
            <button
              className={`note-dot ${cell.isRoot ? "root" : ""} ${active ? "active" : ""}`}
              key={cell.id}
              style={notePosition(cell.fret, cell.stringIndex)}
              aria-label={`${cell.displayName} on string ${cell.stringIndex + 1}, fret ${cell.fret}`}
            >
              {cell.displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="page about-page">
      <div className="about-panel">
        <ListMusic size={38} />
        <h1>FretFlow</h1>
        <p>
          A local-first guitar scale trainer focused on clean fretboard reading, precise metronome practice and a
          distraction-free dark interface for music stands, tablets and desktops.
        </p>
        <div className="about-details">
          <span>19-fret classical layout</span>
          <span>Local progress storage</span>
          <span>Tone.js audio engine</span>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return <footer className="site-footer">Made with ❤️ for 🎵</footer>;
}

function MobileNav({ view, setView, goToPracticeOrLibrary }) {
  return (
    <nav className="mobile-nav">
      <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>
        <Home size={21} />
        <span>Home</span>
      </button>
      <button className={view === "library" ? "active" : ""} onClick={() => setView("library")}>
        <Library size={21} />
        <span>Library</span>
      </button>
      <button onClick={goToPracticeOrLibrary}>
        <Play size={21} />
        <span>Practice</span>
      </button>
    </nav>
  );
}

createRoot(document.getElementById("root")).render(<App />);
