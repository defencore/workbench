import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Search,
} from "lucide-react";
import type { Lang } from "../data/types";
import type { Preferences } from "../storage";
import {
  latheParts,
  latheControls,
  toolpostParts,
  latheAnatomySources,
} from "../data/lathe-anatomy";
import LatheConstructionDrawing from "./LatheConstructionDrawing";
import SaveButton from "./SaveButton";
import "./LatheAnatomy.css";
const text = (lang: Lang, uk: string, en: string) => (lang === "uk" ? uk : en);
type View = "machine" | "controls" | "toolpost";
const validView = (value: string | null): View =>
  value === "controls" || value === "toolpost" ? value : "machine";
const readView = () =>
  validView(new URLSearchParams(location.hash.split("?")[1]).get("view"));
export default function LatheAnatomy({
  lang,
  prefs,
  toggle,
}: {
  lang: Lang;
  prefs: Preferences;
  toggle: (field: "saved" | "completed" | "checks", id: string) => void;
}) {
  const [view, setView] = useState<View>(readView);
  const [selection, setSelection] = useState({ machine: 5, toolpost: 5 });
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  useEffect(() => {
    const sync = () => setView(readView());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const choose = (next: View) => {
    setView(next);
    history.replaceState(
      null,
      "",
      `#/lathe-anatomy${next === "machine" ? "" : `?view=${next}`}`,
    );
  };
  const controls = latheControls.filter((entry) => entry.kind === "control");
  const others = latheControls.filter((entry) => entry.kind !== "control");
  const groups = {
    spindle: text(lang, "Шпиндель", "Spindle"),
    feed: text(lang, "Подачі й різьба", "Feeds & threading"),
    carriage: text(lang, "Супорт", "Carriage"),
    tailstock: text(lang, "Задня бабка", "Tailstock"),
    electrical: text(lang, "Електрокерування", "Electrical controls"),
    toolpost: text(lang, "Різцетримач", "Toolpost"),
  };
  const matches = controls.filter(
    (entry) =>
      (!group || entry.group === group) &&
      `${entry.name.uk} ${entry.name.en} ${entry.description.uk} ${entry.description.en}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  const entries = view === "toolpost" ? toolpostParts : latheParts;
  const selected =
    entries.find(
      (entry) =>
        entry.number ===
        selection[view === "toolpost" ? "toolpost" : "machine"],
    ) || entries[0];
  return (
    <article className="lathe-anatomy">
      <a className="back-link" href="#/library?category=lathe">
        <ArrowLeft size={16} />
        {text(lang, "Токарна обробка", "Turning")}
      </a>
      <header className="lathe-anatomy__heading">
        <div>
          <span className="eyebrow">
            {text(
              lang,
              "Довідник будови ТВ‑6М",
              "TV‑6M construction reference",
            )}
          </span>
          <h1>
            {text(
              lang,
              "Токарний верстат: вузли й органи керування",
              "Lathe: assemblies & controls",
            )}
          </h1>
          <p>
            {text(
              lang,
              "Навчальний токарно-гвинторізний верстат ТВ‑6М. Назви вузлів, призначення рукояток і маховиків, будова чотирипозиційного різцетримача.",
              "The TV‑6M training screwcutting lathe. Assembly names, handle and handwheel functions, and the four-way toolpost.",
            )}
          </p>
        </div>
        <SaveButton
          id="reference-lathe-anatomy"
          lang={lang}
          prefs={prefs}
          toggle={toggle}
        />
      </header>
      <div className="lathe-anatomy__terms">
        <div>
          <strong>{text(lang, "Різцетримач", "Toolpost")}</strong>
          <p>
            {text(
              lang,
              "Вузол на верхніх полозках супорта, який закріплює різець. На схемі нижче — чотирипозиційний різцетримач із затискними болтами.",
              "The assembly on the compound slide that clamps the turning tool. The diagram below shows a four-way toolpost with clamping screws.",
            )}
          </p>
        </div>
        <div>
          <strong>
            {text(lang, "Корпус різця (державка)", "Tool body / shank")}
          </strong>
          <p>
            {text(
              lang,
              "Металева частина самого різця. Її затискають у різцетримачі; у різці зі змінною пластиною вона несе гніздо та кріплення пластини.",
              "The metal body of the cutting tool itself. It is clamped in the toolpost; on an indexable tool it carries the insert seat and fastening.",
            )}
          </p>
        </div>
        <div>
          <strong>{text(lang, "Різальна пластина", "Cutting insert")}</strong>
          <p>
            {text(
              lang,
              "Різальна частина змінного типу, закріплена на корпусі різця. Гвинт пластини та затискні болти різцетримача мають різне призначення.",
              "The replaceable cutting element mounted on the tool body. The insert screw and toolpost clamping screws serve different purposes.",
            )}
          </p>
        </div>
      </div>
      <div
        className="lathe-anatomy__tabs"
        role="tablist"
        aria-label={text(
          lang,
          "Розділ будови верстата",
          "Lathe reference section",
        )}
      >
        {(["machine", "controls", "toolpost"] as const).map((item, index) => (
          <button
            key={item}
            id={`lathe-anatomy-tab-${item}`}
            role="tab"
            aria-selected={view === item}
            aria-controls="lathe-anatomy-panel"
            tabIndex={view === item ? 0 : -1}
            onClick={() => choose(item)}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const items: View[] = ["machine", "controls", "toolpost"];
              const next =
                event.key === "Home"
                  ? items[0]
                  : event.key === "End"
                    ? items[2]
                    : items[
                        (index + (event.key === "ArrowRight" ? 1 : -1) + 3) % 3
                      ];
              choose(next);
              document.getElementById(`lathe-anatomy-tab-${next}`)?.focus();
            }}
          >
            {item === "machine"
              ? text(
                  lang,
                  `Будова · ${latheParts.length}`,
                  `Assemblies · ${latheParts.length}`,
                )
              : item === "controls"
                ? text(
                    lang,
                    `Керування · ${controls.length} позицій`,
                    `Controls · ${controls.length} entries`,
                  )
                : text(lang, "Різцетримач · 5", "Toolpost · 5")}
          </button>
        ))}
      </div>
      <section
        id="lathe-anatomy-panel"
        role="tabpanel"
        aria-labelledby={`lathe-anatomy-tab-${view}`}
        tabIndex={0}
      >
        {view === "controls" ? (
          <>
            <div className="lathe-anatomy__numbering">
              <BookOpen size={22} />
              <div>
                <strong>
                  {text(
                    lang,
                    "Нумерація за рис. 1 паспорта ТВ‑6М",
                    "Numbering follows TV‑6M manual Figure 1",
                  )}
                </strong>
                <p>
                  {text(
                    lang,
                    "Наведено 16 нумерованих позицій керування. Це інша нумерація, ніж 18 позначень на схемі будови. У паспортному переліку є також огородження, світильник і трансформатор: вони наведені окремо нижче.",
                    "These are 16 numbered control entries. Their numbering differs from the 18 assembly callouts. The manual also numbers guards, the lamp and transformer; these are listed separately below.",
                  )}
                </p>
                <a
                  className="text-link"
                  href={
                    latheAnatomySources.find(
                      (source) => source.id === "lathe-anatomy-tv6m-passport",
                    )!.url
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {text(
                    lang,
                    "Розташування органів керування: рис. 1 паспорта",
                    "Control locations: manual Figure 1",
                  )}
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="lathe-anatomy__filters">
              <label className="inline-search">
                <Search size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={text(
                    lang,
                    "Маховик, піноль, подача, різьба…",
                    "Handwheel, quill, feed, thread…",
                  )}
                  aria-label={text(
                    lang,
                    "Пошук органів керування",
                    "Search controls",
                  )}
                />
              </label>
              <select
                value={group}
                onChange={(event) => setGroup(event.target.value)}
                aria-label={text(lang, "Вузол керування", "Control group")}
              >
                <option value="">
                  {text(lang, "Усі вузли", "All groups")}
                </option>
                {Object.entries(groups).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="lathe-anatomy__control-list">
              {matches.map((entry) => (
                <section key={entry.id}>
                  <span className="lathe-anatomy__number">{entry.number}</span>
                  <div>
                    <h2>{entry.name[lang]}</h2>
                    <span>
                      {groups[entry.group as keyof typeof groups] ||
                        text(lang, "Керування верстатом", "Machine control")}
                    </span>
                    <p>{entry.description[lang]}</p>
                  </div>
                </section>
              ))}
            </div>
            {!matches.length && (
              <p>
                {text(
                  lang,
                  "За цим запитом органів керування не знайдено.",
                  "No controls match this search.",
                )}
              </p>
            )}
            <details className="lathe-anatomy__other">
              <summary>
                {text(
                  lang,
                  `Інші позначення на паспортній схемі · ${others.length}`,
                  `Other manual callouts · ${others.length}`,
                )}
              </summary>
              {others.map((entry) => (
                <div key={entry.id}>
                  <b>{entry.number}</b>
                  <p>
                    <strong>{entry.name[lang]}</strong>
                    {entry.description[lang]}
                  </p>
                </div>
              ))}
            </details>
            <div className="lathe-anatomy__manual-note">
              <strong>
                {text(
                  lang,
                  "Кнопка «Стоп», аварійна зупинка та вимикач живлення — різні функції",
                  "Stop, emergency stop and power isolation serve different functions",
                )}
              </strong>
              <p>
                {text(
                  lang,
                  "Назва кнопкового поста ТВ‑6М не підтверджує наявність сучасної аварійної зупинки чи гальма. Функції, положення перемикачів і допустимість перемикання перевіряють за паспортом саме встановленого верстата.",
                  "The TV‑6M button-station description does not establish a modern emergency stop or brake. Confirm functions, switch positions and permitted shifting procedures in the manual for the actual installed machine.",
                )}
              </p>
            </div>
          </>
        ) : (
          <>
            <h2>
              {view === "machine"
                ? text(lang, "Основні вузли ТВ‑6М", "TV‑6M main assemblies")
                : text(
                    lang,
                    "Чотирипозиційний різцетримач",
                    "Four-way toolpost",
                  )}
            </h2>
            <p className="lathe-anatomy__intro">
              {view === "machine"
                ? text(
                    lang,
                    "Нумерація 1–18 стосується цієї схеми загальної будови ТВ‑6М. Виберіть номер на рисунку або назву у списку.",
                    "Numbers 1–18 belong to this TV‑6M overall-construction drawing. Select a number on the drawing or a name in the list.",
                  )
                : text(
                    lang,
                    "Позначення 1–5 відповідають схемі різцетримача. Болти 4 закріплюють корпус різця; рукоятка 3 керує фіксатором самого різцетримача.",
                    "Callouts 1–5 follow the toolpost diagram. Screws 4 clamp the tool body; handle 3 operates the toolpost locking mechanism.",
                  )}
            </p>
            <LatheConstructionDrawing
              lang={lang}
              view={view}
              entries={entries}
              activeNumber={selected.number}
              onSelect={(number) =>
                setSelection((previous) => ({ ...previous, [view]: number }))
              }
            />
            <div className="lathe-anatomy__selected" aria-live="polite">
              <span className="lathe-anatomy__number">{selected.number}</span>
              <div>
                <h3>{selected.name[lang]}</h3>
                <p>{selected.description[lang]}</p>
              </div>
            </div>
            <div className="lathe-anatomy__index">
              {entries.map((entry) => (
                <button
                  key={entry.id}
                  aria-pressed={entry.number === selected.number}
                  onClick={() =>
                    setSelection((previous) => ({
                      ...previous,
                      [view]: entry.number,
                    }))
                  }
                >
                  <b>{entry.number}</b>
                  <span>{entry.name[lang]}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
      <section className="lathe-anatomy__sources">
        <h2>{text(lang, "Першоджерела й нумерація", "Sources & numbering")}</h2>
        <p>
          {text(
            lang,
            "Термінологію звірено з навчальними виданнями та документацією виробників. Архівна копія заводського паспорта ТВ‑6М описує саме цю модель; сучасні посібники інших верстатів використані для пояснення вузлів і відмінностей органів керування.",
            "Terminology is checked against educational publications and manufacturer documentation. The archived factory TV‑6M manual describes that model; current manuals for other lathes explain assemblies and differences between control systems.",
          )}
        </p>
        {latheAnatomySources.map((source) => (
          <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
            <span>
              <small>{source.publisher}</small>
              <strong>{source.title}</strong>
            </span>
            <ArrowUpRight size={17} />
          </a>
        ))}
      </section>
      <a className="text-link" href="#/lesson/lathe-setup">
        {text(
          lang,
          "Підготовка токарного верстата до роботи",
          "Preparing a lathe for use",
        )}
        <ArrowRight size={16} />
      </a>
    </article>
  );
}
