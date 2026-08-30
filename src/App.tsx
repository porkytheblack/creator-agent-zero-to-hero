import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  Code2,
  Copy,
  ExternalLink,
  FileCode2,
  Folder,
  GitBranch,
  Lightbulb,
  ListChecks,
  Menu,
  Network,
  PanelRightClose,
  PanelRightOpen,
  Play,
  RotateCcw,
  Terminal,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { allUnits, chapters, findUnit, REPO_BASE, REPO_ROOT, type CourseChapter, type LessonUnit } from "./curriculum";
import { referenceFileByPath, referenceFiles, type ReferenceFile } from "./reference-files";

const PROGRESS_KEY = "creator-agent-field-guide-deep-progress-v2";
const STEP_KEY = "creator-agent-field-guide-deep-steps-v2";
const NOTE_KEY = "creator-agent-field-guide-deep-note:";

type Location = { chapterId: string; unitId: string } | null;

const unitKey = (chapterId: string, unitId: string) => `${chapterId}/${unitId}`;

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
};

const readLocation = (): Location => {
  if (typeof window === "undefined") return null;
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts.length >= 2 && findUnit(parts[0], parts[1])) return { chapterId: parts[0], unitId: parts[1] };
  if (parts.length === 1) {
    const chapter = chapters.find((item) => item.id === parts[0]);
    if (chapter) return { chapterId: chapter.id, unitId: chapter.units[0].id };
  }
  return null;
};

const repoUrl = (path: string) => `${REPO_BASE}/${path}`;

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-line" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <i style={{ width: `${value}%` }} />
    </div>
  );
}

