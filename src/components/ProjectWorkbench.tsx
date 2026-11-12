import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronDown,
  FileDown,
  FileText,
  Layers3,
  Printer,
  Ruler,
  Search,
  ShieldCheck,
  TriangleAlert,
  Wrench,
  X,
} from "lucide-react";
import type {
  CuttingCalculation,
  Lang,
  ManufacturingSetup,
  Project,
  ProjectFixture,
} from "../data/types";
import type { Preferences } from "../storage";
import { projects, sources } from "../data/content";
import { levels, tr } from "../data/ui";
import {
  calculateCutting,
  classifyMeasurementRange,
  families,
  featureLimits,
  formatNumber,
  measurementKey,
  operationCount,
  operationKey,
  countTerm,
} from "../manufacturing";
import ProjectDrawing, { GeometryDrawing } from "./ProjectDrawing";
import SetupDiagram from "./SetupDiagram";
import SaveButton from "./SaveButton";
import "./ProjectWorkbench.css";
const ModelViewer = lazy(() => import("./ModelViewer"));
type Toggle = (field: "saved" | "completed" | "checks", id: string) => void;
type Common = { lang: Lang; prefs: Preferences; toggle: Toggle };
type CadManifest = {
  limitations: Record<Lang, string>;
  models: {
    projectId: string;
    fixtureId: string | null;
    role: string;
    url: string;
  }[];
};
const text = (lang: Lang, uk: string, en: string) => (lang === "uk" ? uk : en);
const ids = (project: Project, id: string) => `manufacture-${project.id}-${id}`;
function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}
function csvCell(value: unknown) {
  const raw = String(value ?? "");
  return (
    '"' +
    (/^\s*[=+\-@]/.test(raw) ? "'" + raw : raw).replaceAll('"', '""') +
    '"'
  );
}
function downloadCsv(name: string, rows: unknown[][]) {
  const blob = new Blob(
    ["\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n")],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportOperations(project: Project, lang: Lang, prefs: Preferences) {
  downloadCsv(`${project.id}-${project.revision}-operations.csv`, [
    [
      text(lang, "Код проєкту", "Project ID"),
      text(lang, "Деталь", "Part"),
      text(lang, "Ревізія", "Revision"),
      ...(lang === "uk"
        ? [
            "Встановлення",
            "Операція",
            "Назва",
            "Верстат",
            "Бази",
            "Кріплення",
            "Інструмент",
            "Дія",
            "Припуск",
            "Контроль",
            "Умова зупинки",
            "Ознаки",
            "Передача",
            "Фактичний установ: інструмент, режими, кріплення",
            "Операцію позначено виконаною",
          ]
        : [
            "Setup",
            "Operation",
            "Title",
            "Machine",
            "Datums",
            "Workholding",
            "Tool",
            "Instruction",
            "Allowance",
            "Inspection",
            "Stop condition",
            "Features",
            "Transfer",
            "Actual setup: tool, cutting conditions, workholding",
            "Operation marked complete",
          ]),
    ],
    ...project.setups.flatMap((setup) =>
      setup.operations.map((op) => [
        project.id,
        project.title[lang],
        project.revision,
        setup.id,
        op.id,
        op.title[lang],
        setup.machine[lang],
        setup.datums[lang],
        setup.workholding[lang],
        op.tool[lang],
        op.instruction[lang],
        op.allowance[lang],
        op.inspection[lang],
        op.stop[lang],
        op.featureIds.join("; "),
        setup.transfer[lang],
        prefs.measurements[
          `${project.id}:${project.revision}:setup:${setup.id}:actual`
        ] ?? "",
        prefs.checks.includes(operationKey(project, setup.id, op.id))
          ? text(lang, "Так", "Yes")
          : text(lang, "Ні", "No"),
      ]),
    ),
  ]);
}
function resultLabel(
  lang: Lang,
  result: ReturnType<typeof classifyMeasurementRange>,
) {
  const labels = {
    empty: "",
    invalid: text(lang, "Потрібні числа", "Enter numbers"),
    within: text(
      lang,
      "Записані покази в межах",
      "Recorded readings within limits",
    ),
    below: text(lang, "Є показ нижче межі", "Reading below lower limit"),
    above: text(lang, "Є показ вище межі", "Reading above upper limit"),
    manual: text(
      lang,
      "Ручне рішення за методом контролю",
      "Manual decision under the inspection method",
    ),
    partial: text(
      lang,
      "Внесіть мін. і макс. покази",
      "Record minimum and maximum",
    ),
    reversed: text(
      lang,
      "Мінімум більший за максимум",
      "Minimum exceeds maximum",
    ),
  };
  return labels[result];
}
function exportInspection(project: Project, lang: Lang, prefs: Preferences) {
  downloadCsv(`${project.id}-${project.revision}-inspection.csv`, [
    [
      text(lang, "Код проєкту", "Project ID"),
      text(lang, "Деталь", "Part"),
      text(lang, "Ревізія", "Revision"),
      ...(lang === "uk"
        ? [
            "Ознака",
            "Назва",
            "Вимога",
            "Нижня межа",
            "Верхня межа",
            "Одиниці",
            "База",
            "Метод",
            "Прилад",
            "Мінімальний показ",
            "Максимальний показ",
            "Точки та примітки",
            "Числове порівняння",
          ]
        : [
            "Feature",
            "Name",
            "Specification",
            "Lower limit",
            "Upper limit",
            "Units",
            "Datum",
            "Method",
            "Instrument",
            "Minimum reading",
            "Maximum reading",
            "Locations and notes",
            "Numeric comparison",
          ]),
    ],
    ...project.features.map((feature) => [
      project.id,
      project.title[lang],
      project.revision,
      feature.id,
      feature.name[lang],
      feature.spec,
      feature.lower ?? "",
      feature.upper ?? "",
      feature.unit,
      feature.datum,
      feature.method[lang],
      feature.instrument[lang],
      prefs.measurements[measurementKey(project, feature.id)] ?? "",
      prefs.measurements[measurementKey(project, feature.id) + ":max"] ?? "",
      prefs.measurements[measurementKey(project, feature.id) + ":note"] ?? "",
      resultLabel(
        lang,
        classifyMeasurementRange(
          prefs.measurements[measurementKey(project, feature.id)] ?? "",
          prefs.measurements[measurementKey(project, feature.id) + ":max"] ??
            "",
          feature,
        ),
      ),
    ]),
  ]);
}
export function ProjectCard({
  project,
  lang,
  prefs,
  toggle,
}: Common & { project: Project }) {
  const count = operationCount(project),
    made = project.fixtures.filter((f) => f.made).length;
  return (
    <article className="project-card manufacturing-card">
      <div className="project-image">
        <a href={`#/project/${project.id}`} aria-label={project.title[lang]}>
          <ProjectDrawing project={project} lang={lang} compact />
        </a>
        <SaveButton id={project.id} prefs={prefs} toggle={toggle} lang={lang} />
      </div>
      <a href={`#/project/${project.id}`} className="project-card-body">
        <span className="eyebrow">
          {families[project.family][lang]} · {levels[project.level][lang]} ·{" "}
          {project.material[lang]}
        </span>
        <h3>
          {project.title[lang]}
          <ArrowUpRight size={19} />
        </h3>
        <p>{project.summary[lang]}</p>
        <div className="manufacturing-card-stock">
          <span>{text(lang, "Заготовка", "Stock")}</span>
          <strong>{project.stock.size}</strong>
        </div>
        <div className="project-meta">
          <span>
            <Layers3 size={14} />
            {countTerm(project.setups.length, lang, "setup")} ·{" "}
            {countTerm(count, lang, "operation")}
          </span>
          <span>
            <Wrench size={14} />
            {text(lang, "Виготовити: ", "Make: ")}
            {countTerm(made, lang, "fixture")}
          </span>
        </div>
      </a>
    </article>
  );
}
export function ProjectsCatalog(common: Common) {
  const { lang, prefs } = common;
  const current = new URLSearchParams(location.hash.split("?")[1] || "");
  const [query, setQuery] = useState(current.get("q") || ""),
    [family, setFamily] = useState(current.get("family") || ""),
    [level, setLevel] = useState(current.get("level") || ""),
    [madeOnly, setMadeOnly] = useState(current.get("fixtures") === "made");
  const update = (q: string, f: string, l: string, m: boolean) => {
    setQuery(q);
    setFamily(f);
    setLevel(l);
    setMadeOnly(m);
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (f) p.set("family", f);
    if (l) p.set("level", l);
    if (m) p.set("fixtures", "made");
    history.replaceState(
      null,
      "",
      `${location.pathname}${location.search}#/projects${p.size ? "?" + p : ""}`,
    );
  };
  const normalized = query.toLocaleLowerCase().trim();
  const filtered = projects
    .filter(
      (p) =>
        (!family || p.family === family) &&
        (!level || p.level === level) &&
        (!madeOnly || p.fixtures.some((f) => f.made)) &&
        [
          p.title.uk,
          p.title.en,
          p.summary.uk,
          p.summary.en,
          p.material.uk,
          p.material.en,
          p.stock.size,
          ...p.features.map((f) => f.spec),
          ...p.fixtures.flatMap((f) => [f.name.uk, f.name.en]),
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalized),
    )
    .sort(
      (a, b) =>
        Number(prefs.saved.includes(b.id)) -
          Number(prefs.saved.includes(a.id)) ||
        ["beginner", "intermediate", "advanced"].indexOf(a.level) -
          ["beginner", "intermediate", "advanced"].indexOf(b.level),
    );
  return (
    <>
      <div className="page-heading">
        <h1>
          {text(
            lang,
            "Деталі й технологічні маршрути",
            "Parts & manufacturing routes",
          )}
        </h1>
        <p>
          {text(
            lang,
            "Від заготовки та оснащення до перестановок і протоколу вимірювань. Кожний проєкт містить визначену геометрію, допуски й поопераційний контроль.",
            "From stock and fixtures to remounting and the inspection record. Each project defines geometry, tolerance limits and in-process verification.",
          )}
        </p>
      </div>
      <div className="manufacturing-catalog-note">
        <FileText size={21} />
        <p>
          {text(
            lang,
            "Це розраховані навчальні маршрути з явними припущеннями. Фізична апробація не заявлена; відповідність конкретному верстату, оснащенню та інструменту перевіряють до роботи.",
            "These are engineered learning routes with explicit assumptions. Physical prove-out is not claimed; verify compatibility with the actual machine, fixtures and tools before work.",
          )}
        </p>
      </div>
      <div className="library-toolbar manufacturing-filters">
        <label className="inline-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => update(e.target.value, family, level, madeOnly)}
            placeholder={text(
              lang,
              "Деталь, матеріал, M6, оснащення…",
              "Part, material, M6, fixture…",
            )}
            aria-label={text(lang, "Пошук проєктів", "Search projects")}
          />
          {query && (
            <button
              className="icon-button"
              onClick={() => update("", family, level, madeOnly)}
              aria-label={tr("close", lang)}
            >
              <X size={15} />
            </button>
          )}
        </label>
        <div className="select-wrap">
          <select
            value={family}
            aria-label={text(lang, "Тип обробки", "Process family")}
            onChange={(e) => update(query, e.target.value, level, madeOnly)}
          >
            <option value="">
              {text(lang, "Усі процеси", "All processes")}
            </option>
            {Object.entries(families).map(([id, title]) => (
              <option key={id} value={id}>
                {title[lang]}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
        <div className="select-wrap">
          <select
            value={level}
            aria-label={tr("allLevels", lang)}
            onChange={(e) => update(query, family, e.target.value, madeOnly)}
          >
            <option value="">{tr("allLevels", lang)}</option>
            {Object.entries(levels).map(([id, title]) => (
              <option key={id} value={id}>
                {title[lang]}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
      </div>
      <div className="manufacturing-catalog-summary">
        <span>
          {filtered.length} / {projects.length}{" "}
          {text(lang, "маршрутів", "routes")}
        </span>
        <label>
          <input
            type="checkbox"
            checked={madeOnly}
            onChange={(e) => update(query, family, level, e.target.checked)}
          />
          {text(
            lang,
            "З виготовленням оснащення",
            "Includes fixture fabrication",
          )}
        </label>
        {(query || family || level || madeOnly) && (
          <button onClick={() => update("", "", "", false)}>
            {tr("resetFilters", lang)}
            <X size={13} />
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className="project-grid all-projects">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} {...common} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={31} />
          <h2>{tr("noResults", lang)}</h2>
          <p>{tr("noResultsSub", lang)}</p>
        </div>
      )}
    </>
  );
}
function DrawingPanel({
  children,
  title,
  lang,
  filename,
  step,
  cadNote,
}: {
  children: ReactNode;
  title: string;
  lang: Lang;
  filename: string;
  step?: string;
  cadNote?: string;
}) {
  const host = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (expanded) dialog.current?.showModal();
    return () => dialog.current?.close();
  }, [expanded]);
  const download = () => {
    const svg = host.current?.querySelector("svg");
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(
      new Blob([source], { type: "image/svg+xml;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ".svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="manufacturing-drawing-panel" ref={host}>
      <div className="manufacturing-drawing-actions">
        <button onClick={() => setExpanded(true)}>
          <Box size={14} />
          {text(lang, "На весь екран", "Expand drawing")}
        </button>
        <button onClick={download}>
          <FileDown size={14} />
          {text(lang, "Завантажити SVG", "Download SVG")}
        </button>
        {step && (
          <a href={step} download>
            <FileDown size={14} />
            {text(lang, "Модель STEP", "STEP model")}
          </a>
        )}
      </div>
      {children}
      {step && <p className="manufacturing-cad-note">{cadNote}</p>}
      {expanded && (
        <dialog
          className="manufacturing-drawing-dialog"
          ref={dialog}
          aria-label={title}
          onCancel={(e) => {
            e.preventDefault();
            setExpanded(false);
          }}
          onClick={(e) => {
            if (e.target === dialog.current) setExpanded(false);
          }}
        >
          <header>
            <strong>{title}</strong>
            <button
              className="icon-button"
              onClick={() => setExpanded(false)}
              aria-label={tr("close", lang)}
              autoFocus
            >
              <X size={20} />
            </button>
          </header>
          {children}
        </dialog>
      )}
    </div>
  );
}
function ProjectModel({ project, lang }: { project: Project; lang: Lang }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="model-disclosure"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>
        <Box size={19} />
        {text(lang, "Готова деталь у 3D", "Finished part in 3D")}
        <ChevronDown size={17} />
      </summary>
      {open && (
        <Suspense
          fallback={
            <div className="model-loading">
              {text(lang, "Завантаження моделі…", "Loading model…")}
            </div>
          }
        >
          <ModelViewer part={project.part} title={project.title} lang={lang} />
        </Suspense>
      )}
    </details>
  );
}
function BulletList({
  items,
  lang,
  ordered = false,
}: {
  items: { uk: string; en: string }[];
  lang: Lang;
  ordered?: boolean;
}) {
  return ordered ? (
    <ol className="manufacturing-prose-list">
      {items.map((item, i) => (
        <li key={i}>{item[lang]}</li>
      ))}
    </ol>
  ) : (
    <ul className="manufacturing-prose-list">
      {items.map((item, i) => (
        <li key={i}>{item[lang]}</li>
      ))}
    </ul>
  );
}
function Fixture({
  fixture,
  project,
  lang,
  cad,
}: {
  fixture: ProjectFixture;
  project: Project;
  lang: Lang;
  cad: CadManifest | null;
}) {
  return (
    <section className="manufacturing-fixture" id={ids(project, fixture.id)}>
      <header>
        <span
          className={`manufacturing-type-tag ${fixture.made ? "made" : ""}`}
        >
          <Wrench size={14} />
          {fixture.made
            ? text(lang, "Виготовити", "Fabricate")
            : text(lang, "Підготувати", "Prepare")}
        </span>
        <span className="manufacturing-code">{fixture.id}</span>
        <h3>{fixture.name[lang]}</h3>
      </header>
      <p className="manufacturing-fixture-purpose">{fixture.purpose[lang]}</p>
      <dl className="manufacturing-facts">
        <div>
          <dt>{text(lang, "Матеріал / основа", "Material / base")}</dt>
          <dd>{fixture.stock[lang]}</dd>
        </div>
        <div>
          <dt>{text(lang, "Розміри й інтерфейс", "Dimensions & interface")}</dt>
          <dd>{fixture.dimensions[lang]}</dd>
        </div>
      </dl>
      {fixture.geometry && (
        <DrawingPanel
          title={fixture.name[lang]}
          lang={lang}
          filename={`${project.id}-${project.revision}-${fixture.id}`}
          step={
            cad?.models.find(
              (m) => m.projectId === project.id && m.fixtureId === fixture.id,
            )?.url
          }
          cadNote={cad?.limitations[lang]}
        >
          <GeometryDrawing
            geometry={fixture.geometry}
            lang={lang}
            title={fixture.name}
          />
        </DrawingPanel>
      )}
      <div className="manufacturing-fixture-columns">
        <div>
          <h4>
            {fixture.made
              ? text(lang, "Виготовлення пристрою", "Fixture fabrication")
              : text(lang, "Комплектація", "Components")}
          </h4>
          {fixture.manufacture.length > 0 ? (
            <BulletList items={fixture.manufacture} lang={lang} ordered />
          ) : (
            <BulletList items={fixture.hardware} lang={lang} />
          )}
        </div>
        <div>
          <h4>
            {text(lang, "Підготовка перед затиском", "Prepare before clamping")}
          </h4>
          <BulletList items={fixture.preparation} lang={lang} />
          {fixture.made && fixture.hardware.length > 0 && (
            <>
              <h4>
                {text(
                  lang,
                  "Кріплення й комплектуючі",
                  "Hardware & components",
                )}
              </h4>
              <BulletList items={fixture.hardware} lang={lang} />
            </>
          )}
        </div>
      </div>
      <div className="manufacturing-acceptance">
        <h4>
          <Ruler size={17} />
          {text(lang, "Приймання оснащення", "Fixture acceptance")}
        </h4>
        <BulletList items={fixture.acceptance} lang={lang} />
      </div>
    </section>
  );
}
function RequirementTable({
  project,
  lang,
  prefs,
  onMeasurement,
}: {
  project: Project;
  lang: Lang;
  prefs: Preferences;
  onMeasurement: (key: string, value: string) => void;
}) {
  return (
    <>
      <div className="manufacturing-table-hint">
        {text(
          lang,
          "Внесіть мінімум і максимум серії вимірювань; для одного виміру — однакове значення в обидва поля. Записи залишаються в цьому браузері.",
          "Record the minimum and maximum of repeated measurements; for a single reading enter the same value in both fields. Records stay in this browser.",
        )}
      </div>
      <div
        className="manufacturing-table-scroll"
        tabIndex={0}
        role="region"
        aria-label={text(
          lang,
          "Вимоги та результати вимірювань",
          "Requirements and measurement results",
        )}
      >
        <table className="manufacturing-requirements">
          <thead>
            <tr>
              <th>ID / {text(lang, "Ознака", "Feature")}</th>
              <th>{text(lang, "Вимога", "Specification")}</th>
              <th>{text(lang, "Допустимі межі", "Acceptance limits")}</th>
              <th>
                {text(
                  lang,
                  "База / метод / прилад",
                  "Datum / method / instrument",
                )}
              </th>
              <th>{text(lang, "Ваші вимірювання", "Your measurements")}</th>
            </tr>
          </thead>
          <tbody>
            {project.features.map((feature) => {
              const key = measurementKey(project, feature.id),
                minimum = prefs.measurements[key] ?? "",
                maximum = prefs.measurements[key + ":max"] ?? "",
                note = prefs.measurements[key + ":note"] ?? "",
                manual = feature.unit === "thread" || feature.unit === "visual",
                result = classifyMeasurementRange(minimum, maximum, feature);
              return (
                <tr key={feature.id} id={ids(project, feature.id)}>
                  <td>
                    <span className="manufacturing-code">{feature.id}</span>
                    <strong>{feature.name[lang]}</strong>
                  </td>
                  <td>
                    <code>{feature.spec}</code>
                    {feature.nominal !== undefined && (
                      <small>
                        {text(lang, "Базовий розмір", "Basic size")}:{" "}
                        {formatNumber(feature.nominal, lang)}
                      </small>
                    )}
                  </td>
                  <td>{featureLimits(feature, lang)}</td>
                  <td>
                    <span className="manufacturing-datum-label">
                      {feature.datum}
                    </span>
                    <p>{feature.method[lang]}</p>
                    <small>{feature.instrument[lang]}</small>
                  </td>
                  <td>
                    <div className={`manufacturing-result result-${result}`}>
                      <div className="manufacturing-result-range">
                        <label>
                          <span>
                            {manual
                              ? text(
                                  lang,
                                  "Запис контролю",
                                  "Inspection record",
                                )
                              : text(lang, "Мін.", "Min.")}
                          </span>
                          <input
                            aria-label={`${feature.id}: ${manual ? text(lang, "Запис контролю", "Inspection record") : text(lang, "Мінімум", "Minimum")}`}
                            inputMode={manual ? "text" : "decimal"}
                            maxLength={manual ? 500 : 120}
                            value={minimum}
                            placeholder="—"
                            onChange={(e) => onMeasurement(key, e.target.value)}
                            className={`result-${result}`}
                          />
                        </label>
                        {!manual && (
                          <label>
                            <span>{text(lang, "Макс.", "Max.")}</span>
                            <input
                              aria-label={`${feature.id}: ${text(lang, "Максимум", "Maximum")}`}
                              inputMode="decimal"
                              maxLength={120}
                              value={maximum}
                              placeholder="—"
                              onChange={(e) =>
                                onMeasurement(key + ":max", e.target.value)
                              }
                              className={`result-${result}`}
                            />
                          </label>
                        )}
                      </div>
                      {resultLabel(lang, result) && (
                        <small className={`result-${result}`} role="status">
                          {resultLabel(lang, result)}
                        </small>
                      )}
                      <textarea
                        aria-label={`${feature.id}: ${text(lang, "Точки вимірювання та примітки", "Measurement locations and notes")}`}
                        value={note}
                        onChange={(e) =>
                          onMeasurement(key + ":note", e.target.value)
                        }
                        maxLength={500}
                        rows={2}
                        placeholder={text(
                          lang,
                          "Точки, прилад, примітки",
                          "Locations, instrument, notes",
                        )}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="manufacturing-record-note">
        {text(
          lang,
          "Числова позначка перевіряє лише записані покази. Повний висновок потребує всіх точок вимірювання, геометричного контролю, придатного приладу та виконання плану приймання.",
          "The numeric label checks only the recorded readings. Full acceptance requires every measurement location, geometric checks, suitable instruments and the complete inspection plan.",
        )}
      </p>
    </>
  );
}
function CuttingExample({
  example,
  lang,
}: {
  example: CuttingCalculation;
  lang: Lang;
}) {
  const result = calculateCutting(example);
  return (
    <div className="manufacturing-calculation">
      <h3>{example.tool[lang]}</h3>
      <p>{example.assumptions[lang]}</p>
      <div className="manufacturing-formulas">
        <code>
          n = 1000 × {formatNumber(example.vc, lang)} / (π ×{" "}
          {formatNumber(example.diameter, lang)}) ={" "}
          {formatNumber(result.theoreticalRpm, lang, 1)}{" "}
          {text(lang, "об/хв", "rpm")}
        </code>
        <code>
          n ≤ {example.rpmLimit} → n = {result.rpm} {text(lang, "об/хв", "rpm")}
        </code>
        <code>
          {example.feedPerRev !== undefined
            ? `vᶠ = ${result.rpm} × ${formatNumber(example.feedPerRev, lang)}`
            : `vᶠ = ${result.rpm} × ${example.teeth} × ${formatNumber(example.feedPerTooth!, lang)}`}{" "}
          = {formatNumber(result.feed, lang, 2)} {text(lang, "мм/хв", "mm/min")}
        </code>
      </div>
      <p className="manufacturing-confirmation">{example.confirmation[lang]}</p>
    </div>
  );
}
function Setup({
  project,
  setup,
  lang,
  prefs,
  toggle,
  open,
  onToggle,
  onMeasurement,
}: Common & {
  project: Project;
  setup: ManufacturingSetup;
  open: boolean;
  onToggle: () => void;
  onMeasurement: (key: string, value: string) => void;
}) {
  const completed = setup.operations.filter((op) =>
    prefs.checks.includes(operationKey(project, setup.id, op.id)),
  ).length;
  return (
    <section
      className={`manufacturing-setup ${open ? "expanded" : ""}`}
      id={ids(project, setup.id)}
    >
      <button
        className="manufacturing-setup-heading"
        aria-expanded={open}
        aria-controls={ids(project, `${setup.id}-body`)}
        onClick={onToggle}
      >
        <span className="manufacturing-setup-number">{setup.id}</span>
        <span>
          <strong>{setup.title[lang]}</strong>
          <small>
            {setup.machine[lang]} · {completed}/{setup.operations.length}{" "}
            {text(lang, "операцій позначено", "operations checked")}
          </small>
        </span>
        <ChevronDown size={19} />
      </button>
      {open && (
        <div
          id={ids(project, `${setup.id}-body`)}
          className="manufacturing-setup-body"
        >
          <p className="manufacturing-setup-purpose">{setup.purpose[lang]}</p>
          <SetupDiagram project={project} setup={setup} lang={lang} />
          <dl className="manufacturing-facts">
            <div>
              <dt>{text(lang, "Орієнтація", "Orientation")}</dt>
              <dd>{setup.orientation[lang]}</dd>
            </div>
            <div>
              <dt>{text(lang, "Бази та прив’язка", "Datums & referencing")}</dt>
              <dd>{setup.datums[lang]}</dd>
            </div>
            <div>
              <dt>{text(lang, "Опори й затиск", "Support & clamping")}</dt>
              <dd>{setup.workholding[lang]}</dd>
            </div>
            <div>
              <dt>{text(lang, "Оснащення", "Fixtures")}</dt>
              <dd className="manufacturing-fixture-links">
                {setup.fixtureIds.map((id) => {
                  const fixture = project.fixtures.find((f) => f.id === id)!;
                  return (
                    <button key={id} onClick={() => jump(ids(project, id))}>
                      {id} · {fixture.name[lang]}
                      <ArrowUpRight size={14} />
                    </button>
                  );
                })}
              </dd>
            </div>
          </dl>
          <div className="manufacturing-setup-prep">
            <h3>
              {text(
                lang,
                "Підготовка цього встановлення",
                "Prepare this setup",
              )}
            </h3>
            <BulletList items={setup.preparation} lang={lang} ordered />
          </div>
          <label className="manufacturing-actual-settings">
            <strong>
              {text(
                lang,
                "Фактичні умови встановлення",
                "Actual setup conditions",
              )}
            </strong>
            <span>
              {text(
                lang,
                "Модель верстата, код інструмента, підтверджені n/Vf, корекції, затиск, дата й виконавець. Цей запис не підміняє перевірку налаштування.",
                "Machine model, tool code, verified n/Vf, offsets, clamping, date and operator. This record does not replace setup verification.",
              )}
            </span>
            <textarea
              value={
                prefs.measurements[
                  `${project.id}:${project.revision}:setup:${setup.id}:actual`
                ] ?? ""
              }
              onChange={(e) =>
                onMeasurement(
                  `${project.id}:${project.revision}:setup:${setup.id}:actual`,
                  e.target.value,
                )
              }
              maxLength={1000}
              rows={3}
              aria-label={`${setup.id}: ${text(lang, "Фактичні умови", "Actual conditions")}`}
              placeholder={text(
                lang,
                "Запишіть фактичні умови й посилання на карту налаштування…",
                "Record actual conditions and the setup-sheet reference…",
              )}
            />
          </label>
          <div className="manufacturing-operations">
            {setup.operations.map((op) => {
              const key = operationKey(project, setup.id, op.id);
              return (
                <section className="manufacturing-operation" key={op.id}>
                  <header>
                    <span className="manufacturing-code">{op.id}</span>
                    <h3>{op.title[lang]}</h3>
                  </header>
                  <p className="manufacturing-instruction">
                    {op.instruction[lang]}
                  </p>
                  <dl>
                    <div>
                      <dt>
                        <Wrench size={14} />
                        {text(lang, "Інструмент", "Tool")}
                      </dt>
                      <dd>{op.tool[lang]}</dd>
                    </div>
                    <div>
                      <dt>
                        <Layers3 size={14} />
                        {text(lang, "Припуск / розмір", "Allowance / size")}
                      </dt>
                      <dd>{op.allowance[lang]}</dd>
                    </div>
                    <div>
                      <dt>
                        <Ruler size={14} />
                        {text(lang, "Проміжний контроль", "In-process check")}
                      </dt>
                      <dd>{op.inspection[lang]}</dd>
                    </div>
                    <div className="manufacturing-operation-stop">
                      <dt>
                        <TriangleAlert size={14} />
                        {text(lang, "Зупинити, якщо", "Stop if")}
                      </dt>
                      <dd>{op.stop[lang]}</dd>
                    </div>
                  </dl>
                  <div className="manufacturing-operation-features">
                    <span>{text(lang, "Ознаки", "Features")}:</span>
                    {op.featureIds.map((id) => (
                      <button key={id} onClick={() => jump(ids(project, id))}>
                        {id}
                      </button>
                    ))}
                  </div>
                  <label
                    className={`check-row ${prefs.checks.includes(key) ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={prefs.checks.includes(key)}
                      onChange={() => toggle("checks", key)}
                    />
                    <span>
                      {text(
                        lang,
                        "Операцію виконано, проміжний контроль проведено",
                        "Operation completed and in-process inspection performed",
                      )}
                    </span>
                  </label>
                </section>
              );
            })}
          </div>
          <div className="manufacturing-setup-exit">
            <h3>
              <CheckCircle2 size={19} />
              {text(lang, "Контроль перед зняттям", "Inspect before removal")}
            </h3>
            <BulletList items={setup.inspection} lang={lang} />
            <h4>{text(lang, "Безпечне зняття", "Safe release")}</h4>
            <p>{setup.release[lang]}</p>
            <h4>
              {text(
                lang,
                "Передача в наступне встановлення",
                "Transfer to the next setup",
              )}
            </h4>
            <p>{setup.transfer[lang]}</p>
          </div>
        </div>
      )}
    </section>
  );
}
export function ProjectDetail({
  project,
  lang,
  prefs,
  toggle,
  onMeasurement,
  children,
}: Common & {
  project: Project;
  onMeasurement: (key: string, value: string) => void;
  children?: ReactNode;
}) {
  const [cadManifest, setCadManifest] = useState<CadManifest | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/models/index.json")
      .then((response) => {
        if (!response.ok) throw new Error("CAD manifest unavailable");
        return response.json() as Promise<CadManifest>;
      })
      .then((manifest) => {
        if (active) setCadManifest(manifest);
      })
      .catch(() => {
        if (active) setCadManifest(null);
      });
    return () => {
      active = false;
    };
  }, []);
  const [openSetups, setOpenSetups] = useState<string[]>(
    project.setups.length ? [project.setups[0].id] : [],
  );
  useEffect(
    () => setOpenSetups(project.setups.length ? [project.setups[0].id] : []),
    [project.id],
  );
  const done = project.setups.reduce(
      (n, setup) =>
        n +
        setup.operations.filter((op) =>
          prefs.checks.includes(operationKey(project, setup.id, op.id)),
        ).length,
      0,
    ),
    total = operationCount(project);
  const showSetup = (id: string) => {
    setOpenSetups((prev) => (prev.includes(id) ? prev : [...prev, id]));
    requestAnimationFrame(() => jump(ids(project, id)));
  };
  const print = () => {
    flushSync(() => setOpenSetups(project.setups.map((s) => s.id)));
    window.print();
  };
  const navigation = [
    ["drawing", text(lang, "Креслення й вимоги", "Drawing & requirements")],
    [
      "preparation",
      text(lang, "Заготовка й підготовка", "Stock & preparation"),
    ],
    ["fixtures", text(lang, "Виготовлення оснащення", "Fixture preparation")],
    ["route", text(lang, "Технологічний маршрут", "Manufacturing route")],
    ["inspection", text(lang, "Фінальний контроль", "Final inspection")],
    ["cutting", text(lang, "Розрахунок режимів", "Cutting calculation")],
    ["sources", text(lang, "Першоджерела", "Primary sources")],
  ];
  return (
    <>
      <a className="back-link" href="#/projects">
        <ArrowLeft size={16} />
        {tr("projects", lang)}
      </a>
      <div className="project-detail-heading">
        <div className="page-heading">
          <span className="eyebrow">
            {families[project.family][lang]} · {levels[project.level][lang]} ·{" "}
            {project.revision}
          </span>
          <h1>{project.title[lang]}</h1>
          <p>{project.summary[lang]}</p>
        </div>
        <SaveButton
          id={project.id}
          lang={lang}
          prefs={prefs}
          toggle={toggle}
          large
        />
      </div>
      <div className="manufacturing-toolbar">
        <div className="manufacturing-progress">
          <span>
            {done}/{total}{" "}
            {text(lang, "операцій позначено", "operations checked")}
          </span>
          <div className="progress-track">
            <i style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </div>
        <button
          className="button button-secondary"
          onClick={() => exportOperations(project, lang, prefs)}
        >
          <FileDown size={16} />
          {text(lang, "Карта операцій", "Operation sheet")}
        </button>
        <button
          className="button button-secondary"
          onClick={() => exportInspection(project, lang, prefs)}
        >
          <FileDown size={16} />
          {text(lang, "Протокол контролю", "Inspection sheet")}
        </button>
        <button className="button button-secondary" onClick={print}>
          <Printer size={16} />
          {text(lang, "Друк", "Print")}
        </button>
      </div>
      <div className="manufacturing-scope">
        <ShieldCheck size={20} />
        <div>
          <p>{project.purpose[lang]}</p>
          <small>
            {text(
              lang,
              "Інженерний навчальний приклад. Розміри є цільовими; фізичне виготовлення та приймання цього маршруту не заявлені.",
              "Engineered learning example. Dimensions are targets; physical manufacture and acceptance of this route are not claimed.",
            )}
          </small>
        </div>
      </div>
      <div className="manufacturing-layout">
        <div className="manufacturing-body">
          <section
            id={ids(project, "drawing")}
            className="manufacturing-section"
          >
            <h2>
              {text(
                lang,
                "Креслення, бази й вимоги",
                "Drawing, datums & requirements",
              )}
            </h2>
            <DrawingPanel
              title={project.title[lang]}
              lang={lang}
              filename={`${project.id}-${project.revision}-drawing`}
              step={
                cadManifest?.models.find(
                  (m) => m.projectId === project.id && m.role === "part",
                )?.url
              }
              cadNote={cadManifest?.limitations[lang]}
            >
              <ProjectDrawing project={project} lang={lang} />
            </DrawingPanel>
            <div className="manufacturing-datums">
              {project.datums.map((datum) => (
                <div key={datum.id}>
                  <b>{datum.id}</b>
                  <span>{datum.description[lang]}</span>
                </div>
              ))}
            </div>
            <RequirementTable
              project={project}
              lang={lang}
              prefs={prefs}
              onMeasurement={onMeasurement}
            />
            <ProjectModel project={project} lang={lang} />
          </section>
          <section
            className="manufacturing-section"
            id={ids(project, "preparation")}
          >
            <h2>
              {text(
                lang,
                "Заготовка та умови виконання",
                "Stock & manufacturing conditions",
              )}
            </h2>
            <dl className="manufacturing-facts">
              <div>
                <dt>{tr("material", lang)}</dt>
                <dd>{project.material[lang]}</dd>
              </div>
              <div>
                <dt>
                  {text(lang, "Форма та розмір заготовки", "Stock form & size")}
                </dt>
                <dd>
                  {project.stock.form[lang]} ·{" "}
                  <strong>{project.stock.size}</strong>
                </dd>
              </div>
              <div>
                <dt>{tr("duration", lang)}</dt>
                <dd>{project.duration[lang]}</dd>
              </div>
              <div>
                <dt>{text(lang, "Кількість", "Quantity")}</dt>
                <dd>
                  {project.quantity ?? 1} {text(lang, "шт.", "part(s)")}
                </dd>
              </div>
            </dl>
            <h3>
              {text(lang, "Підготовка матеріалу", "Prepare the material")}
            </h3>
            <BulletList items={project.stock.preparation} lang={lang} ordered />
            <a className="text-link" href="#/materials">
              {text(
                lang,
                "Як вибрати інструмент під матеріал і оцінити результат",
                "Choose tools for the material and assess the result",
              )}
              <ArrowRight size={16} />
            </a>
            <h3>{text(lang, "Потрібне обладнання", "Required equipment")}</h3>
            <BulletList items={project.equipment} lang={lang} />
            <div className="hazards">
              <h2>
                <TriangleAlert size={20} />
                {tr("risks", lang)}
              </h2>
              <BulletList items={project.hazards} lang={lang} />
            </div>
          </section>
          <section
            className="manufacturing-section"
            id={ids(project, "fixtures")}
          >
            <h2>
              {text(
                lang,
                "Оснащення: виготовити й перевірити",
                "Fixtures: prepare and verify",
              )}
            </h2>
            <p className="manufacturing-section-intro">
              {text(
                lang,
                "Власноруч виготовлені пристрої відокремлено від покупного оснащення. У кожному встановленні наведено посилання на потрібний пристрій.",
                "Fabricated fixtures are distinguished from purchased tooling. Every setup links to the fixtures it uses.",
              )}
            </p>
            {project.fixtures.map((fixture) => (
              <Fixture
                key={fixture.id}
                fixture={fixture}
                project={project}
                lang={lang}
                cad={cadManifest}
              />
            ))}
          </section>
          <section className="manufacturing-section" id={ids(project, "route")}>
            <div className="manufacturing-route-heading">
              <h2>
                {text(
                  lang,
                  "Поопераційний маршрут",
                  "Operation-by-operation route",
                )}
              </h2>
              <button
                className="text-link"
                onClick={() =>
                  setOpenSetups(
                    openSetups.length === project.setups.length
                      ? []
                      : project.setups.map((s) => s.id),
                  )
                }
              >
                {openSetups.length === project.setups.length
                  ? text(lang, "Згорнути всі", "Collapse all")
                  : text(lang, "Розгорнути всі", "Expand all")}
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="manufacturing-route-overview">
              {project.setups.map((setup, i) => (
                <button key={setup.id} onClick={() => showSetup(setup.id)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{setup.title[lang]}</strong>
                  <small>
                    {setup.operations.length}{" "}
                    {text(lang, "операції", "operations")}
                  </small>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
            {project.setups.map((setup) => (
              <Setup
                key={setup.id}
                project={project}
                setup={setup}
                lang={lang}
                prefs={prefs}
                toggle={toggle}
                onMeasurement={onMeasurement}
                open={openSetups.includes(setup.id)}
                onToggle={() =>
                  setOpenSetups((prev) =>
                    prev.includes(setup.id)
                      ? prev.filter((id) => id !== setup.id)
                      : [...prev, setup.id],
                  )
                }
              />
            ))}
          </section>
          <section
            className="manufacturing-section"
            id={ids(project, "inspection")}
          >
            <h2>
              {text(
                lang,
                "Фінальний контроль і типові помилки",
                "Final inspection & common mistakes",
              )}
            </h2>
            <BulletList items={project.qualityPlan} lang={lang} ordered />
            <button
              className="button button-secondary"
              onClick={() => jump(ids(project, "drawing"))}
            >
              <Ruler size={16} />
              {text(
                lang,
                "Внести результати у протокол",
                "Record inspection results",
              )}
            </button>
            <div className="manufacturing-pitfalls">
              <h3>
                {text(
                  lang,
                  "Що може зіпсувати результат",
                  "What can compromise the result",
                )}
              </h3>
              <BulletList items={project.pitfalls} lang={lang} />
            </div>
          </section>
          {project.cutting.length > 0 && (
            <section
              className="manufacturing-section"
              id={ids(project, "cutting")}
            >
              <h2>
                {text(
                  lang,
                  "Приклади розрахунку обертів і подачі",
                  "Speed & feed calculation examples",
                )}
              </h2>
              <p className="manufacturing-section-intro">
                {text(
                  lang,
                  "Значення Vc та подачі тут — явно задані припущення для перевірки арифметики. Це не затверджена карта режимів для невідомого верстата або інструмента.",
                  "Vc and feed values below are explicit assumptions for checking the arithmetic. They are not an approved cutting schedule for an unspecified machine or tool.",
                )}
              </p>
              {project.cutting.map((example, i) => (
                <CuttingExample key={i} example={example} lang={lang} />
              ))}
            </section>
          )}
          <section
            className="manufacturing-section"
            id={ids(project, "sources")}
          >
            <h2>{text(lang, "Документація процесу", "Process references")}</h2>
            <div className="sources">
              {project.sources
                .map((id) => sources.find((s) => s.id === id))
                .filter((s) => !!s)
                .map((source) => (
                  <a
                    href={source.url}
                    key={source.id}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={16} />
                    <span>
                      {source.title}
                      <small>{source.publisher}</small>
                    </span>
                    <ArrowUpRight size={16} />
                  </a>
                ))}
            </div>
          </section>
          {children}
        </div>
        <aside className="manufacturing-toc">
          <span className="eyebrow">
            {text(lang, "Пакет виготовлення", "Manufacturing package")}
          </span>
          <nav>
            {navigation
              .filter(
                ([key]) => key !== "cutting" || project.cutting.length > 0,
              )
              .map(([key, label]) => (
                <button key={key} onClick={() => jump(ids(project, key))}>
                  {label}
                </button>
              ))}
          </nav>
          <div className="manufacturing-toc-setups">
            <strong>{text(lang, "Встановлення", "Setups")}</strong>
            {project.setups.map((setup) => (
              <button key={setup.id} onClick={() => showSetup(setup.id)}>
                <span>{setup.id}</span>
                {setup.title[lang]}
              </button>
            ))}
          </div>
          <div className="manufacturing-toc-meta">
            <span>{countTerm(project.setups.length, lang, "setup")}</span>
            <span>
              {total} {text(lang, "операцій", "operations")}
            </span>
            <span>
              {project.fixtures.filter((f) => f.made).length}{" "}
              {text(lang, "пристроїв виготовляється", "fixtures to make")}
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}
