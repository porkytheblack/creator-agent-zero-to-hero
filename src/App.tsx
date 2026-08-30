import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clipboard,
  Code2,
  Database,
  ExternalLink,
  GitBranch,
  Image,
  Lightbulb,
  Menu,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { glossary, modules, phases, type CodeBlock, type CourseModule } from "./course";

const STORAGE_KEY = "creator-agent-field-guide-progress-v1";
const NOTE_PREFIX = "creator-agent-field-guide-note:";

type ArchitectureStage = {
  name: string;
  creatorName: string;
  explanation: string;
  icon: typeof Sparkles;
};

const architectureStages: ArchitectureStage[] = [
  { name: "Inputs", creatorName: "The brief", explanation: "Brand rules, reference media, routine, and current public evidence enter the system.", icon: Clipboard },
  { name: "Agent", creatorName: "The producer", explanation: "The model reasons inside a loop, chooses a capability, inspects its result, and decides what comes next.", icon: Sparkles },
  { name: "Tools", creatorName: "The crew", explanation: "Narrow services research, retrieve memory, save work, and generate media with checked inputs.", icon: Terminal },
  { name: "Database", creatorName: "The archive", explanation: "PostgreSQL preserves sources, assets, runs, versions, and approvals across restarts.", icon: Database },
  { name: "Review", creatorName: "The sign-off", explanation: "The creator inspects an exact content version. Publishing remains impossible without that approval.", icon: ShieldCheck }
];

const readCompleted = () => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]);
  } catch {
    return new Set<string>();
  }
};

