import { useEffect, useId, useRef, useState } from "react";
import type { Lang, MaterialGuide, MaterialId, Text } from "../data/types";
import "./SurfaceExamples.css";

type Pattern =
  | "raw"
  | "finish"
  | "smear"
  | "burr"
  | "chatter"
  | "rub"
  | "breakout"
  | "scores"
  | "melt"
  | "distort"
  | "fuzz"
  | "springback"
  | "crumble"
  | "dust"
  | "gall"
  | "tint";
type Chip = MaterialGuide["appearance"]["chip"];
type Panel = {
  pattern: Pattern;
  title: Text;
  observe: Text;
  check: Text;
  state: "stock" | "reference" | "inspect";
};
const t = (uk: string, en: string): Text => ({ uk, en });
const say = (lang: Lang, uk: string, en: string) => (lang === "uk" ? uk : en);
const problem = (
  pattern: Pattern,
  title: Text,
  observe: Text,
  check: Text,
): Panel => ({ pattern, title, observe, check, state: "inspect" });

const examples: Record<MaterialId, { finish: Text; problems: [Panel, Panel] }> =
  {
    aluminium: {
      finish: t(
        "Рівні дуги проходу без розмазаної кромки. Блиск сам по собі не підтверджує розмір, площинність або шорсткість.",
        "Even cutter sweeps without a smeared edge. Shine alone does not establish size, flatness or roughness.",
      ),
      problems: [
        problem(
          "smear",
          t("Налипання й рвані ділянки", "Adhesion and torn patches"),
          t(
            "Замість рівного сліду — блискучі язички, вириви й перервані борозни. Це привід перевірити наріст на кромці, а не доведений діагноз.",
            "Bright dragged lips, tears and interrupted grooves replace the even trace. These suggest checking for built-up edge, rather than proving it.",
          ),
          t(
            "Огляньте зупинений інструмент на налипання та затуплення; перевірте придатність геометрії для алюмінію, відведення стружки й сумісну змазку. Відновіть кромку та зробіть контрольний прохід на припуску за даними виробника.",
            "Inspect the stopped tool for adhesion and wear; check aluminium-suitable geometry, chip evacuation and compatible lubrication. Restore the edge and make a trial pass on allowance using the toolmaker’s data.",
          ),
        ),
        problem(
          "burr",
          t("Задирка на виході свердла", "Drill-exit burr"),
          t(
            "Тонка піднята губа навколо отвору; з одного боку вона може бути вищою. Показано саме вихідний бік, не вхідну фаску.",
            "A thin raised lip surrounds the hole and may be taller on one side. This is the exit face, not an entry chamfer.",
          ),
          t(
            "Перевірте гостроту свердла, биття й опору виходу з передбаченим зазором для вістря. Відпрацюйте подачу на виході за рекомендацією свердла; зніміть задирку контрольовано й повторно перевірте край і розмір.",
            "Check drill sharpness, runout and exit support with planned drill-point clearance. Qualify breakthrough feed using the drillmaker’s guidance; deburr deliberately and recheck the edge and size.",
          ),
        ),
      ],
    },
    "carbon-steel": {
      finish: t(
        "Повторюваний крок слідів без хвилястих темних смуг. Для приймання все одно потрібні розмірний контроль і заданий метод оцінки поверхні.",
        "A repeatable feed pattern without broad wavy bands. Acceptance still requires dimensional checks and the specified surface assessment.",
      ),
      problems: [
        problem(
          "chatter",
          t("Регулярні смуги вібрації", "Repeated chatter bands"),
          t(
            "Широкі хвилі накладені на дрібні сліди подачі. Схожі сліди можуть мати різні причини — форму не слід плутати з виміряною частотою.",
            "Broad waves overlay the fine feed traces. Similar patterns can have different causes; their appearance is not a measured vibration frequency.",
          ),
          t(
            "Перевірте кріплення й опори деталі, виліт інструмента, биття та люфти. Усуньте нестабільність; наступну пробу робіть зі зміною одного параметра в дозволеному діапазоні. Не маскуйте хвилі поліруванням до контролю розміру.",
            "Check workholding and support, tool overhang, runout and play. Correct instability; change one parameter at a time within the approved range for the next trial. Do not polish away the evidence before measuring the part.",
          ),
        ),
        problem(
          "burr",
          t("Рвана вихідна кромка", "Torn breakthrough edge"),
          t(
            "Нерівна гостра губа й дрібні прикріплені язички по периметру отвору. Верхній гладкий вхід не означає чистого виходу.",
            "An irregular sharp lip and attached tabs remain around the hole. A clean entry face does not establish a clean exit.",
          ),
          t(
            "Огляньте обидва боки, перевірте знос свердла та опору виходу. Передбачте доступ для контрольованого зняття задирки без завалювання посадки; після цього перевірте діаметр і поверхню прилягання.",
            "Inspect both faces, drill wear and exit support. Provide access for controlled deburring without rounding a fit; then check hole size and the seating face.",
          ),
        ),
      ],
    },
    stainless: {
      finish: t(
        "Рівномірний слід різання без розмазаних плям. Дзеркальність не є вимогою за замовчуванням і не засвідчує відсутності наклепу.",
        "A consistent cutting trace without smeared patches. A mirror finish is not a default requirement and does not establish freedom from work hardening.",
      ),
      problems: [
        problem(
          "rub",
          t("Заполірування замість різання", "Burnished rubbing patches"),
          t(
            "Блискуча розмита смуга з майже стертими слідами подачі. Наклеп можливий, але його не можна підтвердити кольором або блиском.",
            "A glossy blurred band nearly erases the feed marks. Work hardening is possible, but cannot be confirmed from colour or shine.",
          ),
          t(
            "Перевірте знос і геометрію кромки, реальну товщину стружки та фактичний припуск. Усуньте тертя й зупинки інструмента в контакті; відновіть стабільне різання за даними для конкретної марки сталі та інструмента. За вимогою перевіряйте твердість належним методом.",
            "Check edge wear and geometry, actual chip thickness and remaining stock. Eliminate rubbing and dwell in contact; restore stable cutting using data for the exact steel and tool. If required, assess hardness with an appropriate method.",
          ),
        ),
        problem(
          "chatter",
          t("Хвилі на обробленій грані", "Waves on the machined face"),
          t(
            "Періодичні світлі й темні гребені перекривають сліди проходу; тонка деталь може відхилятися під навантаженням.",
            "Periodic bright and dark ridges cross the cutter trace; a slender part may also deflect under load.",
          ),
          t(
            "Зупиніться й перевірте жорсткість кріплення, опори та мінімально потрібний виліт. Перевірте знос, биття й стабільність дозволеної подачі; оцініть геометрію у вільному стані після розкріплення.",
            "Stop and check fixture stiffness, support and minimum necessary overhang. Check wear, runout and stable feed within the allowed range; inspect geometry in the free state after release.",
          ),
        ),
      ],
    },
    brass: {
      finish: t(
        "Чіткий рівномірний слід і неушкоджена кромка. Цей вигляд не ідентифікує свинцевмісну чи безсвинцеву марку латуні.",
        "A clear, even trace and intact edge. This appearance does not identify a leaded or lead-free brass grade.",
      ),
      problems: [
        problem(
          "breakout",
          t("Вирив на виході отвору", "Breakout at a hole exit"),
          t(
            "Один край отвору вирваний, інший має підняту губу. Такий край може супроводжувати захоплення свердла, але не доводить його причину.",
            "One part of the hole edge is torn out and another has a raised lip. This can accompany drill grabbing, but does not establish the cause.",
          ),
          t(
            "Перевірте жорстке кріплення деталі, опору виходу та придатність геометрії свердла для конкретної латуні. Випробуйте контрольований вихід на зразку. Не утримуйте заготовку рукою й не переточуйте свердло навмання.",
            "Check positive workholding, exit support and drill geometry suitable for the exact brass grade. Qualify controlled breakthrough on a sample. Never hand-hold the workpiece or modify the drill geometry by guesswork.",
          ),
        ),
        problem(
          "scores",
          t(
            "Подряпини від повторного різання стружки",
            "Scratches from recut chips",
          ),
          t(
            "Глибші випадкові риски перетинають дрібний регулярний слід. Стружка, що лишилася в зоні різання, — одна з можливих причин.",
            "Deeper random scores cross the fine regular pattern. Chips remaining in the cutting zone are one possible cause.",
          ),
          t(
            "Після зупинки очистіть зону прийнятним способом, огляньте кромку й перевірте шлях відведення стружки. Перед чистовим проходом перевірте, чи вистачає припуску для повного усунення рисок; не обіцяйте це самим зменшенням подачі.",
            "With the machine stopped, clean by an approved method, inspect the edge and check chip evacuation. Before finishing, establish whether sufficient allowance remains to remove the scores; reducing feed alone is not a guarantee.",
          ),
        ),
      ],
    },
    copper: {
      finish: t(
        "Рівні сліди з чітким краєм без розтягнутих язичків. Темніший колір або окиснення самі по собі не визначають якість різання.",
        "Even traces with a defined edge and no dragged lips. Darkening or oxidation alone does not determine cutting quality.",
      ),
      problems: [
        problem(
          "smear",
          t("Розмазана мідь і вириви", "Smeared copper and tears"),
          t(
            "Широкі блискучі мазки та загнуті язички порушують рівний слід; поверхня виглядає розтягнутою, а не чисто зрізаною.",
            "Broad bright smears and folded lips interrupt the trace; the surface looks dragged rather than cleanly sheared.",
          ),
          t(
            "Перевірте гостроту, позитивну геометрію й налипання на зупиненому інструменті, а також мастило та відведення стружки. Відновіть придатну кромку; підтвердьте результат пробним проходом на цій марці міді, не поліруйте дефект до контролю.",
            "Check sharpness, positive geometry and adhesion on the stopped tool, together with lubrication and chip evacuation. Restore a suitable edge and qualify a trial pass on this copper grade; inspect before polishing away the defect.",
          ),
        ),
        problem(
          "burr",
          t("Тягуча вихідна задирка", "Ductile exit burr"),
          t(
            "Тонка загнута губа може лишатися приєднаною довгою стрічкою. Вона заважає приляганню й небезпечна при торканні.",
            "A thin folded lip can remain attached as a long ribbon. It interferes with seating and can cut on contact.",
          ),
          t(
            "Огляньте вихід з отвору, опору й гостроту свердла. Закладіть окрему контрольовану операцію зняття задирки; після неї перевірте посадку та відсутність вільних фрагментів. Не зривайте губу пальцями.",
            "Inspect the hole exit, support and drill sharpness. Plan a separate controlled deburring operation; then check the seating face and absence of loose fragments. Do not pull the lip off with your fingers.",
          ),
        ),
      ],
    },
    pom: {
      finish: t(
        "Рівна матова або слабко блискуча поверхня без налиплих ниток. Розмір перевіряють після охолодження й розкріплення, а не за блиском.",
        "An even matt or slightly glossy surface without attached strings. Measure after cooling and release, rather than judging by shine.",
      ),
      problems: [
        problem(
          "melt",
          t("Розмазана розм’якшена кромка", "Smeared softened edge"),
          t(
            "Склоподібні мазки й тягуча губа перекривають сліди різання. Вигляд показує привід перевірити нагрівання, а не виміряну температуру.",
            "Glassy smears and a stringy lip cover the cutting traces. The appearance calls for a heat check; it is not a temperature measurement.",
          ),
          t(
            "Припиніть пробу; перевірте гостроту, зазор за кромкою, виведення стружки й тепловкладення. Після охолодження огляньте поверхню та розміри; випробуйте сумісний режим за рекомендаціями виробника пластика. Не продовжуйте різання матеріалу, що розкладається.",
            "Stop the trial; check sharpness, edge clearance, chip evacuation and heat input. After cooling, inspect the surface and dimensions; qualify a compatible process using the plastic supplier’s guidance. Do not continue cutting degrading material.",
          ),
        ),
        problem(
          "distort",
          t("Отвір, який треба переміряти", "A bore that needs remeasurement"),
          t(
            "Нерівний край і овальний контур показані зі збільшеним спотворенням. Тепло, затиск і пружне відновлення можуть впливати на фактичну форму.",
            "An uneven lip and oval outline are deliberately exaggerated. Heat, clamping and elastic recovery can influence the actual form.",
          ),
          t(
            "Дайте деталі охолонути, розкріпіть її й виміряйте отвір у двох напрямках на кількох глибинах малим зусиллям. Порівняйте з результатом у затиску; змініть підтримку та черговість чорнового й чистового проходів до повторної проби.",
            "Let the part cool, release it and measure the bore in two directions at several depths with low measuring force. Compare with the clamped result; revise support and roughing/finishing sequence before repeating the trial.",
          ),
        ),
      ],
    },
    pa6: {
      finish: t(
        "Рівний зріз без ворсу й зім’ятої кромки. Приймальний розмір задають для узгодженого стану температури та вологості PA6.",
        "An even cut without fuzz or a crushed edge. Acceptance dimensions need an agreed PA6 temperature and moisture condition.",
      ),
      problems: [
        problem(
          "fuzz",
          t("Ворсиста незрізана кромка", "Fuzzy uncut edge"),
          t(
            "Тонкі нитки й нерівний білуватий валик лишаються на виході. Це ілюстрація незрізаного полімеру, не скловолоконного наповнювача.",
            "Fine strings and an uneven pale lip remain at the exit. These illustrate uncut polymer, not glass-fibre reinforcement.",
          ),
          t(
            "Перевірте гостроту й зазор інструмента, підтримку вихідного краю та відведення довгої стружки. Випробуйте придатну геометрію на зразку тієї самої партії; знімайте ворс контрольовано, не обпалюйте деталь полум’ям.",
            "Check tool sharpness and clearance, support at the exit edge and evacuation of long chips. Trial suitable geometry on the same material batch; remove fuzz in a controlled operation, never by flaming the part.",
          ),
        ),
        problem(
          "springback",
          t("Відновлення форми після затиску", "Shape recovery after release"),
          t(
            "Суцільний контур відхилений від пунктирного кола порівняння. Відхилення перебільшене; картинка не дає величини пружного відновлення або усадки.",
            "The solid outline departs from the dashed comparison circle. Deviation is exaggerated; the image gives no value for recovery or shrinkage.",
          ),
          t(
            "Порівняйте розмір у затиску та після розкріплення й термостабілізації. Виміряйте кілька перерізів малим зусиллям; зафіксуйте стан вологості, поліпшіть підтримку й зменште деформацію від затиску до повторної обробки.",
            "Compare dimensions while clamped and after release and temperature stabilisation. Measure several sections with low force; record moisture condition, improve support and reduce clamping distortion before another trial.",
          ),
        ),
      ],
    },
    "cast-iron": {
      finish: t(
        "Матова зерниста поверхня з дрібним рівним слідом. Темні включення можуть бути графітом; за малюнком не діагностують пористість чи тріщини.",
        "A matt granular surface with a fine even trace. Dark inclusions may be graphite; the illustration cannot diagnose porosity or cracking.",
      ),
      problems: [
        problem(
          "crumble",
          t("Викришування вихідного краю", "Chipping at the exit edge"),
          t(
            "Крихкі уламки й невеликі відколи порушують край. Це відрізняється від тягучої загнутої задирки міді або алюмінію.",
            "Brittle fragments and small chips interrupt the edge. This differs from the ductile folded burr of copper or aluminium.",
          ),
          t(
            "Перевірте підтримку виходу, цілісність кромки інструмента та заплановану фаску. Відпрацюйте напрямок і вихід проходу на зразку; видаліть вільні частинки й перевірте, чи відколи не заходять у функціональну поверхню.",
            "Check exit support, cutting-edge condition and the planned chamfer. Qualify pass direction and exit on a sample; remove loose particles and establish whether chips extend into a functional surface.",
          ),
        ),
        problem(
          "dust",
          t(
            "Пил і крихта приховують поверхню",
            "Dust and crumbs hide the surface",
          ),
          t(
            "Сіра крихта лежить на грані й накопичується біля краю. Це осілий матеріал, а не зображення безпечної концентрації пилу в повітрі.",
            "Grey crumbs lie on the face and collect at the edge. This shows settled material, not a safe airborne dust concentration.",
          ),
          t(
            "Застосуйте передбачене для цього процесу видалення пилу; не роздувайте його відкритим повітряним струменем. Очистіть і повторно огляньте поверхню та вимірювальні бази. Не приймайте забруднену деталь за виміром поверх крихти.",
            "Use the dust-control method specified for the process; do not disperse dust with an open air jet. Clean and re-examine the face and measuring datums. Never accept a dimension measured over debris.",
          ),
        ),
      ],
    },
    titanium: {
      finish: t(
        "Послідовний слід без грубих налипань. Однорідний сірий колір не підтверджує допустиму температуру або відсутність пошкодження.",
        "A consistent trace without heavy adhesion. Uniform grey colour establishes neither acceptable temperature nor absence of damage.",
      ),
      problems: [
        problem(
          "gall",
          t("Адгезія й задири", "Adhesion and scoring"),
          t(
            "Блискучі налиплі острівці й глибші розтягнуті борозни переривають слід. Схоже пошкодження потребує огляду кромки та процесу.",
            "Bright adhered islands and deeper dragged grooves interrupt the trace. This kind of damage calls for inspection of the edge and process.",
          ),
          t(
            "Зупиніть пробу й огляньте знос, налипання та подачу сумісної охолоджувальної рідини. Перевірте дані для конкретного титанового сплаву, інструмента й жорсткості установки; відновіть кромку до наступного проходу. Стружку збирайте за окремим планом пожежної безпеки.",
            "Stop the trial and inspect wear, adhesion and compatible coolant delivery. Check data for the exact titanium alloy, tool and setup rigidity; restore the edge before another pass. Collect chips under the separate fire-safety plan.",
          ),
        ),
        problem(
          "tint",
          t(
            "Зміна кольору: привід для перевірки",
            "Colour change: a reason to investigate",
          ),
          t(
            "Золота, фіолетова й синя зона ілюструє тонкоплівкове забарвлення. Послідовність кольорів тут умовна: це не термометр, не шкала й не критерій приймання.",
            "Gold, violet and blue illustrate thin-film colour. The sequence is representative: it is not a thermometer, a scale or an acceptance criterion.",
          ),
          t(
            "Зафіксуйте зміну й перевірте тепловкладення, подачу рідини, забруднення та стан інструмента. Рішення про придатність приймайте за вимогами деталі й погодженим методом контролю, а не за таблицею кольорів або спробою відполірувати пляму.",
            "Record the change and check heat input, fluid delivery, contamination and tool condition. Decide acceptance using the part requirements and an agreed inspection method, rather than a colour chart or polishing the stain away.",
          ),
        ),
      ],
    },
  };