function CourseOutline({
  location,
  completed,
  openUnit,
  closeMobile
}: {
  location: Location;
  completed: Set<string>;
  openUnit: (chapterId: string, unitId: string) => void;
  closeMobile?: () => void;
}) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(() => new Set(chapters.map((chapter) => chapter.id)));

  const toggleChapter = (id: string) => {
    setOpenChapters((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <aside className="course-outline" aria-label="Course outline">
      <div className="outline-heading">
        <span>BUILD PATH</span>
        {closeMobile ? <button type="button" onClick={closeMobile} aria-label="Close course outline"><X size={19} /></button> : null}
      </div>
      <button type="button" className={!location ? "outline-home is-active" : "outline-home"} onClick={() => { window.location.hash = ""; closeMobile?.(); }}>
        <BookOpen size={17} /> Course home
      </button>
      <div className="chapter-tree">
        {chapters.map((chapter) => {
          const chapterCompleted = chapter.units.filter((unit) => completed.has(unitKey(chapter.id, unit.id))).length;
          const expanded = openChapters.has(chapter.id);
          return (
            <section className="outline-chapter" key={chapter.id}>
              <button type="button" className="chapter-toggle" onClick={() => toggleChapter(chapter.id)} aria-expanded={expanded}>
                <span className="chapter-number">{String(chapter.number).padStart(2, "0")}</span>
                <span><strong>{chapter.title}</strong><small>{chapterCompleted}/{chapter.units.length} complete</small></span>
                {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>
              {expanded ? (
                <div className="outline-units">
                  {chapter.units.map((unit, index) => {
                    const key = unitKey(chapter.id, unit.id);
                    const active = location?.chapterId === chapter.id && location.unitId === unit.id;
                    const done = completed.has(key);
                    return (
                      <button
                        type="button"
                        className={active ? "outline-unit is-active" : "outline-unit"}
                        key={unit.id}
                        onClick={() => { openUnit(chapter.id, unit.id); closeMobile?.(); }}
                      >
                        <span className={done ? "unit-status is-done" : "unit-status"}>{done ? <Check size={12} /> : index + 1}</span>
                        <span>{unit.title}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </aside>
  );
}

function CodeViewer({ file, lessonFiles, chooseFile }: { file?: ReferenceFile; lessonFiles: string[]; chooseFile: (path: string) => void }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!file) return;
    await navigator.clipboard.writeText(file.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <aside className="code-workspace" aria-label="Reference code workspace">
      <div className="workspace-titlebar">
        <span><Code2 size={15} /> SHARLET SOURCE</span>
        <a href={REPO_ROOT} target="_blank" rel="noreferrer" aria-label="Open Sharlet on GitHub"><ExternalLink size={15} /></a>
      </div>
      <div className="workspace-body">
        <div className="file-explorer">
          <span className="explorer-label"><Folder size={14} /> LESSON FILES</span>
          {lessonFiles.map((path) => (
            <button type="button" className={file?.path === path ? "file-button is-active" : "file-button"} onClick={() => chooseFile(path)} key={path}>
              <FileCode2 size={14} /><span>{path}</span>
            </button>
          ))}
        </div>
        {file ? (
          <div className="editor-panel">
            <div className="editor-tab">
              <span><FileCode2 size={13} /> {file.path}</span>
              <button type="button" onClick={copy}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}</button>
            </div>
            <p className="file-purpose">{file.purpose}</p>
            <pre className="line-code" aria-label={`Code from ${file.path}`}>
              {file.code.split("\n").map((line, index) => (
                <code key={`${index}-${line}`}><span>{String(index + 1).padStart(2, "0")}</span>{line || " "}</code>
              ))}
            </pre>
            <a className="github-file-link" href={repoUrl(file.path)} target="_blank" rel="noreferrer">Open the complete file in GitHub <ExternalLink size={13} /></a>
          </div>
        ) : (
          <div className="empty-editor"><Code2 size={28} /><strong>Select a lesson file</strong><p>The lesson explains why it exists before asking you to read its code.</p></div>
        )}
      </div>
    </aside>
  );
}

function MentalModel({ unit }: { unit: LessonUnit }) {
  return (
    <section className="mental-model">
      <div className="mental-model-heading"><Network size={19} /><span>MENTAL MODEL</span></div>
      <div className="model-grid">
        <article><small>IN CREATOR LANGUAGE</small><p>{unit.mentalModel.plain}</p></article>
        <article><small>IN TECHNICAL LANGUAGE</small><p>{unit.mentalModel.technical}</p></article>
        <article><small>HOW IT CONNECTS</small><p>{unit.mentalModel.connection}</p></article>
      </div>
    </section>
  );
}

function CommandBlock({ command, expected }: { command: string; expected?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="command-block">
      <div><span><Terminal size={14} /> TERMINAL</span><button type="button" onClick={copy}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? "Copied" : "Copy"}</button></div>
      <pre>{command}</pre>
      {expected ? <p><strong>Expected:</strong> {expected}</p> : null}
    </div>
  );
}

function Quiz({ unit, onPass }: { unit: LessonUnit; onPass: () => void }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = choice === unit.quiz.answer;

  useEffect(() => {
    setChoice(null);
    setChecked(false);
  }, [unit.id]);

  const submit = () => {
    if (choice === null) return;
    setChecked(true);
    if (choice === unit.quiz.answer) onPass();
  };

  return (
    <section className="knowledge-check">
      <span className="lesson-eyebrow"><Lightbulb size={15} /> KNOWLEDGE CHECK</span>
      <h2>{unit.quiz.question}</h2>
      <div className="quiz-options">
        {unit.quiz.options.map((option, index) => (
          <button
            type="button"
            className={choice === index ? "quiz-option is-selected" : "quiz-option"}
            key={option}
            onClick={() => { setChoice(index); setChecked(false); }}
          >
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </button>
        ))}
      </div>
      <button type="button" className="check-answer" disabled={choice === null} onClick={submit}>Check answer</button>
      {checked ? <div className={correct ? "quiz-feedback is-correct" : "quiz-feedback is-wrong"}><strong>{correct ? "That’s it." : "Not yet."}</strong><p>{correct ? unit.quiz.explanation : "Re-read the mental model, then choose the answer that names the responsible software boundary."}</p></div> : null}
    </section>
  );
}

function Lesson({
  chapter,
  unit,
  completed,
  stepState,
  quizPassed,
  toggleStep,
  passQuiz,
  completeUnit,
  openUnit,
  chooseFile
}: {
  chapter: CourseChapter;
  unit: LessonUnit;
  completed: boolean;
  stepState: Set<number>;
  quizPassed: boolean;
  toggleStep: (index: number) => void;
  passQuiz: () => void;
  completeUnit: () => void;
  openUnit: (chapterId: string, unitId: string) => void;
  chooseFile: (path: string) => void;
}) {
  const currentIndex = allUnits.findIndex((item) => item.chapter.id === chapter.id && item.unit.id === unit.id);
  const previous = allUnits[currentIndex - 1];
  const next = allUnits[currentIndex + 1];
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote(localStorage.getItem(`${NOTE_KEY}${unitKey(chapter.id, unit.id)}`) ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapter.id, unit.id]);

  const saveNote = (value: string) => {
    setNote(value);
    localStorage.setItem(`${NOTE_KEY}${unitKey(chapter.id, unit.id)}`, value);
  };

  return (
    <article className="lesson-page">
      <header className="lesson-header">
        <div className="breadcrumb"><span>CHAPTER {chapter.number}</span><ChevronRight size={14} /><span>{chapter.title}</span></div>
        <div className="lesson-title-row">
          <span className="lesson-index">{String(currentIndex + 1).padStart(2, "0")}</span>
          <div><div className="lesson-meta"><span>{chapter.phase}</span><span><Clock3 size={13} /> {unit.duration}</span></div><h1>{unit.title}</h1><p>{unit.promise}</p></div>
        </div>
      </header>

      <div className="lesson-content">
        <MentalModel unit={unit} />

        {unit.trace ? (
          <section className="flow-trace" aria-label="System flow">
            <span className="lesson-eyebrow"><GitBranch size={15} /> FOLLOW THE FLOW</span>
            <div>{unit.trace.map((step, index) => <span key={step}><i>{index + 1}</i>{step}{index < unit.trace!.length - 1 ? <ArrowRight size={15} /> : null}</span>)}</div>
          </section>
        ) : null}

        {unit.sections.map((section, index) => (
          <section className="explain-section" key={section.title}>
            <span className="section-count">{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.callout ? <aside className="lesson-callout"><strong>{section.callout.label}</strong><p>{section.callout.text}</p></aside> : null}</div>
          </section>
        ))}

        <section className="read-code-section">
          <span className="lesson-eyebrow"><Code2 size={15} /> READ THE CODE WITH A PURPOSE</span>
          <h2>Open these files in order</h2>
          <p>Do not scan. Use the question under each file, then inspect it in the code workspace or GitHub.</p>
          <div className="lesson-files">
            {unit.files.map((file, index) => (
              <button type="button" key={file.path} onClick={() => chooseFile(file.path)}>
                <span>{index + 1}</span><div><strong>{file.path}</strong><p>{file.reason}</p>{file.focus ? <small>Focus: {file.focus}</small> : null}</div><PanelRightOpen size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className="guided-build">
          <span className="lesson-eyebrow"><ListChecks size={15} /> GUIDED BUILD</span>
          <h2>Do each step before moving on</h2>
          <p>The checkboxes are a pacing tool. Open your editor or terminal, perform the action, and compare the result.</p>
          <div className="guided-steps">
            {unit.steps.map((step, index) => {
              const done = stepState.has(index);
              return (
                <article className={done ? "guided-step is-done" : "guided-step"} key={step.action}>
                  <button type="button" onClick={() => toggleStep(index)} aria-label={`${done ? "Unmark" : "Mark"} ${step.action}`}>
                    {done ? <Check size={16} /> : <span>{index + 1}</span>}
                  </button>
                  <div><h3>{step.action}</h3><p>{step.detail}</p>{step.command ? <CommandBlock command={step.command} expected={step.expected} /> : step.expected ? <small><strong>Expected:</strong> {step.expected}</small> : null}</div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="checkpoint-panel">
          <span className="lesson-eyebrow"><CheckCircle2 size={15} /> BEFORE YOU CONTINUE</span>
          <h2>You should be able to say yes to each statement.</h2>
          <ul>{unit.checks.map((check) => <li key={check}><Check size={15} /> {check}</li>)}</ul>
        </section>

        <Quiz unit={unit} onPass={passQuiz} />

        <section className="teach-back-deep">
          <span className="lesson-eyebrow"><BookOpen size={15} /> EXPLAIN IT BACK</span>
          <h2>Connect this unit to the full run.</h2>
          <p>In your own words: what responsibility did this unit add, what does it depend on, what can fail, and what reads its output next?</p>
          <textarea value={note} onChange={(event) => saveNote(event.target.value)} placeholder="Write as if you were explaining the system to another creator. Your note stays in this browser." />
          <small>{note ? "Saved in this browser" : "Nothing is sent anywhere."}</small>
        </section>

        <section className="unit-completion">
          <div><strong>{stepState.size}/{unit.steps.length} build steps</strong><strong>{quizPassed ? "Knowledge check passed" : "Knowledge check pending"}</strong></div>
          <button type="button" className={completed ? "finish-unit is-complete" : "finish-unit"} onClick={completeUnit}>
            {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}{completed ? "Unit complete" : "Mark unit complete"}
          </button>
          {!completed && (stepState.size < unit.steps.length || !quizPassed) ? <p>You can complete the unit at any time, but the build steps and knowledge check show what remains.</p> : null}
        </section>

        <nav className="lesson-pagination" aria-label="Lesson navigation">
          {previous ? <button type="button" onClick={() => openUnit(previous.chapter.id, previous.unit.id)}><ArrowLeft size={16} /><span><small>PREVIOUS</small>{previous.unit.title}</span></button> : <span />}
          {next ? <button type="button" onClick={() => openUnit(next.chapter.id, next.unit.id)}><span><small>NEXT</small>{next.unit.title}</span><ArrowRight size={16} /></button> : <button type="button" onClick={() => { window.location.hash = ""; }}><span><small>FINISHED</small>Course home</span><ArrowRight size={16} /></button>}
        </nav>
      </div>
    </article>
  );
}

function CourseHome({ completed, openUnit }: { completed: Set<string>; openUnit: (chapterId: string, unitId: string) => void }) {
  const firstIncomplete = allUnits.find(({ chapter, unit }) => !completed.has(unitKey(chapter.id, unit.id))) ?? allUnits[0];
  const progress = Math.round((completed.size / allUnits.length) * 100);
  return (
    <main className="course-home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-kicker">A CODE-REFERENCED LEARNING PATH</span>
          <h1>Understand the system.<br /><em>Then build it.</em></h1>
          <p>This is a guided mental-model course built against Sharlet’s complete public source. Follow one creator request through TypeScript, Effect, PostgreSQL, Glove, Foundry, research, media generation, approval, and production operations.</p>
          <div className="home-actions">
            <button type="button" onClick={() => openUnit(firstIncomplete.chapter.id, firstIncomplete.unit.id)}><Play size={16} fill="currentColor" /> {completed.size ? "Continue your path" : "Begin with the mental model"}</button>
            <a href={REPO_ROOT} target="_blank" rel="noreferrer">Open the complete Sharlet codebase <ExternalLink size={15} /></a>
          </div>
          <div className="home-progress"><span><strong>{completed.size}</strong> of {allUnits.length} units</span><ProgressBar value={progress} label="Course progress" /><strong>{progress}%</strong></div>
        </div>
        <div className="system-spine" aria-label="The course follows one complete system flow">
          <span className="spine-label">THE REQUEST SPINE</span>
          {["Creator intent", "Foundry run", "Glove loop", "Effect services", "PostgreSQL truth", "Human approval"].map((item, index) => <div key={item}><i>{String(index + 1).padStart(2, "0")}</i><strong>{item}</strong>{index < 5 ? <ArrowRight size={17} /> : <Check size={17} />}</div>)}
        </div>
      </section>

      <section className="course-contract">
        <span>WHAT IS DIFFERENT NOW</span>
        <div><article><strong>36 guided units</strong><p>Each unit teaches one mental model, shows how it connects, points to exact production files, and ends with a build sequence.</p></article><article><strong>The complete Sharlet source</strong><p>The public repository is the real product: runtime, web app, migrations, integrations, fixtures, tests, and operational boundaries.</p></article><article><strong>Recovery and production</strong><p>The course follows failures, retries, identity, cost, approval, testing, topology, and runbooks—not just the happy path.</p></article></div>
      </section>

      <section className="chapter-catalog">
        <header><span>THE COMPLETE PATH</span><h2>One system, twelve chapters.</h2><p>Chapters are ordered by dependency. Later units assume you can explain the earlier boundary.</p></header>
        <div>
          {chapters.map((chapter) => {
            const done = chapter.units.filter((unit) => completed.has(unitKey(chapter.id, unit.id))).length;
            return (
              <article className="chapter-card" key={chapter.id}>
                <div className="chapter-card-number">{String(chapter.number).padStart(2, "0")}</div>
                <span>{chapter.phase}</span><h3>{chapter.title}</h3><p>{chapter.subtitle}</p>
                <ul>{chapter.units.map((unit) => <li key={unit.id}>{completed.has(unitKey(chapter.id, unit.id)) ? <Check size={13} /> : <Circle size={13} />} {unit.title}</li>)}</ul>
                <div><small>{done}/{chapter.units.length} complete</small><button type="button" onClick={() => openUnit(chapter.id, chapter.units[0].id)}>Open chapter <ArrowRight size={14} /></button></div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export function App() {
  const [location, setLocation] = useState<Location>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [stepMap, setStepMap] = useState<Record<string, number[]>>({});
  const [quizPassed, setQuizPassed] = useState<Set<string>>(new Set());
  const [mobileOutline, setMobileOutline] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);
  const [activeFilePath, setActiveFilePath] = useState(referenceFiles[0].path);

  useEffect(() => {
    setCompleted(new Set(readJson<string[]>(PROGRESS_KEY, [])));
    setStepMap(readJson<Record<string, number[]>>(STEP_KEY, {}));
    setQuizPassed(new Set(readJson<string[]>(`${STEP_KEY}:quiz`, [])));
    const updateLocation = () => setLocation(readLocation());
    updateLocation();
    window.addEventListener("hashchange", updateLocation);
    return () => window.removeEventListener("hashchange", updateLocation);
  }, []);

  const selected = useMemo(() => location ? findUnit(location.chapterId, location.unitId) : undefined, [location]);
  const currentKey = location ? unitKey(location.chapterId, location.unitId) : "";
  const lessonFiles = selected?.unit.files.map((file) => file.path) ?? [referenceFiles[0].path];
  const activeFile = referenceFileByPath.get(activeFilePath) ?? referenceFileByPath.get(lessonFiles[0]);
  const progress = Math.round((completed.size / allUnits.length) * 100);

  useEffect(() => {
    if (selected && !selected.unit.files.some((file) => file.path === activeFilePath)) setActiveFilePath(selected.unit.files[0]?.path ?? referenceFiles[0].path);
  }, [selected, activeFilePath]);

  const openUnit = (chapterId: string, unitId: string) => {
    window.location.hash = `/${chapterId}/${unitId}`;
    setLocation({ chapterId, unitId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStep = (index: number) => {
    if (!currentKey) return;
    setStepMap((current) => {
      const set = new Set(current[currentKey] ?? []);
      if (set.has(index)) set.delete(index); else set.add(index);
      const next = { ...current, [currentKey]: [...set] };
      localStorage.setItem(STEP_KEY, JSON.stringify(next));
      return next;
    });
  };

  const passQuiz = () => {
    if (!currentKey) return;
    setQuizPassed((current) => {
      const next = new Set(current).add(currentKey);
      localStorage.setItem(`${STEP_KEY}:quiz`, JSON.stringify([...next]));
      return next;
    });
  };

  const completeUnit = () => {
    if (!currentKey) return;
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(currentKey)) next.delete(currentKey); else next.add(currentKey);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const reset = () => {
    if (!window.confirm("Reset completed units and guided-step checks? Your written explain-back notes will stay saved.")) return;
    localStorage.setItem(PROGRESS_KEY, "[]");
    localStorage.setItem(STEP_KEY, "{}");
    localStorage.setItem(`${STEP_KEY}:quiz`, "[]");
    setCompleted(new Set());
    setStepMap({});
    setQuizPassed(new Set());
  };

  return (
    <div className={selected && codeOpen ? "learning-shell has-code" : "learning-shell"}>
      <header className="learning-topbar">
        <button type="button" className="mobile-outline-button" onClick={() => setMobileOutline(true)} aria-label="Open course outline"><Menu size={20} /></button>
        <button type="button" className="course-brand" onClick={() => { window.location.hash = ""; }}><span><GitBranch size={17} /></span><div><strong>CREATOR AGENT</strong><small>FIELD GUIDE</small></div></button>
        <div className="global-progress"><span>{completed.size}/{allUnits.length} units</span><ProgressBar value={progress} label="Overall course progress" /><strong>{progress}%</strong></div>
        <nav className="topbar-actions">
          <a href={REPO_ROOT} target="_blank" rel="noreferrer"><GitBranch size={15} /> Sharlet source</a>
          <button type="button" onClick={reset}><RotateCcw size={15} /> Reset</button>
          {selected ? <button type="button" onClick={() => setCodeOpen(!codeOpen)}>{codeOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />} Code</button> : null}
        </nav>
      </header>

      <CourseOutline location={location} completed={completed} openUnit={openUnit} />

      {mobileOutline ? <div className="mobile-outline-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setMobileOutline(false)}><CourseOutline location={location} completed={completed} openUnit={openUnit} closeMobile={() => setMobileOutline(false)} /></div> : null}

      <div className="primary-content">
        {selected ? (
          <Lesson
            chapter={selected.chapter}
            unit={selected.unit}
            completed={completed.has(currentKey)}
            stepState={new Set(stepMap[currentKey] ?? [])}
            quizPassed={quizPassed.has(currentKey)}
            toggleStep={toggleStep}
            passQuiz={passQuiz}
            completeUnit={completeUnit}
            openUnit={openUnit}
            chooseFile={(path) => { setActiveFilePath(path); setCodeOpen(true); }}
          />
        ) : <CourseHome completed={completed} openUnit={openUnit} />}
      </div>

      {selected && codeOpen ? <CodeViewer file={activeFile} lessonFiles={lessonFiles} chooseFile={setActiveFilePath} /> : null}
    </div>
  );
}
