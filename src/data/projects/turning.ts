import type {
  CuttingCalculation,
  ManufacturingOperation,
  ManufacturingSetup,
  Project,
  ProjectFeature,
  ProjectFixture,
  Source,
  Text,
} from "../types";

const t = (uk: string, en: string): Text => ({ uk, en });
const pair = (value: [string, string]): Text => t(...value);
const dim = (
  id: string,
  name: [string, string],
  spec: string,
  nominal: number,
  lower: number,
  upper: number,
  datum: string,
  method: [string, string],
  instrument: [string, string],
  geometryRef?: string,
): ProjectFeature => ({
  id,
  name: pair(name),
  spec,
  nominal,
  lower,
  upper,
  datum,
  unit: "mm",
  method: pair(method),
  instrument: pair(instrument),
  ...(geometryRef ? { geometryRef } : {}),
});
const visual = (
  id: string,
  name: [string, string],
  spec: string,
  datum: string,
  method: [string, string],
): ProjectFeature => ({
  id,
  name: pair(name),
  spec,
  datum,
  unit: "visual",
  method: pair(method),
  instrument: t(
    "Освітлення, лупа 5×; для фаски — вимірювальна лупа або профільний проєктор.",
    "Lighting and 5× loupe; use a measuring loupe or profile projector for chamfers.",
  ),
});
const thread = (id: string, spec: string, datum: string): ProjectFeature => ({
  id,
  name: t("Внутрішня різьба", "Internal thread"),
  spec,
  datum,
  unit: "thread",
  method: t(
    "Після очищення перевірте відповідними калібрами GO/NO-GO за їхньою інструкцією, а глибину повного профілю — окремо. Примірка одного гвинта не є прийманням класу 6H.",
    "After cleaning, inspect with the specified GO/NO-GO gauges under their instructions; inspect full-profile depth separately. Trying one screw does not accept a 6H thread.",
  ),
  instrument: t(
    "Повірений різьбовий калібр-пробка зазначеного розміру та класу; глибиномір.",
    "Verified thread plug gauges of the specified size and class; depth gauge.",
  ),
});
const odMethod: [string, string] = [
  "Виміряйте не менше ніж у трьох перерізах і двох взаємно перпендикулярних напрямках; запишіть min/max після температурної стабілізації.",
  "Measure at no fewer than three axial sections in two perpendicular directions; record min/max after temperature stabilisation.",
];
const mic: [string, string] = [
  "Перевірений зовнішній мікрометр відповідного діапазону, ціна поділки 0,001 мм; бюджет похибки оцінено для цього допуску.",
  "Verified outside micrometer of the appropriate range, 0.001 mm resolution; assess the measurement error budget for this tolerance.",
];
const lengthMethod: [string, string] = [
  "Очистіть торці; виміряйте довжину у чотирьох кутових положеннях, не спираючись на фаски.",
  "Clean the ends; measure length at four angular positions without seating on chamfers.",
];
const depthMic: [string, string] = [
  "Глибинний або зовнішній мікрометр, контрольний еталон поблизу вимірюваного розміру.",
  "Depth or outside micrometer and a checked reference near the measured size.",
];
const boreMethod: [string, string] = [
  "Перевірте діаметр біля обох входів і посередині, у двох напрямках. Прохідна пробка перевіряє прохідність; одного показу внутрішніх губок недостатньо.",
  "Inspect diameter near both entries and at mid-depth in two directions. A passing plug checks passage; one reading with internal caliper jaws is insufficient.",
];
const boreGauge: [string, string] = [
  "Придатний нутромір із налаштуванням за перевіреним кільцем або набором мір; контрольні пробки за потреби.",
  "Suitable bore gauge set from a verified ring or reference combination; inspection plugs where required.",
];
const runoutMethod: [string, string] = [
  "На перевіреній оправці або в індикованому базовому встановленні виконайте ручний повний оберт у безпечному стані; TIR = max − min. Перевірте власну похибку оснащення.",
  "On a checked inspection arbor or indicated datum setup, make one manual revolution in the safe state; TIR = max − min. Check the fixture’s own contribution.",
];
const indicator: [string, string] = [
  "Індикатор 0,001 мм на жорсткій стійці, контрольна оправка/база з відомим биттям.",
  "0.001 mm indicator on a rigid stand and an inspection arbor/datum with known runout.",
];
const op = (
  id: string,
  title: [string, string],
  instruction: [string, string],
  tool: [string, string],
  allowance: [string, string],
  inspection: [string, string],
  stop: [string, string],
  featureIds: string[],
): ManufacturingOperation => ({
  id,
  title: pair(title),
  instruction: pair(instruction),
  tool: pair(tool),
  allowance: pair(allowance),
  inspection: pair(inspection),
  stop: pair(stop),
  featureIds,
});
const setup = (
  id: string,
  title: [string, string],
  purpose: [string, string],
  orientation: [string, string],
  datums: [string, string],
  workholding: [string, string],
  fixtureIds: string[],
  operations: ManufacturingOperation[],
  inspection: [string, string][],
  release: [string, string],
  transfer: [string, string],
  clamping: ManufacturingSetup["diagram"]["clamping"] = "soft-jaws",
  flip = false,
  view: ManufacturingSetup["diagram"]["view"] = "turning",
): ManufacturingSetup => ({
  id,
  title: pair(title),
  machine:
    view === "turning"
      ? t(
          "Метричний токарний верстат із перевіреною геометрією, огородженням і сумісним патроном/цангою.",
          "Metric lathe with verified geometry, guarding and a compatible chuck/collet.",
        )
      : t(
          "Фрезерний верстат із DRO або перевіреними координатами та закріпленим оснащенням.",
          "Milling machine with DRO or verified coordinates and secured workholding.",
        ),
  purpose: pair(purpose),
  orientation: pair(orientation),
  datums: pair(datums),
  workholding: pair(workholding),
  fixtureIds: clamping === "chuck" ? ["H1"] : fixtureIds,
  preparation: [
    t(
      "До встановлення ізолюйте енергію за процедурою верстата, очистіть посадки й опори; ключ і допоміжний інструмент приберіть до запуску.",
      "Before setup, isolate energy under the machine procedure and clean interfaces/supports; remove the key and auxiliary tools before starting.",
    ),
    t(
      "Перевірте різальну крайку, висоту/довжину інструмента та повний хід без зіткнень. Обороти й затиск обмежує найнижчий допустимий рейтинг усієї системи.",
      "Verify the cutting edge, tool height/length and full collision-free travel. The lowest applicable rating in the complete system limits speed and clamping.",
    ),
    t(
      "Занесіть у карту фактичні корекції, діаметр затиску, виліт, джерело режимів і результат перевірки кріплення; числова схема не підтверджує силу затиску.",
      "Record actual offsets, clamping diameter, overhang, cutting-data source and workholding verification; numerical geometry does not establish clamping force.",
    ),
  ],
  operations,
  inspection: inspection.map(pair),
  release: pair(release),
  transfer: pair(transfer),
  diagram: { view, clamping, flip, highlight: pair(purpose) },
});
const soft = (
  id: string,
  d: number,
  grip: number,
  extraUk = "",
  extraEn = "",
): ProjectFixture => ({
  id,
  name: t(
    `Розточені м’які кулачки Ø${d}, опорна глибина ${grip}`,
    `Bored soft jaws Ø${d}, seating depth ${grip}`,
  ),
  kind: "soft-jaws",
  made: true,
  purpose: t(
    "Повторно встановити готовий діаметр із чистою торцевою опорою, розподіливши тиск без слідів жорстких кулачків.",
    "Remount a finished diameter on a clean axial seat, distributing pressure without hard-jaw marks.",
  ),
  stock: t(
    "Комплект нових або придатних до повторної обробки м’яких верхніх кулачків, прямо сумісних із фактичним патроном.",
    "New or re-machinable soft top jaws explicitly compatible with the actual chuck.",
  ),
  dimensions: t(
    `Робоче гніздо: номінальний Ø${d} мм, торцева опора на глибині ${grip} мм. Зовнішні габарити, зачеплення й кріпильні отвори — лише за OEM патрона. ${extraUk}`,
    `Working nest: nominal Ø${d} mm, axial seat ${grip} mm deep. External envelope, serrations and attachment holes follow the chuck OEM only. ${extraEn}`,
  ),
  hardware: [
    t(
      "Штатні болти, Т-гайки й сумісний навантажувальний пристрій для розточування кулачків.",
      "Specified bolts, T-nuts and a compatible jaw-loading device for boring.",
    ),
  ],
  manufacture: [
    t(
      "Перевірте маркування, залишок матеріалу, довжину болтів і зачеплення з базовими кулачками. Не виготовляйте інтерфейс патрона за ескізом деталі.",
      "Verify identification, remaining material, bolt length and master-jaw engagement. Do not reproduce the chuck interface from the part sketch.",
    ),
    t(
      "Встановіть і навантажте кулачки способом, дозволеним саме цим патроном, у робочому діапазоні ходу. Пристрій для гідропатрона не переноситься автоматично на ручний патрон.",
      "Mount and load the jaws by the method approved for this chuck within the working stroke. A hydraulic-chuck loading device is not automatically suitable for a manual chuck.",
    ),
    t(
      `Підріжте опорну площину та розточіть робочий поясок під фактичний готовий Ø${d} мм. Глибина опори ${grip} мм; залиште розвантаження в куті, щоб фаска не заважала торцевому контакту.`,
      `Face the seat and bore the working land for the actual finished Ø${d} mm. Seat depth is ${grip} mm; relieve the corner so the chamfer cannot prevent axial seating.`,
    ),
    t(
      `Приберіть гострі краї, очистіть гніздо й перевірте його контрольним зразком. ${extraUk}`,
      `Deburr and clean the nest, then check with a representative sample. ${extraEn}`,
    ),
  ],
  preparation: [
    t(
      "Позначте комплект і положення кулачків. Перед кожним затиском очистіть торець-упор і перевірте відсутність дна/кріплення на шляху свердла.",
      "Identify the jaw set and positions. Before each clamping, clean the axial seat and check that drilling cannot reach the seat or fasteners.",
    ),
    t(
      "Підтвердьте придатність заданої довжини контакту, вильоту й навантаження за OEM та перевіркою встановлення; ці розміри не є універсальним мінімумом захоплення.",
      "Verify the proposed contact length, overhang and load against the OEM requirements and setup verification; these dimensions are not a universal minimum grip.",
    ),
  ],
  acceptance: [
    t(
      "Деталь сідає на опору без хитання; контакт усіх робочих кулачків підтверджено, хід затиску має запас.",
      "The part seats without rocking; contact at all working jaws is confirmed and clamping stroke has reserve.",
    ),
    t(
      "Биття після повторного встановлення відповідає вимозі конкретного переходу; затиск не деформує готовий діаметр.",
      "Remounting runout meets the operation’s requirement and clamping does not distort the finished diameter.",
    ),
  ],
});
const collet = (id: string, d: number): ProjectFixture => ({
  id,
  name: t(`Цангове встановлення під Ø${d}`, `Collet setup for Ø${d}`),
  kind: "collet",
  made: false,
  purpose: t(
    "Рівномірно затиснути коротку циліндричну деталь без контакту з різьбою або фаскою.",
    "Clamp a short cylindrical part uniformly without gripping the thread or chamfer.",
  ),
  stock: t(
    "Справний заводський цанговий патрон і цанга відповідного діапазону.",
    "Serviceable manufactured collet chuck and collet of the correct range.",
  ),
  dimensions: t(
    `Фактичний зовнішній Ø${d} мм має входити в паспортний діапазон цанги; повну довжину контакту перевірте за її документацією.`,
    `Actual OD ${d} mm must lie within the collet’s specified range; verify full contact length against its documentation.`,
  ),
  hardware: [
    t(
      "Штатна гайка/тяга та сумісний заводський регульований упор за потреби.",
      "Specified nut/drawtube and a compatible manufactured adjustable stop if needed.",
    ),
  ],
  manufacture: [],
  preparation: [
    t(
      "Очистіть конуси, пази й гайку; перевірте правильне складання та допустимий виступ цанги.",
      "Clean tapers, slots and nut; check correct assembly and permitted collet projection.",
    ),
    t(
      "Виставте деталь без опори на фаску; перевірте биття, затиск і зазори перед ручним пробним обертанням у безпечному стані.",
      "Locate without seating on a chamfer; verify runout, retention and clearance before a safe-state manual trial rotation.",
    ),
  ],
  acceptance: [
    t(
      "Повний циліндричний контакт без підгинання тонкої стінки; деталь не торкається прихованого упора свердлом або мітчиком.",
      "Full cylindrical contact without bending a thin wall; the drill or tap cannot contact a hidden stop.",
    ),
  ],
});
const calculation = (
  diameter: number,
  vc: number,
  feedPerRev: number,
  rpmLimit: number,
): CuttingCalculation => ({
  tool: t(
    "Приклад обчислення для одного токарного різця",
    "Arithmetic example for one turning tool",
  ),
  diameter,
  vc,
  feedPerRev,
  rpmLimit,
  assumptions: t(
    `Для вправи з арифметики припущено Vc=${vc} м/хв, f=${feedPerRev} мм/об і межу ${rpmLimit} об/хв. Це не затверджені режими для даного матеріалу або затиску.`,
    `For the arithmetic exercise assume Vc=${vc} m/min, f=${feedPerRev} mm/rev and a ${rpmLimit} rpm cap. These are not approved conditions for this material or setup.`,
  ),
  confirmation: t(
    "Перед різанням замініть припущення даними артикула інструмента, матеріалу й верстата; перевірте діаметр, подачу на оберт, радіальну глибину, затиск і дозволені оберти.",
    "Before cutting replace assumptions with the tool-item, material and machine data; verify diameter, feed per revolution, radial depth, workholding and permitted speed.",
  ),
});
const baseQuality: Text[] = [
  t(
    "Розміри відносяться до 20 °C. Дайте деталі, еталону й приладу стабілізуватися; запишіть температуру, корекції й фактичну невизначеність, а не лише роздільність дисплея.",
    "Dimensions refer to 20 °C. Stabilise the part, reference and instrument; record temperature, corrections and actual uncertainty rather than display resolution alone.",
  ),
  t(
    "Після кожного зняття очистіть і знову відновіть бази. Запишіть результати до й після розтискання, щоб виявити деформацію затиском.",
    "After every removal clean and re-establish the datums. Record results before and after release to expose clamping deformation.",
  ),
  t(
    "Числові межі нижче є вимогами цього інженерного прикладу. Маршрут не пройшов фізичної апробації; першу деталь приймають по всій карті контролю до повторення партії.",
    "The numerical limits below are requirements of this engineering example. The route has not been physically trialled; accept the first article against the entire inspection plan before repeating a batch.",
  ),
];
const commonHazards: Text[] = [
  t(
    "Без рукавичок, вільного одягу й прикрас біля обертання; огородження закриті. Будь-які вимірювання, очищення та перестановки — після зупинки й належної ізоляції за процедурою.",
    "No gloves, loose clothing or jewellery near rotation; keep guards in place. Measure, clean and remount only after stopping and applying the required isolation procedure.",
  ),
  t(
    "Не призначайте силу затиску чи оберти за діаметром із цього прикладу. Перевіряють патрон, кулачки, виліт, масу, матеріал та сили різання; за зміщення, вібрації чи незвичного шуму — негайна контрольована зупинка.",
    "Do not derive clamping force or speed from this example’s diameter. Verify chuck, jaws, overhang, mass, material and cutting loads; movement, chatter or unusual noise require an immediate controlled stop.",
  ),
];
const latheEquipment: Text[] = [
  t(
    "Метричний ручний токарний верстат; перевірені поперечна подача, люфти, висота центра, огородження та паспорт патрона. Перед роботою визначте, чи шкала поперечної подачі показує радіус або діаметр.",
    "Metric manual lathe with verified cross feed, backlash, centre height, guards and chuck documentation. Establish whether the cross-slide dial reads radius or diameter before work.",
  ),
  t(
    "Різці для зовнішнього точіння й торцювання, відповідні матеріалу; контроль вильоту й мінімального припуску для геометрії крайки. Режими беруть із даних конкретного інструмента.",
    "Material-appropriate turning/facing tools with verified overhang and the edge geometry’s minimum finishing allowance. Use cutting data for the actual tool.",
  ),
];
const stockPrep: Text[] = [
  t(
    "Перевірте марку й стан матеріалу за документом/маркуванням; очистіть консервацію дозволеним способом. Невідомий пруток не замінює зазначений матеріал.",
    "Verify material grade and condition from records/marking; remove protective coating by an approved method. Unknown bar is not a substitute for the stated material.",
  ),
  t(
    "Відпиляйте заготовку в закріпленому пильному пристрої, зніміть задирки на торцях та перевірте кривизну, тріщини й доступний припуск.",
    "Saw the blank in secured sawing equipment, deburr the ends and check straightness, cracks and available allowance.",
  ),
];

export const turningSources: Source[] = [
  {
    id: "proj-turn-lathe",
    title: "Metalworking Machines — Lathes",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/safety_haz/metalworking/lathes.html",
  },
  {
    id: "proj-turn-jaws",
    title: "Hydraulic Chuck — Setup and Jaws",
    publisher: "Haas Automation",
    url: "https://www.haascnc.com/service/troubleshooting-and-how-to/troubleshooting/hydraulic-chuck-troubleshooting-guide.html",
  },
  {
    id: "proj-turn-boring-rings",
    title: "Lathe Jaw Boring Rings — Compatibility",
    publisher: "Haas Automation",
    url: "https://www.haascnc.com/haas-tooling/lathe_workholding/lathe_boring_rings.html",
  },
  {
    id: "proj-turn-tool-setup",
    title: "Tool Set-up in Parting and Grooving",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/knowledge/parting-and-grooving/tool-set-up-parting-and-grooving",
  },
  {
    id: "proj-turn-tapping",
    title: "Tapping Operation Tips",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/knowledge/threading/tapping/operation-tips",
  },
  {
    id: "proj-turn-m5-tap",
    title: "M5×0.8, 6H Tap — Recommended Ø4.2 Drill",
    publisher: "Haas Tooling",
    url: "https://www.haastooling.com/p/03-1116",
  },
  {
    id: "proj-turn-m6-tap",
    title: "M6×1, 6H Tap — Recommended Ø5.0 Drill",
    publisher: "Haas Tooling",
    url: "https://www.haastooling.com/p/03-2155",
  },
  {
    id: "proj-turn-temperature",
    title: "Engineering Metrology Toolbox — Reference Temperature",
    publisher: "NIST",
    url: "https://emtoolbox.nist.gov/Faq/Faq.asp",
  },
  {
    id: "proj-turn-uncertainty",
    title: "Measurement Uncertainty in Caliper Calibration",
    publisher: "Mitutoyo America",
    url: "https://www.mitutoyo.com/webfoo/wp-content/uploads/15009A-caliper-uncertainty.pdf",
  },
  {
    id: "proj-turn-tool-life",
    title: "Turning Parameters and Tool Life",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-us/knowledge/general-turning/how-to-improve-tool-life-in-turning",
  },
  {
    id: "proj-turn-boring",
    title: "Turning with Boring Bars — Overhang and Contact",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/tools/silent-tools/what-is-silent-tools/application-guide-silent-tools/turning-appl-guide",
  },
];
const standardSources = [
  "proj-turn-lathe",
  "proj-turn-jaws",
  "proj-turn-temperature",
  "proj-turn-uncertainty",
  "proj-turn-tool-life",
];

const hard = (): ProjectFixture => ({
  id: "H1",
  name: t(
    "Штатний патрон із придатними жорсткими кулачками",
    "Specified chuck with suitable hard jaws",
  ),
  kind: "chuck",
  made: false,
  purpose: t(
    "Первинний затиск необробленої заготовки; положення, контакт і виліт задаються в конкретному встановленні.",
    "Initial retention of raw stock; position, contact and overhang are defined in the individual setup.",
  ),
  stock: t(
    "Заводський патрон і штатні кулачки з відомою моделлю та документацією.",
    "Manufactured chuck and specified jaws with known model and documentation.",
  ),
  dimensions: t(
    "Діапазон, зачеплення кулачків, монтаж, допустимі сила й оберти беруть з OEM; розмір прутка не визначає ці межі.",
    "Take range, jaw engagement, mounting and permitted force/speed from the OEM; bar diameter does not determine these limits.",
  ),
  hardware: [
    t(
      "Штатний ключ, кріплення та засоби огородження.",
      "Specified key, fasteners and guarding.",
    ),
  ],
  manufacture: [],
  preparation: [
    t(
      "У безпечному ізольованому стані очистити робочі поверхні й перевірити кріплення та стан кулачків за OEM.",
      "In the safe isolated state, clean contact surfaces and verify mounting/jaw condition under the OEM procedure.",
    ),
    t(
      "Встановити пруток за картою переходу, перевірити повний контакт, запас ходу й вільний простір; ключ негайно прибрати.",
      "Locate stock under the setup plan, verify full contact, stroke reserve and clearance, then remove the key immediately.",
    ),
  ],
  acceptance: [
    t(
      "Встановлення перевірене для фактичного навантаження; немає пошкоджень, неповного контакту чи відкритого незахищеного прутка.",
      "Verify the setup for actual loads; no damage, incomplete contact or unguarded projecting stock.",
    ),
  ],
});
type ProjectInput = Omit<
  Project,
  "revision" | "equipment" | "qualityPlan" | "hazards" | "sources" | "cutting"