function panelsFor(material: MaterialGuide): Panel[] {
  const example = examples[material.id];
  return [
    {
      pattern: "raw",
      state: "stock",
      title: t("До чистової обробки", "Before finishing"),
      observe: t(
        "Приклад поверхні після пиляння: нерівний крок рисок і залишені грубі сліди. Стан реального прокату, литва чи екструдованого прутка може бути іншим.",
        "A representative sawn face: uneven score spacing and coarse marks remain. Actual rolled, cast or extruded stock may have a different surface.",
      ),
      check: t(
        "Очистіть заготовку, перевірте марку й стан, знайдіть найглибші дефекти та підтвердьте достатній припуск до заданих баз і кінцевих розмірів.",
        "Clean the stock, verify its grade and condition, locate the deepest defects and establish sufficient allowance for the datums and final dimensions.",
      ),
    },
    {
      pattern: "finish",
      state: "reference",
      title: t("Рівномірний слід різання", "Consistent cutting trace"),
      observe: example.finish,
      check: t(
        "Порівнюйте з пробою, виконаною тим самим інструментом і процесом. Перевірте розміри у вільному стані; якщо на кресленні задано шорсткість, застосуйте визначений метод її контролю.",
        "Compare with a trial made using the same tool and process. Check dimensions in the free state; if the drawing specifies roughness, apply the specified inspection method.",
      ),
    },
    ...example.problems,
  ];
}

