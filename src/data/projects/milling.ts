import type {
  BlockGeometry,
  ManufacturingOperation,
  ManufacturingSetup,
  Project,
  ProjectFeature,
  ProjectFixture,
  Source,
  Text,
} from "../types";
const t = (uk: string, en: string): Text => ({ uk, en });
type Pair = [string, string];
const p = (v: Pair) => t(...v);
const feature = (
  id: string,
  name: Pair,
  spec: string,
  nominal: number,
  lower: number,
  upper: number,
  datum: string,
  method: Pair,
  instrument: Pair,
  geometryRef?: string,
): ProjectFeature => ({
  id,
  name: p(name),
  spec,
  nominal,
  lower,
  upper,
  unit: "mm",
  datum,
  method: p(method),
  instrument: p(instrument),
  ...(geometryRef ? { geometryRef } : {}),
});
const op = (
  id: string,
  title: Pair,
  instruction: Pair,
  tool: Pair,
  allowance: Pair,
  inspection: Pair,
  featureIds: string[],
  stop: Pair,
): ManufacturingOperation => ({
  id,
  title: p(title),
  instruction: p(instruction),
  tool: p(tool),
  allowance: p(allowance),
  inspection: p(inspection),
  featureIds,
  stop: p(stop),
});
const mm = (v: number) => Number(v.toFixed(3)).toString();
const extMic: Pair = [
  "Зовнішній мікрометр відповідного діапазону, перевірений поблизу розміру; роздільність 0,001 мм не замінює оцінки похибки.",
  "Range-appropriate outside micrometer checked near size; 0.001 mm resolution does not replace an error assessment.",
];
const heightGauge: Pair = [
  "Повірена плита, висотомір і контрольні штифти відомого діаметра; для вузьких меж — координатна вимірювальна система.",
  "Verified surface plate, height gauge and known-diameter pins; use a coordinate measurement system for narrow limits.",
];
const boreGauge: Pair = [
  "Нутромір відповідного діапазону, встановлений за кільцем/мікрометром, або атестовані граничні пробки.",
  "Range-appropriate bore gauge mastered against a ring/micrometer, or verified limit plug gauges.",
];
const caliper: Pair = [
  "Перевірений штангенциркуль для попереднього розміру; остаточне рішення приймайте приладом з достатньою похибкою.",
  "Verified calipers for preliminary size; make final acceptance with an instrument whose error is sufficiently small.",
];
const faceTool: Pair = [
  "Коротка торцева фреза або кінцева фреза з придатною геометрією для цього сплаву.",
  "Short face mill or end mill with geometry suited to this alloy.",
];
const noUniversal: Pair = [
  "Глибину одного проходу, подачу й оберти підтвердіть для конкретної фрези, вильоту та верстата; наведений припуск — геометричний залишок, а не режим різання.",
  "Approve pass depth, feed and speed for the actual cutter, overhang and machine; the stated allowance is geometric stock, not a cutting schedule.",
];
const stopLift: Pair = [
  "Зупиніться за підйому деталі, руху лещат, вібрації, погіршення відведення стружки або втрати чистого контакту баз.",
  "Stop for work lift, vice movement, chatter, poor chip evacuation or loss of clean datum contact.",
];
const baseDatums = (w: number, d: number) => [
  {
    id: "A",
    description: t(
      "Нижня опорна площина, Z=0 після завершення габариту.",
      "Bottom support face, Z=0 after completing the envelope.",
    ),
  },
  {
    id: "B",
    description: t(
      "Передня поздовжня площина, Y=0; координати отворів відлічуються вглиб деталі.",
      "Front longitudinal face, Y=0; hole coordinates increase into the part.",
    ),
  },
  {
    id: "C",
    description: t(
      `Лівий торець, X=0. Габарит у плані ${w} × ${d} мм.`,
      `Left end, X=0. Plan envelope ${w} × ${d} mm.`,
    ),
  },
];
const envelope = (
  w: number,
  d: number,
  h: number,
  thicknessTolerance = 0.03,
): ProjectFeature[] => [
  feature(
    "F1",
    ["Довжина X", "X length"],
    `${w} ±0.05`,
    w,
    w - 0.05,
    w + 0.05,
    "C",
    [
      "Виміряйте біля обох поздовжніх країв після охолодження; перевірте також середину.",
      "Measure near both long edges after cooling; check the middle too.",
    ],
    w <= 100 ? extMic : caliper,
    "width",
  ),
  feature(
    "F2",
    ["Ширина Y", "Y width"],
    `${d} ±0.05`,
    d,
    d - 0.05,
    d + 0.05,
    "B",
    [
      "Повторіть вимірювання на обох торцях, не спираючи губки на фаски.",
      "Repeat at both ends without contacting chamfers.",
    ],
    extMic,
    "depth",
  ),
  feature(
    "F3",
    ["Товщина Z", "Z thickness"],
    `${h} ±${thicknessTolerance}`,
    h,
    h - thicknessTolerance,
    h + thicknessTolerance,
    "A",
    [
      "Контролюйте щонайменше чотири кути та центр; у протокол внесіть мінімум і максимум.",
      "Check at least the four corners and centre; record minimum and maximum.",
    ],
    extMic,
    "height",
  ),
  feature(
    "F4",
    [
      "Різнотовщинність між A та протилежною площиною",
      "Thickness variation between A and its opposite face",
    ],
    "max − min ≤0.03",
    0,
    0,
    0.03,
    "A",
    [
      "Порівняйте ті самі п’ять точок F3. Це операційна перевірка різнотовщинності, а не сертифікат повної площинності.",
      "Compare the same five F3 points. This is a process thickness-variation check, not a certification of full flatness.",
    ],
    extMic,
  ),
  feature(
    "F5",
    ["Відхилення B від перпендикуляра до A", "B-to-A squareness deviation"],
    "≤0.03 over checked face",
    0,
    0,
    0.03,
    "A",
    [
      "Поставте A на плиту; перевірте B відносно перевіреного кутника індикатором на доступній висоті. Вкажіть довжину контрольованої ділянки.",
      "Seat A on a surface plate; compare B with a verified square using an indicator over the accessible height. State the checked span.",
    ],
    [
      "Плита, контрольний кутник і індикатор; перевірені контакт і напрямок.",
      "Surface plate, reference square and indicator with verified contact and direction.",
    ],
  ),
];
const viceFixture = (): ProjectFixture => ({
  id: "vise",
  name: t(
    "Підготовлені машинні лещата та паралелі",
    "Prepared machine vice and parallels",
  ),
  kind: "vise",
  made: false,
  purpose: t(
    "Створення шести зовнішніх площин без використання брудної поверхні як точної бази.",
    "Create six external faces without treating a dirty raw face as a precision datum.",
  ),
  stock: t(
    "Справні лещата зі штатним кріпленням, придатні паралелі та торцевий упор.",
    "Sound vice with its approved mounting, suitable parallels and an end stop.",
  ),
  dimensions: t(
    "Передбачається відкриття губок не менше 130 мм. Висота паралелей вибирається за реальними губками: різальна площина вище губок, захват відповідає інструкції лещат.",
    "Assumes at least 130 mm jaw opening. Select parallel height for the actual jaws: cutting plane above jaws and grip compliant with the vice manual.",
  ),
  hardware: [
    t(
      "Штатні болти/лапи й Т-пазові гайки потрібного розміру; без саморобних підкладок під головки.",
      "Approved bolts/clamps and correctly sized T-nuts; no improvised packing beneath bolt heads.",
    ),
  ],
  manufacture: [],
  preparation: [
    t(
      "Ізолюйте обладнання для встановлення; очистіть стіл, низ лещат, напрямні й губки.",
      "Isolate for installation; clean the table, vice underside, ways and jaws.",
    ),
    t(
      "Закріпіть лещата за OEM; індикатором виставте нерухому губку вздовж X. Для цього маршруту ціль зміни показу ≤0,02 мм на 100 мм, якщо стан верстата дозволяє.",
      "Mount under the OEM procedure; indicate the fixed jaw along X. This route targets ≤0.02 mm change over 100 mm where machine condition permits.",
    ),
    t(
      "Перевірте паралелі на парність і задирки. Складіть пробне встановлення без фрези та перевірте контакт, захват і всі крайні положення.",
      "Check parallels for matched height and burrs. Trial the setup without a cutter and verify seating, grip and all travel extremes.",
    ),
  ],
  acceptance: [
    t(
      "Лещата не рухаються; заготовка не хитається й не піднімається при дозволеному затиску.",
      "The vice remains fixed; the work does not rock or lift under the permitted clamping procedure.",
    ),
    t(
      "Фреза, тримач і гайка мають перевірений зазор до губок, упора й болтів у всій траєкторії.",
      "The cutter, holder and nut have verified clearance to jaws, stop and bolts along the full path.",
    ),
  ],
});

/** Six physical remounts are explicit; no extra reorientation is hidden inside an operation. */
function sideEndSetups(w: number, d: number, h: number): ManufacturingSetup[] {
  const endTool: Pair = [
    `Кінцева фреза для бічного фрезерування цього сплаву; робоча довжина не менша ${mm(h + 2)} мм. У найнижчому положенні низ тримача вище верху деталі щонайменше на 5 мм; діаметр, виліт і весь габарит перевіряють окремо.`,
    `End mill suited to side milling this alloy, with at least ${mm(h + 2)} mm usable cutting length. At the lowest tool position the holder's lower envelope stays at least 5 mm above the work top; separately verify diameter, projection and the complete envelope.`,
  ];
  const endPrep = [
    t(
      "Очистіть A, B, паралелі та губки. A лежить горизонтально на парних опорах, B повністю торкається нерухомої губки; контрольний індикатор не показує підйому після затиску.",
      "Clean A, B, parallels and jaws. Keep A horizontal on matched supports with B seated against the fixed jaw; a check indicator must show no lift after clamping.",
    ),
    t(
      `Накресліть у плані реальні кінці губок, паралелей і корпусу лещат. Майбутній оброблений торець виступає щонайменше на 8 мм за відповідний кінець губок; паралелі не виступають у різальну зону. Виміряйте фактичну довжину й висоту захвату для деталі ${w} × ${d} × ${h} мм та звірте з інструкцією лещат.`,
      `Plot the actual jaw ends, parallels and vice body in plan. The intended finished end projects at least 8 mm beyond the relevant jaw end; parallels do not extend into the cutting zone. Measure actual grip length and height for the ${w} × ${d} × ${h} mm work and qualify them under the vice manual.`,
    ),
    t(
      `Для проходу через повну висоту ${h} мм задайте нижню точку фрези на 0,50 мм нижче A. Перевірте в цій точці робочу довжину ≥${mm(h + 2)} мм та низ тримача ≥5 мм над верхом деталі. Сухий обхід охоплює всю ширину ${d} мм, підхід і вихід; зазор до губок, корпусу, упора й опор перевіряють повним габаритом.`,
      `For the full ${h} mm end height place the cutter bottom 0.50 mm below A. At this position verify usable cutting length ≥${mm(h + 2)} mm and the holder's lower envelope ≥5 mm above the work top. Dry-check the entire ${d} mm width, approach and exit, using the complete envelope against jaws, body, stop and supports.`,
    ),
    t(
      "Якщо підтвердженого захвату, опори або простору для фрези/тримача немає, це встановлення непридатне для цих лещат. Потрібне окремо спроєктоване оснащення; не ставте вузьку деталь вертикально як імпровізовану заміну.",
      "If grip, support or tool/holder clearance cannot be qualified, this setup is unavailable with this vice. Use separately designed workholding rather than standing a narrow part upright as an improvised substitute.",
    ),
    p(noUniversal),
  ];
  const common = {
    machine: t(
      "Ручний фрезерний із перевіреним DRO або ЧПУ в дозволеному режимі налаштування.",
      "Manual mill with verified DRO or CNC in its permitted setup mode.",
    ),
    workholding: t(
      "A горизонтально на паралелях; B до нерухомої губки. Затиснута масивна ділянка підтримана, а короткий оброблюваний кінець виступає за кінець губок. Довжину й висоту фактичного захвату кваліфікують для конкретних лещат.",
      "A horizontal on parallels, B against the fixed jaw. Support the gripped solid region while the short machined end projects beyond the jaw end. Qualify actual engagement length and height for the specific vice.",
    ),
    fixtureIds: ["vise"],
    preparation: endPrep,
    release: t(
      "Повністю зупиніть шпиндель і виконайте потрібну ізоляцію. Приберіть стружку щіткою, підтримайте деталь і лише потім відпустіть губки.",
      "Stop the spindle completely and apply required isolation. Brush away chips, support the work and only then release the jaws.",
    ),
  };
  return [
    {
      ...common,
      id: "S50",
      title: t(
        "Торець C при горизонтальній A",
        "Create end C with A horizontal",
      ),
      purpose: t(
        "Створити торцеву базу C бічним фрезеруванням короткого лівого виступу без високого вертикального встановлення.",
        "Create end datum C by side milling a short left-hand projection while retaining horizontal support.",
      ),
      orientation: t(
        "A вниз горизонтально; B до нерухомої губки. Майбутній C — лівий відкритий торець за лівим кінцем губок. Напрямок X залишається вздовж B, Y — від B углиб деталі.",
        "A down and horizontal, B against the fixed jaw. Future C is the exposed left end beyond the left jaw end. X remains along B and Y increases from B into the work.",
      ),
      datums: t(
        "A задає висоту й горизонтальність, B — напрямок X та Y=0. C ще не готовий: заплануйте чистову площину, залишивши щонайменше 2,00 мм на протилежному сирому торці; X=0 стає фізичною базою після приймання C.",
        "A establishes height and horizontal seating; B establishes the X direction and Y=0. C is unfinished: plan its finish plane while preserving at least 2.00 mm on the opposite raw end; X=0 becomes a physical datum after accepting C.",
      ),
      operations: [
        op(
          "OP10",
          ["План C та чорновий лівий торець", "Plan C and rough the left end"],
          [
            `За дотиком/щупом визначте фактичну нерівність лівого сирого торця. Заплануйте C так, щоб прибрати її та зберегти від C до протилежного торця не менше ${mm(w + 2)} мм. Чистова площина C має бути щонайменше на 8 мм лівіше кінця губок. Після перевірки обробіть торець до X=−0,20 мм від запланованого C; проходи по висоті й радіальне врізання вибирають для фактичної фрези.`,
            `Probe or touch off the actual irregular left raw end. Plan C to clean it while preserving at least ${mm(w + 2)} mm from C to the opposite raw end. The finished C plane must lie at least 8 mm left of the jaw end. After checking, rough to X=−0.20 mm relative to planned C; select vertical passes and radial engagement for the actual cutter.`,
          ],
          endTool,
          [
            "На C залишається 0,20 мм у напрямку +X; на протилежному торці — щонайменше 2,00 мм сумарного залишку довжини.",
            "Retain 0.20 mm on C to remove towards +X, plus at least 2.00 mm of overall-length stock at the opposite end.",
          ],
          [
            "Після зупинки перевірте суцільний слід, залишок довжини та фактичний захват; обидва проходи виконуються в цьому самому затиску.",
            "After stopping check continuous clean-up, remaining length and actual grip; both cutting stages remain in this clamping.",
          ],
          ["F1", "F5"],
          stopLift,
        ),
        op(
          "OP20",
          [
            "Чистова база C без перестановки",
            "Finish datum C without remounting",
          ],
          [
            "Зніміть виміряний залишок до запланованої площини C бічною поверхнею фрези, зберігаючи A/B. Завершіть всю висоту й ширину торця без сходинки; не відпускайте губки між чорновим і чистовим проходами. Після зупинки прийміть чисту площину як X=0.",
            "Remove the measured remainder to planned C using the cutter flank while retaining A/B. Finish the entire end height and width without a step; retain the clamping between roughing and finishing. After stopping accept the clean face as X=0.",
          ],
          endTool,
          [
            "Знімають залишені 0,20 мм на цій площині; готову довжину ще не одержують.",
            "Remove the retained 0.20 mm on this face; overall length is not yet finished.",
          ],
          [
            "Перевірте C відносно A/B кутником/індикатором як операційну базу; окремо переконайтеся, що затиск не змінив контроль F5 між A та B.",
            "Check C against A/B with a square/indicator as a process datum; separately confirm clamping has not changed the F5 A-to-B check.",
          ],
          ["F1", "F5"],
          [
            "Зупиніться за сходинки, вібрації, забою C або недостатнього залишку на протилежному кінці.",
            "Stop for a step, chatter, damage to C or insufficient stock at the opposite end.",
          ],
        ),
        op(
          "OP30",
          ["Приймання C і підготовка зсуву", "Accept C and prepare the shift"],
          [
            `Після повної зупинки перевірте C, позначте його на неконтактній ділянці та виміряйте фактичну довжину до сирого протилежного торця: потрібно ≥${mm(w + 2)} мм. Після звільнення зніміть лише виступаючі задирки на ребрах C, очистіть A/B/C і повторіть F5. Наступний зсув і новий затиск виконують тільки у S60.`,
            `After a full stop inspect C, identify it on a noncontact area and measure actual length to the opposite raw end: require ≥${mm(w + 2)} mm. After release remove only raised C-edge burrs, clean A/B/C and repeat F5. Perform the next shift and new clamping only in S60.`,
          ],
          [
            "Перевірений кутник, індикатор, прилад довжини й ручний дебурер.",
            "Verified square, indicator, length instrument and hand deburring tool.",
          ],
          [
            "C зберігають як плоску базу; фаска лише на ребрі, без округлення вимірювальної площини.",
            "Preserve C as a flat datum; break the edge without rounding the measuring face.",
          ],
          [
            "Запишіть залишок довжини та стан A/B/C; координата попереднього затиску не переноситься автоматично.",
            "Record remaining length and A/B/C condition; the previous clamping coordinate does not transfer automatically.",
          ],
          ["F1", "F5"],
          [
            "Не продовжуйте за втрати контакту A/B або якщо очищення C вичерпало припуск протилежного торця.",
            "Do not proceed if A/B seating is lost or C clean-up consumed the opposite-end allowance.",
          ],
        ),
      ],
      inspection: [
        t(
          `C прийнятий як X=0; фактична довжина після очищення не менша ${mm(w + 2)} мм. F5 перевірено у вільному стані.`,
          `Accept C as X=0; actual clean-up length is at least ${mm(w + 2)} mm. Check F5 in the free state.`,
        ),
      ],
      transfer: t(
        "Зберігаючи A вниз і B до нерухомої губки, змістіть деталь у S60 до обробки правого кінця. Перед новим затиском очистіть A/B/C, паралелі й упор.",
        "Retaining A down and B against the fixed jaw, shift the work in S60 for the right end. Before the new clamping clean A/B/C, parallels and the stop.",
      ),
      diagram: {
        view: "milling",
        clamping: "vise",
        flip: false,
        datumA: "bottom",
        toolApproach: "left",
        highlight: t(
          "A горизонтально; C обробляється зліва за кінцем губок.",
          "A horizontal; machine C beyond the left jaw end.",
        ),
      },
    },
    {
      ...common,
      id: "S60",
      title: t(
        "Готова довжина при горизонтальній A",
        "Finish length with A horizontal",
      ),
      purpose: t(
        "Завершити протилежний до C торець у новому затиску з тією самою орієнтацією A/B.",
        "Finish the end opposite C in a new clamping while retaining the same A/B orientation.",
      ),
      orientation: t(
        "A вниз горизонтально; B до нерухомої губки. Змістіть деталь уздовж X: майбутній правий готовий торець виступає щонайменше на 8 мм за правий кінець губок. C контактує з відрегульованим штатним торцевим упором.",
        "A down and horizontal, B against the fixed jaw. Shift along X so the future finished right end projects at least 8 mm beyond the right jaw end. Seat C against an adjusted approved end stop.",
      ),
      datums: t(
        `Після зсуву відновіть X=0 від фізичного C щупом або кваліфікованим переносом від його упора, Y=0 від B та висоту від A/верху. Готовий протилежний торець — X=${w} мм; не зберігайте попередній машинний X0 без повторної прив’язки.`,
        `After shifting recover X=0 from physical C using a probe or a qualified transfer from its stop, Y=0 from B and height from A/top. The finished opposite end is X=${w} mm; re-establish the origin rather than retaining the previous machine X0.`,
      ),
      operations: [
        op(
          "OP10",
          ["Новий затиск і чорнова довжина", "Reclamp and rough the length"],
          [
            `Виставте упор C так, щоб площина X=${w} мм була щонайменше на 8 мм правіше кінця губок; виміряйте захват і повторіть обхід фрези та тримача. Незалежно перевірте відновлений X0 від C. Бічним фрезеруванням обробіть правий торець до фактичної довжини ${mm(w + 0.2)} мм, зберігаючи A/B та цей затиск.`,
            `Set the C stop so the X=${w} mm plane lies at least 8 mm right of the jaw end; measure engagement and repeat cutter/holder clearance checks. Independently check the recovered C-based X0. Side mill the right end to actual length ${mm(w + 0.2)} mm while retaining A/B and this clamping.`,
          ],
          endTool,
          [
            "На протилежному до C торці залишається 0,20 мм у напрямку −X до готового розміру.",
            "Retain 0.20 mm on the end opposite C, to remove towards −X to final size.",
          ],
          [
            "Перевірте контакт C з упором, відсутність підйому A та фактичну довжину доступним приладом. Якщо затиск закриває вимірювальні контакти, контроль після звільнення планують як остаточний, без прихованого повторного затиску.",
            "Check C-to-stop seating, absence of A lift and actual length with an accessible instrument. If the clamping obscures measuring contacts, plan released-part inspection as final acceptance without an unrecorded reclamping.",
          ],
          ["F1", "F5"],
          stopLift,
        ),
        op(
          "OP20",
          ["Довести довжину від C", "Finish length from C"],
          [
            `У тому самому затиску доведіть протилежний торець до X=${w} мм, цільової довжини ${mm(w)} мм у полі F1. Розмір визначає відновлена фізична C та перевірений лінійний рух; доступне проміжне вимірювання застосуйте до останньої поправки. За відсутності доступу не відпускайте деталь для прихованого циклу «виміряв — затиснув»: остаточне рішення буде після OP30.`,
            `In the same clamping finish the opposite end at X=${w} mm, targeting ${mm(w)} mm overall length within F1. Use recovered physical C and verified linear travel; where accessible, measure before the final correction. If access is unavailable, retain the clamping and make the final acceptance decision after OP30 rather than adding an unrecorded measure/reclamp cycle.`,
          ],
          endTool,
          [
            "Фінішний залишок визначають вимірюванням/перевіреною прив’язкою; ціль — середина поля F1, без довільного додаткового проходу.",
            "Determine finishing stock from measurement/verified datum recovery; target the middle of F1 without an arbitrary extra pass.",
          ],
          [
            "Після зупинки перевірте суцільний торець, відсутність сходинки та незмінність базових контактів.",
            "After stopping check the complete end, absence of a step and unchanged datum seating.",
          ],
          ["F1", "F5"],
          [
            "Зупиніться за зміщення C від упора, втрати прив’язки або невідомої похибки лінійного руху щодо F1.",
            "Stop for C moving from its stop, lost datum recovery or linear-motion error unsuitable for F1.",
          ],
        ),
        op(
          "OP30",
          [
            "Вільний контроль довжини та баз",
            "Free-state length and datum inspection",
          ],
          [
            `Після зупинки та дозволеного звільнення очистіть деталь, зніміть лише задирки торцевих ребер і дайте їй стабілізуватися. Виміряйте від C до протилежного торця біля обох поздовжніх країв та посередині, ціль ${mm(w)} мм, межі ${mm(w - 0.05)}…${mm(w + 0.05)} мм. Повторіть F5 між A та B; запишіть кожне значення.`,
            `After stopping and permitted release clean the work, remove only end-edge burrs and let it stabilise. Measure from C to the opposite end near both longitudinal edges and at the centre, targeting ${mm(w)} mm within ${mm(w - 0.05)}…${mm(w + 0.05)} mm. Repeat F5 between A and B and record every reading.`,
          ],
          [
            "Зовнішній мікрометр відповідного діапазону, перевірений кутник/індикатор і чиста плита.",
            "Range-appropriate outside micrometer, verified square/indicator and clean surface plate.",
          ],
          [
            "До приймання вимірів матеріал більше не знімають; корекція після звільнення потребує окремо записаного нового встановлення.",
            "Remove no more stock until readings are accepted; a correction after release requires a separately recorded new setup.",
          ],
          [
            "F1 приймають за вільною деталлю, F5 — від A/B. Точність не підтверджується лише показом DRO.",
            "Accept F1 on the free part and F5 from A/B; the DRO display alone does not establish accuracy.",
          ],
          ["F1", "F5"],
          [
            "За невиконання F1/F5 зупиніть випуск і сплануйте окреме відновлення баз; не приховуйте перестановку в цій операції.",
            "If F1/F5 fail, stop release and plan a separate datum-recovery setup; do not hide a remount inside this operation.",
          ],
        ),
      ],
      inspection: [
        t(
          "F1 перевірено в кількох місцях у вільному стані, F5 повторено; A/B/C очищені й прийняті перед обробкою інших елементів.",
          "Check F1 at several free-state locations and repeat F5; clean and accept A/B/C before machining the remaining features.",
        ),
      ],
      transfer: t(
        "Перенесіть прийняту деталь на оснащення функціональних елементів. Від фізичних A/B/C незалежно відновіть X/Y/Z; затиск S60 більше не є джерелом нуля.",
        "Transfer the accepted part to functional-feature workholding. Independently recover X/Y/Z from physical A/B/C; the S60 clamping is no longer the origin source.",
      ),
      diagram: {
        view: "milling",
        clamping: "vise",
        flip: false,
        datumA: "bottom",
        toolApproach: "right",
        highlight: t(
          "A горизонтально; протилежний C торець справа за кінцем губок.",
          "A horizontal; machine the opposite end beyond the right jaw end.",
        ),
      },
    },
  ];
}

