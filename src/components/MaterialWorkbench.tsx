import { lazy, Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  Search,
  TriangleAlert,
} from "lucide-react";
import { materialGuides } from "../data/material-guides";
import { projects, sources } from "../data/content";
import type { Lang, MaterialGuide, MaterialMethod, Text } from "../data/types";
import type { Preferences } from "../storage";
import { levels, tr } from "../data/ui";
import SaveButton from "./SaveButton";
import SurfaceExamples from "./SurfaceExamples";
import "./MaterialWorkbench.css";
const MachiningLab = lazy(() => import("./MachiningLab"));
type Common = {
  lang: Lang;
  prefs: Preferences;
  toggle: (field: "saved" | "completed" | "checks", id: string) => void;
};
const t = (lang: Lang, uk: string, en: string) => (lang === "uk" ? uk : en);
export const materialBookmark = (material: MaterialGuide) =>
  `material-${material.id}`;
const methods: Record<MaterialMethod["operation"], Text> = {
  turning: { uk: "Точіння", en: "Turning" },
  milling: { uk: "Фрезерування", en: "Milling" },
  drilling: { uk: "Свердління", en: "Drilling" },
  finishing: { uk: "Фініш і задирки", en: "Finishing & deburring" },
};
function List({ items, lang }: { items: Text[]; lang: Lang }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item[lang]}</li>
      ))}
    </ul>
  );
}
function Lab({ material, lang }: { material: MaterialGuide; lang: Lang }) {
  return (
    <Suspense
      fallback={
        <div className="material-lab-loading">
          <Box size={24} />
          {t(lang, "Завантаження 3D-процесу…", "Loading the 3D process…")}
        </div>
      }
    >
      <MachiningLab key={material.id} material={material} lang={lang} />
    </Suspense>
  );
}
export function MaterialCard({
  material,
  lang,
  prefs,
  toggle,
}: Common & { material: MaterialGuide }) {
  return (
    <article className="material-card">
      <div className="material-card-top">
        <span
          className="material-swatch"
          style={{ background: material.appearance.color }}
        />
        <span>{levels[material.level][lang]}</span>
        <SaveButton
          id={materialBookmark(material)}
          lang={lang}
          prefs={prefs}
          toggle={toggle}
        />
      </div>
      <a href={`#/material/${material.id}`}>
        <h2>{material.name[lang]}</h2>
        <p>{material.summary[lang]}</p>
        <span className="text-link">
          {t(
            lang,
            "Інструмент, обробка, результат",
            "Tools, technique & results",
          )}
          <ArrowRight size={16} />
        </span>
      </a>
    </article>
  );
}
export function MaterialsCatalog(common: Common) {
  const { lang, prefs } = common;
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState(
    () =>
      new URLSearchParams(location.hash.split("?")[1]).get("material") ||
      "aluminium",
  );
  useEffect(() => {
    const sync = () =>
      setSelection(
        new URLSearchParams(location.hash.split("?")[1]).get("material") ||
          "aluminium",
      );
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const selected =
    materialGuides.find((m) => m.id === selection) || materialGuides[0];
  const filtered = materialGuides
    .filter((m) =>
      `${m.name.uk} ${m.name.en} ${m.grades.uk} ${m.grades.en} ${m.summary.uk} ${m.summary.en}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
    )
    .sort(
      (a, b) =>
        Number(prefs.saved.includes(materialBookmark(b))) -
        Number(prefs.saved.includes(materialBookmark(a))),
    );
  return (
    <div className="material-workbench">
      <div className="page-heading">
        <h1>
          {t(
            lang,
            "Матеріал → інструмент → результат",
            "Material → tool → result",
          )}
        </h1>
        <p>
          {t(
            lang,
            "Що різати, чим різати й що має вийти. Окремі рекомендації для конкретних сплавів, пластиків і станів постачання.",
            "What to cut, which tool to use, and what to expect. Specific guidance for identified alloys, plastics and supply conditions.",
          )}
        </p>
      </div>
      <section className="material-lab-section">
        <div className="material-section-heading">
          <div>
            <h2>
              {t(
                lang,
                "Подивіться, як утворюється деталь",
                "See how a part takes shape",
              )}
            </h2>
            <p>
              {t(
                lang,
                "Переміщуйте повзунок: заготовка, різальний інструмент і вже знятий матеріал.",
                "Move the slider to inspect the stock, cutting tool and material already removed.",
              )}
            </p>
          </div>
          <label>
            {t(lang, "Матеріал моделі", "Model material")}
            <select
              value={selected.id}
              onChange={(e) => {
                setSelection(e.target.value);
                history.replaceState(
                  null,
                  "",
                  `#/materials?material=${e.target.value}`,
                );
              }}
            >
              {materialGuides.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name[lang]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Lab material={selected} lang={lang} />
        <a className="text-link" href={`#/material/${selected.id}`}>
          {t(lang, "Відкрити практичний довідник: ", "Open practical guide: ")}
          {selected.name[lang]}
          <ArrowRight size={16} />
        </a>
      </section>
      <div className="material-section-heading">
        <h2>
          {t(lang, "Довідники за матеріалом", "Guides by material")}{" "}
          <small>
            {filtered.length} / {materialGuides.length}
          </small>
        </h2>
        <label className="inline-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              lang,
              "Алюміній, C45, POM, 304…",
              "Aluminium, C45, POM, 304…",
            )}
            aria-label={t(lang, "Знайти матеріал", "Find a material")}
          />
        </label>
      </div>
      <div className="material-grid">
        {filtered.map((material) => (
          <MaterialCard key={material.id} material={material} {...common} />
        ))}
      </div>
      {!filtered.length && <p>{tr("noResults", lang)}</p>}
    </div>
  );
}
export function MaterialDetail({ id, ...common }: Common & { id?: string }) {
  const { lang, prefs, toggle } = common;
  const material = materialGuides.find((m) => m.id === id);
  const [operation, setOperation] =
    useState<MaterialMethod["operation"]>("turning");
  useEffect(() => setOperation("turning"), [id]);
  if (!material)
    return (
      <div className="page-heading">
        <h1>{t(lang, "Матеріал не знайдено", "Material not found")}</h1>
        <a href="#/materials">{tr("materials", lang)}</a>
      </div>
    );
  const method = material.methods.find((m) => m.operation === operation)!;
  return (
    <article className="material-workbench material-detail">
      <a className="back-link" href="#/materials">
        <ArrowLeft size={16} />
        {t(lang, "Усі матеріали", "All materials")}
      </a>
      <div className="material-title">
        <div className="page-heading">
          <span className="eyebrow">{levels[material.level][lang]}</span>
          <h1>{material.name[lang]}</h1>
          <p>{material.summary[lang]}</p>
        </div>
        <SaveButton
          id={materialBookmark(material)}
          lang={lang}
          prefs={prefs}
          toggle={toggle}
        />
      </div>
      <nav
        className="material-toc"
        aria-label={t(lang, "У цьому довіднику", "In this guide")}
      >
        {[
          ["prepare", t(lang, "Підготовка", "Preparation")],
          ["process", t(lang, "3D-процес", "3D process")],
          ["tools", t(lang, "Чим і як працювати", "Tools & technique")],
          ["surface", t(lang, "Якість поверхні", "Surface quality")],
          ["practice", t(lang, "Практика", "Practice")],
          ["defects", t(lang, "Діагностика", "Troubleshooting")],
        ].map(([key, label]) => (
          <a
            key={key}
            href={`#/material/${material.id}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(`material-${key}`)
                ?.scrollIntoView({ block: "start" });
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <section id="material-prepare">
        <h2>{t(lang, "Перед першим різом", "Before the first cut")}</h2>
        <p className="material-grade">
          <strong>{t(lang, "Марка й стан: ", "Grade & condition: ")}</strong>
          {material.grades[lang]}
        </p>
        <div className="material-two-column">
          <div>
            <h3>{t(lang, "Як поводиться матеріал", "Material behaviour")}</h3>
            <List items={material.behaviour} lang={lang} />
          </div>
          <div>
            <h3>
              {t(
                lang,
                "Що підготувати й перевірити",
                "Preparation & verification",
              )}
            </h3>
            <List items={material.preparation} lang={lang} />
          </div>
        </div>
        <div className="material-hazards">
          <h3>
            <TriangleAlert size={19} />
            {t(lang, "Ризики цього матеріалу", "Material-specific hazards")}
          </h3>
          <List items={material.hazards} lang={lang} />
        </div>
      </section>
      <section id="material-process">
        <h2>
          {t(lang, "Візуальний розбір обробки", "Visual machining walkthrough")}
        </h2>
        <Lab material={material} lang={lang} />
      </section>
      <section id="material-tools">
        <h2>
          {t(
            lang,
            "Чим працювати й який буде результат",
            "Which tools to use & what to expect",
          )}
        </h2>
        <div
          className="material-tabs"
          role="tablist"
          aria-label={t(lang, "Операція", "Operation")}
        >
          {material.methods.map((m) => (
            <button
              type="button"
              role="tab"
              key={m.operation}
              id={`material-tab-${m.operation}`}
              aria-controls="material-method"
              aria-selected={operation === m.operation}
              tabIndex={operation === m.operation ? 0 : -1}
              onKeyDown={(e) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key))
                  return;
                e.preventDefault();
                const list = material.methods.map((v) => v.operation);
                const i = list.indexOf(operation);
                const next =
                  e.key === "Home"
                    ? list[0]
                    : e.key === "End"
                      ? list.at(-1)!
                      : list[
                          (i +
                            (e.key === "ArrowRight" ? 1 : -1) +
                            list.length) %
                            list.length
                        ];
                setOperation(next);
                document.getElementById(`material-tab-${next}`)?.focus();
              }}
              onClick={() => setOperation(m.operation)}
            >
              {methods[m.operation][lang]}
            </button>
          ))}
        </div>
        <div
          id="material-method"
          role="tabpanel"
          aria-labelledby={`material-tab-${operation}`}
          tabIndex={0}
        >
          <dl className="material-method">
            {(
              [
                [
                  t(lang, "Інструмент і геометрія", "Tool & geometry"),
                  method.tool,
                ],
                [
                  t(lang, "Установ і жорсткість", "Setup & rigidity"),
                  method.setup,
                ],
                [t(lang, "Як виконувати", "How to cut"), method.technique],
                [
                  t(lang, "Стружка та її відведення", "Chips & evacuation"),
                  method.chips,
                ],
                [
                  t(lang, "Очікуваний результат", "Expected result"),
                  method.expected,
                ],
                [t(lang, "Чого уникати", "What to avoid"), method.avoid],
              ] as [string, Text][]
            ).map(([label, body]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{body[lang]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section id="material-surface">
        <h2>
          {t(
            lang,
            "Як виглядають результат і помилки",
            "Recognising results & defects",
          )}
        </h2>
        <SurfaceExamples material={material} lang={lang} />
      </section>
      <section id="material-practice">
        <h2>
          {t(
            lang,
            "Практичні вправи з контрольованим результатом",
            "Practical exercises with a checkable result",
          )}
        </h2>
        <p>
          {t(
            lang,
            "Перші проби — з інструктором, на контрольній заготовці. Режим беріть із документації саме вашого інструмента для відомої марки матеріалу; за один дослід змінюйте одну умову.",
            "Make first trials with an instructor on a test coupon. Use the actual tool maker’s data for the identified material grade; change one condition per trial.",
          )}
        </p>
        <div className="material-exercises">
          {material.exercises.map((exercise, i) => (
            <details key={i} open={i === 0}>
              <summary>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {exercise.title[lang]}
              </summary>
              <div>
                <p>
                  <strong>{t(lang, "Мета: ", "Goal: ")}</strong>
                  {exercise.goal[lang]}
                </p>
                <p>
                  <strong>{t(lang, "Заготовка: ", "Stock: ")}</strong>
                  {exercise.stock[lang]}
                </p>
                <h4>{t(lang, "Підготуйте", "Prepare")}</h4>
                <List items={exercise.tools} lang={lang} />
                <ol className="material-exercise-steps">
                  {exercise.steps.map((step, n) => (
                    <li key={n}>
                      <h4>{step.title[lang]}</h4>
                      <p>{step.body[lang]}</p>
                      {step.check && (
                        <p className="material-check">
                          <strong>{t(lang, "Перевірка: ", "Check: ")}</strong>
                          {step.check[lang]}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
                <div className="material-expected">
                  <h4>{t(lang, "Що має вийти", "Expected outcome")}</h4>
                  <p>{exercise.result[lang]}</p>
                  <List items={exercise.measure} lang={lang} />
                </div>
                {exercise.projectIds.length > 0 && (
                  <div className="material-related">
                    <strong>
                      {t(
                        lang,
                        "Наступна практична деталь",
                        "Next practice part",
                      )}
                    </strong>
                    {exercise.projectIds.map((projectId) => {
                      const project = projects.find((p) => p.id === projectId);
                      return (
                        project && (
                          <a href={`#/project/${project.id}`} key={project.id}>
                            {project.title[lang]}
                            <ArrowRight size={15} />
                          </a>
                        )
                      );
                    })}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
      <section id="material-defects">
        <h2>
          {t(lang, "Якщо результат відрізняється", "When the result differs")}
        </h2>
        <div className="material-defects">
          {material.defects.map((defect, i) => (
            <details key={i}>
              <summary>{defect.symptom[lang]}</summary>
              <dl>
                {[
                  [t(lang, "Можлива причина", "Possible cause"), defect.cause],
                  [t(lang, "Що перевірити", "What to check"), defect.checks],
                  [t(lang, "Наступна дія", "Next action"), defect.response],
                ].map(([label, body]) => (
                  <div key={label as string}>
                    <dt>{label as string}</dt>
                    <dd>{(body as Text)[lang]}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
        <h3>
          {t(lang, "Фінішна обробка й приймання", "Finishing & acceptance")}
        </h3>
        <List items={material.finishing} lang={lang} />
      </section>
      <section className="material-sources">
        <h2>{tr("sources", lang)}</h2>
        {material.sources.map((sourceId) => {
          const source = sources.find((s) => s.id === sourceId);
          return (
            source && (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  {source.publisher}
                  <strong>{source.title}</strong>
                </span>
                <ArrowUpRight size={16} />
              </a>
            )
          );
        })}
      </section>
    </article>
  );
}