> & {
  equipment?: Text[];
  qualityPlan?: Text[];
  hazards?: Text[];
  sources?: string[];
  cutting?: CuttingCalculation[];
};
const project = (value: ProjectInput): Project => ({
  ...value,
  fixtures: [hard(), ...value.fixtures],
  revision: "B-01",
  equipment: value.equipment || latheEquipment,
  qualityPlan: value.qualityPlan || baseQuality,
  hazards: value.hazards || commonHazards,
  sources: value.sources || standardSources,
  cutting: value.cutting || [],
});
const roundStock = (size: string): Project["stock"] => ({
  form: t("Відпиляний круглий пруток", "Sawn round bar"),
  size,
  preparation: stockPrep,
});
const stopCut: [string, string] = [
  "Зміщення деталі, зміна звуку, вібрація або вихід нижче нижньої межі — зупинка й перевірка причини до продовження.",
  "Stop for part movement, changed sound, chatter or an undersize reading; establish the cause before continuing.",
];
function finishFace(
  id: string,
  fixture: string,
  d: number,
  grip: number,
  total: number,
  finish: [string, string],
  opposite: [string, string],
  features: string[],
  note: [string, string] = ["", ""],
): ManufacturingSetup {
  const result = setup(
    id,
    [
      `Перестановка й чистовий торець ${finish[0]}`,
      `Remount and finish face ${finish[1]}`,
    ],
    [
      `Довести довжину до ${total}, зберігши готові діаметри.`,
      `Finish length to ${total} while preserving completed diameters.`,
    ],
    [
      `${opposite[0]} усередині на опорі; ${finish[0]} відкритий до інструмента. ${note[0]}`,
      `${opposite[1]} seats inside; ${finish[1]} is exposed to the tool. ${note[1]}`,
    ],
    [
      `Готовий Ø${d} відновлює вісь; ${opposite[0]} задає торцеву опору.`,
      `Finished Ø${d} restores the axis; ${opposite[1]} provides the axial seat.`,
    ],
    [
      `Захоплення на ${grip} мм готового Ø${d}; задані контакт і виліт перевіряються для цього патрона. ${note[0]}`,
      `Grip ${grip} mm of finished Ø${d}; verify this engagement and overhang for the actual chuck. ${note[1]}`,
    ],
    [fixture],
    [
      op(
        "OP40",
        [
          "Очистити й індикувати повторне встановлення",
          "Clean and indicate the remount",
        ],
        [
          `Очистіть ${opposite[0]} й опору. Перевірте повний контакт, вільний простір за деталлю та повторне биття доступного Ø${d} ≤0,02 мм до різання.`,
          `Clean ${opposite[1]} and the seat. Verify full contact, rear clearance and remount TIR ≤0.02 mm on accessible Ø${d} before cutting.`,
        ],
        ["Індикатор, щуп, освітлення.", "Indicator, feeler and lighting."],
        [
          "Готовий діаметр не має припуску; помилку встановлення не виправляють його переточуванням.",
          "The finished diameter has no stock; do not repair a locating error by recutting it.",
        ],
        [
          "Записати повторне биття й фактичну осьову посадку.",
          "Record remount runout and actual seating.",
        ],
        stopCut,
        features,
      ),
      op(
        "OP50",
        [
          `Торець ${finish[0]} та довжина ${total}`,
          `Face ${finish[1]} and length ${total}`,
        ],
        [
          `Спочатку залиште ${total + 0.15} мм, виміряйте після зупинки та охолодження, потім доведіть до цілі ${total.toFixed(2)}. Перевірте довжину також після розтискання; кромки не входять у вимірювальний контакт.`,
          `First leave ${total + 0.15} mm, measure after stopping/cooling, then finish to ${total.toFixed(2)}. Recheck after unclamping; exclude chamfers from the measuring contact.`,
        ],
        ["Гострий чистовий торцевий різець.", "Sharp finishing facing tool."],
        [
          "Останні 0,15 мм — осьові; ціль у середині симетричного поля допуску.",
          "The final 0.15 mm is axial; target the middle of the symmetric tolerance zone.",
        ],
        [
          "Довжина в чотирьох кутових положеннях; додатково контролювати довжини уступів.",
          "Length at four angular positions; inspect shoulder lengths separately.",
        ],
        stopCut,
        features,
      ),
      op(
        "OP60",
        [
          "Кромки й приймання вільної деталі",
          "Edges and released-part acceptance",
        ],
        [
          "Зніміть фаски за картою вимог без довільного збільшення отворів. Зніміть, очистіть і стабілізуйте деталь; заповніть усі зазначені ознаки, включно з діаметрами після звільнення.",
          "Chamfer to the requirements without arbitrarily enlarging holes. Remove, clean and stabilise the part; inspect every listed characteristic including diameters after release.",
        ],
        [
          "Фасковий різець і вказані в таблиці контрольні прилади.",
          "Chamfer tool and the inspection instruments listed in the requirements.",
        ],
        [
          "Готові базові поверхні не підпилювати й не полірувати при обертанні.",
          "Do not file finished datums or polish during rotation.",
        ],
        [
          "Карта min/max; за вузьких допусків врахувати похибку й температуру.",
          "Record min/max and account for uncertainty/temperature for narrow tolerances.",
        ],
        stopCut,
        features,
      ),
    ],
    [
      [
        "Повторити довжини й діаметри поза затиском; виміряні крайні значення мають вкладатися в межі, а не лише їх середнє.",
        "Repeat lengths/diameters off the fixture; every measured extreme must meet limits, not merely the average.",
      ],
    ],
    [
      "Зупиніть, ізолюйте, розтисніть і очистіть без стисненого повітря на шкіру чи одяг.",
      "Stop, isolate, release and clean without compressed air directed at skin or clothing.",
    ],
    [
      "Збережіть деталь з ревізією, картою контролю та фактичними налаштуваннями; повторний запуск партії потребує підтвердженого першого зразка.",
      "Retain the revision, inspection record and actual settings; repeating a batch requires an accepted first article.",
    ],
    "soft-jaws",
    true,
  );
  result.diagram.gripLength = grip;
  return result;
}
export const turningProjects: Project[] = [
  {
    id: "spacer",
    revision: "B-01",
    title: t("Точна проставка під гвинт M8", "Measured spacer for an M8 screw"),
    summary: t(
      "Алюмінієва проставка Ø20 ×15 з прохідним Ø8,5. Два встановлення, виготовлення торцевого гнізда в м’яких кулачках і контроль паралельності.",
      "An aluminum Ø20 ×15 spacer with a through Ø8.5 bore. Two setups, a bored soft-jaw seat and controlled face parallelism.",
    ),
    level: "beginner",
    family: "turning",
    material: t("EN AW-6061-T6, суцільний пруток", "EN AW-6061-T6 solid bar"),
    duration: t(
      "3–4 години з підготовкою кулачків і контролем першої деталі",
      "3–4 hours including jaws and first-article inspection",
    ),
    purpose: t(
      "Дистанційна втулка для нерухомого макета/органайзера. Це не сертифікована проставка для підйому, гальм або силового затиску.",
      "A spacing sleeve for a stationary mockup/organizer; not a certified lifting, brake or workholding spacer.",
    ),
    equipment: [
      ...latheEquipment,
      t(
        "Свердло Ø8,0, малий розточний різець або інструмент для остаточного Ø8,5; нутромір і мікрометр.",
        "Ø8.0 drill, small boring tool or a suitable final Ø8.5 process; bore gauge and micrometer.",
      ),
    ],
    stock: {
      form: t("Круглий пруток, відпиляна заготовка", "Sawn round bar"),
      size: "Ø22 ×40 mm",
      preparation: stockPrep,
    },
    part: {
      kind: "turned",
      sections: [{ length: 15, diameter: 20 }],
      bore: { diameter: 8.5 },
    },
    datums: [
      {
        id: "A",
        description: t(
          "Перший чистовий торець, створений у S1.",
          "First finished face, made in S1.",
        ),
      },
      {
        id: "B",
        description: t(
          "Вісь чистового зовнішнього циліндра.",
          "Axis of the finished outside cylinder.",
        ),
      },
    ],
    features: [
      dim(
        "F1",
        ["Зовнішній діаметр", "Outside diameter"],
        "Ø20 −0.02/0",
        20,
        19.98,
        20,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Загальна довжина", "Overall length"],
        "15 ±0.03",
        15,
        14.97,
        15.03,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F3",
        ["Прохідний отвір", "Through bore"],
        "Ø8.5 +0.00/+0.10",
        8.5,
        8.5,
        8.6,
        "B",
        boreMethod,
        boreGauge,
        "bore.diameter",
      ),
      dim(
        "F4",
        ["Розкид товщини по торцях", "Face-thickness spread"],
        "max − min ≤0.03",
        0,
        0,
        0.03,
        "A",
        [
          "Виміряйте товщину біля зовнішнього краю в чотирьох місцях; це контроль товщини, а не повна атестація площинності.",
          "Measure thickness near the outer edge at four positions; this checks thickness variation rather than fully certifying flatness.",
        ],
        depthMic,
      ),
      dim(
        "F5",
        ["Радіальне биття отвору", "Bore radial runout"],
        "TIR ≤0.05",
        0,
        0,
        0.05,
        "B",
        runoutMethod,
        indicator,
      ),
      visual(
        "F6",
        ["Фаски та кромки", "Chamfers and edges"],
        "C0.3–0.5, both ends; no loose burrs",
        "A",
        [
          "Перевірте обидва входи отвору й зовнішні краї; фаска не має скорочувати робочу опорну площу надмірно.",
          "Inspect both bore entries and outside edges; chamfers must not unnecessarily reduce the functional seating area.",
        ],
      ),
    ],
    fixtures: [hard(), soft("J1", 20, 10)],
    setups: [
      setup(
        "S1",
        [
          "Торець A, діаметр і отвір зі спільної осі",
          "Face A, OD and bore from one axis",
        ],
        [
          "Створити базу A та завершити основні діаметри до відрізання.",
          "Create A and finish the main diameters before separating the part.",
        ],
        [
          "A спрямований до задньої бабки; майбутній E знаходиться на 16,2 мм від A.",
          "A faces the tailstock; the future E cut is 16.2 mm from A.",
        ],
        [
          "Вісь патрона — технологічна база; A стане нулем довжини.",
          "Chuck axis is the process datum; A becomes the length origin.",
        ],
        [
          "Затисніть незайманий поясок прутка в придатних жорстких кулачках; запланований оброблюваний виліт 20 мм. Перевірте саме це поєднання контакту й навантаження за паспортом.",
          "Grip the untouched bar in suitable hard jaws; planned machining projection is 20 mm. Verify this particular contact/load combination against the manual.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["Підрізати A та встановити нуль", "Face A and establish zero"],
            [
              "Підріжте торець до суцільного чистого сліду. Позначте A на неробочій зоні й установіть поздовжній нуль від цього торця, не від пиляного краю.",
              "Face until the surface cleans up completely. Identify A on a nonfunctional area and set axial zero from this face, not from the saw cut.",
            ],
            [
              "Гострий різець для алюмінію; торцювання до центра.",
              "Sharp aluminum-suitable facing tool, cutting to centre.",
            ],
            [
              "Пиляний торець має щонайменше 0,5 мм на очищення.",
              "Allow at least 0.5 mm to clean the sawn face.",
            ],
            [
              "Перевірити чистий центр і відсутність виступу.",
              "Check the centre is clean with no pip.",
            ],
            [
              "Зупинитися, якщо різець залишає центральний конус або контакт кулачків ненадійний.",
              "Stop if the tool leaves a centre cone or jaw contact is unreliable.",
            ],
            ["F2", "F4"],
          ),
          op(
            "OP20",
            ["Проточити Ø20 на довжині 16,2", "Turn Ø20 over 16.2 length"],
            [
              "Чорново доведіть діаметр до 20,30; останні 0,30 мм по діаметру знімайте після контрольного виміру. Ціль чистового діаметра 19,99 мм; проточена довжина 16,2 мм залишає припуск на E.",
              "Rough to Ø20.30; remove the final 0.30 mm on diameter only after measurement. Aim for Ø19.99; the 16.2 mm turned length leaves E-face allowance.",
            ],
            [
              "Зовнішній різець із малим придатним радіусом вершини.",
              "External tool with a suitable small nose radius.",
            ],
            [
              "0,30 мм на діаметр =0,15 мм радіально; це не однакові покази шкали.",
              "0.30 mm on diameter equals 0.15 mm radial stock; dial readings may differ.",
            ],
            [
              "Мікрометр у трьох перерізах; F1 до зняття з патрона.",
              "Micrometer at three sections; inspect F1 before removal.",
            ],
            [
              "Віджим, налипання або вихід нижче 19,98 — зупинка й запис невідповідності.",
              "Stop and record nonconformance for deflection, built-up edge or size below 19.98.",
            ],
            ["F1"],
          ),
          op(
            "OP30",
            ["Підготувати та завершити отвір", "Prepare and finish the bore"],
            [
              "Просвердліть Ø8,0 на глибину, що гарантовано перекриває майбутні 16,2 мм, не торкаючись затиску; потім розточіть до цілі Ø8,55. Зніміть фаски A й перевірте, що вісь отвору не втрачена.",
              "Drill Ø8.0 beyond the future 16.2 mm part length without reaching workholding, then bore to a target Ø8.55. Chamfer A and check the bore remains on the established axis.",
            ],
            [
              "Свердло Ø8,0 і короткий малий розточний різець; фасковий інструмент.",
              "Ø8.0 drill, short small boring tool and chamfer tool.",
            ],
            [
              "Після свердління Ø8,0 залишено 0,50 мм на діаметр до номіналу Ø8,5.",
              "Ø8.0 drilling leaves 0.50 mm diametral allowance to nominal Ø8.5.",
            ],
            [
              "Отвір F3 та доступний контроль биття F5; після зупинки приберіть стружку.",
              "Inspect F3 and accessible F5 runout; remove chips after stopping.",
            ],
            [
              "Не продовжувати за забивання канавок або вібрації малого розточного різця.",
              "Do not continue with packed flutes or a chattering small boring tool.",
            ],
            ["F3", "F5", "F6"],
          ),
        ],
        [
          [
            "Зафіксувати F1/F3 і нуль A до розтискання.",
            "Record F1/F3 and A zero before release.",
          ],
        ],
        [
          "Зніміть пруток після ізоляції та відпиляйте заготовку на 16,2±0,2 мм від A у пильних лещатах; не ловіть відрізану деталь біля обертання.",
          "After isolation remove the bar and saw at 16.2±0.2 mm from A in saw workholding; never catch a separating piece near rotation.",
        ],
        [
          "Позначте A, очистіть новий E, виміряйте запас 1,0–1,4 мм до довжини 15. Підготуйте J1 під фактичний F1.",
          "Identify A, deburr E and confirm 1.0–1.4 mm stock over final length 15. Prepare J1 for actual F1.",
        ],
        "chuck",
      ),
      setup(
        "S2",
        ["Перевстановлення на Ø20 і чистовий E", "Remount Ø20 and finish E"],
        [
          "Отримати довжину й паралельність без повторної обробки Ø20.",
          "Achieve length and parallelism without recutting Ø20.",
        ],
        [
          "A сідає на опору J1; E відкритий до інструмента.",
          "A seats against J1; E is exposed to the tool.",
        ],
        [
          "Зовнішній Ø20 відновлює B-вісь; чистий A задає осьове положення.",
          "OD20 restores datum axis B; clean face A establishes the axial location.",
        ],
        [
          "Захоплення Ø20 на 10 мм у J1; решта приблизно 6,2 мм доступна для торцювання. Вхід отвору не має спиратися на стружку.",
          "Grip Ø20 over 10 mm in J1, leaving approximately 6.2 mm accessible for facing. The bore entry must not seat on chips.",
        ],
        ["J1"],
        [
          op(
            "OP40",
            ["Перевірити повторне встановлення", "Verify the remount"],
            [
              "Очистіть опору й A, затисніть деталь і перевірте посадку. Індикатором по доступному Ø20 підтвердьте повторне биття ≤0,03 мм до будь-якого різання.",
              "Clean the seat and A, clamp, and confirm seating. Indicate accessible Ø20 to verify remounting TIR ≤0.03 mm before cutting.",
            ],
            ["Індикатор і жорстка стійка.", "Indicator and rigid stand."],
            [
              "Розмір F1 уже готовий; не виправляйте його повторним точінням.",
              "F1 is finished; do not correct the setup by recutting it.",
            ],
            [
              "Посадка A без щілини; запас на E відповідає запису.",
              "A seats without a gap and E stock matches the record.",
            ],
            [
              "Нестабільний показ або неповний контакт — очистити й повторити встановлення, а не посилювати затиск навмання.",
              "Unstable readings or incomplete contact require cleaning and remounting, not arbitrary extra force.",
            ],
            ["F1", "F4"],
          ),
          op(
            "OP50",
            ["Торцювати E до 15,00", "Face E to 15.00"],
            [
              "Спершу залиште загальну довжину 15,15. Виміряйте після зупинки, потім дозовано доведіть до цілі 15,00; врахуйте знак і одиниці поздовжньої подачі.",
              "First leave an overall length of 15.15. Measure after stopping, then finish deliberately to a 15.00 target, accounting for feed direction and units.",
            ],
            ["Чистовий торцевий різець.", "Finishing facing tool."],
            [
              "0,15 мм по осі на остаточний прохід; не переносити як радіальний припуск.",
              "0.15 mm axial stock for final finishing; do not treat it as radial allowance.",
            ],
            [
              "F2 у кількох кутових положеннях; повторити після розтискання.",
              "Inspect F2 at several angular positions and repeat after release.",
            ],
            [
              "При зростанні розкиду товщини перевірити A/опору, висоту різця та геометрію верстата.",
              "If thickness spread grows, inspect A/seat, tool height and machine geometry.",
            ],
            ["F2", "F4"],
          ),
          op(
            "OP60",
            ["Фаска E й остаточне приймання", "Chamfer E and accept the part"],
            [
              "Зніміть C0,3–0,5 на E та вході отвору, не змінюючи опорну довжину. Після зняття деталі очистіть її, стабілізуйте температуру й заповніть F1–F6.",
              "Add C0.3–0.5 to E and the bore entry without altering seating length. Remove, clean, stabilise and complete F1–F6.",
            ],
            [
              "Фасковий інструмент; мікрометр і нутромір.",
              "Chamfer tool, micrometer and bore gauge.",
            ],
            [
              "Фаска не є додатковим укороченням деталі.",
              "The chamfer is not an additional shortening allowance.",
            ],
            [
              "Повна карта F1–F6, окремо F4 min/max.",
              "Full F1–F6 record, with F4 min/max separately.",
            ],
            [
              "Будь-яка незнята стружка чи задирка — деталь не передавати до складання.",
              "Do not release the part to assembly with loose chips or burrs.",
            ],
            ["F2", "F3", "F4", "F6"],
          ),
        ],
        [
          [
            "Після розтискання повторити F1, F2 і F4: так виявляється деформація тонкої втулки.",
            "Repeat F1, F2 and F4 after release to reveal sleeve distortion.",
          ],
        ],
        [
          "Зніміть деталь лише після зупинки; зберігайте із картою вимірювань.",
          "Remove only after stopping and retain with its inspection record.",
        ],
        [
          "Виконайте нерухому примірку на відомому M8; проходження гвинта не замінює F3.",
          "Make a stationary fit check with an identified M8 screw; screw passage does not replace F3.",
        ],
        "soft-jaws",
        true,
      ),
    ],
    cutting: [calculation(20, 100, 0.08, 1800)],
    qualityPlan: baseQuality,
    pitfalls: [
      t(
        "Помилка 0,30 мм по діаметру проти 0,30 мм радіально дає зайве зняття матеріалу.",
        "Confusing 0.30 mm diametral stock with 0.30 mm radial stock removes too much material.",
      ),
      t(
        "Стружка під A безпосередньо змінює довжину й розкид товщини.",
        "A chip beneath A directly changes length and thickness variation.",
      ),
    ],
    hazards: commonHazards,
    lessons: [
      "daily-inspection",
      "tool-setting-lathe",
      "lathe-facing",
      "lathe-drilling",
      "micrometer",
      "inspection-plan",
    ],
    sources: standardSources,
  },
  project({
    id: "stepped-shaft",
    title: t(
      "Ступінчастий валик для настільного механізму",
      "Stepped shaft for a bench mechanism",
    ),
    summary: t(
      "C45: Ø20/Ø14, по 30 мм кожна шийка. Є маршрут E-першим, припуски по діаметру, захист готової шийки та перевірка співвісності.",
      "C45: Ø20/Ø14 journals, each 30 mm long. Includes a E-first route, diametral allowances, finished-journal protection and coaxial inspection.",
    ),
    level: "intermediate",
    family: "turning",
    material: t(
      "C45 у нормалізованому стані; без термообробки в цьому маршруті",
      "Normalized C45; no heat treatment in this route",
    ),
    duration: t("4–6 годин", "4–6 hours"),
    purpose: t(
      "Валик ручного настільного демонстратора, без силового обертання та без підтвердженого ресурсу підшипників.",
      "Shaft for a hand-operated bench demonstrator, without powered service or a rated bearing life.",
    ),
    stock: roundStock("Ø22 ×90 mm"),
    part: {
      kind: "turned",
      sections: [
        { length: 30, diameter: 20 },
        { length: 30, diameter: 14 },
      ],
    },
    datums: [
      {
        id: "A",
        description: t(
          "Торець з боку Ø20, остаточно створюється в S2.",
          "End at Ø20, finally made in S2.",
        ),
      },
      {
        id: "B",
        description: t("Вісь шийки Ø20.", "Axis of the Ø20 journal."),
      },
      {
        id: "C",
        description: t("Уступ між Ø20 і Ø14.", "Shoulder between Ø20 and Ø14."),
      },
    ],
    features: [
      dim(
        "F1",
        ["Базова шийка", "Datum journal"],
        "Ø20 −0.02/0",
        20,
        19.98,
        20,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Друга шийка", "Second journal"],
        "Ø14 −0.02/0",
        14,
        13.98,
        14,
        "B",
        odMethod,
        mic,
        "sections.1.diameter",
      ),
      dim(
        "F3",
        ["Загальна довжина", "Overall length"],
        "60 ±0.05",
        60,
        59.95,
        60.05,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F4",
        ["Довжина від A до уступу", "A-to-shoulder length"],
        "30 ±0.03",
        30,
        29.97,
        30.03,
        "A",
        [
          "Виміряйте від A до C глибинним мікрометром на чистих поверхнях.",
          "Measure A to C with a depth micrometer on clean surfaces.",
        ],
        depthMic,
        "sections.0.length",
      ),
      dim(
        "F5",
        ["Биття Ø14 відносно B", "Ø14 runout relative to B"],
        "TIR ≤0.03",
        0,
        0,
        0.03,
        "B",
        runoutMethod,
        indicator,
      ),
      visual(
        "F6",
        ["Вихід різця й фаски", "Tool exit and chamfers"],
        "C0.3–0.5; shoulder corner R≤0.4",
        "C",
        [
          "Огляньте уступ: спряжувана деталь має мати більшу вхідну фаску, ніж залишковий радіус різця.",
          "Inspect the shoulder; the mating component needs an entry relief larger than the remaining tool-nose radius.",
        ],
      ),
    ],
    fixtures: [
      soft(
        "J1",
        20,
        25,
        "Наскрізний вихід за поясом Ø20 має вільно пропускати шийку Ø14 на 30 мм; не впирайте її в корпус патрона.",
        "A clear passage behind the Ø20 land must admit the 30 mm Ø14 journal without bottoming in the chuck.",
      ),
    ],
    setups: [
      setup(
        "S1",
        ["Спочатку торець E й обидві шийки", "E end and both journals first"],
        [
          "Зберегти співвісність Ø20/Ø14, обробивши їх без розтискання.",
          "Preserve Ø20/Ø14 coaxiality by machining both before releasing.",
        ],
        [
          "E відкритий до задньої бабки; майбутній A ще всередині залишку прутка.",
          "E faces the tailstock; future A remains within the bar remnant.",
        ],
        [
          "Нуль довжини від чистого E; C на 30,00 мм від E.",
          "Length zero is the finished E end; C is 30.00 mm from E.",
        ],
        [
          "У патроні залишається приблизно 28 мм необробленого прутка; оброблювана проєкція 62 мм. Якщо OEM/перший пробний прохід не підтверджує таке встановлення — цей маршрут не застосовують.",
          "Approximately 28 mm of untouched bar remains gripped, with 62 mm machining projection. Do not use this route unless OEM constraints and a verified first cut support this setup.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            [
              "Створити E та розмітити осьові межі",
              "Create E and establish axial boundaries",
            ],
            [
              "Підріжте E, установіть нуль і позначте C на 30,00 мм, лінію пили на 61,2 мм. Вимірюйте всі довжини від одного E, без ланцюгових приростів.",
              "Face E, establish zero, and identify C at 30.00 mm and the saw line at 61.2 mm. Take every length from E rather than chaining increments.",
            ],
            [
              "Торцевий різець і поздовжній DRO/ліміб.",
              "Facing tool and longitudinal DRO/dial.",
            ],
            [
              "A залишено 1,2 мм на друге встановлення.",
              "Leave 1.2 mm at A for the second setup.",
            ],
            [
              "Перевірити відлік 30/61,2 незалежним засобом.",
              "Independently check the 30/61.2 locations.",
            ],
            stopCut,
            ["F3", "F4"],
          ),
          op(
            "OP20",
            ["Чорново сформувати обидва діаметри", "Rough both diameters"],
            [
              "Обробіть 0–30 мм від E до Ø14,30 і 30–61,2 мм до Ø20,30. Не зміщуйте C під час переходів; залиште 0,30 мм по діаметру на обох шийках.",
              "Machine E-to-30 mm to Ø14.30 and 30-to-61.2 mm to Ø20.30. Keep C fixed throughout; leave 0.30 mm diametral stock on both journals.",
            ],
            [
              "Придатний для C45 чорновий різець.",
              "C45-suitable roughing tool.",
            ],
            [
              "0,30 мм по діаметру =0,15 мм на бік.",
              "0.30 mm diametral stock equals 0.15 mm per side.",
            ],
            [
              "Після охолодження перевірити віджим і конусність обох поясів.",
              "After cooling, check deflection and taper on both lands.",
            ],
            stopCut,
            ["F1", "F2", "F4"],
          ),
          op(
            "OP30",
            ["Чистові шийки та уступ", "Finish journals and shoulder"],
            [
              "Окремими вимірюваними проходами доведіть Ø20 до 19,99, Ø14 до 13,99 мм. Підріжте C до 30,00 від E, не підрізаючи шийку; зніміть фаску E й зовнішній край уступу.",
              "Use separately measured finishing passes to target Ø19.99 and Ø13.99. Finish C to 30.00 from E without undercutting the journal; chamfer E and the outside shoulder edge.",
            ],
            [
              "Чистовий різець із радіусом вершини ≤0,4 мм.",
              "Finishing tool with nose radius ≤0.4 mm.",
            ],
            [
              "Після кожного проміру знімайте лише половину потрібної зміни діаметра, якщо лімб радіальний.",
              "On a radius-reading dial, advance only half the required diameter correction.",
            ],
            [
              "F1/F2 у трьох перерізах; C від E 30,00±0,03.",
              "Inspect F1/F2 at three sections; C is 30.00±0.03 from E.",
            ],
            stopCut,
            ["F1", "F2", "F4", "F6"],
          ),
        ],
        [
          [
            "Занести фактичні F1/F2 та розмір E–C до розтискання.",
            "Record actual F1/F2 and E–C before release.",
          ],
        ],
        [
          "Після ізоляції зняти пруток і відпиляти по лінії 61,2; видалити задирку A.",
          "After isolation remove the bar and saw at 61.2; deburr A.",
        ],
        [
          "Перевірити наскрізний прохід патрона для Ø14, промаркувати E й зберегти вимір E–C.",
          "Check chuck clearance for Ø14, identify E and retain the E–C measurement.",
        ],
        "chuck",
      ),
      setup(
        "S2",
        [
          "Чистий A на готовій базовій шийці",
          "Finish A on the completed datum journal",
        ],
        [
          "Замкнути довжину 60 та A–C без втрати шийок.",
          "Close the 60 overall and A–C dimensions without altering the journals.",
        ],
        [
          "A назовні; Ø14 входить усередину вільного проходу, а не затискається.",
          "A faces outward; Ø14 enters a clear passage and is not gripped.",
        ],
        [
          "Індикований Ø20 задає B; початковий торець E доступний для контролю загальної довжини після зняття.",
          "Indicated Ø20 establishes B; the E end remains the reference for off-machine overall-length checks.",
        ],
        [
          "J1 охоплює 25 мм готової Ø20 від уступу C у бік A; приблизно 6,2 мм A виступає для торцювання. Не затискайте змішані діаметри жорсткими кулачками.",
          "J1 grips 25 mm of finished Ø20 from C toward A, leaving approximately 6.2 mm at A for facing. Do not grip mixed diameters in hard jaws.",
        ],
        ["J1"],
        [
          op(
            "OP40",
            [
              "Перевірити вісь і вільний прохід",
              "Verify the axis and clearance",
            ],
            [
              "За індикатором відновіть E на Ø20; вручну перевірте відсутність упирання Ø14 й контакту уступу з кутовим радіусом кулачків.",
              "Restore E by indicating Ø20; manually verify Ø14 does not bottom and C does not seat on a jaw corner radius.",
            ],
            ["Індикатор, щуп і освітлення.", "Indicator, feeler and lighting."],
            [
              "Шийки готові, припуск лише на A.",
              "Journals are finished; only A has stock.",
            ],
            [
              "Повторне биття Ø20 ≤0,015 мм для резерву F5.",
              "Ø20 remount TIR ≤0.015 mm to retain F5 margin.",
            ],
            stopCut,
            ["F1", "F5"],
          ),
          op(
            "OP50",
            [
              "Довести A від контрольованого E–C",
              "Finish A using the recorded E–C",
            ],
            [
              "Зніміть A спочатку до загальної 60,15; потім до 60,00. Після зняття перевірте також A–C: виконання лише загальної довжини не підтверджує положення уступу.",
              "Face A first to overall 60.15, then 60.00. After removal also check A–C; overall length alone does not accept shoulder location.",
            ],
            ["Чистовий торцевий різець.", "Finishing facing tool."],
            [
              "Останні 0,15 мм — осьовий припуск; ціль A–C 30,00.",
              "Final 0.15 mm is axial stock; target A–C is 30.00.",
            ],
            [
              "F3/F4 вимірюються незалежно й мають узгоджуватися із записаним E–C.",
              "Inspect F3/F4 independently and reconcile with recorded E–C.",
            ],
            stopCut,
            ["F3", "F4"],
          ),
          op(
            "OP60",
            ["Кромки й контроль осей", "Edges and axis verification"],
            [
              "Зніміть фаску A C0,3–0,5; після розтискання перевірте всі діаметри. На індикованому Ø20 обережним ручним обертом перевірте F5 у двох перерізах Ø14.",
              "Add A chamfer C0.3–0.5 and inspect all diameters after release. On indicated Ø20, check F5 at two Ø14 sections with safe-state manual rotation.",
            ],
            [
              "Фасковий різець, мікрометри й індикатор.",
              "Chamfer tool, micrometers and indicator.",
            ],
            [
              "Не шліфувати шийки шкіркою під час обертання.",
              "Do not polish rotating journals with emery cloth.",
            ],
            [
              "F1–F6; записати похибку самого індикованого встановлення.",
              "Record F1–F6 and the indicated setup’s own error.",
            ],
            stopCut,
            ["F1", "F2", "F3", "F4", "F5", "F6"],
          ),
        ],
        [
          [
            "Прийняти геометрію лише після вимірювання вільної деталі.",
            "Accept geometry only after inspecting the released part.",
          ],
        ],
        [
          "Очистіть, промаркуйте ревізію й захистіть шийки від корозії придатним засобом.",
          "Clean, identify the revision and protect journals with a suitable corrosion preventive.",
        ],
        [
          "Перед складанням перевірте спряжувані отвори й радіуси; номінал Ø14 не є автоматичним призначенням посадки.",
          "Inspect mating bores and corner relief before assembly; nominal Ø14 does not automatically define a fit.",
        ],
        "soft-jaws",
        true,
      ),
    ],
    cutting: [calculation(20, 60, 0.08, 1500)],
    pitfalls: [
      t(
        "Положення уступу задається від E у S1 й перевіряється від A у S2: незалежні виміри запобігають накопиченню помилки.",
        "The shoulder is located from E in S1 and checked from A in S2; independent checks prevent accumulated error.",
      ),
      t(
        "Затиск за Ø14 не замінює базування на Ø20 для вимоги F5.",
        "Gripping Ø14 does not substitute for the Ø20 datum in F5.",
      ),
    ],
    lessons: [
      "tool-setting-lathe",
      "lathe-turning",
      "lathe-centering",
      "micrometer",
      "dial-indicator",
      "inspection-plan",
    ],
  }),
  project({
    id: "flange",
    title: t("Координатний монтажний диск Ø70", "Ø70 coordinate mounting disc"),
    summary: t(
      "Токарні Ø70/Ø20 і товщина 12; фрезерне коло чотирьох отворів Ø6,6. Є плита-підкладка, перенесення осі та незалежний контроль координат.",
      "Turned Ø70/Ø20 and 12 thickness, followed by four Ø6.6 holes. Includes a sacrificial carrier plate, axis transfer and independent coordinate inspection.",
    ),
    level: "advanced",
    family: "hybrid",
    material: t("EN AW-6061-T6", "EN AW-6061-T6"),
    duration: t(
      "6–8 годин із виготовленням підкладки",
      "6–8 hours including the carrier plate",
    ),
    purpose: t(
      "Монтажний диск нерухомого настільного приладу. Не фланець для тиску, підйому, силового обертання чи шпинделя.",
      "Mounting disc for a stationary bench instrument; not a pressure, lifting, powered-transmission or spindle flange.",
    ),
    equipment: [
      ...latheEquipment,
      t(
        "Фрезерний із DRO, індикатор/щуп для центра, висотомір із контрольними штифтами або координатний засіб для незалежного приймання.",
        "Mill with DRO, centring probe/indicator and a height gauge with pins or coordinate instrument for independent acceptance.",
      ),
    ],
    stock: roundStock("Ø75 ×50 mm"),
    part: {
      kind: "turned",
      sections: [{ length: 12, diameter: 70 }],
      bore: { diameter: 20 },
      holes: [
        { x: 25, y: 0, diameter: 6.6 },
        { x: 0, y: 25, diameter: 6.6 },
        { x: -25, y: 0, diameter: 6.6 },
        { x: 0, y: -25, diameter: 6.6 },
      ],
    },
    datums: [
      {
        id: "A",
        description: t("Опорний торець диска.", "Seating face of the disc."),
      },
      {
        id: "B",
        description: t(
          "Вісь чистового отвору Ø20.",
          "Axis of the finished Ø20 bore.",
        ),
      },
      {
        id: "C",
        description: t(
          "Умовний напрямок першого отвору +X; кутове положення для одиночної деталі довільне.",
          "Direction of the first +X hole; angular orientation is arbitrary for this single part.",
        ),
      },
    ],
    features: [
      dim(
        "F1",
        ["Зовнішній діаметр", "Outside diameter"],
        "Ø70 ±0.05",
        70,
        69.95,
        70.05,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Товщина", "Thickness"],
        "12 ±0.03",
        12,
        11.97,
        12.03,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F3",
        ["Центральний отвір", "Central bore"],
        "Ø20 +0.02/+0.05",
        20,
        20.02,
        20.05,
        "B",
        boreMethod,
        boreGauge,
        "bore.diameter",
      ),
      dim(
        "F4",
        ["Чотири отвори", "Four holes"],
        "4 × Ø6.6 +0/+0.15",
        6.6,
        6.6,
        6.75,
        "A|B",
        [
          "Перевірте кожний отвір придатними пробками/нутроміром; не оцінюйте всі чотири за одним.",
          "Inspect every hole with suitable plugs/bore measurement; do not infer four results from one.",
        ],
        boreGauge,
        "holes.0.diameter",
      ),
      dim(
        "F5",
        ["Координата X першого отвору", "X of first hole"],
        "+25 ±0.05",
        25,
        24.95,
        25.05,
        "B|C",
        [
          "На незалежному координатному засобі визначте вісь Ø20 й центр кожного штифта; номінальні центри (25,0),(0,25),(-25,0),(0,-25). Для решти центрів застосуйте ту саму ±0,05 до X та Y.",
          "On an independent coordinate system locate the Ø20 axis and each pin centre; nominal centres are (25,0),(0,25),(-25,0),(0,-25). Apply the same ±0.05 to X and Y for the other centres.",
        ],
        [
          "Координатний прилад або перевірена висотомірна схема зі штифтами й обертанням бази.",
          "Coordinate instrument or a verified height-gauge/pin arrangement with datum rotation.",
        ],
        "holes.0.x",
      ),
      dim(
        "F6",
        ["Паралельність товщини", "Thickness parallelism check"],
        "max − min ≤0.03",
        0,
        0,
        0.03,
        "A",
        lengthMethod,
        depthMic,
      ),
      dim(
        "F7",
        ["Биття Ø70 від отвору", "Ø70 runout from bore"],
        "TIR ≤0.05",
        0,
        0,
        0.05,
        "B",
        runoutMethod,
        indicator,
      ),
      visual(
        "F8",
        ["Фаски та отвори", "Chamfers and holes"],
        "C0.3–0.5; burr-free",
        "A",
        [
          "Перевірте вхід і вихід усіх отворів, не збільшуючи діаметр зенкуванням.",
          "Inspect every hole entry and exit without enlarging the bore by excessive countersinking.",
        ],
      ),
    ],
    fixtures: [
      soft("J1", 70, 8),
      {
        id: "P1",
        name: t(
          "Жертовна плита під свердління диска",
          "Sacrificial drilling carrier",
        ),
        kind: "sacrificial-plate",
        made: true,
        purpose: t(
          "Підтримати A, залишити безпечний вихід свердла й забезпечити три затиски між робочими отворами.",
          "Support A, allow drill breakthrough and provide three clamps between the working holes.",
        ),
        stock: t(
          "Алюмінієва плита 100 ×100 ×18 мм.",
          "Aluminum plate 100 ×100 ×18 mm.",
        ),
        dimensions: t(
          "Готова 100 ×100 ×15; площина опори очищена, чотири технологічні кишені виходу Ø10 глибиною 3 на (75,50),(50,75),(25,50),(50,25). Центр диска — (50,50).",
          "Finish 100 ×100 ×15; clean support face, four Ø10 ×3-deep drill-clearance pockets at (75,50),(50,75),(25,50),(50,25). Disc centre is (50,50).",
        ),
        hardware: [
          t(
            "Заводські прихвати/ступінчасті опори, сумісні Т-болти; місця затиску приблизно 45°,165°,285° по зовнішньому краю.",
            "Manufactured strap clamps/step supports and compatible T-bolts; clamp locations approximately 45°,165°,285° around the outer edge.",
          ),
        ],
        manufacture: [
          t(
            "Закріпіть плиту, створіть опорну площину й протилежний бік до 15±0,1 мм.",
            "Secure the plate, face the support surface and opposite side to 15±0.1 mm.",
          ),
          t(
            "Задайте координати від двох базових кромок, позначте центр (50,50).",
            "Set coordinates from two reference edges and identify centre (50,50).",
          ),
          t(
            "Виберіть чотири Ø10 кишені глибиною 3±0,2 мм; вони не є отворами кріплення.",
            "Machine four Ø10 pockets 3±0.2 mm deep; these are not mounting holes.",
          ),
          t(
            "Зніміть задирки й повторно перевірте, що всі прихвати й опори поза траєкторією Ø6,6 та тримача.",
            "Deburr and recheck that clamps/supports lie outside the Ø6.6 tool and holder paths.",
          ),
        ],
        preparation: [
          t(
            "Закріпіть саму плиту на столі; диск не може триматися лише власною вагою або центральним штифтом.",
            "Secure the carrier to the table; neither disc weight nor a centre pin is adequate retention.",
          ),
          t(
            "Поставте A на плиту; прихвати підпираються на зовнішній обід, не перекривають отвори й не згинають диск.",
            "Seat A on the plate; supported clamps act on the outer rim, clear the holes and do not bend the disc.",
          ),
        ],
        acceptance: [
          t(
            "Плита не хитається; A має повний контакт без стружки, свердлу є щонайменше 2 мм вільного виходу в кишені.",
            "Carrier is stable; A seats chip-free and the drill has at least 2 mm of free breakthrough within the pockets.",
          ),
          t(
            "Незалежно перевірено центр і всі чотири координати, а не лише робочий нуль DRO.",
            "Independently verify the centre and all four locations, rather than relying only on DRO zero.",
          ),
        ],
        geometry: {
          kind: "block",
          width: 100,
          depth: 100,
          height: 15,
          holes: [
            { x: 75, y: 50, diameter: 10, depth: 3 },
            { x: 50, y: 75, diameter: 10, depth: 3 },
            { x: 25, y: 50, diameter: 10, depth: 3 },
            { x: 50, y: 25, diameter: 10, depth: 3 },
          ],
        },
      },
    ],
    setups: [
      setup(
        "S1",
        [
          "Токарна база A та співвісні діаметри",
          "Turn A and coaxial diameters",
        ],
        [
          "Отримати A, Ø70 і Ø20 без зміни осі.",
          "Produce A, Ø70 and Ø20 without changing the axis.",
        ],
        [
          "A до інструмента; майбутній E на 13,2 мм від A.",
          "A faces the tool; future E is 13.2 mm from A.",
        ],
        [
          "A задає осьовий нуль, вісь шпинделя — попередню B.",
          "A establishes axial zero; spindle axis is the provisional B.",
        ],
        [
          "Пруток Ø75 закріплено в придатному патроні; проєкція близько 16 мм. Широкий диск і отвір вимагають перевірки сили/рейтингу патрона.",
          "Secure Ø75 stock in a suitable chuck with approximately 16 mm projection; the wide disc and bore require chuck-force/rating verification.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["A та чорновий Ø70", "A and rough Ø70"],
            [
              "Підріжте A, потім обробіть зовнішній поясок на довжині 13,2 до Ø70,30; осьовий припуск на E залиште.",
              "Face A, then rough the outside over 13.2 length to Ø70.30, retaining E-face stock.",
            ],
            ["Торцевий і зовнішній різці.", "Facing and external tools."],
            [
              "0,30 мм по діаметру, 1,2 мм на E.",
              "0.30 diametral stock and 1.2 at E.",
            ],
            [
              "Перевірте відсутність тарілчастості A й чорновий діаметр.",
              "Check A for dishing and measure the rough diameter.",
            ],
            stopCut,
            ["F1", "F2", "F6"],
          ),
          op(
            "OP20",
            [
              "Отвір із контрольованим припуском",
              "Bore with controlled allowance",
            ],
            [
              "Просвердліть центральний отвір менше Ø20, потім розточіть до 20,035. Перевіряйте вхід і доступну глибину; одна свердлильна операція не забезпечує F3.",
              "Drill undersize, then bore to 20.035. Inspect entry and accessible depth; drilling alone does not satisfy F3.",
            ],
            [
              "Свердло Ø18; короткий розточний різець.",
              "Ø18 drill and short boring tool.",
            ],
            [
              "Чорнове розточування до 19,70; 0,335 мм на діаметр до цілі.",
              "Rough-bore to 19.70, leaving 0.335 mm diametral stock to target.",
            ],
            [
              "F3 нутроміром; вісь залишається тією самою до завершення F1.",
              "Inspect F3 by bore gauge; retain the same axis until F1 is finished.",
            ],
            stopCut,
            ["F3"],
          ),
          op(
            "OP30",
            ["Чистовий Ø70 й відокремлення", "Finish Ø70 and separate"],
            [
              "Доведіть зовнішній Ø70,00, зніміть C0,3–0,5 на A. Після зупинки й зняття відпиляйте E на 13,2±0,2 від A.",
              "Finish OD to 70.00, chamfer A C0.3–0.5, then stop/remove and saw E at 13.2±0.2 from A.",
            ],
            [
              "Чистовий різець; закріплене пильне оснащення.",
              "Finishing tool and secured sawing workholding.",
            ],
            [
              "E залишається 1,0–1,4 мм понад остаточні 12.",
              "E retains 1.0–1.4 mm over final 12.",
            ],
            [
              "Записати F1/F3 до відокремлення.",
              "Record F1/F3 before separation.",
            ],
            stopCut,
            ["F1", "F3", "F8"],
          ),
        ],
        [
          [
            "Вимірювання Ø70 та отвору збережені в одному встановленні.",
            "OD70 and bore measurements retained from one setup.",
          ],
        ],
        [
          "Ізолювати, зняти пруток, відпиляти й прибрати стружку з A та E.",
          "Isolate, remove the bar, saw and clean A/E.",
        ],
        [
          "Підготувати J1 із глибиною 8; A має впиратися в чисту опору.",
          "Prepare J1 with 8 depth; A must contact the clean seat.",
        ],
        "chuck",
      ),
      setup(
        "S2",
        ["Товщина 12 та E", "Thickness 12 and E"],
        [
          "Завершити торці й товщину перед координатною обробкою.",
          "Finish faces/thickness before coordinate machining.",
        ],
        [
          "A у торцевій опорі J1; E назовні.",
          "A against J1’s axial seat; E exposed.",
        ],
        [
          "A і Ø70 відновлюють положення; отвір B зберігається як вимірювальна вісь.",
          "A and OD70 locate the part; bore datum B remains the inspection axis.",
        ],
        [
          "J1 охоплює 8 мм по Ø70; цей короткий затиск допускається лише після перевірки саме для легкого торцювання й кулачків цього патрона.",
          "J1 grips 8 mm on Ø70; this short engagement is permitted only after verification for light facing with these actual chuck jaws.",
        ],
        ["J1"],
        [
          op(
            "OP40",
            ["Перевірити посадку диска", "Verify disc seating"],
            [
              "Перевірте A на опорі й доступний Ø70 індикатором; будь-який зазор з боку кулачків усувайте очисткою/переробкою гнізда.",
              "Check A seating and accessible OD70 with an indicator; correct gaps by cleaning or reworking the nest.",
            ],
            ["Індикатор і щуп.", "Indicator and feeler."],
            [
              "Ø70 готовий; не переточувати його.",
              "OD70 is finished; do not recut it.",
            ],
            [
              "Повторне биття ≤0,03 мм; записати.",
              "Record remount TIR ≤0.03 mm.",
            ],
            stopCut,
            ["F1", "F7"],
          ),
          op(
            "OP50",
            ["Чистово торцювати E", "Finish E face"],
            [
              "Залиште 12,15, виміряйте, потім підріжте до цілі 12,00. Перевірте F2 і чотири вимірювання для F6 після розтискання.",
              "Leave 12.15, measure, then face to a 12.00 target. Check F2 and four F6 measurements after release.",
            ],
            ["Чистовий торцевий різець.", "Finishing facing tool."],
            ["Останні 0,15 мм — осьові.", "Final 0.15 mm is axial."],
            [
              "Товщина й розкид; повторний Ø20 для деформації затиском.",
              "Thickness/spread and repeated Ø20 for clamping distortion.",
            ],
            stopCut,
            ["F2", "F3", "F6"],
          ),
          op(
            "OP60",
            ["Фаски та інспекційна вісь", "Chamfers and inspection axis"],
            [
              "Зніміть фаски E; установіть на перевірену інспекційну оправку в отвір Ø20 і вручну перевірте F7. Оправка слугує контролю, не силовому різанню.",
              "Chamfer E; locate on a checked inspection arbor through Ø20 and check F7 by safe-state manual rotation. The arbor is for inspection, not cutting-force transmission.",
            ],
            [
              "Фасковий різець, інспекційна оправка й індикатор.",
              "Chamfer tool, inspection arbor and indicator.",
            ],
            [
              "Не збільшувати отвір для зручної примірки.",
              "Do not enlarge the bore to ease fitting.",
            ],
            [
              "F7≤0,05; записати власне биття оправки.",
              "F7≤0.05; record arbor runout.",
            ],
            stopCut,
            ["F3", "F7", "F8"],
          ),
        ],
        [
          [
            "Готову товщину й осьові бази прийнято до свердління.",
            "Accept finished thickness and datums before drilling.",
          ],
        ],
        [
          "Очистити диск і підготувати P1; A позначити без кернування функціональної поверхні.",
          "Clean the disc, prepare P1 and identify A without centre-punching its functional face.",
        ],
        [
          "Перенести на фрезерний з A вниз; центральний отвір не затискати випадковим болтом.",
          "Transfer to the mill with A down; do not retain it by an arbitrary bolt through the centre.",
        ],
        "soft-jaws",
        true,
      ),
      setup(
        "S3",
        [
          "Перенесення B та чотири координатні отвори",
          "Transfer B and drill the pattern",
        ],
        [
          "Виготовити отвори від центрального отвору, а не від краю пиляної заготовки.",
          "Locate the holes from the central bore rather than sawn stock edges.",
        ],
        ["A вниз на P1; B вертикальна.", "A down on P1; B vertical."],
        [
          "Пробування/індикування Ø20 визначає X0,Y0; A задає Z0.",
          "Probe/indicate Ø20 for X0,Y0; A establishes Z0.",
        ],
        [
          "Три підтримані прихвати на зовнішньому ободі між отворами; P1 закріплена окремо.",
          "Three supported rim clamps between the holes; P1 is secured separately.",
        ],
        ["P1"],
        [
          op(
            "OP70",
            [
              "Відновити вісь і перевірити точки",
              "Recover the axis and verify points",
            ],
            [
              "Визначте центр Ø20 по чотирьох напрямах та врахуйте діаметр щупа. Перевірте (±25,0),(0,±25) над деталлю й суміщення кишень P1 до першого свердління.",
              "Find Ø20 centre in four directions, accounting for probe diameter. Verify (±25,0),(0,±25) above the part and alignment with P1 pockets before drilling.",
            ],
            [
              "Кромкошукач/щуп або індикаторна центрувальна схема.",
              "Edge finder/probe or indicator centring arrangement.",
            ],
            [
              "Позиційного припуску немає: помилковий центр не виправляється більшим свердлом.",
              "There is no positional allowance; a larger drill cannot repair a wrong centre.",
            ],
            [
              "Незалежний повтор центра; координатний список підписаний.",
              "Independent centre repeat and signed coordinate list.",
            ],
            stopCut,
            ["F5"],
          ),
          op(
            "OP80",
            [
              "Підготувати та просвердлити всі отвори",
              "Start and drill all holes",
            ],
            [
              "Виконайте погоджене засвердлювання, потім Ø6,6 із Z-виходом у 3-мм кишеню P1. Для кожної точки повторіть перевірку координати й виходу, не змінюючи нуль між отворами.",
              "Use the approved spotting process, then Ø6.6 drilling with breakthrough into P1’s 3 mm pocket. Verify coordinates and clearance at each point without changing zero between holes.",
            ],
            [
              "Придатне засвердлювальне свердло й Ø6,6.",
              "Suitable spotting drill and Ø6.6 drill.",
            ],
            [
              "Отвори мають ціль Ø6,60–6,75; це прохідні отвори, не точна посадка.",
              "Hole acceptance is Ø6.60–6.75; these are clearance holes, not precision fits.",
            ],
            [
              "Вхід/вихід, відсутність стружки під A, F4 кожного отвору.",
              "Entry/exit, no chips beneath A and F4 for every hole.",
            ],
            stopCut,
            ["F4", "F5"],
          ),
          op(
            "OP90",
            [
              "Задирки й незалежна координатна карта",
              "Deburr and independently inspect coordinates",
            ],
            [
              "Після зняття видаліть задирки з обох сторін. Виміряйте всі центри від B незалежним засобом; перевірте X/Y кожного, а не лише діагональ або проходження чотирьох болтів.",
              "Remove and deburr both sides. Independently measure every centre from B, checking each X/Y rather than only a diagonal or passage of four bolts.",
            ],
            [
              "Контрольні штифти, координатний засіб, мікрометр.",
              "Inspection pins, coordinate instrument and micrometer.",
            ],
            [
              "Не підпилювати отвори для примусового складання.",
              "Do not file holes to force assembly.",
            ],
            [
              "F1–F8 після розтискання, із записом усіх 8 координат X/Y.",
              "F1–F8 after release, recording all eight X/Y coordinates.",
            ],
            stopCut,
            ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"],
          ),
        ],
        [
          [
            "Перевірити залишкову деформацію товщини після прихватів.",
            "Check residual thickness distortion after clamping.",
          ],
        ],
        [
          "Очистити й висушити; відокремити карту контролю від налаштувань DRO.",
          "Clean/dry and keep the inspection record separate from the DRO setup record.",
        ],
        [
          "Приміряти лише на нерухомому стенді; відхилення не приховувати розсвердлюванням.",
          "Trial-fit only on a stationary bench; do not hide errors by enlarging holes.",
        ],
        "strap-clamps",
        false,
        "drilling",
      ),
    ],
    cutting: [calculation(70, 100, 0.08, 1200)],
    pitfalls: [
      t(
        "Зовнішній Ø70 не використовується замість базової осі Ø20 без перевірки F7.",
        "OD70 cannot replace datum bore Ø20 without checking F7.",
      ),
      t(
        "Кишені P1 мають збігатися з отвором і враховувати вістря свердла, а не тільки його циліндричну частину.",
        "P1 pockets must align with the holes and clear the drill point, not merely the cylindrical portion.",
      ),
    ],
    lessons: [
      "machine-assessment",
      "tool-setting-lathe",
      "lathe-turning",
      "tool-setting-mill",
      "mill-datums",
      "inspection-plan",
    ],
  }),
  project({
    id: "replacement-knob",
    title: t(
      "Відтворення ручки шухляди під гвинт M5",
      "Reproduce an M5 drawer knob",
    ),
    summary: t(
      "Визначений приклад POM-C: головка Ø30 ×15, шийка Ø18 ×10, прохідний Ø5,5. Обмір зразка, два встановлення та нерухома примірка.",
      "Defined POM-C example: Ø30 ×15 head, Ø18 ×10 neck and Ø5.5 through bore. Survey, two setups and a stationary fit check.",
    ),
    level: "intermediate",
    family: "reverse",
    material: t(
      "Ненаповнений POM-C із паспортом постачальника",
      "Unfilled POM-C with supplier documentation",
    ),
    duration: t(
      "4–6 годин з обміром і кресленням",
      "4–6 hours including survey and drawing",
    ),
    purpose: t(
      "Ручка легкого органайзера. Для іншого оригіналу створіть нову ревізію з фактичними контактними розмірами; ці числа не є результатом обміру вашої деталі.",
      "Knob for a light organizer. For another original, issue a new revision with measured interface dimensions; these values are not a survey of your part.",
    ),
    stock: roundStock("Ø32 ×60 mm"),
    part: {
      kind: "turned",
      sections: [
        { length: 15, diameter: 30 },
        { length: 10, diameter: 18 },
      ],
      bore: { diameter: 5.5 },
    },
    datums: [
      {
        id: "A",
        description: t("Зовнішній торець головки.", "Outside head face."),
      },
      {
        id: "B",
        description: t("Вісь отвору Ø5,5.", "Axis of the Ø5.5 bore."),
      },
      {
        id: "C",
        description: t(
          "Задній торець шийки, контакт зі шухлядою.",
          "Rear neck face seating against the drawer.",
        ),
      },
    ],
    features: [
      dim(
        "F1",
        ["Діаметр головки", "Head diameter"],
        "Ø30 ±0.10",
        30,
        29.9,
        30.1,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Діаметр шийки", "Neck diameter"],
        "Ø18 ±0.05",
        18,
        17.95,
        18.05,
        "B",
        odMethod,
        mic,
        "sections.1.diameter",
      ),
      dim(
        "F3",
        ["Довжина", "Overall length"],
        "25 ±0.10",
        25,
        24.9,
        25.1,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F4",
        ["Довжина шийки", "Neck length"],
        "10 ±0.05",
        10,
        9.95,
        10.05,
        "C",
        [
          "Виміряти від C до уступу; повторити в трьох напрямках.",
          "Measure C to the shoulder at three orientations.",
        ],
        depthMic,
        "sections.1.length",
      ),
      dim(
        "F5",
        ["Отвір під M5", "M5 clearance bore"],
        "Ø5.5 +0/+0.15",
        5.5,
        5.5,
        5.65,
        "B",
        boreMethod,
        boreGauge,
        "bore.diameter",
      ),
      visual(
        "F6",
        ["Безпечні кромки", "Safe edges"],
        "C0.5 ±0.2; no loose plastic whiskers",
        "A|C",
        [
          "Огляньте всі кромки й отвір; зніміть стружкові нитки на нерухомій деталі, не поліруйте руками біля шпинделя.",
          "Inspect every edge and bore; remove plastic strings with the part stationary, without hand polishing near the spindle.",
        ],
      ),
    ],
    fixtures: [soft("J1", 30, 10)],
    setups: [
      setup(
        "S1",
        ["Шийка C-першою й обидва діаметри", "Neck C-first and both diameters"],
        [
          "Отримати опорну шийку й голівку від спільної осі.",
          "Create the seating neck and head from a common axis.",
        ],
        [
          "C до інструмента; майбутній A знаходиться ближче до патрона.",
          "C faces the tool; future A is nearer the chuck.",
        ],
        [
          "C — нуль довжини; уступ на 10,00, лінія пили на 26,0 мм.",
          "C is length zero; shoulder at 10.00 and saw line at 26.0.",
        ],
        [
          "Затисніть незайманий POM-пруток без його сплющення; запланована проєкція 28 мм і достатня опора в кулачках підтверджені для конкретного патрона.",
          "Grip untouched POM stock without crushing it; verify the planned 28 mm projection and adequate jaw support for the actual chuck.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["Обмір і базовий C", "Survey and reference face C"],
            [
              "До різання запишіть на окремій карті контакт C, довжину шийки та необхідний гвинт/шайбу оригіналу. Для цієї ревізії підріжте C й установіть нуль.",
              "Before cutting, record the original’s C contact, neck length and screw/washer requirements. For this revision, face C and establish zero.",
            ],
            [
              "Штангенциркуль для обміру, гострий різець для POM-C.",
              "Calipers for survey and a sharp POM-C tool.",
            ],
            [
              "Пиляна A залишається на 26,0 замість остаточних 25.",
              "Sawn A remains at 26.0 rather than final 25.",
            ],
            [
              "Карта відділяє виміряні числа від прийнятих проектних змін.",
              "The survey separates measurements from intended design changes.",
            ],
            stopCut,
            ["F3", "F4"],
          ),
          op(
            "OP20",
            ["Діаметри й довжина шийки", "Diameters and neck length"],
            [
              "Обробіть 0–10 мм від C до Ø18,00, а 10–26 мм до Ø30,00. Чистовий припуск 0,20 мм по діаметру знімайте після охолодження; не стискайте мікрометром POM.",
              "Machine C-to-10 to Ø18.00 and 10-to-26 to Ø30.00. Remove the final 0.20 mm diametral stock after cooling; do not compress POM with the micrometer.",
            ],
            [
              "Гострий різець із позитивною геометрією й вільним відведенням стружки.",
              "Sharp positive-geometry tool with free chip evacuation.",
            ],
            [
              "0,20 мм по діаметру; не доводити розмір нагрітої деталі.",
              "0.20 mm diametral stock; do not size a hot part.",
            ],
            [
              "F1/F2/F4 після температурної стабілізації.",
              "F1/F2/F4 after temperature stabilisation.",
            ],
            [
              "Плавлення, налипання або пружне стискання затиском — зупинка.",
              "Stop for melting, adhesion or elastic clamping compression.",
            ],
            ["F1", "F2", "F4"],
          ),
          op(
            "OP30",
            ["Просвердлити та відокремити", "Drill and separate"],
            [
              "Просвердліть Ø5,5 за підтриманим центруванням щонайменше крізь майбутню довжину 26 мм; перевірте реальну траєкторію вістря. Зніміть фаску C, потім після зняття відпиляйте A.",
              "Drill Ø5.5 with guided alignment beyond the future 26 mm length, checking the actual point path. Chamfer C, then remove and saw A.",
            ],
            [
              "Придатне свердло для POM-C і фасковий інструмент.",
              "POM-C-suitable drill and chamfer tool.",
            ],
            [
              "A має 1 мм на чистове торцювання.",
              "Leave 1 mm for finishing A.",
            ],
            [
              "F5, відсутність пакета стружки в отворі.",
              "F5 and no chip plug in the bore.",
            ],
            stopCut,
            ["F5", "F6"],
          ),
        ],
        [
          [
            "Записати F4 від C до уступу до розтискання.",
            "Record C-to-shoulder F4 before release.",
          ],
        ],
        [
          "Ізолювати, зняти пруток, відпиляти A й видалити пластикові нитки.",
          "Isolate, remove, saw A and remove plastic strings.",
        ],
        [
          "Зберегти C; для S2 J1 затискає головку, а шийка входить у вільний прохід.",
          "Preserve C; in S2 J1 grips the head while the neck enters a clear passage.",
        ],
        "chuck",
      ),
      setup(
        "S2",
        ["Головка на м’яких кулачках і A", "Head in soft jaws and A"],
        [
          "Завершити загальну довжину та зовнішню кромку ручки.",
          "Finish overall length and the outer head edge.",
        ],
        [
          "A назовні, шийка C за головкою всередині вільного простору.",
          "A faces outward; neck C extends behind the head into clear space.",
        ],
        [
          "Головка Ø30 відновлює вісь; C контролюється поза верстатом.",
          "OD30 restores the axis; C is checked off the machine.",
        ],
        [
          "У J1 затисніть 10 мм головки біля уступу, залишивши A приблизно на 6 мм назовні; шийка Ø18 нічого не підпирає випадково.",
          "Grip 10 mm of head adjacent to the shoulder in J1, leaving A approximately 6 mm exposed; Ø18 must not bottom unintentionally.",
        ],
        ["J1"],
        [
          op(
            "OP40",
            ["Перевірити опору й деформацію", "Check seating and distortion"],
            [
              "Перевірте контакт головки та вільне проходження шийки. Порівняйте Ø30 у затиснутому й звільненому стані до остаточного проходу.",
              "Verify head contact and neck clearance. Compare Ø30 clamped and released before the final cut.",
            ],
            [
              "Індикатор та мікрометр із повторюваним легким зусиллям.",
              "Indicator and micrometer with repeatable light force.",
            ],
            [
              "Готовий Ø30 не має додаткового припуску.",
              "Finished Ø30 has no further allowance.",
            ],
            [
              "Деформація не повинна маскувати нижню/верхню межу F1.",
              "Clamping deformation must not mask either F1 limit.",
            ],
            stopCut,
            ["F1", "F2"],
          ),
          op(
            "OP50",
            ["A до 25,00 та фаска", "A to 25.00 and chamfer"],
            [
              "Залиште довжину 25,20, охолодіть і виміряйте, потім доведіть до 25,00. Зніміть C0,5±0,2 на зовнішньому краї A й отворі без торкання руками при обертанні.",
              "Leave length 25.20, cool/measure, then finish to 25.00. Add C0.5±0.2 to A outside and bore edges without hand contact during rotation.",
            ],
            ["Торцевий/фасковий інструмент.", "Facing/chamfer tool."],
            ["Останні 0,20 мм по осі.", "Final 0.20 mm axial stock."],
            ["F3 та вхід отвору.", "F3 and bore entry."],
            stopCut,
            ["F3", "F5", "F6"],
          ),
          op(
            "OP60",
            ["Примірка на нерухомій шухляді", "Fit to the stationary drawer"],
            [
              "Зніміть і очистіть деталь; перевірте F1–F6. На нерухомій шухляді перевірте довжину M5, шайбу й контакт C; гвинт не має впиратися або стягувати головку через порожнину.",
              "Remove/clean and inspect F1–F6. On the stationary drawer check M5 length, washer and C seating; the screw must not bottom or pull the head across a gap.",
            ],
            [
              "Карта вимірювань і відоме кріплення M5.",
              "Inspection record and identified M5 hardware.",
            ],
            [
              "Примірка не допускає підпилювання зібраної ручки.",
              "Do not file the assembled knob to force a fit.",
            ],
            [
              "Записати фактичний оригінал, ревізію й зміну гвинта.",
              "Record the actual original, revision and screw change.",
            ],
            stopCut,
            ["F1", "F2", "F3", "F4", "F5", "F6"],
          ),
        ],
        [
          [
            "Повторити розміри POM після вирівнювання температури, не одразу після різання.",
            "Remeasure POM after temperature equalisation rather than immediately after cutting.",
          ],
        ],
        [
          "Зберегти ескіз, обмір і фото нерухомої примірки.",
          "Retain sketch, survey and stationary-fit photograph.",
        ],
        [
          "Інший зразок або матеріал потребує нової ревізії та нової перевірки.",
          "Another sample or material needs a new revision and verification.",
        ],
        "soft-jaws",
        true,
      ),
    ],
    cutting: [calculation(30, 80, 0.08, 1800)],
    pitfalls: [
      t(
        "POM-C розширюється від тепла й деформується від затиску; показ на гарячій деталі не є остаточним прийманням.",
        "POM-C expands with heat and deforms under clamping; a hot reading is not final acceptance.",
      ),
      t(
        "Копіювання зовнішньої форми без вимірювання C та гвинта не забезпечує встановлення ручки.",
        "Copying appearance without measuring C and the screw does not establish fit.",
      ),
    ],
    lessons: [
      "reverse-survey",
      "reverse-cad",
      "material-machining",
      "tool-setting-lathe",
      "lathe-turning",
      "inspection-plan",
    ],
  }),
  project({
    id: "threaded-standoff",
    title: t(
      "Дистанційна стійка з двома різьбами M5",
      "Standoff with two M5 threads",
    ),
    summary: t(
      "Алюмінієва Ø12 ×25, осьовий Ø4,2 і повний профіль M5×0,8 на 8 мм з кожного торця. Окремо перевіряються отвір, кожна різьба й довжина.",
      "Aluminum Ø12 ×25, axial Ø4.2 and 8 mm full M5×0.8 thread from each end. Bore, each thread and length are separately inspected.",
    ),
    level: "intermediate",
    family: "turning",
    material: t("EN AW-6061-T6", "EN AW-6061-T6"),
    duration: t("4–5 годин", "4–5 hours"),
    purpose: t(
      "Стійка легкого навчального корпусу. Це не силова різьбова тяга; довжини входу гвинтів обмежені 8 мм з кожного боку.",
      "Standoff for a light educational enclosure, not a structural tie; screw insertion is limited to 8 mm at each end.",
    ),
    stock: roundStock("Ø14 ×60 mm"),
    part: {
      kind: "turned",
      sections: [{ length: 25, diameter: 12 }],
      bore: { diameter: 4.2, thread: "M5×0.8-6H; 8 min each end" },
    },
    datums: [
      {
        id: "A",
        description: t("Перший торець стійки.", "First standoff end."),
      },
      { id: "B", description: t("Вісь зовнішнього Ø12.", "Outside Ø12 axis.") },
    ],
    features: [
      dim(
        "F1",
        ["Діаметр корпусу", "Body diameter"],
        "Ø12 ±0.03",
        12,
        11.97,
        12.03,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Довжина стійки", "Standoff length"],
        "25 ±0.03",
        25,
        24.97,
        25.03,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F3",
        ["Свердління під нарізування", "Tap-drilled bore"],
        "Ø4.2 +0/+0.10 before tapping",
        4.2,
        4.2,
        4.3,
        "B",
        boreMethod,
        boreGauge,
        "bore.diameter",
      ),
      thread("F4", "M5×0.8-6H; full profile ≥8 mm each end", "A|B"),
      dim(
        "F5",
        ["Розкид товщини", "Thickness spread"],
        "max − min ≤0.03",
        0,
        0,
        0.03,
        "A",
        lengthMethod,
        depthMic,
      ),
      visual(
        "F6",
        ["Входи різьби", "Thread entries"],
        "C0.3–0.5; complete deburring",
        "A",
        [
          "Перевірити чисті входи, відсутність надірваного профілю й стружки; гвинти не мають зустрічатися всередині.",
          "Inspect clean entries, intact profile and no chips; the screws must not meet inside.",
        ],
      ),
    ],
    fixtures: [collet("C1", 12), soft("J1", 12, 18)],
    setups: [
      setup(
        "S1",
        ["A, корпус та перша різьба", "A, body and first thread"],
        [
          "Завершити корпус й різьбу A, залишивши запас на E.",
          "Finish the body and A thread while retaining E stock.",
        ],
        [
          "A до інструмента; лінія пили на 26,2 від A.",
          "A faces the tool; saw line is 26.2 from A.",
        ],
        [
          "Нуль на A; вісь обробленого Ø12.",
          "Zero on A; axis from turned Ø12.",
        ],
        [
          "Первинно затисніть Ø14 у паспортному діапазоні патрона; вильоту достатньо для довжини 26,2 та інструмента без зіткнень.",
          "Initially grip Ø14 within the chuck’s documented range; provide enough projection for 26.2 length and collision-free tooling.",
        ],
        ["C1", "J1"],
        [
          op(
            "OP10",
            ["A й корпус Ø12", "A and Ø12 body"],
            [
              "Підріжте A, обробіть 26,2 мм довжини до Ø12,00. Перед чистовим проходом залиште Ø12,20 й перевірте фактичний діаметр.",
              "Face A and turn a 26.2 mm length to Ø12.00. Leave Ø12.20 before finishing and measure the actual diameter.",
            ],
            ["Гострий різець для алюмінію.", "Sharp aluminum turning tool."],
            [
              "0,20 мм по діаметру; 1,2 мм на E.",
              "0.20 mm diametral stock; 1.2 mm at E.",
            ],
            ["F1 у трьох перерізах.", "F1 at three sections."],
            stopCut,
            ["F1", "F2"],
          ),
          op(
            "OP20",
            ["Осьовий Ø4,2 та фаска", "Axial Ø4.2 and entry"],
            [
              "Підготуйте вхід і просвердліть Ø4,2 крізь майбутні 26,2 мм, перевіряючи вихід і канавки. Свердло має достатню робочу довжину без випадкового контакту з упором.",
              "Start and drill Ø4.2 beyond the future 26.2 mm length, checking point travel and flutes. The drill needs adequate working length without contacting a stop.",
            ],
            [
              "Придатне Ø4,2 свердло; фасковий інструмент.",
              "Suitable Ø4.2 drill and chamfer tool.",
            ],
            [
              "Ціль свердління 4,20–4,30 до різьби; не використовувати отвір під формувальний мітчик.",
              "Accept 4.20–4.30 before cut tapping; this is not a form-tap hole.",
            ],
            ["F3 та фаска входу C0,3–0,5.", "F3 and entry C0.3–0.5."],
            stopCut,
            ["F3", "F6"],
          ),
          op(
            "OP30",
            ["Нарізати M5 з боку A", "Cut M5 at A"],
            [
              "На нерухомому шпинделі наріжте придатним ручним/напрямленим процесом повний M5-профіль щонайменше 8 мм. Повний профіль відрізняється від загальної глибини входу мітчика. Потім калібруйте A.",
              "With the spindle stationary use a suitable guided hand-tapping process to make at least 8 mm of full M5 profile. Full-profile depth differs from tap insertion depth. Gauge A afterwards.",
            ],
            [
              "Різальний M5×0,8 мітчик для алюмінію, напрямна та вороток; не затискати вороток у руках при приводному обертанні.",
              "Aluminum-suitable M5×0.8 cut tap, guide and tap wrench; never hold a tap wrench by hand under powered rotation.",
            ],
            [
              "Середина лишається свердленою; не нарізайте всю довжину 25 мм коротким мітчиком 2,5D.",
              "The middle remains drilled; do not tap the full 25 length with a short 2.5D tap.",
            ],
            [
              "GO/NO-GO A й повнопрофільна глибина 8 мм.",
              "A GO/NO-GO and 8 mm full-profile depth.",
            ],
            [
              "Ненормальний момент — вивести мітчик за його процедурою, очистити й перевірити, не додавати важіль.",
              "For abnormal torque withdraw under the tool procedure, clean and inspect; do not add leverage.",
            ],
            ["F4", "F6"],
          ),
        ],
        [
          [
            "Записати F1/F3 і приймання різьби A.",
            "Record F1/F3 and A-thread acceptance.",
          ],
        ],
        [
          "Зняти заготовку й відпиляти E на 26,2; зняти задирку, не пошкоджуючи різьбу A.",
          "Remove and saw E at 26.2; deburr without damaging A threads.",
        ],
        [
          "Підготувати J1, який підтримує 18 мм Ø12; задній простір не впирається в отвір.",
          "Prepare J1 supporting 18 mm of Ø12; rear clearance must not obstruct the bore.",
        ],
        "chuck",
      ),
      setup(
        "S2",
        ["Довжина й різьба E", "Length and E thread"],
        [
          "Довести довжину та другий різьбовий вхід.",
          "Finish length and the second threaded entry.",
        ],
        [
          "A на опорі, E назовні; зберегти A-калібрування.",
          "A on the seat, E exposed; preserve accepted A thread.",
        ],
        [
          "Ø12 — вісь, чистий A — торцева опора.",
          "Ø12 establishes the axis, clean A the axial seat.",
        ],
        [
          "J1 охоплює 18 мм, E виступає близько 8,2 мм; цанга C1 є альтернативою лише з перевіреним осьовим упором і достатнім доступом.",
          "J1 grips 18 mm, leaving E approximately 8.2 mm exposed; C1 is an alternative only with a verified axial stop and adequate access.",
        ],
        ["J1", "C1"],
        [
          op(
            "OP40",
            ["Відновити вісь та довести E", "Restore axis and finish E"],
            [
              "Перевірте посадку A, повторне биття Ø12 ≤0,02. Торцюйте E до 25,15, потім за виміром до 25,00.",
              "Verify A seating and Ø12 remount TIR ≤0.02. Face E to 25.15, then measure and finish to 25.00.",
            ],
            [
              "Індикатор і чистовий торцевий різець.",
              "Indicator and finishing facing tool.",
            ],
            [
              "0,15 мм остаточного осьового припуску.",
              "0.15 mm final axial allowance.",
            ],
            ["F2/F5 після розтискання.", "F2/F5 after release."],
            stopCut,
            ["F1", "F2", "F5"],
          ),
          op(
            "OP50",
            ["Другий вхід M5", "Second M5 entry"],
            [
              "Зніміть фаску E, очистіть отвір і наріжте повний профіль 8 мм з E у тому самому безпечному напрямленому ручному процесі. Не збільшуйте глибину, щоб гвинти не зустрілися.",
              "Chamfer E, clean the bore and cut 8 mm full profile from E using the same safe guided hand process. Do not extend engagement until screws can meet.",
            ],
            [
              "M5×0,8 різальний мітчик і напрямна.",
              "M5×0.8 cut tap and guide.",
            ],
            [
              "Повна різьба 8 мм; середній свердлений пояс приблизно 9 мм.",
              "8 mm full thread; middle drilled region approximately 9 mm.",
            ],
            [
              "GO/NO-GO E, глибина повного профілю.",
              "E GO/NO-GO and full-profile depth.",
            ],
            stopCut,
            ["F3", "F4", "F6"],
          ),
          op(
            "OP60",
            [
              "Очистити й прийняти обидві різьби",
              "Clean and accept both threads",
            ],
            [
              "Вийміть стружку з середини без продування в обличчя. Перевірте обидві різьби, F1/F2/F5 у вільному стані та позначте допустимі довжини гвинтів у карті складання.",
              "Remove trapped chips without blowing toward a face. Inspect both threads and released F1/F2/F5, and record permissible screw lengths in assembly notes.",
            ],
            [
              "Калібри-пробки, мікрометр, глибиномір.",
              "Thread plugs, micrometer and depth gauge.",
            ],
            [
              "Перевірка гвинтом не замінює різьбові калібри.",
              "A screw trial does not replace thread gauges.",
            ],
            [
              "Усі F1–F6 і два окремі різьбові результати.",
              "All F1–F6 and two separate thread results.",
            ],
            stopCut,
            ["F1", "F2", "F3", "F4", "F5", "F6"],
          ),
        ],
        [["Приймати кожний кінець окремо.", "Accept each end separately."]],
        [
          "Зупинка, ізоляція й безпечне зняття.",
          "Stop, isolate and remove safely.",
        ],
        [
          "Зібрати лише легкий корпус; різьбове навантаження цього прикладу не розраховане.",
          "Assemble only the light enclosure; thread load capacity is not engineered here.",
        ],
        "soft-jaws",
        true,
      ),
    ],
    cutting: [calculation(12, 80, 0.06, 1800)],
    pitfalls: [
      t(
        "M5×0,8 з двох боків не означає наскрізний повний профіль 25 мм.",
        "M5×0.8 at both ends does not mean a 25 mm full-profile through thread.",
      ),
      t(
        "Свердління 4,2 мм наведене для різального M5, не для формувального інструмента.",
        "Ø4.2 is for cut tapping M5, not form tapping.",
      ),
    ],
    sources: [...standardSources, "proj-turn-tapping", "proj-turn-m5-tap"],
    lessons: [
      "drilling-tools",
      "threading-reaming",
      "tool-setting-lathe",
      "lathe-drilling",
      "inspection-plan",
    ],
  }),
  project({
    id: "shoulder-bushing",
    title: t(
      "Буртова втулка POM-C для ручного шарніра",
      "POM-C shoulder bush for a hand-operated pivot",
    ),
    summary: t(
      "Бурт Ø24 ×5, шийка Ø16 ×15 й отвір Ø8,1. Малий діаметр і торець E робляться першими, бурт A завершується після перестановки.",
      "Ø24 ×5 flange, Ø16 ×15 shank and Ø8.1 bore. Small diameter and E are made first, with flange face A finished after remounting.",
    ),
    level: "intermediate",
    family: "turning",
    material: t("Ненаповнений POM-C", "Unfilled POM-C"),
    duration: t("4–5 годин", "4–5 hours"),
    purpose: t(
      "Демонстраційний шарнір із ручним рухом і пальцем Ø8,00±0,01; без розрахованого навантаження, швидкості чи ресурсу.",
      "Hand-moved demonstration pivot with a Ø8.00±0.01 pin; no rated load, speed or life.",
    ),
    stock: roundStock("Ø26 ×55 mm"),
    part: {
      kind: "turned",
      sections: [
        { length: 5, diameter: 24 },
        { length: 15, diameter: 16 },
      ],
      bore: { diameter: 8.1 },
    },
    datums: [
      {
        id: "A",
        description: t("Зовнішній торець бурта.", "Outer flange face."),
      },
      { id: "B", description: t("Вісь шийки Ø16.", "Axis of Ø16 shank.") },
      {
        id: "C",
        description: t(
          "Опорна площина під буртом.",
          "Seating plane beneath the flange.",
        ),
      },
    ],
    features: [
      dim(
        "F1",
        ["Діаметр бурта", "Flange diameter"],
        "Ø24 ±0.05",
        24,
        23.95,
        24.05,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Посадкова шийка", "Mounting shank"],
        "Ø16 −0.03/0",
        16,
        15.97,
        16,
        "B",
        odMethod,
        mic,
        "sections.1.diameter",
      ),
      dim(
        "F3",
        ["Загальна довжина", "Overall length"],
        "20 ±0.05",
        20,
        19.95,
        20.05,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F4",
        ["Товщина бурта", "Flange thickness"],
        "5 ±0.03",
        5,
        4.97,
        5.03,
        "A",
        [
          "Міряти A–C у чотирьох кутових точках; не тиснути на пластик.",
          "Measure A–C at four angular positions without compressing the plastic.",
        ],
        depthMic,
        "sections.0.length",
      ),
      dim(
        "F5",
        ["Отвір під палець", "Pivot bore"],
        "Ø8.10 ±0.03",
        8.1,
        8.07,
        8.13,
        "B",
        boreMethod,
        boreGauge,
        "bore.diameter",
      ),
      visual(
        "F6",
        ["Кромки й бурт", "Edges and flange"],
        "C0.3–0.5; no white stress marks",
        "A|C",
        [
          "Оглянути корінь бурта, контакт C й відсутність ниток; біле побіління POM після затиску означає пошкодження.",
          "Inspect flange root, seating C and chip strings; stress whitening after clamping indicates damage.",
        ],
      ),
    ],
    fixtures: [
      soft(
        "J1",
        16,
        12,
        "За поясом Ø16 потрібний вільний простір для отвору; бурт Ø24 залишається перед кулачками.",
        "Provide bore clearance behind the Ø16 land; Ø24 flange stays in front of the jaws.",
      ),
    ],
    setups: [
      setup(
        "S1",
        ["E та шийка перед буртом", "E and shank before the flange"],
        [
          "Отримати шийку, отвір й C в одній осі.",
          "Make shank, bore and C on one axis.",
        ],
        [
          "Торець кінця Ø16 відкритий; майбутній A ближче до патрона.",
          "The Ø16 end is exposed; future A is nearer the chuck.",
        ],
        [
          "Нуль на кінці Ø16; C на 15,00 мм від нього.",
          "Zero at the Ø16 end; C is 15.00 mm from it.",
        ],
        [
          "Затиснутий необроблений Ø26, запланована проєкція 23 мм; пластик не має овальності від кулачків.",
          "Grip untouched Ø26 with a planned 23 mm projection; jaws must not ovalise the plastic.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            [
              "Початковий торець і чорнова форма",
              "First face and rough profile",
            ],
            [
              "Підріжте кінець шийки, задайте нуль. Обробіть 0–15 мм до Ø16,20, 15–21,2 мм до Ø24,20; C залишається на 15,00.",
              "Face the shank end and set zero. Rough 0–15 to Ø16.20 and 15–21.2 to Ø24.20, retaining C at 15.00.",
            ],
            ["Гострий різець для POM-C.", "Sharp POM-C tool."],
            [
              "0,20 мм по діаметру на кожній зоні, 1,2 мм на A.",
              "0.20 mm diametral stock per zone and 1.2 at A.",
            ],
            [
              "Перевірити осьове місце C й незатиснуту овальність.",
              "Check C location and unclamped ovality.",
            ],
            stopCut,
            ["F1", "F2", "F3", "F4"],
          ),
          op(
            "OP20",
            ["Чистові Ø16/Ø24 та C", "Finish Ø16/Ø24 and C"],
            [
              "Після стабілізації доведіть Ø16 до 15,985, Ø24 до 24,00. Підріжте C до 15,00 від кінця шийки; збережіть малий радіус у корені й узгодьте фаску спряженого отвору.",
              "After stabilisation target Ø15.985 and Ø24.00. Finish C at 15.00 from the shank end; retain a small root radius and match the mating-bore entry relief.",
            ],
            [
              "Короткий чистовий різець; контрольоване легке зусилля мікрометра.",
              "Short finishing tool and controlled light micrometer force.",
            ],
            [
              "Не компенсувати теплове розширення додатковим проходом по гарячій деталі.",
              "Do not compensate heat expansion by recutting a hot part.",
            ],
            ["F1/F2, відстань від торця до C.", "F1/F2 and end-to-C distance."],
            stopCut,
            ["F1", "F2", "F4", "F6"],
          ),
          op(
            "OP30",
            ["Отвір Ø8,1 і відділення", "Ø8.1 bore and separation"],
            [
              "Просвердліть меншим Ø, потім придатним коротким розточним інструментом доведіть до 8,10. Отвір має перекрити майбутню 21,2 мм довжину; після зняття відпиляйте A з припуском.",
              "Drill undersize then finish to 8.10 with a suitable short boring tool. Bore beyond the future 21.2 mm length; remove and saw A with allowance.",
            ],
            [
              "Свердло Ø7,5 і малий розточний різець, придатний до цього L/D.",
              "Ø7.5 drill and small boring tool rated for this L/D.",
            ],
            [
              "0,60 мм по діаметру після свердління.",
              "0.60 mm diametral allowance after drilling.",
            ],
            [
              "F5 та відсутність плавлення/навіювання стружки.",
              "F5 and no melting/chip winding.",
            ],
            stopCut,
            ["F5", "F6"],
          ),
        ],
        [
          [
            "Зберегти розмір від кінця шийки до C 15,00.",
            "Retain the shank-end-to-C measurement of 15.00.",
          ],
        ],
        [
          "Ізолювати й відпиляти A на загальній 21,2±0,2.",
          "Isolate and saw A at overall 21.2±0.2.",
        ],
        [
          "Затиснути готову шийку в J1, залишивши бурт перед кулачками.",
          "Grip the finished shank in J1, leaving the flange in front of the jaws.",
        ],
        "chuck",
      ),
      finishFace(
        "S2",
        "J1",
        16,
        12,
        20,
        ["A", "A"],
        ["торець шийки", "shank end"],
        ["F1", "F2", "F3", "F4", "F5", "F6"],
        [
          "Бурт Ø24 розташований зовні; його контакт C не повинен упиратися в губки до посадки кінця шийки на опору.",
          "Ø24 flange stays outside; C must not bottom against the jaws before the shank end seats.",
        ],
      ),
    ],
    cutting: [calculation(24, 80, 0.08, 1800)],
    pitfalls: [
      t(
        "Загальна 20 і товщина 5 не замінюють виміряну 15-мм шийку: перевіряють усі три пов’язані розміри.",
        "Overall 20 and flange 5 do not replace measuring the 15 mm shank; check all three related dimensions.",
      ),
      t(
        "Овальний отвір у затиснутому POM може повернутися після розтискання; контроль лише в патроні недостатній.",
        "A clamped POM bore can spring back after release; inspection only in the chuck is insufficient.",
      ),
    ],
    lessons: [
      "material-machining",
      "tool-setting-lathe",
      "lathe-turning",
      "lathe-drilling",
      "inspection-plan",
    ],
  }),
  project({
    id: "guide-sleeve",
    title: t(
      "Напрямна втулка Ø18/Ø10 для ручного стенда",
      "Ø18/Ø10 guide sleeve for a hand-operated bench",
    ),
    summary: t(
      "Циліндр 30 мм завдовжки з контрольованим зазором для виміряного Ø10 штока. Глибокий відносно діаметра отвір робиться з планом жорсткості інструмента.",
      "A 30 mm sleeve with controlled clearance for a measured Ø10 rod. Its relatively deep bore includes an explicit boring-tool rigidity plan.",
    ),
    level: "advanced",
    family: "turning",
    material: t(
      "EN AW-6082-T6; навчальна напрямна без розрахунку зносостійкості",
      "EN AW-6082-T6; educational guide without engineered wear life",
    ),
    duration: t("5–7 годин", "5–7 hours"),
    purpose: t(
      "Напрямна для повільного ручного руху штока Ø9,99–10,00 мм. Не напрямна інструмента, штока під тиском чи захисного механізму.",
      "Guide for slow hand movement of a Ø9.99–10.00 rod; not a cutting-tool, pressure-cylinder or safety-mechanism guide.",
    ),
    stock: roundStock("Ø20 ×65 mm"),
    part: {
      kind: "turned",
      sections: [{ length: 30, diameter: 18 }],
      bore: { diameter: 10 },
    },
    datums: [
      {
        id: "A",
        description: t("Перший опорний торець.", "First seating face."),
      },
      { id: "B", description: t("Вісь зовнішнього Ø18.", "OD18 axis.") },
    ],
    features: [
      dim(
        "F1",
        ["Зовнішній діаметр", "Outside diameter"],
        "Ø18 −0.03/0",
        18,
        17.97,
        18,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Довжина", "Length"],
        "30 ±0.04",
        30,
        29.96,
        30.04,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F3",
        ["Напрямний отвір", "Guide bore"],
        "Ø10 +0.02/+0.04",
        10,
        10.02,
        10.04,
        "B",
        boreMethod,
        boreGauge,
        "bore.diameter",
      ),
      dim(
        "F4",
        ["Зміна діаметра вздовж отвору", "Axial bore diameter spread"],
        "max − min ≤0.015",
        0,
        0,
        0.015,
        "B",
        boreMethod,
        boreGauge,
      ),
      dim(
        "F5",
        ["Биття отвору від Ø18", "Bore runout from Ø18"],
        "TIR ≤0.03",
        0,
        0,
        0.03,
        "B",
        runoutMethod,
        indicator,
      ),
      visual(
        "F6",
        ["Входи й чистота", "Entries and cleanliness"],
        "C0.3–0.5; no embedded chips",
        "A",
        [
          "Лупа й контрольний чистий шток: без задирок та абразиву; ковзання не замінює F3/F4.",
          "Loupe and clean reference rod: no burrs/abrasive; sliding is not a replacement for F3/F4.",
        ],
      ),
    ],
    fixtures: [soft("J1", 18, 20)],
    setups: [
      setup(
        "S1",
        ["A, Ø18 та довгий отвір", "A, OD18 and the long bore"],
        [
          "Зберегти одну вісь для корпусу та напрямного отвору.",
          "Keep one axis for the body and guide bore.",
        ],
        [
          "A відкритий; майбутній E на 31,2 мм.",
          "A exposed; future E at 31.2 mm.",
        ],
        [
          "A задає довжину; Ø18 і вісь шпинделя пов’язані до розтискання.",
          "A sets length; OD18 remains related to spindle axis until release.",
        ],
        [
          "Затиснути необроблений Ø20, проєкція 33 мм; перевірити контакт і захист прутка за патроном.",
          "Grip untouched Ø20 with 33 mm projection; verify contact and guarding behind the chuck.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["A і чистовий Ø18", "A and finished OD18"],
            [
              "Створіть A, проточіть до Ø18,25, потім після проміру до цілі 17,985 на 31,2 мм довжини. Не змінюйте вісь між зовнішнім та внутрішнім точінням.",
              "Create A, rough to Ø18.25, then measure and target 17.985 over 31.2 mm length. Do not change the axis between external and internal turning.",
            ],
            ["Зовнішній різець для 6082-T6.", "6082-T6 external turning tool."],
            [
              "0,25 мм по діаметру до номіналу.",
              "0.25 mm diametral stock to nominal.",
            ],
            ["F1 у кількох перерізах.", "F1 at multiple sections."],
            stopCut,
            ["F1", "F2"],
          ),
          op(
            "OP20",
            [
              "Попередній отвір і вибір розточної оправки",
              "Pilot bore and boring-bar selection",
            ],
            [
              "Підготуйте отвір Ø9,5 за всю майбутню довжину 31,2. Для фінішу потрібний розточний інструмент, який входить у Ø9,5 й має підтверджений виробником виліт понад 32 мм; якщо такого немає, цей маршрут не виконується.",
              "Prepare Ø9.5 beyond the future 31.2 length. Finishing requires a boring tool that enters Ø9.5 and whose manufacturer permits a projection exceeding 32 mm; without it, do not use this route.",
            ],
            [
              "Ø9,5 свердло; малий твердосплавний розточний інструмент зі специфікованим L/D.",
              "Ø9.5 drill and small carbide boring tool with specified L/D capability.",
            ],
            [
              "0,53 мм по діаметру до цілі 10,03.",
              "0.53 mm diametral stock to target 10.03.",
            ],
            [
              "Достатній діаметр входу й простір для стружки; висота крайки по осі.",
              "Adequate entry/chip space and tool edge on the defined centreline.",
            ],
            [
              "Непідтверджений виліт або вібрація — змінити технологію, не нарощувати подачу.",
              "For an unrated projection or chatter change the process, not simply the feed.",
            ],
            ["F3", "F4"],
          ),
          op(
            "OP30",
            [
              "Чистовий прохід та контроль конусності",
              "Finish and inspect taper",
            ],
            [
              "Після чорнового отвору 9,80 залиште 0,23 мм по діаметру. Вимірюваним чистовим проходом одержіть ціль10,03; перевірте min/max у трьох глибинах. Фаску A зробіть до зняття.",
              "After roughing to 9.80 leave 0.23 mm diametral stock. Use a measured finishing pass to target10.03; inspect min/max at three depths. Chamfer A before removal.",
            ],
            [
              "Перевірений малий розточний різець й відповідний нутромір.",
              "Verified small boring tool and suitable bore gauge.",
            ],
            [
              "Корекція по результату; пружинний прохід не є автоматично нульовим зняттям.",
              "Correct from measurements; a spring pass is not automatically a zero-cut pass.",
            ],
            [
              "F3 10,02–10,04 і F4≤0,015 одночасно.",
              "Meet F3 10.02–10.04 and F4≤0.015 together.",
            ],
            stopCut,
            ["F3", "F4", "F5", "F6"],
          ),
        ],
        [
          [
            "Зберегти карту отвору до зняття.",
            "Retain the bore map before removal.",
          ],
        ],
        [
          "Ізолювати, зняти пруток і відпиляти на 31,2±0,2.",
          "Isolate, remove and saw at 31.2±0.2.",
        ],
        [
          "Не правити отвір абразивом; очистити й підготувати J1 на Ø18.",
          "Do not abrasively correct the bore; clean and prepare J1 for Ø18.",
        ],
        "chuck",
      ),
      finishFace(
        "S2",
        "J1",
        18,
        20,
        30,
        ["E", "E"],
        ["A", "A"],
        ["F1", "F2", "F3", "F4", "F5", "F6"],
      ),
    ],
    cutting: [calculation(10, 60, 0.05, 1800)],
    pitfalls: [
      t(
        "Один прохідний шток не показує конусності або овальності отвору.",
        "One passing rod does not reveal bore taper or ovality.",
      ),
      t(
        "Довгий малий розточний різець віджимається; повторна корекція без вимірювання може збільшити лише вхід.",
        "A long small boring tool deflects; unmeasured corrections may enlarge only the entry.",
      ),
    ],
    sources: [...standardSources, "proj-turn-boring"],
    lessons: [
      "tool-setting-lathe",
      "lathe-drilling",
      "micrometer",
      "dial-indicator",
      "inspection-plan",
    ],
  }),
  project({
    id: "grooved-roller",
    title: t(
      "Канавковий ролик для ручного напрямлення",
      "Grooved roller for hand guidance",
    ),
    summary: t(
      "POM-C: Ø40 на двох поясках, Ø36 у канавці шириною9, довжина25 й Ø8,2. Кулачки з розвантаженням не тиснуть на дно канавки.",
      "POM-C: two Ø40 lands, a Ø36 ×9 groove, 25 length and Ø8.2 bore. Relieved jaws avoid clamping the groove root.",
    ),
    level: "intermediate",
    family: "turning",
    material: t("Ненаповнений POM-C", "Unfilled POM-C"),
    duration: t(
      "5–6 годин із профільним гніздом",
      "5–6 hours including the profiled nest",
    ),
    purpose: t(
      "Ролик повільного ручного стенда для шнура, не підйомний блок, не високошвидкісний шків і не деталь для навантаження людиною.",
      "Roller for a slow hand-operated cord demonstrator, not a lifting pulley, high-speed sheave or human-load component.",
    ),
    stock: roundStock("Ø45 ×65 mm"),
    part: {
      kind: "turned",
      sections: [
        { length: 8, diameter: 40 },
        { length: 9, diameter: 36 },
        { length: 8, diameter: 40 },
      ],
      bore: { diameter: 8.2 },
    },
    datums: [
      {
        id: "A",
        description: t("Перший торець ролика.", "First roller face."),
      },
      { id: "B", description: t("Вісь отвору Ø8,2.", "Ø8.2 bore axis.") },
    ],
    features: [
      dim(
        "F1",
        ["Зовнішні пояски", "Outside lands"],
        "2 × Ø40 ±0.05",
        40,
        39.95,
        40.05,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Дно канавки", "Groove root"],
        "Ø36 ±0.05",
        36,
        35.95,
        36.05,
        "B",
        odMethod,
        mic,
        "sections.1.diameter",
      ),
      dim(
        "F3",
        ["Загальна ширина", "Overall width"],
        "25 ±0.05",
        25,
        24.95,
        25.05,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F4",
        ["Ширина канавки", "Groove width"],
        "9 ±0.05",
        9,
        8.95,
        9.05,
        "A",
        [
          "Вимірюйте між робочими боками без включення фасок; положення першого боку —8,00±0,05 від A.",
          "Measure between functional flanks excluding chamfers; first flank is 8.00±0.05 from A.",
        ],
        [
          "Штангенциркуль лише для грубого контролю; приймання — перевірені плоскопаралельні міри/кінцевий компаратор ширини.",
          "Use calipers for preliminary checks only; accept using verified blocks/width comparator.",
        ],
        "sections.1.length",
      ),
      dim(
        "F5",
        ["Осьовий отвір", "Axial bore"],
        "Ø8.2 +0/+0.10",
        8.2,
        8.2,
        8.3,
        "B",
        boreMethod,
        boreGauge,
        "bore.diameter",
      ),
      dim(
        "F6",
        ["Початок канавки від A", "Groove start from A"],
        "8 ±0.05",
        8,
        7.95,
        8.05,
        "A",
        [
          "Виміряти A до першого боку канавки глибинним мікрометром.",
          "Measure A to the first groove flank with a depth micrometer.",
        ],
        depthMic,
        "sections.0.length",
      ),
      visual(
        "F7",
        ["Корені й кромки", "Roots and edges"],
        "root R≤0.5; external C0.3–0.5",
        "A",
        [
          "Перевірити обидва корені; гострий шнуровий край і стружкові нитки не допускаються.",
          "Inspect both roots; no cord-cutting sharp edge or plastic strings are permitted.",
        ],
      ),
    ],
    fixtures: [
      soft(
        "J1",
        40,
        20,
        "Внутрішнє розвантаження Ø42 між 8 і17 мм від торцевої опори; контакт лише по зовнішніх поясках 0–8 та17–20.",
        "Internal relief Ø42 between 8 and17 mm from the seat; contact only on outside lands 0–8 and17–20.",
      ),
    ],
    setups: [
      setup(
        "S1",
        ["A, пояски й канавка", "A, lands and groove"],
        [
          "Усі боки канавки прив’язати до A в одному встановленні.",
          "Locate both groove flanks from A in one setup.",
        ],
        [
          "A до інструмента; лінія пили на26,2.",
          "A faces the tool; saw line at26.2.",
        ],
        [
          "A — осьовий нуль; канавка від8,00 до17,00.",
          "A is axial zero; groove spans8.00 to17.00.",
        ],
        [
          "Необроблений Ø45 на достатній паспортній довжині; проєкція близько29 мм. Для канавкового різання підтвердити утримання та жорсткість.",
          "Grip untouched Ø45 over adequate documented engagement with approximately29 mm projection; verify retention/rigidity for grooving loads.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["Зовнішній циліндр і A", "Outside cylinder and A"],
            [
              "Підріжте A й обробіть Ø40,00 на26,2 мм. До чистового проходу залиште Ø40,30, охолодіть і виміряйте, щоб не компенсувати теплову похибку переточуванням.",
              "Face A and turn Ø40.00 over26.2 mm. Leave Ø40.30 before finishing, cool/measure and avoid recutting to compensate heat.",
            ],
            ["Гострий POM-C різець.", "Sharp POM-C tool."],
            [
              "0,30 мм по діаметру; 1,2 мм на задньому торці.",
              "0.30 mm diametral stock; 1.2 mm at the rear face.",
            ],
            ["F1 по двох майбутніх поясках.", "F1 on both future lands."],
            stopCut,
            ["F1", "F3"],
          ),
          op(
            "OP20",
            ["Канавка8–17 мм", "Groove8–17 mm"],
            [
              "Придатним канавковим інструментом послідовно виберіть канавку; чорнові боки залиште8,15 і16,85, дноØ36,30. Потім доведіть боки до8,00/17,00 й дно36,00 окремими контрольованими проходами.",
              "Use a suitable grooving tool in successive cuts; rough flanks at8.15/16.85 and rootØ36.30. Finish flanks to8.00/17.00 and root36.00 in separately controlled passes.",
            ],
            [
              "Канавковий різець вужчий за9 мм, із дозволеним напрямком бічної обробки.",
              "Grooving tool narrower than9 mm and rated for the intended side cutting.",
            ],
            [
              "По0,15 мм на бік канавки та0,30 мм на діаметр дна.",
              "0.15 mm per flank and0.30 mm on root diameter.",
            ],
            [
              "F2/F4/F6; геометрія кореня узгоджується з радіусом інструмента.",
              "F2/F4/F6; root geometry matches the tool radius.",
            ],
            [
              "Не переміщувати вузький відрізний різець боком, якщо виробник цього не дозволяє.",
              "Do not side-feed a narrow parting tool unless its manufacturer permits it.",
            ],
            ["F2", "F4", "F6", "F7"],
          ),
          op(
            "OP30",
            ["Отвір і відокремлення", "Bore and separation"],
            [
              "Просвердліть/завершіть Ø8,2 за всю26,2 мм, зніміть фаску A. Після зняття відпиляйте по26,2; не затискайте ролик за канавку в пильних лещатах.",
              "Drill/finish Ø8.2 beyond26.2 mm and chamfer A. Remove and saw at26.2; do not grip the roller by its groove in the saw.",
            ],
            [
              "Придатне свердло й фасковий інструмент.",
              "Suitable drill and chamfer tool.",
            ],
            ["1,2±0,2 мм на задній торець.", "1.2±0.2 mm at the rear face."],
            ["F5 та цілісність коренів.", "F5 and intact groove roots."],
            stopCut,
            ["F3", "F5", "F7"],
          ),
        ],
        [
          [
            "Зберегти фактичні позиції обох боків канавки від A.",
            "Retain actual locations of both groove flanks from A.",
          ],
        ],
        [
          "Зупинити, ізолювати, зняти й відпиляти.",
          "Stop, isolate, remove and saw.",
        ],
        [
          "Виготовити J1 з Ø42 розвантаженням; суцільний Ø40 поясок глибиною20 без рельєфу не контактує правильно з цією деталлю.",
          "Make J1 with Ø42 relief; a plain Ø40 ×20 nest does not contact this profile correctly.",
        ],
        "chuck",
      ),
      finishFace(
        "S2",
        "J1",
        40,
        20,
        25,
        ["E", "E"],
        ["A", "A"],
        ["F1", "F2", "F3", "F4", "F5", "F6", "F7"],
        [
          "Контакт лише по двох Ø40 поясках; дно Ø36 вільне. Не вводьте кулачок у канавку.",
          "Contact only the two Ø40 lands; rootØ36 is clear. Do not engage a jaw inside the groove.",
        ],
      ),
    ],
    cutting: [calculation(40, 80, 0.08, 1500)],
    pitfalls: [
      t(
        "Положення канавки вимірюють від A; загальна ширина9 не підтверджує її симетрію.",
        "Locate the groove from A; width9 alone does not establish symmetry.",
      ),
      t(
        "Сплющення POM затиском змінює отвір; приймайте ролик у вільному стані.",
        "Clamping POM distorts its bore; accept the roller released.",
      ),
    ],
    sources: [...standardSources, "proj-turn-tool-setup"],
    lessons: [
      "material-machining",
      "tool-setting-lathe",
      "lathe-turning",
      "micrometer",
      "inspection-plan",
    ],
  }),
  project({
    id: "mandrel-blank",
    title: t(
      "Ступінчаста заготовка інспекційної оправки",
      "Stepped inspection-arbor blank",
    ),
    summary: t(
      "Суцільний хвостовик Ø20 ×45 та бурт Ø30 ×8. Приклад показує виготовлення прецизійної заготовки й межу між готовою геометрією та дозволеним затискним пристроєм.",
      "Solid Ø20 ×45 shank and Ø30 ×8 shoulder. Demonstrates making a controlled blank and distinguishes finished geometry from an approved clamping device.",
    ),
    level: "intermediate",
    family: "fixturing",
    material: t("EN AW-6061-T6", "EN AW-6061-T6"),
    duration: t("4–6 годин", "4–6 hours"),
    purpose: t(
      "Заготовка для окремо спроєктованої інспекційної оправки. Без додаткового проєкту утримання й перевірки вона не передає сили різання й не затискає іншу деталь; не розрізайте її для саморобного розтискання.",
      "Blank for a separately engineered inspection arbor. Without a retention design and verification it must not transmit cutting loads or clamp another part; do not slit it into a homemade expanding mandrel.",
    ),
    stock: roundStock("Ø32 ×85 mm"),
    part: {
      kind: "turned",
      sections: [
        { length: 45, diameter: 20 },
        { length: 8, diameter: 30 },
      ],
    },
    datums: [
      {
        id: "A",
        description: t("Передній торець хвостовика.", "Front shank end."),
      },
      { id: "B", description: t("Вісь хвостовика Ø20.", "Ø20 shank axis.") },
      {
        id: "C",
        description: t(
          "Передня опорна площина бурта на45 мм від A.",
          "Front shoulder face45 mm from A.",
        ),
      },
    ],
    features: [
      dim(
        "F1",
        ["Хвостовик", "Shank"],
        "Ø20 −0.02/0",
        20,
        19.98,
        20,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Діаметр бурта", "Shoulder diameter"],
        "Ø30 ±0.05",
        30,
        29.95,
        30.05,
        "B",
        odMethod,
        mic,
        "sections.1.diameter",
      ),
      dim(
        "F3",
        ["Загальна довжина", "Overall length"],
        "53 ±0.05",
        53,
        52.95,
        53.05,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F4",
        ["A до опори C", "A to seating face C"],
        "45 ±0.03",
        45,
        44.97,
        45.03,
        "A",
        [
          "Виміряти від A до C незалежним глибинним методом.",
          "Independently measure A-to-C by depth method.",
        ],
        depthMic,
        "sections.0.length",
      ),
      dim(
        "F5",
        ["Торцеве биття C", "Face C runout"],
        "TIR ≤0.03",
        0,
        0,
        0.03,
        "B",
        [
          "Індикувати хвостовик, торкатися C біля зовнішньої робочої зони й обертати вручну в безпечному стані.",
          "Indicate the shank, contact C near the outer working area and rotate manually in the safe state.",
        ],
        indicator,
      ),
      visual(
        "F6",
        ["Кромки й стан хвостовика", "Edges and shank condition"],
        "C0.3–0.5; no jaw scoring",
        "A|C",
        [
          "Поясок Ø20 має бути без вм’ятин; C не спирається на радіус спряжуваної деталі.",
          "Ø20 must be free of dents; C must not seat on a mating-part corner radius.",
        ],
      ),
    ],
    fixtures: [soft("J1", 20, 35)],
    setups: [
      setup(
        "S1",
        ["Хвостовик і площина C за одну вісь", "Shank and face C on one axis"],
        [
          "Виготовити хвостовик і його перпендикулярну опору без перестановки.",
          "Make the shank and its perpendicular seat without remounting.",
        ],
        [
          "A до інструмента; C на45,00, пиляний кінець на54,2 від A.",
          "A toward the tool; C at45.00 and saw end at54.2 from A.",
        ],
        [
          "A — нуль довжини; вісь шпинделя утворює B.",
          "A is length zero; spindle axis establishes B.",
        ],
        [
          "ПрутокØ32 затиснутий за необроблену ділянку; проєкція56 мм. Якщо це перевищує перевірені можливості патрона/верстата, перед роботою змініть оснащення й маршрут, не продовжуйте за вібрації.",
          "Grip untouched Ø32 with56 mm projection. If this exceeds verified chuck/machine capability, revise the workholding/route beforehand and never continue with chatter.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["A та чорновий профіль", "A and rough profile"],
            [
              "Підріжте A, задайте45,00 і54,2 від нього. Чорново проточіть хвостовик до20,30 на45 мм і бурт до30,30 на9,2 мм; не усувайте опору матеріалу біля патрона передчасно.",
              "Face A and establish45.00/54.2 from it. Rough the shank to20.30 over45 mm and shoulder to30.30 over9.2; retain supporting stock near the chuck.",
            ],
            [
              "Різець для алюмінію, жорстка коротка державка.",
              "Aluminum tool in a short rigid holder.",
            ],
            [
              "0,30 мм на діаметр; 1,2 мм на задньому торці.",
              "0.30 mm diametral stock;1.2 mm at the rear face.",
            ],
            [
              "Контролювати прогин уздовж хвостовика до чистової обробки.",
              "Check shank deflection before finishing.",
            ],
            stopCut,
            ["F1", "F2", "F3", "F4"],
          ),
          op(
            "OP20",
            ["Чистовий Ø20 й опора C", "Finish Ø20 and seat C"],
            [
              "Доведіть хвостовик до19,99 та C до45,00 від A. Підхід до C завершіть без підрізання хвостовика; радіус кореня≤0,4 задайте й узгодьте з майбутнім кресленням оснащення.",
              "Finish shank to19.99 and C to45.00 from A. Finish the approach without undercutting the shank; define root radius≤0.4 and carry it into the future fixture drawing.",
            ],
            [
              "Чистовий різець із відомим радіусом вершини.",
              "Finishing tool of known nose radius.",
            ],
            [
              "Корекцію Ø20 виконувати за охолодженим виміром.",
              "Correct Ø20 from cooled measurements.",
            ],
            ["F1/F4/F5 до розтискання.", "F1/F4/F5 before release."],
            stopCut,
            ["F1", "F4", "F5", "F6"],
          ),
          op(
            "OP30",
            ["Бурт і відокремлення заготовки", "Shoulder and blank separation"],
            [
              "Завершіть Ø30,00, зніміть фаску A. Зняту заготовку відпиляйте на54,2±0,2; не використовуйте готовий хвостовик як затискну оправку для самої операції відпилювання.",
              "Finish Ø30.00 and chamfer A. Remove and saw at54.2±0.2; do not use the finished shank as an improvised arbor for sawing.",
            ],
            [
              "Зовнішній/фасковий різець; пильні лещата із захистом поверхні.",
              "External/chamfer tool; saw vice with surface protection.",
            ],
            ["Задній торець ще+1,2 мм.", "Rear face remains+1.2 mm."],
            ["F2 та відсутність вм’ятин на Ø20.", "F2 and no dents on Ø20."],
            stopCut,
            ["F2", "F3", "F6"],
          ),
        ],
        [
          [
            "Виміряти Ø20 біля A, посередині й біля C.",
            "Measure Ø20 near A, at mid-length and near C.",
          ],
        ],
        [
          "Зняти після ізоляції; підготувати J1 на35 мм контакту Ø20.",
          "Remove after isolation and prepare J1 for35 mm Ø20 contact.",
        ],
        [
          "A спирається в J1; бурт і10 мм хвостовика лишаються попереду кулачків.",
          "A seats inside J1; shoulder and10 mm of shank remain ahead of the jaws.",
        ],
        "chuck",
      ),
      finishFace(
        "S2",
        "J1",
        20,
        35,
        53,
        ["E", "E"],
        ["A", "A"],
        ["F1", "F2", "F3", "F4", "F5", "F6"],
        [
          "Бурт Ø30 не має заходити в кулачки або використовуватися як випадковий упор.",
          "Ø30 shoulder must not enter the jaws or become an unintended stop.",
        ],
      ),
    ],
    cutting: [calculation(20, 100, 0.08, 1800)],
    pitfalls: [
      t(
        "Точна заготовка не стає сертифікованим затискним пристроєм від того, що входить в отвір.",
        "An accurately made blank is not an approved clamping device merely because it enters a hole.",
      ),
      t(
        "Чистове C приймають від осі Ø20, а не від неперевіреного зовнішнього Ø30.",
        "Accept C relative to Ø20 axis, not an unverified Ø30 outside.",
      ),
    ],
    lessons: [
      "workholding-basics",
      "tool-setting-lathe",
      "lathe-turning",
      "dial-indicator",
      "inspection-plan",
    ],
  }),
  project({
    id: "blind-thread-knob",
    title: t(
      "Алюмінієва ручка з глухою M6",
      "Aluminum knob with a blind M6 thread",
    ),
    summary: t(
      "Ø30 ×25, різьба M6×1-6H з повним профілем12 мм. Розрізняються глибина циліндричного свердління20 мм, конус вістря та глибина мітчика.",
      "Ø30 ×25 with12 mm full M6×1-6H profile. Separates20 mm full-diameter drilling depth, drill-point cone and tap insertion depth.",
    ),
    level: "advanced",
    family: "turning",
    material: t("EN AW-6061-T6", "EN AW-6061-T6"),
    duration: t("4–6 годин", "4–6 hours"),
    purpose: t(
      "Ручка легкого органайзера на відомому M6 гвинті з входом не більше12 мм. Не орган керування верстатом і не затискний маховик.",
      "Light organizer knob for an identified M6 screw engaging no more than12 mm; not a machine control or clamping handwheel.",
    ),
    stock: roundStock("Ø32 ×60 mm"),
    part: {
      kind: "turned",
      sections: [{ length: 25, diameter: 30 }],
      bore: { diameter: 5, depth: 20, thread: "M6×1-6H; full profile12 min" },
    },
    datums: [
      {
        id: "A",
        description: t("Торець різьбового входу.", "Thread-entry face."),
      },
      { id: "B", description: t("Вісь Ø30.", "Ø30 axis.") },
    ],
    features: [
      dim(
        "F1",
        ["Зовнішній діаметр", "Outside diameter"],
        "Ø30 ±0.05",
        30,
        29.95,
        30.05,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Довжина", "Length"],
        "25 ±0.05",
        25,
        24.95,
        25.05,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F3",
        ["Пілот під різальний мітчик", "Cut-tap pilot"],
        "Ø5.0 +0/+0.10",
        5,
        5,
        5.1,
        "B",
        [
          "Виміряти/контролювати до нарізування, не вважати дрібний конічний кінець повним Ø5.",
          "Inspect before tapping; do not treat the drill-point cone as full Ø5.",
        ],
        boreGauge,
        "bore.diameter",
      ),
      dim(
        "F4",
        ["Повна циліндрична глибина", "Full-diameter drilled depth"],
        "20 −0.2/+0.3; point depth ≤21.8",
        20,
        19.8,
        20.3,
        "A",
        [
          "Визначити повнодіаметрову глибину з геометрії конкретного свердла; окремо контролювати максимальну глибину вістря.",
          "Determine full-diameter depth from the actual drill geometry and separately control maximum point depth.",
        ],
        [
          "Контрольований упор/DRO та виміряний конус свердла; глибиномір із придатним контактом.",
          "Controlled stop/DRO and measured drill cone; depth gauge with appropriate contact.",
        ],
        "bore.depth",
      ),
      thread("F5", "M6×1-6H; full profile ≥12 mm; screw engagement ≤12", "A|B"),
      visual(
        "F6",
        ["Дно й входи", "Bottom and entry"],
        "No breakthrough; C0.3–0.5",
        "A",
        [
          "Оглянути дно та вхід, перевірити відсутність стружки й наскрізного прориву.",
          "Inspect the bottom/entry for chips and breakthrough.",
        ],
      ),
    ],
    fixtures: [soft("J1", 30, 15)],
    setups: [
      setup(
        "S1",
        ["A, глухе свердління й M6", "A, blind drilling and M6"],
        [
          "Зробити різьбовий вхід до перестановки, зберігши контроль дна.",
          "Make the threaded entry before remounting while controlling the bottom.",
        ],
        [
          "A відкритий; задній кінець на26,2 мм ще в заготовці.",
          "A exposed; the rear end at26.2 remains within the blank.",
        ],
        [
          "A — нуль глибини; B збігається з віссю точіння.",
          "A is depth zero; B follows the turning axis.",
        ],
        [
          "Необроблений Ø32 у патроні; проєкція28 мм. Затиск не має лежати на шляху вістря до21,8 мм.",
          "Grip untouched Ø32 with28 mm projection; workholding must not lie in the drill-point path to21.8 mm.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["A й Ø30", "A and Ø30"],
            [
              "Підріжте A та доведіть Ø30,00 на26,2 мм довжини через чорнове30,30. Поздовжній нуль A потрібний для всіх наступних глибин.",
              "Face A and finish Ø30.00 over26.2 length after roughing to30.30. A’s axial zero controls every subsequent depth.",
            ],
            ["Зовнішній і торцевий різці.", "External and facing tools."],
            [
              "0,30 мм на діаметр;1,2 мм на задній торець.",
              "0.30 mm diametral stock;1.2 mm at the rear face.",
            ],
            ["F1 та нуль A.", "F1 and A zero."],
            stopCut,
            ["F1", "F2"],
          ),
          op(
            "OP20",
            [
              "Просвердлити контрольоване глухе дно",
              "Drill a controlled blind bottom",
            ],
            [
              "СвердломØ5,0 одержіть повний циліндр до20,0 мм; врахуйте конус вістря так, щоб найглибша точка не перевищила21,8 мм. Зупинки для видалення стружки виконуються за процедурою свердла.",
              "WithØ5.0 drill obtain full diameter to20.0 mm; account for the point cone so the deepest point remains≤21.8. Follow the tool procedure for chip-removal stops.",
            ],
            [
              "Ø5,0 свердло з відомим фактичним кутом вістря та робочою довжиною.",
              "Ø5.0 drill of known actual point angle and working length.",
            ],
            [
              "Кінцева товщина до зовнішнього торця щонайменше3,15 мм за найгірших меж F2/F4.",
              "At worst-case F2/F4 limits retain at least3.15 mm to the outer end.",
            ],
            [
              "F3/F4 до різьби; перевірити розрахунок вістря.",
              "Inspect F3/F4 before tapping and verify point-depth calculation.",
            ],
            [
              "Невідома геометрія вістря або неконтрольований упор — не починати глухе свердління.",
              "Do not begin blind drilling with unknown point geometry or an uncontrolled stop.",
            ],
            ["F3", "F4", "F6"],
          ),
          op(
            "OP30",
            ["Нарізати повні12 мм M6", "Cut12 mm full M6 profile"],
            [
              "На зупиненому шпинделі напрямленим ручним процесом наріжте M6 до повного профілю12 мм. Заздалегідь перевірте довжину заходу мітчика: його ніс не має дійти до конуса свердління.",
              "With the spindle stopped use a guided hand process for12 mm full M6 profile. Check tap chamfer length beforehand; the nose must not reach the drill cone.",
            ],
            [
              "M6×1 різальний мітчик для глухого отвору, напрямна й вороток.",
              "M6×1 blind-hole cut tap, guide and tap wrench.",
            ],
            [
              "Запас між повним профілем12 й циліндричним дном20 — для заходу й стружки, не для довільного поглиблення різьби.",
              "The space between full profile12 and cylindrical bottom20 accommodates chamfer/chips, not arbitrary extra thread depth.",
            ],
            [
              "F5 GO/NO-GO й глибина повного профілю; очистити отвір.",
              "F5 GO/NO-GO and full-profile depth; clean the hole.",
            ],
            [
              "Зростання моменту не долати важелем: вийняти інструмент за процедурою й перевірити стружку/глибину.",
              "Do not overcome rising torque with leverage; withdraw under the procedure and inspect chips/depth.",
            ],
            ["F5", "F6"],
          ),
        ],
        [
          [
            "Прийняти F3/F4 перед нарізуванням і F5 після нього.",
            "Accept F3/F4 before tapping and F5 afterwards.",
          ],
        ],
        [
          "Зняти й відпиляти задній торець на26,2±0,2; захистити різьбовий вхід від стружки.",
          "Remove and saw rear face at26.2±0.2, protecting the thread entry from chips.",
        ],
        [
          "J1 підтримує15 мм Ø30; різьбове A сідає на кільцеву чисту опору, не на вставлений гвинт.",
          "J1 supports15 mm of Ø30; threaded A seats on a clean annular support, not on an inserted screw.",
        ],
        "chuck",
      ),
      finishFace(
        "S2",
        "J1",
        30,
        15,
        25,
        ["E", "E"],
        ["A", "A"],
        ["F1", "F2", "F3", "F4", "F5", "F6"],
      ),
    ],
    cutting: [calculation(30, 100, 0.08, 1800)],
    pitfalls: [
      t(
        "Глибина кінчика свердла не дорівнює глибині повного циліндра; помилка може прорвати торець.",
        "Drill-point depth is not full-diameter depth; confusing them can break through the end.",
      ),
      t(
        "Загальна довжина мітчика не визначає доступну глибину повного профілю.",
        "Overall tap length does not establish full-profile thread depth.",
      ),
    ],
    sources: [...standardSources, "proj-turn-tapping", "proj-turn-m6-tap"],
    lessons: [
      "drilling-tools",
      "threading-reaming",
      "tool-setting-lathe",
      "lathe-drilling",
      "inspection-plan",
    ],
  }),
  project({
    id: "eccentric-cam",
    title: t(
      "Ексцентриковий диск із зміщенням3 мм",
      "Eccentric disc with3 mm offset",
    ),
    summary: t(
      "Ø50 ×12 і отвірØ8,2 на X=3,Y=0 від осі. Токарна частина лишається збалансованою; ексцентричний отвір виготовляється після перенесення на фрезерний.",
      "Ø50 ×12 withØ8.2 at X=3,Y=0 from the axis. Turn the balanced blank first; make the eccentric hole after transferring to the mill.",
    ),
    level: "advanced",
    family: "hybrid",
    material: t("EN AW-6061-T6", "EN AW-6061-T6"),
    duration: t(
      "6–8 годин разом із плитою й координатним контролем",
      "6–8 hours including carrier and coordinate inspection",
    ),
    purpose: t(
      "Диск ручного демонстратора зміщення осей. Не застосовувати як силовий ексцентриковий затискач або обертовий привод без окремого розрахунку.",
      "Disc for a hand-operated axis-offset demonstrator, not a load-bearing cam clamp or powered drive without separate engineering.",
    ),
    equipment: [
      ...latheEquipment,
      t(
        "Фрезерний із DRO; щуп/індикатор центра; незалежний координатний контроль X/Y отвору.",
        "Mill with DRO, centre probe/indicator and independent hole-coordinate inspection.",
      ),
    ],
    stock: roundStock("Ø55 ×45 mm"),
    part: {
      kind: "turned",
      sections: [{ length: 12, diameter: 50 }],
      holes: [{ x: 3, y: 0, diameter: 8.2 }],
    },
    datums: [
      {
        id: "A",
        description: t("Перший опорний торець.", "First seating face."),
      },
      { id: "B", description: t("Вісь зовнішнього Ø50.", "Outside Ø50 axis.") },
      {
        id: "C",
        description: t("Промаркований напрямок+X.", "Marked+X direction."),
      },
    ],
    features: [
      dim(
        "F1",
        ["Зовнішній Ø", "Outside Ø"],
        "Ø50 ±0.03",
        50,
        49.97,
        50.03,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Товщина", "Thickness"],
        "12 ±0.03",
        12,
        11.97,
        12.03,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F3",
        ["Отвір", "Hole"],
        "Ø8.2 +0/+0.10",
        8.2,
        8.2,
        8.3,
        "A|B",
        boreMethod,
        boreGauge,
        "holes.0.diameter",
      ),
      dim(
        "F4",
        ["Зміщення X", "X offset"],
        "X=3 ±0.03",
        3,
        2.97,
        3.03,
        "B|C",
        [
          "Визначте центр зовнішнього кола за кількома точками та центр каліброваного штифта незалежним координатним засобом.",
          "Locate the outside-circle centre from multiple points and a calibrated pin centre using an independent coordinate instrument.",
        ],
        [
          "Координатний прилад/вимірювальний мікроскоп або кваліфікована висотомірна схема.",
          "Coordinate instrument/measuring microscope or qualified height-gauge arrangement.",
        ],
        "holes.0.x",
      ),
      dim(
        "F5",
        ["Координата Y", "Y coordinate"],
        "Y=0 ±0.03",
        0,
        -0.03,
        0.03,
        "B|C",
        [
          "Той самий незалежний контроль у перпендикулярному напрямку; одна відстань до краю не визначає обидві координати.",
          "Repeat independent inspection in the perpendicular direction; one edge distance does not define both coordinates.",
        ],
        [
          "Координатний прилад або вимірювальний мікроскоп.",
          "Coordinate instrument or measuring microscope.",
        ],
        "holes.0.y",
      ),
      dim(
        "F6",
        ["Розкид товщини", "Thickness spread"],
        "max − min ≤0.03",
        0,
        0,
        0.03,
        "A",
        lengthMethod,
        depthMic,
      ),
      visual(
        "F7",
        ["Кромки й кутова позначка", "Edges and direction mark"],
        "C0.3–0.5; permanent+X mark",
        "C",
        [
          "Позначку напрямку ставлять на нефункціональній зоні; жодних глибоких кернів на опорі A.",
          "Place the direction mark on a nonfunctional area; no deep punches on A.",
        ],
      ),
    ],
    fixtures: [
      soft("J1", 50, 8),
      {
        id: "P1",
        name: t(
          "Підкладка з виходом для ексцентричного отвору",
          "Carrier with eccentric-hole clearance",
        ),
        kind: "sacrificial-plate",
        made: true,
        purpose: t(
          "Дати опору A та вихід свердла, утримуючи диск трьома прихватами.",
          "Support A and drill breakthrough while retaining the disc with three clamps.",
        ),
        stock: t(
          "Алюмінієва плита95 ×95 ×18 мм.",
          "Aluminum plate95 ×95 ×18 mm.",
        ),
        dimensions: t(
          "Готова90 ×90 ×15; центр диска(45,45), кишеняØ12 глибиною3 у(48,45).",
          "Finish90 ×90 ×15; disc centre(45,45), Ø12 ×3-deep pocket at(48,45).",
        ),
        hardware: [
          t(
            "Три заводські прихвати з опорами, сумісні болти/Т-гайки; окреме кріплення плити до столу.",
            "Three manufactured supported strap clamps, compatible bolts/T-nuts and separate carrier-to-table retention.",
          ),
        ],
        manufacture: [
          t(
            "Обробити дві площини до15±0,1, вибрати базові кромки X/Y.",
            "Face both sides to15±0.1 and establish X/Y reference edges.",
          ),
          t(
            "Довести габарит90 ×90±0,1 та промаркувати(45,45).",
            "Finish90 ×90±0.1 and identify(45,45).",
          ),
          t(
            "Вибрати кишенюØ12 ×3 у(48,45), не перетворюючи її на випадкове кріплення.",
            "MachineØ12 ×3 pocket at(48,45); do not use it as arbitrary retention.",
          ),
          t(
            "Зняти задирки, очистити, перевірити площину й траєкторію свердла відносно прихватів.",
            "Deburr, clean and check the support plane and drill path against the clamps.",
          ),
        ],
        preparation: [
          t(
            "Розмістити диск наA; три прихвати по ободу, наприклад45°,165°,285°, поза отвором і тримачем.",
            "Seat the disc onA; place three rim clamps, for example45°,165°,285°, clear of the hole and holder.",
          ),
          t(
            "Підтвердити відсутність вигину диска й контакт плити зі столом.",
            "Confirm no disc bending and full carrier/table seating.",
          ),
        ],
        acceptance: [
          t(
            "Є вільний вихід вістря всередині кишені, плита й диск закріплені незалежно.",
            "The point clears into the pocket and both carrier and disc are independently retained.",
          ),
        ],
        geometry: {
          kind: "block",
          width: 90,
          depth: 90,
          height: 15,
          holes: [{ x: 48, y: 45, diameter: 12, depth: 3 }],
        },
      },
    ],
    setups: [
      setup(
        "S1",
        ["Збалансований диск без отвору", "Balanced disc before the hole"],
        [
          "Зробити A й Ø50 до ексцентричного свердління.",
          "Make A and Ø50 before eccentric drilling.",
        ],
        [
          "A відкритий, пиляний задній торець на13,2 мм.",
          "A exposed, sawn rear face at13.2 mm.",
        ],
        [
          "A — осьовий нуль, зовнішній Ø50 утворює B.",
          "A is axial zero and OD50 establishes B.",
        ],
        [
          "Незайманий Ø55 у патроні, проєкція16 мм; не обертати пізніше диск як збалансовану заготовку після появи ексцентричного отвору.",
          "Grip untouchedØ55 with16 mm projection; do not later assume the drilled eccentric disc is balanced.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["Чистий A", "Clean face A"],
            [
              "ПідріжтеA до повного очищення, виставте нуль та перевірте, що торець не має центрального виступу.",
              "FaceA completely, establish zero and check for a centre pip.",
            ],
            ["Гострий торцевий різець.", "Sharp facing tool."],
            [
              "Не менше0,5 мм на очищення пиляного торця.",
              "At least0.5 mm for cleaning the sawn face.",
            ],
            [
              "ЧистотаA і стабільна посадка.",
              "A cleanliness and stable workholding.",
            ],
            stopCut,
            ["F2", "F6"],
          ),
          op(
            "OP20",
            ["Контрольований Ø50", "Controlled OD50"],
            [
              "Проточіть до50,30, виміряйте, потім до50,00 на13,2 мм. Цей діаметр буде координатною базою; не приймайте лише середній розмір при овальності.",
              "Turn to50.30, measure, then50.00 over13.2 mm. This diameter becomes the coordinate datum; a mean reading does not accept ovality.",
            ],
            ["Зовнішній чистовий різець.", "External finishing tool."],
            ["0,30 мм по діаметру.", "0.30 mm diametral stock."],
            [
              "F1 у трьох перерізах і двох напрямках.",
              "F1 at three sections and two directions.",
            ],
            stopCut,
            ["F1"],
          ),
          op(
            "OP30",
            ["Фаска A й відділення", "A chamfer and separation"],
            [
              "ЗнімітьC0,3–0,5 наA; після зняття відпиляйте по13,2±0,2. Запишіть, що отвір ще відсутній, і не переносіть балансувальні припущення на готову деталь.",
              "ChamferA C0.3–0.5; remove and saw at13.2±0.2. Record that the hole is not yet present and do not carry balance assumptions to the finished part.",
            ],
            [
              "Фасковий різець і закріплена пилка.",
              "Chamfer tool and secured saw.",
            ],
            ["1,2±0,2 мм на торецьE.", "1.2±0.2 mm at faceE."],
            [
              "F1 і вільна задня поверхня для S2.",
              "F1 and accessible rear face forS2.",
            ],
            stopCut,
            ["F1", "F2", "F7"],
          ),
        ],
        [
          [
            "Зовнішній круг має бути прийнятий до перенесення центра.",
            "Accept the outer circle before transferring its centre.",
          ],
        ],
        [
          "Зупинити, ізолювати, зняти й відпиляти.",
          "Stop, isolate, remove and saw.",
        ],
        [
          "ПідготуватиJ1 й не пошкодити базовийØ50.",
          "PrepareJ1 without damaging datumØ50.",
        ],
        "chuck",
      ),
      finishFace(
        "S2",
        "J1",
        50,
        8,
        12,
        ["E", "E"],
        ["A", "A"],
        ["F1", "F2", "F6", "F7"],
      ),
      setup(
        "S3",
        ["Центр B та зміщений отвір", "B centre and offset hole"],
        [
          "Відкласти3 мм від незалежно відновленого центраØ50.",
          "Apply3 mm offset from the independently recoveredØ50 centre.",
        ],
        ["A вниз наP1, диск нерухомий.", "A down onP1, disc stationary."],
        [
          "X0,Y0 поØ50; +X маркується якC, Z відA/товщини.",
          "X0,Y0 fromØ50; mark+X asC and establishZ fromA/thickness.",
        ],
        [
          "P1 закріплена на столі, диск трьома прихватами по ободу; затиск не перекриває точку(3,0).",
          "P1 retained on the table, disc held by three rim clamps clear of(3,0).",
        ],
        ["P1"],
        [
          op(
            "OP70",
            [
              "Відновити центр із чотирьох напрямків",
              "Recover centre in four directions",
            ],
            [
              "Визначте крайØ50 у±X та±Y з урахуванням радіуса щупа й усередніть протилежні контакти. Незалежно повторіть центр, потім перемістіться вX=+3,000,Y=0.",
              "LocateØ50 in±X/±Y accounting for probe radius and average opposing contacts. Independently repeat the centre, then move toX=+3.000,Y=0.",
            ],
            [
              "Щуп/кромкошукач, DRO й перевірений розрахунок центра.",
              "Probe/edge finder, DRO and checked centre calculation.",
            ],
            [
              "Координатного припуску немає.",
              "There is no positional allowance.",
            ],
            [
              "Порівняти два незалежні визначення центра до свердління.",
              "Compare two independent centre determinations before drilling.",
            ],
            stopCut,
            ["F4", "F5"],
          ),
          op(
            "OP80",
            ["Засвердлити та зробитиØ8,2", "Start and produceØ8.2"],
            [
              "Перевірте точку над деталлю й кишенеюP1, засвердліть сумісним інструментом та просвердлітьØ8,2 із виходом вістря в підкладку. Координату не виправляйте нахилом свердла.",
              "Verify the point above the part/P1 pocket, spot with a compatible tool and drillØ8.2 with point breakthrough into the carrier. Never correct position by tilting the drill.",
            ],
            [
              "Засвердлювальний інструмент іØ8,2 свердло.",
              "Spotting tool andØ8.2 drill.",
            ],
            [
              "Вихід вістря обмежений3-мм кишенею, врахуйте його конус.",
              "Point breakthrough is limited by the3 mm pocket; account for its cone.",
            ],
            [
              "F3 кожного боку, відсутність зсуву деталі.",
              "F3 at both entries and no workpiece movement.",
            ],
            stopCut,
            ["F3", "F4", "F5"],
          ),
          op(
            "OP90",
            [
              "Координатне приймання й кромки",
              "Coordinate acceptance and edges",
            ],
            [
              "Зняту деталь очистіть і зніміть задирки; незалежно виміряйтеX/Y центра отвору від колаØ50. Занесіть обидві координати, а не тільки величину ексцентриситету.",
              "Remove, clean and deburr; independently measure the hole-centreX/Y relative toØ50. Record both coordinates, not only eccentricity magnitude.",
            ],
            [
              "Координатний прилад і калібрований штифт у отворі.",
              "Coordinate instrument and calibrated hole pin.",
            ],
            [
              "Підпилювання отвору робить координатне приймання недійсним.",
              "Filing the hole invalidates coordinate acceptance.",
            ],
            ["F1–F7 та позначкаC.", "F1–F7 andC marking."],
            stopCut,
            ["F1", "F2", "F3", "F4", "F5", "F6", "F7"],
          ),
        ],
        [
          [
            "F4/F5 приймаються за незалежним контрольним засобом, не лише відліком верстата.",
            "Accept F4/F5 from independent inspection rather than machine readings alone.",
          ],
        ],
        [
          "Зберегти на нерухомому стенді, без обертання приводом.",
          "Retain on a stationary bench without powered rotation.",
        ],
        [
          "Для силового затискача потрібен інший проєкт із силами, міцністю й утриманням.",
          "A load-bearing cam clamp requires separate force, strength and retention engineering.",
        ],
        "strap-clamps",
        false,
        "drilling",
      ),
    ],
    cutting: [calculation(50, 100, 0.08, 1200)],
    pitfalls: [
      t(
        "Ексцентриситет3 мм — від осіØ50, не3 мм від краю.",
        "The3 mm eccentricity is measured from theØ50 axis, not3 mm from an edge.",
      ),
      t(
        "Величина√(X²+Y²) не підтверджує кутове положення й обидві координати.",
        "The magnitude√(X²+Y²) does not establish direction or both coordinates.",
      ),
    ],
    lessons: [
      "lathe-facing",
      "tool-setting-mill",
      "mill-datums",
      "marking-out",
      "inspection-plan",
    ],
  }),
  project({
    id: "reference-puck",
    title: t("Паралельна опорна шайба15 мм", "15 mm parallel support puck"),
    summary: t(
      "СталеваØ40 ×15 із вузьким допуском висоти±0,01. Два встановлення, ступінчасті м’які кулачки та окремий контроль товщини, площинності й повторюваності вимірювання.",
      "SteelØ40 ×15 with a±0.01 height tolerance. Two setups, stepped soft jaws and separate checks of thickness, flatness and measurement repeatability.",
    ),
    level: "advanced",
    family: "turning",
    material: t(
      "C45 нормалізована, без загартування",
      "Normalized C45, unhardened",
    ),
    duration: t(
      "5–7 годин із температурною стабілізацією",
      "5–7 hours including thermal stabilisation",
    ),
    purpose: t(
      "Опорна шайба для нерухомого навчального компонування. Це не кінцева міра довжини, не еталон калібрування та не сертифікована опора під силове оснащення.",
      "Support puck for a stationary educational arrangement; not a gauge block, calibration standard or certified support for loaded workholding.",
    ),
    equipment: [
      ...latheEquipment,
      t(
        "Мікрометр із перевіркою біля15 мм, гранітна плита, три контрольні опори й індикатор0,001 мм; бюджет похибки має дозволяти поле0,02 мм.",
        "Micrometer checked near15 mm, granite plate, three inspection supports and a0.001 mm indicator; the error budget must support a0.02 mm tolerance zone.",
      ),
    ],
    stock: roundStock("Ø42 ×50 mm"),
    part: { kind: "turned", sections: [{ length: 15, diameter: 40 }] },
    datums: [
      {
        id: "A",
        description: t("Перший опорний торець.", "First support face."),
      },
      { id: "B", description: t("ВісьØ40.", "Ø40 axis.") },
    ],
    features: [
      dim(
        "F1",
        ["Зовнішній діаметр", "Outside diameter"],
        "Ø40 ±0.03",
        40,
        39.97,
        40.03,
        "B",
        odMethod,
        mic,
        "sections.0.diameter",
      ),
      dim(
        "F2",
        ["Висота", "Height"],
        "15 ±0.01",
        15,
        14.99,
        15.01,
        "A",
        lengthMethod,
        depthMic,
        "length",
      ),
      dim(
        "F3",
        ["Розкид товщини", "Thickness spread"],
        "max − min ≤0.01",
        0,
        0,
        0.01,
        "A",
        [
          "Товщина у чотирьох кутових положеннях і двох радіальних зонах, без заходу на фаску.",
          "Measure thickness at four angular positions and two radial regions, excluding the chamfer.",
        ],
        mic,
      ),
      dim(
        "F4",
        ["Площинність A", "A flatness"],
        "≤0.02",
        0,
        0,
        0.02,
        "A",
        [
          "Виконайте погоджений індикаторний контроль на трьох опорах, з повторними положеннями й відокремленням нахилу бази. Просте хитання на плиті — лише попередня перевірка.",
          "Use a qualified three-support indicator method with repeated orientations and removal of datum tilt. Rocking on a plate is only a preliminary check.",
        ],
        indicator,
      ),
      dim(
        "F5",
        ["Площинність E", "E flatness"],
        "≤0.02",
        0,
        0,
        0.02,
        "A",
        [
          "Контролюйте другий торець окремо; однакова товщина не підтверджує площинність обох поверхонь.",
          "Inspect the second face separately; uniform thickness does not prove both faces flat.",
        ],
        indicator,
      ),
      visual(
        "F6",
        ["Фаски й чистота опор", "Chamfers and seating cleanliness"],
        "C0.2–0.4; no embedded burrs",
        "A",
        [
          "Лупою оглянути торці, центр і кромки. Не притирати довільно після приймання висоти без нової карти контролю.",
          "Inspect faces, centre and edges with a loupe. Do not lap arbitrarily after height acceptance without a new inspection record.",
        ],
      ),
    ],
    fixtures: [soft("J1", 40, 10)],
    setups: [
      setup(
        "S1",
        ["База A й циліндр", "A datum and cylinder"],
        [
          "Створити чисту опору до відокремлення короткої деталі.",
          "Create a clean support face before separating the short part.",
        ],
        [
          "A відкритий; задня лінія пили на16,2 мм.",
          "A exposed; rear saw line at16.2 mm.",
        ],
        [
          "A задає довжину, Ø40 — вісьB.",
          "A sets length; Ø40 establishes axisB.",
        ],
        [
          "НезайманийØ42 затиснутий у придатному патроні, робоча проєкція19 мм.",
          "Grip untouchedØ42 in a suitable chuck with19 mm working projection.",
        ],
        ["J1"],
        [
          op(
            "OP10",
            ["Торцювання A", "Face A"],
            [
              "ПідріжтеA до повного очищення, спланувавши останній прохід із жорсткою короткою державкою. Після зупинки перевірте центр; центральний виступ зруйнує посадку й вимір висоти.",
              "FaceA completely and plan the final pass with a short rigid holder. After stopping inspect the centre; a pip invalidates seating and height measurement.",
            ],
            [
              "Чистовий різець для нормалізованоїC45.",
              "Finishing tool for normalizedC45.",
            ],
            [
              "Фінішний припуск вибрати під фактичну геометрію крайки; до нього не вимагати чистової поверхні.",
              "Select finishing allowance for the actual edge geometry; do not demand a finished surface beforehand.",
            ],
            [
              "Попередній станA й відсутність центрального виступу.",
              "PreliminaryA condition and no centre pip.",
            ],
            stopCut,
            ["F4", "F6"],
          ),
          op(
            "OP20",
            ["Точний Ø40", "ControlledØ40"],
            [
              "Проточіть робочу довжину16,2 мм. ЧорновийØ40,25 доведіть після проміру до40,00, не переносячи випадково довжини з іншого прикладу.",
              "The working length is16.2 mm only. Rough toØ40.25, then measure and finish to40.00 without carrying a length from another example.",
            ],
            [
              "Зовнішній різець із мінімальним достатнім вильотом.",
              "External tool with minimum sufficient overhang.",
            ],
            ["0,25 мм по діаметру.", "0.25 mm diametral allowance."],
            [
              "F1 по довжині та у двох напрямках.",
              "F1 along the length in two directions.",
            ],
            stopCut,
            ["F1"],
          ),
          op(
            "OP30",
            ["Фаска A й відпилювання", "A chamfer and sawing"],
            [
              "ЗнімітьC0,2–0,4; після зняття відпиляйте на16,2±0,2. ЗахищайтеA плоскою чистою прокладкою в пильних лещатах, не спираючи її на задирку.",
              "ChamferC0.2–0.4, remove and saw at16.2±0.2. ProtectA with a clean flat pad in the saw vice without seating on a burr.",
            ],
            [
              "Фасковий різець, закріплена пилка й захисні накладки.",
              "Chamfer tool, secured saw and protective pads.",
            ],
            [
              "1,0–1,4 мм запасу до висоти15.",
              "1.0–1.4 mm stock above height15.",
            ],
            [
              "Перевірити фактичний припуск і повторно чистотуA.",
              "Check actual allowance andA cleanliness.",
            ],
            stopCut,
            ["F1", "F2", "F6"],
          ),
        ],
        [
          [
            "Не торкатися чистих торців голими теплими руками без потреби перед точним виміром.",
            "Avoid unnecessary warm-hand contact with clean faces before precision measurement.",
          ],
        ],
        [
          "Ізолювати, зняти, відпиляти й стабілізувати температуру.",
          "Isolate, remove, saw and thermally stabilise.",
        ],
        [
          "ПідготуватиJ1; будь-яка стружка підA більша за поле допуску висоти неприпустима.",
          "PrepareJ1; any chip beneathA comparable to the height tolerance is unacceptable.",
        ],
        "chuck",
      ),
      finishFace(
        "S2",
        "J1",
        40,
        10,
        15,
        ["E", "E"],
        ["A", "A"],
        ["F1", "F2", "F3", "F4", "F5", "F6"],
      ),
    ],
    cutting: [calculation(40, 60, 0.06, 1200)],
    qualityPlan: [
      ...baseQuality,
      t(
        "Для F2/F3 спочатку перевірте повторюваність на відомій мірі біля15 мм; невизначеність і вплив температури мають бути відчутно меншими за поле0,02 мм. При граничних результатах приймання не роблять без оцінки похибки.",
        "ForF2/F3 first verify repeatability on a known reference near15 mm; uncertainty/thermal influence must be substantially smaller than the0.02 mm zone. Do not accept borderline results without evaluating measurement error.",
      ),
    ],
    pitfalls: [
      t(
        "Паралельність за товщиною та площинність — різні ознаки; одну не виводять автоматично з іншої.",
        "Thickness parallelism and flatness are different characteristics; one does not automatically establish the other.",
      ),
      t(
        "Висота, виміряна відразу після різання або затиску, може вийти за допуск після стабілізації.",
        "Height measured immediately after cutting/clamping can leave tolerance after stabilisation.",
      ),
    ],
    lessons: [
      "machine-alignment",
      "lathe-facing",
      "tool-setting-lathe",
      "micrometer",
      "inspection-plan",
    ],
  }),
];

// Machine-view metadata uses chuck left/tool right, independently of drawing coordinates.
const turningDatumSides: Record<string, ["left" | "right", "left" | "right"]> = {
  spacer: ["right", "left"],
  "stepped-shaft": ["left", "right"],
  flange: ["right", "left"],
  "replacement-knob": ["left", "right"],
  "threaded-standoff": ["right", "left"],
  "shoulder-bushing": ["left", "right"],
  "guide-sleeve": ["right", "left"],
  "grooved-roller": ["right", "left"],
  "mandrel-blank": ["right", "left"],
  "blind-thread-knob": ["right", "left"],
  "eccentric-cam": ["right", "left"],
  "reference-puck": ["right", "left"],
};

for (const project of turningProjects) {
  for (const stage of project.setups) {
    stage.diagram.oppositeFace = project.id === "replacement-knob" ? "C" : "E";
    if (stage.diagram.view === "turning") {
      stage.diagram.datumA = turningDatumSides[project.id][stage.id === "S1" ? 0 : 1];
      stage.diagram.toolApproach = "axial";
    } else {
      stage.diagram.datumA = "bottom";
      stage.diagram.toolApproach = "top";
    }
  }
}