function squareStock(w: number, d: number, h: number): ManufacturingSetup[] {
  const stages = [
    {
      id: "S10",
      name: ["Перша площина A", "First datum face A"] as Pair,
      orientation: [
        "Майбутня A зверху; необроблена протилежна площина спирається на перевірені опори.",
        "Future A faces up; the opposite raw face seats on verified supports.",
      ] as Pair,
      datums: [
        "Поки баз немає. Позначте майбутні A/B/C та припуски до затиску.",
        "No finished datum yet. Identify intended A/B/C and stock allowances before clamping.",
      ] as Pair,
      dimension: h,
      featureIds: ["F3", "F4"],
      isFirst: true,
    },
    {
      id: "S20",
      name: ["Площина B перпендикулярно A", "Face B square to A"] as Pair,
      orientation: [
        "Поверніть заготовку на 90°: A до нерухомої губки, майбутня B зверху.",
        "Rotate the blank 90°: A against the fixed jaw, future B facing up.",
      ] as Pair,
      datums: [
        "Чиста A задає орієнтацію; допустиму компенсаційну опору біля рухомої губки застосуйте за процедурою лещат.",
        "Clean A establishes orientation; use an approved compensating contact at the moving jaw under the vice procedure.",
      ] as Pair,
      dimension: d,
      featureIds: ["F2", "F5"],
      isFirst: true,
    },
    {
      id: "S30",
      name: [
        "Товщина: протилежна площина до A",
        "Thickness: face opposite A",
      ] as Pair,
      orientation: [
        "A вниз на парні паралелі; B до нерухомої губки. Протилежна A площина зверху.",
        "A down on matched parallels; B against the fixed jaw. The face opposite A is up.",
      ] as Pair,
      datums: [
        "A — опора, B — напрямок; не притискайте до випадкового задирка на C.",
        "A supports and B orients; do not locate against an arbitrary burr on C.",
      ] as Pair,
      dimension: h,
      featureIds: ["F3", "F4"],
      isFirst: false,
    },
    {
      id: "S40",
      name: [
        "Ширина: протилежна площина до B",
        "Width: face opposite B",
      ] as Pair,
      orientation: [
        "A до нерухомої губки; B вниз на паралелі; протилежна B площина зверху.",
        "A against the fixed jaw; B down on parallels; the face opposite B is up.",
      ] as Pair,
      datums: [
        "Зберігайте контакт A та B; це нове встановлення, висоту інструмента визначте повторно.",
        "Maintain A and B seating; this is a new setup, so re-establish tool height.",
      ] as Pair,
      dimension: d,
      featureIds: ["F2", "F5"],
      isFirst: false,
    },
    {
      id: "S50",
      name: ["Створення торцевої бази C", "Create end datum C"] as Pair,
      orientation: [
        "Майбутній C зверху; A до нерухомої губки, B до перевіреного бічного контакту.",
        "Future C faces up; A against the fixed jaw and B against a verified side contact.",
      ] as Pair,
      datums: [
        "A і B задають два перпендикулярні напрямки; упор не повинен заважати повному контакту A.",
        "A and B establish perpendicular directions; the stop must not prevent full A contact.",
      ] as Pair,
      dimension: w,
      featureIds: ["F1", "F5"],
      isFirst: true,
    },
    {
      id: "S60",
      name: [
        "Довжина: протилежний до C торець",
        "Length: face opposite C",
      ] as Pair,
      orientation: [
        "C вниз на опори; A до нерухомої губки, B до бічного контакту; протилежний C торець зверху.",
        "C down on supports; A against the fixed jaw and B against the side contact; the opposite end faces up.",
      ] as Pair,
      datums: [
        "Чисті C/A/B відновлюють положення; не використовуйте напис маркером як контактну поверхню.",
        "Clean C/A/B recover location; keep marker ink away from contact surfaces.",
      ] as Pair,
      dimension: w,
      featureIds: ["F1", "F5"],
      isFirst: false,
    },
  ];
  return [
    ...stages.slice(0, 4).map<ManufacturingSetup>((stage, i) => ({
      id: stage.id,
      title: p(stage.name),
      machine: t(
        "Ручний фрезерний верстат із перевіреним DRO або ЧПУ в дозволеному режимі налаштування.",
        "Manual mill with verified DRO or CNC in its permitted setup mode.",
      ),
      purpose: t(
        i === 0
          ? "Створити першу відтворювану базу без надмірного зняття припуску."
          : `Виконати окреме встановлення ${i + 1}/6 для узгоджених зовнішніх баз та габариту.`,
        i === 0
          ? "Create the first repeatable datum without consuming excessive stock."
          : `Complete remount ${i + 1}/6 for the agreed envelope and external datums.`,
      ),
      orientation: p(stage.orientation),
      datums: p(stage.datums),
      workholding: t(
        "Лещата з чистими губками та опорами; затиск направлений у підтриману масивну ділянку. Перевірте реальний захват до пробного руху.",
        "Vice with clean jaws and supports; direct clamping into supported solid material. Verify actual engagement before a trial move.",
      ),
      fixtureIds: ["vise"],
      preparation: [
        t(
          "Видаліть лише задирки на опорних ребрах; очистіть контактні площини та перевірте відсутність хитання.",
          "Remove only seating-edge burrs; clean contact faces and check for rocking.",
        ),
        t(
          "Після зміни положення заново прив’яжіть відкриту площину й перевірте хід над губками та упором.",
          "After reorientation, locate the exposed face again and check travel above jaws and the stop.",
        ),
        p(noUniversal),
      ],
      operations: [
        op(
          "OP10",
          [
            "Перевірка встановлення та чорнова площина",
            "Verify the setup and rough the face",
          ],
          [
            stage.isFirst
              ? `Знімайте нерівність поверхні до суцільного сліду. Зі стартового припуску зберігайте щонайменше 2,0 мм на сумарний розмір ${stage.dimension} мм до фінішу протилежної площини; виміряйте залишок, не припускайте його за ходом маховика.`
              : `Виміряйте фактичну відстань від бази до відкритої площини. Обробляйте до ${mm(stage.dimension + 0.2)} мм, залишаючи 0,20 мм на цій площині; нуль задавайте від фізичної бази, а не від необробленого верху.`,
            stage.isFirst
              ? `Remove surface irregularity until a continuous cut appears. From the initial stock, preserve at least 2.0 mm on the overall ${stage.dimension} mm dimension before finishing the opposing face; measure what remains rather than inferring it from the handwheel.`
              : `Measure the actual base-to-exposed-face distance. Machine to ${mm(stage.dimension + 0.2)} mm, leaving 0.20 mm on this face; reference the physical datum rather than the raw top.`,
          ],
          faceTool,
          [
            "Для першої бази — лише очищення; для розмірної площини — 0,20 мм на фініш.",
            "First datum: clean-up only; sizing face: retain 0.20 mm for finishing.",
          ],
          [
            "Після зупинки перевірте фактичний залишок і контакт опор; різнотовщинність не компенсуйте силою затиску.",
            "After stopping, check actual stock and support contact; do not correct thickness variation with clamping force.",
          ],
          stage.featureIds,
          stopLift,
        ),
        op(
          "OP20",
          [
            "Чистова площина в тому самому затиску",
            "Finish the face without releasing",
          ],
          [
            stage.isFirst
              ? "Виконайте легкий суцільний чистовий прохід по всій базі. Не відпускайте затиск між чорновою та чистовою площиною; залиште припуск на протилежній стороні."
              : `Зніміть частину залишку, виміряйте після зупинки й доведіть розмір до ${stage.dimension} мм у середині його поля допуску. Сумарне зняття визначайте вимірюванням; поправка на радіус/діаметр шкали тут не застосовується до лінійної осі.`,
            stage.isFirst
              ? "Make a light continuous finish pass across the entire datum. Do not release between roughing and finishing; preserve stock on the opposite face."
              : `Remove part of the remainder, measure after stopping, and finish to ${stage.dimension} mm near the middle of its tolerance interval. Determine total removal from measurement; a lathe radius/diameter dial convention does not apply to this linear axis.`,
          ],
          faceTool,
          [
            "Залишок перед останнім проходом вимірюють; фініш — до цільового розміру, без «ще одного» проходу навмання.",
            "Measure stock before the last pass; finish to target without an arbitrary extra pass.",
          ],
          [
            "Перевірте слід обробки, відсутність сходинки між доріжками та доступний розмір у кількох місцях.",
            "Check the finish trace, absence of steps between tracks and accessible size at several points.",
          ],
          stage.featureIds,
          [
            "Зупиніться, якщо чистовий прохід повторює хвилю, розмір змінюється після охолодження або фреза торкається оснащення.",
            "Stop if finishing reproduces waviness, size drifts after cooling or the cutter contacts workholding.",
          ],
        ),
        op(
          "OP30",
          [
            "Контроль, кромки й запис бази",
            "Inspect, deburr edges and record the datum",
          ],
          [
            "Повністю зупиніть шпиндель. Перевірте доступні вимоги, зніміть дрібний задирок із ребер поза верстатом і запишіть позначення обробленої площини. Не округлюйте саму вимірювальну базу.",
            "Stop the spindle completely. Check accessible requirements, remove small edge burrs off-machine and record the finished face identification. Do not round away the measuring datum.",
          ],
          [
            "Дебурер, дрібний камінь лише по задирку й відповідний вимірювальний інструмент.",
            "Deburring tool, fine stone on the burr only and suitable measuring equipment.",
          ],
          [
            "Фаска на некритичних ребрах орієнтовно 0,2–0,3 мм; функціональні контакти залишаються плоскими.",
            "Approximately 0.2–0.3 mm edge break on noncritical edges; functional contacts remain flat.",
          ],
          [
            "Результати та знак бази записані до зняття; після звільнення перевірте, чи не змінився розмір.",
            "Record results and datum identity before removal; recheck for dimensional change after release.",
          ],
          stage.featureIds,
          [
            "За нового задирка, забоїни чи зміни розміру після звільнення зупиніть маршрут і відновіть базу.",
            "Stop the route for a new burr, dent or dimensional change after release; restore the datum.",
          ],
        ),
      ],
      inspection: [
        t(
          `Контроль доступних вимог ${stage.featureIds.join(", ")}; точні довжини не оцінюють лише за DRO.`,
          `Check accessible requirements ${stage.featureIds.join(", ")}; do not accept precise lengths from the DRO alone.`,
        ),
      ],
      release: t(
        "Зупинка, дозволена ізоляція для роботи в небезпечній зоні, очищення щіткою; лише потім відпустіть затиск, підтримуючи деталь.",
        "Stop and apply the required isolation for entering a hazard zone, clean with a brush, then release while supporting the work.",
      ),
      transfer: t(
        i === 5
          ? "Усі A/B/C та габарити зафіксовані. Перенесіть на оснащення операційних елементів і незалежно відновіть X/Y/Z."
          : "Перед наступним поворотом очистіть і перевірте нову базу; записаний розмір не переносить нуль автоматично.",
        i === 5
          ? "A/B/C and the envelope are recorded. Transfer to feature-machining workholding and independently recover X/Y/Z."
          : "Clean and verify the new datum before the next turn; a recorded size does not transfer the origin automatically.",
      ),
      diagram: {
        view: "milling",
        clamping: "vise",
        flip: i > 0,
        datumA:
          i === 0 ? "top" : i === 1 ? "back" : i === 2 ? "bottom" : "back",
        toolApproach: "top",
        highlight: t(
          `Окремий затиск ${i + 1}: ${stage.name[0]}.`,
          `Separate clamp ${i + 1}: ${stage.name[1]}.`,
        ),
      },
    })),
    ...sideEndSetups(w, d, h),
  ];
}

function carrier(
  id: string,
  w: number,
  d: number,
  holes: BlockGeometry["holes"] = [],
): ProjectFixture {
  const fw = w + 40,
    fd = d + 40;
  return {
    id,
    name: t(
      "Виготовлена опорна плита з технологічними виходами",
      "Made support plate with tool-exit clearances",
    ),
    kind: "sacrificial-plate",
    made: true,
    purpose: t(
      "Підтримати A та забезпечити вихід свердла/фрези без контакту з паралелями чи столом.",
      "Support A and allow drill/cutter breakthrough without contacting parallels or the table.",
    ),
    stock: t(
      `Плита EN AW-6082-T6 ${fw + 4} × ${fd + 4} × 18 мм.`,
      `EN AW-6082-T6 plate ${fw + 4} × ${fd + 4} × 18 mm.`,
    ),
    dimensions: t(
      `${fw} × ${fd} × 15 мм. Деталь розташована зі зміщенням X=20, Y=20 мм. Центри технологічних виходів — координати деталі +20 мм.`,
      `${fw} × ${fd} × 15 mm. The work is offset X=20, Y=20 mm. Tool-exit centres equal part coordinates plus 20 mm.`,
    ),
    hardware: [
      t(
        "Штатні притиски бази поза контуром деталі; клас, довжину й допустимий момент болтів підтвердьте за каталогом кріплення.",
        "Approved base clamps outside the work contour; verify bolt class, length and permitted torque from the workholding catalogue.",
      ),
      t(
        "Низькі притиски деталі з опорами безпосередньо під зусиллям; не замінюйте їх лише торцевими упорами.",
        "Low work clamps with support directly under the force; end stops alone are not retention.",
      ),
    ],
    manufacture: [
      t(
        `Обріжте заготовку до ${fw + 4} × ${fd + 4} мм; зніміть задирки й створіть опорну нижню площину.`,
        `Saw to ${fw + 4} × ${fd + 4} mm, deburr and create the bottom support face.`,
      ),
      t(
        `Переверніть і доведіть товщину до 15,00 ±0,05 мм; різнотовщинність у зоні деталі — не більше 0,03 мм.`,
        `Reverse and finish thickness to 15.00 ±0.05 mm; thickness variation across the work zone must not exceed 0.03 mm.`,
      ),
      t(
        "Обробіть два суміжні боки як координатні бази, потім протилежні до габариту. Нанесіть X/Y та контур деталі зі зміщенням 20 мм.",
        "Machine two adjacent sides as coordinate datums, then the opposite sides to size. Mark X/Y and the part footprint at 20 mm offset.",
      ),
      t(
        holes.length
          ? "Прив’яжіть центри за таблицею деталі +20 мм та виконайте глухі виходи Ø(свердло+2) ×5 мм під кожним наскрізним отвором. Кромки опорної площини не піднімайте задирками."
          : "Перевірте зону проходу фрези й залиште вільний жертовний верх під майбутнім наскрізним контуром. Планована врізка в плиту — лише 0,2 мм після підтвердження Z.",
        holes.length
          ? "Locate each part centre plus 20 mm and make blind Ø(drill+2) ×5 mm exit clearances below every through hole. Do not raise seating burrs."
          : "Check the cutter path and retain sacrificial top material below the future through contour. Planned entry into the plate is only 0.2 mm after verifying Z.",
      ),
      t(
        "Зробіть незалежну пробну посадку деталі й сухий обхід траєкторії з моделлю тримача та всіх притисків. Якщо кріплення треба перенести, оформіть окреме встановлення.",
        "Independently trial-seat the part and dry-check the path with the holder and every clamp represented. Record a separate setup if clamps must move.",
      ),
    ],
    preparation: [
      t(
        "Закріпіть плиту на очищеному столі; виставте її координатний бік, виміряйте фактичну висоту й положення виходів.",
        "Mount on a clean table, align the coordinate side and measure actual height and exit positions.",
      ),
      t(
        "Відновіть A/B/C деталі щупом/крайкознімачем із правильною поправкою на радіус; фізично перевірте один незалежний розмір.",
        "Recover part A/B/C with a probe/edge finder using the correct radius correction; physically check one independent distance.",
      ),
    ],
    acceptance: [
      t(
        "Усі затиски спираються на підтримані ділянки, а не на тонку стінку. Жоден болт/опора не перетинає траєкторію.",
        "Every clamp acts over a supported region rather than a thin wall. No bolt or support intersects the path.",
      ),
      t(
        "Вихід різального інструмента підтверджений по Z; після пробного затиску зміна контрольної висоти не більша 0,02 мм.",
        "Verify cutter exit in Z; after trial clamping, the check-height change must not exceed 0.02 mm.",
      ),
    ],
    geometry: {
      kind: "block",
      width: fw,
      depth: fd,
      height: 15,
      holes: holes.map((h) => ({
        x: h.x + 20,
        y: h.y + 20,
        diameter: h.diameter + 2,
        depth: 5,
      })),
    },
  };
}
const commonEquipment = [
  t(
    "Верстат прийнятий після огляду; жорсткість, люфти й перпендикулярність шпинделя перевірені до маршруту.",
    "Machine accepted after inspection; verify rigidity, backlash and spindle squareness before the route.",
  ),
  t(
    "Лещата з підтвердженим утриманням, короткі тримачі, DRO або перевірений ЧПУ; обхід повного інструментального габариту.",
    "Vice with verified retention, short holders, DRO or verified CNC; check the complete tool/holder envelope.",
  ),
  t(
    "Вимірювальні прилади мають покривати поле допуску з урахуванням своєї похибки; за браку засобу ознака залишається непідтвердженою.",
    "Measuring equipment must resolve the tolerance with allowance for its error; a feature remains unverified if the required instrument is unavailable.",
  ),
];
const stockPrep = [
  t(
    "Звірте марку, стан постачання та розміри; видаліть консервацію дозволеним способом.",
    "Verify grade, delivery condition and size; remove protection by an approved method.",
  ),
  t(
    "Розпиляйте з припуском 2 мм на кожний бік, не намагаючись замінити фрезерування точністю розмітки.",
    "Saw with 2 mm per side; marking accuracy does not replace milling.",
  ),
  t(
    "Зніміть гострі задирки, позначте майбутні A/B/C та перевірте, що припуск є з обох боків кожного розміру.",
    "Remove sharp burrs, mark intended A/B/C and confirm stock on both sides of each dimension.",
  ),
];
const quality = [
  t(
    "Перед остаточним контролем очистіть і термостабілізуйте деталь та прилад; розмірна довідкова температура — 20 °C. Запишіть фактичну температуру, якщо вона відрізняється.",
    "Clean and temperature-stabilise the part and instrument before final inspection; dimensional reference temperature is 20 °C. Record actual temperature when different.",
  ),
  t(
    "Починайте контроль від A/B/C, а не від останнього обробленого отвору. Записуйте всі повтори, прилад, точки та відмінність між затиснутим і вільним станом.",
    "Inspect from A/B/C rather than the last machined hole. Record repeated readings, instrument, locations and the difference between clamped and free states.",
  ),
  t(
    "Усі вказані межі — задані вимоги цього прикладу; реальну досяжність доводять контрольним виготовленням. Одного числа в полі результату недостатньо для повної приймальної перевірки.",
    "The stated limits are design requirements for this example; demonstrate actual capability with a verified first article. One result field is not a complete acceptance inspection.",
  ),
];
const commonHazards = [
  t(
    "Огляд і кріплення виконують у безпечному стані за процедурою верстата; E-stop не замінює ізоляцію енергії. Без рукавичок біля обертання.",
    "Inspect and set workholding in the machine-defined safe state; E-stop does not replace energy isolation. No gloves near rotation.",
  ),
  t(
    "Для ручного верстата з люфтом не застосовуйте попутне фрезерування навмання. Напрямок і підхоплення подачі оцінюють до різання.",
    "On a backlash-prone manual mill, do not choose climb milling arbitrarily. Assess direction and feed pull-in before cutting.",
  ),
];
const commonSources = [
  "proj-mill-ccohs",
  "proj-mill-locating",
  "proj-mill-nist",
  "proj-mill-haas",
];
export const millingSources: Source[] = [
  {
    id: "proj-mill-ccohs",
    title: "Metalworking Machines — Milling Machines",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/safety_haz/metalworking/millingmachines.html",
  },
  {
    id: "proj-mill-locating",
    title: "Locating and Clamping Principles",
    publisher: "Carr Lane Manufacturing",
    url: "https://www.carrlane.com/engineering-resources/fixture-design-principles/locating-clamping-principles",
  },
  {
    id: "proj-mill-nist",
    title: "Engineering Metrology Toolbox — Reference Temperature",
    publisher: "NIST",
    url: "https://emtoolbox.nist.gov/Faq/Faq.asp",
  },
  {
    id: "proj-mill-haas",
    title: "Mill Operator’s Manual — Part Setup",
    publisher: "Haas Automation",
    url: "https://haascnc.com/service/online-operator-s-manuals/mill-operator-s-manual/mill---part-setup.html.html",
  },
  {
    id: "proj-mill-slot",
    title: "Groove or Slot Milling",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-us/knowledge/milling/groove-or-slot-milling",
  },
  {
    id: "proj-mill-shoulder",
    title: "Shoulder Milling",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-us/knowledge/milling/shoulder-milling",
  },
  {
    id: "proj-mill-bore",
    title: "Fundamentals of Bore Measuring",
    publisher: "Mitutoyo",
    url: "https://www.mitutoyo.com/webfoo/wp-content/uploads/Product-Fundamentals.pdf",
  },
  {
    id: "proj-mill-bushing",
    title: "Drill Bushing Installation and Technical Data",
    publisher: "Carr Lane Manufacturing",
    url: "https://www.carrlane.com/engineering-resources/technical-information/manual-workholding/drill-bushings/installation-and-technical-data",
  },
  {
    id: "proj-mill-norelem",
    title: "08910 Flanged Drill Bushes DIN 172 — Dimensions",
    publisher: "norelem",
    url: "https://www.norelem.com/xs_db/DOKUMENT_DB/www/NORELEM/DataSheet/en/08/08910_Datasheet_4370_Drill_bushes_flanged_DIN_172--en.pdf",
  },
  {
    id: "proj-mill-nsk",
    title: "Bearing and Linear Replacement Guide — 608 Dimensions",
    publisher: "NSK",
    url: "https://www.nsk.com/content/dam/nsk/am/en_us/documents/bearings-americas/Bearing-and-Linear-Replacement-Guide.pdf",
  },
];

const holesFeature = (
  diameter: number,
  coordinates: string,
  geometryRef = "holes.0.diameter",
): ProjectFeature =>
  feature(
    "F6",
    ["Діаметр наскрізних отворів", "Through-hole diameter"],
    `Ø${diameter} +0.15/0`,
    diameter,
    diameter,
    diameter + 0.15,
    "A/B/C",
    [
      `Перевірте кожний отвір після зняття задирок; координати ${coordinates}. Не оцінюйте діаметр лише вставлянням болта.`,
      `Inspect every hole after deburring; coordinates ${coordinates}. Do not infer diameter from a bolt fit.`,
    ],
    boreGauge,
    geometryRef,
  );
