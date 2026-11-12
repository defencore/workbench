import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  FileText,
  FolderOpen,
  Grid2X2,
  HardDrive,
  Layers3,
  Menu,
  Ruler,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TriangleAlert,
  Wrench,
  X,
} from "lucide-react";
import ToolSelector from "./components/ToolSelector";
import SaveButton from "./components/SaveButton";
import {
  ProjectCard,
  ProjectsCatalog,
  ProjectDetail,
} from "./components/ProjectWorkbench";
import {
  MaterialCard,
  MaterialsCatalog,
  MaterialDetail,
  materialBookmark,
} from "./components/MaterialWorkbench";
import LatheAnatomy from "./components/LatheAnatomy";
import { latheParts, latheControls, toolpostParts } from "./data/lathe-anatomy";
import { materialGuides } from "./data/material-guides";
import LessonDiagram from "./components/LessonDiagram";
import { lessons, projects, sources } from "./data/content";
import { categories, countLabel, levels, tr } from "./data/ui";
import type { CategoryId, Lang, Lesson, ModelKind, Text } from "./data/types";
import {
  clearServiceData,
  defaults,
  readPreferences,
  writePreferences,
} from "./storage";
import type { Preferences } from "./storage";
import { markOfflineCleared, useOfflineStatus } from "./offline";
const ModelViewer = lazy(() => import("./components/ModelViewer"));
const icons: Record<
  CategoryId,
  ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  "machine-care": Settings2,
  tooling: Wrench,
  safety: ShieldCheck,
  fundamentals: Wrench,
  lathe: Target,
  milling: Layers3,
  cnc: Grid2X2,
  materials: Box,
  measurement: Ruler,
  reverse: Compass,
};
const txt = (uk: string, en: string, lang: Lang) => (lang === "uk" ? uk : en);
const category = (id: CategoryId) => categories.find((c) => c.id === id)!;
const normalize = (s: string) =>
  s.toLocaleLowerCase().normalize("NFKC").replace(/[’'`]/g, "");
function getRoute() {
  try {
    const hash = location.hash.slice(1);
    const url = new URL(
      hash.startsWith("/") && !hash.startsWith("//") ? hash : "/",
      location.origin,
    );
    const parts = url.pathname.split("/").filter(Boolean);
    return {
      page: parts[0] || "library",
      id: parts[1],
      category: url.searchParams.get("category") || "",
    };
  } catch {
    return { page: "library", id: undefined, category: "" };
  }
}
function Brand() {
  return (
    <a href="#/" className="brand" aria-label="Workbench by Defencore">
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="m3 10 7 21h6l4-13 4 13h6l7-21h-7l-3 13-4-13h-6l-4 13-3-13Z"
          fill="currentColor"
        />
      </svg>
      <span>
        workbench<span className="brand-by">BY DEFENCORE</span>
      </span>
    </a>
  );
}
function Model({
  kind,
  lang,
  compact = false,
}: {
  kind: ModelKind;
  lang: Lang;
  compact?: boolean;
}) {
  return (
    <Suspense
      fallback={
        <div className="model-loading">
          <Box size={28} />
          <span>
            {txt("Завантаження 3D-моделі…", "Loading 3D model…", lang)}
          </span>
        </div>
      }
    >
      <ModelViewer kind={kind} lang={lang} compact={compact} />
    </Suspense>
  );
}
function ModelDisclosure({ kind, lang }: { kind: ModelKind; lang: Lang }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="model-disclosure"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>
        <Box size={19} />
        {txt("Розглянути модель у 3D", "Inspect the 3D model", lang)}
        <ChevronDown size={17} />
      </summary>
      {open && <Model kind={kind} lang={lang} />}
    </details>
  );
}
function LessonRow({
  lesson,
  lang,
  prefs,
  toggle,
}: {
  lesson: Lesson;
  lang: Lang;
  prefs: Preferences;
  toggle: Toggle;
}) {
  return (
    <article className="guide-row">
      <a className="guide-info" href={`#/lesson/${lesson.id}`}>
        <h3>
          {lesson.title[lang]}
          {prefs.completed.includes(lesson.id) && (
            <CheckCircle2 size={16} aria-label={tr("completed", lang)} />
          )}
        </h3>
        <p>{lesson.summary[lang]}</p>
      </a>
      <div className="guide-meta">
        <span>{levels[lesson.level][lang]}</span>
        <span>
          <Clock3 size={14} />
          {lesson.minutes} {txt("хв", "min", lang)}
        </span>
      </div>
      <SaveButton id={lesson.id} lang={lang} prefs={prefs} toggle={toggle} />
      <a
        className="guide-open"
        href={`#/lesson/${lesson.id}`}
        aria-label={lesson.title[lang]}
      >
        <ChevronRight size={18} />
      </a>
    </article>
  );
}
type Toggle = (field: "saved" | "completed" | "checks", id: string) => void;
type Common = { lang: Lang; prefs: Preferences; toggle: Toggle };
const navItems = [
  ["library", BookOpen],
  ["paths", Compass],
  ["projects", Layers3],
  ["tooling", Wrench],
  ["materials", Box],
  ["workshop", Box],
  ["saved", Bookmark],
] as const;
function App() {
  const [route, setRoute] = useState(getRoute),
    [prefs, setPrefs] = useState(readPreferences),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [storageError, setStorageError] = useState(false),
    [notice, setNotice] = useState(""),
    [online, setOnline] = useState(navigator.onLine),
    [expanded, setExpanded] = useState<string[]>(["safety"]);
  const lang = prefs.language;
  const active =
    route.page === "lesson"
      ? "library"
      : route.page === "project"
        ? "projects"
        : route.page === "path"
          ? "paths"
          : route.page === "material"
            ? "materials"
            : route.page === "lathe-anatomy"
              ? "library"
              : route.page;
  const routeCategory =
    route.page === "lesson"
      ? lessons.find((l) => l.id === route.id)?.category
      : route.page === "lathe-anatomy"
        ? "lathe"
        : route.category;
  const activeCat = categories.some((c) => c.id === routeCategory)
    ? routeCategory
    : undefined;
  useEffect(() => {
    if (activeCat) setExpanded([activeCat]);
  }, [activeCat]);
  useEffect(() => {
    const change = () => {
      setRoute(getRoute());
      setMenu(false);
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", change);
    const keys = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" &&
          !["INPUT", "TEXTAREA", "SELECT"].includes(
            (e.target as HTMLElement)?.tagName,
          ))
      ) {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", keys);
    const status = () => setOnline(navigator.onLine);
    window.addEventListener("online", status);
    window.addEventListener("offline", status);
    return () => {
      window.removeEventListener("hashchange", change);
      window.removeEventListener("keydown", keys);
      window.removeEventListener("online", status);
      window.removeEventListener("offline", status);
    };
  }, []);
  useEffect(() => {
    if (menu) {
      document.body.style.overflow = "hidden";
      document.querySelector<HTMLButtonElement>(".mobile-close")?.focus();
    } else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);
  useEffect(() => {
    document.documentElement.lang = lang;
    const lesson = lessons.find(
      (l) => route.page === "lesson" && l.id === route.id,
    );
    const project = projects.find(
      (p) => route.page === "project" && p.id === route.id,
    );
    const material = materialGuides.find(
      (m) => route.page === "material" && m.id === route.id,
    );
    document.title = `${route.page === "lathe-anatomy" ? txt("Токарний верстат: будова й керування", "Lathe: construction & controls", lang) : lesson?.title[lang] || project?.title[lang] || material?.name[lang] || tr(active, lang)} · Workbench`;
  }, [lang, route, active]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === "defencore-workbench:v1" || event.key === null)
        setPrefs(readPreferences());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const update = (next: Preferences) => {
    setPrefs(next);
    setStorageError(!writePreferences(next));
  };
  const toggle: Toggle = (field, id) => {
    setPrefs((prev) => {
      const next = {
        ...prev,
        [field]: prev[field].includes(id)
          ? prev[field].filter((x) => x !== id)
          : [...prev[field], id],
      };
      setStorageError(!writePreferences(next));
      return next;
    });
  };
  const onMeasurement = (key: string, value: string) => {
    setPrefs((previous) => {
      const measurements = { ...previous.measurements };
      if (value) measurements[key] = value.slice(0, 1000);
      else delete measurements[key];
      const next = { ...previous, measurements };
      setStorageError(!writePreferences(next));
      return next;
    });
  };
  const common = { lang, prefs, toggle };
  const completed = lessons.filter((l) =>
    prefs.completed.includes(l.id),
  ).length;
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        {txt("До основного вмісту", "Skip to content", lang)}
      </a>
      {menu && (
        <div className="sidebar-backdrop" onClick={() => setMenu(false)} />
      )}
      <aside
        className={`sidebar ${menu ? "open" : ""}`}
        aria-label={txt("Навігація довідника", "Handbook navigation", lang)}
      >
        <div className="brand-header">
          <Brand />
          <button
            className="icon-button mobile-close"
            onClick={() => setMenu(false)}
            aria-label={tr("close", lang)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-scroll">
          <nav
            className="primary-nav"
            aria-label={txt("Основна навігація", "Main navigation", lang)}
          >
            {navItems.map(([key, Icon]) => (
              <a
                key={key}
                className={active === key ? "active" : ""}
                href={key === "library" ? "#/" : `#/${key}`}
                aria-label={tr(key, lang)}
                aria-current={active === key ? "page" : undefined}
              >
                <Icon size={18} />
                <span>{tr(key, lang)}</span>
                {key === "saved" && prefs.saved.length > 0 && (
                  <b aria-hidden="true" className="nav-count">
                    {prefs.saved.length}
                  </b>
                )}
              </a>
            ))}
          </nav>
          <div className="sidebar-label">
            {txt("РОЗДІЛИ ДОВІДНИКА", "HANDBOOK TOPICS", lang)}
          </div>
          <nav
            className="topic-tree"
            aria-label={txt("Дерево тем", "Topic tree", lang)}
          >
            {categories.map((c) => {
              const Icon = icons[c.id],
                items = lessons.filter((l) => l.category === c.id),
                open = expanded.includes(c.id);
              return (
                <div className="tree-branch" key={c.id}>
                  <div
                    className={`tree-category ${activeCat === c.id ? "selected" : ""}`}
                  >
                    <a href={`#/library?category=${c.id}`}>
                      <Icon size={16} />
                      <span>{c.name[lang]}</span>
                      <small>{items.length + (c.id === "lathe" ? 1 : 0)}</small>
                    </a>
                    <button
                      aria-label={`${open ? txt("Згорнути", "Collapse", lang) : txt("Розгорнути", "Expand", lang)}: ${c.name[lang]}`}
                      aria-expanded={open}
                      onClick={() =>
                        setExpanded((prev) =>
                          prev.includes(c.id) ? [] : [c.id],
                        )
                      }
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  {open && (
                    <div className="tree-lessons">
                      {c.id === "lathe" && (
                        <a
                          href="#/lathe-anatomy"
                          className={
                            route.page === "lathe-anatomy" ? "current" : ""
                          }
                          aria-current={
                            route.page === "lathe-anatomy" ? "page" : undefined
                          }
                        >
                          <span>
                            {txt(
                              "Будова й органи керування",
                              "Construction & controls",
                              lang,
                            )}
                          </span>
                        </a>
                      )}
                      {items.map((l) => (
                        <a
                          key={l.id}
                          href={`#/lesson/${l.id}`}
                          className={route.id === l.id ? "current" : ""}
                          aria-current={route.id === l.id ? "page" : undefined}
                        >
                          {prefs.completed.includes(l.id) ? (
                            <Check size={12} />
                          ) : (
                            <span className="tree-dot" />
                          )}
                          <span>{l.title[lang]}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            <span>{tr("progress", lang)}</span>
            <strong>
              {completed}/{lessons.length}
            </strong>
          </div>
          <div className="progress-track">
            <i style={{ width: `${(completed / lessons.length) * 100}%` }} />
          </div>
          <a
            className={`settings-link ${active === "settings" ? "active" : ""}`}
            href="#/settings"
          >
            <Settings2 size={17} />
            {tr("settings", lang)}
          </a>
          <div className="local-status">
            <span className={online ? "status-dot" : "status-dot offline"} />
            {tr(online ? "onlineStatus" : "offlineStatus", lang)}
          </div>
        </div>
      </aside>
      <div className="main-shell" inert={menu || undefined}>
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label={tr("menu", lang)}
            aria-expanded={menu}
          >
            <Menu size={22} />
          </button>
          <span className="topbar-breadcrumb">
            {tr(active, lang)}
            {activeCat && (
              <>
                <ChevronRight size={14} />
                <strong>{category(activeCat as CategoryId).name[lang]}</strong>
              </>
            )}
          </span>
          <button
            className="search-trigger"
            aria-label={tr("searchShort", lang)}
            onClick={() => setSearch(true)}
          >
            <Search size={18} />
            <span>
              {txt(
                "Пошук по всьому довіднику",
                "Search the entire handbook",
                lang,
              )}
            </span>
            <kbd>⌘ K</kbd>
          </button>
          <div
            className="language-switch"
            aria-label={txt("Мова інтерфейсу", "Interface language", lang)}
          >
            {(["uk", "en"] as const).map((l) => (
              <button
                key={l}
                className={lang === l ? "selected" : ""}
                aria-pressed={lang === l}
                onClick={() => update({ ...prefs, language: l })}
              >
                {l === "uk" ? "UA" : "EN"}
              </button>
            ))}
          </div>
        </header>
        {storageError && (
          <div className="storage-warning" role="status">
            <TriangleAlert size={16} />
            {tr("storageError", lang)}
          </div>
        )}
        {notice && (
          <div className="toast" role="status">
            <CheckCircle2 size={18} />
            {notice}
            <button
              className="icon-button"
              onClick={() => setNotice("")}
              aria-label={tr("close", lang)}
            >
              <X size={16} />
            </button>
          </div>
        )}
        <main id="main" className={`page page-${route.page}`} tabIndex={-1}>
          {route.page === "library" ? (
            <Library {...common} initialCategory={route.category} />
          ) : route.page === "lesson" ? (
            <LessonPage {...common} id={route.id} />
          ) : route.page === "projects" ? (
            <Projects {...common} />
          ) : route.page === "project" ? (
            <ProjectPage
              {...common}
              id={route.id}
              onMeasurement={onMeasurement}
            />
          ) : route.page === "materials" ? (
            <MaterialsCatalog {...common} />
          ) : route.page === "material" ? (
            <MaterialDetail {...common} id={route.id} />
          ) : route.page === "lathe-anatomy" ? (
            <LatheAnatomy {...common} />
          ) : route.page === "paths" ? (
            <Paths {...common} />
          ) : route.page === "path" ? (
            <PathPage {...common} id={route.id} />
          ) : route.page === "tooling" ? (
            <Tooling {...common} />
          ) : route.page === "workshop" ? (
            <Workshop lang={lang} />
          ) : route.page === "saved" ? (
            <Saved {...common} />
          ) : route.page === "settings" ? (
            <Settings
              {...common}
              onClear={() => {
                setPrefs({ ...defaults });
                setStorageError(false);
                setNotice(tr("cleared", lang));
              }}
              onError={() => setNotice(tr("clearError", lang))}
            />
          ) : (
            <Empty
              lang={lang}
              title={txt("Сторінку не знайдено", "Page not found", lang)}
              text={txt(
                "Поверніться до бази знань.",
                "Return to the knowledge library.",
                lang,
              )}
            />
          )}
        </main>
        <footer className="footer">
          <span>Workbench · Defencore</span>
          <span>
            {tr("local", lang)}
            <HardDrive size={13} />
          </span>
        </footer>
      </div>
      {search && <SearchDialog {...common} onClose={() => setSearch(false)} />}
    </>
  );
}
function SectionHeading({
  title,
  description,
  link,
  linkText,
}: {
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && (
        <a className="text-link" href={link}>
          {linkText}
          <ArrowRight size={16} />
        </a>
      )}
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
function lessonSearchText(l: Lesson) {
  return normalize(
    [
      l.title.uk,
      l.title.en,
      l.summary.uk,
      l.summary.en,
      ...l.tags.flatMap((t) => [t.uk, t.en]),
      ...l.steps.flatMap((s) => [s.title.uk, s.title.en, s.body.uk, s.body.en]),
      ...l.hazards.flatMap((t) => [t.uk, t.en]),
      ...l.takeaways.flatMap((t) => [t.uk, t.en]),
    ].join(" "),
  );
}
function Library(common: Common & { initialCategory: string }) {
  const { lang, prefs, initialCategory } = common;
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const [cat, setCat] = useState(initialCategory),
    [query, setQuery] = useState(params.get("q") || ""),
    [level, setLevel] = useState(params.get("level") || ""),
    [sort, setSort] = useState(params.get("sort") || "recommended");
  useEffect(() => {
    setCat(initialCategory);
    const p = new URLSearchParams(location.hash.split("?")[1] || "");
    setQuery(p.get("q") || "");
    setLevel(p.get("level") || "");
    setSort(p.get("sort") || "recommended");
  }, [initialCategory]);
  const filter = (q: string, l: string, s: string) => {
    setQuery(q);
    setLevel(l);
    setSort(s);
    const p = new URLSearchParams();
    if (cat) p.set("category", cat);
    if (q) p.set("q", q);
    if (l) p.set("level", l);
    if (s !== "recommended") p.set("sort", s);
    history.replaceState(
      null,
      "",
      `${location.pathname}${location.search}#/library${p.size ? "?" + p : ""}`,
    );
  };
  const filtered = lessons
    .filter(
      (l) =>
        (!cat || l.category === cat) &&
        (!level || l.level === level) &&
        lessonSearchText(l).includes(normalize(query)),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title[lang].localeCompare(b.title[lang])
        : sort === "time"
          ? a.minutes - b.minutes
          : Number(prefs.saved.includes(b.id)) -
            Number(prefs.saved.includes(a.id)),
    );
  const grouped = !cat && !query && !level && sort === "recommended";
  const validCat = categories.find((c) => c.id === cat);
  return (
    <>
      <PageHeading
        title={
          validCat
            ? validCat.name[lang]
            : txt("Довідник майстерні", "Workshop handbook", lang)
        }
        description={
          validCat
            ? validCat.description[lang]
            : txt(
                "Покрокові інструкції з металообробки. Виберіть тему зліва або знайдіть потрібну операцію.",
                "Step-by-step machining guides. Choose a topic on the left or find the operation you need.",
                lang,
              )
        }
      />
      {!cat && !query && (
        <div className="start-note">
          <ShieldCheck size={23} />
          <div>
            <strong>
              {txt(
                "Перший раз у майстерні? Почніть із безпеки.",
                "New to the workshop? Start with safety.",
                lang,
              )}
            </strong>
            <p>
              {txt(
                "Захист, ризики обертання, ізоляція енергії та прибирання стружки.",
                "Protection, rotation hazards, energy isolation and safe chip removal.",
                lang,
              )}
            </p>
          </div>
          <a href="#/path/first-day">
            {txt("Перші кроки", "First steps", lang)}
            <ArrowRight size={17} />
          </a>
        </div>
      )}
      {(cat === "materials" || (!cat && !query)) && (
        <div className="start-note">
          <Box size={23} />
          <div>
            <strong>
              {txt(
                "Як обробляти різні матеріали",
                "Machining different materials",
                lang,
              )}
            </strong>
            <p>
              {txt(
                "9 довідників: інструмент, стружка, поверхня, помилки й практичні вправи з 3D-показом обробки.",
                "9 guides: tools, chips, surfaces, defects and practical exercises with a 3D cutting walkthrough.",
                lang,
              )}
            </p>
          </div>
          <a href="#/materials">
            {txt("Вибрати матеріал", "Choose material", lang)}
            <ArrowRight size={17} />
          </a>
        </div>
      )}
      {cat === "lathe" && (
        <div className="start-note">
          <BookOpen size={23} />
          <div>
            <strong>
              {txt(
                "Будова верстата й правильні назви",
                "Lathe construction & correct names",
                lang,
              )}
            </strong>
            <p>
              {txt(
                "18 вузлів, паспортний перелік органів керування ТВ‑6М і окрема схема різцетримача.",
                "18 assemblies, the TV‑6M manual control list and a separate toolpost drawing.",
                lang,
              )}
            </p>
          </div>
          <a href="#/lathe-anatomy">
            {txt("Відкрити схеми", "Open the diagrams", lang)}
            <ArrowRight size={17} />
          </a>
        </div>
      )}
      <div className="library-toolbar">
        <label className="inline-search">
          <Search size={19} />
          <input
            value={query}
            onChange={(e) => filter(e.target.value, level, sort)}
            placeholder={txt(
              "Знайти операцію, інструмент або матеріал…",
              "Find an operation, tool or material…",
              lang,
            )}
            aria-label={tr("searchShort", lang)}
          />
          {query && (
            <button
              className="icon-button"
              onClick={() => filter("", level, sort)}
              aria-label={tr("close", lang)}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <div className="select-wrap mobile-category">
          <select
            aria-label={tr("allCategories", lang)}
            value={cat}
            onChange={(e) => {
              location.hash = `/library${e.target.value ? "?category=" + e.target.value : ""}`;
            }}
          >
            <option value="">{tr("allCategories", lang)}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[lang]}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
        <div className="select-wrap">
          <select
            aria-label={tr("allLevels", lang)}
            value={level}
            onChange={(e) => filter(query, e.target.value, sort)}
          >
            <option value="">{tr("allLevels", lang)}</option>
            {Object.entries(levels).map(([k, v]) => (
              <option key={k} value={k}>
                {v[lang]}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
        <div className="select-wrap">
          <select
            aria-label={txt("Порядок сортування", "Sort order", lang)}
            value={sort}
            onChange={(e) => filter(query, level, e.target.value)}
          >
            <option value="recommended">{tr("sortRecommended", lang)}</option>
            <option value="title">{tr("sortTitle", lang)}</option>
            <option value="time">{tr("sortTime", lang)}</option>
          </select>
          <ChevronDown size={14} />
        </div>
      </div>
      <div className="results-row">
        <span>{countLabel(filtered.length, "guide", lang)}</span>
        {(cat || query || level) && (
          <button
            onClick={() => {
              setCat("");
              filter("", "", "recommended");
              location.hash = "/library";
            }}
          >
            {tr("resetFilters", lang)}
            <X size={14} />
          </button>
        )}
      </div>
      {filtered.length ? (
        grouped ? (
          <div className="guide-groups">
            {categories.map((c) => {
              const Icon = icons[c.id];
              return (
                <section className="guide-group" key={c.id}>
                  <header>
                    <Icon size={20} />
                    <h2>{c.name[lang]}</h2>
                    <span>
                      {filtered.filter((l) => l.category === c.id).length}
                    </span>
                    <a
                      href={`#/library?category=${c.id}`}
                      aria-label={c.name[lang]}
                    >
                      <ArrowUpRight size={18} />
                    </a>
                  </header>
                  <div className="lesson-list">
                    {filtered
                      .filter((l) => l.category === c.id)
                      .map((l) => (
                        <LessonRow key={l.id} lesson={l} {...common} />
                      ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="lesson-list">
            {filtered.map((l) => (
              <LessonRow key={l.id} lesson={l} {...common} />
            ))}
          </div>
        )
      ) : (
        <Empty
          lang={lang}
          title={tr("noResults", lang)}
          text={tr("noResultsSub", lang)}
          link={false}
        />
      )}
    </>
  );
}
function Empty({
  lang,
  title,
  text,
  link = true,
}: {
  lang: Lang;
  title: string;
  text: string;
  link?: boolean;
}) {
  return (
    <div className="empty-state">
      <FolderOpen size={35} strokeWidth={1.3} />
      <h2>{title}</h2>
      <p>{text}</p>
      {link && (
        <a className="button button-primary" href="#/library">
          {tr("browse", lang)}
          <ArrowRight size={16} />
        </a>
      )}
    </div>
  );
}
function Hazards({ hazards, lang }: { hazards: Text[]; lang: Lang }) {
  return (
    <div className="hazards">
      <h2>
        <TriangleAlert size={20} />
        {tr("risks", lang)}
      </h2>
      <ul>
        {hazards.map((h, i) => (
          <li key={i}>{h[lang]}</li>
        ))}
      </ul>
    </div>
  );
}
function SourceList({ ids, lang }: { ids: string[]; lang: Lang }) {
  const refs = ids
    .map((id) => sources.find((s) => s.id === id))
    .filter((s) => !!s);
  return (
    refs.length > 0 && (
      <div className="sources">
        <h2>{tr("sources", lang)}</h2>
        {refs.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText size={16} />
            <span>
              {source.title}
              <small>{source.publisher}</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
        ))}
      </div>
    )
  );
}
function LessonPage(common: Common & { id?: string }) {
  const { id, lang, prefs, toggle } = common;
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson)
    return (
      <Empty
        lang={lang}
        title={txt("Інструкцію не знайдено", "Guide not found", lang)}
        text={txt(
          "Виберіть інший матеріал у базі знань.",
          "Choose another guide from the library.",
          lang,
        )}
      />
    );
  const pathId = new URLSearchParams(location.hash.split("?")[1] || "").get(
    "path",
  );
  const learningPath = paths.find((p) => p.id === pathId);
  const sequence = learningPath
    ? learningPath.ids
        .map((id) => lessons.find((l) => l.id === id))
        .filter((l): l is Lesson => !!l)
    : lessons.filter((l) => l.category === lesson.category);
  const position = sequence.findIndex((l) => l.id === lesson.id);
  const previous = sequence[position - 1],
    next = sequence[position + 1];
  const guideLink = (id: string) =>
    `#/lesson/${id}${learningPath ? "?path=" + learningPath.id : ""}`;
  const cat = category(lesson.category),
    Icon = icons[cat.id];
  const count = lesson.steps.filter((_, i) =>
    prefs.checks.includes(`${id}:${i}`),
  ).length;
  return (
    <>
      <a
        className="back-link"
        href={
          learningPath
            ? `#/path/${learningPath.id}`
            : `#/library?category=${cat.id}`
        }
      >
        <ArrowLeft size={16} />
        {learningPath ? tr(learningPath.title, lang) : cat.name[lang]}
      </a>
      <div className="article-layout">
        <article className="article">
          <div className="article-heading">
            <span className={`category-label ${cat.color}`}>
              <Icon size={14} />
              {cat.name[lang]}
            </span>
            <h1>{lesson.title[lang]}</h1>
            <p>{lesson.summary[lang]}</p>
            <div className="article-meta">
              <span>
                <Clock3 size={15} />
                {lesson.minutes} {tr("minutes", lang)}
              </span>
              <span>{levels[lesson.level][lang]}</span>
              <span>
                {lesson.steps.length} {tr("steps", lang)}
              </span>
            </div>
            <div className="article-save">
              <SaveButton id={lesson.id} {...common} large />
            </div>
          </div>
          <div className="instructor-note">
            <ShieldCheck size={21} />
            <div>
              <strong>{tr("supervision", lang)}</strong>
              <p>{tr("supervisionBody", lang)}</p>
            </div>
          </div>
          {lesson.prerequisites.length > 0 && (
            <section className="prerequisites">
              <h2>{tr("prerequisites", lang)}</h2>
              {lesson.prerequisites.map((id) => {
                const l = lessons.find((l) => l.id === id);
                return (
                  l && (
                    <a key={id} href={`#/lesson/${id}`}>
                      {prefs.completed.includes(id) ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <FileText size={16} />
                      )}
                      {l.title[lang]}
                      <ArrowUpRight size={15} />
                    </a>
                  )
                );
              })}
            </section>
          )}
          <Hazards hazards={lesson.hazards} lang={lang} />
          {lesson.id === "lathe-setup" && (
            <div className="start-note">
              <BookOpen size={23} />
              <div>
                <strong>
                  {txt(
                    "Спочатку розберіться з вузлами та керуванням",
                    "Identify the assemblies and controls first",
                    lang,
                  )}
                </strong>
                <p>
                  {txt(
                    "Різцетримач, корпус різця, полозки, фартух, маховики та рукоятки — з назвами й призначенням за документацією.",
                    "Toolpost, tool body, slides, apron, handwheels and handles, named and explained from documentation.",
                    lang,
                  )}
                </p>
              </div>
              <a href="#/lathe-anatomy">
                {txt("Будова верстата", "Lathe anatomy", lang)}
                <ArrowRight size={17} />
              </a>
            </div>
          )}
          <LessonDiagram lessonId={lesson.id} lang={lang} />
          <section className="steps-list">
            <div className="steps-heading">
              <span className="eyebrow">
                {txt("КРОК ЗА КРОКОМ", "STEP BY STEP", lang)}
              </span>
              <p>{tr("checklist", lang)}</p>
            </div>
            {lesson.steps.map((step, i) => (
              <section
                className="instruction-step"
                id={`step-${i}`}
                key={`${id}:${i}`}
              >
                <div className="step-number">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h2>{step.title[lang]}</h2>
                  <p>{step.body[lang]}</p>
                  <LessonDiagram lessonId={lesson.id} lang={lang} step={i} />
                  {
                    <label
                      className={`check-row ${prefs.checks.includes(`${id}:${i}`) ? "checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={prefs.checks.includes(`${id}:${i}`)}
                        onChange={() => toggle("checks", `${id}:${i}`)}
                      />
                      <span>
                        {step.check?.[lang] ||
                          txt(
                            "Я опрацював цей крок",
                            "I have worked through this step",
                            lang,
                          )}
                      </span>
                    </label>
                  }
                </div>
              </section>
            ))}
          </section>
          <div className="takeaways">
            <h2>
              <Sparkles size={19} />
              {tr("keyPoints", lang)}
            </h2>
            <ul>
              {lesson.takeaways.map((t, i) => (
                <li key={i}>
                  <Check size={16} />
                  <span>{t[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
          {lesson.model && <ModelDisclosure kind={lesson.model} lang={lang} />}
          <Quiz key={`${id}:${lang}`} lesson={lesson} lang={lang} />
          <SourceList ids={lesson.sources} lang={lang} />
          <div className="completion-box">
            <button
              className={`button ${prefs.completed.includes(lesson.id) ? "button-secondary" : "button-primary"}`}
              onClick={() => toggle("completed", lesson.id)}
            >
              <CheckCircle2 size={18} />
              {tr(
                prefs.completed.includes(lesson.id)
                  ? "markIncomplete"
                  : "markComplete",
                lang,
              )}
            </button>
            <p>{tr("completionNote", lang)}</p>
          </div>
          <nav
            className="article-next"
            aria-label={txt(
              "Перехід між інструкціями",
              "Guide navigation",
              lang,
            )}
          >
            {previous ? (
              <a href={guideLink(previous.id)}>
                <span>
                  <ArrowLeft size={15} />
                  {txt("Попередня", "Previous", lang)}
                </span>
                <strong>{previous.title[lang]}</strong>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a href={guideLink(next.id)}>
                <span>
                  {txt("Наступна", "Next", lang)}
                  <ArrowRight size={15} />
                </span>
                <strong>{next.title[lang]}</strong>
              </a>
            ) : learningPath ? (
              <a href={`#/path/${learningPath.id}`}>
                <span>
                  {tr("paths", lang)}
                  <ArrowRight size={15} />
                </span>
                <strong>{tr(learningPath.title, lang)}</strong>
              </a>
            ) : (
              <a href={`#/library?category=${cat.id}`}>
                <span>
                  {tr("library", lang)}
                  <ArrowRight size={15} />
                </span>
                <strong>{cat.name[lang]}</strong>
              </a>
            )}
          </nav>
        </article>
        <aside className="article-toc">
          <div className="toc-card">
            <span className="eyebrow">{tr("plan", lang)}</span>
            <ol>
              {lesson.steps.map((s, i) => (
                <li key={i}>
                  <a
                    href={`#step-${i}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`step-${i}`)?.scrollIntoView({
                        behavior: matchMedia("(prefers-reduced-motion: reduce)")
                          .matches
                          ? "instant"
                          : "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <span>
                      {prefs.checks.includes(`${id}:${i}`) ? (
                        <Check size={12} />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    {s.title[lang]}
                  </a>
                </li>
              ))}
            </ol>
            <div className="toc-progress">
              <span>
                {count} / {lesson.steps.length}
              </span>
              <div className="progress-track">
                <i
                  style={{ width: `${(count / lesson.steps.length) * 100}%` }}
                />
              </div>
            </div>
            <SaveButton id={lesson.id} {...common} large />
          </div>
          <div className="toc-tip">
            <ShieldCheck size={20} />
            <p>{tr("footerSafety", lang)}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
function Quiz({ lesson, lang }: { lesson: Lesson; lang: Lang }) {
  const [answer, setAnswer] = useState<number | null>(null),
    [submitted, setSubmitted] = useState(false);
  return (
    <section className="quiz">
      <span className="eyebrow">{tr("quiz", lang)}</span>
      <h2>{lesson.quiz.question[lang]}</h2>
      <fieldset aria-label={lesson.quiz.question[lang]}>
        {lesson.quiz.options.map((o, i) => (
          <label
            key={i}
            className={`${answer === i ? "selected" : ""} ${submitted && answer === i ? (answer === lesson.quiz.correct ? "correct" : "incorrect") : ""}`}
          >
            <input
              type="radio"
              name={`quiz-${lesson.id}`}
              value={i}
              checked={answer === i}
              onChange={() => {
                setAnswer(i);
                setSubmitted(false);
              }}
            />
            <span>{o[lang]}</span>
          </label>
        ))}
      </fieldset>
      <button
        className="button button-primary"
        disabled={answer === null}
        onClick={() => setSubmitted(true)}
      >
        {tr("checkAnswer", lang)}
        <ArrowRight size={16} />
      </button>
      {submitted && (
        <div
          className={`quiz-feedback ${answer === lesson.quiz.correct ? "correct" : "incorrect"}`}
          role="status"
        >
          <strong>
            {tr(answer === lesson.quiz.correct ? "correct" : "incorrect", lang)}
          </strong>
          <p>{lesson.quiz.explanation[lang]}</p>
        </div>
      )}
    </section>
  );
}
function orderedPrerequisites(ids: string[]): string[] {
  const result: string[] = [],
    seen = new Set<string>();
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) return;
    lesson.prerequisites.forEach(visit);
    result.push(id);
  };
  ids.forEach(visit);
  return result;
}
const paths = [
  {
    id: "first-day",
    title: "path1",
    sub: "path1sub",
    icon: ShieldCheck,
    ids: [
      "safety-first",
      "entanglement",
      "energy-isolation",
      "chips-fire",
      "daily-inspection",
      "technical-drawing",
      "hand-tools",
      "marking-out",
      "caliper",
    ],
  },
  {
    id: "first-lathe",
    title: "path2",
    sub: "path2sub",
    icon: Target,
    ids: [
      "safety-first",
      "entanglement",
      "workholding-basics",
      "lathe-setup",
      "lathe-centering",
      "lathe-facing",
      "lathe-turning",
      "lathe-drilling",
      "micrometer",
    ],
  },
  {
    id: "milling-cnc",
    title: "path3",
    sub: "path3sub",
    icon: Layers3,
    ids: [
      "safety-first",
      "workholding-basics",
      "mill-setup",
      "mill-datums",
      "mill-facing",
      "mill-pockets",
      "cnc-workflow",
      "cnc-offsets",
      "cnc-prove-out",
    ],
  },
  {
    id: "reverse",
    title: "path4",
    sub: "path4sub",
    icon: Compass,
    ids: [
      "safety-first",
      "technical-drawing",
      "caliper",
      "micrometer",
      "dial-indicator",
      "inspection-plan",
      "reverse-survey",
      "reverse-cad",
      "reverse-validation",
    ],
  },
  {
    id: "machine-ready",
    title: "path5",
    sub: "path5sub",
    icon: Settings2,
    ids: [
      "machine-assessment",
      "daily-inspection",
      "cleaning-lubrication",
      "machine-installation",
      "slideways-gibs",
      "backlash-leadscrews",
      "spindle-condition",
      "machine-alignment",
      "geometry-verification",
      "tool-setting-lathe",
      "tool-setting-mill",
    ],
  },
  {
    id: "choose-tools",
    title: "path6",
    sub: "path6sub",
    icon: Wrench,
    ids: [
      "tooling-requirements",
      "tooling-materials",
      "turning-tools",
      "milling-cutters",
      "drilling-tools",
      "threading-reaming",
      "tool-condition",
    ],
  },
].map((path) => ({ ...path, ids: orderedPrerequisites(path.ids) }));
function Paths(common: Common) {
  const { lang, prefs } = common;
  return (
    <>
      <PageHeading
        eyebrow={txt("Трохи щодня", "A LITTLE EVERY DAY", lang)}
        title={tr("paths", lang)}
        description={tr("pathIntro", lang)}
      />
      <div className="paths-grid">
        {paths.map((p, i) => {
          const done = p.ids.filter((id) =>
              prefs.completed.includes(id),
            ).length,
            Icon = p.icon;
          return (
            <a className="path-card" href={`#/path/${p.id}`} key={p.id}>
              <div className="path-top">
                <span className="path-number">0{i + 1}</span>
                <Icon size={32} strokeWidth={1.2} />
              </div>
              <h2>{tr(p.title, lang)}</h2>
              <p>{tr(p.sub, lang)}</p>
              <div className="path-stats">
                <span>{countLabel(p.ids.length, "guide", lang)}</span>
                <span>
                  {p.ids.reduce(
                    (n, id) =>
                      n + (lessons.find((l) => l.id === id)?.minutes || 0),
                    0,
                  )}{" "}
                  {tr("minutes", lang)}
                </span>
              </div>
              <div className="progress-track">
                <i style={{ width: `${(done / p.ids.length) * 100}%` }} />
              </div>
              <div className="path-bottom">
                <span>
                  {done}/{p.ids.length} {tr("completed", lang).toLowerCase()}
                </span>
                <ArrowRight size={19} />
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
function PathPage(common: Common & { id?: string }) {
  const { lang, prefs } = common,
    p = paths.find((p) => p.id === common.id);
  if (!p)
    return (
      <Empty
        lang={lang}
        title={txt("Маршрут не знайдено", "Path not found", lang)}
        text=""
      />
    );
  const items = p.ids
    .map((id) => lessons.find((l) => l.id === id))
    .filter((l): l is Lesson => !!l);
  return (
    <>
      <a className="back-link" href="#/paths">
        <ArrowLeft size={16} />
        {tr("paths", lang)}
      </a>
      <PageHeading
        eyebrow={tr("learningRoute", lang)}
        title={tr(p.title, lang)}
        description={tr(p.sub, lang)}
      />
      <div className="route-note">
        <ShieldCheck size={19} />
        {tr("routeNote", lang)}
      </div>
      <div className="path-lessons">
        {items.map((l, i) => (
          <a
            className={`path-lesson ${prefs.completed.includes(l.id) ? "done" : ""}`}
            href={`#/lesson/${l.id}?path=${p.id}`}
            key={l.id}
          >
            <span className="path-lesson-number">
              {prefs.completed.includes(l.id) ? (
                <Check size={21} />
              ) : (
                String(i + 1).padStart(2, "0")
              )}
            </span>
            <span>
              <small>{category(l.category).name[lang]}</small>
              <h2>{l.title[lang]}</h2>
              <p>{l.summary[lang]}</p>
            </span>
            <span className="path-lesson-time">
              <Clock3 size={14} />
              {l.minutes} {tr("minutes", lang)}
            </span>
            <ArrowRight size={20} />
          </a>
        ))}
      </div>
    </>
  );
}
function Projects(common: Common) {
  return <ProjectsCatalog {...common} />;
}
function ProjectPage(
  common: Common & {
    id?: string;
    onMeasurement: (key: string, value: string) => void;
  },
) {
  const project = projects.find((p) => p.id === common.id);
  if (!project)
    return (
      <Empty
        lang={common.lang}
        title={txt("Проєкт не знайдено", "Project not found", common.lang)}
        text=""
      />
    );
  return (
    <ProjectDetail project={project} {...common}>
      <section className="dashboard-section">
        <SectionHeading title={tr("related", common.lang)} />
        <div className="lesson-list">
          {project.lessons
            .map((id) => lessons.find((l) => l.id === id))
            .filter((l): l is Lesson => !!l)
            .map((l) => (
              <LessonRow key={l.id} lesson={l} {...common} />
            ))}
        </div>
      </section>
    </ProjectDetail>
  );
}
function Tooling(common: Common) {
  const { lang } = common;
  return (
    <>
      <PageHeading
        title={tr("tooling", lang)}
        description={txt(
          "Від вимог деталі до різальної крайки та сумісної державки.",
          "From part requirements to a cutting edge and compatible holder.",
          lang,
        )}
      />
      <ToolSelector lang={lang} />
      <section className="dashboard-section">
        <SectionHeading
          title={txt(
            "Інструкції з вибору та встановлення",
            "Selection and setting guides",
            lang,
          )}
        />
        <div className="lesson-list">
          {lessons
            .filter(
              (l) =>
                l.category === "tooling" ||
                l.id === "tool-setting-lathe" ||
                l.id === "tool-setting-mill",
            )
            .map((l) => (
              <LessonRow key={l.id} lesson={l} {...common} />
            ))}
        </div>
      </section>
    </>
  );
}
function Workshop({ lang }: { lang: Lang }) {
  const [kind, setKind] = useState<ModelKind>("lathe");
  const models: [ModelKind, string][] = [
    ["lathe", "modelLathe"],
    ["shaft", "modelShaft"],
    ["flange", "modelFlange"],
    ["bracket", "modelBracket"],
    ["vice", "modelVice"],
  ];
  return (
    <>
      <PageHeading
        eyebrow={txt("Роздивіться ближче", "LOOK CLOSER", lang)}
        title={tr("workshopIntro", lang)}
        description={tr("workshopIntroSub", lang)}
      />
      <div className="start-note">
        <Layers3 size={23} />
        <div>
          <strong>
            {txt(
              "Обробка заготовки крок за кроком",
              "Watch stock become a part",
              lang,
            )}
          </strong>
          <p>
            {txt(
              "Точіння, фрезерування й свердління: інструмент у різі, зняття матеріалу та різниця поверхонь.",
              "Turning, milling and drilling: tool engagement, material removal and surface comparisons.",
              lang,
            )}
          </p>
        </div>
        <a href="#/materials">
          {txt("Відкрити 3D-процес", "Open the 3D process", lang)}
          <ArrowRight size={17} />
        </a>
      </div>
      <div
        className="model-tabs"
        role="group"
        aria-label={tr("workshop", lang)}
      >
        {models.map(([k, key]) => (
          <button
            key={k}
            className={k === kind ? "active" : ""}
            aria-pressed={kind === k}
            onClick={() => setKind(k)}
          >
            <Box size={17} />
            {tr(key, lang)}
          </button>
        ))}
      </div>
      {kind === "lathe" && (
        <div className="start-note">
          <BookOpen size={23} />
          <div>
            <strong>
              {txt(
                "Схеми будови й органів керування ТВ‑6М",
                "TV‑6M anatomy & control reference",
                lang,
              )}
            </strong>
            <p>
              {txt(
                "Нижче — спрощений огляд вузлів. Точні назви та паспортна нумерація доступні в окремому довіднику.",
                "The model below is a simplified assembly overview. Verified names and manual numbering are in the dedicated reference.",
                lang,
              )}
            </p>
          </div>
          <a href="#/lathe-anatomy">
            {txt("Відкрити довідник", "Open reference", lang)}
            <ArrowRight size={17} />
          </a>
        </div>
      )}
      <div className="workshop-stage">
        <Model kind={kind} lang={lang} />
      </div>
      <div className="workshop-notes">
        <div>
          <Ruler size={22} />
          <h2>
            {txt("Дивіться на геометрію", "Understand the geometry", lang)}
          </h2>
          <p>
            {txt(
              "Обертайте модель, порівнюйте поверхні й знаходьте бази для вимірювань. Моделі схематичні, без виробничого масштабу.",
              "Rotate the model, compare surfaces and identify measurement datums. Models are schematic, without a production scale.",
              lang,
            )}
          </p>
        </div>
        <div>
          <ShieldCheck size={22} />
          <h2>
            {txt("Перевіряйте в реальності", "Verify in the real world", lang)}
          </h2>
          <p>
            {txt(
              "Відображення в 3D не оцінює міцність кріплення, допустимі оберти чи безпечний виліт заготовки.",
              "The 3D display does not assess clamping strength, permitted speed or safe workpiece overhang.",
              lang,
            )}
          </p>
        </div>
        <div>
          <BookOpen size={22} />
          <h2>
            {txt("Поєднуйте з інструкціями", "Connect it to the guides", lang)}
          </h2>
          <p>
            {txt(
              "Почніть із розділу про кріплення, а потім відкрийте навчальний проєкт із відповідною деталлю.",
              "Start with the workholding guides, then open a practice project with the corresponding part.",
              lang,
            )}
          </p>
          <a className="text-link" href="#/library?category=fundamentals">
            {tr("library", lang)}
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </>
  );
}
function Saved(common: Common) {
  const { lang, prefs } = common;
  const savedLessons = lessons.filter((l) => prefs.saved.includes(l.id)),
    savedProjects = projects.filter((p) => prefs.saved.includes(p.id)),
    savedMaterials = materialGuides.filter((m) =>
      prefs.saved.includes(materialBookmark(m)),
    ),
    savedAnatomy = prefs.saved.includes("reference-lathe-anatomy");
  return (
    <>
      <PageHeading
        eyebrow={txt("Завжди під рукою", "KEEP IT HANDY", lang)}
        title={tr("savedIntro", lang)}
        description={tr("savedIntroSub", lang)}
      />
      {savedLessons.length === 0 &&
      savedProjects.length === 0 &&
      savedMaterials.length === 0 &&
      !savedAnatomy ? (
        <Empty
          lang={lang}
          title={tr("savedEmpty", lang)}
          text={tr("savedEmptySub", lang)}
        />
      ) : (
        <>
          {savedAnatomy && (
            <section className="dashboard-section">
              <SectionHeading
                title={txt("Довідники будови", "Construction references", lang)}
              />
              <article className="guide-row">
                <a className="guide-info" href="#/lathe-anatomy">
                  <h3>
                    {txt(
                      "Токарний верстат: вузли й органи керування",
                      "Lathe: assemblies & controls",
                      lang,
                    )}
                  </h3>
                  <p>
                    {txt(
                      "Будова ТВ‑6М і чотирипозиційного різцетримача; назви маховиків, рукояток та механізмів.",
                      "TV‑6M assemblies, four-way toolpost, handwheels, handles and mechanisms.",
                      lang,
                    )}
                  </p>
                </a>
                <SaveButton id="reference-lathe-anatomy" {...common} />
              </article>
            </section>
          )}
          {savedLessons.length > 0 && (
            <section className="dashboard-section">
              <SectionHeading
                title={`${tr("library", lang)} · ${savedLessons.length}`}
              />
              <div className="lesson-list">
                {savedLessons.map((l) => (
                  <LessonRow key={l.id} lesson={l} {...common} />
                ))}
              </div>
            </section>
          )}
          {savedMaterials.length > 0 && (
            <section className="dashboard-section">
              <SectionHeading
                title={`${tr("materials", lang)} · ${savedMaterials.length}`}
              />
              <div className="material-grid">
                {savedMaterials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    {...common}
                  />
                ))}
              </div>
            </section>
          )}
          {savedProjects.length > 0 && (
            <section className="dashboard-section">
              <SectionHeading
                title={`${tr("projects", lang)} · ${savedProjects.length}`}
              />
              <div className="project-grid">
                {savedProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} {...common} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
function Settings({
  lang,
  prefs,
  onClear,
  onError,
}: Common & { onClear: () => void; onError: () => void }) {
  const offlineStatus = useOfflineStatus();
  const [confirm, setConfirm] = useState(false),
    [clearing, setClearing] = useState(false);
  const clear = async () => {
    setClearing(true);
    try {
      await clearServiceData();
      markOfflineCleared();
      onClear();
      setConfirm(false);
    } catch {
      onError();
    } finally {
      setClearing(false);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow={txt("Дані лише у браузері", "BROWSER LOCAL, BY DESIGN", lang)}
        title={tr("settingsIntro", lang)}
        description={tr("settingsSub", lang)}
      />
      <div className="settings-panel">
        <h2>
          <HardDrive size={21} />
          {tr("storage", lang)}
        </h2>
        <div className="storage-stats">
          {[
            ["bookmarks", prefs.saved.length],
            ["completed", prefs.completed.length],
            ["checked", prefs.checks.length],
            ["measurements", Object.keys(prefs.measurements).length],
          ].map(([key, n]) => (
            <div key={key}>
              <strong>{n}</strong>
              <span>{tr(String(key), lang)}</span>
            </div>
          ))}
        </div>
        <div className="settings-offline">
          <Box size={23} />
          <div>
            <h3>{tr("offline", lang)}</h3>
            <span className={`offline-badge ${offlineStatus}`} role="status">
              {offlineStatus === "cleared"
                ? txt(
                    "Кеш очищено. Оновіть сторінку для повторного завантаження.",
                    "Cache cleared. Reload to prepare offline access again.",
                    lang,
                  )
                : offlineStatus === "ready"
                  ? txt("Офлайн-пакет готовий", "Offline package ready", lang)
                  : offlineStatus === "preparing"
                    ? txt(
                        "Завантаження офлайн-пакета…",
                        "Preparing offline package…",
                        lang,
                      )
                    : offlineStatus === "preview"
                      ? txt(
                          "У локальному перегляді без кешування",
                          "Caching disabled in development preview",
                          lang,
                        )
                      : txt(
                          "Браузер не надав офлайн-сховище",
                          "Offline storage is unavailable in this browser",
                          lang,
                        )}
            </span>
            <p>{tr("offlineBody", lang)}</p>
          </div>
        </div>
        <div className="clear-data">
          <div>
            <h3>{tr("clear", lang)}</h3>
            <p>{tr("clearSub", lang)}</p>
          </div>
          <button
            className="button button-danger"
            onClick={() => setConfirm(true)}
          >
            <Trash2 size={17} />
            {txt("Очистити", "Clear data", lang)}
          </button>
        </div>
      </div>
      {confirm && (
        <Modal
          label={tr("confirmTitle", lang)}
          onClose={() => !clearing && setConfirm(false)}
          className="confirm-dialog"
        >
          <div className="confirm-icon">
            <Trash2 size={25} />
          </div>
          <h2>{tr("confirmTitle", lang)}</h2>
          <p>{tr("confirmBody", lang)}</p>
          <div className="confirm-actions">
            <button
              className="button button-secondary"
              disabled={clearing}
              onClick={() => setConfirm(false)}
            >
              {tr("cancel", lang)}
            </button>
            <button
              className="button button-danger"
              disabled={clearing}
              onClick={clear}
            >
              {clearing ? "…" : tr("confirmClear", lang)}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
function Modal({
  children,
  onClose,
  className = "",
  label,
}: {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
function SearchDialog({
  lang,
  prefs,
  onClose,
}: Common & { onClose: () => void }) {
  const [q, setQ] = useState("");
  const matches = lessons
    .filter((l) => lessonSearchText(l).includes(normalize(q)))
    .sort(
      (a, b) =>
        Number(prefs.saved.includes(b.id)) - Number(prefs.saved.includes(a.id)),
    )
    .slice(0, 8);
  const matchingProjects = q
    ? projects
        .filter((p) =>
          normalize(
            `${p.title.uk} ${p.title.en} ${p.summary.uk} ${p.summary.en}`,
          ).includes(normalize(q)),
        )
        .slice(0, 3)
    : [];
  const matchingMaterials = q
    ? materialGuides
        .filter((m) =>
          normalize(
            `${m.name.uk} ${m.name.en} ${m.grades.uk} ${m.grades.en} ${m.summary.uk} ${m.summary.en}`,
          ).includes(normalize(q)),
        )
        .slice(0, 4)
    : [];
  const matchingAnatomy =
    Boolean(q.trim()) &&
    normalize(
      [
        "токарний верстат будова органи керування ТВ6М ТВ-6М ТВ‑6М різцетримач корпус різця маточна гайка lathe anatomy controls toolpost",
        ...[...latheParts, ...latheControls, ...toolpostParts].flatMap(
          (entry) => [
            entry.name.uk,
            entry.name.en,
            entry.description.uk,
            entry.description.en,
          ],
        ),
      ].join(" "),
    ).includes(normalize(q));
  return (
    <Modal
      label={tr("searchShort", lang)}
      className="search-dialog"
      onClose={onClose}
    >
      <div className="search-dialog-input">
        <Search size={22} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tr("search", lang)}
          aria-label={tr("searchShort", lang)}
        />
        <button
          className="icon-button"
          aria-label={tr("close", lang)}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="search-dialog-results">
        <span className="eyebrow">
          {q ? tr("searchResults", lang) : tr("recommended", lang)}
        </span>
        {matches.map((l) => (
          <a href={`#/lesson/${l.id}`} key={l.id} onClick={onClose}>
            <span
              className={`search-result-icon ${category(l.category).color}`}
            >
              <BookOpen size={18} />
            </span>
            <span>
              <strong>{l.title[lang]}</strong>
              <small>
                {category(l.category).name[lang]} · {l.minutes}{" "}
                {tr("minutes", lang)}
              </small>
            </span>
            <ArrowUpRight size={18} />
          </a>
        ))}
        {matchingProjects.map((p) => (
          <a href={`#/project/${p.id}`} key={p.id} onClick={onClose}>
            <span className="search-result-icon sage">
              <Layers3 size={18} />
            </span>
            <span>
              <strong>{p.title[lang]}</strong>
              <small>{tr("projects", lang)}</small>
            </span>
            <ArrowUpRight size={18} />
          </a>
        ))}
        {matchingAnatomy && (
          <a href="#/lathe-anatomy" onClick={onClose}>
            <span className="search-result-icon blue">
              <Settings2 size={18} />
            </span>
            <span>
              <strong>
                {txt(
                  "Токарний верстат: вузли й органи керування",
                  "Lathe: assemblies & controls",
                  lang,
                )}
              </strong>
              <small>
                {txt(
                  "Схеми й паспортні назви ТВ‑6М",
                  "TV‑6M diagrams & manual names",
                  lang,
                )}
              </small>
            </span>
            <ArrowUpRight size={18} />
          </a>
        )}
        {matchingMaterials.map((m) => (
          <a href={`#/material/${m.id}`} key={m.id} onClick={onClose}>
            <span className="search-result-icon blue">
              <Box size={18} />
            </span>
            <span>
              <strong>{m.name[lang]}</strong>
              <small>
                {m.grades[lang]} · {tr("materials", lang)}
              </small>
            </span>
            <ArrowUpRight size={18} />
          </a>
        ))}
        {!matches.length &&
          !matchingProjects.length &&
          !matchingMaterials.length &&
          !matchingAnatomy && (
            <p className="search-no-results">{tr("noResults", lang)}</p>
          )}
      </div>
      <div className="search-dialog-footer">
        <span>{tr("typeSearch", lang)}</span>
        <kbd>ESC</kbd>
      </div>
    </Modal>
  );
}
export default App;