// Deterministic geometry keeps the illustrations stable across renders and offline.
function randomSequence(seed: number, count: number) {
  let value = seed;
  return Array.from({ length: count }, () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  });
}
const grain = randomSequence(719, 780);
const spots = randomSequence(432, 200);
const palette: Record<MaterialId, [string, string, string]> = {
  aluminium: ["#edf1f2", "#b8c1c7", "#7d8992"],
  "carbon-steel": ["#d6dce0", "#929fa9", "#606f7b"],
  stainless: ["#e6e9e9", "#a7b1b6", "#6e7b83"],
  brass: ["#f3dc94", "#c9a657", "#8c6c31"],
  copper: ["#f2b692", "#c17d59", "#854d36"],
  pom: ["#f8f9f5", "#e0e5df", "#adb7b0"],
  pa6: ["#f8f1d7", "#e3d9b4", "#b8aa7e"],
  "cast-iron": ["#939a99", "#626a6b", "#3c474a"],
  titanium: ["#d4d8d7", "#a2aaa8", "#697777"],
};

function SurfaceImage({
  material,
  panel,
  lang,
  large = false,
}: {
  material: MaterialGuide;
  panel: Panel;
  lang: Lang;
  large?: boolean;
}) {
  const id = `surface-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [light, mid, dark] = palette[material.id];
  const plastic = material.id === "pom" || material.id === "pa6";
  const cast = material.id === "cast-iron";
  const p = panel.pattern;
  const hole = ["burr", "breakout", "distort", "springback"].includes(p);
  const damagedEdge = p === "crumble";
  const path = damagedEdge
    ? "M28 28 H452 V240 L432 240 L428 230 L420 238 L409 229 L401 241 L390 234 L378 241 H28Z"
    : "M28 28H452V240H28Z";
  const title = `${panel.title[lang]} — ${material.name[lang]}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`se-surface${large ? " se-surface-large" : ""}`}
      viewBox="0 0 480 284"
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>
        {panel.observe[lang]}{" "}
        {say(
          lang,
          "Ілюстрація; контраст і дефекти збільшені. Масштаб не заданий.",
          "Illustration; contrast and defects are exaggerated. No scale is specified.",
        )}
      </desc>
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0.8">
          <stop offset="0" stopColor={light} />
          <stop offset=".22" stopColor={mid} />
          <stop offset=".48" stopColor={light} />
          <stop offset=".72" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${id}-lip`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={light} />
          <stop offset=".42" stopColor={light} />
          <stop offset=".55" stopColor={dark} />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
        <linearGradient id={`${id}-tint`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#a6aca9" stopOpacity="0" />
          <stop offset=".2" stopColor="#c8ab5e" stopOpacity=".7" />
          <stop offset=".44" stopColor="#936079" stopOpacity=".72" />
          <stop offset=".67" stopColor="#4e7393" stopOpacity=".75" />
          <stop offset="1" stopColor="#849a99" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-hole`} cx=".37" cy=".33" r=".74">
          <stop stopColor="#101d25" />
          <stop offset=".68" stopColor="#26363d" />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <filter id={`${id}-noise`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={cast ? ".32 .4" : ".71 .9"}
            numOctaves="3"
            seed="19"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id={`${id}-face`}>
          <path d={path} />
        </clipPath>
      </defs>
      <rect width="480" height="284" fill="#edf1f3" />
      <ellipse cx="246" cy="256" rx="204" ry="13" fill="#344652" opacity=".1" />
      <path d="M28 236H452V250H28Z" fill={dark} />
      <path d="M28 240H452V246H28Z" fill={mid} opacity=".4" />
      <path d={path} fill={`url(#${id}-metal)`} />
      <g clipPath={`url(#${id}-face)`}>
        <rect
          x="28"
          y="28"
          width="424"
          height="212"
          filter={`url(#${id}-noise)`}
          opacity={plastic ? ".055" : cast ? ".34" : ".12"}
        />
        {Array.from({ length: 80 }, (_, i) => {
          const y = 30 + i * 2.85;
          return p === "raw" ? (
            <path
              key={i}
              d={`M12 ${y + 32}L470 ${y - 40}`}
              stroke={i % 4 ? dark : light}
              strokeWidth={i % 6 ? ".6" : "1.8"}
              opacity={0.15 + grain[i] * 0.3}
            />
          ) : (
            <path
              key={i}
              d={`M12 ${y}Q206 ${y - 38} 470 ${y + 8}`}
              fill="none"
              stroke={i % 2 ? light : dark}
              strokeWidth={plastic ? ".55" : ".7"}
              opacity={cast ? ".19" : ".27"}
            />
          );
        })}
        {p !== "raw" &&
          Array.from({ length: 42 }, (_, i) => (
            <path
              key={`sweep-${i}`}
              d={`M${-166 + i * 14} 9Q${-54 + i * 14} 135 ${-166 + i * 14} 262`}
              fill="none"
              stroke={i % 3 === 0 ? dark : light}
              strokeWidth=".7"
              opacity={cast ? ".13" : plastic ? ".14" : ".24"}
            />
          ))}
        {Array.from({ length: cast ? 200 : 90 }, (_, i) => (
          <ellipse
            key={`grain-${i}`}
            cx={30 + grain[i * 3] * 420}
            cy={30 + grain[i * 3 + 1] * 208}
            rx={cast ? 0.6 + grain[i * 3 + 2] * 1.35 : 0.28}
            ry={cast ? 0.45 + grain[i * 3 + 2] : 0.17}
            fill={i % 5 ? dark : light}
            opacity={cast ? ".38" : ".28"}
          />
        ))}
        {p === "raw" &&
          Array.from({ length: 36 }, (_, i) => (
            <path
              key={`raw-${i}`}
              d={`M${42 + spots[i * 3] * 370} ${40 + spots[i * 3 + 1] * 175}l${5 + spots[i * 3 + 2] * 38} -7`}
              stroke={dark}
              strokeWidth={0.5 + spots[i * 3] * 1.4}
              opacity=".4"
            />
          ))}
        {(p === "smear" || p === "gall" || p === "melt") &&
          Array.from({ length: p === "melt" ? 14 : 27 }, (_, i) => {
            const x = 45 + spots[i * 4] * 340;
            const y = 50 + spots[i * 4 + 1] * 155;
            const w = 15 + spots[i * 4 + 2] * 58;
            const h = 4 + spots[i * 4 + 3] * 12;
            return (
              <g
                key={`smear-${i}`}
                transform={`translate(${x} ${y}) rotate(-9)`}
              >
                <path
                  d={`M0 0Q${w * 0.2} ${-h} ${w * 0.6} ${-h * 0.36}L${w} 0Q${w * 0.68} ${h} ${w * 0.3} ${h * 0.48}Z`}
                  fill={dark}
                  opacity={p === "melt" ? ".15" : ".48"}
                />
                <path
                  d={`M1 -1Q${w * 0.3} ${-h} ${w * 0.62} ${-h * 0.4}L${w - 3} -1Q${w * 0.6} ${h * 0.25} ${w * 0.25} ${h * 0.08}Z`}
                  fill={`url(#${id}-lip)`}
                  stroke={light}
                  strokeWidth=".45"
                />
                <path
                  d={`M${w * 0.18} ${h * 0.45}L${w * 0.72} ${h * 0.35}`}
                  stroke={dark}
                  strokeWidth=".65"
                  opacity=".8"
                />
              </g>
            );
          })}
        {(p === "gall" || p === "scores") &&
          Array.from({ length: p === "gall" ? 14 : 20 }, (_, i) => {
            const x = 40 + spots[i * 4] * 310;
            const y = 44 + spots[i * 4 + 1] * 180;
            const len = 22 + spots[i * 4 + 2] * 90;
            return (
              <g key={`score-${i}`}>
                <path
                  d={`M${x} ${y}l${len} ${-9 - spots[i * 4 + 3] * 15}`}
                  stroke={dark}
                  strokeWidth={p === "gall" ? "2" : "1.1"}
                  opacity=".85"
                />
                <path
                  d={`M${x} ${y - 1}l${len} ${-9 - spots[i * 4 + 3] * 15}`}
                  stroke={light}
                  strokeWidth=".75"
                  opacity=".9"
                />
              </g>
            );
          })}
        {p === "chatter" &&
          Array.from({ length: 26 }, (_, i) => (
            <g key={`chatter-${i}`}>
              <path
                d={`M${19 + i * 18} 18C${48 + i * 18} 77 ${-7 + i * 18} 167 ${29 + i * 18} 250`}
                fill="none"
                stroke={dark}
                strokeWidth="5.5"
                opacity=".35"
              />
              <path
                d={`M${24 + i * 18} 18C${53 + i * 18} 77 ${-2 + i * 18} 167 ${34 + i * 18} 250`}
                fill="none"
                stroke={light}
                strokeWidth="3.5"
                opacity=".5"
              />
              <path
                d={`M${19 + i * 18} 18C${48 + i * 18} 77 ${-7 + i * 18} 167 ${29 + i * 18} 250`}
                fill="none"
                stroke={dark}
                strokeWidth=".7"
                opacity=".28"
              />
            </g>
          ))}
        {p === "rub" && (
          <g>
            <path
              d="M44 135Q156 74 282 109T450 91V161Q363 181 280 154T44 181Z"
              fill={light}
              opacity=".65"
            />
            {Array.from({ length: 20 }, (_, i) => (
              <path
                key={`rub-${i}`}
                d={`M40 ${128 + i * 2}Q173 ${93 + i} 285 ${123 + i * 2}T455 ${112 + i * 2}`}
                fill="none"
                stroke={i % 3 ? light : mid}
                strokeWidth={i % 4 ? ".5" : "2"}
                opacity=".7"
              />
            ))}
            <path
              d="M46 171Q164 111 282 149T447 138"
              fill="none"
              stroke={dark}
              strokeWidth="1.5"
              opacity=".3"
            />
          </g>
        )}
        {p === "melt" && (
          <g>
            <path
              d="M34 220Q116 205 172 222T302 220T448 218L452 242H28Z"
              fill={`url(#${id}-lip)`}
            />
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={`melt-${i}`}
                d={`M${45 + i * 32} 227q13 -13 27 0t24 0`}
                fill="none"
                stroke={light}
                strokeWidth="2.6"
                opacity=".8"
              />
            ))}
          </g>
        )}
        {p === "tint" && (
          <path
            d="M45 79Q155 38 269 79T452 57V194Q326 222 221 182T28 201V91Z"
            fill={`url(#${id}-tint)`}
          />
        )}
        {(p === "dust" || p === "crumble") &&
          Array.from({ length: p === "dust" ? 125 : 24 }, (_, i) => {
            const x = 40 + grain[i * 4] * 398;
            const y =
              p === "dust"
                ? 37 + grain[i * 4 + 1] * 195
                : 209 + grain[i * 4 + 1] * 30;
            const size = 0.8 + grain[i * 4 + 2] * (p === "dust" ? 4 : 3);
            return (
              <g
                key={`dust-${i}`}
                transform={`translate(${x} ${y}) rotate(${grain[i * 4 + 3] * 180})`}
              >
                <path
                  d={`M0 0l${size} ${-size * 0.4}l${size * 0.8} ${size * 0.7}l${-size * 0.6} ${size}l${-size} ${-size * 0.2}Z`}
                  fill="#414a4a"
                />
                <path
                  d={`M0 0l${size} ${-size * 0.4}l${size * 0.8} ${size * 0.7}`}
                  fill="none"
                  stroke="#aab0aa"
                  strokeWidth=".45"
                />
              </g>
            );
          })}
      </g>
      <path d="M29 29H451" stroke={light} strokeWidth="1.3" opacity=".9" />
      <path d="M28 29V239" stroke={light} opacity=".65" />
      {hole && (
        <g>
          <ellipse
            cx="253"
            cy="133"
            rx={p === "distort" ? "62" : p === "springback" ? "63" : "57"}
            ry={p === "distort" ? "48" : p === "springback" ? "49" : "57"}
            transform={
              p === "distort" || p === "springback"
                ? "rotate(-17 253 133)"
                : undefined
            }
            fill={`url(#${id}-hole)`}
            stroke={dark}
            strokeWidth="2.4"
          />
          <path
            d="M208 118Q217 83 253 82Q290 82 305 117"
            stroke={dark}
            fill="none"
            strokeWidth="6"
            opacity=".7"
          />
          {p === "springback" && (
            <circle
              cx="253"
              cy="133"
              r="57"
              fill="none"
              stroke="#296686"
              strokeWidth="1.8"
              strokeDasharray="5 4"
            />
          )}
          {(p === "burr" || p === "breakout") &&
            Array.from({ length: 38 }, (_, i) => {
              const angle = (i / 38) * Math.PI * 2;
              const r1 = 56;
              const r2 = 60 + spots[i] * (p === "breakout" ? 13 : 9);
              const a2 = angle + 0.12;
              return (
                <path
                  key={`burr-${i}`}
                  d={`M${253 + Math.cos(angle) * r1} ${133 + Math.sin(angle) * r1}Q${253 + Math.cos(angle + 0.04) * (r2 + 3)} ${133 + Math.sin(angle + 0.04) * (r2 + 3)} ${253 + Math.cos(a2) * r2} ${133 + Math.sin(a2) * r2}L${253 + Math.cos(a2) * r1} ${133 + Math.sin(a2) * r1}Z`}
                  fill={`url(#${id}-lip)`}
                  stroke={dark}
                  strokeWidth=".6"
                />
              );
            })}
          {p === "breakout" && (
            <path
              d="M286 87l18 -12 7 15 14 6 -10 15 -10 14 -7 -21Z"
              fill={`url(#${id}-hole)`}
              stroke={dark}
              strokeWidth="1.5"
            />
          )}
          {p === "distort" && (
            <path
              d="M196 115Q193 77 228 72Q274 57 307 106"
              fill="none"
              stroke={`url(#${id}-lip)`}
              strokeWidth="7"
            />
          )}
        </g>
      )}
      {p === "fuzz" && (
        <g>
          <path
            d="M28 236Q155 228 258 238T451 235"
            fill="none"
            stroke={light}
            strokeWidth="7"
          />
          {Array.from({ length: 72 }, (_, i) => {
            const x = 33 + grain[i * 3] * 415;
            const len = 4 + grain[i * 3 + 1] * 22;
            return (
              <path
                key={`fuzz-${i}`}
                d={`M${x} 235q${-5 + grain[i * 3 + 2] * 14} ${len * 0.3} ${-8 + grain[i * 3 + 2] * 24} ${len}`}
                fill="none"
                stroke={i % 3 ? light : mid}
                strokeWidth={i % 4 ? ".85" : "1.5"}
              />
            );
          })}
        </g>
      )}
      {p === "crumble" &&
        Array.from({ length: 11 }, (_, i) => (
          <path
            key={`crumb-${i}`}
            d={`M${352 + i * 8} ${251 + spots[i] * 14}l4 -3 5 3 -3 4Z`}
            fill={dark}
            stroke={mid}
            strokeWidth=".5"
          />
        ))}
      <rect
        x="34"
        y="37"
        width="88"
        height="22"
        rx="3"
        fill="#f8fafb"
        fillOpacity=".86"
      />
      <text
        x="43"
        y="52"
        fill="#445564"
        fontSize="10.5"
        fontFamily="system-ui, sans-serif"
        letterSpacing=".7"
      >
        {say(lang, "ІЛЮСТРАЦІЯ", "ILLUSTRATION")}
      </text>
      <text
        x="450"
        y="270"
        textAnchor="end"
        fill="#5f6f7d"
        fontSize="10.5"
        fontFamily="system-ui, sans-serif"
      >
        {say(
          lang,
          "ознаки збільшено · без масштабу",
          "features exaggerated · no scale",
        )}
      </text>
    </svg>
  );
}