function coordinateFeature(
  id: string,
  axis: "X" | "Y",
  nominal: number,
  geometryRef: string,
  tolerance = 0.05,
): ProjectFeature {
  return feature(
    id,
    [`Координата ${axis} контрольного отвору`, `Check-hole ${axis} coordinate`],
    `${axis}=${nominal} ±${tolerance}`,
    nominal,
    nominal - tolerance,
    nominal + tolerance,
    axis === "X" ? "C" : "B",
    [
      "Використайте контрольний штифт; до виміряного краю додайте/відніміть його радіус. Перевірте кожну симетричну точку окремо.",
      "Use a checking pin; add/subtract its radius from the measured edge. Verify every symmetric position independently.",
    ],
    heightGauge,
    geometryRef,
  );
}
function featureSetup(
  id: string,
  title: Pair,
  geometry: BlockGeometry,
  fixtureId: string,
  operations: ManufacturingOperation[],
  extra: Text[] = [],
): ManufacturingSetup {
  return {
    id,
    title: p(title),
    machine: t(
      "Ручний фрезерний із DRO або 3-осьовий ЧПУ за погодженою програмою.",
      "Manual mill with DRO or 3-axis CNC using an approved program.",
    ),
    purpose: t(
      "Обробити функціональні елементи в єдиній координатній системі після приймання габариту.",
      "Machine the functional features in one coordinate system after envelope acceptance.",
    ),
    orientation: t(
      "A вниз, B визначає Y=0, C визначає X=0; усі наведені глибини від верхньої площини.",
      "A down, B establishes Y=0 and C establishes X=0; stated depths are from the top face.",
    ),
    datums: t(
      `Кут C/B — X0 Y0; верх — Z0 у цьому встановленні. Фактична товщина ${geometry.height} мм перевірена окремо від корекції довжини інструмента.`,
      `C/B corner is X0 Y0; the top is Z0 for this setup. Actual ${geometry.height} mm thickness is checked separately from tool-length offset.`,
    ),
    workholding: t(
      "Спирайте всю доступну A на очищене оснащення; притиски розташовані над опорами й поза траєкторією. Позначте габарит головок болтів у плані.",
      "Support available A on clean workholding; clamps act over supports outside the path. Include bolt-head envelopes in the plan.",
    ),
    fixtureIds: [fixtureId],
    preparation: [
      t(
        "Протріть A та опори, встановіть деталь без хитання й перевірте відсутність підйому після затиску.",
        "Clean A and the supports, seat without rocking and check for lift after clamping.",
      ),
      t(
        "Незалежно перевірте координати по протилежному краю; для ЧПУ звірте робочу систему, номери інструментів, довжини й безпечний підхід.",
        "Independently check coordinates against the opposite edge; for CNC verify work system, tool numbers, lengths and safe approach.",
      ),
      ...extra,
    ],
    operations,
    inspection: [
      t(
        "Не приймайте координати лише за дисплеєм; перевірте контрольний отвір або елемент від A/B/C.",
        "Do not accept position from the display alone; inspect a check hole or feature from A/B/C.",
      ),
      t(
        "Після звільнення повторіть контроль габариту й точних елементів; записуйте фактичні значення.",
        "After release, recheck the envelope and precise features; record actual readings.",
      ),
    ],
    release: t(
      "Повна зупинка й потрібна ізоляція; очистіть щіткою, підтримайте деталь, потім відпустіть притиски.",
      "Stop fully and apply required isolation; brush clean, support the part, then release clamps.",
    ),
    transfer: t(
      "Для нижніх кромок переверніть деталь поза різальною зоною на чисті м’які опори; збережіть A/B/C, а не новий випадковий кут.",
      "For underside edges, turn the part off-machine onto clean soft supports; retain A/B/C rather than adopting a new arbitrary corner.",
    ),
    diagram: {
      view: "milling",
      clamping: fixtureId === "vise" ? "vise" : "fixture-plate",
      flip: false,
      datumA: "bottom",
      toolApproach: "top",
      highlight: p(title),
    },
  };
}
function reverseInspection(
  geometry: BlockGeometry,
  featureIds: string[],
): ManufacturingSetup {
  return {
    id: "S90",
    title: t(
      "Перевертання, нижні кромки й вільний контроль",
      "Reverse, underside edges and free-state inspection",
    ),
    machine: t(
      "Верстак і вимірювальна плита; обертання не застосовується.",
      "Bench and inspection surface plate; no powered rotation.",
    ),
    purpose: t(
      "Прибрати вихідні задирки та прийняти вільну деталь, не приховуючи деформацію затиском.",
      "Remove exit burrs and accept the free part without hiding distortion through clamping.",
    ),
    orientation: t(
      "Переверніть A догори на чистих м’яких опорах; після кромок поверніть A на плиту.",
      "Turn A upwards on clean soft supports; after edge finishing, return A to the plate.",
    ),
    datums: t(
      "Позначення A/B/C залишаються незмінними, незалежно від орієнтації на верстаку.",
      "A/B/C identities remain unchanged regardless of bench orientation.",
    ),
    workholding: t(
      "Легке ручне утримання в нерухомих м’яких лещатах лише для дебурера; вимірювання — без затиску.",
      "Light retention in stationary soft bench jaws for deburring only; measure unclamped.",
    ),
    fixtureIds: ["vise"],
    preparation: [
      t(
        "Дайте деталі та приладам стабілізуватися, очистіть усі вимірювальні контакти.",
        "Let the work and instruments stabilise; clean every measuring contact.",
      ),
    ],
    operations: [
      op(
        "OP10",
        ["Виходи отворів і нижні ребра", "Hole exits and lower edges"],
        [
          "Зніміть лише задирку фаскознімачем; для отворів з посадкою не перетворюйте вхідну фаску на конус усієї робочої довжини.",
          "Remove only burrs with a deburring tool; do not turn a fitting bore into a taper along its working length.",
        ],
        [
          "Ручний дебурер/зенківка у ручному тримачі.",
          "Hand deburring tool/countersink in a hand holder.",
        ],
        [
          "Кромка 0,2–0,3 мм, якщо інша фаска не задана; зберігайте робочі контакти.",
          "0.2–0.3 mm edge break unless another chamfer is specified; preserve functional contacts.",
        ],
        [
          "Огляньте виходи під освітленням; на A немає виступаючої задирки.",
          "Inspect exits under good light; no raised burr remains on A.",
        ],
        featureIds,
        [
          "Зупиніться, якщо видно тріщину, надрив виходу чи виривання матеріалу біля точної поверхні.",
          "Stop for a crack, torn breakout or material pull-out near a precision surface.",
        ],
      ),
      op(
        "OP20",
        ["Повторити розміри без затиску", "Repeat dimensions without clamping"],
        [
          `Виміряйте габарит ${geometry.width} × ${geometry.depth} × ${geometry.height} мм у кількох точках, потім усі ознаки за таблицею. Для глухих елементів перевірте доступ до дна придатним щупом.`,
          `Measure the ${geometry.width} × ${geometry.depth} × ${geometry.height} mm envelope at several locations, then every listed feature. For blind features verify floor access using a suitable contact.`,
        ],
        [
          "Прилади з таблиці вимог; контрольні штифти й плита.",
          "Instruments listed in the requirements table, checking pins and surface plate.",
        ],
        [
          "Матеріал більше не знімають до прийняття рішення за вимірами.",
          "Remove no more material until a measurement-based decision is made.",
        ],
        [
          "Запишіть мінімум/максимум, температуру, базу, прилад і результат кожної вимоги.",
          "Record minimum/maximum, temperature, datum, instrument and each requirement result.",
        ],
        featureIds,
        [
          "Якщо метод не може підтвердити поле допуску, позначте ознаку неперевіреною; не ставте автоматичне «пройдено».",
          "If the method cannot verify the tolerance, mark the feature unverified rather than automatically passed.",
        ],
      ),
      op(
        "OP30",
        ["Примірка та випуск ревізії", "Fit check and revision release"],
        [
          "На нерухомому навчальному вузлі перевірте функціональні контакти без силового підтискання. Збережіть маршрут, виміри та фото. Відхилення обґрунтовуйте окремо, не змінюйте креслення заднім числом.",
          "On the stationary learning assembly, check functional contacts without forcing. Save the route, readings and photos. Resolve deviations separately; do not retrospectively change the drawing.",
        ],
        [
          "Відомий спряжений зразок/кріплення та карта контролю.",
          "Identified mating sample/fastener and inspection record.",
        ],
        [
          "Припасування допускається лише за окремою ревізією; не шліфуйте точні бази навмання.",
          "Fitting changes require a separate revision; do not sand precision datums arbitrarily.",
        ],
        [
          "Прийняті/непідтверджені вимоги й межі застосування записані.",
          "Record accepted/unverified requirements and application limits.",
        ],
        featureIds,
        [
          "Не використовуйте деталь як силове або захисне оснащення без окремого інженерного приймання.",
          "Do not use the part for load-bearing or protective workholding without separate engineering acceptance.",
        ],
      ),
    ],
    inspection: [
      t(
        "У протоколі є кожна ознака, метод, прилад і рішення; геометрію перевірено після звільнення.",
        "The record includes every feature, method, instrument and decision; geometry is checked after release.",
      ),
    ],
    release: t(
      "Збережіть суху чисту деталь окремо від стружки; промаркуйте ревізію на некритичній ділянці.",
      "Store the clean dry part away from chips; mark the revision on a noncritical area.",
    ),
    transfer: t(
      "Перед будь-яким наступним різанням оформіть нове встановлення, відновіть бази та перегляньте залишок допуску.",
      "Before further cutting, document a new setup, recover datums and reassess remaining tolerance.",
    ),
    diagram: {
      view: "inspection",
      clamping: "vise",
      flip: true,
      datumA: "top",
      highlight: t(
        "Контроль вільної деталі після зміни орієнтації.",
        "Free-state inspection after reorientation.",
      ),
    },
  };
}

type BaseInput = Pick<
  Project,
  | "id"
  | "title"
  | "summary"
  | "level"
  | "family"
  | "part"
  | "purpose"
  | "duration"