const readHash = () => {
  const id = window.location.hash.replace(/^#\/?/, "");
  return modules.some((module) => module.id === id) ? id : "";
};

function CodeCard({ block }: { block: CodeBlock }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <figure className="code-card">
      <figcaption>
        <span><Code2 size={15} /> {block.title}</span>
        <span className="code-language">{block.language}</span>
        <button type="button" className="copy-button" onClick={copy} aria-label={`Copy ${block.title}`}>
          {copied ? <Check size={15} /> : <Clipboard size={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre><code>{block.code}</code></pre>
      {block.note ? <p className="code-note">{block.note}</p> : null}
    </figure>
  );
}

function ArchitectureLab() {
  const [selected, setSelected] = useState(1);
  const stage = architectureStages[selected];
  const Icon = stage.icon;

  return (
    <section className="architecture-lab" aria-labelledby="architecture-heading">
      <div className="section-intro">
        <span className="section-kicker">INTERACTIVE SYSTEM MAP</span>
        <h2 id="architecture-heading">The studio behind an agent</h2>
        <p>Select each station. The technical name is paired with the job it performs in a creator’s world.</p>
      </div>
      <div className="stage-track" role="tablist" aria-label="Agent architecture stages">
        {architectureStages.map((item, index) => {
          const StageIcon = item.icon;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={selected === index}
              className={selected === index ? "stage is-active" : "stage"}
              key={item.name}
              onClick={() => setSelected(index)}
            >
              <span className="stage-index">{String(index + 1).padStart(2, "0")}</span>
              <StageIcon size={20} />
              <strong>{item.creatorName}</strong>
              <small>{item.name}</small>
            </button>
          );
        })}
      </div>
      <div className="stage-explanation" role="tabpanel" aria-live="polite">
        <span><Icon size={20} /></span>
        <div><strong>{stage.creatorName} <i>is the {stage.name.toLowerCase()} layer.</i></strong><p>{stage.explanation}</p></div>
      </div>
    </section>
  );
}

function Overview({ completed, openModule }: { completed: Set<string>; openModule: (id: string) => void }) {
  const firstIncomplete = modules.find((module) => !completed.has(module.id)) ?? modules[0];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span /> A PATIENT BUILD-IT-YOURSELF COURSE</span>
          <h1>Build your first<br /><em>creator agent.</em></h1>
          <p className="hero-lede">Start with your content routine. Finish with a scheduled, evidence-led system that researches, remembers, creates, and waits for your approval.</p>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => openModule(firstIncomplete.id)}>
              <Play size={17} fill="currentColor" /> {completed.size ? "Continue the course" : "Start at zero"}
            </button>
            <a className="text-link" href="https://github.com/porkytheblack/creator-agent-zero-to-hero" target="_blank" rel="noreferrer">View course code <ExternalLink size={15} /></a>
          </div>
          <div className="course-facts" aria-label="Course facts">
            <span><strong>13</strong> stages</span>
            <span><strong>24–32</strong> hours</span>
            <span><strong>$0</strong> live spend required</span>
          </div>
        </div>
        <div className="hero-board" aria-label="From creator routine to autonomous system">
          <div className="board-tape" />
          <span className="board-label">YOUR MORNING, TRANSLATED</span>
          <article className="routine-card routine-one"><small>07:00</small><strong>Watch what’s moving</strong><span>TikTok · Instagram · communities</span></article>
          <article className="routine-card routine-two"><small>07:20</small><strong>Find the angle</strong><span>Trend × brand × audience</span></article>
          <article className="routine-card routine-three"><small>07:40</small><strong>Make the content</strong><span>Script · shots · image · caption</span></article>
          <div className="agent-stamp"><Sparkles size={22} /><span>THIS BECOMES<br /><strong>AN AGENT LOOP</strong></span></div>
          <svg className="board-arrow" viewBox="0 0 210 80" role="img" aria-label="Routine flows into an agent loop"><path d="M8 12 C88 6, 84 65, 184 48" /><path d="m174 38 13 10-14 8" /></svg>
        </div>
      </section>

      <ArchitectureLab />

      <section className="curriculum" aria-labelledby="curriculum-heading">
        <div className="section-intro curriculum-intro">
          <span className="section-kicker">THE BUILD PATH</span>
          <h2 id="curriculum-heading">Slow enough to understand.<br />Complete enough to ship.</h2>
          <p>Every stage ends with a checkpoint and a teach-back. Mark it complete only when you can explain it without the page.</p>
        </div>
        {phases.map((phase) => {
          const phaseModules = modules.filter((module) => module.phase === phase);
          return (
            <div className="phase-group" key={phase}>
              <div className="phase-heading"><span>{phase}</span><i>{phaseModules.length} {phaseModules.length === 1 ? "stage" : "stages"}</i></div>
              <div className="module-list">
                {phaseModules.map((module) => {
                  const done = completed.has(module.id);
                  return (
                    <button type="button" className="module-row" key={module.id} onClick={() => openModule(module.id)}>
                      <span className={done ? "module-number is-done" : "module-number"}>{done ? <Check size={18} /> : String(module.number).padStart(2, "0")}</span>
                      <span className="module-copy"><strong>{module.title}</strong><small>{module.subtitle}</small></span>
                      <span className="module-time">{module.time}</span>
                      <ChevronRight size={18} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}

function Lesson({ module, completed, toggleComplete, goTo }: {
  module: CourseModule;
  completed: boolean;
  toggleComplete: () => void;
  goTo: (id: string) => void;
}) {
  const [note, setNote] = useState(() => localStorage.getItem(`${NOTE_PREFIX}${module.id}`) ?? "");
  const currentIndex = modules.findIndex((item) => item.id === module.id);
  const previous = modules[currentIndex - 1];
  const next = modules[currentIndex + 1];

  useEffect(() => {
    setNote(localStorage.getItem(`${NOTE_PREFIX}${module.id}`) ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [module.id]);

  function saveNote(value: string) {
    setNote(value);
    localStorage.setItem(`${NOTE_PREFIX}${module.id}`, value);
  }

  return (
    <article className="lesson">
      <header className="lesson-hero">
        <div className="lesson-marker"><span>{module.phase}</span><strong>{String(module.number).padStart(2, "0")}</strong></div>
        <div className="lesson-heading">
          <span className="lesson-time">STAGE {module.number} · {module.time}</span>
          <h1>{module.title}</h1>
          <p>{module.subtitle}</p>
        </div>
      </header>

      <div className="lesson-layout">
        <div className="lesson-main">
          <section className="outcome-panel">
            <span><CheckCircle2 size={18} /> WHEN YOU FINISH</span>
            <p>{module.outcome}</p>
          </section>

          <section className="analogy-panel">
            <div><Lightbulb size={21} /></div>
            <p><strong>Think like a creator:</strong> {module.creatorAnalogy}</p>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">WHAT YOU WILL LEARN</span>
            <h2>Keep these outcomes in view</h2>
            <ul className="objective-list">
              {module.objectives.map((objective) => <li key={objective}><Circle size={13} /> {objective}</li>)}
            </ul>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">BUILD IT, STEP BY STEP</span>
            <h2>Move one block at a time</h2>
            <div className="step-list">
              {module.steps.map((step, index) => (
                <div className="build-step" key={step.title}>
                  <span className="build-step-number">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{step.title}</h3><p>{step.body}</p>{step.why ? <small><strong>Why:</strong> {step.why}</small> : null}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="lesson-section code-section">
            <span className="section-kicker">OPEN THE EDITOR</span>
            <h2>Build this block</h2>
            {module.codeBlocks.map((block) => <CodeCard block={block} key={block.title} />)}
          </section>

          <section className="lesson-section split-section">
            <div>
              <span className="section-kicker">CHECKPOINT</span>
              <h2>Do not move on until…</h2>
              <ul className="check-list">{module.checkpoint.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul>
            </div>
            <div className="pitfall-list">
              <span className="section-kicker">COMMON DETOURS</span>
              <h2>Watch for these</h2>
              <ul>{module.pitfalls.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </section>

          <section className="teach-back">
            <span><BookOpen size={20} /> TEACH IT BACK</span>
            <h2>If you can explain it, you own it.</h2>
            <p>{module.teachBack}</p>
            <label htmlFor={`note-${module.id}`}>Your explanation</label>
            <textarea id={`note-${module.id}`} value={note} onChange={(event) => saveNote(event.target.value)} placeholder="Write this in your own words. Your note stays in this browser." />
            <small>{note ? "Saved locally" : "Nothing is sent anywhere."}</small>
          </section>

          <div className="lesson-finish">
            <button type="button" className={completed ? "complete-button is-complete" : "complete-button"} onClick={toggleComplete}>
              {completed ? <CheckCircle2 size={19} /> : <Circle size={19} />}
              {completed ? "Stage complete" : "Mark this stage complete"}
            </button>
            <div className="lesson-nav">
              {previous ? <button type="button" onClick={() => goTo(previous.id)}><ArrowLeft size={16} /> Previous</button> : <span />}
              {next ? <button type="button" onClick={() => goTo(next.id)}>Next stage <ArrowRight size={16} /></button> : <button type="button" onClick={() => goTo("")}>Course home <ArrowRight size={16} /></button>}
            </div>
          </div>
        </div>

        <aside className="lesson-aside">
          <span className="aside-kicker">STAGE MAP</span>
          {modules.map((item) => (
            <button type="button" key={item.id} className={item.id === module.id ? "aside-module is-current" : "aside-module"} onClick={() => goTo(item.id)}>
              <span>{String(item.number).padStart(2, "0")}</span><strong>{item.title}</strong>
            </button>
          ))}
        </aside>
      </div>
    </article>
  );
}

function Glossary({ close }: { close: () => void }) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className="glossary-dialog" role="dialog" aria-modal="true" aria-labelledby="glossary-title">
        <header><div><span className="section-kicker">PLAIN-LANGUAGE REFERENCE</span><h2 id="glossary-title">Agent words, translated</h2></div><button type="button" onClick={close} aria-label="Close glossary"><X size={20} /></button></header>
        <dl>{glossary.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl>
      </section>
    </div>
  );
}

export function App() {
  const [completed, setCompleted] = useState<Set<string>>(() => readCompleted());
  const [activeId, setActiveId] = useState(() => readHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const progress = Math.round((completed.size / modules.length) * 100);
  const active = useMemo(() => modules.find((module) => module.id === activeId), [activeId]);

  useEffect(() => {
    const onHash = () => setActiveId(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function goTo(id: string) {
    window.location.hash = id ? `/${id}` : "";
    setActiveId(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleComplete(id: string) {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function resetProgress() {
    if (!window.confirm("Reset completed stages? Your written teach-back notes will stay saved.")) return;
    localStorage.setItem(STORAGE_KEY, "[]");
    setCompleted(new Set());
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => goTo("")} aria-label="Course home">
          <span className="brand-mark"><GitBranch size={18} /></span>
          <span><strong>CREATOR AGENT</strong><small>FIELD GUIDE</small></span>
        </button>
        <div className="top-progress">
          <span>{completed.size} of {modules.length} stages</span>
          <div className="progress-track" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><i style={{ width: `${progress}%` }} /></div>
          <strong>{progress}%</strong>
        </div>
        <nav className="desktop-actions" aria-label="Course utilities">
          <button type="button" onClick={() => setGlossaryOpen(true)}>Glossary</button>
          <button type="button" onClick={resetProgress} title="Reset progress"><RotateCcw size={16} /> Reset</button>
        </nav>
        <button type="button" className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open course menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      {menuOpen ? (
        <nav className="mobile-drawer" aria-label="Course stages">
          <button type="button" onClick={() => goTo("")}>Course home</button>
          {modules.map((module) => <button type="button" key={module.id} onClick={() => goTo(module.id)}>{completed.has(module.id) ? <CheckCircle2 size={15} /> : <Circle size={15} />} {module.number}. {module.title}</button>)}
          <button type="button" onClick={() => { setGlossaryOpen(true); setMenuOpen(false); }}>Glossary</button>
        </nav>
      ) : null}

      <main>
        {active ? <Lesson module={active} completed={completed.has(active.id)} toggleComplete={() => toggleComplete(active.id)} goTo={goTo} /> : <Overview completed={completed} openModule={goTo} />}
      </main>

      <footer>
        <div><span className="brand-mark"><Image size={18} /></span><p><strong>Build the system. Keep the judgment.</strong><br />An open learning utility for creators becoming agent builders.</p></div>
        <span>MIT licensed · Progress stays in your browser</span>
      </footer>

      {glossaryOpen ? <Glossary close={() => setGlossaryOpen(false)} /> : null}
    </div>
  );
}