const chipNames: Record<Chip, Text> = {
  ribbon: t("Стрічка / спіраль", "Ribbon / helix"),
  segmented: t("Сегментована", "Segmented"),
  short: t("Короткі завитки", "Short curls"),
  dust: t("Крихта й пил", "Crumbs and dust"),
};
function ChipImage({
  type,
  material,
  lang,
}: {
  type: Chip;
  material: MaterialGuide;
  lang: Lang;
}) {
  const id = `chips-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [light, mid, dark] = palette[material.id];
  return (
    <svg viewBox="0 0 220 118" role="img" aria-label={chipNames[type][lang]}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={light} />
          <stop offset=".3" stopColor={mid} />
          <stop offset=".48" stopColor={light} />
          <stop offset=".65" stopColor={dark} />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
      </defs>
      <rect width="220" height="118" fill="#eef2f3" />
      <ellipse cx="112" cy="94" rx="79" ry="9" fill="#364953" opacity=".09" />
      {type === "ribbon" && (
        <g>
          {Array.from({ length: 5 }, (_, i) => (
            <path
              key={`back-${i}`}
              d={`M${40 + i * 30} 72C${27 + i * 30} 25 ${76 + i * 30} 23 ${68 + i * 30} 67`}
              fill="none"
              stroke={dark}
              strokeWidth="8"
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <g key={`front-${i}`}>
              <path
                d={`M${40 + i * 30} 72C${48 + i * 30} 104 ${81 + i * 30} 94 ${68 + i * 30} 67`}
                fill="none"
                stroke={`url(#${id})`}
                strokeWidth="10"
              />
              <path
                d={`M${37 + i * 30} 70C${47 + i * 30} 98 ${78 + i * 30} 91 ${67 + i * 30} 66`}
                fill="none"
                stroke={light}
                strokeWidth="1"
                opacity=".8"
              />
            </g>
          ))}
        </g>
      )}
      {type === "segmented" && (
        <g transform="translate(28 53) rotate(-9 82 5)">
          <path d="M0 13Q84 -35 166 11L165 29Q83 -13 0 31Z" fill={dark} />
          {Array.from({ length: 32 }, (_, i) => {
            const x = 2 + i * 5;
            const y = -10 + Math.pow((x - 83) / 83, 2) * 24;
            return (
              <path
                key={i}
                d={`M${x} ${y + 5}l3 -5 3 17 -4 5Z`}
                fill={`url(#${id})`}
                stroke={dark}
                strokeWidth=".45"
              />
            );
          })}
        </g>
      )}
      {type === "short" &&
        Array.from({ length: 13 }, (_, i) => (
          <g
            key={i}
            transform={`translate(${33 + spots[i * 4] * 150} ${25 + spots[i * 4 + 1] * 60}) rotate(${spots[i * 4 + 2] * 200})`}
          >
            <path
              d="M8 -7C-9 -14 -13 7 0 10C9 12 13 4 7 1"
              fill="none"
              stroke={dark}
              strokeWidth="6"
            />
            <path
              d="M8 -8C-9 -15 -13 6 0 9C9 11 13 3 7 0"
              fill="none"
              stroke={`url(#${id})`}
              strokeWidth="4.5"
            />
          </g>
        ))}
      {type === "dust" &&
        Array.from({ length: 125 }, (_, i) => {
          const x = 22 + grain[i * 4] * 175;
          const y = 21 + grain[i * 4 + 1] * 77;
          const s = 0.7 + grain[i * 4 + 2] * 4;
          return (
            <path
              key={i}
              d={`M${x} ${y}l${s} ${-s * 0.4}l${s * 0.7} ${s}l${-s} ${s * 0.7}Z`}
              fill={i % 4 ? "#596262" : "#969d98"}
              stroke="#3f4847"
              strokeWidth=".35"
            />
          );
        })}
    </svg>
  );
}