> & { material?: Text };
function base(
  v: BaseInput,
): Omit<Project, "features" | "fixtures" | "setups" | "cutting" | "pitfalls"> {
  const g = v.part as BlockGeometry;
  return {
    ...v,
    revision: "B1",
    material:
      v.material ||
      t(
        "EN AW-6082-T6, відомий сертифікований прокат без зварювання.",
        "EN AW-6082-T6, identified certified wrought stock without welds.",
      ),
    equipment: commonEquipment,
    stock: {
      form: t(
        "Пиляна прямокутна заготовка з припуском.",
        "Sawn rectangular blank with machining stock.",
      ),
      size: `${g.width + 4} × ${g.depth + 4} × ${g.height + 4} mm`,
      preparation: stockPrep,
    },
    datums: baseDatums(g.width, g.depth),
    qualityPlan: quality,
    hazards: commonHazards,
    lessons: [
      "daily-inspection",
      "workholding-basics",
      "mill-facing",
      "mill-datums",
      "tool-setting-mill",
      "inspection-plan",
    ],
    sources: commonSources,
  };
}
const plate: BlockGeometry = {
  kind: "block",
  width: 80,
  depth: 50,
  height: 10,
  holes: [
    { x: 15, y: 10, diameter: 6.6 },
    { x: 65, y: 10, diameter: 6.6 },
    { x: 15, y: 40, diameter: 6.6 },
    { x: 65, y: 40, diameter: 6.6 },
  ],
};
const bracket: BlockGeometry = {
  kind: "block",
  width: 60,
  depth: 40,
  height: 35,
  pockets: [
    { x: 0, y: 0, width: 60, depth: 30, cutDepth: 25, cornerRadius: 0 },
  ],
};
const stopBlock: BlockGeometry = {
  kind: "block",
  width: 40,
  depth: 20,
  height: 20,
  holes: [
    { x: 10, y: 10, diameter: 5.5 },
    { x: 30, y: 10, diameter: 5.5 },
  ],
};
const jaw: BlockGeometry = {
  kind: "block",
  width: 100,
  depth: 25,
  height: 20,
  holes: [
    { x: 20, y: 12.5, diameter: 8.5, counterbore: { diameter: 14, depth: 9 } },
    { x: 80, y: 12.5, diameter: 8.5, counterbore: { diameter: 14, depth: 9 } },
  ],
  pockets: [{ x: 0, y: 0, width: 100, depth: 4, cutDepth: 3, cornerRadius: 0 }],
};
export const millingProjects: Project[] = [
  {
    ...base({
      id: "fixture-plate",
      title: t(
        "Координатна монтажна пластина 80 × 50",
        "80 × 50 coordinate mounting plate",
      ),
      summary: t(
        "Чотири отвори під M6 з контрольованим положенням від A/B/C, окремою підкладкою та повним маршрутом шести площин.",
        "Four M6 clearance holes located from A/B/C, with a made backing plate and a complete six-face route.",
      ),
      level: "beginner",
      family: "milling",
      part: plate,
      duration: t(
        "5–8 годин із виготовленням підкладки та контролем.",
        "5–8 hours including backing-plate manufacture and inspection.",
      ),
      purpose: t(
        "Монтаж невідповідального настільного макета. Пластина не є оціненою за навантаженням базою верстатних притисків.",
        "Mount a noncritical bench demonstrator. The plate is not a load-rated machine-clamping base.",
      ),
    }),
    features: [
      ...envelope(80, 50, 10),
      holesFeature(6.6, "(15,10), (65,10), (15,40), (65,40) mm"),
      coordinateFeature("F7", "X", 15, "holes.0.x"),
      coordinateFeature("F8", "Y", 10, "holes.0.y"),
      feature(
        "F9",
        ["Міжцентрова відстань уздовж X", "X hole pitch"],
        "50 ±0.07",
        50,
        49.93,
        50.07,
        "C",
        [
          "Виміряйте через дві відомі контрольні пробки та відніміть суму їхніх радіусів; перевірте обидва ряди.",
          "Measure across two known checking pins and subtract the sum of their radii; check both rows.",
        ],
        heightGauge,
      ),
      feature(
        "F10",
        ["Міжцентрова відстань уздовж Y", "Y hole pitch"],
        "30 ±0.07",
        30,
        29.93,
        30.07,
        "B",
        [
          "Перевірте обидві колонки незалежно від першого ряду.",
          "Verify both columns independently of the first row.",
        ],
        heightGauge,
      ),
    ],
    fixtures: [viceFixture(), carrier("backing", 80, 50, plate.holes)],
    setups: [
      ...squareStock(80, 50, 10),
      featureSetup(
        "S70",
        ["Розміщення чотирьох отворів", "Locate and drill four holes"],
        plate,
        "backing",
        [
          op(
            "OP10",
            [
              "Центри без ланцюгового накопичення",
              "Locate centres without chaining",
            ],
            [
              "Від C/B задайте X=15 і 65, Y=10 і 40 мм. Після відновлення краю перевірте 80 та 50 мм до протилежних сторін; врахуйте радіус крайкознімача. Нанесіть короткі центрувальні заходи в усіх чотирьох точках.",
              "From C/B set X=15 and 65, Y=10 and 40 mm. After recovering the edges, check 80 and 50 mm to the opposite sides; account for the edge-finder radius. Spot all four positions.",
            ],
            [
              "Крайкознімач/щуп і коротке центрувальне свердло.",
              "Edge finder/probe and a short spotting drill.",
            ],
            [
              "Центрування лише під спрямування Ø6,6; не створюйте зайвого глибокого конуса.",
              "Spot only enough to guide Ø6.6; do not create an unnecessary deep cone.",
            ],
            [
              "Перевірте перший центр від двох баз до свердління; усі чотири виходи співпадають з підкладкою.",
              "Check the first centre from both datums before drilling; all four exits align with the backing.",
            ],
            ["F7", "F8", "F9", "F10"],
            [
              "Зупиніться при розбіжності координат чи непідтвердженій поправці радіуса; не зміщуйте кожний отвір окремим нулем.",
              "Stop for coordinate disagreement or an unverified radius correction; do not create a different origin for each hole.",
            ],
          ),
          op(
            "OP20",
            [
              "Наскрізні Ø6,6 з контрольованим виходом",
              "Through Ø6.6 with controlled breakthrough",
            ],
            [
              "На пробній заготовці перевірте фактичний отвір цим свердлом. Просвердліть чотири отвори через 10 мм плити. Межу опускання рахуйте за кутом вершини: повний діаметр має пройти низ, а вістря залишитися в 5 мм технологічному виході.",
              "Check the actual hole made by this drill in scrap. Drill four holes through the 10 mm plate. Determine down-travel from point geometry: full diameter must clear the underside while the tip remains inside the 5 mm exit relief.",
            ],
            [
              "Коротке спіральне свердло Ø6,6 з придатною геометрією та закріпленням.",
              "Short Ø6.6 twist drill with suitable geometry and retention.",
            ],
            [
              "Номінал Ø6,6; допустимий фактичний діаметр 6,60–6,75 мм.",
              "Nominal Ø6.6; acceptable actual diameter 6.60–6.75 mm.",
            ],
            [
              "Перевірте перший отвір пробкою/нутроміром і огляньте вихід до повторення решти.",
              "Check the first hole with a pin/bore gauge and inspect its exit before repeating the rest.",
            ],
            ["F6", "F7", "F8"],
            [
              "Зупиніться при обертанні заготовки, забитих канавках чи сліді контакту з підкладкою поза виходом.",
              "Stop for work rotation, packed flutes or contact outside the planned backing relief.",
            ],
          ),
          op(
            "OP30",
            [
              "Вхідні кромки й контроль координат",
              "Entry edges and coordinate check",
            ],
            [
              "Зніміть верхній задирок фаскою 0,2–0,3 мм. Встановіть контрольні штифти в нерухому очищену деталь і перевірте центри; підкладка не є доказом правильного положення отвору.",
              "Break upper burrs 0.2–0.3 mm. Put checking pins into the stationary clean work and inspect centres; the backing plate does not prove hole location.",
            ],
            [
              "Фаскова фреза/ручний дебурер і контрольні штифти.",
              "Chamfer tool/hand deburrer and checking pins.",
            ],
            [
              "Фаска не збільшує робочий діаметр по всій товщині.",
              "The edge break must not enlarge the working bore through its thickness.",
            ],
            [
              "F6–F10 записані окремо для кожного отвору/ряду.",
              "Record F6–F10 separately for every hole/row.",
            ],
            ["F6", "F7", "F8", "F9", "F10"],
            [
              "Якщо штифт хитається настільки, що координату не визначити з потрібною похибкою, змініть метод контролю.",
              "If pin clearance prevents location measurement with suitable error, change the inspection method.",
            ],
          ),
        ],
      ),
      reverseInspection(plate, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
      ]),
    ],
    cutting: [
      {
        tool: t(
          "Приклад розрахунку для Ø6,6 свердла, а не готова карта режимів.",
          "Arithmetic example for a Ø6.6 drill, not an approved cutting schedule.",
        ),
        diameter: 6.6,
        vc: 40,
        feedPerRev: 0.08,
        rpmLimit: 2000,
        assumptions: t(
          "Припущено Vc 40 м/хв і 0,08 мм/об. Після обмеження обертів перерахуйте лінійну подачу; ці величини потребують підтвердження конкретним свердлом.",
          "Assume Vc 40 m/min and 0.08 mm/rev. Recalculate linear feed after limiting speed; these inputs require confirmation for the actual drill.",
        ),
        confirmation: t(
          "Звірте сплав, довжину, затиск і рекомендовані дані виробника; перевірте перший отвір на окремому зразку.",
          "Check alloy, length, retention and manufacturer data; verify the first hole on separate scrap.",
        ),
      },
    ],
    pitfalls: [
      t(
        "Додавання 50 мм від попереднього отвору замість повернення до C приховує помилку початкового центра.",
        "Adding 50 mm from the previous hole instead of returning to C hides the first-centre error.",
      ),
      t(
        "Паралель під отвором може бути просвердлена й підняти деталь; використовуйте розраховані виходи.",
        "A parallel below the hole can be drilled and lift the work; use planned exit clearances.",
      ),
    ],
  },
  {
    ...base({
      id: "angle-bracket",
      title: t("Суцільнофрезерований L-кронштейн", "Solid-milled L bracket"),
      summary: t(
        "Реальна відкрита L-геометрія: основа 10 мм, задня полиця 10 мм, контроль після чорнової вибірки та повторного затиску.",
        "A genuine open L section:10 mm base,10 mm rear web, with inspection after roughing and a fresh clamping for finishing.",
      ),
      level: "intermediate",
      family: "milling",
      part: bracket,
      duration: t(
        "8–12 годин із опорною плитою й повторним контролем.",
        "8–12 hours including support plate and repeat inspection.",
      ),
      purpose: t(
        "Невідповідальний кронштейн для настільного макета. Без розрахунку не застосовується для підйому, огороджень або сприйняття сил різання.",
        "Noncritical bench-model bracket. Without separate design approval it is not for lifting, guarding or carrying machining loads.",
      ),
    }),
    features: [
      ...envelope(60, 40, 35),
      feature(
        "F6",
        ["Глибина відкритої вибірки", "Open-pocket depth"],
        "25 ±0.05",
        25,
        24.95,
        25.05,
        "D (top)",
        [
          "Виміряйте глибиноміром від збереженої верхньої полиці до дна у трьох місцях; врахуйте реальну висоту 35 мм.",
          "Measure from the preserved upper web to the floor at three locations; account for actual 35 mm height.",
        ],
        [
          "Глибиномір/висотомір із опорою на верхню полицю.",
          "Depth/height gauge seated on the upper web.",
        ],
        "pockets.0.cutDepth",
      ),
      feature(
        "F7",
        ["Залишкова товщина основи", "Remaining base thickness"],
        "10 ±0.07",
        10,
        9.93,
        10.07,
        "A",
        [
          "Виміряйте безпосередньо мікрометром у доступних місцях, а не лише 35−25.",
          "Measure directly with a micrometer where accessible rather than accepting 35−25 alone.",
        ],
        extMic,
      ),
      feature(
        "F8",
        ["Положення внутрішньої вертикальної полиці", "Inner upright position"],
        "Y=30 ±0.05",
        30,
        29.95,
        30.05,
        "B",
        [
          "Перевірте від B та незалежно товщину задньої стінки від протилежної зовнішньої поверхні.",
          "Check from B and independently measure the rear wall from its opposite external face.",
        ],
        caliper,
        "pockets.0.depth",
      ),
      feature(
        "F9",
        ["Товщина задньої полиці", "Rear-web thickness"],
        "10 ±0.07",
        10,
        9.93,
        10.07,
        "Y=40",
        [
          "Контроль щонайменше на двох висотах після звільнення.",
          "Check at least two heights after release.",
        ],
        extMic,
      ),
    ],
    fixtures: [
      viceFixture(),
      {
        ...carrier("base-carrier", 60, 40),
        name: t(
          "Опорна плита із затиском нижче дна вибірки",
          "Support plate with clamps below the pocket floor",
        ),
        purpose: t(
          "Утримати масивну основу, залишивши відкритими обидва торці й передню сторону вибірки.",
          "Retain the solid base while leaving both ends and the front of the pocket open.",
        ),
        preparation: [
          t(
            "Застосуйте штатні низькопрофільні бічні клинові/крайові притиски з дією вниз і вбік. Їхній контакт та весь габарит — у нижніх 6,5 мм основи. Звичайні верхні лапи на основі висотою 10 мм тут не підходять. Зусилля спрямоване в підтриману A.",
            "Use approved low-profile side wedge/edge clamps acting down and sideways. Their contact and entire envelope remain within the lower 6.5 mm of the base. Ordinary top straps on a 10 mm-high base do not fit this setup. Direct force into supported A.",
          ),
          t(
            "Модель усіх головок має залишати зазор до фрези при Zдна=10 мм; перевірте й тримач на верхньому рівні 35 мм.",
            "Every head model must clear the cutter at floor Z=10 mm; also verify holder clearance at the 35 mm top level.",
          ),
          t(
            "Перед чорновою операцією обміряйте висоти притисків і фактичний контакт A.",
            "Before roughing, measure clamp heights and actual A seating.",
          ),
        ],
      },
    ],
    setups: [
      ...squareStock(60, 40, 35),
      featureSetup(
        "S70",
        ["Чорнова відкрита вибірка", "Rough the open pocket"],
        bracket,
        "base-carrier",
        [
          op(
            "OP10",
            ["Вхід з відкритої сторони", "Enter from the open side"],
            [
              "Почніть за межами B, з подальшим рухом у матеріал узгодженими шарами. Для ручного верстата використайте дозволений напрямок; повне врізання Ø10 у глуху масу не є цим маршрутом.",
              "Start outside B and move into the stock in approved layers. On a manual mill use the permitted direction; plunging a Ø10 cutter into solid material is not this route.",
            ],
            [
              "Коротка кінцева фреза Ø10 для 6082 з достатньою робочою довжиною та мінімальним вильотом.",
              "Short Ø10 end mill for 6082 with adequate flute length and minimum overhang.",
            ],
            [
              "Залиште 0,30 мм на стінці Y=30 та 0,20 мм на дні.",
              "Retain 0.30 mm on wall Y=30 and 0.20 mm on the floor.",
            ],
            [
              "Після першого шару перевірте утримання основи та реальний вихід фрези за торці X.",
              "After the first layer verify base retention and actual cutter run-out beyond the X ends.",
            ],
            ["F6", "F7", "F8"],
            stopLift,
          ),
          op(
            "OP20",
            [
              "Пошарова вибірка зі збереженням полиць",
              "Layered roughing while preserving webs",
            ],
            [
              "Доведіть чорнову глибину до 24,80 мм від верху, а внутрішню стінку — доY=29,70. Очищайте стружку лише після зупинки; біля задньої полиці не залишайте забитий канал.",
              "Rough to 24.80 mm below the top and wall Y=29.70. Remove chips only after stopping; do not leave a packed channel near the rear web.",
            ],
            [
              "Та сама фреза; величину кожного шару задає підтверджена карта різання.",
              "Same cutter; use the approved cutting schedule for each layer depth.",
            ],
            [
              "Залишок дна 0,20 мм; стінки 0,30 мм.",
              "Floor stock 0.20 mm; wall stock 0.30 mm.",
            ],
            [
              "Після останнього чорнового шару виміряйте залишок стінки й основи в кількох точках.",
              "After the last roughing layer measure remaining wall and base at several points.",
            ],
            ["F6", "F7", "F8", "F9"],
            [
              "Зупиніться за прогину задньої полиці, зміни звуку або розміру під час затиску.",
              "Stop for rear-web deflection or a change in sound or clamped size.",
            ],
          ),
          op(
            "OP30",
            [
              "Звільнення для оцінки деформації",
              "Release to assess distortion",
            ],
            [
              "Після зупинки зніміть деталь і перевірте A, основу та полицю без затиску. Запишіть зміну; за перевищення залишкового припуску не намагайтесь силою повернути форму.",
              "After stopping, remove the work and inspect A, base and web unclamped. Record change; do not force the shape back if distortion consumes the remaining allowance.",
            ],
            [
              "Мікрометр, плита та індикатор.",
              "Micrometer, surface plate and indicator.",
            ],
            [
              "Залишок на чистову має зберігатись у всіх контрольних точках.",
              "Finishing stock must remain at every checked point.",
            ],
            [
              "Стан після звільнення записаний до нового встановлення.",
              "Record the free condition before the next setup.",
            ],
            ["F3", "F4", "F6", "F7", "F8", "F9"],
            [
              "Якщо A втратила контакт або припуск відсутній локально, потрібне рішення за відхиленням.",
              "If A loses seating or stock is locally absent, resolve the deviation before continuing.",
            ],
          ),
        ],
      ),
      {
        ...featureSetup(
          "S80",
          [
            "Повторна посадка й чистові полички",
            "Reseat and finish floor and web",
          ],
          bracket,
          "base-carrier",
          [
            op(
              "OP10",
              ["Повторно перевірити A/B/C", "Recover A/B/C again"],
              [
                "Приберіть усю стружку, поверніть A на плиту й затисніть основу тим самим дозволеним способом. Відновіть X/Y/Z незалежно; старий Z після нового затиску не приймайте автоматично.",
                "Remove all chips, reseat A and retain the base using the same approved method. Recover X/Y/Z independently; do not automatically reuse the old Z after reclamping.",
              ],
              [
                "Щуп/крайкознімач, індикатор.",
                "Probe/edge finder and indicator.",
              ],
              [
                "Перед різанням підтвердіть 0,20 мм дна й 0,30 мм стінки.",
                "Confirm 0.20 mm floor and 0.30 mm wall stock before cutting.",
              ],
              [
                "Висота контрольної точки після затиску відрізняється від вільної не більше 0,02 мм.",
                "Clamped check height differs from the free state by no more than 0.02 mm.",
              ],
              ["F4", "F6", "F8"],
              stopLift,
            ),
            op(
              "OP20",
              [
                "Чистове дно й вертикальна стінка",
                "Finish the floor and vertical wall",
              ],
              [
                "Спочатку закінчіть дно до 25,00 мм від верху, потім стінку доY=30,00. Виконуйте легкі проходи з вимірюванням залишку; не підтискайте тонку полицю для поліпшення сліду різання.",
                "Finish the floor to 25.00 mm below the top, then the wall toY=30.00. Make light passes with measured stock; do not squeeze the web harder to improve the cutting trace.",
              ],
              [
                "Чиста гостра Ø10 кінцева фреза; окрема чистова крайка за потреби.",
                "Clean sharp Ø10 end mill; a separate finishing edge if needed.",
              ],
              [
                "Фініш у межі F6/F8; основа та полиця мають залишитись не тоншими нижніх меж F7/F9.",
                "Finish within F6/F8; base and web must remain above the F7/F9 lower limits.",
              ],
              [
                "Виміряйте глибину, стінку й локальну товщину до зняття.",
                "Inspect depth, wall and local thickness before removal.",
              ],
              ["F6", "F7", "F8", "F9"],
              [
                "Не продовжуйте за конусністю чи сходинкою, яку не можна усунути в залишку допуску.",
                "Do not continue with taper or a step that cannot be removed within remaining tolerance.",
              ],
            ),
            op(
              "OP30",
              ["Кромки відкритих виходів", "Finish open exit edges"],
              [
                "На зупиненій деталі зніміть задирки на відкритих торцях, не завалюючи внутрішню базову стінку. Повторіть A/основа/полиця після звільнення.",
                "On the stopped work remove burrs at the open ends without rolling the internal reference wall. Recheck A, base and web after release.",
              ],
              [
                "Ручний дебурер і контроль товщини.",
                "Hand deburrer and thickness inspection.",
              ],
              [
                "Лише ребровий задирок; без довільного полірування площин.",
                "Edge burrs only; no arbitrary face polishing.",
              ],
              [
                "Порівняйте затиснутий і вільний результат.",
                "Compare clamped and free results.",
              ],
              ["F4", "F7", "F9"],
              stopLift,
            ),
          ],
        ),
        diagram: {
          view: "milling",
          clamping: "fixture-plate",
          flip: false,
          highlight: t(
            "Друге окреме затискання після розвантаження чорнової вибірки.",
            "Second independent clamping after releasing the roughed pocket.",
          ),
        },
      },
      reverseInspection(bracket, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
      ]),
    ],
    cutting: [],
    pitfalls: [
      t(
        "Затиск високої задньої полиці замість основи змінює геометрію при відпусканні.",
        "Clamping the tall rear web rather than the base changes geometry after release.",
      ),
      t(
        "Ця вибірка відкрита з трьох сторін; замкнена кишеня з радіусами не є тією самою деталлю.",
        "This removal is open on three sides; an enclosed radiused pocket is a different part.",
      ),
    ],
    sources: [...commonSources, "proj-mill-shoulder", "proj-mill-slot"],
  },
  {
    ...base({
      id: "vise-stop",
      title: t("Переставний установчий упор", "Remountable locating stop"),
      summary: t(
        "Блок 40 ×20 ×20 мм із двома отворами під M5, контрольованою упорною площиною та повторною посадкою на базі з кроком 20 мм.",
        "A 40 ×20 ×20 mm block with two M5 clearance holes, a checked stop face and repeat seating on a 20 mm-pitch base.",
      ),
      level: "beginner",
      family: "fixturing",
      part: stopBlock,
      duration: t(
        "5–7 годин із підкладкою та повторною перевіркою.",
        "5–7 hours including backing and repeat checks.",
      ),
      purpose: t(
        "Допоміжне позиціювання заготовки перед затиском у лещатах на навчальній базі з двома M5 отворами, крок 20 мм. Сам упор не утримує деталь від сил різання й не є універсально сумісним із лещатами.",
        "Assist stock location before vice clamping on a learning base with two M5 holes at 20 mm pitch. The stop alone does not retain work against cutting forces and is not universally vice-compatible.",
      ),
    }),
    features: [
      ...envelope(40, 20, 20),
      holesFeature(5.5, "(10,10), (30,10) mm"),
      coordinateFeature("F7", "X", 10, "holes.0.x"),
      coordinateFeature("F8", "Y", 10, "holes.0.y"),
      feature(
        "F9",
        ["Крок двох кріпильних отворів", "Mounting-hole pitch"],
        "20 ±0.05",
        20,
        19.95,
        20.05,
        "C",
        [
          "Виміряйте через штифти; примірка до болтів показує лише можливість складання.",
          "Measure across pins; bolt fit shows assembly clearance only.",
        ],
        heightGauge,
      ),
      feature(
        "F10",
        [
          "Повторюваність упорної площини після зняття",
          "Stop-face repeatability after removal",
        ],
        "spread ≤0.03",
        0,
        0,
        0.03,
        "A/B",
        [
          "Зніміть і поверніть упор тричі; однаково посадіть його до визначеного краю бази й порівняйте показ індикатора в одній точці.",
          "Remove and refit three times; seat against the specified base edge consistently and compare one indicator point.",
        ],
        [
          "Індикатор на жорсткій базі, нерухомий контрольний зразок.",
          "Indicator on a rigid base and stationary reference sample.",
        ],
      ),
    ],
    fixtures: [viceFixture(), carrier("backing", 40, 20, stopBlock.holes)],
    setups: [
      ...squareStock(40, 20, 20),
      featureSetup(
        "S70",
        ["Отвори та упорна поверхня", "Holes and stop face"],
        stopBlock,
        "backing",
        [
          op(
            "OP10",
            [
              "Відновити кут і розташувати отвори",
              "Recover the corner and locate holes",
            ],
            [
              "Перевірте C/B, задайте центри(10;10) та(30;10) мм. Підкладка має виходи саме під цими точками зі зміщенням 20 мм.",
              "Verify C/B and set centres(10,10) and(30,10) mm. The backing exits must align with those positions at 20 mm offset.",
            ],
            [
              "Крайкознімач та центрувальне свердло.",
              "Edge finder and spotting drill.",
            ],
            [
              "Малі центрувальні заходи, остаточний діаметр не формується центруванням.",
              "Small spots; spotting does not establish final hole size.",
            ],
            [
              "Незалежно перевірте крок 20 мм і відстань до двох торців.",
              "Independently check 20 mm pitch and both end distances.",
            ],
            ["F7", "F8", "F9"],
            stopLift,
          ),
          op(
            "OP20",
            ["Просвердлити та прибрати задирки", "Drill and deburr"],
            [
              "Після пробного отвору свердліть Ø5,5 через 20 мм матеріалу. Розрахуйте хід вершини, а не тільки 20 мм повного діаметра; вістря має залишитись у виході підкладки.",
              "After a test hole, drill Ø5.5 through 20 mm material. Calculate point travel rather than only 20 mm full diameter; the tip must remain in the backing exit.",
            ],
            [
              "Коротке Ø5,5 свердло з достатньою довжиною канавок.",
              "Short Ø5.5 drill with adequate flute length.",
            ],
            [
              "Приймальний діаметр 5,50–5,65 мм; зняття лише ребрового задирка.",
              "Acceptable diameter 5.50–5.65 mm; remove edge burrs only.",
            ],
            [
              "Перший отвір перевірено до повторення; виходи очищені після перевертання.",
              "Inspect the first hole before repeating; deburr exits after reversal.",
            ],
            ["F6"],
            [
              "За забитих канавок або прихованого підйому підкладки припиніть свердління.",
              "Stop drilling for packed flutes or lifting beneath the work.",
            ],
          ),
          op(
            "OP30",
            [
              "Перевірити функціональну грань",
              "Check the functional stop face",
            ],
            [
              "B буде упорною гранню: огляньте її, перевірте перпендикуляр до A й відсутність випуклої задирки на нижньому ребрі. Не шліфуйте грань для приховування перекосу.",
              "B is the stop face: inspect it, check its squareness to A and ensure no raised lower-edge burr. Do not sand the face to hide misalignment.",
            ],
            [
              "Контрольний кутник та індикатор.",
              "Reference square and indicator.",
            ],
            [
              "Не змінюйте розмір 20 мм чи прямокутність під час дебурування.",
              "Do not alter 20 mm size or squareness during deburring.",
            ],
            [
              "F5 записано; на базі немає хитання.",
              "Record F5 and confirm stable seating on the base.",
            ],
            ["F2", "F5"],
            stopLift,
          ),
        ],
      ),
      {
        ...reverseInspection(stopBlock, [
          "F1",
          "F2",
          "F3",
          "F4",
          "F5",
          "F6",
          "F7",
          "F8",
          "F9",
          "F10",
        ]),
        transfer: t(
          "На нерухомій базі з M5 кроком 20 мм установіть упор без підпирання болтами; повторіть три зняття/встановлення й запишіть F10. Для реального верстата сумісність кріплення й утримання перевіряють окремо.",
          "On the stationary 20 mm-pitch M5 base seat the stop without using bolts as locators; repeat three removals/refits and record F10. Real-machine mounting compatibility and retention need separate verification.",
        ),
      },
    ],
    cutting: [],
    pitfalls: [
      t(
        "Зазор Ø5,5 під M5 не забезпечує точного позиціювання болтом: потрібна визначена упорна база.",
        "Ø5.5 clearance for M5 does not locate accurately on the bolt: use a defined seating datum.",
      ),
      t(
        "Упор задає положення, а лещата утримують від сил; не плутайте ці функції.",
        "The stop locates; the vice resists cutting forces. Keep those functions distinct.",
      ),
    ],
  },
  {
    ...base({
      id: "soft-jaw-inserts",
      title: t(
        "Парні ступінчасті вставки навчального затискача",
        "Matched stepped inserts for a learning fixture",
      ),
      summary: t(
        "Дві вставки 100 ×25 ×20 мм з вертикальним M8 кріпленням, цекуванням і спільно обробленими уступами 3 ×4 мм.",
        "Two 100 ×25 ×20 mm inserts with vertical M8 mounting, counterbores and matched 3 ×4 mm seating steps.",
      ),
      level: "intermediate",
      family: "fixturing",
      part: jaw,
      duration: t(
        "10–14 годин для пари, базової плити й повторної посадки.",
        "10–14 hours for the pair, base plate and repeat seating.",
      ),
      purpose: t(
        "Комплект із двох вставок для описаної навчальної плити; це не копія стандартних губок лещат із горизонтальними болтами. Перед використанням як реального затискача потрібне окреме приймання конструкції й утримання.",
        "A two-insert set for the specified learning plate; these are not ordinary vice jaws with horizontal bolts. Separate design and retention acceptance is required before real workholding use.",
      ),
    }),
    quantity: 2,
    stock: {
      form: t(
        "Дві прямокутні заготовки однієї партії 6082-T6.",
        "Two rectangular 6082-T6 blanks from the same batch.",
      ),
      size: "2 × (104 × 29 × 24) mm",
      preparation: [
        ...stockPrep,
        t(
          "Промаркуйте L/R до обробки; не міняйте місцями після спільного фінішу.",
          "Mark L/R before machining; do not interchange them after matched finishing.",
        ),
      ],
    },
    features: [
      ...envelope(100, 25, 20),
      feature(
        "F6",
        ["Наскрізні кріпильні отвори", "Through mounting holes"],
        "2 × Ø8.5 +0.15/0",
        8.5,
        8.5,
        8.65,
        "A/B/C",
        [
          "Перевірте обидві вставки та обидва отвори кожної.",
          "Check both holes in both inserts.",
        ],
        boreGauge,
        "holes.0.diameter",
      ),
      feature(
        "F7",
        ["Цекування під головку M8", "M8 head counterbore"],
        "Ø14 +0.10/0",
        14,
        14,
        14.1,
        "hole axis",
        [
          "Перевірте співвісність цекування з отвором і реальний діаметр головки обраного болта.",
          "Check counterbore-to-hole concentricity and the actual chosen bolt-head diameter.",
        ],
        boreGauge,
        "holes.0.counterbore.diameter",
      ),
      feature(
        "F8",
        ["Глибина цекування", "Counterbore depth"],
        "9 ±0.05",
        9,
        8.95,
        9.05,
        "top",
        [
          "Виміряйте плоский уступ від верхньої площини; дно не повинно бути конусом свердла.",
          "Measure the flat seat from the top face; the floor must not be a drill-point cone.",
        ],
        [
          "Глибиномір/глибинний мікрометр з придатною п’яткою.",
          "Depth gauge/micrometer with a suitable contact.",
        ],
        "holes.0.counterbore.depth",
      ),
      feature(
        "F9",
        ["Глибина посадкового уступу", "Seating-step depth"],
        "3 ±0.02",
        3,
        2.98,
        3.02,
        "top",
        [
          "Перевірте обидві вставки в спільному встановленні та після зняття.",
          "Check both inserts in the shared setup and after removal.",
        ],
        [
          "Глибинний мікрометр, контрольна плита.",
          "Depth micrometer and reference plate.",
        ],
        "pockets.0.cutDepth",
      ),
      feature(
        "F10",
        ["Ширина уступу", "Step width"],
        "4 ±0.05",
        4,
        3.95,
        4.05,
        "B",
        [
          "Виміряйте від передньої грані до плечика в обох кінцях.",
          "Measure from the front face to the shoulder at both ends.",
        ],
        caliper,
        "pockets.0.depth",
      ),
      feature(
        "F11",
        [
          "Різниця висоти уступів у парі",
          "Difference between the two step heights",
        ],
        "≤0.02",
        0,
        0,
        0.02,
        "common base",
        [
          "Порівняйте уступи одним індикатором на спільній плиті в чотирьох точках.",
          "Compare the steps with one indicator on a shared plate at four points.",
        ],
        [
          "Індикатор, контрольний місток і плита.",
          "Indicator, reference bridge and surface plate.",
        ],
      ),
    ],
    fixtures: [
      viceFixture(),
      {
        ...carrier("pair-base", 100, 80),
        name: t(
          "Спільна плита для пари вставок",
          "Shared plate for the matched pair",
        ),
        dimensions: t(
          "140 ×120 ×15 мм. Монтажні центри:(40;32,5),(100;32,5),(40;87,5),(100;87,5) мм, Ø8,5 наскрізь. Вставки повернуті уступами одна до одної; проміжок між передніми гранями 30 мм.",
          "140 ×120 ×15 mm. Mounting centres:(40,32.5),(100,32.5),(40,87.5),(100,87.5) mm, Ø8.5 through. Inserts face each other; the gap between their front faces is 30 mm.",
        ),
        geometry: {
          kind: "block",
          width: 140,
          depth: 120,
          height: 15,
          holes: [
            { x: 40, y: 32.5, diameter: 8.5 },
            { x: 100, y: 32.5, diameter: 8.5 },
            { x: 40, y: 87.5, diameter: 8.5 },
            { x: 100, y: 87.5, diameter: 8.5 },
          ],
        },
        hardware: [
          t(
            "Чотири відповідні M8 болти, шайби/гайки під плитою та штатне кріплення самої плити. Довжина має забезпечити зачеплення без упору в стіл.",
            "Four suitable M8 bolts with approved washers/nuts beneath the plate and approved mounting for the plate itself. Select length for engagement without bottoming on the table.",
          ),
        ],
        manufacture: [
          t(
            "Вирівняйте низ і верх плити до 15 ±0,05 мм, обробіть суміжні координатні сторони.",
            "Face the plate bottom/top to 15 ±0.05 mm and machine adjacent coordinate sides.",
          ),
          t(
            "Просвердліть чотири монтажні отвори за наведеними координатами та перевірте кроки 60 і 55 мм.",
            "Drill the four listed mounting holes and verify 60 and 55 mm pitches.",
          ),
          t(
            "Зніміть вихідні задирки й забезпечте дозволені підйомні опори під плитою для гайок; кожна опора повинна бути закріплена.",
            "Remove exit burrs and provide approved secured risers for nut clearance beneath the plate.",
          ),
          t(
            "Виставте дві вставки по виміряних координатах із проміжком 30 мм. Отвори із зазором не є точними установчими штифтами.",
            "Locate both inserts from measured coordinates with 30 mm front-face spacing. Clearance holes are not precision locating pins.",
          ),
          t(
            "Підтвердьте утримання кожної вставки й обхід болтових головок фрезою/тримачем до чистової обробки.",
            "Verify each insert’s retention and cutter/holder clearance to bolt heads before finishing.",
          ),
        ],
        preparation: [
          t(
            "Порівняйте висоти вставок, позначте L/R та перевірте, що головки M8 нижче верхньої площини щонайменше на 0,5 мм.",
            "Compare insert heights, retain L/R marks and verify M8 heads are at least 0.5 mm below the top face.",
          ),
          t(
            "Вставки утримують тільки себе під час власної обробки; контрольний брусок у проміжку не обробляють цим неперевіреним затискачем.",
            "The inserts retain only themselves during their manufacture; do not machine a reference block held by this unaccepted fixture.",
          ),
        ],
        acceptance: [
          t(
            "Контакти A очищені; зміна висоти при затиску не більше 0,02 мм.",
            "Clean A contacts; height change from clamping does not exceed 0.02 mm.",
          ),
          t(
            "Під плитою достатньо місця для гайок, а над уступами — для повного інструментального габариту.",
            "Nuts have adequate clearance below the plate and the full tool envelope clears above the steps.",
          ),
        ],
      },
    ],
    setups: [
      ...squareStock(100, 25, 20).map((s) => ({
        ...s,
        purpose: t(
          `${s.purpose.uk} Повторіть це окреме встановлення для L та R; контролюйте їх як пару.`,
          `${s.purpose.en} Repeat this separate clamping for L and R; inspect them as a matched pair.`,
        ),
      })),
      featureSetup(
        "S70",
        [
          "Отвори й цекування кожної вставки",
          "Drill and counterbore each insert",
        ],
        jaw,
        "vise",
        [
          op(
            "OP10",
            [
              "Центри вертикального інтерфейсу",
              "Locate the vertical mounting interface",
            ],
            [
              "Для кожної вставки від C/B задайте(20;12,5) та(80;12,5) мм. Перевірте симетрію 20 мм до торців. Це вертикальні отвори навчального інтерфейсу, а не звичайні поперечні болти губок.",
              "For each insert locate(20,12.5) and(80,12.5) mm from C/B. Verify 20 mm end symmetry. These are vertical holes for the learning interface, not normal cross-drilled vice-jaw bolts.",
            ],
            [
              "Крайкознімач/щуп, центрувальне свердло.",
              "Edge finder/probe and spotting drill.",
            ],
            [
              "Після центрування залиште діаметральний матеріал під свердління.",
              "After spotting retain diametral material for drilling.",
            ],
            [
              "Перевірте координати обох вставок незалежно.",
              "Verify coordinates independently on both inserts.",
            ],
            ["F1", "F2", "F6"],
            stopLift,
          ),
          op(
            "OP20",
            ["Наскрізні отвори Ø8,5", "Drill Ø8.5 through"],
            [
              "Встановіть технологічні виходи під отворами; просвердліть Ø8,5 через 20 мм. Не свердліть у тверді паралелі. Повторіть для другої вставки зі збереженням L/R.",
              "Provide exit clearances beneath the holes; drill Ø8.5 through 20 mm. Do not drill into hardened parallels. Repeat for the second insert while preserving L/R identity.",
            ],
            [
              "Свердло Ø8,5 та придатна підкладка.",
              "Ø8.5 drill and suitable backing.",
            ],
            ["Робочий діаметр 8,50–8,65 мм.", "Working diameter 8.50–8.65 mm."],
            [
              "Перевірте обидва отвори та вихід.",
              "Check both holes and exits.",
            ],
            ["F6"],
            stopLift,
          ),
          op(
            "OP30",
            ["Плоскодонне цекування", "Make flat-bottom counterbores"],
            [
              "По осі кожного отвору виконайте Ø14 до 9,00 мм від верху. Використайте відповідний цекувальний інструмент або інтерполяцію меншою фрезою; Ø14 свердло з конічною вершиною не створить потрібного дна.",
              "At each hole axis make Ø14 to 9.00 mm below the top. Use a suitable counterboring tool or interpolate with a smaller end mill; a pointed Ø14 drill will not make the required floor.",
            ],
            [
              "Цеківка з напрямною або кінцева фреза для інтерполяції.",
              "Piloted counterbore or end mill for interpolation.",
            ],
            [
              "Діаметр 14,00–14,10 мм, глибина 8,95–9,05 мм.",
              "Diameter 14.00–14.10 mm, depth 8.95–9.05 mm.",
            ],
            [
              "Примірте фактичну M8 головку та перевірте глибину без підкладених шайб, якщо їх не передбачено.",
              "Check the actual M8 head and depth without unplanned washers.",
            ],
            ["F7", "F8"],
            [
              "За виходу цекування за межі стінки або залишку недостатньої товщини під головкою припиніть.",
              "Stop if the counterbore breaks out of a wall or leaves inadequate material beneath the head.",
            ],
          ),
        ],
      ),
      {
        ...featureSetup(
          "S80",
          [
            "Спільний фініш двох уступів",
            "Finish the two steps in one assembly",
          ],
          jaw,
          "pair-base",
          [
            op(
              "OP10",
              [
                "Виставити пару й контрольний нуль",
                "Align the pair and establish zero",
              ],
              [
                "Розташуйте L/R на спільній плиті за її картою координат, уступами всередину проміжку 30 мм. Перевірте висоти, повний контакт A й утримання чотирма болтами. Не використовуйте контрольний брусок як силову розпірку.",
                "Place L/R on the common plate using its coordinate map, steps facing into the 30 mm gap. Verify heights, full A seating and retention by four bolts. Do not use a reference block as a force-producing spacer.",
              ],
              [
                "Індикатор, кінцеві міри й перевірений щуп.",
                "Indicator, gauge blocks and verified probe.",
              ],
              [
                "До уступу ще 3 мм; верхні площини пари мають бути в межах різниці 0,02 мм.",
                "The steps still have 3 mm stock; the paired top faces must agree within 0.02 mm.",
              ],
              [
                "Порівняйте обидві поверхні одним встановленням індикатора.",
                "Compare both top faces without resetting the indicator.",
              ],
              ["F3", "F11"],
              stopLift,
            ),
            op(
              "OP20",
              ["Вибрати уступи 3 ×4 мм", "Cut the 3 ×4 mm steps"],
              [
                "Меншою фрезою обробіть відкритий внутрішній край кожної вставки: глибина 3,00, ширина 4,00 мм. Чорново залиште 0,10 мм на висоту й 0,15 мм на стінку; завершіть обидві висоти одним незмінним Z.",
                "With a smaller cutter machine each open inner edge:3.00 mm deep and 4.00 mm wide. Rough with 0.10 mm height and 0.15 mm wall stock; finish both step heights at the same unchanged Z.",
              ],
              [
                "Гостра Ø6 кінцева фреза; перевірений обхід головок M8.",
                "Sharp Ø6 end mill with verified M8-head clearance.",
              ],
              [
                "Фініш до F9/F10; не використовувати незаявлену автоматичну компенсацію зносу.",
                "Finish to F9/F10; do not apply unplanned automatic wear compensation.",
              ],
              [
                "Перевірте уступи глибинним мікрометром та індикаторним містком.",
                "Check steps with a depth micrometer and indicator bridge.",
              ],
              ["F9", "F10", "F11"],
              [
                "За зсуву вставки або контакту фрези з болтом припиніть; просте повторне затягування не відновлює базу.",
                "Stop for insert movement or cutter-to-bolt contact; simply retightening does not restore the datum.",
              ],
            ),
            op(
              "OP30",
              [
                "Перевірити пару після повторної посадки",
                "Check the pair after reseating",
              ],
              [
                "Зніміть обидві вставки, очистіть, поверніть на свої L/R місця й знову порівняйте уступи. На нерухомій парі перевірте опору контрольної пластини, не виконуючи різання цієї пластини.",
                "Remove both inserts, clean, return them to their assigned L/R positions and compare steps again. On the stationary assembly check reference-plate support without machining that plate.",
              ],
              [
                "Контрольна пластина, індикатор, плита.",
                "Reference plate, indicator and surface plate.",
              ],
              [
                "Зміна різниці висот у межах 0,02 мм.",
                "Step-height difference remains within 0.02 mm.",
              ],
              [
                "F11 підтверджено після реальної перестановки.",
                "Verify F11 after an actual removal/refit.",
              ],
              ["F9", "F10", "F11"],
              [
                "Нерівномірний контакт або зміна висоти вимагає перевірки баз, а не сильнішого затиску.",
                "Uneven contact or changed height requires datum checks rather than stronger clamping.",
              ],
            ),
          ],
        ),
        orientation: t(
          "Пара L/R на спільній плиті; місцеві координати кожної вставки віддзеркалені так, щоб уступи були всередину проміжку.",
          "L/R pair on the common plate; local coordinates are mirrored so both steps face the gap.",
        ),
      },
      reverseInspection(jaw, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
      ]),
    ],
    cutting: [],
    pitfalls: [
      t(
        "Звичайні губки лещат мають інший напрямок кріплення; не переносіть ці отвори на випадкові лещата.",
        "Ordinary vice jaws use another mounting direction; do not transfer this pattern to an arbitrary vice.",
      ),
      t(
        "Окремо чистові уступи з різними Z можуть мати правильну глибину, але різну висоту в парі.",
        "Separately finished steps using different Z references may have correct individual depth but mismatched assembled height.",
      ),
    ],
  },
];