export default function SurfaceExamples({
  material,
  lang,
}: {
  material: MaterialGuide;
  lang: Lang;
}) {
  const panels = panelsFor(material);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const dialogHeading = useId();
  useEffect(() => {
    dialog.current?.close();
    setSelected(null);
    setZoom(false);
  }, [material.id]);
  useEffect(() => {
    if (selected !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [selected]);
  function close() {
    dialog.current?.close();
    setSelected(null);
    setZoom(false);
  }
  const active = selected === null ? null : panels[selected];
  return (
    <section className="surface-examples" aria-labelledby={headingId}>
      <div className="se-heading">
        <span className="se-eyebrow">
          {say(lang, "Порівняння результату", "Compare the result")}
        </span>
        <h2 id={headingId}>
          {say(lang, "Порівняйте поверхні", "Compare the surfaces")}
        </h2>
        <p>
          {say(
            lang,
            "Навчальні ілюстрації зі збільшеними ознаками, без масштабу. Порівняйте сліди інструмента, крайки й дефекти; приймальні розміри та шорсткість перевіряйте вимірюванням.",
            "Educational illustrations with exaggerated features, without a fixed scale. Compare tool marks, edges and defects; verify specified dimensions and roughness by measurement.",
          )}
        </p>
      </div>
      <div className="se-panels">
        {panels.map((panel, i) => (
          <article
            className={`se-panel se-panel-${panel.state}`}
            key={`${material.id}-${panel.pattern}`}
          >
            <div className="se-image-wrap">
              <SurfaceImage material={material} panel={panel} lang={lang} />
              <button
                className="se-enlarge"
                type="button"
                onClick={() => {
                  setSelected(i);
                  setZoom(false);
                }}
                aria-label={`${say(lang, "Збільшити", "Enlarge")}: ${panel.title[lang]}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                {say(lang, "Збільшити", "Enlarge")}
              </button>
            </div>
            <div className="se-panel-copy">
              <span className="se-status">
                {say(
                  lang,
                  panel.state === "stock"
                    ? "01 · Початковий стан"
                    : panel.state === "reference"
                      ? "02 · Орієнтир для порівняння"
                      : `${String(i + 1).padStart(2, "0")} · Потрібна перевірка`,
                  panel.state === "stock"
                    ? "01 · Starting condition"
                    : panel.state === "reference"
                      ? "02 · Comparison reference"
                      : `${String(i + 1).padStart(2, "0")} · Investigate`,
                )}
              </span>
              <h3>{panel.title[lang]}</h3>
              <p>{panel.observe[lang]}</p>
              <div className="se-next">
                <strong>
                  {say(lang, "Що перевірити / зробити", "Check / action")}
                </strong>
                <p>{panel.check[lang]}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="se-chips">
        <div className="se-chip-heading">
          <h3>
            {say(
              lang,
              "Форми стружки для порівняння",
              "Chip forms for comparison",
            )}
          </h3>
          <p>
            {say(
              lang,
              "Виділена форма — якісний орієнтир з опису цього матеріалу. Реальна стружка залежить від марки, геометрії інструмента, подачі й глибини різання; форма не прогнозує температуру або безпеку.",
              "The highlighted form is a qualitative reference from this material guide. Actual chips depend on grade, tool geometry, feed and depth of cut; their shape does not predict temperature or safety.",
            )}
          </p>
        </div>
        <div className="se-chip-grid">
          {(["ribbon", "segmented", "short", "dust"] as const).map((type) => (
            <figure
              className={`se-chip${material.appearance.chip === type ? " se-chip-selected" : ""}`}
              key={type}
            >
              <ChipImage type={type} material={material} lang={lang} />
              <figcaption>
                <strong>{chipNames[type][lang]}</strong>
                {material.appearance.chip === type && (
                  <span>
                    {say(
                      lang,
                      "Орієнтир цього матеріалу",
                      "This guide’s reference",
                    )}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="se-chip-note">
          {say(
            lang,
            "Порівнюйте лише після повної зупинки. Стружку прибирають передбаченим інструментом, а не руками; не утворюйте хмару дрібного пилу. Кольори й розміри стружки на ілюстрації умовні.",
            "Compare only after a complete stop. Remove chips using the specified equipment, not your hands; do not disperse fine dust into a cloud. Illustrated chip colours and sizes are representative.",
          )}
        </p>
      </div>
      <dialog
        ref={dialog}
        className="se-dialog"
        aria-labelledby={active ? dialogHeading : undefined}
        aria-label={
          active
            ? undefined
            : say(
                lang,
                "Збільшена ілюстрація поверхні",
                "Enlarged surface illustration",
              )
        }
        onCancel={close}
        onClose={() => {
          setSelected(null);
          setZoom(false);
        }}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        {active && (
          <div className="se-dialog-inner">
            <div className="se-dialog-toolbar">
              <div>
                <span className="se-eyebrow">{material.name[lang]}</span>
                <h2 id={dialogHeading}>{active.title[lang]}</h2>
              </div>
              <div className="se-dialog-actions">
                <button
                  type="button"
                  aria-pressed={zoom}
                  onClick={() => setZoom((value) => !value)}
                >
                  {zoom
                    ? say(lang, "Умістити", "Fit view")
                    : say(lang, "Детальніше · 2×", "Closer · 2×")}
                </button>
                <button type="button" autoFocus onClick={close}>
                  {say(lang, "Закрити", "Close")}{" "}
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </div>
            <div
              className={`se-dialog-viewport${zoom ? " se-dialog-zoom" : ""}`}
              tabIndex={0}
              aria-label={say(
                lang,
                "Збільшене зображення; за потреби прокрутіть",
                "Enlarged illustration; scroll as needed",
              )}
            >
              <SurfaceImage
                material={material}
                panel={active}
                lang={lang}
                large
              />
            </div>
            <div className="se-dialog-caption">
              <p>{active.observe[lang]}</p>
              <p>
                <strong>
                  {say(lang, "Що перевірити / зробити: ", "Check / action: ")}
                </strong>
                {active.check[lang]}
              </p>
              <small>
                {say(
                  lang,
                  "Ілюстрація зі збільшеними ознаками. Розмір, шорсткість і причину дефекту не визначають за цим зображенням.",
                  "Illustration with exaggerated features. Do not derive size, roughness or a defect’s cause from this image.",
                )}
              </small>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