function drillPattern(
  g: BlockGeometry,
  diameter: number,
  refs: string[],
): ManufacturingOperation[] {
  const coordinates = (g.holes || [])
    .filter((h) => h.diameter === diameter)
    .map((h) => `(${h.x}; ${h.y})`)
    .join(", ");
  return [
    op(
      "OP10",
      ["Прив’язати центри від A/B/C", "Locate centres from A/B/C"],
      [
        `Установіть X0 від C, Y0 від B і Z0 зверху. Обробіть короткі центрувальні заходи в точках ${coordinates} мм. Незалежно перевірте протилежні краї габариту ${g.width} ×${g.depth} мм.`,
        `Set X0 from C, Y0 from B and Z0 on top. Spot the centres ${coordinates} mm. Independently check the opposite edges of the ${g.width} ×${g.depth} mm envelope.`,
      ],
      [
        "Щуп/крайкознімач і центрувальне свердло.",
        "Probe/edge finder and spotting drill.",
      ],
      [
        "Центрування лише на потрібну глибину; воно не є готовою фаскою.",
        "Spot only to the required depth; a spot is not automatically the final chamfer.",
      ],
      [
        "Перевірте перший центр по двох координатах до повного свердління.",
        "Verify the first centre in both coordinates before full drilling.",
      ],
      refs,
      stopLift,
    ),
    op(
      "OP20",
      [`Просвердлити Ø${diameter}`, `Drill Ø${diameter}`],
      [
        `Підтвердіть фактичний розмір пробним отвором. Свердліть у точках ${coordinates}; повний діаметр проходить ${g.height} мм матеріалу, а вістря залишається в передбаченому виході. Слідкуйте за вільним виходом стружки.`,
        `Confirm actual size with a test hole. Drill at ${coordinates}; full diameter passes ${g.height} mm of material while the point remains in the planned exit clearance. Maintain free chip evacuation.`,
      ],
      [
        `Коротке свердло Ø${diameter}, придатне для матеріалу й тримача.`,
        `Short Ø${diameter} drill suited to the material and holder.`,
      ],
      [
        "Геометрію виходу перевіряють за реальною вершиною; не припускайте додаткові 5 мм подачі без розрахунку.",
        "Check exit geometry using the actual point; do not assume an extra 5 mm of travel without calculation.",
      ],
      [
        "Перший отвір перевірте до повторення, потім проконтролюйте кожний.",
        "Inspect the first hole before repeating, then verify each hole.",
      ],
      refs,
      [
        "Зупиніться при забитій канавці, зсуві деталі, сліді торкання притиска або підкладки поза виходом.",
        "Stop for a packed flute, work movement or contact with a clamp/backing outside the exit clearance.",
      ],
    ),
    op(
      "OP30",
      [
        "Кромки й незалежний контроль розташування",
        "Deburr and independently check location",
      ],
      [
        "Зніміть верхні задирки, після звільнення — нижні. Виміряйте діаметри та розташування від A/B/C контрольними штифтами; вільне вставляння кріплення не доводить координатну точність.",
        "Deburr entries and, after release, exits. Inspect diameter and position from A/B/C using checking pins; loose fastener insertion does not prove coordinate accuracy.",
      ],
      [
        "Ручний дебурер, контрольні штифти, висотомір/координатна система.",
        "Hand deburrer, checking pins and height/coordinate measuring system.",
      ],
      [
        "Зберігайте циліндричну робочу ділянку отвору; фаска лише на кромці.",
        "Preserve the cylindrical working length; chamfer the edge only.",
      ],
      [
        "Зберігайте результати для кожного отвору окремо.",
        "Record each hole separately.",
      ],
      refs,
      [
        "За невизначеності вимірювання, співмірної з допуском, не ставте позначку відповідності.",
        "Do not mark conformity when measurement uncertainty is comparable to the tolerance.",
      ],
    ),
  ];
}
function pocketOps(
  g: BlockGeometry,
  refs: string[],
  toolDiameter: number,
): ManufacturingOperation[] {
  const q = g.pockets![0];
  return [
    op(
      "OP10",
      ["Перевірити вхід та чорновий об’єм", "Verify entry and roughing volume"],
      [
        `Кишеня: X=${q.x}…${q.x + q.width}, Y=${q.y}…${q.y + q.depth}, дно на${q.cutDepth} мм нижче верху. Перевірте модель Ø${toolDiameter} фрези, тримача й допустимий вхід; не врізайтесь вертикально інструментом без відповідного дозволу.`,
        `Pocket: X=${q.x}…${q.x + q.width}, Y=${q.y}…${q.y + q.depth}, floor${q.cutDepth} mm below the top. Verify the Ø${toolDiameter} cutter, holder and permitted entry; do not plunge with a tool not approved for it.`,
      ],
      [
        `Ø${toolDiameter} кінцева фреза з придатною геометрією й робочою довжиною.`,
        `Ø${toolDiameter} end mill with appropriate geometry and flute length.`,
      ],
      [
        "Чорново залишайте 0,30 мм на кожній стінці й 0,20 мм на дні.",
        "Rough with 0.30 mm on each wall and 0.20 mm on the floor.",
      ],
      [
        "Порівняйте фактичний залишок із картою; нуль та знак глибини перевірені.",
        "Compare actual stock with the plan; verify origin and depth sign.",
      ],
      refs,
      stopLift,
    ),
    op(
      "OP20",
      [
        "Вибрати шарами, не перевантажуючи кути",
        "Remove layers without overloading corners",
      ],
      [
        `Доведіть чорнову глибину до${mm(q.cutDepth - 0.2)} мм. Радіус внутрішніх кутів номінальноR${q.cornerRadius}; стратегія має уникати раптового збільшення контакту при заході в кут. Видаліть стружку у визначені зупинки.`,
        `Rough to${mm(q.cutDepth - 0.2)} mm depth. Nominal internal corners areR${q.cornerRadius}; use a strategy that avoids a sudden engagement increase in corners. Remove chips at planned stops.`,
      ],
      [
        `Та сама Ø${toolDiameter} фреза; подачу й глибину шару підтвердьте за її картою.`,
        `Same Ø${toolDiameter} cutter; confirm feed and layer depth using its data.`,
      ],
      [
        "Залишок 0,30 мм стінок та 0,20 мм дна перевіряють перед фінішем.",
        "Verify 0.30 mm wall and 0.20 mm floor stock before finishing.",
      ],
      [
        "Виміряйте глибину та залишкові стінки; при розвантаженні деталь не має втрачати базу.",
        "Inspect depth and remaining walls; releasing the work must not destroy datum seating.",
      ],
      refs,
      [
        "При нарості, плавленні, забитій кишені або прогині стінки зупиніться й перегляньте всю систему.",
        "Stop for built-up edge, melting, packed chips or wall deflection and reassess the whole system.",
      ],
    ),
    op(
      "OP30",
      ["Чистовий контур і дно", "Finish the contour and floor"],
      [
        `Після перевірки залишку завершіть дно до${q.cutDepth} мм, а контур — до${q.width} ×${q.depth} мм. Для поля точності≤0,05 мм виміряйте перший фінішний залишок і зробіть обґрунтовану поправку лише в межах припуску.`,
        `After verifying stock finish the floor to${q.cutDepth} mm and contour to${q.width} ×${q.depth} mm. For a tolerance field≤0.05 mm measure the first finishing remainder and make an evidence-based correction only within available stock.`,
      ],
      [
        "Чиста чистова фреза; для вузьких кутів — визначена менша фреза.",
        "Clean finishing cutter; use the specified smaller cutter for narrow corners.",
      ],
      [
        "Не «доводьте» розмір повторними проходами без вимірювання; перевірте радіуси по кресленню.",
        "Do not chase size with repeated unmeasured passes; inspect drawing corner radii.",
      ],
      [
        "Після звільнення повторіть ширину, довжину, глибину та площину A.",
        "After release recheck width, length, depth and face A.",
      ],
      refs,
      [
        "Якщо розмір уже за верхньою межею або локально немає припуску, різання не поверне втрачений матеріал.",
        "If size already exceeds its upper limit or stock is locally absent, further cutting cannot restore material.",
      ],
    ),
  ];
}
const jig: BlockGeometry = {
  kind: "block",
  width: 80,
  depth: 50,
  height: 16,
  holes: [
    { x: 40, y: 25, diameter: 12 },
    { x: 12, y: 25, diameter: 6.6 },
    { x: 68, y: 25, diameter: 6.6 },
  ],
};
const slotBar: BlockGeometry = {
  kind: "block",
  width: 100,
  depth: 25,
  height: 12,
  slots: [{ x: 50, y: 12.5, length: 50, width: 9, cutDepth: 12, axis: "x" }],
};
const bearingBlock: BlockGeometry = {
  kind: "block",
  width: 60,
  depth: 40,
  height: 20,
  holes: [
    { x: 30, y: 20, diameter: 10, counterbore: { diameter: 22, depth: 7.2 } },
  ],
};
const key: BlockGeometry = {
  kind: "block",
  width: 80,
  depth: 10,
  height: 8,
  holes: [
    { x: 10, y: 5, diameter: 3.4 },
    { x: 70, y: 5, diameter: 3.4 },
  ],
};
const tray: BlockGeometry = {
  kind: "block",
  width: 100,
  depth: 70,
  height: 20,
  pockets: [
    { x: 10, y: 10, width: 80, depth: 50, cutDepth: 12, cornerRadius: 5 },
  ],
};
const contour: BlockGeometry = {
  kind: "block",
  width: 90,
  depth: 60,
  height: 10,
  cornerRadius: 6,
  holes: [
    { x: 10, y: 10, diameter: 5.5 },
    { x: 80, y: 10, diameter: 5.5 },
    { x: 10, y: 50, diameter: 5.5 },
    { x: 80, y: 50, diameter: 5.5 },
  ],
};
const nest: BlockGeometry = {
  kind: "block",
  width: 100,
  depth: 70,
  height: 16,
  pockets: [
    {
      x: 19.98,
      y: 19.98,
      width: 60.04,
      depth: 30.04,
      cutDepth: 6,
      cornerRadius: 3,
    },
  ],
};
const cover: BlockGeometry = {
  kind: "block",
  width: 100,
  depth: 70,
  height: 6,
  cornerRadius: 4,
  holes: [
    { x: 8, y: 8, diameter: 4.5 },
    { x: 92, y: 8, diameter: 4.5 },
    { x: 8, y: 62, diameter: 4.5 },
    { x: 92, y: 62, diameter: 4.5 },
  ],
};

millingProjects.push(
  {
    ...base({
      id: "drill-jig-plate",
      title: t(
        "Кондукторна плита під змінний зразок",
        "Drill-jig plate for a repeat coupon",
      ),
      summary: t(
        "Точний отвір під каталожну загартовану втулку, координати монтажу, стійки з виходом стружки та перевірка контрольної деталі.",
        "A precision hole for a catalogued hardened bushing, mounting coordinates, chip-clearance spacers and a checked first coupon.",
      ),
      level: "advanced",
      family: "fixturing",
      part: jig,
      duration: t(
        "12–18 годин із базою кондуктора та вимірюванням посадки.",
        "12–18 hours including jig base and fit inspection.",
      ),
      purpose: t(
        "Навчальний кондуктор одного Ø6,6 отвору в нерухомій пластині 6082. Виробничу серію дозволяють лише після перевірки реальної втулки, натягу, утримання та точності першого зразка.",
        "Learning jig for one Ø6.6 hole in a stationary 6082 coupon. Production use requires verification of the actual bushing, interference, retention and first-piece accuracy.",
      ),
    }),
    features: [
      ...envelope(80, 50, 16),
      feature(
        "F6",
        ["Монтажний отвір втулки", "Bushing mounting bore"],
        "Ø12.000…12.018",
        12,
        12,
        12.018,
        "A/B/C",
        [
          "Перевірте дві глибини й два напрямки. Це лише геометричне поле отвору; утримання підтверджується окремою вимогою F11 за фактичним діаметром втулки й схваленим виробником натягом для 6082.",
          "Check two depths and two directions. This is only the bore geometry interval; retention requires separate F11 acceptance using measured bushing OD and maker-approved interference for 6082.",
        ],
        [
          "Атестовані граничні пробки або нутромір із доведеною похибкою, достатньою для поля 18 мкм.",
          "Verified limit plugs or a bore comparator with demonstrated error suitable for an 18 µm interval.",
        ],
        "holes.0.diameter",
      ),
      coordinateFeature("F7", "X", 40, "holes.0.x", 0.03),
      coordinateFeature("F8", "Y", 25, "holes.0.y", 0.03),
      feature(
        "F9",
        ["Координати двох монтажних отворів", "Two mounting-hole coordinates"],
        "X=12/68; Y=25 ±0.05",
        12,
        11.95,
        12.05,
        "B/C",
        [
          "Контролюйте X=12 і 68 та Y=25 окремо через штифти.",
          "Check X=12 and 68 and Y=25 separately using pins.",
        ],
        heightGauge,
        "holes.1.x",
      ),
      feature(
        "F10",
        ["Монтажні отвори під M6", "M6 mounting holes"],
        "2 × Ø6.6 +0.15/0",
        6.6,
        6.6,
        6.75,
        "A",
        [
          "Перевірте обидва отвори після зняття задирок.",
          "Inspect both holes after deburring.",
        ],
        boreGauge,
        "holes.1.diameter",
      ),
      {
        id: "F11",
        name: t(
          "Підтвердження фактичної посадкової пари",
          "Acceptance of the actual fitted pair",
        ),
        spec: "Measured pair + maker-approved fit/material",
        unit: "visual",
        datum: "bushing axis",
        method: t(
          "До фінішу отримайте дозволений натяг для саме цієї втулки та 6082. Обчисліть допустимий отвір як ODвтулки−натяг і перетніть із 12,000–12,018 мм. Порожній перетин або відсутність підтвердження зупиняє маршрут; самі H7/n6 не доводять утримання.",
          "Before finishing obtain the approved interference for this bushing and 6082. Calculate permissible bore as bushing OD minus interference and intersect with 12.000–12.018 mm. An empty intersection or missing approval stops the route; H7/n6 alone does not prove retention.",
        ),
        instrument: t(
          "Документація виробника, мікрометр OD та придатний нутромір/пробки; запис фактичної пари.",
          "Manufacturer documentation, OD micrometer and suitable bore comparator/plugs; record the actual matched pair.",
        ),
      },
    ],
    fixtures: [
      viceFixture(),
      carrier("boring-backing", 80, 50, jig.holes),
      {
        ...carrier("jig-base", 80, 50),
        geometry: {
          kind: "block",
          width: 120,
          depth: 90,
          height: 15,
          holes: [
            { x: 32, y: 45, diameter: 6.6 },
            { x: 88, y: 45, diameter: 6.6 },
            { x: 60, y: 45, diameter: 8.6, depth: 3 },
          ],
        },
        name: t(
          "База кондуктора, стійки та контрольний упор",
          "Jig base, spacers and coupon stop",
        ),
        purpose: t(
          "Окремо утримати зразок і кондуктор, залишивши контрольований вихід стружки.",
          "Retain the coupon and jig separately while maintaining a defined chip escape.",
        ),
        dimensions: t(
          "База 120 ×90 ×15 мм; плита зі зміщенням 20 мм. Дві стійки під центрами монтажу(32;45),(88;45) мм. Висота стійок H=товщина зразка 6,00 + проміжок до торця втулки 6,60 + фактичний виступ втулки нижче плити.",
          "Base 120 ×90 ×15 mm; plate offset 20 mm. Two spacers at mounting centres(32,45),(88,45) mm. Spacer height H=6.00 mm coupon thickness +6.60 mm bushing-end clearance + measured bushing projection below the plate.",
        ),
        hardware: [
          t(
            "Каталожна втулка norelem 08900-A 0660 X16: номінально ID 6,6/OD 12/L 16 мм; підтвердьте поточне креслення, фактичні діаметри та дозволену посадку.",
            "Catalogued norelem 08900-A 0660 X16 bushing: nominal ID 6.6/OD 12/L 16 mm; verify current drawing, actual diameters and permitted fit.",
          ),
          t(
            "Два M6 болти з придатним зачепленням та окремі штатні притиски зразка 40 ×30 ×6 мм.",
            "Two M6 bolts with suitable engagement and separate approved clamps for a 40 ×30 ×6 mm coupon.",
          ),
        ],
        manufacture: [
          t(
            "Виготовте й перевірте основу 120 ×90 ×15 мм, координатний кут і площину підтримки зразка.",
            "Make and inspect the 120 ×90 ×15 mm base, coordinate corner and coupon-support plane.",
          ),
          t(
            "Задайте монтажні центри плити зі зміщенням 20 мм; кріпильний інтерфейс основи виконайте під обрані штатні гайки/болти, не припускаючи довжину зачеплення.",
            "Transfer plate mounting centres at 20 mm offset; prepare the base interface for the selected approved nuts/bolts without assuming engagement length.",
          ),
          t(
            "Виміряйте встановлену втулку й обчисліть H. Виготовте дві парні стійки з різницею висот≤0,02 мм; не задавайте H лише за номінальною довжиною втулки.",
            "Measure the installed bushing and calculate H. Make two matched spacers differing by≤0.02 mm; do not derive H only from nominal bushing length.",
          ),
          t(
            "Поставте зразок окремо між жорсткими упорами на A. Під майбутнім Ø6,6 отвором виконайте вихід Ø8,6 ×3 мм, перевірений від центра втулки.",
            "Seat the coupon independently against rigid stops on A. Make an Ø8.6 ×3 mm exit relief under the intended Ø6.6 hole, located from the bushing axis.",
          ),
          t(
            "Зберіть без свердла, перевірте проміжок 6,60 мм до фактичного торця втулки та незалежне утримання зразка.",
            "Assemble without a drill, verify 6.60 mm clearance to the actual bushing end and independent coupon retention.",
          ),
        ],
        preparation: [
          t(
            "Для складання втулки використайте контрольований прес і підтримку навколо монтажного отвору за вказівками виробника; не забивайте її молотком.",
            "Install the bushing with a controlled press and local bore support under its maker’s instructions; do not hammer it in.",
          ),
          t(
            "Виміряйте отвір втулки після встановлення; невірний натяг може деформувати напрямну.",
            "Measure the bushing ID after installation; incorrect interference can distort the guide.",
          ),
        ],
        acceptance: [
          t(
            "F11 підтверджено до складання: фактична пара й матеріал схвалені виробником. Дані H7 для іншої s6 втулки не переносять на n6. Без цього заборонені запресовування та пробне свердління.",
            "Accept F11 before assembly: the actual pair and material are maker-approved. H7 data for another s6 bushing cannot be transferred to n6. Without this, do not press-fit or trial-drill.",
          ),
          t(
            "Перший отвір у зразку перевірений від його власних баз; прохід свердла через втулку сам по собі не підтверджує точність.",
            "Inspect the first coupon hole from its own datums; drill passage through the bushing alone does not establish accuracy.",
          ),
        ],
      },
    ],
    setups: [
      ...squareStock(80, 50, 16),
      featureSetup(
        "S70",
        [
          "Точний монтажний отвір і кріплення",
          "Precision mounting bore and mounting holes",
        ],
        jig,
        "boring-backing",
        [
          op(
            "OP10",
            ["Прив’язати монтажний центр", "Locate the bushing centre"],
            [
              "Від C/B установіть центр(40;25) мм і незалежно перевірте симетрію. Пройдіть центрування й свердління доØ11,5, залишивши 0,5 мм по діаметру під розточування.",
              "Locate(40,25) mm from C/B and independently verify symmetry. Spot and drill toØ11.5, retaining 0.5 mm diametral stock for boring.",
            ],
            [
              "Центрувальне свердло, Ø11,5 свердло та короткий тримач.",
              "Spotting drill, Ø11.5 drill and short holder.",
            ],
            [
              "0,50 мм по діаметру; не приймайте свердлений отвір за монтажну посадку.",
              "0.50 mm diametral stock; the drilled hole is not the mounting fit.",
            ],
            [
              "Контроль центра до розточування, осьова зона виходу перевірена.",
              "Check centre before boring and verify axial exit space.",
            ],
            ["F6", "F7", "F8"],
            stopLift,
          ),
          op(
            "OP20",
            ["Розточити й виміряти посадку", "Bore and inspect the fit"],
            [
              "До остаточного розточування виміряйте OD втулки й отримайте схвалений виробником інтервал натягу для 6082. Обчисліть перетин допустимого отвору з 12,000–12,018 мм за F11. Лише за непорожнього підтвердженого поля розточуйте від 11,95 мм до його середини;12,009 мм є ціллю тільки якщо потрапляє у схвалене поле. Перевірте дві глибини й два напрямки.",
              "Before final boring measure bushing OD and obtain the maker-approved interference interval for 6082. Intersect its permissible bore interval with 12.000–12.018 mm under F11. Only with a nonempty approved interval bore from 11.95 mm towards its midpoint;12.009 mm is a target only when inside that approved interval. Inspect two depths and two directions.",
            ],
            [
              "Регульована розточувальна головка/прецизійна розточувальна система, відповідний нутромір.",
              "Adjustable boring head/precision boring system and suitable bore comparator.",
            ],
            [
              "Останній діаметральний залишок визначають вимірюванням; допустима межа 12,000–12,018 мм.",
              "Determine final diametral stock by measurement; permissible limits 12.000–12.018 mm.",
            ],
            [
              "Щонайменше дві глибини×два напрямки; порівняйте з реальною втулкою та її інструкцією посадки.",
              "At least two depths×two directions; compare with the actual bushing and its fit instructions.",
            ],
            ["F6", "F7", "F8", "F11"],
            [
              "За похибки контролю, яка не дозволяє вирішити відповідність 18 мкм поля, зупиніться до отримання придатного засобу.",
              "Stop until suitable inspection is available if measurement error cannot resolve conformity within the 18 µm interval.",
            ],
          ),
          op(
            "OP30",
            ["Два монтажні отвори", "Two mounting holes"],
            [
              "Просвердліть Ø6,6 у(12;25) та(68;25) мм без зміни X0/Y0; зніміть задирки й проконтролюйте координати. Монтажний точний отвір захистіть від подряпин.",
              "Drill Ø6.6 at(12,25) and(68,25) mm without changing X0/Y0; deburr and inspect coordinates. Protect the precision mounting bore from scratches.",
            ],
            [
              "Центрувальне й Ø6,6 свердло; дебурер.",
              "Spotting and Ø6.6 drills; deburring tool.",
            ],
            [
              "Ø6,60–6,75 мм; не розширюйте точний Ø12 отвір дебурером.",
              "Ø6.60–6.75 mm; do not enlarge the precision Ø12 bore with a deburrer.",
            ],
            [
              "F9/F10 обох отворів перевірені.",
              "Verify F9/F10 for both holes.",
            ],
            ["F9", "F10"],
            stopLift,
          ),
        ],
      ),
      {
        id: "S80",
        title: t(
          "Складання кондуктора та контрольний отвір",
          "Assemble the jig and make a first test hole",
        ),
        machine: t(
          "Свердлильний/фрезерний верстат із підтвердженим утриманням кондуктора й окремо закріпленим контрольним зразком.",
          "Drill press/mill with verified jig retention and an independently secured test coupon.",
        ),
        purpose: t(
          "Перевірити всю посадкову пару та кондуктор у зборі до повторних деталей.",
          "Verify the fitted pair and complete jig before repeated parts.",
        ),
        orientation: t(
          "Плита A вниз на двох парних стійках; зразок 40 ×30 ×6 мм окремо на базі під віссю втулки.",
          "Plate A down on two matched spacers; a 40 ×30 ×6 mm coupon is independently seated on the base beneath the bushing axis.",
        ),
        datums: t(
          "Кут плити відновлений від бази. Зразок має власні перевірені A/B/C; його центр X20/Y15 збігається з віссю втулки.",
          "Recover the plate corner from the base. The coupon has its own verified A/B/C; its X20/Y15 centre coincides with the bushing axis.",
        ),
        workholding: t(
          "Болти M6 утримують кондуктор на стійках; окремі штатні притиски утримують зразок від обертання. Упори лише позиціюють і не замінюють затиск.",
          "M6 bolts retain the jig on the spacers; separate approved clamps prevent coupon rotation. Stops locate and do not replace retention.",
        ),
        fixtureIds: ["jig-base"],
        preparation: [
          t(
            "До запресовування F11 має бути підтверджена; без схваленої фактичної пари цей етап не виконується.",
            "Accept F11 before pressing; do not perform this stage without an approved actual fitted pair.",
          ),
          t(
            "Контрольний купон прийнятий за своїми базами та габаритом 40 ×30 ×6 мм; під ним вихідØ8,6 ×3 мм.",
            "The test coupon has accepted datums and a 40 ×30 ×6 mm envelope; the exit below it isØ8.6 ×3 mm.",
          ),
        ],
        operations: [
          op(
            "OP10",
            [
              "Встановити й перевірити втулку",
              "Install and inspect the bushing",
            ],
            [
              "За виконаної F11 запресуйте втулку контрольованим пресом у підтриману локально плиту за схваленою процедурою. Виміряйте її ID після встановлення та перевірте, що вона не зсунута й не деформована.",
              "With F11 satisfied, press the bushing into a locally supported plate using the approved procedure. Measure its ID after installation and check for displacement or distortion.",
            ],
            [
              "Прес із відповідною оправкою, мікрометр/пробки для ID.",
              "Press with a suitable arbor and micrometer/pins for ID.",
            ],
            [
              "Зусилля/натяг беруть зі схваленої карти пари; не забивають молотком і не розгортають загартовану втулку навмання.",
              "Use the approved pair’s force/interference schedule; do not hammer or arbitrarily ream a hardened bushing.",
            ],
            [
              "F11 збережено, ID та осьове положення фактично перевірені.",
              "Retain F11 approval and verify actual ID and axial position.",
            ],
            ["F6", "F11"],
            [
              "За тріщини, надмірного зусилля, вільного входу або звуження ID зупиніть складання.",
              "Stop assembly for cracking, excessive force, a loose fit or ID contraction.",
            ],
          ),
          op(
            "OP20",
            [
              "Зібрати опори й перевірити вихід стружки",
              "Assemble supports and verify chip clearance",
            ],
            [
              "Поставте парні стійки за картою jig-base, підтвердьте їхню висоту за фактичним виступом втулки. До торця втулки над зразком має бути 6,60 мм; виміряйте цей зазор прямо. Закріпіть плиту й зразок окремо та перевірте весь хід свердла без різання.",
              "Fit matched spacers from the jig-base map and verify height using actual bushing projection. Directly measure 6.60 mm clearance from coupon to bushing end. Retain plate and coupon independently and check the complete drill travel without cutting.",
            ],
            [
              "Кінцеві міри/щупи, індикатор, штатний кріпильний комплект.",
              "Gauge blocks/feelers, indicator and approved hardware.",
            ],
            [
              "Купон товщиною 6 мм, технологічний вихід 3 мм; повний діаметр свердла проходить купон, вістря не торкається дна виходу.",
              "Coupon thickness 6 mm, exit relief 3 mm; full drill diameter passes the coupon while its point clears the relief floor.",
            ],
            [
              "Зразок не обертається, втулка утримана, проміжок та Z-обмеження перевірені.",
              "The coupon cannot rotate; bushing retention, gap and Z limits are verified.",
            ],
            ["F7", "F8", "F9", "F10", "F11"],
            stopLift,
          ),
          op(
            "OP30",
            [
              "Виконати й виміряти перший отвір",
              "Drill and inspect the first coupon",
            ],
            [
              "Лише після приймання складання виконайтеØ6,6 отвір придатним свердлом через втулку, без бокового тиску. Зупиняйтеся за підйому втулки або затримки стружки. Зніміть купон і перевірте діаметр 6,60–6,75 мм та координати X20±0,10/Y15±0,10 від його власних баз.",
              "Only after assembly acceptance drillØ6.6 through the bushing with a suitable drill and no side pressure. Stop for bushing lift or chip packing. Remove the coupon and inspect 6.60–6.75 mm diameter and X20±0.10/Y15±0.10 position from its own datums.",
            ],
            [
              "Ø6,6 свердло; перевірені пробки, штифти й висотомір.",
              "Ø6.6 drill; verified gauges, pins and height gauge.",
            ],
            [
              "Це контрольний зразок; невідповідний отвір не виправляють підгином свердла.",
              "This is a first article; do not correct a failed hole by bending the drill.",
            ],
            [
              "Протокол купона збережений окремо від протоколу самої кондукторної плити.",
              "Save coupon inspection separately from jig-plate inspection.",
            ],
            ["F7", "F8", "F11"],
            [
              "За руху втулки, недопустимих координат або непридатного методу контролю повторні деталі не дозволені.",
              "Do not proceed to repeated parts after bushing movement, failed position or unsuitable inspection.",
            ],
          ),
        ],
        inspection: [
          t(
            "Зберігайте фактичні результати купона, положення втулки до/після та висоту проміжку; повторення допускають тільки за прийнятим вузлом.",
            "Record coupon readings, bushing position before/after and chip gap; repeat only with an accepted assembly.",
          ),
        ],
        release: t(
          "Після повної зупинки й потрібної ізоляції відпустіть зразок, зберігаючи підтримку плити.",
          "After a full stop and required isolation release the coupon while maintaining plate support.",
        ),
        transfer: t(
          "Після випробування зніміть плиту для остаточного контролю; не використовуйте успішний отвір як заміну геометричного протоколу плити.",
          "After the trial remove the plate for final inspection; a successful hole does not replace the plate’s geometry record.",
        ),
        diagram: {
          view: "drilling",
          clamping: "fixture-plate",
          flip: false,
          datumA: "bottom",
          toolApproach: "top",
          highlight: t(
            "Окремо закріплені кондуктор і зразок; фактичний проміжок стружки 6,60 мм.",
            "Independently retained jig and coupon; actual chip gap 6.60 mm.",
          ),
        },
      },
      {
        ...reverseInspection(jig, [
          "F1",
          "F2",
          "F3",
          "F4",
          "F5",
          "F6",
          "F7",
          "F8",
          "F9",
          "F10",
        ]),
        transfer: t(
          "Після приймання плити встановіть підтверджену втулку та зберіть кондуктор на jig-base. Навчальний пробний отвір виконується лише після окремої перевірки утримання, проміжку стружки й меж свердління; результати зразка додайте до протоколу.",
          "After plate acceptance install the verified bushing and assemble on jig-base. Make a trial coupon hole only after separate retention, chip-clearance and drilling-limit checks; add coupon measurements to the record.",
        ),
      },
    ],
    cutting: [],
    pitfalls: [
      t(
        "Поля 18 мкм не можна підтвердити випадковим штангенциркулем.",
        "An 18 µm interval cannot be verified with arbitrary calipers.",
      ),
      t(
        "Більш довга втулка без виходу стружки може грітися й витягуватися інструментом.",
        "A longer bushing without chip escape can overheat and be pulled out by the tool.",
      ),
    ],
    sources: [
      ...commonSources,
      "proj-mill-bore",
      "proj-mill-bushing",
      "proj-mill-norelem-cyl",
    ],
  },
  {
    ...base({
      id: "slotted-clamp-bar",
      title: t(
        "Пазова притискна планка для стенда",
        "Slotted clamp bar for a bench fixture",
      ),
      summary: t(
        "C45,100 ×25 ×12 мм, наскрізний паз 50 ×9 мм із контрольованим обводом, жертовною опорою та окремим фінальним контролем.",
        "C45,100 ×25 ×12 mm, a through 50 ×9 mm slot with a checked contour, sacrificial support and independent final inspection.",
      ),
      level: "intermediate",
      family: "milling",
      part: slotBar,
      material: t(
        "C45 у нормалізованому стані, твердість підтверджена за постачанням.",
        "C45 in the normalised condition, delivery hardness verified.",
      ),
      duration: t(
        "8–12 годин із опорною плитою.",
        "8–12 hours including a support plate.",
      ),
      purpose: t(
        "Планка для нерухомого настільного стенда без заданої допустимої сили. Використання як верстатного притискача потребує розрахунку міцності, болта й опор; виготовлення не надає рейтингу навантаження.",
        "Bar for a stationary bench fixture with no assigned load rating. Machine-clamping use requires strength, bolt and support design; manufacture does not establish load capacity.",
      ),
    }),
    features: [
      ...envelope(100, 25, 12),
      feature(
        "F6",
        ["Ширина пазу", "Slot width"],
        "9 +0.10/0",
        9,
        9,
        9.1,
        "B",
        [
          "Виміряйте щонайменше в трьох перерізах; кінцеві радіуси не замінюють контроль паралельних стінок.",
          "Measure at least three sections; end radii do not replace checking the parallel walls.",
        ],
        [
          "Плоскі/циліндричні контрольні калібри, внутрішній мікрометр або придатні пробки.",
          "Flat/cylindrical checking gauges, inside micrometer or suitable pins.",
        ],
        "slots.0.width",
      ),
      feature(
        "F7",
        ["Загальна довжина пазу", "Overall slot length"],
        "50 ±0.10",
        50,
        49.9,
        50.1,
        "C",
        [
          "Перевірте між крайніми точками двох півкіл; відстань між центрами 41 мм не дорівнює загальним 50 мм.",
          "Check between the extreme points of both semicircles;41 mm centre spacing is not the 50 mm overall length.",
        ],
        caliper,
        "slots.0.length",
      ),
      feature(
        "F8",
        ["Центр пазу X", "Slot centre X"],
        "50 ±0.05",
        50,
        49.95,
        50.05,
        "C",
        [
          "Виміряйте обидва крайні положення пазу й обчисліть середину.",
          "Measure both extreme slot positions and calculate the midpoint.",
        ],
        heightGauge,
        "slots.0.x",
      ),
      feature(
        "F9",
        ["Центр пазу Y", "Slot centre Y"],
        "12.5 ±0.05",
        12.5,
        12.45,
        12.55,
        "B",
        [
          "Перевірте відстань від B до кожної стінки та рівність бічних перемичок.",
          "Check B-to-each-wall distance and equal side ligaments.",
        ],
        heightGauge,
        "slots.0.y",
      ),
    ],
    fixtures: [viceFixture(), carrier("slot-carrier", 100, 25)],
    setups: [
      ...squareStock(100, 25, 12),
      featureSetup(
        "S70",
        ["Наскрізний паз із підтримкою", "Supported through-slot milling"],
        slotBar,
        "slot-carrier",
        [
          op(
            "OP10",
            [
              "Кінцеві центри та початковий вхід",
              "End centres and initial entry",
            ],
            [
              "Для пазу 50 ×9 мм крайні центри півкіл:X=29,5 і 70,5 мм. Перевірте формулу до різання: (50−9)/2=20,5; правильні центри 29,5 та 70,5 мм при Y=12,5. Зробіть стартовий отвір усередині майбутнього пазу меншим діаметром без виходу за його контур.",
              "For a 50 ×9 mm slot calculate semicircle centres before cutting:(50−9)/2=20.5, giving X=29.5 and 70.5 mm at Y=12.5. Make a smaller starter hole inside the future slot without crossing its contour.",
            ],
            [
              "Центрувальне свердло та стартове свердло, узгоджене з входом фрези.",
              "Spotting drill and a starter drill compatible with cutter entry.",
            ],
            [
              "Початковий отвір залишається всередині пазу; не свердліть кінцеві Ø9 без запасу на фініш.",
              "Keep the starter inside the slot; do not drill the ends toØ9 without finishing stock.",
            ],
            [
              "Звірте обидва центри, довжину 50 мм та бічні перемички 8 мм.",
              "Verify both centres,50 mm total length and 8 mm side ligaments.",
            ],
            ["F6", "F7", "F8", "F9"],
            stopLift,
          ),
          op(
            "OP20",
            [
              "Чорновий паз меншою фрезою",
              "Rough the slot with a smaller cutter",
            ],
            [
              "Фрезою Ø6 виконайте чорновий обвід шириною 8,6 мм, залишивши 0,20 мм на кожній стінці. До дна залиште 0,20 мм; перед наскрізним виходом ще раз перевірте кріплення обох кінців планки.",
              "Use a Ø6 cutter to rough 8.6 mm width, leaving 0.20 mm on each wall. Retain 0.20 mm floor stock; verify retention at both bar ends again before breakthrough.",
            ],
            ["Коротка Ø6 кінцева фреза для C45.", "Short Ø6 end mill for C45."],
            [
              "0,20 мм на стінках і 0,20 мм до виходу.",
              "0.20 mm wall stock and 0.20 mm before breakthrough.",
            ],
            [
              "Ширина й залишок виміряні; притиски на кінцях не перекривають обвід або тримач.",
              "Measure width and remaining stock; end clamps do not overlap the cutter or holder path.",
            ],
            ["F6", "F7", "F8", "F9"],
            [
              "Зупиніться, якщо планка пружинить або незакріплений язичок може відламатися.",
              "Stop if the bar springs or an unrestrained tab could break off.",
            ],
          ),
          op(
            "OP30",
            [
              "Наскрізний вихід і чистовий обвід",
              "Break through and finish the contour",
            ],
            [
              "Після підтвердження Z пройдіть матеріал на 0,20 мм у жертовну плиту. Завершіть стінки й півкола до 9,00 ×50,00 мм; обробляйте обидві сторони від одного нуля, а не від уже вирізаної стінки.",
              "After verifying Z, pass 0.20 mm into the sacrificial plate. Finish walls and semicircles to 9.00 ×50.00 mm; reference both sides from one origin rather than the first milled wall.",
            ],
            [
              "Та сама або окрема чистова Ø6 фреза з перевіреним радіусом.",
              "Same or separate Ø6 finishing cutter with a verified radius.",
            ],
            [
              "Наскрізний паз; приймання ширини 9,00–9,10 мм і довжини 49,90–50,10 мм.",
              "Through slot; accept width 9.00–9.10 mm and length 49.90–50.10 mm.",
            ],
            [
              "Перевірте три перерізи ширини, кінці та положення центра після звільнення.",
              "Check width at three sections, both ends and centre location after release.",
            ],
            ["F6", "F7", "F8", "F9"],
            [
              "Не приймайте довжину тільки за переміщенням центрів: до нього додається діаметр кінців.",
              "Do not accept overall length from centre travel alone: end diameter must be included.",
            ],
          ),
        ],
      ),
      reverseInspection(slotBar, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
      ]),
    ],
    cutting: [],
    pitfalls: [
      t(
        "Для довжини 50 і ширини 9 відстань між центрами дорівнює 41 мм, не 40,5. Звіряйте арифметику й крайні точки перед різанням.",
        "For 50 overall length and 9 width the centre spacing is 41 mm, not 40.5. Verify arithmetic and extreme points before cutting.",
      ),
      t(
        "Зусилля реального притискача не визначається лише матеріалом C45: важливі опори, виліт, паз, болт і момент.",
        "A real clamp’s force is not determined by C45 alone: supports, overhang, slot, bolt and torque all matter.",
      ),
    ],
    sources: [...commonSources, "proj-mill-slot"],
  },
  {
    ...base({
      id: "bearing-seat-block",
      title: t(
        "Посадковий блок для нерухомого демонстратора 608",
        "Seat block for a stationary 608 demonstrator",
      ),
      summary: t(
        "Співвісні Ø10 наскрізь та контрольована Ø22 посадкова виїмка 7,2 мм; чорнове свердління, розточування, перевірка дна й вільна примірка.",
        "Coaxial Ø10 through and controlled Ø22 recess 7.2 mm deep; drill roughing, boring, floor inspection and a free fit check.",
      ),
      level: "advanced",
      family: "milling",
      part: bearingBlock,
      duration: t(
        "9–14 годин із вимірюванням посадки.",
        "9–14 hours including bore inspection.",
      ),
      purpose: t(
        "Нерухомий навчальний вузол під 608 номінально 8 ×22 ×7 мм. Посадка задана із зазором для примірки; вона не є розрахунком робочого підшипникового корпусу або допуском до обертання з навантаженням.",
        "Stationary learning assembly for a nominal 8 ×22 ×7 mm 608 bearing. The specified clearance seat is for fit demonstration, not the design of a loaded rotating bearing housing.",
      ),
    }),
    features: [
      ...envelope(60, 40, 20),
      feature(
        "F6",
        ["Наскрізний центральний отвір", "Central through bore"],
        "Ø10 +0.10/0",
        10,
        10,
        10.1,
        "A",
        [
          "Перевірте отвір по всій доступній довжині; він не є точною посадкою вала.",
          "Check the available bore length; this is not a precision shaft fit.",
        ],
        boreGauge,
        "holes.0.diameter",
      ),
      feature(
        "F7",
        ["Посадкова виїмка", "Bearing recess diameter"],
        "Ø22 +0.020/+0.040",
        22,
        22.02,
        22.04,
        "axis",
        [
          "Виміряйте у двох напрямках і на двох доступних рівнях, не спираючи контакт на фаску. Звірте із фактичним зовнішнім кільцем.",
          "Measure in two directions at two accessible levels without contacting chamfers. Compare with the actual outer ring.",
        ],
        [
          "Придатний нутромір для неглибокого отвору, встановлений за еталоном; доказова похибка для 20 мкм поля.",
          "Suitable shallow-bore comparator mastered against a reference; demonstrated error for the 20 µm interval.",
        ],
        "holes.0.counterbore.diameter",
      ),
      feature(
        "F8",
        ["Глибина виїмки", "Recess depth"],
        "7.20 ±0.03",
        7.2,
        7.17,
        7.23,
        "top",
        [
          "Виміряйте на кільцевому опорному дні в чотирьох точках; центральний отвір не є опорною точкою.",
          "Measure the annular support floor at four points; the central bore is not a seating point.",
        ],
        [
          "Глибинний мікрометр із тонким відповідним контактом.",
          "Depth micrometer with a suitably narrow contact.",
        ],
        "holes.0.counterbore.depth",
      ),
      coordinateFeature("F9", "X", 30, "holes.0.x", 0.03),
      coordinateFeature("F10", "Y", 20, "holes.0.y", 0.03),
    ],
    fixtures: [
      viceFixture(),
      carrier("bore-carrier", 60, 40, [{ x: 30, y: 20, diameter: 10 }]),
    ],
    setups: [
      ...squareStock(60, 40, 20),
      featureSetup(
        "S70",
        ["Співвісні отвори й кільцеве дно", "Coaxial bores and annular floor"],
        bearingBlock,
        "bore-carrier",
        [
          op(
            "OP10",
            [
              "Підготувати вісь і наскрізний отвір",
              "Establish the axis and through bore",
            ],
            [
              "Від C/B задайте(30;20) мм, перевірте симетрію, центруйте та просвердліть Ø10 наскрізь з виходом у підкладку. Утримуйте цей X/Y для всіх наступних операцій.",
              "Locate(30,20) mm from C/B, verify symmetry, spot and drill Ø10 through into the backing clearance. Retain this X/Y for all subsequent operations.",
            ],
            ["Центрувальне й Ø10 свердло.", "Spotting and Ø10 drills."],
            [
              "Ø10,00–10,10 мм; на Ø22 поки залишається повний матеріал.",
              "Ø10.00–10.10 mm; full stock remains for Ø22.",
            ],
            [
              "Перевірте F6 та координати до розточування.",
              "Check F6 and coordinates before boring.",
            ],
            ["F6", "F9", "F10"],
            stopLift,
          ),
          op(
            "OP20",
            ["Чорнова плоскодонна виїмка", "Rough a flat-bottom recess"],
            [
              "Меншою фрезою або розточувальною системою створіть виїмку Ø21,70 до 7,00 мм. Не створюйте Ø22 великим свердлом: потрібні контрольовані стінка та кільцеве плоске дно.",
              "With a smaller cutter or boring system create Ø21.70 to 7.00 mm depth. Do not use a large Ø22 drill: the wall and annular flat floor must be controlled.",
            ],
            [
              "Кінцева фреза для інтерполяції або коротка розточувальна система.",
              "End mill for interpolation or short boring system.",
            ],
            [
              "0,30 мм по діаметру та 0,20 мм на дні.",
              "0.30 mm diametral stock and 0.20 mm floor stock.",
            ],
            [
              "Перевірте залишок, доступність кільцевого дна та чистоту центру Ø10.",
              "Verify stock, access to the annular floor and a clear Ø10 centre.",
            ],
            ["F7", "F8"],
            [
              "Якщо геометрія розточувального інструмента не дає безпечного виходу на потрібне дно, змініть інструмент, а не глибину навмання.",
              "If tool geometry cannot safely reach the specified floor, change the tool rather than guessing a deeper cut.",
            ],
          ),
          op(
            "OP30",
            ["Чистова посадка й дно", "Finish the seat and floor"],
            [
              "Після вимірювання доведіть дно до 7,20 мм і посадку до 22,030 мм як середини поля. Урахуйте фактичний радіус вершини: кільце підшипника має спиратися на дно, а не зависати на непередбаченому скругленні.",
              "After measurement finish the floor to 7.20 mm and the seat to 22.030 mm at mid-interval. Account for the actual tool nose radius: the bearing ring must seat on the floor rather than an unplanned corner radius.",
            ],
            [
              "Точна розточувальна крайка та окремий контроль дна.",
              "Precision boring edge and separate floor inspection.",
            ],
            [
              "Зупиніть різання за 22,020–22,040 мм, не прагнучи довільного натягу.",
              "Stop within 22.020–22.040 mm; do not seek an arbitrary interference fit.",
            ],
            [
              "F7/F8 перевірені після охолодження; кільце входить без примусового запресовування.",
              "Verify F7/F8 after cooling; the ring enters without forced pressing.",
            ],
            ["F7", "F8", "F9", "F10"],
            [
              "Якщо деталь не сідає вільно, спочатку знайдіть причину: бруд, задирок, радіус або діаметр. Не забивайте підшипник.",
              "If the bearing does not seat freely, identify dirt, burr, corner radius or diameter first. Do not hammer it in.",
            ],
          ),
        ],
      ),
      reverseInspection(bearingBlock, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
      ]),
    ],
    cutting: [],
    pitfalls: [
      t(
        "Діаметр 608 — довідковий номінал; виміряйте конкретне кільце й не оголошуйте цю вільну примірку робочою посадкою.",
        "608 dimensions are nominal references; measure the actual ring and do not treat a free demonstration fit as a working fit.",
      ),
      t(
        "Глибиномір на отворі Ø10 не вимірює кільцеве дно — він провалиться.",
        "A depth contact over the Ø10 bore does not measure the annular floor; it falls through.",
      ),
    ],
    sources: [...commonSources, "proj-mill-bore", "proj-mill-nsk"],
  },
  {
    ...base({
      id: "alignment-key",
      title: t(
        "Напрямна шпонка для ковзного макета",
        "Guide key for a sliding demonstrator",
      ),
      summary: t(
        "C45,80 ×10 ×8 мм: вузьке поле ширини, контроль по довжині, отвори під M3 та перевірка зазору з відомим пазом.",
        "C45,80 ×10 ×8 mm: a narrow width interval, lengthwise inspection, M3 clearance holes and fit against a known slot.",
      ),
      level: "intermediate",
      family: "milling",
      part: key,
      material: t(
        "C45 нормалізована, без гарту після фінішу.",
        "Normalised C45, with no post-finish hardening.",
      ),
      duration: t(
        "7–11 годин із підтримкою вузької заготовки.",
        "7–11 hours including narrow-work support.",
      ),
      purpose: t(
        "Напрямна для нерухомого/ручного настільного макета з окремо перевіреним пазом 10,020–10,040 мм. Це не розрахована силова шпонка вала й не саморобний калібр.",
        "Guide for a stationary/manual bench demonstrator with a separately verified 10.020–10.040 mm slot. It is not an engineered torque-transmitting shaft key or a homemade calibration standard.",
      ),
    }),
    features: envelope(80, 10, 8)
      .map((f) =>
        f.id === "F2"
          ? feature(
              "F2",
              ["Точна ширина напрямної", "Precision guide width"],
              "10 −0.020/0",
              10,
              9.98,
              10,
              "B",
              [
                "Виміряйте на X=10,40,70 мм біля обох довгих ребер. Ціль останнього проходу 9,990 мм; приймання за всіма повторами.",
                "Measure at X=10,40,70 mm near both long edges. Target 9.990 mm for the last pass; accept using all repeated readings.",
              ],
              extMic,
              "depth",
            )
          : f,
      )
      .concat([
        feature(
          "F6",
          ["Отвори під M3", "M3 clearance holes"],
          "2 × Ø3.4 +0.15/0",
          3.4,
          3.4,
          3.55,
          "A",
          [
            "Контролюйте кожний отвір пробками, перевірте вихід без надриву.",
            "Gauge each hole and check tear-free breakthrough.",
          ],
          boreGauge,
          "holes.0.diameter",
        ),
        coordinateFeature("F7", "X", 10, "holes.0.x"),
        coordinateFeature("F8", "Y", 5, "holes.0.y"),
        feature(
          "F9",
          ["Зміна ширини вздовж 80 мм", "Width change over 80 mm"],
          "max − min ≤0.015",
          0,
          0,
          0.015,
          "B",
          [
            "Використайте ті самі шість точок F2 одним приладом; не приймайте конусну деталь за одним середнім числом.",
            "Use the same six F2 points with one instrument; do not accept taper from one average value.",
          ],
          extMic,
        ),
      ]),
    fixtures: [
      viceFixture(),
      {
        ...carrier("key-carrier", 80, 10, key.holes),
        purpose: t(
          "Повністю підтримати вузьку 8 мм заготовку під отворами й не затиснути її в дугу.",
          "Fully support the narrow 8 mm work under drilling without bowing it.",
        ),
        preparation: [
          t(
            "Контактна смуга A 80 ×10 мм має бути чистою. Притиски діють над підтриманими кінцями, поза X=10/70 та шляхом тримача.",
            "The 80 ×10 mm A contact strip must be clean. Clamps act over supported ends clear of X=10/70 and the holder path.",
          ),
          t(
            "Після затиску порівняйте висоту середини з вільним станом; відхилення≤0,02 мм.",
            "Compare mid-height with the free state after clamping; change≤0.02 mm.",
          ),
        ],
      },
    ],
    setups: [
      ...squareStock(80, 10, 8).map((s) =>
        s.id === "S40"
          ? {
              ...s,
              purpose: t(
                "Фініш вузької ширини 9,980–10,000 мм; останній прохід має бути спланований до 9,990 мм після вимірювання.",
                "Finish the narrow 9.980–10.000 mm width; plan the final pass to 9.990 mm from measurement.",
              ),
              operations: s.operations.map((o) =>
                o.id === "OP20"
                  ? {
                      ...o,
                      instruction: t(
                        "Після чорнового залишку 10,20 мм виконайте проміжний прохід, виміряйте шість точок мікрометром і доведіть до 9,990 мм. Вплив віджиму оцінюйте перед повторним проходом; не знімайте ще 0,01 мм лише за шкалою.",
                        "From the 10.20 mm rough remainder make an intermediate pass, measure six points with a micrometer and finish to 9.990 mm. Assess tool/work deflection before a repeat pass; do not remove another 0.01 mm from the dial alone.",
                      ),
                      allowance: t(
                        "Остаточна ширина 9,980–10,000 мм; ціль 9,990.",
                        "Final width 9.980–10.000 mm; target 9.990.",
                      ),
                      featureIds: ["F2", "F9"],
                    }
                  : o,
              ),
            }
          : s,
      ),
      featureSetup(
        "S70",
        [
          "Два отвори без згину напрямної",
          "Drill two holes without bending the key",
        ],
        key,
        "key-carrier",
        drillPattern(key, 3.4, ["F2", "F6", "F7", "F8", "F9"]),
      ),
      reverseInspection(key, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
      ]),
    ],
    cutting: [],
    pitfalls: [
      t(
        "Номінальна ширина 10 мм не означає натяг у будь-якому пазу 10 мм: виміряйте спряження окремо.",
        "A nominal 10 mm width does not define interference in an arbitrary 10 mm slot: measure the mating part separately.",
      ),
      t(
        "Вузька напрямна може вигнутися під затиском і повернутися після звільнення; контролюйте вільний стан.",
        "A narrow key may bow under clamping and spring back after release; inspect the free state.",
      ),
    ],
  },
  {
    ...base({
      id: "pocket-tray",
      title: t(
        "Фрезерований лоток із контрольованим дном",
        "Milled tray with a controlled floor",
      ),
      summary: t(
        "100 ×70 ×20 мм, кишеня 80 ×50 ×12 R5; чорнова вибірка, розвантаження, повторне базування та чистовий контур.",
        "100 ×70 ×20 mm,80 ×50 ×12 R5 pocket; roughing, release, datum recovery and contour finishing.",
      ),
      level: "intermediate",
      family: "cnc",
      part: tray,
      duration: t(
        "10–15 годин із підготовкою оснащення й CAM.",
        "10–15 hours including workholding and CAM preparation.",
      ),
      purpose: t(
        "Органайзер для сухих дрібних предметів у чистій зоні, не харчова ємність і не герметичний корпус під тиском.",
        "Organizer for small dry objects in a clean area, not a food container or pressure-tight housing.",
      ),
    }),
    equipment: [
      ...commonEquipment,
      t(
        "3-осьовий ЧПУ, погоджений постпроцесор і симуляція з реальними заготовкою, притисками та тримачами.",
        "3-axis CNC, approved postprocessor and simulation with actual stock, clamps and holders.",
      ),
    ],
    features: [
      ...envelope(100, 70, 20),
      feature(
        "F6",
        ["Довжина кишені X", "Pocket X length"],
        "80 ±0.05",
        80,
        79.95,
        80.05,
        "C",
        [
          "Виміряйте між прямими стінками, не між дугами кутів; перевірте верх і нижче доступним приладом.",
          "Measure between straight walls rather than corner arcs; check at the top and lower down with suitable equipment.",
        ],
        [
          "Внутрішній мікрометр/координатна система; штангенциркуль лише для проміжного контролю.",
          "Inside micrometer/coordinate system; calipers for intermediate checks only.",
        ],
        "pockets.0.width",
      ),
      feature(
        "F7",
        ["Ширина кишені Y", "Pocket Y width"],
        "50 ±0.05",
        50,
        49.95,
        50.05,
        "B",
        [
          "Перевірте біля обох торців і середину між прямими стінками.",
          "Check near both ends and at mid-length between straight walls.",
        ],
        [
          "Внутрішній мікрометр або придатний нутромір для пазу.",
          "Inside micrometer or suitable slot comparator.",
        ],
        "pockets.0.depth",
      ),
      feature(
        "F8",
        ["Глибина кишені", "Pocket depth"],
        "12 ±0.03",
        12,
        11.97,
        12.03,
        "top",
        [
          "Порівняйте дно в чотирьох кутах прямої ділянки й центрі; стрижень не ставте на радіус.",
          "Compare floor at four straight-area corners and the centre; do not place the rod on a radius.",
        ],
        [
          "Глибинний мікрометр/висотомір із перевіреною опорою.",
          "Depth micrometer/height gauge with verified seating.",
        ],
        "pockets.0.cutDepth",
      ),
      feature(
        "F9",
        ["Радіуси внутрішніх кутів", "Internal corner radii"],
        "R5 ±0.15",
        5,
        4.85,
        5.15,
        "pocket",
        [
          "Перевірте контур профільним шаблоном/оптично; діаметр фрези не є фактичним виміром готового радіуса.",
          "Check with a profile template/optical method; cutter diameter is not a measurement of the finished radius.",
        ],
        [
          "Радіусні шаблони для попереднього контролю, оптичний контроль для приймання.",
          "Radius gauges for preliminary checking, optical inspection for acceptance.",
        ],
        "pockets.0.cornerRadius",
      ),
      feature(
        "F10",
        ["Положення лівої стінки кишені", "Pocket left-wall position"],
        "X=10 ±0.05",
        10,
        9.95,
        10.05,
        "C",
        [
          "Перевірте від C й незалежно праву стінку від протилежного торця.",
          "Check from C and independently inspect the right wall from the opposite end.",
        ],
        heightGauge,
        "pockets.0.x",
      ),
    ],
    fixtures: [
      viceFixture(),
      {
        ...carrier("tray-carrier", 100, 70),
        name: t(
          "Підкладка з низькими боковими притисками",
          "Backing with low side clamps",
        ),
        purpose: t(
          "Підтримати A під дном 8 мм і залишити верхній контур кишені повністю відкритим.",
          "Support A below the 8 mm floor while leaving the upper pocket contour fully open.",
        ),
        preparation: [
          t(
            "Штатні низькі притиски контактують із зовнішньою масивною ділянкою нижче Z=6 мм; їхній повний габарит не заходить у кишеню.",
            "Approved low-profile clamps contact solid outer material below Z=6 mm; their full envelope must not enter the pocket.",
          ),
          t(
            "Після пробного затиску порівняйте висоти A/дна та перевірте модель тримача в найглибшому положенні.",
            "After trial clamping compare A/floor heights and verify the holder at maximum depth.",
          ),
        ],
      },
    ],
    setups: [
      ...squareStock(100, 70, 20),
      featureSetup(
        "S70",
        [
          "Чорнова кишеня з виміряним залишком",
          "Rough the pocket with measured stock",
        ],
        tray,
        "tray-carrier",
        [
          ...pocketOps(tray, ["F6", "F7", "F8", "F9", "F10"], 8).slice(0, 2),
          op(
            "OP30",
            [
              "Звільнити та перевірити стабільність",
              "Release and check stability",
            ],
            [
              "Після чорнової глибини 11,80 мм зніміть деталь, очистіть і дайте стабілізуватися. Порівняйте A та товщину залишкового дна; якщо деформація перевищує 0,20 мм запасу, не переходьте до чистової.",
              "After roughing to 11.80 mm remove, clean and stabilise the work. Compare A and remaining floor thickness; do not finish if distortion consumes the 0.20 mm stock.",
            ],
            [
              "Плита, мікрометр та індикатор.",
              "Surface plate, micrometer and indicator.",
            ],
            [
              "0,30 мм на стінках і 0,20 мм на дні мають зберігатися після звільнення.",
              "Retain 0.30 mm wall and 0.20 mm floor stock after release.",
            ],
            [
              "Затиснута й вільна геометрії порівняні до другого встановлення.",
              "Compare clamped and free geometry before the second setup.",
            ],
            ["F3", "F4", "F6", "F7", "F8"],
            stopLift,
          ),
        ],
      ),
      {
        ...featureSetup(
          "S80",
          [
            "Повторна посадка та чистова кишеня",
            "Reseat and finish the pocket",
          ],
          tray,
          "tray-carrier",
          [
            op(
              "OP10",
              [
                "Відновити бази після розвантаження",
                "Recover datums after release",
              ],
              [
                "Посадіть A знову, відновіть B/C та верхній Z. Перевірте одну зовнішню відстань і фактичний залишок кишені. Підготуйте чистову фрезу, її діаметр і довжину перевірте незалежно від чорнової.",
                "Reseat A and recover B/C and top Z. Check one external distance and actual pocket stock. Prepare the finishing cutter and verify its diameter/length independently of the rougher.",
              ],
              [
                "Щуп/крайкознімач і чистова Ø8 фреза.",
                "Probe/edge finder and Ø8 finishing cutter.",
              ],
              [
                "Фінішний матеріал має бути на всіх стінках і дні.",
                "Finishing stock must exist on every wall and the floor.",
              ],
              [
                "Пробний рух над деталлю не перетинає притиски; Z відновлений.",
                "Trial travel above the work clears clamps and Z is recovered.",
              ],
              ["F6", "F7", "F8", "F10"],
              stopLift,
            ),
            pocketOps(tray, ["F6", "F7", "F8", "F9", "F10"], 8)[2],
            op(
              "OP40",
              [
                "Верхні кромки й контроль до звільнення",
                "Upper edges and pre-release inspection",
              ],
              [
                "Зніміть невелику фаску на верхніх ребрах кишені, зберігши прямі вимірювальні ділянки. Перевірте контур і дно; остаточне рішення приймайте після зняття.",
                "Break upper pocket edges lightly while retaining straight measuring lands. Inspect contour and floor; make final acceptance after removal.",
              ],
              [
                "Фаскова фреза/ручний дебурер і відповідні прилади.",
                "Chamfer tool/hand deburrer and suitable instruments.",
              ],
              [
                "Кромки 0,2–0,3 мм без зменшення заданих стінок.",
                "0.2–0.3 mm edge breaks without reducing specified walls.",
              ],
              [
                "F6–F10 доступні та записані.",
                "Record accessible F6–F10 values.",
              ],
              ["F6", "F7", "F8", "F9", "F10"],
              stopLift,
            ),
          ],
        ),
        diagram: {
          view: "milling",
          clamping: "fixture-plate",
          flip: false,
          highlight: t(
            "Нове встановлення після зняття чорнової кишені.",
            "New setup after releasing the roughed pocket.",
          ),
        },
      },
      reverseInspection(tray, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
      ]),
    ],
    cutting: [
      {
        tool: t(
          "Умовний приклад для Ø8,3-зубої фрези.",
          "Assumed example for an Ø8,3-flute end mill.",
        ),
        diameter: 8,
        vc: 100,
        teeth: 3,
        feedPerTooth: 0.025,
        rpmLimit: 4000,
        assumptions: t(
          "Vc 100 м/хв і fz 0,025 мм/зуб — лише явно задані вхідні дані арифметики. Стратегія контакту, глибина й конкретний артикул тут не затверджені.",
          "Vc 100 m/min and fz 0.025 mm/tooth are explicitly assumed arithmetic inputs only. Engagement, depth and a specific tool item are not approved here.",
        ),
        confirmation: t(
          "Підставте дані реальної фрези 6082 та обмеження верстата; оберти після обмеження змінюють і подачу.",
          "Use the real 6082 cutter data and machine limits; limiting rpm also changes feed.",
        ),
      },
    ],
    pitfalls: [
      t(
        "R5 у кресленні не означає використати Ø10 фрезу з повним контактом у кожному куті: менша Ø8 дає місце для керованої траєкторії.",
        "Drawing R5 does not require a fully engaged Ø10 cutter at each corner: Ø8 leaves room for a controlled path.",
      ),
      t(
        "Вимірювання кишені до зняття не виявляє залишкової деформації дна.",
        "Measuring the pocket before release does not reveal residual floor distortion.",
      ),
    ],
    sources: [...commonSources, "proj-mill-slot", "proj-mill-shoulder"],
  },
  {
    ...base({
      id: "cnc-contour-plate",
      title: t(
        "Контурна плита з болтовим утриманням",
        "Contour plate with bolt-through retention",
      ),
      summary: t(
        "Плита 90 ×60 ×10 R6: спочатку отвори, потім зміна кріплення без втрати нуля та наскрізний контур на жертовній плиті.",
        "90 ×60 ×10 R6 plate: holes first, then retention change without losing the origin, followed by through-profiling over a sacrificial plate.",
      ),
      level: "advanced",
      family: "cnc",
      part: contour,
      duration: t(
        "10–16 годин із платою утримання, CAM і першим контрольованим прогоном.",
        "10–16 hours including retention plate, CAM and first prove-out.",
      ),
      purpose: t(
        "Монтажна плита невідповідального настільного приладу. Контур і болтове утримання навчають плануванню переходу кріплень, а не дають універсальну схему для будь-якої деталі.",
        "Mounting plate for a noncritical bench instrument. Contouring and bolt retention teach a planned workholding transition, not a universal fixture for arbitrary parts.",
      ),
    }),
    equipment: [
      ...commonEquipment,
      t(
        "3-осьовий ЧПУ з CAM/постпроцесором саме для контролера; повна симуляція всіх болтів, гайок, плити й тримача.",
        "3-axis CNC with CAM/postprocessor for the actual control; simulate every bolt, nut, plate and holder.",
      ),
    ],
    features: [
      ...envelope(90, 60, 10),
      holesFeature(5.5, "(10,10), (80,10), (10,50), (80,50) mm"),
      coordinateFeature("F7", "X", 10, "holes.0.x"),
      coordinateFeature("F8", "Y", 10, "holes.0.y"),
      feature(
        "F9",
        ["Зовнішні радіуси", "External corner radii"],
        "4 × R6 ±0.10",
        6,
        5.9,
        6.1,
        "B/C",
        [
          "Перевірте контур кожного кута оптично або координатною системою, зберігши прямі ділянки ширини/довжини.",
          "Inspect each corner optically or with a coordinate system, retaining straight width/length reference portions.",
        ],
        [
          "Оптичний контурний контроль/координатна система.",
          "Optical contour inspection/coordinate system.",
        ],
        "cornerRadius",
      ),
    ],
    stock: {
      form: t(
        "Пиляний блок; проміжний габарит 90,40 ×60,40 ×10 перед контуром.",
        "Sawn block; intermediate 90.40 ×60.40 ×10 envelope before contouring.",
      ),
      size: "94 ×64 ×14 mm",
      preparation: [
        ...stockPrep,
        t(
          "Проміжні B/C розташовані на 0,20 мм назовні від майбутніх готових B/C. Збережіть цю різницю в карті баз.",
          "Intermediate B/C lie 0.20 mm outside the future finished B/C. Preserve this distinction in the datum sheet.",
        ),
      ],
    },
    fixtures: [
      viceFixture(),
      {
        ...carrier("contour-carrier", 90, 60),
        name: t(
          "Болтова жертовна плита для замкненого контуру",
          "Bolted sacrificial plate for a closed contour",
        ),
        geometry: {
          kind: "block",
          width: 130,
          depth: 100,
          height: 15,
          holes: [
            { x: 30, y: 30, diameter: 6.5 },
            { x: 100, y: 30, diameter: 6.5 },
            { x: 30, y: 70, diameter: 6.5 },
            { x: 100, y: 70, diameter: 6.5 },
          ],
        },
        dimensions: t(
          "130 ×100 ×15 мм; готовий кут деталі X/Y=(20;20) плити. Монтажні виходи Ø6,5 у(30;30),(100;30),(30;70),(100;70).",
          "130 ×100 ×15 mm; finished part origin is plate X/Y=(20,20). Ø6.5 mounting exits at(30,30),(100,30),(30,70),(100,70).",
        ),
        hardware: [
          t(
            "Чотири M5×35 болти з відповідними шайбами/гайками; сумарний пакет деталь 10+плита 15=25 мм, решту зачеплення перевірте за фактичними деталями.",
            "Four M5×35 bolts with suitable washers/nuts; the stack is 10 mm work+15 mm plate=25 mm, with remaining engagement verified on actual hardware.",
          ),
          t(
            "Штатні закріплені підйомні опори забезпечують місце для гайок під плитою; зовнішні притиски бази лежать поза обводом.",
            "Approved secured risers provide nut clearance below the plate; base clamps remain outside the profile.",
          ),
        ],
        manufacture: [
          t(
            "Обробіть низ, верх і дві координатні сторони плити; доведіть габарит 130 ×100 ×15 мм та перевірте верх.",
            "Machine bottom, top and two coordinate sides; finish 130 ×100 ×15 mm and inspect the top.",
          ),
          t(
            "Виконайте чотири Ø6,5 наскрізні виходи за картою; перевірте їх до встановлення заготовки.",
            "Make the four Ø6.5 through clearances from the map and inspect before loading stock.",
          ),
          t(
            "Приберіть задирки з обох боків, перевірте простір під гайками та довжину болтів без встановленої деталі.",
            "Deburr both sides and verify nut clearance and bolt length before loading the work.",
          ),
          t(
            "Нанесіть майбутній контур 90 ×60 R6 і встановіть початкові крайові притиски поза болтовими центрами.",
            "Mark the future 90 ×60 R6 contour and fit initial edge clamps clear of bolt centres.",
          ),
          t(
            "У CAM перевірте контур фрези, а не тільки центр: повна модель тримача має пройти над головками болтів.",
            "In CAM check the cutter envelope rather than its centre alone: the entire holder must clear bolt heads.",
          ),
        ],
        preparation: [
          t(
            "Початково заготовку утримують крайові притиски над опорами; після отворів усі чотири болти стають контрольованим новим кріпленням.",
            "Initially retain the stock with supported edge clamps; after drilling, all four bolts form the checked new retention.",
          ),
          t(
            "Нижній край тримача у найглибшій точці має бути вище реальних головок щонайменше на 5 мм; потрібний виліт перевірте на жорсткість.",
            "At maximum depth keep the holder’s lower envelope at least 5 mm above actual heads; verify the necessary overhang for rigidity.",
          ),
        ],
        acceptance: [
          t(
            "Гайки не торкаються столу, болти не стоять на дні отворів; затиск не вигинає плиту.",
            "Nuts clear the table, bolts do not bottom and clamping does not bow the plate.",
          ),
          t(
            "Після переходу до болтів жодна частина контуру не утримується лише відходом або тонкою перемичкою.",
            "After transfer to bolts no portion depends only on waste stock or a thin tab for retention.",
          ),
        ],
      },
    ],
    setups: [
      ...squareStock(90.4, 60.4, 10).map((s) => ({
        ...s,
        purpose: t(
          `${s.purpose.uk} Проміжний X/Y 90,40/60,40 мм містить 0,20 мм на кожній бічній стороні; F1/F2 остаточно перевіряють після контуру.`,
          `${s.purpose.en} Intermediate X/Y 90.40/60.40 mm retains 0.20 mm per side; accept final F1/F2 only after contouring.`,
        ),
        operations: s.operations.map((o) => ({
          ...o,
          inspection: t(
            `Проміжний габарит 90,40 ×60,40 мм: це ще не остаточна приймальна перевірка F1/F2. ${o.inspection.uk}`,
            `Intermediate envelope 90.40 ×60.40 mm: this is not final F1/F2 acceptance. ${o.inspection.en}`,
          ),
        })),
      })),
      {
        ...featureSetup(
          "S70",
          ["Отвори перед зміною кріплення", "Drill before changing retention"],
          contour,
          "contour-carrier",
          drillPattern(contour, 5.5, ["F6", "F7", "F8"]),
        ),
        datums: t(
          "X0/Y0 — майбутній готовий кут на 0,20 мм всередину від проміжних C/B. Z0 — готовий верх товщини 10 мм. Перевірте знаки поправок незалежною відстанню.",
          "X0/Y0 is the future finished corner 0.20 mm inside intermediate C/B. Z0 is the finished 10 mm top. Independently verify the offset signs.",
        ),
        orientation: t(
          "A вниз; проміжні C/B лежать при X=−0,20,Y=−0,20 від майбутнього готового нуля.",
          "A down; intermediate C/B are at X=−0.20,Y=−0.20 relative to the future finished origin.",
        ),
      },
      {
        ...featureSetup(
          "S80",
          [
            "Перехід на болти та замкнений контур",
            "Transfer to bolts and close the contour",
          ],
          contour,
          "contour-carrier",
          [
            op(
              "OP10",
              [
                "Змінити утримання без вільної деталі",
                "Change retention without leaving the work free",
              ],
              [
                "Зупиніть верстат і виконайте потрібну ізоляцію. Поставте всі чотири M5 болти через готові отвори, перевірте притиск і висоту. Лише після підтвердження болтового утримання зніміть крайові притиски; це нове встановлення.",
                "Stop and apply required isolation. Fit all four M5 bolts through the completed holes and verify retention and height. Remove edge clamps only after confirming bolt retention; this is a new setup.",
              ],
              [
                "Динамометричний ключ за даними реального кріплення, індикатор і щуп.",
                "Torque tool using the actual workholding data, indicator and probe.",
              ],
              [
                "Проміжний припуск 0,20 мм на сторонах зберігається; матеріал під болтами не знімають.",
                "Retain 0.20 mm side stock; do not cut material beneath the bolts.",
              ],
              [
                "Перевірте контрольний отвір, другу вісь орієнтації й висоту; нуль не повинен змінитися від затиску.",
                "Check one hole centre, a second orientation reference and height; clamping must not shift the origin.",
              ],
              ["F3", "F6", "F7", "F8"],
              stopLift,
            ),
            op(
              "OP20",
              ["Чорновий контур із запасом", "Rough the outside profile"],
              [
                "Виконайте зовнішній обвід 90 ×60 R6, залишаючи 0,10 мм по нормалі на фініш. Повна глибина проходить 10 мм плити; остаточний вихід у підкладку 0,20 мм задайте тільки після перевірки фактичної A.",
                "Rough the 90 ×60 R6 outer profile with 0.10 mm normal finishing stock. The profile passes through 10 mm material; set 0.20 mm sacrificial breakthrough only after verifying actual A.",
              ],
              [
                "Ø6 кінцева фреза з робочою довжиною та вильотом, що перекривають повний пакет/головки.",
                "Ø6 end mill with flute length and projection adequate for the full depth and head clearance.",
              ],
              [
                "0,10 мм по нормалі контуру; болтові центри залишаються всередині готової деталі.",
                "0.10 mm stock normal to the contour; all bolt centres remain within the finished part.",
              ],
              [
                "Перший шар звірте з очікуваним профілем і кріпленням; простір тримача перевірений.",
                "Check the first layer against the planned profile and retention; holder clearance is verified.",
              ],
              ["F1", "F2", "F9"],
              [
                "За послаблення будь-якого болта, зміни висоти або контакту тримача з головкою припиніть цикл.",
                "Stop the cycle for any loose bolt, height change or holder-to-head contact.",
              ],
            ),
            op(
              "OP30",
              [
                "Чистовий обвід і контроль до зняття",
                "Finish the profile and inspect before removal",
              ],
              [
                "Завершіть 90,00 ×60,00 мм таR 6, не змінюючи бази між сторонами. Прочитайте фактичні довжини й ширини між прямими ділянками після зупинки; окремо перевірте кути.",
                "Finish 90.00 ×60.00 mm andR 6 without changing datums between sides. After stopping, inspect actual length and width between straight portions and check corners separately.",
              ],
              [
                "Чистова Ø6 фреза з відомим діаметром.",
                "Ø6 finishing cutter of known diameter.",
              ],
              [
                "Контур у межах F1/F2/F9; не компенсуйте помилку нуля зміною діаметра фрези.",
                "Keep the contour within F1/F2/F9; do not conceal an origin error by changing cutter diameter.",
              ],
              [
                "Після зняття повторіть розташування отворів щодо вже готових B/C.",
                "After removal recheck hole positions from the now-finished B/C faces.",
              ],
              ["F1", "F2", "F6", "F7", "F8", "F9"],
              stopLift,
            ),
          ],
        ),
        transfer: t(
          "Підтримайте деталь перед останнім болтом. Видаліть лише нижній задирок, зберігши A; фінальні B/C тепер фізично готові й перевіряються заново.",
          "Support the part before removing the final bolt. Remove only underside burrs while preserving A; final B/C now physically exist and must be rechecked.",
        ),
      },
      reverseInspection(contour, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
      ]),
    ],
    cutting: [],
    pitfalls: [
      t(
        "90,40 мм проміжного габариту не є помилкою креслення:0,20 мм лишається на кожній стороні, а нуль майбутнього контуру зсунений усередину.",
        "The 90.40 mm intermediate envelope is intentional:0.20 mm remains per side and the future contour origin is offset inward.",
      ),
      t(
        "Зняти крайові притиски до встановлення болтів означає втратити утримання й базу.",
        "Removing edge clamps before fitting bolts loses both retention and location.",
      ),
    ],
    sources: [...commonSources, "proj-mill-shoulder", "proj-mill-slot"],
  },
  {
    ...base({
      id: "locating-nest",
      title: t(
        "Вимірювальне гніздо для зразка 60 ×30",
        "Inspection nest for a 60 ×30 sample",
      ),
      summary: t(
        "Кишеня з заданим сумарним зазором, радіусами під спряжений зразок і перевіркою повторної посадки до одного кута.",
        "A pocket with a defined total clearance, radii matched to a reference sample and repeat seating against one corner.",
      ),
      level: "advanced",
      family: "cnc",
      part: nest,
      duration: t(
        "11–16 годин із підготовкою зразка й перевіркою зазорів.",
        "11–16 hours including reference-sample preparation and clearance checks.",
      ),
      purpose: t(
        "Нерухоме вимірювальне/складальне гніздо під відомий зразок 59,990–60,000 ×29,990–30,000 мм із зовнішніми кутамиR 3,2. Саме гніздо не замінює силового затиску й не задає нульового люфту.",
        "Stationary inspection/assembly nest for a known 59.990–60.000 ×29.990–30.000 mm sample with externalR 3.2 corners. The nest does not replace positive retention and does not imply zero clearance.",
      ),
    }),
    equipment: [
      ...commonEquipment,
      t(
        "3-осьовий ЧПУ з перевіреним діаметром чистової фрези; внутрішній контроль, придатний для поля 0,03 мм.",
        "3-axis CNC with verified finishing-cutter diameter; inside measurement suitable for a 0.03 mm interval.",
      ),
    ],
    features: [
      ...envelope(100, 70, 16),
      feature(
        "F6",
        ["Довжина посадкової кишені", "Nesting-pocket length"],
        "60.04 +0.03/0",
        60.04,
        60.04,
        60.07,
        "C",
        [
          "Виміряйте між прямими стінками в кількох перерізах; приймальна ціль 60,055 мм.",
          "Measure between straight walls at several sections; acceptance target 60.055 mm.",
        ],
        [
          "Внутрішній мікрометр або координатна система з підтвердженою похибкою для поля 0,03 мм.",
          "Inside micrometer or coordinate system with demonstrated error for a 0.03 mm interval.",
        ],
        "pockets.0.width",
      ),
      feature(
        "F7",
        ["Ширина посадкової кишені", "Nesting-pocket width"],
        "30.04 +0.03/0",
        30.04,
        30.04,
        30.07,
        "B",
        [
          "Перевірте біля обох торців та в центрі; приймальна ціль 30,055 мм.",
          "Check near both ends and at the centre; acceptance target 30.055 mm.",
        ],
        [
          "Внутрішній мікрометр/придатна координатна система.",
          "Inside micrometer/suitable coordinate system.",
        ],
        "pockets.0.depth",
      ),
      feature(
        "F8",
        ["Глибина посадки", "Nest depth"],
        "6 ±0.02",
        6,
        5.98,
        6.02,
        "top",
        [
          "Перевірте дно в п’яти точках; врахуйте виступ зразка над площиною.",
          "Inspect the floor at five points; account for sample projection above the top.",
        ],
        ["Глибинний мікрометр.", "Depth micrometer."],
        "pockets.0.cutDepth",
      ),
      feature(
        "F9",
        ["Розташування кишені від C", "Pocket location from C"],
        "X=19.98 ±0.03",
        19.98,
        19.95,
        20.01,
        "C",
        [
          "Порівняйте ліву та праву товщину стінок; координату не відновлюйте від чорнової кишені.",
          "Compare left and right wall thickness; do not recover the origin from the rough pocket.",
        ],
        heightGauge,
        "pockets.0.x",
      ),
      feature(
        "F10",
        ["Сумарний зазор зі зразком по X", "Total X clearance to the sample"],
        "0.040…0.080",
        0.055,
        0.04,
        0.08,
        "sample",
        [
          "Відніміть фактичну ширину зразка від відповідної кишені; це сумарний зазор, а не зазор на один бік.",
          "Subtract the actual sample width from the corresponding pocket dimension; this is total clearance, not per-side clearance.",
        ],
        [
          "Ті самі перевірені прилади для кишені та зразка; журнал парних вимірів.",
          "The same verified instruments for pocket and sample, with paired readings.",
        ],
      ),
      feature(
        "F11",
        ["Внутрішні радіуси", "Internal radii"],
        "R3 ±0.10",
        3,
        2.9,
        3.1,
        "pocket",
        [
          "Підтвердьте відсутність контакту кутів зі зразкомR 3,2; точний контур перевіряйте оптично.",
          "Confirm corner clearance to theR 3.2 sample; inspect the precise contour optically.",
        ],
        [
          "Оптичний/координатний контроль, радіусний шаблон для попередньої перевірки.",
          "Optical/coordinate inspection, radius gauge for preliminary checking.",
        ],
        "pockets.0.cornerRadius",
      ),
      feature(
        "F12",
        [
          "Повторюваність посадки до одного кута",
          "Repeat seating against one corner",
        ],
        "spread ≤0.03",
        0,
        0,
        0.03,
        "pocket datum corner",
        [
          "Тричі вийміть, очистіть і посадіть зразок до тих самих двох стінок без силового заклинювання; порівняйте індикатор у тій самій точці.",
          "Remove, clean and seat the sample three times against the same two walls without wedging; compare the same indicator point.",
        ],
        [
          "Індикатор на жорсткій основі й однаковий напрямок легкої посадки.",
          "Indicator on a rigid base with the same light seating direction.",
        ],
      ),
    ],
    fixtures: [
      viceFixture(),
      {
        ...carrier("nest-carrier", 100, 70),
        name: t(
          "Суцільна опора гнізда з низькими притисками",
          "Full nest support with low-profile clamps",
        ),
        preparation: [
          t(
            "Підтримайте A повністю; затиск прикладається до зовнішніх масивних країв нижче дна кишеніZ=10 мм.",
            "Support A fully; clamp solid outer edges below the pocket floor atZ=10 mm.",
          ),
          t(
            "Контрольний зразок під час різання відсутній у кишені; його використовують тільки після зупинки й очищення.",
            "Keep the reference sample out during cutting; use it only after stopping and cleaning.",
          ),
        ],
      },
    ],
    setups: [
      ...squareStock(100, 70, 16),
      featureSetup(
        "S70",
        ["Кишеня з контрольованим зазором", "Pocket with controlled clearance"],
        nest,
        "nest-carrier",
        pocketOps(nest, ["F6", "F7", "F8", "F9", "F11"], 4).map((o) =>
          o.id === "OP30"
            ? {
                ...o,
                instruction: t(
                  "Після чорнового залишку виміряйте реальну кишеню. Чистово цільтеся в 60,055 ×30,055 мм та глибину 6,000 мм; після проходу перевірте до будь-якої поправки. РадіусиR 3 формуються траєкторією Ø4 фрези, а не її радіусом 2 мм.",
                  "After roughing measure the actual pocket. Target 60.055 ×30.055 mm and 6.000 mm depth; inspect before any correction. R3 corners are generated by the Ø4 cutter path, not its 2 mm tool radius.",
                ),
                allowance: t(
                  "Фініш у полях 60,040–60,070 і 30,040–30,070 мм, не до нульового зазору.",
                  "Finish within 60.040–60.070 and 30.040–30.070 mm, not to zero clearance.",
                ),
              }
            : o,
        ),
      ),
      {
        ...featureSetup(
          "S80",
          [
            "Примірка та повторюваність гнізда",
            "Fit and repeatability of the nest",
          ],
          nest,
          "nest-carrier",
          [
            op(
              "OP10",
              ["Виміряти обидві спряжені деталі", "Measure both mating parts"],
              [
                "Після термостабілізації виміряйте зразок і кишеню одним узгодженим методом. Обчисліть сумарні зазори по X іY; підпис «60 ×30» на зразку не замінює вимірювання.",
                "After temperature stabilisation measure sample and pocket using a consistent method. Calculate total X/Y clearances; a “60 ×30” label does not replace measurement.",
              ],
              [
                "Мікрометр зразка та придатний внутрішній прилад.",
                "Sample micrometer and suitable inside instrument.",
              ],
              [
                "Матеріал не знімають під час першої примірки.",
                "Remove no material during the first fit check.",
              ],
              [
                "Зазор обчислений з фактичних парних значень.",
                "Calculate clearance from actual paired readings.",
              ],
              ["F6", "F7", "F10"],
              [
                "Якщо зразок не входить без заклинювання, зупиніться й перевірте радіуси, задирки та звуження.",
                "If the sample will not enter freely, stop and inspect radii, burrs and taper.",
              ],
            ),
            op(
              "OP20",
              ["Перевірити дно та кути", "Check floor and corners"],
              [
                "Опустіть зразок без натиску; тонкою смугою/слідом контакту перевірте, що він спирається на дно, а не на кути. Окремо перевірте глибину й виступ.",
                "Lower the sample without force; use a thin strip/contact indication to verify floor seating rather than corner interference. Check depth and projection separately.",
              ],
              [
                "Щупи, контроль контакту та глибинний мікрометр.",
                "Feeler strips, contact indication and depth micrometer.",
              ],
              [
                "Шліфування кутів зразка не допускається як прихована корекція кишені.",
                "Do not secretly correct the pocket by sanding sample corners.",
              ],
              [
                "Немає хитання, заклинювання чи неврахованого контакту.",
                "No rocking, wedging or unplanned contact remains.",
              ],
              ["F8", "F11"],
              [
                "За сліду тільки на одному куті не робіть висновок про правильну ширину.",
                "A mark on one corner does not establish correct width.",
              ],
            ),
            op(
              "OP30",
              ["Три цикли повторної посадки", "Three repeat-seating cycles"],
              [
                "Вийміть, очистіть і поверніть зразок тричі. Щоразу легко посадіть до тих самих нижньої/лівої стінок у плані, підтримуючи A. Виміряйте одну контрольну точку індикатором без переналаштування.",
                "Remove, clean and replace the sample three times. Each time seat lightly against the same lower/left plan walls while supporting A. Measure one indicator point without resetting.",
              ],
              [
                "Індикатор і карта повторів.",
                "Indicator and repeatability record.",
              ],
              [
                "Приймальна різниця максимум−мінімум≤0,03 мм; весь зазор не повинен бути затиснутий силою.",
                "Acceptance spread maximum−minimum≤0.03 mm; do not force the total clearance closed.",
              ],
              [
                "Усі три покази й напрямок посадки записані.",
                "Record all three readings and the seating direction.",
              ],
              ["F10", "F12"],
              [
                "Великий розкид означає забруднення/контакти/метод; не оголошуйте гніздо точним за одним вдалим показом.",
                "Large spread indicates contamination, contacts or method; do not declare precision from one good reading.",
              ],
            ),
          ],
        ),
        machine: t(
          "Вимірювальна плита й верстак, верстат зупинений.",
          "Inspection plate and bench, machine stopped.",
        ),
        workholding: t(
          "Контроль у вільному стані; легкий повторюваний контакт до двох визначених стінок.",
          "Inspect free-state geometry with light repeatable contact against the two defined walls.",
        ),
        diagram: {
          view: "inspection",
          clamping: "fixture-plate",
          flip: false,
          highlight: t(
            "Сполучення перевіряється розмірами, а не силовим втисненням.",
            "Verify the mating fit by measurement, not forced insertion.",
          ),
        },
      },
      reverseInspection(nest, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
      ]),
    ],
    cutting: [],
    pitfalls: [
      t(
        "0,04 мм сумарного зазору — не 0,04 мм з кожного боку.",
        "0.04 mm total clearance is not 0.04 mm on each side.",
      ),
      t(
        "Гніздо з зазором стає повторюваним тільки при однаковій схемі посадки; воно не самоцентрує зразок.",
        "A clearance nest repeats only with a consistent seating scheme; it does not self-centre the sample.",
      ),
    ],
    sources: [...commonSources, "proj-mill-shoulder", "proj-mill-slot"],
  },
  {
    ...base({
      id: "reverse-cover",
      title: t(
        "Відтворення монтажної кришки за протоколом",
        "Reproduce a mounting cover from a survey record",
      ),
      summary: t(
        "Кришка 100 ×70 ×6 R4: обмір, затвердження ревізії, повна підтримка тонкої плити, свердління, болтове утримання й контур.",
        "100 ×70 ×6 R4 cover: survey, revision approval, full thin-plate support, drilling, bolt retention and profiling.",
      ),
      level: "advanced",
      family: "reverse",
      part: cover,
      material: t(
        "EN AW-5083, двобічно фрезерована прецизійна плита, фактично прийнята за товщиною та площинністю.",
        "EN AW-5083, precision plate milled on both faces and actually accepted for thickness and flatness.",
      ),
      duration: t(
        "10–16 годин із обміром, підкладкою, CAM та приміркою.",
        "10–16 hours including survey, backing, CAM and fit check.",
      ),
      purpose: t(
        "Кришка невідповідального настільного органайзера. Наведені номінали — заданий навчальний протокол, не результат фізичного обміру користувацької деталі. Для іншого оригіналу спочатку оформіть власний протокол і ревізію.",
        "Cover for a noncritical bench organizer. These nominals are a specified learning survey dataset, not measurements of the user’s physical part. For another original, create its own survey and revision first.",
      ),
    }),
    stock: {
      form: t(
        "Двобічно фрезерована плита; готові широкі площини приймають на вході, а не вдають їхню обробку в тонкому затиску.",
        "Plate milled on both faces; accept the broad faces on receipt rather than pretending to face them in a thin grip.",
      ),
      size: "108 ×78 ×6 mm; accepted thickness 5.90…6.10 mm",
      preparation: [
        t(
          "Перевірте сертифікат, фактичну товщину в дев’яти точках і придатність обох поверхонь як A/верх. Якщо межі F3/F4 не виконані, цей маршрут не застосовується.",
          "Verify certification, actual thickness at nine points and suitability of both faces as A/top. This route does not apply if F3/F4 limits are unmet.",
        ),
        t(
          "Прийміть заготовку 108 ×78 мм із перевіреним припуском не більше 4,20 мм на кожну готову сторону, установіть майбутній контур по центру. Позначте A та орієнтацію. Подряпини й знос не є конструкторськими базами; за більшого припуску цей маршрут не застосовується.",
          "Accept 108 ×78 mm stock with verified allowance no greater than 4.20 mm outside each finished side and centre the future profile. Identify A and orientation. Scratches and wear are not design datums; this route does not apply to larger stock allowances.",
        ),
        t(
          "Змодельований номінальний набір для цього прикладу:100 ×70 мм,R4, отвори(8;8),(92;8),(8;62),(92;62). Перед власним відтворенням замініть його підтвердженими вимірами.",
          "Specified nominal dataset for this example:100 ×70 mm,R4, holes(8,8),(92,8),(8,62),(92,62). Replace it with verified measurements before reproducing your own sample.",
        ),
      ],
    },
    equipment: [
      ...commonEquipment,
      t(
        "Для тонкого контуру передбачено 3-осьовий ЧПУ та CAM із моделями болтів/тримачів; свердлильний верстат самостійно не виконує цей контур.",
        "Thin-plate profiling assumes 3-axis CNC and CAM with bolts/holders represented; a drill press alone cannot execute the contour.",
      ),
    ],
    features: envelope(100, 70, 6, 0.1)
      .map((f) =>
        f.id === "F4"
          ? feature(
              "F4",
              [
                "Різнотовщинність вихідної плити",
                "Incoming plate thickness variation",
              ],
              "max − min ≤0.05",
              0,
              0,
              0.05,
              "A",
              [
                "Порівняйте дев’ять точок до початку; збережіть ті самі точки для фінального контролю.",
                "Compare nine points before starting; retain the same points for final inspection.",
              ],
              extMic,
            )
          : f,
      )
      .concat([
        holesFeature(4.5, "(8,8),(92,8),(8,62),(92,62) mm"),
        coordinateFeature("F7", "X", 8, "holes.0.x"),
        coordinateFeature("F8", "Y", 8, "holes.0.y"),
        feature(
          "F9",
          ["Радіуси зовнішніх кутів", "Outer corner radii"],
          "4 ×R4 ±0.15",
          4,
          3.85,
          4.15,
          "B/C",
          [
            "Перевірте весь контур і відсутність гострих залишків у місцях переходу дуги в пряму.",
            "Check the complete contour and absence of sharp remnants at arc-to-line transitions.",
          ],
          [
            "Оптичний контроль/профільний шаблон із відомою похибкою.",
            "Optical inspection/profile template with known error.",
          ],
          "cornerRadius",
        ),
        feature(
          "F10",
          ["Крок кріплення X", "X mounting pitch"],
          "84 ±0.07",
          84,
          83.93,
          84.07,
          "C",
          [
            "Перевірте обидва ряди через контрольні штифти й порівняйте з нерухомим спряженим зразком.",
            "Check both rows across checking pins and compare with the stationary mating sample.",
          ],
          heightGauge,
        ),
        feature(
          "F11",
          ["Крок кріплення Y", "Y mounting pitch"],
          "54 ±0.07",
          54,
          53.93,
          54.07,
          "B",
          [
            "Перевірте обидві колонки незалежно від симетрії кришки.",
            "Verify both columns independently of cover symmetry.",
          ],
          heightGauge,
        ),
      ]),
    fixtures: [
      viceFixture(),
      {
        ...carrier("cover-carrier", 100, 70),
        name: t(
          "Суцільна підкладка тонкої кришки",
          "Full backing for the thin cover",
        ),
        dimensions: t(
          "140 ×110 ×15 мм. Кут готової кришки наX/Y=(20;20). Отвори під болти/вихід свердла Ø5,5 у(28;28),(112;28),(28;82),(112;82).",
          "140 ×110 ×15 mm. Finished-cover origin at X/Y=(20,20). Ø5.5 bolt/drill-exit holes at(28,28),(112,28),(28,82),(112,82).",
        ),
        geometry: {
          kind: "block",
          width: 140,
          depth: 110,
          height: 15,
          holes: [
            { x: 28, y: 28, diameter: 5.5 },
            { x: 112, y: 28, diameter: 5.5 },
            { x: 28, y: 82, diameter: 5.5 },
            { x: 112, y: 82, diameter: 5.5 },
          ],
        },
        hardware: [
          t(
            "Чотири M4×30 болти з відповідними широкими шайбами й гайками; під плитою — закріплені штатні опори з місцем для гайок.",
            "Four M4×30 bolts with suitable broad washers/nuts; use approved secured risers with nut clearance below the plate.",
          ),
          t(
            "Для початкового свердління — окремі штатні крайові притиски; під час зміни кріплення вони знімаються лише після перевірки болтів.",
            "Use separate approved edge clamps for initial drilling; remove them only after verifying bolt retention during the transfer.",
          ),
        ],
        manufacture: [
          t(
            "Виготовте 140 ×110 ×15 мм плиту з чистим верхом, нижньою опорою й двома перевіреними координатними сторонами.",
            "Make a 140 ×110 ×15 mm plate with clean top, bottom support and two verified coordinate sides.",
          ),
          t(
            "Виконайте чотири Ø5,5 наскрізні отвори за картою, видаліть задирки з обох боків.",
            "Make the four mapped Ø5.5 through holes and deburr both sides.",
          ),
          t(
            "Перевірте припасування болтів, шайб і гайок на пакеті 6+15 мм; болти не повинні впиратися в стіл.",
            "Trial bolts, washers and nuts on the 6+15 mm stack; bolts must not bottom on the table.",
          ),
          t(
            "Нанесіть контур 100 ×70 R4 та прямокутник заготовки 108 ×78 зі зміщенням по 4 мм. Перевірте місця початкових притисків.",
            "Mark the 100 ×70 R4 contour and 108 ×78 stock rectangle at 4 mm per-side offset. Verify initial clamp locations.",
          ),
          t(
            "Підтвердіть площинну підтримку A та повну модель контурного проходу на фактичну товщину+0,20 мм у жертовний верх.",
            "Verify full A support and the entire profiling envelope to actual thickness+0.20 mm into the sacrificial top.",
          ),
        ],
        preparation: [
          t(
            "Тонка плита лежить на всій A; болти затискають над підтримкою й не повинні продавлювати місцеві вм’ятини.",
            "The thin plate rests across A; bolts clamp over support and must not indent locally.",
          ),
          t(
            "Верхні головки/шайби включіть у CAM; нижня частина тримача в найглибшій точці — щонайменше на 5 мм вище реальних головок.",
            "Represent heads/washers in CAM; at maximum depth the holder’s lower envelope is at least 5 mm above actual heads.",
          ),
        ],
        acceptance: [
          t(
            "Після затиску контрольна висота не змінюється більш ніж на 0,02 мм; контакт A не перерваний стружкою.",
            "Clamping changes check height by no more than 0.02 mm; chips do not interrupt A seating.",
          ),
          t(
            "Жодна фаза не залишає кришку утриманою лише скотчем, клеєм або незакріпленим відходом.",
            "No phase leaves the cover retained only by tape, adhesive or unsecured waste.",
          ),
        ],
      },
    ],
    setups: [
      {
        ...featureSetup(
          "S10",
          [
            "Обмір і приймання заготовки",
            "Survey and incoming-stock acceptance",
          ],
          cover,
          "cover-carrier",
          [
            op(
              "OP10",
              [
                "Від функції до протоколу обміру",
                "From function to survey record",
              ],
              [
                "Для заданого навчального зразка зафіксуйте A/B/C, габарити, чотири центри йR 4. У реальному реверсі виконайте повторні обміри, позначте знос та невизначеність; не копіюйте значення цього прикладу на невідомий оригінал.",
                "For the specified learning sample record A/B/C, envelope, four centres andR 4. In real reverse engineering repeat measurements and identify wear/uncertainty; do not transfer these example values to an unknown original.",
              ],
              [
                "Штангенциркуль, мікрометр, штифти, висотомір та фото масштабу.",
                "Calipers, micrometer, pins, height gauge and scaled photographs.",
              ],
              ["На цьому етапі різання немає.", "No cutting at this stage."],
              [
                "Кожний функціональний розмір має джерело або явно позначений як припущення.",
                "Every functional dimension has a source or is explicitly identified as an assumption.",
              ],
              ["F1", "F2", "F6", "F7", "F8", "F9", "F10", "F11"],
              [
                "Якщо невідомі функція, кріплення або безпечне застосування, зупиніться до затвердження вимог.",
                "Stop until requirements are agreed if function, fastening or safe use is unknown.",
              ],
            ),
            op(
              "OP20",
              [
                "Прийняти товщину та широкі бази",
                "Accept thickness and broad faces",
              ],
              [
                "Перевірте плитину 6 мм у дев’яти точках і прийміть тільки 5,90–6,10 мм з різнотовщинністю≤0,05 мм. Позначте A. Цей маршрут зберігає постачальницькі широкі площини й не передбачає їх фрезерування.",
                "Inspect the 6 mm plate at nine points and accept only 5.90–6.10 mm with≤0.05 mm variation. Identify A. This route preserves the supplied broad faces and does not include facing them.",
              ],
              [
                "Зовнішній мікрометр і контрольна плита.",
                "Outside micrometer and surface plate.",
              ],
              [
                "Для X/Y залишається 4 мм на бік; по товщині припуск відсутній.",
                "Retain 4 mm per side in X/Y; no thickness stock is provided.",
              ],
              [
                "Вхідний протокол F3/F4 виконаний до CAM.",
                "Complete incoming F3/F4 inspection before CAM.",
              ],
              ["F3", "F4"],
              [
                "За невідповідної товщини змініть заготовку або створіть інший маршрут, а не затискайте сильніше.",
                "Change stock or create another route if thickness fails; do not clamp harder.",
              ],
            ),
            op(
              "OP30",
              [
                "Затвердити CAD, ревізію та припуск",
                "Approve CAD, revision and stock",
              ],
              [
                "У параметричній моделі задайте 100 ×70 R4, отвориØ4,5 та їхні базові координати. Перевірте креслення накладенням на протокол, положення болтів і 0,20 мм майбутнього виходу в підкладку.",
                "In the parametric model set 100 ×70 R4, Ø4.5 holes and their datum coordinates. Check the drawing against the survey, bolt positions and the future 0.20 mm sacrificial breakthrough.",
              ],
              [
                "CAD/CAM і карта перевірки незалежною людиною.",
                "CAD/CAM and an independent review sheet.",
              ],
              [
                "Заготовка 108 ×78; готовий нуль на 4 мм всередину від її прийнятих лівого/переднього країв.",
                "Stock 108 ×78; finished origin is 4 mm inside its accepted left/front edges.",
              ],
              [
                "Ревізія зафіксована до програми й операційної карти.",
                "Freeze the revision before the program and setup sheet.",
              ],
              ["F1", "F2", "F6", "F7", "F8", "F9"],
              [
                "За розбіжності креслення, моделі та протоколу не обирайте довільно одну версію.",
                "Do not arbitrarily choose one version if drawing, model and survey disagree.",
              ],
            ),
          ],
        ),
        machine: t(
          "Верстак, вимірювальна плита та CAD; обертання не потрібне.",
          "Bench, inspection plate and CAD; no rotation required.",
        ),
        diagram: {
          view: "inspection",
          clamping: "fixture-plate",
          flip: false,
          highlight: t(
            "Вхідні дані та приймання тонкої плити перед виготовленням.",
            "Input definition and thin-stock acceptance before manufacture.",
          ),
        },
      },
      {
        ...featureSetup(
          "S20",
          ["Свердління з повною підтримкою", "Drill with full support"],
          cover,
          "cover-carrier",
          drillPattern(cover, 4.5, ["F6", "F7", "F8", "F10", "F11"]),
        ),
        datums: t(
          "Встановіть майбутні готові X0/Y0 на 4 мм всередину від перевірених країв заготовки; Z0 — фактичний верх. A повністю на підкладці.",
          "Set future finished X0/Y0 at 4 mm inside verified stock edges; Z0 is the actual top. Support A fully on the backing.",
        ),
      },
      {
        ...featureSetup(
          "S30",
          ["Болтове утримання та контур", "Bolt retention and outside profile"],
          cover,
          "cover-carrier",
          [
            op(
              "OP10",
              [
                "Зміна притисків на чотири болти",
                "Transfer from clamps to four bolts",
              ],
              [
                "На зупиненому ізольованому обладнанні встановіть чотири M4 болти з шайбами, перевірте відсутність прогину й координатну контрольну точку. Лише після цього зніміть крайові притиски та повторіть перевірку.",
                "With the machine stopped and isolated fit all four M4 bolts/washers, check for bowing and verify a coordinate check point. Only then remove edge clamps and repeat the check.",
              ],
              [
                "Відповідний ключ за даними кріплення, індикатор, щуп.",
                "Suitable torque tool using hardware data, indicator and probe.",
              ],
              [
                "Функціональна товщина не повинна змінитися від затиску; припускX/Y 4 мм на бік.",
                "Clamping must not alter functional thickness; X/Y stock remains 4 mm per side.",
              ],
              [
                "Кожний болт утримує; жодна гайка не впирається в стіл.",
                "Verify every bolt retains and no nut bottoms on the table.",
              ],
              ["F3", "F4", "F7", "F8"],
              stopLift,
            ),
            op(
              "OP20",
              ["Чорновий замкнений контур", "Rough the closed profile"],
              [
                "Перед різанням у CAM підтвердьте, що весь припуск не далі 4,20 мм від прямих готових сторін: біля R4 найбільша зовнішня відстань до кута дорівнює √2×(4+4,20)−4=7,597 мм. Ø8 фреза перекриває весь цей пояс і перетворює його на стружку, без чотирьох вільних кутових обрізків. Пошарово обробіть контур із 0,15 мм по нормалі на фініш. Вихід униз — фактична товщина+0,20 мм. Якщо модель припуску виходить за умову, цей маршрут не запускайте.",
                "Before cutting, verify in CAM that all stock lies no more than 4.20 mm outside the finished straight sides: at R4 the maximum outside-corner distance is √2×(4+4.20)−4=7.597 mm. The Ø8 cutter covers this entire band and removes it as chips without four loose corner offcuts. Rough in layers with 0.15 mm normal finishing stock. Breakthrough is actual thickness+0.20 mm. Do not run this route if the stock model exceeds that condition.",
              ],
              [
                "Ø8 кінцева фреза для 5083 з достатньою робочою довжиною.",
                "Ø8 end mill for 5083 with adequate flute length.",
              ],
              [
                "0,15 мм по контуру, без зняття широких площин.",
                "0.15 mm contour stock; do not machine the broad faces.",
              ],
              [
                "Перший шар звірте з кресленням і кріпленням; відхід не може піднятися в тримач.",
                "Check the first layer against drawing and retention; waste cannot lift into the holder.",
              ],
              ["F1", "F2", "F9"],
              [
                "За пружиніння кришки, незакріпленого відходу чи зміни утримання негайно зупиніть цикл.",
                "Stop immediately for cover springing, unsecured waste or retention changes.",
              ],
            ),
            op(
              "OP30",
              [
                "Фініш до затвердженої геометрії",
                "Finish to the approved geometry",
              ],
              [
                "Завершіть 100 ×70 мм іR 4 одним збереженим нулем. Після зупинки перевірте прямі ділянки, чотири радіуси й координати отворів щодо вже готових C/B.",
                "Finish 100 ×70 mm andR 4 from the same origin. After stopping check straight portions, four radii and hole coordinates from the now-finished C/B faces.",
              ],
              [
                "Чиста чистова Ø8 фреза й прилади протоколу.",
                "Clean Ø8 finishing cutter and recorded inspection instruments.",
              ],
              [
                "Фініш у полях F1/F2/F9; не змінюйте отвори для приховування помилки контуру.",
                "Finish within F1/F2/F9; do not alter holes to conceal a profile error.",
              ],
              [
                "Після зняття повторіть F3/F4 й статичну примірку без силового згинання.",
                "After removal repeat F3/F4 and make a stationary fit check without bending the cover into place.",
              ],
              ["F1", "F2", "F3", "F4", "F6", "F7", "F8", "F9", "F10", "F11"],
              stopLift,
            ),
          ],
        ),
        transfer: t(
          "Підтримуйте кришку при знятті останнього болта; вихідний задирок знімайте на повній м’якій опорі. Кришку не вигинають для попадання в отвори.",
          "Support the cover while removing the last bolt; deburr the exit on full soft support. Do not bend it to align the holes.",
        ),
      },
      reverseInspection(cover, [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
      ]),
    ],
    cutting: [],
    pitfalls: [
      t(
        "Відтворення зношених країв без аналізу функції може зробити точну копію неправильної форми.",
        "Copying worn edges without analysing function can accurately reproduce the wrong shape.",
      ),
      t(
        "Наявний зазор у болтах не виправляє помилку кроку або перевернуту систему координат.",
        "Bolt clearance does not correct a pitch error or a mirrored coordinate system.",
      ),
    ],
    sources: [...commonSources, "proj-mill-shoulder"],
  },
);

millingSources.push({
  id: "proj-mill-norelem-cyl",
  title: "08900 Cylindrical Drill Bushes DIN 179 — Catalogue Dimensions",
  publisher: "norelem",
  url: "https://www.norelem.com/xs_db/DOKUMENT_DB/www/NORELEM/DataSheet/en/08/08900_Datasheet_4366_Drill_bushes_cylindrical_DIN_179--en.pdf",
});
