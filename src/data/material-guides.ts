import type {
  MaterialDefect,
  MaterialExercise,
  MaterialGuide,
  MaterialMethod,
  Source,
  Step,
  Text,
} from "./types";

type Pair = [string, string];
const t = (uk: string, en: string): Text => ({ uk, en });
const p = (value: Pair): Text => t(...value);
const method = (
  operation: MaterialMethod["operation"],
  tool: Pair,
  setup: Pair,
  technique: Pair,
  chips: Pair,
  expected: Pair,
  avoid: Pair,
): MaterialMethod => ({
  operation,
  tool: p(tool),
  setup: p(setup),
  technique: p(technique),
  chips: p(chips),
  expected: p(expected),
  avoid: p(avoid),
});
const defect = (
  symptom: Pair,
  cause: Pair,
  checks: Pair,
  response: Pair,
): MaterialDefect => ({
  symptom: p(symptom),
  cause: p(cause),
  checks: p(checks),
  response: p(response),
});
const step = (title: Pair, body: Pair, check: Pair): Step => ({
  title: p(title),
  body: p(body),
  check: p(check),
});
const exercise = (
  title: Pair,
  goal: Pair,
  stock: Pair,
  tools: Pair[],
  steps: Step[],
  result: Pair,
  measure: Pair[],
  projectIds: string[],
): MaterialExercise => ({
  title: p(title),
  goal: p(goal),
  stock: p(stock),
  tools: tools.map(p),
  steps,
  result: p(result),
  measure: measure.map(p),
  projectIds,
});
const machineGate = t(
  "До різання перевірте геометрію верстата, захват, виліт, биття інструмента й усю траєкторію. Швидкість різання та подачу беріть для точної марки, стану й конкретного інструмента; назва матеріалу не задає оберти.",
  "Before cutting, qualify machine geometry, engagement, projection, tool runout and the entire path. Select cutting speed and feed for the exact grade, condition and tool; a material name does not specify spindle speed.",
);
const inspection = t(
  "Задані розміри вправ — навчальні вимоги, а не результати випробування маршруту. Очищуйте й термостабілізуйте деталь/прилад; повторюйте виміри без затиску, записуйте мінімум, максимум і температуру. Роздільність приладу не дорівнює його похибці.",
  "Exercise dimensions are learning requirements, not results of a validated manufacturing trial. Clean and temperature-stabilise part/instrument; repeat measurements unclamped and record minimum, maximum and temperature. Instrument resolution is not measurement error.",
);
const rotation = t(
  "Окуляри, огородження, прибране волосся й одяг; без рукавичок біля обертання. Стружку прибирайте після повної зупинки придатним гачком/щіткою, не руками. Їжа й напої зберігаються поза робочою зоною.",
  "Wear eye protection, use guards and secure hair/clothing; no gloves near rotation. Remove chips after a full stop using a suitable hook/brush rather than hands. Keep food and drink outside the work area.",
);
const appearanceNote = t(
  "Вигляд 3D — умовний зразок кольору та блиску, не прогноз шорсткості. Однакове освітлення допомагає порівнянню; числове Ra підтверджує лише придатний вимірювальний метод.",
  "The 3D appearance is an illustrative colour and gloss sample, not a surface-roughness prediction. Consistent lighting aids comparison; numerical Ra requires a suitable measuring method.",
);

export const materialSources: Source[] = [
  {
    id: "material-groups",
    title: "Workpiece materials and classifications",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/knowledge/materials/workpiece-materials",
  },
  {
    id: "material-turning",
    title: "How to do turning in different materials",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/knowledge/general-turning/how-to-do-turning-in-different-materials",
  },
  {
    id: "material-milling",
    title: "Milling different materials",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/knowledge/milling/milling-different-materials",
  },
  {
    id: "material-drilling",
    title: "Drilling application tips",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/knowledge/drilling/drilling-tips",
  },
  {
    id: "material-alu-tools",
    title: "Turning inserts and grades for non-ferrous materials",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/turning-inserts-grades-non-ferrous-materia",
  },
  {
    id: "material-hydro",
    title: "6082 alloy and temper selection",
    publisher: "Hydro",
    url: "https://www.hydro.com/en/global/aluminium/products/extruded-profiles/alloys-for-extruded-profiles/6082-alloy/",
  },
  {
    id: "material-c45",
    title: "C45 steel grade and delivery conditions",
    publisher: "Ovako",
    url: "https://steelnavigator.ovako.com/steel-grades/c45/",
  },
  {
    id: "material-stainless",
    title: "Machining stainless and duplex steels",
    publisher: "Alleima",
    url: "https://www.alleima.com/en/products/tube-pipe/tubular-products/mechanical-tubing/machining-stainless-steels/",
  },
  {
    id: "material-stainless-drill",
    title: "Speeds and feeds for drilling and reaming stainless steels",
    publisher: "British Stainless Steel Association",
    url: "https://bssa.org.uk/bssa_articles/speeds-and-feeds-for-drilling-and-reaming-stainless-steels/",
  },
  {
    id: "material-stainless-clean",
    title: "General principles of machining stainless steels",
    publisher: "British Stainless Steel Association",
    url: "https://bssa.org.uk/bssa_articles/general-principles-of-machining-stainless-steels/",
  },
  {
    id: "material-copper-cut",
    title: "Selecting copper alloys for fabricability",
    publisher: "Copper Development Association",
    url: "https://www.copper.org/publications/pub_list/pdf/7014.pdf",
  },
  {
    id: "material-c110",
    title: "C11000 Electrolytic Tough Pitch copper",
    publisher: "Copper Development Association",
    url: "https://alloys.copper.org/alloy/C11000",
  },
  {
    id: "material-leadfree",
    title: "ECO BRASS lead-free copper alloys",
    publisher: "Mitsubishi Materials",
    url: "https://www.mitsubishi-copper.com/en/products/ecobrass.html",
  },
  {
    id: "material-lead",
    title: "Information for workers exposed to lead",
    publisher: "CDC / NIOSH",
    url: "https://www.cdc.gov/niosh/lead/prevention/information-for-workers.html",
  },
  {
    id: "material-plastic-machining",
    title: "Machining recommendations for engineering plastics",
    publisher: "Ensinger",
    url: "https://www.ensingerplastics.com/-/media/ensinger/files/document-teaser-files/brochures/shapes/xxold-machining-guidelines-semi-finished-plastics-en.pdf",
  },
  {
    id: "material-plastic-faq",
    title: "Machinable plastics: heat, moisture and dimensional stability",
    publisher: "Ensinger",
    url: "https://www.ensingerplastics.com/en/faq",
  },
  {
    id: "material-pom-c",
    title: "TECAFORM AH natural: unfilled POM-C",
    publisher: "Ensinger",
    url: "https://www.ensingerplastics.com/en/shapes/acetal-tecaform-ah-natural",
  },
  {
    id: "material-pom-handling",
    title: "TECAFORM AH Product Handling Information Sheet",
    publisher: "Ensinger",
    url: "https://www.ensinger-online.com/modules/nonpublic/sheetreach/SH_TECAFORM%20AH_en_04_1.pdf",
  },
  {
    id: "material-pa6",
    title: "TECAMID 6 natural: PA6 stock-shape datasheet",
    publisher: "Ensinger",
    url: "https://www.ensinger-online.com/modules/public/sheet/createsheet.php?FILENAME=TECAMID+6+natural.PDF&FL=0&SID=2133",
  },
  {
    id: "material-iron-tools",
    title: "Machining guide: scope specific to Dura-Bar grades",
    publisher: "Dura-Bar",
    url: "https://www.dura-bar.com/getmedia/1c401b8b-2d3f-4905-9cfa-0cecef9f7f36/machining-guide-0719.pdf?ext=.pdf",
  },
  {
    id: "material-foundry-dust",
    title: "Foundries: advice on dust and silica control",
    publisher: "UK Health and Safety Executive",
    url: "https://www.hse.gov.uk/pubns/guidance/fd0.pdf",
  },
  {
    id: "material-dust",
    title: "Combustible dust",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/chemicals/combustible_dust.html",
  },
  {
    id: "material-ti-machining",
    title: "Titanium design and fabrication: machining",
    publisher: "TIMET",
    url: "https://www.timet.com/assets/local/documents/technicalmanuals/DesignandFabrication.pdf",
  },
  {
    id: "material-ti-safety",
    title: "Safety information: unalloyed titanium grades",
    publisher: "Alleima",
    url: "https://www.alleima.com/en/technical-center/safety-information-sheets-sis/unalloyed-titanium-grades/",
  },
];

export const materialGuides: MaterialGuide[] = [
  {
    id: "aluminium",
    name: t("Алюміній: 6061 / 6082-T6", "Aluminium: 6061 / 6082-T6"),
    level: "beginner",
    grades: t(
      "Прокат EN AW-6061-T6 або EN AW-6082-T6 з відомим станом. Це різні сплави; м’який алюміній невідомої марки й кремнисті виливки потребують іншої карти.",
      "Identified wrought EN AW-6061-T6 or EN AW-6082-T6. These are distinct alloys; unknown soft aluminium and high-silicon castings need a different process sheet.",
    ),
    summary: t(
      "Добрий початок для площин, втулок і простих кишень. Головне — гостра крайка, вільний вихід стружки та відсутність налипання; дзеркальний блиск сам по собі не означає точності.",
      "A practical start for faces, sleeves and simple pockets. Prioritise a sharp edge, chip clearance and freedom from adhesion; a mirror-like shine does not establish accuracy.",
    ),
    behaviour: [
      t(
        "Налиплий на інструмент метал може дряпати вже готову поверхню та змінювати ефективний розмір крайки.",
        "Adhered metal can scratch the finished surface and change the effective cutting edge.",
      ),
      t(
        "Тонкі стінки легко віджимаються й деформуються від затиску; залишайте чистовий запас до контролю вільної деталі.",
        "Thin walls deflect and distort under clamping; retain finishing stock until free-state inspection.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "Підтвердьте T6 за документом, видаліть бруд і перевірте припуск. Для кишені підтримайте A по площі; змоделюйте головки притисків і тримач.",
        "Confirm T6 from documentation, clean the stock and check allowances. Support A across the pocket area and model clamp heads and holder.",
      ),
      t(
        "Оберіть сумісну з алюмінієм мастильно-охолоджувальну рідину за її виробником; перевірте подачу до різання. Не застосовуйте легкозаймистий побутовий розчинник як охолодження.",
        "Select aluminium-compatible cutting fluid under its maker’s instructions and verify delivery before cutting. Do not substitute a flammable household solvent.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "Гостро заточений HSS для малого верстата або полірована позитивна твердосплавна пластина групи N; коротка державка.",
          "Sharp HSS on a small lathe or a polished positive-rake N-group carbide insert in a short holder.",
        ],
        [
          "Інструмент по осі; готовий діаметр повторно затискають у розточених м’яких кулачках, перевіряючи биття.",
          "Set the edge on centre; remount finished diameters in bored soft jaws and check runout.",
        ],
        [
          "Залиште 0,20 мм по діаметру на навчальному зразку; виміряйте після проміжного проходу й лише тоді призначте останнє зняття.",
          "Retain 0.20 mm on diameter on the learning coupon; measure after an intermediate pass before assigning final removal.",
        ],
        [
          "Можливі довгі світлі стрічки; їхню форму контролює геометрія та робочий діапазон стружколама.",
          "Long bright ribbons are possible; geometry and the chipbreaker’s operating range determine control.",
        ],
        [
          "Рівномірний слід подачі, без виривів і випадкових глибоких рисок; діаметр підтверджений мікрометром.",
          "Even feed marks without tearing or random deep scratches; verify diameter with a micrometer.",
        ],
        [
          "Не тріть затупленою пластиною й не зменшуйте подачу до полірування замість різання.",
          "Avoid rubbing with a dull insert or reducing feed until the tool polishes rather than cuts.",
        ],
      ),
      method(
        "milling",
        [
          "Коротка 2–3-зуба фреза для алюмінію з полірованими канавками; справна цанга, чистий хвостовик.",
          "Short aluminium-specific 2–3-flute end mill with polished flutes; sound collet and clean shank.",
        ],
        [
          "Плоска опора під деталлю, притиски над підтримкою; ручний верстат із люфтом потребує окремого вибору напрямку подачі.",
          "Flat backing with clamps over support; separately choose feed direction on a backlash-prone manual mill.",
        ],
        [
          "Спершу відкрийте вихід стружки; у кишені залиште 0,20 мм на кожній стінці й 0,20 мм по дну для окремого фінішу.",
          "Establish chip exit first; retain 0.20 mm per pocket wall and 0.20 mm on the floor for separate finishing.",
        ],
        [
          "Короткі завитки бажані; злиплі грудки у канавках означають втрату відведення, а не нормальну роботу.",
          "Discrete curls are useful; packed lumps in flutes indicate failed evacuation rather than normal cutting.",
        ],
        [
          "Площина без повторно врізаної стружки; дно й стінки виміряні окремо.",
          "A face free of recut-chip damage, with floor and walls measured separately.",
        ],
        [
          "Не заповнюйте канавки повним пазом і не очищуйте їх пальцями чи повітрям у бік людей.",
          "Avoid flute packing in full-width slots and do not clear them by hand or blow chips towards people.",
        ],
      ),
      method(
        "drilling",
        [
          "Гостре HSS або твердосплавне свердло для алюмінію з просторими полірованими канавками; короткий виліт.",
          "Sharp aluminium-suitable HSS or carbide drill with generous polished flutes and short projection.",
        ],
        [
          "Жорстке кріплення, контроль биття, жертовна підкладка з виходом під вістря.",
          "Rigid retention, runout check and sacrificial backing with drill-point clearance.",
        ],
        [
          "Підведіть рідину до канавок; цикл виходу для стружки виберіть за довжиною й типом свердла, зменшіть навантаження біля виходу.",
          "Deliver fluid to the flutes; select chip-clearing cycles for drill type/depth and reduce breakthrough loading.",
        ],
        [
          "Дві канавки мають виводити стружку без затору; одна забита канавка може розбити отвір.",
          "Both flutes should evacuate freely; one packed flute can enlarge or damage the hole.",
        ],
        [
          "Отвір проходить заданим калібром після дебурення; вхідна фаска не приховує розбиття.",
          "The deburred hole meets the chosen gauge checks; its entry chamfer does not conceal enlargement.",
        ],
        [
          "Не вважайте діаметр свердла фактичним діаметром отвору й не тримайте пластину рукою.",
          "Do not equate drill diameter with measured hole size or hold a plate by hand.",
        ],
      ),
      method(
        "finishing",
        [
          "Ручний дебурер і дрібний абразив на твердій підкладці; для точного фінішу — гострий різальний інструмент.",
          "Hand deburrer and fine abrasive on a rigid backing; use a sharp cutting tool for dimensional finishing.",
        ],
        [
          "Деталь знята й нерухома; вимірювальні бази захищені від завалювання.",
          "Remove and immobilise the part; protect measurement datums against rounding.",
        ],
        [
          "Зніміть лише задирку, очистіть сумісним засобом; декоративне анодування плануйте до призначення остаточних посадок.",
          "Remove only burrs and clean compatibly; plan decorative anodising before specifying final fits.",
        ],
        [
          "Дрібний абразивний пил збирають окремо від великої стружки належною системою.",
          "Collect fine abrasive dust separately from bulk chips using suitable equipment.",
        ],
        [
          "Без гострих ребер і замазаних рисок; покриття може змінити розмір та відтінок.",
          "Edges are safe without smeared-over scratches; coatings may change dimensions and colour.",
        ],
        [
          "Не шліфуйте посадку до блиску без вимірювання; не обіцяйте однаковий декоративний колір 6061 і 6082.",
          "Do not sand a fit to a shine without measurement or promise matching decorative colour for 6061 and 6082.",
        ],
      ),
    ],
    defects: [
      defect(
        [
          "Рвана матова смуга, метал на крайці.",
          "Torn dull band and metal on the edge.",
        ],
        [
          "Наріст, затуплення або недостатнє змащення.",
          "Built-up edge, dullness or inadequate lubrication.",
        ],
        [
          "Після зупинки огляньте крайку під збільшенням і подачу рідини.",
          "After stopping inspect the edge under magnification and verify fluid delivery.",
        ],
        [
          "Очистіть/замініть крайку за процедурою; перевірте N-геометрію й режим у її каталозі.",
          "Clean/replace the edge as prescribed; verify N geometry and its catalogue operating range.",
        ],
      ),
      defect(
        ["Випадкові глибокі подряпини на дні.", "Random deep floor scratches."],
        ["Повторне різання затриманої стружки.", "Recutting retained chips."],
        [
          "Огляньте канавки, кишеню й напрямок потоку після зупинки.",
          "After stopping inspect flutes, pocket and fluid direction.",
        ],
        [
          "Відновіть вихід, очистіть і повторно оцініть припуск перед фінішем.",
          "Restore evacuation, clean and reassess remaining stock before finishing.",
        ],
      ),
      defect(
        ["Розмір змінюється після зняття.", "Size changes after release."],
        ["Деформація затиску або нагрів.", "Clamping distortion or heating."],
        [
          "Порівняйте затиснуту/вільну деталь й температуру.",
          "Compare clamped/free readings and temperature.",
        ],
        [
          "Підтримайте ближче до сили, зменшіть деформацію й завершіть після стабілізації.",
          "Improve support under the force, reduce distortion and finish after stabilisation.",
        ],
      ),
      defect(
        ["Великий вихідний задирок отвору.", "Large hole-exit burr."],
        [
          "Непідтриманий вихід чи зношене свердло.",
          "Unsupported breakthrough or a worn drill.",
        ],
        [
          "Перевірте зазор підкладки та стан обох крайок.",
          "Check backing clearance and both cutting lips.",
        ],
        [
          "Відновіть підтримку й контроль виходу; виміряйте отвір після видалення задирки.",
          "Restore support and breakthrough control; measure after deburring.",
        ],
      ),
    ],
    exercises: [
      exercise(
        [
          "Дві однакові втулки без слідів затиску",
          "Two matching spacers without jaw marks",
        ],
        [
          "Виготовити дві навчальні 6061-T6 втулки Ø20 ×15 з отвором8,5; порівняти повторну посадку.",
          "Make two learning 6061-T6 spacers Ø20 ×15 with an8.5 bore; compare remounting.",
        ],
        [
          "Два відрізки 6061-T6 Ø25 ×45 мм; додатковий матеріал потрібен для захвату.",
          "Two 6061-T6 Ø25 ×45 mm blanks; extra length provides gripping stock.",
        ],
        [
          [
            "Токарний, N-пластина/HSS, свердло8,5, м’які кулачки, мікрометр і калібри.",
            "Lathe, N insert/HSS,8.5 drill, soft jaws, micrometer and gauges.",
          ],
        ],
        [
          step(
            ["Карта й захват", "Plan and retain"],
            [
              "Візьміть повний маршрут spacer: перевірте захват сирого Ø25 і підготуйте розточені кулачки під готовий Ø20.",
              "Use the full spacer route: qualify raw Ø25 gripping and prepare bored jaws for finished Ø20.",
            ],
            [
              "Ключ прибраний, усі вильоти й зазори перевірені.",
              "Key removed, projections and clearances verified.",
            ],
          ),
          step(
            ["Перше встановлення", "First setup"],
            [
              "Створіть A, обробіть Ø20 із0,20 мм по діаметру перед фінішем, просвердліть наскрізь за маршрутом.",
              "Create A, turn Ø20 retaining0.20 mm on diameter before finishing and drill through under the route.",
            ],
            [
              "Проміжний діаметр виміряний, стружка не забиває свердло.",
              "Intermediate diameter measured; the drill is not packing.",
            ],
          ),
          step(
            ["Перенесення", "Transfer"],
            [
              "Відокремте заготовку за маршрутом із запасом; зніміть задирки, очистіть A й посадіть у м’які кулачки.",
              "Separate under the route with length stock; deburr, clean A and seat in soft jaws.",
            ],
            [
              "Контакт A і биття підтверджені до фінішу.",
              "Verify A seating and runout before finishing.",
            ],
          ),
          step(
            ["Остаточна довжина", "Final length"],
            [
              "Доведіть до15,00 мм; статично оформіть фаскиC0,3–0,5 без округлення A. Повторіть для другої деталі.",
              "Finish15.00 mm and statically formC0.3–0.5 chamfers without rounding A. Repeat for the second part.",
            ],
            [
              "Кожну втулку приймають окремо, а не за налаштуванням першої.",
              "Accept each spacer individually rather than from the first setting.",
            ],
          ),
          step(
            ["Порівняння", "Compare"],
            [
              "Після стабілізації виміряйте кожний діаметр у двох напрямках і на двох перерізах; порівняйте довжини.",
              "After stabilisation measure each diameter in two directions at two sections and compare lengths.",
            ],
            [
              "Запишіть усі значення й фото поверхонь за одного світла.",
              "Record all readings and surface photos under the same light.",
            ],
          ),
        ],
        [
          "Дві невідповідальні проставки з чистою поверхнею; блиск може різнитися, розміри мають відповідати карті.",
          "Two noncritical spacers with clean surfaces; gloss may vary while dimensions must meet the sheet.",
        ],
        [
          [
            "Ø19,98–20,00; L14,97–15,03; отвір8,50–8,60 мм.",
            "Ø19.98–20.00; L14.97–15.03; bore8.50–8.60 mm.",
          ],
          [
            "Мікрометр, контрольні пробки/придатний нутромір; щонайменше два повтори.",
            "Micrometer and checking plugs/suitable bore gauge; at least two repeats.",
          ],
        ],
        ["spacer"],
      ),
      exercise(
        [
          "Монтажна пластина: чотири виходи без задирок",
          "Mounting plate: four clean breakthroughs",
        ],
        [
          "Порівняти отвори й площину 6082-T6 за повним маршрутом fixture-plate.",
          "Compare holes and face quality in6082-T6 using the full fixture-plate route.",
        ],
        [
          "6082-T6 84 ×54 ×14 мм, готовий габарит80 ×50 ×10.",
          "6082-T6 84 ×54 ×14 mm, finished envelope80 ×50 ×10.",
        ],
        [
          [
            "Фрезерний із DRO, алюмінієва фреза, свердло6,6, підкладка, штифти й висотомір.",
            "Mill with DRO, aluminium end mill,6.6 drill, backing, pins and height gauge.",
          ],
        ],
        [
          step(
            ["Бази", "Datums"],
            [
              "За шістьма окремими встановленнями маршруту створіть A/B/C і габарит; прийміть вільну деталь.",
              "Create A/B/C and envelope using the route’s six separate setups; inspect free-state size.",
            ],
            [
              "Товщина9,97–10,03 мм, довжина/ширина±0,05.",
              "Thickness9.97–10.03 mm, length/width±0.05.",
            ],
          ),
          step(
            ["Підкладка", "Backing"],
            [
              "Виготовте зазначену плиту з виходами під отвори; очистіть і незалежно відновіть нуль.",
              "Make the specified carrier with hole-exit reliefs; clean and independently recover the origin.",
            ],
            [
              "Свердло й вістря не торкаються столу або паралелей.",
              "Drill and point clear table and parallels.",
            ],
          ),
          step(
            ["Координати", "Coordinates"],
            [
              "Розмістіть центри(15;10),(65;10),(15;40),(65;40) мм; перевірте крайовий відступ до свердління.",
              "Locate centres(15,10),(65,10),(15,40),(65,40) mm and check edge distances before drilling.",
            ],
            [
              "Координати перевірені від B/C, а не одна від одної.",
              "Verify coordinates from B/C rather than chaining holes.",
            ],
          ),
          step(
            ["Свердління", "Drill"],
            [
              "Просвердліть6,6 із підтримкою й контрольованим виходом; після зняття статично приберіть нижні задирки.",
              "Drill6.6 with support and controlled breakthrough; statically deburr underside after removal.",
            ],
            [
              "Канавки вільні; після зупинки оглянуті чотири виходи.",
              "Flutes remain clear; inspect all four exits after stopping.",
            ],
          ),
          step(
            ["Приймання", "Accept"],
            [
              "Повторно перевірте товщину, Ø та координати кожного отвору; порівняйте вигляд входу/виходу.",
              "Recheck thickness, diameter and each hole coordinate; compare entry and exit appearance.",
            ],
            [
              "Межі координат±0,05 мм перевірені придатним методом.",
              "Verify±0.05 mm coordinates with a suitable method.",
            ],
          ),
        ],
        [
          "Пластина з чотирма виміряними отворами й без виступаючих вихідних задирок.",
          "A plate with four measured holes and no raised exit burrs.",
        ],
        [
          [
            "Отвори6,60–6,75 мм; координати й габарит — за таблицею проєкту.",
            "Holes6.60–6.75 mm; coordinates and envelope follow the project table.",
          ],
        ],
        ["fixture-plate"],
      ),
    ],
    finishing: [
      t(
        "Для видимого фінішу застосовуйте однаковий напрямок останнього проходу й освітлення фото; гладкість перевіряють окремо від геометрії.",
        "For appearance, keep final-pass direction and photographic lighting consistent; assess smoothness separately from geometry.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Тонкий алюмінієвий пил і дрібна стружка можуть горіти: не змішуйте з іскрами шліфування, контролюйте накопичення та користуйтеся системою збору, призначеною для цього пилу. Побутовий пилосос непридатний.",
        "Fine aluminium dust/chips can burn: separate them from grinding sparks, control accumulations and use collection equipment designed for that dust. A household vacuum is unsuitable.",
      ),
    ],
    sources: [
      "material-hydro",
      "material-alu-tools",
      "material-milling",
      "material-drilling",
      "material-dust",
    ],
    appearance: {
      color: "#c2c9ce",
      metalness: 0.85,
      roughness: 0.3,
      chip: "ribbon",
    },
  },
  {
    id: "carbon-steel",
    name: t("Вуглецева сталь: C45 +N", "Carbon steel: C45 +N"),
    level: "intermediate",
    grades: t(
      "Основний приклад — C45 у нормалізованому стані +N. C45 є середньовуглецевою сталлю, не «м’якою» низьковуглецевою. S235 та загартована C45 потребують окремих даних інструмента.",
      "The main example is normalised C45 +N. C45 is medium-carbon steel, not low-carbon mild steel. S235 and hardened C45 require separate tool data.",
    ),
    summary: t(
      "Валики, шпонки та проставки з контрольованою геометрією. Спочатку підтвердьте твердість і стан; головні обмеження — сили різання, віджим, тепло й контроль довгої стружки.",
      "Shafts, keys and spacers with controlled geometry. Establish hardness and condition first; cutting force, deflection, heat and long-chip control govern the process.",
    ),
    behaviour: [
      t(
        "Прокатна окалина й тверді ділянки можуть пошкодити чистову крайку; відокремте зняття шкірки від фінішу.",
        "Mill scale and hard areas can damage a finishing edge; separate skin removal from finishing.",
      ),
      t(
        "Однакове положення супорта не гарантує однаковий діаметр на довгому виступі: сила різання відхиляє заготовку й інструмент.",
        "The same slide position does not guarantee equal diameter along an overhang: force deflects work and tool.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "Перевірте сертифікат +N і доступну перевірку твердості; не переносіть режим +N на +QT або поверхнево загартований вал.",
        "Confirm +N certification and available hardness evidence; do not transfer +N data to +QT or a surface-hardened shaft.",
      ),
      t(
        "Виділіть інструмент для окалини; для довгого вала сплануйте придатну опору без затиску тонкої готової шийки навмання.",
        "Reserve an edge for scale; plan suitable long-shaft support rather than arbitrarily gripping a thin finished journal.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "HSS із гострою крайкою для невеликої потужності або позитивна P-пластина з відповідним стружколамом; жорстка коротка державка.",
          "Sharp HSS for limited-power work or a positive P-group insert with a suitable chipbreaker, in a short rigid holder.",
        ],
        [
          "Крайка по осі; мінімальний робочий виліт. Окремо перевірте, чи потрібна задня бабка/люнет для конкретної довжини.",
          "Set the edge on centre with minimum usable overhang; separately qualify tailstock/steady support for the actual length.",
        ],
        [
          "Чорново залишайте0,20 мм по діаметру контрольної шийки; після проміжного проходу виміряйте біля обох кінців і посередині.",
          "Retain0.20 mm on a test-journal diameter; after an intermediate pass measure near both ends and in the middle.",
        ],
        [
          "Можлива гаряча суцільна спіраль; коротка контрольована стружка залежить від діапазону стружколама, не лише від оборотів.",
          "Hot continuous spirals are possible; controlled chips depend on chipbreaker range rather than spindle speed alone.",
        ],
        [
          "Паралельна шийка з рівним слідом подачі, без періодичних хвиль; приймання мікрометром.",
          "A parallel journal with even feed marks and no periodic waves; accept using a micrometer.",
        ],
        [
          "Не робіть пружинних проходів без вимірювання й не намотуйте абразивну стрічку навколо обертового вала.",
          "Avoid unmeasured spring passes and never wrap abrasive strip around a rotating shaft.",
        ],
      ),
      method(
        "milling",
        [
          "Коротка HSS-Co фреза або покрита твердосплавна фреза для сталі; цанговий/штатний тримач із перевіреним биттям.",
          "Short HSS-Co or coated carbide steel end mill in an approved holder with verified runout.",
        ],
        [
          "Лещата, парні паралелі й упор; вузьку шпонку підтримуйте по довжині, торці фрезеруйте при горизонтальній A.",
          "Use a vice, matched parallels and stop; support a narrow key along its length and mill ends with A horizontal.",
        ],
        [
          "Для ширини9,980–10,000 мм залиште10,20 після чорнової, потім проміжний вимір і ціль9,990.",
          "For9.980–10.000 mm width retain10.20 after roughing, then measure before targeting9.990.",
        ],
        [
          "Стружка темнішає від тепла; її колір не є точним термометром чи підтвердженням дозволеного режиму.",
          "Chips may darken with heat; colour is neither a calibrated thermometer nor process approval.",
        ],
        [
          "Вільна шпонка не вигинається й має повторювану ширину в кількох перерізах.",
          "The released key remains straight with repeatable width at multiple sections.",
        ],
        [
          "Не компенсуйте віджим сильнішим затиском і не обирайте попутне різання на люфтовому ручному верстаті без перевірки.",
          "Do not hide deflection with stronger clamping or choose climb milling on a backlash-prone manual mill without qualification.",
        ],
      ),
      method(
        "drilling",
        [
          "Коротке HSS/HSS-Co свердло для незагартованої сталі; твердосплавне — лише за достатньої жорсткості.",
          "Short HSS/HSS-Co drill for unhardened steel; carbide requires sufficient system rigidity.",
        ],
        [
          "Точна прив’язка центра, затиск і підкладка; перевірте висоту деталі та запас виходу вістря.",
          "Locate the centre, clamp and back the work; verify thickness and drill-point exit clearance.",
        ],
        [
          "Подавайте придатну рідину, виводьте стружку за циклом виробника. Для посадки свердління є підготовкою, остаточний розмір задає розточування/розгортка.",
          "Use suitable fluid and maker-defined chip-clearing cycles. For a fit, drilling prepares the hole; boring/reaming establishes final size.",
        ],
        [
          "Гарячі спіралі та уламки біля виходу; прибирайте тільки після зупинки.",
          "Hot spirals and breakout fragments; clear only after stopping.",
        ],
        [
          "Розмір і положення перевірені окремо; контрольний штифт не повинен спиратися на задирку.",
          "Verify size and position separately; a checking pin must not seat on a burr.",
        ],
        [
          "Не свердліть невідому загартовану ділянку зі зростаючим зусиллям при відсутності стружки.",
          "Do not increase force into an unknown hardened area when the drill produces no chips.",
        ],
      ),
      method(
        "finishing",
        [
          "Різальна чистова крайка, ручний дебурер, дрібний камінь лише для виступаючого задирка.",
          "Finishing cutting edge, hand deburrer and a fine stone only for raised burrs.",
        ],
        [
          "Статичне утримання поза обертанням; опорні бази зберігають плоскими.",
          "Immobilise away from rotation and preserve flat datums.",
        ],
        [
          "Зніміть ребра й залишки рідини, висушіть; для зберігання нанесіть сумісний антикорозійний засіб поза вимірювальним контактом.",
          "Deburr, remove fluid and dry; apply compatible corrosion protection for storage, clear of measurement contacts.",
        ],
        [
          "Абразивний пил не повинен потрапляти у напрямні чи вимірювальні прилади.",
          "Keep abrasive dust out of ways and measuring instruments.",
        ],
        [
          "Чиста металева поверхня без задирок; плями іржі не приховані поліруванням.",
          "A clean burr-free surface without polishing over rust pits.",
        ],
        [
          "Не змінюйте точний розмір наждачним папером навмання; термообробка після фінішу потребує нового маршруту.",
          "Do not alter precision size with arbitrary sanding; post-finish heat treatment requires a new route.",
        ],
      ),
    ],
    defects: [
      defect(
        ["Діаметр конічний.", "Tapered diameter."],
        [
          "Віджим, невиставлена геометрія або зміна сили.",
          "Deflection, alignment error or changing force.",
        ],
        [
          "Порівняйте три перерізи; перевірте виліт, геометрію й опору.",
          "Compare three sections and check overhang, alignment and support.",
        ],
        [
          "Усуньте причину до чистового проходу; не виправляйте конус випадковим ручним підтисканням.",
          "Correct the cause before finishing rather than applying arbitrary hand pressure.",
        ],
      ),
      defect(
        [
          "Хвиля й дзвін при фрезеруванні.",
          "Waves and ringing during milling.",
        ],
        [
          "Вібрація довгого інструмента або слабке утримання.",
          "Long-tool vibration or inadequate retention.",
        ],
        [
          "Огляньте контакт A, виліт і затягування за OEM.",
          "Inspect A contact, projection and OEM-compliant retention.",
        ],
        [
          "Скоротіть виліт, відновіть опору й перегляньте залучення зубів за каталогом.",
          "Shorten projection, restore support and review engagement under tool guidance.",
        ],
      ),
      defect(
        ["Наріст і розмазаний фініш.", "Built-up edge and smeared finish."],
        [
          "Затуплення чи невідповідний діапазон різання.",
          "Dullness or an unsuitable cutting range.",
        ],
        [
          "Перевірте крайку, матеріальний стан та фактичну подачу.",
          "Check edge, material condition and actual feed.",
        ],
        [
          "Замініть крайку/геометрію й поверніться до даних точної марки сталі.",
          "Change edge/geometry and return to data for the exact steel condition.",
        ],
      ),
      defect(
        [
          "Точний розмір змінився після охолодження.",
          "Precision size changed after cooling.",
        ],
        [
          "Фініш і контроль виконані на нагрітій деталі.",
          "Finishing and inspection were performed hot.",
        ],
        [
          "Повторіть вимір після термостабілізації тим самим приладом.",
          "Repeat with the same instrument after temperature stabilisation.",
        ],
        [
          "Плануйте час охолодження до останнього виміру та залишайте запас на фініш.",
          "Allow stabilisation before final measurement and preserve finishing stock.",
        ],
      ),
    ],
    exercises: [
      exercise(
        [
          "Ступінчастий вал із перевіркою конуса",
          "Stepped shaft with a taper check",
        ],
        [
          "Повний stepped-shaft із C45 +N: Ø20 і Ø14 по30 мм, L60; невідповідальний настільний зразок.",
          "Full stepped-shaft in C45 +N: Ø20 andØ14,30 mm each, L60; noncritical bench sample.",
        ],
        [
          "C45 +N Ø25 ×90 мм, стан підтверджений.",
          "Verified C45 +N Ø25 ×90 mm.",
        ],
        [
          [
            "Токарний, P-інструмент/HSS, індикатор, розточені кулачки, мікрометр0–25.",
            "Lathe, P tool/HSS, indicator, bored jaws and0–25 micrometer.",
          ],
        ],
        [
          step(
            ["Перша база", "First datum"],
            [
              "Виконайте S1 маршруту: спочатку фізичний торець E й малу шийку; вісь B не плутайте з другим торцем.",
              "Follow route S1: create physical end E and the small journal first; B is the axis, not the opposite end.",
            ],
            [
              "Довжина й захват сирого прутка дозволяють усі переходи.",
              "Raw length and engagement permit every operation.",
            ],
          ),
          step(
            ["Припуск", "Allowance"],
            [
              "На шийках залиште0,20 мм по діаметру; перевірте їх у трьох перерізах перед останнім проходом.",
              "Retain0.20 mm on journal diameters and check three sections before the final pass.",
            ],
            [
              "Залишок названо по діаметру, не на радіус.",
              "Stock is stated on diameter rather than radius.",
            ],
          ),
          step(
            ["Перестановка", "Remount"],
            [
              "За S2 очистіть, посадіть Ø20 у кулачки із проходом для Ø14; перевірте биття й опорний торець.",
              "Under S2 clean and seatØ20 in jaws with clearance forØ14; verify runout and axial seating.",
            ],
            [
              "Ø14 не затиснутий і не є випадковим упором.",
              "Ø14 is neither gripped nor an unintended stop.",
            ],
          ),
          step(
            ["Довжина", "Length"],
            [
              "Обробіть A доL60,00 та довжини великої шийки30,00; статично зніміть задирки.",
              "Finish A toL60.00 and the large-journal length30.00; deburr statically.",
            ],
            [
              "Вимірювальні торці чисті й без округлення.",
              "Measurement end faces remain clean and unrounded.",
            ],
          ),
          step(
            ["Карта контролю", "Inspection record"],
            [
              "Після стабілізації виміряйте шийки в двох напрямках на трьох перерізах; порівняйте діапазон кожної.",
              "After stabilisation measure both journals in two directions at three sections and compare their spreads.",
            ],
            [
              "Відхилення не приховані середнім значенням.",
              "Do not hide deviations in an average.",
            ],
          ),
        ],
        [
          "Складена карта діаметрів показує можливий конус і овальність; вал не приймається лише за виглядом.",
          "The diameter map exposes possible taper and ovality; appearance alone does not accept the shaft.",
        ],
        [
          [
            "Ø19,980–20,000 і13,980–14,000 мм; L59,95–60,05; решта ознак — за проєктом.",
            "Ø19.980–20.000 and13.980–14.000 mm; L59.95–60.05; other features follow the project.",
          ],
        ],
        ["stepped-shaft"],
      ),
      exercise(
        [
          "Шпонка: ширина до й після звільнення",
          "Key: width before and after release",
        ],
        [
          "Виконати alignment-key з C45 +N без післяфінішного гартування.",
          "Make alignment-key in C45 +N without post-finish hardening.",
        ],
        [
          "C45 +N 84 ×14 ×12 мм для80 ×10 ×8.",
          "C45 +N 84 ×14 ×12 mm for80 ×10 ×8.",
        ],
        [
          [
            "Фрезерний, коротка сталева фреза, підтримувальна плита, мікрометр і штифти.",
            "Mill, short steel end mill, support carrier, micrometer and pins.",
          ],
        ],
        [
          step(
            ["Шість площин", "Six faces"],
            [
              "Створіть A/B/C за маршрутом; торці обробіть збоку при горизонтальній A.",
              "Create A/B/C under the route and side mill ends with A horizontal.",
            ],
            [
              "Кінець виступає за губки, захват і габарит тримача перевірені.",
              "End projects beyond jaws; engagement and holder clearance are verified.",
            ],
          ),
          step(
            ["Чорнова ширина", "Rough width"],
            [
              "Після чорнової залиште10,20 мм; перевірте контакт опор і стан фрези.",
              "Retain10.20 mm after roughing; check support contact and the cutter.",
            ],
            [
              "Деталь не прогинається між опорами.",
              "The work does not bend between supports.",
            ],
          ),
          step(
            ["Чистова ширина", "Finish width"],
            [
              "Виміряйте проміжну ширину в шести точках і доведіть до9,990 мм без довільного додаткового проходу.",
              "Measure six intermediate width locations and target9.990 mm without an arbitrary extra pass.",
            ],
            [
              "Ціль у полі9,980–10,000 мм.",
              "Target lies within9.980–10.000 mm.",
            ],
          ),
          step(
            ["Отвори", "Holes"],
            [
              "Перенесіть на зроблену опору й виконайте дваØ3,4 за координатами проєкту, з підтриманим виходом.",
              "Transfer to the made support and drill bothØ3.4 holes at the project coordinates with backed breakthrough.",
            ],
            [
              "Після перенесення X/Y відновлені від C/B.",
              "Recover X/Y from C/B after transfer.",
            ],
          ),
          step(
            ["Повторний вимір", "Repeat inspection"],
            [
              "Очистіть і повторіть ширину у вільному стані після стабілізації; запишіть діапазон.",
              "Clean and repeat free-state width after stabilisation; record the spread.",
            ],
            [
              "Кожна точка відповідає межам, а не лише середня.",
              "Each point meets the interval rather than only the average.",
            ],
          ),
        ],
        [
          "Рівна навчальна напрямна із зафіксованою зміною ширини після звільнення.",
          "A straight learning guide with documented width change after release.",
        ],
        [
          [
            "Ширина9,980–10,000 мм; висота, довжина й отвори — за alignment-key.",
            "Width9.980–10.000 mm; height, length and holes follow alignment-key.",
          ],
        ],
        ["alignment-key"],
      ),
    ],
    finishing: [
      t(
        "Захищайте від корозії тільки після очищення та контролю. Наведені вправи не включають гартування, цементацію чи нанесення розмірного покриття.",
        "Protect against corrosion after cleaning and inspection. These exercises exclude hardening, case treatment and dimensional coatings.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Гаряча сталева спіраль може різати й затягуватися в патрон; зупиніть роботу за втрати контролю стружки. Не ламайте її руками чи гачком при обертанні.",
        "Hot steel spirals can cut and enter the chuck; stop if chip control is lost. Do not break them by hand or with a hook during rotation.",
      ),
    ],
    sources: [
      "material-c45",
      "material-turning",
      "material-milling",
      "material-drilling",
    ],
    appearance: {
      color: "#8f969d",
      metalness: 0.82,
      roughness: 0.38,
      chip: "segmented",
    },
  },
  {
    id: "stainless",
    name: t("Нержавіюча сталь: 304 / 316L", "Stainless steel: 304 / 316L"),
    level: "intermediate",
    grades: t(
      "Аустенітні 304 / EN1.4301 та316L / EN1.4404 у підтвердженому стані постачання. Не переносіть сюди дані303, дуплексної чи загартованої мартенситної сталі.",
      "Austenitic304 / EN1.4301 and316L / EN1.4404 in a verified delivery condition. Do not transfer data from303, duplex or hardened martensitic stainless.",
    ),
    summary: t(
      "Стабільний різ гострою крайкою, короткий виліт і надійна подача рідини. Розтирання замість утворення стружки створює наклеп і ускладнює наступний прохід.",
      "Use a stable cut, sharp edge, short projection and reliable fluid delivery. Rubbing instead of producing chips work-hardens the surface and obstructs the next pass.",
    ),
    behaviour: [
      t(
        "Аустенітна сталь інтенсивно зміцнюється від деформації; не повертайте затуплене свердло в розполіровану ямку з більшим зусиллям.",
        "Austenitic steel strain-hardens strongly; do not force a dull drill back into a burnished depression.",
      ),
      t(
        "Гаряча довга стружка й налипання можуть виникати одночасно. Блиск не доводить відсутності наклепу.",
        "Hot long chips and adhesion can occur together. Shine does not prove freedom from work hardening.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "Відокремте щітки, абразиви й контактні підкладки від вуглецевої сталі; забруднення залізом може дати поверхневу іржу.",
        "Keep brushes, abrasives and contact liners separate from carbon-steel work; iron contamination can produce surface rust.",
      ),
      t(
        "Перевірте, що система охолодження доходить до крайки й дозволена для конкретного інструмента; концентрацію задає виробник рідини.",
        "Verify cutting-fluid delivery reaches the edge and suits the tool; the fluid maker defines concentration.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "Позитивна M-пластина з гострою крайкою й контрольованим зміцненням леза; HSS-Co допустимий для малої операції за його даними.",
          "Positive M-group insert with a sharp appropriately prepared edge; HSS-Co is possible for limited work under its own data.",
        ],
        [
          "Коротка державка, крайка по осі, підтримана заготовка; перевірте налипання після пробного різу.",
          "Short holder, on-centre edge and supported work; inspect adhesion after the first trial cut.",
        ],
        [
          "Залишайте запас під реальний чистовий зріз; не намагайтеся довести діаметр серією проходів, що лише труть.",
          "Preserve stock for a genuine finishing cut rather than repeated passes that only rub.",
        ],
        [
          "Довгі пружні гарячі стрічки; зупиніть роботу, якщо вони обмотують деталь.",
          "Long springy hot ribbons; stop if they wrap the work.",
        ],
        [
          "Суцільний рівний слід без намазування; фактичний діаметр стабільний після охолодження.",
          "Continuous even marks without smearing; diameter remains stable after cooling.",
        ],
        [
          "Не залишайте крайку стояти й терти в контакті; не задавайте надмірний натиск вручну.",
          "Avoid dwelling in rubbing contact or applying excessive manual pressure.",
        ],
      ),
      method(
        "milling",
        [
          "Коротка покрита твердосплавна фреза саме для аустенітної сталі; для меншої жорсткості — придатна HSS-Co.",
          "Short coated carbide end mill for austenitic steel; suitable HSS-Co is an option at lower rigidity.",
        ],
        [
          "Жорстка плоска підтримка й перевірений тримач; врахуйте ділянки входу та виходу зуба.",
          "Rigid flat support and a checked holder; account for tooth entry and exit.",
        ],
        [
          "Плануйте плавний вхід і сталу товщину стружки; охолодження/сухе різання погоджуйте з маркою фрези, не перемикайте навмання.",
          "Plan smooth entry and consistent chip thickness; match wet/dry operation to the cutter grade rather than switching arbitrarily.",
        ],
        [
          "Ламана або завита гаряча стружка; повторне різання залишає риски.",
          "Segmented or curled hot chips; recutting leaves scratches.",
        ],
        [
          "Чіткий край кишені без припаленої розмазаної смуги; розмір перевірений без затиску.",
          "A defined pocket edge without a burnished smeared band; verify free-state size.",
        ],
        [
          "Не робіть зупинок усередині врізання й не підміняйте жорсткість високою силою затиску.",
          "Avoid dwelling within engagement or substituting clamping force for rigidity.",
        ],
      ),
      method(
        "drilling",
        [
          "Гостре HSS-Co свердло з геометрією для304/316L або жорстко встановлене твердосплавне з придатним охолодженням.",
          "Sharp HSS-Co drill with304/316L geometry or a rigidly held carbide drill with suitable coolant delivery.",
        ],
        [
          "Короткий виліт, перевірене биття, нерухомий затиск і вихідна підкладка.",
          "Short projection, checked runout, fixed retention and exit backing.",
        ],
        [
          "Зберігайте справжній різ із подачею за каталогом. Для очищення канавок застосовуйте рекомендований цикл, без тривалого тертя на дні.",
          "Maintain chip formation at the catalogue feed. Clear flutes using the prescribed cycle without extended bottom dwell.",
        ],
        [
          "Пружні гарячі спіралі; втрата стружки при зростанні зусилля вимагає зупинки й перевірки.",
          "Springy hot spirals; rising force with no chips requires stopping and inspection.",
        ],
        [
          "Отвір без розполірованого звуження й вирваного виходу; контроль у двох напрямках.",
          "A hole without a burnished restriction or torn exit; inspect in two directions.",
        ],
        [
          "Не лікуйте наклеп більшою силою тупим свердлом і не тримайте заготовку рукою.",
          "Do not attack work hardening with greater force on a dull drill or hold the work by hand.",
        ],
      ),
      method(
        "finishing",
        [
          "Окремий чистий дебурер і абразив для нержавіючої; гостра чистова крайка.",
          "Dedicated clean stainless deburrer/abrasive and a sharp finishing edge.",
        ],
        [
          "Статичний затиск на чистій немаркованій опорі; захистіть вимірювальні бази.",
          "Static retention on a clean nonmarking support; protect measurement datums.",
        ],
        [
          "Приберіть задирки та всю рідину. Хімічну пасивацію виконує кваліфікований процес із власною картою, не саморобна суміш кислот.",
          "Remove burrs and all fluid. Chemical passivation requires a qualified separate process rather than an improvised acid mixture.",
        ],
        [
          "Шліфувальний пил контролюють витяжкою; не розносьте його сухим обдуванням.",
          "Control abrasive dust with extraction rather than dispersing it with air.",
        ],
        [
          "Чиста поверхня, без включених сталевих частинок; корозійну стійкість не сертифікують блиском.",
          "Clean surface without embedded steel particles; shine does not certify corrosion performance.",
        ],
        [
          "Не використовуйте забруднену сталеву щітку й не поліруйте за рахунок втрати допуску.",
          "Avoid contaminated steel brushes and polishing away the tolerance.",
        ],
      ),
    ],
    defects: [
      defect(
        [
          "Свердло пищить, блищить ямка, стружки немає.",
          "Drill squeals over a shiny depression without chips.",
        ],
        [
          "Тертя, знос і можливий наклеп.",
          "Rubbing, wear and possible work hardening.",
        ],
        [
          "Зупиніть, огляньте вістря й перевірте фактичну подачу та рідину.",
          "Stop, inspect the point and verify actual feed and fluid.",
        ],
        [
          "Відновіть гострий інструмент; спосіб проходження пошкодженого шару оберіть за реальною жорсткістю, без форсування.",
          "Restore a sharp tool and qualify how to cut the damaged layer for the actual rigidity, without forcing.",
        ],
      ),
      defect(
        [
          "Крайка з налиплим металом, рвана поверхня.",
          "Adhered metal on the edge and a torn surface.",
        ],
        [
          "Адгезія або невідповідна геометрія.",
          "Adhesion or unsuitable geometry.",
        ],
        [
          "Огляньте лезо й перевірте доставку рідини.",
          "Inspect the edge and check fluid delivery.",
        ],
        [
          "Змініть крайку/геометрію й перевірте режим M-групи.",
          "Change edge/geometry and verify the M-group operating range.",
        ],
      ),
      defect(
        [
          "Регулярні хвилі й вібрація стінки.",
          "Regular waves and wall vibration.",
        ],
        [
          "Виліт або недостатня підтримка.",
          "Excess projection or inadequate support.",
        ],
        [
          "Перевірте затиснуту й вільну деталь, тримач і опори.",
          "Check clamped/free work, holder and supports.",
        ],
        [
          "Скоротіть виліт, підтримайте масивну ділянку й переплануйте залучення.",
          "Shorten projection, support solid material and replan engagement.",
        ],
      ),
      defect(
        ["Іржаві цятки після очищення.", "Rust spots after cleaning."],
        [
          "Можливе забруднення вуглецевою сталлю або залишки рідини.",
          "Possible carbon-steel contamination or fluid residue.",
        ],
        [
          "Перевірте щітки, підкладки й записи очищення; зовнішній огляд не встановлює склад плями.",
          "Check brushes, liners and cleaning records; appearance alone does not identify the deposit.",
        ],
        [
          "Ізолюйте забруднений інструмент; очищення/пасивацію погодьте з вимогами деталі.",
          "Segregate contaminated tools and select cleaning/passivation to part requirements.",
        ],
      ),
    ],
    exercises: [
      exercise(
        [
          "304: контрольне свердління двох отворів",
          "304: two-hole drilling coupon",
        ],
        [
          "Навчитися помічати різ і тертя на простій пластині; це новий матеріал, не копія режимів aluminium fixture-plate.",
          "Distinguish cutting from rubbing on a simple plate; this changes material and does not copy aluminium fixture-plate settings.",
        ],
        [
          "304, попередньо оброблена пластина40 ×25 ×6 мм, габарит±0,10.",
          "304 pre-machined40 ×25 ×6 mm plate, envelope±0.10.",
        ],
        [
          [
            "Свердлильний/фрезерний, HSS-CoØ5,5, затиск, підкладка й штифти.",
            "Drill press/mill,Ø5.5 HSS-Co, clamps, backing and pins.",
          ],
        ],
        [
          step(
            ["Ідентифікація", "Identify"],
            [
              "Підтвердьте304 й виберіть дані саме цього свердла; запишіть режим, затиск і рідину.",
              "Confirm304 and select data for this exact drill; record schedule, retention and fluid.",
            ],
            [
              "Охолодження працює до контакту.",
              "Fluid delivery works before contact.",
            ],
          ),
          step(
            ["Бази й опора", "Datums and backing"],
            [
              "Покладіть широкою A на підкладку; від лівого C й переднього B задайте центри(10;12,5),(30;12,5).",
              "Seat broad A on backing; locate centres(10,12.5),(30,12.5) from left C/front B.",
            ],
            [
              "Широка площина не хитається, затиск не перетинає свердло.",
              "Broad face does not rock; clamps clear the drill.",
            ],
          ),
          step(
            ["Перший отвір", "First hole"],
            [
              "Просвердліть із реальною подачею й очищенням за виробником; за втрати стружки зупиніться.",
              "Drill with genuine feed and maker-defined clearing; stop if chip formation is lost.",
            ],
            [
              "Огляньте свердло після повної зупинки.",
              "Inspect the drill after a full stop.",
            ],
          ),
          step(
            ["Другий отвір", "Second hole"],
            [
              "Після перевірки крайок повторіть отвір, не змінюючи бази; статично зніміть задирки з обох боків.",
              "After checking edges repeat without changing datums; statically deburr both sides.",
            ],
            [
              "Немає замазаного виходу чи виступу на A.",
              "No smeared exit or raised burr on A.",
            ],
          ),
          step(
            ["Запис", "Record"],
            [
              "Виміряйте діаметр, центри через штифти та товщину після охолодження; збережіть фото стружки.",
              "After cooling measure diameter, pin-based centres and thickness; save a chip photo.",
            ],
            [
              "Вимірюваний результат відокремлений від припущення про наклеп.",
              "Measured results are distinguished from assumptions about work hardening.",
            ],
          ),
        ],
        [
          "Два отвориØ5,50–5,70 мм, центри±0,10; поверхня без сильного намазування.",
          "TwoØ5.50–5.70 mm holes, centres±0.10, without severe smearing.",
        ],
        [
          [
            "Контрольні штифти/нутромір та висотомір; повторіть обидва отвори.",
            "Checking pins/bore gauge and height gauge; repeat both holes.",
          ],
        ],
        ["fixture-plate"],
      ),
      exercise(
        [
          "316L: діаметр після відпочинку",
          "316L: diameter after stabilisation",
        ],
        [
          "Виточити неробочу проставку; spacer задає логіку двох встановлень, але інструмент і режим потрібно замінити.",
          "Turn a nonfunctional spacer; spacer supplies two-setup logic, while tooling and cutting data must change.",
        ],
        [
          "316L Ø25 ×45 мм дляØ20 ×15 з наскрізнимØ8,5.",
          "316L Ø25 ×45 mm forØ20 ×15 withØ8.5 through bore.",
        ],
        [
          [
            "Токарний, M-пластина, придатне свердло8,5, м’які кулачки, мікрометр.",
            "Lathe, M insert, suitable8.5 drill, soft jaws and micrometer.",
          ],
        ],
        [
          step(
            ["Перегляд маршруту", "Revise route"],
            [
              "До різання оформіть матеріальну ревізію spacer для316L: інструмент, охолодження, захват і режим.",
              "Before cutting revise spacer for316L: tool, fluid, engagement and cutting data.",
            ],
            [
              "Жоден режим6061 не перенесений автоматично.",
              "No6061 cutting setting transfers automatically.",
            ],
          ),
          step(
            ["A та діаметр", "A and diameter"],
            [
              "Створіть A й обробіть діаметр із запасом0,20 мм по діаметру; останній зріз призначте після виміру.",
              "Create A and turn with0.20 mm diameter stock; assign the final cut from measurement.",
            ],
            [
              "Є стружка, крайка не тре й не має наросту.",
              "Chips form without rubbing or built-up edge.",
            ],
          ),
          step(
            ["Отвір", "Bore"],
            [
              "За переглянутим циклом просвердліть8,5; контролюйте доставку рідини та вихід.",
              "Drill8.5 using the revised cycle; monitor fluid delivery and breakthrough.",
            ],
            ["Немає затору спіралей.", "No spiral-chip blockage."],
          ),
          step(
            ["Другий затиск", "Second clamping"],
            [
              "Після відокремлення очистіть A, затисніть готовийØ20 у м’яких кулачках і доведітьL15,00.",
              "After separation clean A, grip finishedØ20 in soft jaws and finishL15.00.",
            ],
            [
              "Биття й контакт A перевірені.",
              "Runout and A seating are checked.",
            ],
          ),
          step(
            ["Термостабілізація", "Stabilise"],
            [
              "Очистіть і виміряйте вільну деталь двічі після стабілізації; не поліруйте до збігу числа.",
              "Clean and measure the free part twice after stabilisation; do not polish until a number happens to match.",
            ],
            [
              "Прилад має достатню похибку для заданих меж.",
              "Instrument error is suitable for the specified interval.",
            ],
          ),
        ],
        [
          "Невідповідальна316L проставка з підтвердженими розмірами, не харчовий чи медичний виріб.",
          "A dimensionally checked noncritical316L spacer, not a food or medical product.",
        ],
        [
          [
            "Ø19,95–20,05; L14,95–15,05; отвір8,50–8,70 мм — навчальні межі цієї вправи.",
            "Ø19.95–20.05; L14.95–15.05; bore8.50–8.70 mm are this exercise’s learning limits.",
          ],
        ],
        ["spacer"],
      ),
    ],
    finishing: [
      t(
        "Чистоту, точність і корозійні вимоги приймайте окремо. Звичайне механічне полірування не є сертифікованою пасивацією.",
        "Accept cleanliness, dimensions and corrosion requirements separately. Ordinary mechanical polishing is not certified passivation.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Гарячі довгі спіралі й гострі задирки: жодного контакту руками; видалення лише після зупинки. Контролюйте аерозоль рідини та пил шліфування належною витяжкою.",
        "Hot long spirals and sharp burrs require hands-off removal after stopping. Control cutting-fluid aerosol and grinding dust with suitable extraction.",
      ),
    ],
    sources: [
      "material-stainless",
      "material-stainless-drill",
      "material-stainless-clean",
      "material-drilling",
    ],
    appearance: {
      color: "#b4bbc0",
      metalness: 0.9,
      roughness: 0.26,
      chip: "ribbon",
    },
  },
  {
    id: "brass",
    name: t("Латунь: свинцева й безсвинцева", "Brass: leaded and lead-free"),
    level: "intermediate",
    grades: t(
      "Порівняння: CuZn39Pb3 / CW614N зі свинцем і сертифікована кремниста безсвинцева C69300. Це не взаємозамінні режими; колір не встановлює склад або придатність для питної води.",
      "Compare leaded CuZn39Pb3 / CW614N with certified lead-free silicon brass C69300. Cutting data are not interchangeable; colour proves neither chemistry nor drinking-water suitability.",
    ),
    summary: t(
      "Зручна для невеликих проставок, але свердло може різко підхопити матеріал. Марка визначає стружку й геометрію; свинець вимагає окремої гігієни та збору відходів.",
      "Useful for small spacers, but drills can grab abruptly. Grade determines chip behaviour and geometry; lead requires dedicated hygiene and waste control.",
    ),
    behaviour: [
      t(
        "Свинцеві вільнорізальні марки часто дають коротку стружку; безсвинцеві латуні мають різні структури й не є однією групою за оброблюваністю.",
        "Leaded free-machining grades often give short chips; lead-free brasses have diverse structures and are not one machining category.",
      ),
      t(
        "М’яку тонку втулку можна зім’яти кулачками або зачепити свердлом при виході.",
        "Jaws can crush a thin sleeve and a drill can catch it at breakthrough.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "Прочитайте сертифікат і SDS; відокремте свинцеву стружку, інструменти очищення й тару. Для вправ краще придбати відому безсвинцеву марку.",
        "Read certification and SDS; segregate lead-bearing chips, cleaning tools and containers. Prefer an identified lead-free grade for exercises.",
      ),
      t(
        "Звірте геометрію свердла саме для обраної латуні; самостійне притуплення крайок без контролю не є налаштуванням.",
        "Qualify drill geometry for the chosen brass; uncontrolled hand dubbing is not a setup method.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "HSS або гостра твердосплавна N-пластина; дляCW614N іC69300 обирають різні рекомендовані геометрії, не один універсальний передній кут.",
          "HSS or sharp N-group carbide; select recommended geometry separately forCW614N andC69300 rather than one universal rake.",
        ],
        [
          "Короткий підтриманий виступ; м’які кулачки/цанга без зминання тонкої стінки.",
          "Short supported projection with soft jaws/collet that do not crush thin walls.",
        ],
        [
          "Пробний різ на масивному залишку; огляньте крайку й виміряйте перед чистовим проходом.",
          "Trial cut solid spare stock; inspect the edge and measure before finishing.",
        ],
        [
          "CW614N часто дає дрібну стружку; формаC69300 залежить від його стану та інструмента.",
          "CW614N often gives small chips; C69300 behaviour depends on condition and tool.",
        ],
        [
          "Чіткі плечики й рівний слід, без подряпин повторною стружкою.",
          "Defined shoulders and even marks without recut-chip scratches.",
        ],
        [
          "Не вважайте всі жовті прутки вільнорізальними або безсвинцевими.",
          "Do not assume every yellow bar is free-machining or lead-free.",
        ],
      ),
      method(
        "milling",
        [
          "Коротка HSS/твердосплавна фреза із геометрією для точного мідного сплаву; справний цанговий тримач.",
          "Short HSS/carbide end mill with geometry for the exact copper alloy in a sound collet holder.",
        ],
        [
          "Притиски над опорами, повна підтримка тонкої пластини; виміряйте підйом після затиску.",
          "Clamps over support and full thin-plate backing; measure clamping lift.",
        ],
        [
          "Залиште окремий чистовий запас0,20 мм на стінку навчальної кишені; приберіть стружку до фінішу.",
          "Retain0.20 mm per learning-pocket wall for finishing and clear chips before the final pass.",
        ],
        [
          "Дрібні гострі частинки можуть лишатися на опорі й дряпати поверхню.",
          "Small sharp particles can remain on supports and scratch surfaces.",
        ],
        [
          "Рівна площина з видимим напрямком обробки; розмір перевірений у вільному стані.",
          "An even face with visible machining direction; verify free-state dimensions.",
        ],
        [
          "Не продувайте свинцевий пил і не змішуйте його з відходами чистого пластику.",
          "Do not air-blow lead-bearing dust or mix it with clean plastic waste.",
        ],
      ),
      method(
        "drilling",
        [
          "Свердло з рекомендованою для цієї латуні геометрією проти підхоплення; HSS достатній для багатьох малих отворів.",
          "Drill with grade-suitable anti-grab geometry; HSS suits many small holes.",
        ],
        [
          "Затиск проти обертання й підйому, жертовна підкладка; перевірка биття.",
          "Retention against rotation and lift, sacrificial backing and runout check.",
        ],
        [
          "Підхід і вихід без різкого збільшення подачі; вістря й кромки підкладки мають перевірений простір.",
          "Approach and exit without abrupt feed increases; qualify point and backing clearances.",
        ],
        [
          "Коротка стружка не виключає раптового підхоплення деталі.",
          "Short chips do not eliminate sudden work grabbing.",
        ],
        [
          "Круглий отвір без вирваного виходу; розмір підтверджений калібром.",
          "A round gauged hole without torn breakthrough.",
        ],
        [
          "Не утримуйте тонку шайбу руками й не розсвердлюйте її незакріпленою.",
          "Do not hand-hold or enlarge an unsecured thin washer.",
        ],
      ),
      method(
        "finishing",
        [
          "Статичний дебурер, чистий м’який абразив на підкладці; окремий інвентар дляPb-сплаву.",
          "Static deburrer and clean fine abrasive on backing; dedicated equipment forPb alloy.",
        ],
        [
          "Нерухома деталь і контроль збору пилу; вимірювальні площини не завалюють.",
          "Immobilise and control dust collection without rounding datums.",
        ],
        [
          "Очищуйте сумісним засобом; декоративний блиск не робить деталь харчовою.",
          "Clean compatibly; decorative gloss does not establish food-contact suitability.",
        ],
        [
          "Пил після полірування може містити свинець навіть без видимої стружки.",
          "Polishing dust can contain lead even when chips are not visible.",
        ],
        [
          "Чиста поверхня без гострих ребер; потемніння з часом можливе.",
          "A clean safe-edged surface; tarnishing over time is possible.",
        ],
        [
          "Не поліруйте свинцеву латунь біля їжі й не прибирайте звичайним пилососом.",
          "Do not polish leaded brass near food or clean with an ordinary vacuum.",
        ],
      ),
    ],
    defects: [
      defect(
        ["Свердло ривком тягне пластину.", "Drill abruptly pulls the plate."],
        [
          "Самоподача через геометрію й недостатнє утримання.",
          "Self-feeding geometry and inadequate retention.",
        ],
        [
          "Після зупинки перевірте затиск, вихід і геометрію обох крайок.",
          "After stopping check retention, breakthrough and both lip geometries.",
        ],
        [
          "Відновіть механічне утримання й оберіть придатне свердло; не компенсуйте руками.",
          "Restore mechanical retention and choose a suitable drill rather than resisting by hand.",
        ],
      ),
      defect(
        [
          "Подряпини поперек рівного фінішу.",
          "Scratches across otherwise even marks.",
        ],
        [
          "Повторно захоплена стружка або брудна опора.",
          "Recut chips or contaminated support.",
        ],
        [
          "Огляньте опори, канавки й інструмент після зупинки.",
          "Inspect supports, flutes and tool after stopping.",
        ],
        [
          "Очистіть належним методом та перевірте запас до виправлення.",
          "Clean by an appropriate method and assess correction stock.",
        ],
      ),
      defect(
        ["Втулка овальна після зняття.", "Sleeve becomes oval after release."],
        ["Зминання тонкої стінки кулачками.", "Thin-wall jaw distortion."],
        [
          "Порівняйте діаметри у двох напрямках і стан контакту.",
          "Compare diameters in two directions and inspect contact.",
        ],
        [
          "Розподіліть захват м’якими кулачками; не зменшуйте готову стінку довільно.",
          "Distribute engagement using soft jaws rather than arbitrarily thinning the finished wall.",
        ],
      ),
      defect(
        [
          "Безсвинцевий пруток ріже інакше за попередній.",
          "Lead-free stock cuts differently from the previous bar.",
        ],
        [
          "Інша марка/структура або скопійовані даніCW614N.",
          "Different grade/structure or copiedCW614N data.",
        ],
        [
          "Перевірте сертифікат, стан і каталог інструмента.",
          "Check certification, condition and tool guidance.",
        ],
        [
          "Заново кваліфікуйте пробний різ для реальної марки.",
          "Qualify a fresh trial cut for the actual grade.",
        ],
      ),
    ],
    exercises: [
      exercise(
        [
          "C69300: проставка зі стабільним діаметром",
          "C69300: stable-diameter spacer",
        ],
        [
          "Використати схему spacer з явною заміною6061 наC69300 й новими даними інструмента.",
          "Use spacer geometry with an explicit6061-to-C69300 change and new tooling data.",
        ],
        [
          "СертифікованаC69300 Ø25 ×45 мм дляØ20 ×15, отвір8,5.",
          "CertifiedC69300 Ø25 ×45 mm forØ20 ×15,8.5 bore.",
        ],
        [
          [
            "Токарний, придатні різець/свердло, м’які кулачки, мікрометр і пробки.",
            "Lathe, suitable tool/drill, soft jaws, micrometer and plugs.",
          ],
        ],
        [
          step(
            ["Ревізія", "Revise"],
            [
              "ЗапишітьC69300, стан і рекомендований інструмент; Pb-латунь у вправі не підміняє цей матеріал.",
              "RecordC69300, condition and recommended tooling; leaded brass is not a substitute in this exercise.",
            ],
            [
              "Сертифікат збігається з прутком.",
              "Certification matches the bar.",
            ],
          ),
          step(
            ["Перше різання", "First cut"],
            [
              "Виконайте A таØ20 за логікою spacer, огляньте пробний різ і залиште0,20 мм по діаметру перед фінішем.",
              "Create A andØ20 under spacer logic; inspect the trial cut and retain0.20 mm on diameter before finishing.",
            ],
            [
              "Немає налипання або невідомого зносу.",
              "No adhesion or unexplained wear.",
            ],
          ),
          step(
            ["Отвір", "Bore"],
            [
              "Закріплену заготовку просвердліть8,5 придатною геометрією; контролюйте вихід без підхоплення.",
              "Drill retained work8.5 with appropriate geometry and control breakthrough against grabbing.",
            ],
            [
              "Затиск чинить опір обертанню й підйому.",
              "Retention resists rotation and lift.",
            ],
          ),
          step(
            ["Перестановка", "Remount"],
            [
              "Після відокремлення очистіть A й кулачки, перевірте биття та доведіть довжину15,00.",
              "After separation clean A/jaws, check runout and finish length15.00.",
            ],
            [
              "Стінка не зім’ята затиском.",
              "Clamping does not crush the wall.",
            ],
          ),
          step(
            ["Контроль", "Inspect"],
            [
              "Статично зніміть ребра й виміряйте у вільному стані до декоративного полірування.",
              "Statically deburr and inspect free-state dimensions before decorative polishing.",
            ],
            [
              "Є мінімум/максимум діаметра.",
              "Record diameter minimum/maximum.",
            ],
          ),
        ],
        [
          "Невідповідальна латунна проставка, без заяв про питну воду чи харчовий контакт.",
          "A noncritical brass spacer with no potable-water or food-contact claim.",
        ],
        [
          [
            "Ø19,95–20,05; L14,95–15,05; отвір8,50–8,70 мм.",
            "Ø19.95–20.05; L14.95–15.05; bore8.50–8.70 mm.",
          ],
        ],
        ["spacer"],
      ),
      exercise(
        [
          "Два отвори вC69300 без підхоплення",
          "TwoC69300 holes without grabbing",
        ],
        [
          "Побудувати просту підтриману операцію; fixture-plate є прикладом базування, не джерелом режимів.",
          "Build a supported operation; fixture-plate is a datum reference rather than a source of cutting settings.",
        ],
        [
          "C69300 готова пластина40 ×25 ×6 мм, габарит±0,10.",
          "C69300 pre-machined40 ×25 ×6 mm plate, envelope±0.10.",
        ],
        [
          [
            "Верстат, затиск, підкладка з виходами, свердло5,5 для марки, штифти.",
            "Machine, clamps, relieved backing, grade-suitable5.5 drill and pins.",
          ],
        ],
        [
          step(
            ["Карта", "Plan"],
            [
              "Задайте A/B/C і два центри(10;12,5),(30;12,5) мм; запишіть марку та геометрію свердла.",
              "Define A/B/C and centres(10,12.5),(30,12.5) mm; record grade and drill geometry.",
            ],
            [
              "Координати перевірені незалежно.",
              "Coordinates independently verified.",
            ],
          ),
          step(
            ["Утримання", "Retain"],
            [
              "Підтримайте A, затисніть проти підйому й обертання та перевірте вихід вістря.",
              "Support A, restrain lift/rotation and check drill-point exit.",
            ],
            [
              "Руки не виконують роль притиску.",
              "Hands provide no workholding.",
            ],
          ),
          step(
            ["Перший отвір", "First hole"],
            [
              "Просвердліть перший отвір із контрольованим виходом і огляньте після зупинки.",
              "Drill the first hole with controlled breakthrough and inspect after stopping.",
            ],
            ["Немає ривка чи зміщення заготовки.", "No grab or work movement."],
          ),
          step(
            ["Другий отвір", "Second hole"],
            [
              "Перевірте крайки, повторіть другу позицію та статично зніміть задирки.",
              "Check edges, repeat at the second position and deburr statically.",
            ],
            [
              "Не збільшуйте силу для компенсації тупого вістря.",
              "Do not compensate for a dull point with greater force.",
            ],
          ),
          step(
            ["Приймання", "Accept"],
            [
              "Виміряйте обидва отвори й координати через штифти; очистіть робочу зону за SDS.",
              "Measure both holes and pin-based coordinates; clean the work area under the SDS.",
            ],
            [
              "Зовнішній вигляд входу й виходу збережений на фото.",
              "Photograph entry and exit appearance.",
            ],
          ),
        ],
        [
          "ДваØ5,50–5,70 мм з координатами±0,10 мм і контрольованим виходом.",
          "TwoØ5.50–5.70 mm holes at±0.10 mm coordinates with controlled breakthrough.",
        ],
        [
          [
            "Калібри/нутромір дляØ та висотомір зі штифтами для центрів.",
            "Gauges/bore gauge for diameter and a pin-assisted height gauge for centres.",
          ],
        ],
        ["fixture-plate"],
      ),
    ],
    finishing: [
      t(
        "Полірування й лак змінюють поверхню; товщину покриття враховують у посадках. Латунь після обробки може природно темніти.",
        "Polish and lacquer change the surface; include coating thickness in fits. Machined brass may naturally tarnish.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Pb-латунь: окрема зона без їжі/напоїв; мийте руки засобом для видалення свинцю, не переносьте пил на одяг і додому. Для прибирання — погоджений HEPA/вологий метод, без сухого підмітання та обдуву.",
        "Leaded brass requires a food/drink-free area, lead-removal hand cleaning and prevention of dust transfer onto clothes or into the home. Use an approved HEPA/wet cleaning method rather than dry sweeping or air blowing.",
      ),
      t(
        "Стружка безсвинцевої марки також гостра; сертифікат «lead-free» не скасовує SDS і контроль пилу.",
        "Lead-free chips are still sharp; a lead-free label does not replace the SDS or dust control.",
      ),
    ],
    sources: [
      "material-copper-cut",
      "material-leadfree",
      "material-lead",
      "material-drilling",
    ],
    appearance: {
      color: "#c6a657",
      metalness: 0.85,
      roughness: 0.3,
      chip: "short",
    },
  },
  {
    id: "pom",
    name: t("Ацеталь POM-C без наповнювача", "Unfilled acetal POM-C"),
    level: "beginner",
    grades: t(
      "Ненаповнений POM-C, наприклад TECAFORM AH natural. POM-H / Delrin є іншою групою; скло-, вуглеценаповнені, антистатичні й невідомі пластики виключені з цієї карти.",
      "Unfilled POM-C, for example TECAFORM AH natural. POM-H / Delrin is a different group; glass/carbon-filled, antistatic and unidentified plastics are outside this guide.",
    ),
    summary: t(
      "Гарний матеріал для ручок і невідповідальних роликів. Ріжте гостро, не стискайте готову геометрію й вимірюйте після охолодження; змащений блиск від тертя — дефект, а не якість.",
      "A useful material for knobs and noncritical rollers. Cut sharply, avoid squeezing finished geometry and measure after cooling; a glossy rubbed smear is a defect rather than quality.",
    ),
    behaviour: [
      t(
        "Мала вологопоглинальність порівняно з PA6 не означає металевої стабільності: тепло, пружність і залишкові напруження впливають на розмір.",
        "Low moisture uptake compared with PA6 does not give metal-like stability: heat, elasticity and residual stress affect size.",
      ),
      t(
        "У товстій заготовці асиметричне зняття може викликати викривлення; знімайте матеріал збалансовано й перевіряйте після звільнення.",
        "Asymmetric removal from thick stock can warp it; balance removal and inspect after release.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "Підтвердьте POM-C й прочитайте документ обробки/SDS саме постачальника. Зберігайте чисті пластики окремо від Pb-стружки.",
        "Confirm POM-C and read the supplier’s handling/SDS information. Store clean plastic separately from lead-bearing chips.",
      ),
      t(
        "Гострий окремий інструмент, чисті розточені кулачки й мінімальний потрібний затиск. Охолоджувальний засіб застосовують лише після перевірки сумісності.",
        "Use dedicated sharp tooling, clean bored jaws and the required minimum qualified retention. Use fluid only after checking compatibility.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "Гострий позитивний полірований HSS або твердосплавна крайка без великого притуплення; коротка державка.",
          "Sharp positive polished HSS or carbide without a large edge hone, in a short holder.",
        ],
        [
          "Широкий рівномірний захват у м’яких кулачках; для ролика кулачки контактують лише із заданими поясочками.",
          "Broad even soft-jaw engagement; grip a roller only on the designated lands.",
        ],
        [
          "Залиште0,20 мм по діаметру, охолодіть і виміряйте перед фінальним різом; уникайте тривалого контакту без стружки.",
          "Retain0.20 mm on diameter, cool and measure before finishing; avoid extended contact without chips.",
        ],
        [
          "Стружка може бути стрічковою або короткою; вільний вихід важливіший за «ідеальну» форму.",
          "Chips may be ribbons or short pieces; free evacuation matters more than an ideal shape.",
        ],
        [
          "Чистий матово-шовковистий слід без оплавлених валиків; діаметр перевірений без затиску.",
          "A clean satin trace without melted ridges; verify unclamped diameter.",
        ],
        [
          "Не стискайте тонку втулку й не поліруйте її обертанням із тканиною в руках.",
          "Do not crush a thin sleeve or hand-polish rotating work with cloth.",
        ],
      ),
      method(
        "milling",
        [
          "Гостра 1–2-зуба пластикова/полірована фреза HSS чи карбід; простора канавка й чиста цанга.",
          "Sharp1–2-flute plastic/polished HSS or carbide end mill, generous flute space and clean collet.",
        ],
        [
          "Підтримуйте A по площі, притиски діють на масивні ділянки; перевіряйте підйом і вм’ятини.",
          "Support A broadly and clamp solid regions; check lift and indentation.",
        ],
        [
          "Розділіть чорнову та чистову обробку; залиште0,20 мм на стінку й дно навчальної кишені та перевірте охолоджений залишок.",
          "Separate roughing and finishing; retain0.20 mm per wall/floor on a learning pocket and inspect cooled stock.",
        ],
        [
          "Нагріта стружка злипається й повторно врізається; за налипання зупиніть різ.",
          "Hot chips can fuse and recut; stop if adhesion appears.",
        ],
        [
          "Чіткий контур без ворсу й оплавлених губ; розмір перевірений після звільнення.",
          "A defined contour without fuzz or melted lips; inspect after release.",
        ],
        [
          "Не зменшуйте подачу до тривалого тертя й не залишайте забиті канавки.",
          "Avoid reducing feed to prolonged rubbing or leaving packed flutes.",
        ],
      ),
      method(
        "drilling",
        [
          "Гостре свердло з геометрією для ненаповнених пластиків, достатнім заднім кутом і вільними канавками.",
          "Sharp unfilled-plastic drill geometry with adequate clearance and open flutes.",
        ],
        [
          "Жорстка підкладка біля виходу, захват без овалізації; короткий виліт свердла.",
          "Firm backing near breakthrough, nondistorting retention and short drill projection.",
        ],
        [
          "Виводьте стружку й тепло за рекомендованим циклом; після чорнового отвору дайте розміру стабілізуватися перед точним фінішем.",
          "Remove chips and heat using the prescribed cycle; let a rough bore stabilise before precision finishing.",
        ],
        [
          "Довгі завитки можуть намотуватися на свердло; не торкайтеся під час руху.",
          "Long curls may wrap the drill; do not touch during motion.",
        ],
        [
          "Отвір без оплавленого звуження; вимір у двох напрямках при малій вимірювальній силі.",
          "A bore without a melted restriction; measure in two directions with low measuring force.",
        ],
        [
          "Не вважайте тугу посадку теплого штифта доказом правильного діаметра.",
          "Do not treat a tight warm pin fit as proof of correct bore size.",
        ],
      ),
      method(
        "finishing",
        [
          "Гострий ручний дебурер/скребок і чиста м’яка щітка; без вогневого полірування.",
          "Sharp hand deburrer/scraper and clean soft brush; no flame polishing.",
        ],
        [
          "Статична підтримка без вм’ятин; точні бази лишаються плоскими.",
          "Static support without dents; retain flat precision datums.",
        ],
        [
          "Зріжте тонку задирку, не розмазуйте її; очистіть сумісним засобом і повторіть розмір після висихання.",
          "Cut off thin burrs rather than smearing them; clean compatibly and repeat size after drying.",
        ],
        [
          "Пластикова стружка легко розноситься й накопичує статичний заряд.",
          "Plastic chips disperse readily and can accumulate static charge.",
        ],
        [
          "Без ворсу й підгорілих країв; поверхня може лишатися матовою.",
          "No fuzz or burned edges; the surface may remain matte.",
        ],
        [
          "Не нагрівайте для блиску й не застосовуйте невідомий розчинник.",
          "Do not heat for gloss or use an unidentified solvent.",
        ],
      ),
    ],
    defects: [
      defect(
        [
          "Блискуча намазана губа, стружка злиплася.",
          "Glossy smeared lip and fused chips.",
        ],
        [
          "Надлишкове локальне тепло, тупа крайка або затор.",
          "Excess local heat, dullness or blocked evacuation.",
        ],
        [
          "Зупиніть і огляньте канавки та крайку; дайте охолонути.",
          "Stop, inspect flutes/edge and allow cooling.",
        ],
        [
          "Відновіть гостре різання й вихід; обгорілу деталь не приймайте за зовнішнім блиском.",
          "Restore sharp cutting and evacuation; gloss does not accept a heat-damaged part.",
        ],
      ),
      defect(
        [
          "Отвір овальний або звузився після зняття.",
          "Bore becomes oval or smaller after release.",
        ],
        [
          "Затиск, нагрів і пружне відновлення.",
          "Clamping, heat and elastic recovery.",
        ],
        [
          "Порівняйте затиснутий/вільний стан у двох напрямках після стабілізації.",
          "Compare clamped/free states in two directions after stabilisation.",
        ],
        [
          "Розподіліть захват, охолодіть і перегляньте запас під чистовий отвір.",
          "Distribute retention, cool and revise bore-finishing stock.",
        ],
      ),
      defect(
        ["Ворс на ребрі.", "Fuzzy edge."],
        [
          "Зношена/непридатна геометрія або непідтриманий вихід.",
          "Worn/unsuitable geometry or unsupported exit.",
        ],
        [
          "Перевірте крайку, напрямок різання й підкладку.",
          "Check edge, cutting direction and backing.",
        ],
        [
          "Гостро зріжте задирку статично; виправте вихід до наступної деталі.",
          "Statically cut off the burr and improve exit support before the next part.",
        ],
      ),
      defect(
        ["Площина вигнулася через деякий час.", "Face warps after a delay."],
        [
          "Вивільнення напружень після асиметричного зняття.",
          "Stress release after asymmetric removal.",
        ],
        [
          "Порівняйте карту товщини до/після чорнової й після відпочинку.",
          "Compare thickness maps before/after roughing and after stabilisation.",
        ],
        [
          "Збалансуйте чорнову; заводський відпал не виключає потреби окремого перевіреного циклу стабілізації.",
          "Balance roughing; factory annealing does not rule out a separately qualified stabilisation cycle.",
        ],
      ),
    ],
    exercises: [
      exercise(
        ["POM-C ручка із двома діаметрами", "Two-diameter POM-C knob"],
        [
          "Виконати replacement-knob: головаØ30 ×15, шийкаØ18 ×10, наскрізнийØ5,5.",
          "Make replacement-knob: headØ30 ×15, neckØ18 ×10 andØ5.5 through bore.",
        ],
        ["Ненаповнений POM-C Ø35 ×55 мм.", "Unfilled POM-C Ø35 ×55 mm."],
        [
          [
            "Токарний, гострий інструмент, свердло5,5, м’які кулачки, мікрометр із контрольованою силою.",
            "Lathe, sharp tool,5.5 drill, soft jaws and a controlled-force micrometer.",
          ],
        ],
        [
          step(
            ["Матеріал і карта", "Material and plan"],
            [
              "Підтвердьте POM-C; повний маршрут спочатку обробляє шийку й контактний C, тоді A голови.",
              "Confirm POM-C; the full route machines neck/contact C before head face A.",
            ],
            [
              "POM-H або наповнений пластик не підставлений автоматично.",
              "No automatic substitution of POM-H or filled plastic.",
            ],
          ),
          step(
            ["Шийка", "Neck"],
            [
              "У S1 створіть контактний торецьC, шийкуØ18 і запас під голову; просвердліть за картою.",
              "In S1 create contact face C,Ø18 neck and head stock; drill under the route.",
            ],
            [
              "Вільний вихід стружки, немає оплавлення.",
              "Free chip exit without melting.",
            ],
          ),
          step(
            ["Перестановка", "Remount"],
            [
              "Відокремте з запасом, очистіть і посадіть голову в розточені кулачки з проходом під шийку.",
              "Separate with stock, clean and seat the head in bored jaws with neck clearance.",
            ],
            [
              "Шийка не затиснута й не є випадковим упором.",
              "Neck is neither gripped nor an unintended stop.",
            ],
          ),
          step(
            ["Голова й довжина", "Head and length"],
            [
              "Доведіть Ø30, довжину25 і голову15 за картою; гостро зріжте задирки статично.",
              "FinishØ30, total25 and head length15 under the sheet; statically cut burrs with a sharp tool.",
            ],
            [
              "Контакти не зім’яті кулачками.",
              "Jaws have not crushed contact regions.",
            ],
          ),
          step(
            ["Вільний контроль", "Free-state inspection"],
            [
              "Після стабілізації повторіть діаметри й отвір із малою силою; порівняйте два напрями.",
              "After stabilisation repeat diameters and bore with low force; compare two directions.",
            ],
            [
              "Застосовані межі саме replacement-knob, а не металевої посадки.",
              "Apply replacement-knob limits rather than a metal-fit assumption.",
            ],
          ),
        ],
        [
          "Ручка для невідповідального настільного механізму без ворсу та слідів зминання.",
          "A noncritical bench-mechanism knob without fuzz or crushing marks.",
        ],
        [
          [
            "Габарити й усі межі — у replacement-knob; вимірюйте після звільнення та охолодження.",
            "Envelope and limits follow replacement-knob; inspect after release and cooling.",
          ],
        ],
        ["replacement-knob"],
      ),
      exercise(
        [
          "Канавка ролика без затиску кореня",
          "Roller groove without gripping its root",
        ],
        [
          "Виконати grooved-roller:Ø40/Ø36/Ø40 із довжинами8/9/8, отвір8,2.",
          "Make grooved-roller:Ø40/Ø36/Ø40 at8/9/8 lengths,8.2 bore.",
        ],
        ["POM-C Ø45 ×55 мм.", "POM-C Ø45 ×55 mm."],
        [
          [
            "Токарний, канавковий інструмент, свердло8,2, розточені кулачки з розвантаженням канавки.",
            "Lathe, grooving tool,8.2 drill and bored jaws relieved over the groove.",
          ],
        ],
        [
          step(
            ["Оснастка", "Fixture"],
            [
              "За маршрутом зробіть кулачки з контактом лише по двохØ40 поясочках і розвантаженням надØ36.",
              "Make route-defined jaws contacting only the twoØ40 lands and relievingØ36.",
            ],
            [
              "Фактичні зони контакту перевірені до обертання.",
              "Verify actual contact zones before rotation.",
            ],
          ),
          step(
            ["Перша сторона", "First side"],
            [
              "Виконайте A,Ø40 й отвір; не накопичуйте тепло тривалим тертям.",
              "Create A,Ø40 and bore without prolonged rubbing heat.",
            ],
            ["Чистий вихід стружки зі свердла.", "Drill evacuates freely."],
          ),
          step(
            ["Канавка", "Groove"],
            [
              "Сформуйте ширину9 іØ36 за картою, перевіряючи фактичні залишки до країв.",
              "Create width9 andØ36 under the sheet, checking actual land widths.",
            ],
            [
              "Канавкове лезо придатне до своєї ширини й вильоту.",
              "Grooving blade is suitable for width and projection.",
            ],
          ),
          step(
            ["Другий затиск", "Second clamping"],
            [
              "Очистіть і посадіть A; перевірте биття та завершітьL25 без контакту кулачків із коренем.",
              "Clean and seat A, check runout and finishL25 without jaw contact at the root.",
            ],
            [
              "Огляд підтвердив контакт лише по поясочках.",
              "Inspection confirms land-only contact.",
            ],
          ),
          step(
            ["Контроль", "Inspect"],
            [
              "Після звільнення виміряйте два поясочки, корінь, ширину й отвір; огляньте сліди затиску.",
              "After release measure both lands, root, width and bore; inspect jaw marks.",
            ],
            [
              "Межі й методи з повної карти grooved-roller.",
              "Use full grooved-roller limits and methods.",
            ],
          ),
        ],
        [
          "Ролик для нерухомого навчального макета, не сертифікований вантажний вузол.",
          "A roller for a stationary learning model, not a rated load-bearing assembly.",
        ],
        [
          [
            "Канавку вимірюйте придатними вузькими контактами; широкі губки можуть спиратися на поясочки.",
            "Use suitable narrow contacts for the groove; broad jaws can bridge the lands.",
          ],
        ],
        ["grooved-roller"],
      ),
    ],
    finishing: [
      t(
        "Не застосовуйте полум’я або нагрів для декоративного блиску. Відпал/стабілізація можливі лише за картою саме цього матеріалу й товщини.",
        "Do not flame or heat for decorative gloss. Annealing/stabilisation requires a schedule for this exact material and thickness.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Сильний перегрів POM-C може виділяти формальдегід: зупиніть джерело тепла безпечно, відійдіть від парів і дійте за PHIS/SDS та планом вентиляції. Запах не є вимірювачем безпечної концентрації.",
        "Severe overheating of POM-C can release formaldehyde: safely stop the heat source, move away from vapour and follow the PHIS/SDS and ventilation plan. Odour is not a safe-concentration meter.",
      ),
      t(
        "Не обробляйте невідомий пластик, PVC або невідомі наповнювачі за цією картою. Контролюйте горючі накопичення й статичний заряд.",
        "Do not machine unidentified plastic, PVC or unknown fillers under this guide. Control combustible accumulations and static charge.",
      ),
    ],
    sources: [
      "material-pom-c",
      "material-pom-handling",
      "material-plastic-machining",
      "material-plastic-faq",
      "material-dust",
    ],
    appearance: {
      color: "#e8e5da",
      metalness: 0,
      roughness: 0.48,
      chip: "ribbon",
    },
  },
  {
    id: "pa6",
    name: t(
      "Нейлон PA6: вологість і пружність",
      "Nylon PA6: moisture and elasticity",
    ),
    level: "intermediate",
    grades: t(
      "Ненаповнений екструдований PA6, наприклад TECAMID6 natural, із погодженим станом кондиціювання. Литий PA6G, PA66 і склонаповнений PA6 мають окремі властивості й карти.",
      "Unfilled extruded PA6, for example TECAMID6 natural, in an agreed conditioned state. Cast PA6G, PA66 and glass-filled PA6 have separate properties and process sheets.",
    ),
    summary: t(
      "Геометрія залежить від вологи, часу й сили вимірювання. Спочатку задайте умови використання та кондиціювання; точний розмір «щойно після верстата» ще не означає придатності.",
      "Geometry depends on moisture, time and measuring force. Define service and conditioning conditions first; an accurate size immediately off the machine does not establish suitability.",
    ),
    behaviour: [
      t(
        "PA6 поглинає/віддає вологу й змінює розмір. Не призначайте універсальне замочування або сушіння без товщини та документа постачальника.",
        "PA6 gains/loses moisture and changes size. Do not assign universal soaking or drying without thickness and supplier instructions.",
      ),
      t(
        "Пружне відновлення й віджим крайки можуть дати отвір, відмінний від діаметра свердла, навіть без явного оплавлення.",
        "Elastic recovery and tool deflection can change bore size relative to the drill even without visible melting.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "Запишіть партію, типPA6, температуру, вологість і стан кондиціювання. До фінішу стабілізуйте за узгодженим документом; не придумуйте фіксовані години для будь-якої товщини.",
        "Record batch, PA6 type, temperature, humidity and conditioning state. Stabilise before finishing under an agreed document rather than inventing fixed hours for every thickness.",
      ),
      t(
        "Короткий гострий інструмент, широка підтримка й контрольована вимірювальна сила; рідину перевірте на сумісність і вплив на вологу.",
        "Use short sharp tools, broad support and controlled measuring force; qualify fluid compatibility and its moisture effect.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "Гострий позитивний полірований HSS/карбід для ненаповненогоPA6; мінімальна довжина державки.",
          "Sharp positive polished HSS/carbide for unfilledPA6 with minimum holder projection.",
        ],
        [
          "М’які розточені кулачки без зминання; перевірте вільний діаметр після пробного затиску.",
          "Nondistorting bored soft jaws; check free diameter after trial clamping.",
        ],
        [
          "Залиште0,30 мм по діаметру на чорновому зразку; після термо- й вологісної стабілізації виміряйте перед фінішем.",
          "Retain0.30 mm diameter stock on the rough coupon; measure after thermal/moisture stabilisation before finishing.",
        ],
        [
          "ЕкструдованийPA6 може давати довгі завитки, що намотуються.",
          "ExtrudedPA6 can produce long wrapping curls.",
        ],
        [
          "Поверхня без ворсу й оплавлення; стабільність підтверджується повтором у заданих умовах.",
          "A fuzz-free unmelted surface; demonstrate stability by repetition under stated conditions.",
        ],
        [
          "Не копіюйте POM-C допуски й не стискайте штангенциркуль для отримання потрібного числа.",
          "Do not copy POM-C tolerances or squeeze calipers to obtain the desired number.",
        ],
      ),
      method(
        "milling",
        [
          "Гостра 1–2-зуба фреза з просторими канавками для пластиків; чистий короткий тримач.",
          "Sharp1–2-flute plastic cutter with generous flutes in a clean short holder.",
        ],
        [
          "Плоска опора; затиск по масивному краю, не по тонкому бортові.",
          "Flat backing; clamp solid edges rather than a thin rim.",
        ],
        [
          "Чорнова симетрична вибірка, окремий фініш після стабілізації. Для навчальної кишені залиште0,30 мм на кожній стінці.",
          "Rough symmetrically and finish separately after stabilisation. Retain0.30 mm per learning-pocket wall.",
        ],
        [
          "Ворс і тонкі довгі завитки можуть перекривати канавки.",
          "Fuzz and thin long curls can obstruct flutes.",
        ],
        [
          "Чіткі ребра без волокнистої бахроми; розмір заданий разом зі станом вологи.",
          "Defined edges without fibrous fringe; dimension is specified with moisture condition.",
        ],
        [
          "Не видаляйте ворс нагріванням і не залишайте гарячу деталь затиснутою для «випрямлення».",
          "Do not burn off fuzz or hold hot work clamped to straighten it.",
        ],
      ),
      method(
        "drilling",
        [
          "Гостре свердло для пластиків із вільним відводом; для точного отвору — придатне розточування після стабілізації.",
          "Sharp plastic drill with free evacuation; use suitable boring after stabilisation for a precision bore.",
        ],
        [
          "Підтримка виходу й рівномірний захват; заздалегідь перевірте доступ нутроміра.",
          "Back breakthrough and grip evenly; qualify bore-gauge access beforehand.",
        ],
        [
          "Не затримуйтеся на дні; відводьте стружку за інструкцією й повторюйте діаметр після охолодження, не лише в затиску.",
          "Avoid bottom dwell, clear chips as specified and repeat the cooled diameter rather than measuring only in the clamp.",
        ],
        [
          "Довга стружка накопичує тепло й може розмазувати вхід.",
          "Long chips retain heat and can smear the entry.",
        ],
        [
          "Круглий отвір без розтягнутого краю; контроль малою силою у двох напрямах.",
          "A round bore without a stretched lip; check with low force in two directions.",
        ],
        [
          "Не вважайте затиснутий штифт доказом посадки й не замочуйте готову деталь навмання.",
          "Do not use a jammed pin as fit proof or soak finished work arbitrarily.",
        ],
      ),
      method(
        "finishing",
        [
          "Гострий ручний скребок/дебурер; для контрольного контакту — чиста м’яка підкладка.",
          "Sharp hand scraper/deburrer and clean soft backing for controlled contact.",
        ],
        [
          "Деталь нерухома, без розтягування; дайте їй відновитися після затиску.",
          "Immobilise without stretching and allow recovery after clamping.",
        ],
        [
          "Зріжте ворс уздовж ребра; очищення й зберігання мають зберігати погоджений стан кондиціювання.",
          "Cut fuzz along the edge; cleaning/storage must preserve the agreed conditioning state.",
        ],
        [
          "Пластикові завитки й пил збирають без їх рознесення у повітрі.",
          "Collect plastic curls and dust without dispersing them into the air.",
        ],
        [
          "Без бахроми й білих зон деформації; результат супроводжується умовами вимірювання.",
          "No fringe or stress-whitened regions; record measurement conditions with the result.",
        ],
        [
          "Не маскуйте волокнистий край полум’ям, розчинником або надмірним поліруванням.",
          "Do not hide a fibrous edge with flame, solvent or excessive polishing.",
        ],
      ),
    ],
    defects: [
      defect(
        ["Отвір змінюється наступного дня.", "Bore size changes the next day."],
        [
          "Зміна вологи, температури або релаксація напружень.",
          "Moisture/temperature change or stress relaxation.",
        ],
        [
          "Порівняйте умови, масу за наявності придатних ваг і повторні розміри.",
          "Compare conditions, mass where suitable scales are available, and repeated dimensions.",
        ],
        [
          "Погодьте стан кондиціювання й приймання; не коригуйте розмір без встановлення причини.",
          "Agree conditioning/acceptance state before correcting size without a known cause.",
        ],
      ),
      defect(
        ["Довгий ворс на виході.", "Long exit fuzz."],
        [
          "Тупа крайка й непідтриманий край.",
          "Dull edge and unsupported exit.",
        ],
        [
          "Огляньте вістря, підкладку та форму вихідної кромки.",
          "Inspect point, backing and exit geometry.",
        ],
        [
          "Відновіть гостроту/підтримку, задирку зріжте статично.",
          "Restore sharpness/support and trim the burr statically.",
        ],
      ),
      defect(
        ["Овал після послаблення кулачків.", "Ovality after jaw release."],
        ["Затиск і пружне відновлення.", "Clamping and elastic recovery."],
        [
          "Виміряйте два напрями до/після звільнення з малою силою.",
          "Measure two directions before/after release using low force.",
        ],
        [
          "Розподіліть контакт і кваліфікуйте захват без деформації.",
          "Distribute contact and qualify nondistorting retention.",
        ],
      ),
      defect(
        [
          "Намазаний блиск і теплий липкий завиток.",
          "Smeared gloss and hot sticky curls.",
        ],
        ["Тертя й накопичене тепло.", "Rubbing and heat accumulation."],
        [
          "Зупиніть, огляньте крайку й канавки; перевірте фактичну подачу.",
          "Stop, inspect edge/flutes and check actual feed.",
        ],
        [
          "Відновіть утворення стружки й відвід тепла; перевірте геометрію після стабілізації.",
          "Restore chip formation/heat removal and inspect geometry after stabilisation.",
        ],
      ),
    ],
    exercises: [
      exercise(
        [
          "PA6 втулка: два протоколи розміру",
          "PA6 sleeve: two measurement records",
        ],
        [
          "НавчальнийØ20 ×15, отвір8,5; spacer дає лише логіку перестановки, матеріал і межі змінено.",
          "LearningØ20 ×15,8.5 bore; spacer supplies remounting logic only, with material and limits changed.",
        ],
        [
          "Кондиційований ненаповненийPA6 Ø25 ×45 мм із записаними умовами.",
          "Conditioned unfilledPA6 Ø25 ×45 mm with recorded conditions.",
        ],
        [
          [
            "Токарний, гострий інструмент, свердло8,5, м’які кулачки й малосиловий контроль.",
            "Lathe, sharp tool,8.5 drill, soft jaws and low-force measurement.",
          ],
        ],
        [
          step(
            ["Умови", "Conditions"],
            [
              "Запишіть температуру/вологість і погоджений стан; окремо затвердьте PA6-ревізію замість6061.",
              "Record temperature/humidity and agreed condition; approve aPA6 revision replacing6061.",
            ],
            [
              "Є документ кондиціювання постачальника.",
              "Supplier conditioning instructions are available.",
            ],
          ),
          step(
            ["Чорнова", "Rough"],
            [
              "Виконайте A,Ø20,30 та підготовчий отвір; залиште запас по довжині й охолодіть.",
              "Create A,Ø20.30 and a preparatory bore; preserve length stock and cool.",
            ],
            [
              "Отвір ще не вважається остаточним.",
              "Bore is not yet accepted as final.",
            ],
          ),
          step(
            ["Фініш", "Finish"],
            [
              "Після стабілізації доведітьØ20 та отвір8,5; перенесіть у м’які кулачки й завершітьL15.",
              "After stabilisation finishØ20 and8.5 bore; transfer to soft jaws and finishL15.",
            ],
            [
              "Перестановка включає очищення й перевірку биття.",
              "Transfer includes cleaning and runout check.",
            ],
          ),
          step(
            ["Перший запис", "First record"],
            [
              "Після звільнення виміряйте діаметр/отвір у двох напрямах і довжину; занотуйте час та умови.",
              "After release measure diameter/bore in two directions and length; record time and conditions.",
            ],
            [
              "Низька однакова сила вимірювання.",
              "Use consistently low measuring force.",
            ],
          ),
          step(
            ["Повтор", "Repeat"],
            [
              "Повторіть наступного дня в тих самих задокументованих умовах. Це навчальний інтервал, не універсальний строк кондиціювання.",
              "Repeat the next day under the same documented conditions. This is a learning interval, not a universal conditioning duration.",
            ],
            [
              "Відмінність записана; за дрейфу приймання відкладене.",
              "Record the difference and defer acceptance if drift persists.",
            ],
          ),
        ],
        [
          "Два порівнювані протоколи показують дрейф; втулка не є прийнятим підшипником.",
          "Two comparable records reveal drift; the sleeve is not an accepted bearing.",
        ],
        [
          [
            "Навчальні межіØ19,90–20,10; L14,90–15,10; отвір8,50–8,70 мм у погодженому стані.",
            "Learning limitsØ19.90–20.10; L14.90–15.10; bore8.50–8.70 mm in the agreed condition.",
          ],
        ],
        ["spacer"],
      ),
      exercise(
        ["PA6 опорний брусок без бахроми", "PA6 support block without fringe"],
        [
          "Простий40 ×20 ×10 брусок із двомаØ5,5; vise-stop — приклад базування, не скопійований алюмінієвий режим.",
          "Simple40 ×20 ×10 block with twoØ5.5 holes; vise-stop illustrates datums rather than aluminium cutting settings.",
        ],
        ["КондиційованийPA6 44 ×24 ×14 мм.", "ConditionedPA6 44 ×24 ×14 mm."],
        [
          [
            "Фрезерний, пластикова фреза, свердло5,5, підтримувальна плита й мікрометр.",
            "Mill, plastic end mill,5.5 drill, support carrier and micrometer.",
          ],
        ],
        [
          step(
            ["Габарит", "Envelope"],
            [
              "Створіть A/B/C й чорновий габарит із0,30 мм під чистову на розмірних площинах.",
              "Create A/B/C and a rough envelope retaining0.30 mm on sizing faces.",
            ],
            ["Площини не зім’яті затиском.", "Clamping does not crush faces."],
          ),
          step(
            ["Стабілізація", "Stabilise"],
            [
              "Звільніть, очистіть і стабілізуйте за погодженим планом перед поверненням на чистову.",
              "Release, clean and stabilise under the agreed plan before a separate finishing setup.",
            ],
            [
              "Нове встановлення відновлює A/B/C.",
              "The new setup recovers A/B/C.",
            ],
          ),
          step(
            ["Чистові площини", "Finish faces"],
            [
              "Доведіть40 ×20 ×10 мм; гостро приберіть вихідний ворс поза верстатом.",
              "Finish40 ×20 ×10 mm and sharply trim exit fuzz off-machine.",
            ],
            [
              "Контроль вільного габариту±0,10 мм.",
              "Check free-state envelope±0.10 mm.",
            ],
          ),
          step(
            ["Два отвори", "Two holes"],
            [
              "На повній опорі просвердліть(10;10),(30;10) мм від C/B із підтримкою виходу.",
              "On full backing drill at(10,10),(30,10) mm from C/B with supported exits.",
            ],
            [
              "Стружка не намотується; затиск не приховує згин.",
              "No wrapping chips; clamping does not conceal bending.",
            ],
          ),
          step(
            ["Протокол", "Record"],
            [
              "Виміряйте отвори й координати після відновлення форми; запишіть стан і час.",
              "Measure holes/coordinates after recovery and record condition/time.",
            ],
            [
              "Після повтору немає неврахованого дрейфу.",
              "Repeated inspection shows no unexplained drift.",
            ],
          ),
        ],
        [
          "Невідповідальний опорний зразок із чистими ребрами та визначеними умовами розміру.",
          "A noncritical support coupon with clean edges and defined dimensional conditions.",
        ],
        [
          [
            "Габарит±0,10; отвори5,50–5,75; центри±0,15 мм у погодженому стані.",
            "Envelope±0.10; holes5.50–5.75; centres±0.15 mm in the agreed condition.",
          ],
        ],
        ["vise-stop"],
      ),
    ],
    finishing: [
      t(
        "Записуйте стан кондиціювання разом із розміром. Контрольоване зберігання важливіше за декоративний блиск.",
        "Record conditioning state with dimensions. Controlled storage matters more than decorative gloss.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Виключіть невідомий PVC і наповнені пластики: інші продукти розкладу, пил і знос потребують окремої оцінки. За диму/перегріву припиніть процес і дійте за SDS.",
        "Exclude unidentifiedPVC and filled plastics: different decomposition products, dust and wear require separate assessment. Stop for smoke/overheating and follow the SDS.",
      ),
      t(
        "Пластикова стружка горюча й може заряджатися статично; збирайте належним обладнанням, без побутового пилососа.",
        "Plastic chips are combustible and may charge statically; use suitable collection equipment rather than a household vacuum.",
      ),
    ],
    sources: [
      "material-pa6",
      "material-plastic-faq",
      "material-plastic-machining",
      "material-dust",
    ],
    appearance: {
      color: "#d9ceb3",
      metalness: 0,
      roughness: 0.58,
      chip: "ribbon",
    },
  },
  {
    id: "cast-iron",
    name: t("Сірий чавун EN-GJL-250", "Grey cast iron EN-GJL-250"),
    level: "intermediate",
    grades: t(
      "Підтверджений сірий чавун EN-GJL-250, чиста заготовка без невідомого литого піску та покриття. EN-GJS, CGI, ADI й вибілений чавун не є заміною. Таблиці Dura-Bar стосуються його власних марок, не автоматично EN-GJL-250.",
      "Identified grey iron EN-GJL-250 in clean stock without unknown moulding sand or coatings. EN-GJS, CGI, ADI and chilled iron are not substitutes. Dura-Bar tables apply to its own grades, not automatically to EN-GJL-250.",
    ),
    summary: t(
      "Крихка коротка стружка, абразивний пил і ризик викришування вихідної кромки. Головні підготовки — відведення пилу, захист напрямних і підтримка ребер.",
      "Brittle short chips, abrasive dust and exit-edge chipping govern the process. Prepare dust control, way protection and edge support first.",
    ),
    behaviour: [
      t(
        "Матова сіра поверхня й дрібна крихта можуть бути нормальними; темний пил не доводить ані доброї, ані поганої геометрії.",
        "A matte grey surface and fine crumbs can be normal; dark dust establishes neither good nor bad geometry.",
      ),
      t(
        "Тонке ребро може відколотися замість утворення металевого задирка. Велика сила затиску небезпечна для крихкого перерізу.",
        "A thin edge may chip rather than form a ductile burr. High clamping force is hazardous to a brittle section.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "Прийміть чисту заготовку за документом; ливарний пісок, кірку й старі покриття видаляють за окремим контрольованим процесом. Не зішліфовуйте невідомий відливок у відкритій кімнаті.",
        "Accept clean documented stock; remove foundry sand, skin and old coatings under a separate controlled process. Do not openly grind an unidentified casting.",
      ),
      t(
        "Підготуйте місцеву витяжку, захист напрямних та професійне прибирання для фактичного пилу. Спосіб wet/dry вибирають разом з інструментом і системою пилоконтролю.",
        "Provide local extraction, way protection and professional cleaning suitable for the actual dust. Select wet/dry operation jointly with tooling and dust control.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "Зносостійка твердосплавна K-пластина; HSS можливий для малої чистої операції з частішим контролем зносу.",
          "Wear-resistant K-group carbide insert; HSS can suit limited clean work with more frequent wear inspection.",
        ],
        [
          "Масивний підтриманий захват, чисті кулачки; не затискайте тонкий крихкий обід.",
          "Support solid gripping regions in clean jaws rather than a thin brittle rim.",
        ],
        [
          "Знімайте кірку окремою придатною крайкою; чистову виконуйте по очищеній основі, контролюючи абразивний знос.",
          "Remove skin with a separate suitable edge; finish clean substrate while monitoring abrasive wear.",
        ],
        [
          "Короткі уламки й дрібний пил; відсутність довгої стрічки не усуває інгаляційної небезпеки.",
          "Short fragments and fine dust; absence of a ribbon does not remove inhalation risk.",
        ],
        [
          "Рівномірна матова сіра поверхня без сколів; діаметр перевірений після очищення.",
          "An even matte-grey surface without chips, with diameter checked after cleaning.",
        ],
        [
          "Не компенсуйте знос більшою подачею навмання й не витирайте пил із напрямних у їхні щілини.",
          "Do not arbitrarily increase feed to compensate for wear or wipe dust into way gaps.",
        ],
      ),
      method(
        "milling",
        [
          "Коротка фреза з K-пластинами або придатний карбід; геометрія має підтримувати вихідну кромку.",
          "Short K-insert cutter or suitable carbide; select geometry to protect the exit edge.",
        ],
        [
          "Повна підтримка A, напрямок проходу враховує крихке ребро; за потреби — придатний підпір виходу.",
          "Support A fully and plan travel around the brittle edge; qualify exit backing where needed.",
        ],
        [
          "Чорнова й чистова розділені; wet/dry та подачу узгодьте з маркою, без випадкового поливання гарячої сухої пластини.",
          "Separate roughing/finishing; qualify wet/dry and feed for the grade rather than intermittently splashing a hot dry insert.",
        ],
        [
          "Пил і крихта вимагають збирання біля джерела.",
          "Dust and crumbs require capture near the source.",
        ],
        [
          "Без вирваного вихідного кута; фактична площина перевірена очищеним приладом.",
          "No broken exit corner; inspect the cleaned face with clean instruments.",
        ],
        [
          "Не фрезеруйте незакріплений край і не обдувайте чорний пил у приміщення.",
          "Do not mill an unsecured edge or air-blow black dust into the room.",
        ],
      ),
      method(
        "drilling",
        [
          "Свердло HSS-Co/карбід, рекомендоване для сірого чавуну; короткий тримач із перевіреним биттям.",
          "HSS-Co/carbide drill rated for grey iron in a short runout-checked holder.",
        ],
        [
          "Підкладка близько до виходу, позитивне утримання деталі й контрольований пилозбір.",
          "Close breakthrough backing, positive retention and controlled dust collection.",
        ],
        [
          "Оберіть цикл і середовище за свердлом; вихід контролюйте від викришування, отвір очистіть до вимірювання.",
          "Select cycle/medium for the drill; control exit chipping and clean before gauging.",
        ],
        [
          "Коротка крихта легко потрапляє між штифтом і отвором.",
          "Short crumbs readily lodge between a checking pin and the bore.",
        ],
        [
          "Отвір без радіального відколу, прохідний контроль не заклинений пилом.",
          "A hole without radial breakout, with gauges unobstructed by dust.",
        ],
        [
          "Не приймайте забруднений калібр і не підводьте руку під вихід свердла.",
          "Do not accept with a contaminated gauge or put a hand beneath breakthrough.",
        ],
      ),
      method(
        "finishing",
        [
          "Ручний дрібний камінь/дебурер, призначений для матеріалу; локальне відведення пилу.",
          "Material-suitable fine hand stone/deburrer with local dust capture.",
        ],
        [
          "Нерухомо підтримана деталь; зберігайте крихкі кути без удару.",
          "Immobilise and support the part without impacting brittle corners.",
        ],
        [
          "Зніміть лише виступи й обережно оформіть кромку; очистіть усі пори та контрольні контакти належним методом.",
          "Remove only raised material and gently break edges; clean pores and measuring contacts appropriately.",
        ],
        [
          "Тонкий чорний абразивний пил не є нешкідливим брудом.",
          "Fine black abrasive dust is not harmless dirt.",
        ],
        [
          "Чистий матовий фініш; дзеркальне полірування не є метою й може завалити бази.",
          "A clean matte finish; mirror polishing is unnecessary and may round datums.",
        ],
        [
          "Не збивайте задирку молотком і не маскуйте пористість замазуванням.",
          "Do not hammer off burrs or smear over porosity.",
        ],
      ),
    ],
    defects: [
      defect(
        ["Викришений вихідний кут.", "Chipped exit corner."],
        [
          "Крихкий непідтриманий край і надмірне навантаження.",
          "Unsupported brittle edge and excessive loading.",
        ],
        [
          "Перевірте напрямок виходу, знос крайки й підтримку.",
          "Check exit direction, edge wear and backing.",
        ],
        [
          "Переплануйте вихід і геометрію; скол на функціональній базі потребує рішення, не прихованої фаски.",
          "Replan exit/geometry; a functional-datum chip needs a disposition rather than a concealed chamfer.",
        ],
      ),
      defect(
        [
          "Фініш погіршується від деталі до деталі.",
          "Finish degrades between parts.",
        ],
        [
          "Абразивний знос крайки або забруднення.",
          "Abrasive edge wear or contamination.",
        ],
        [
          "Огляньте задню поверхню крайки та пил у посадках.",
          "Inspect flank wear and dust at interfaces.",
        ],
        [
          "Замініть крайку й очистіть систему до корекції розміру.",
          "Replace the edge and clean the system before dimensional correction.",
        ],
      ),
      defect(
        [
          "Розмір нестабільний, калібр заїдає.",
          "Inconsistent size and sticking gauge.",
        ],
        [
          "Крихта між вимірювальними контактами.",
          "Crumbs between measuring contacts.",
        ],
        [
          "Очистіть отвір/прилад і повторіть із двох напрямків.",
          "Clean bore/instrument and repeat in two directions.",
        ],
        [
          "Не протискуйте калібр; приймайте лише чистий повторюваний результат.",
          "Do not force a gauge; accept only clean repeatable readings.",
        ],
      ),
      defect(
        [
          "Твердий блискучий острівець, крайка швидко сколюється.",
          "Hard shiny patch and rapid edge chipping.",
        ],
        [
          "Можлива вибілена зона або тверде включення.",
          "Possible chilled region or hard inclusion.",
        ],
        [
          "Перевірте походження, твердість і документацію заготовки.",
          "Check provenance, hardness and stock documentation.",
        ],
        [
          "Зупиніть звичайний маршрут EN-GJL-250 й окремо кваліфікуйте інструмент/заготовку.",
          "Stop the ordinaryEN-GJL-250 route and separately qualify tool/stock.",
        ],
      ),
    ],
    exercises: [
      exercise(
        ["Сірий чавун: плоский опорний диск", "Grey iron: flat support puck"],
        [
          "НавчальнийØ40 ×15; reference-puck дає геометричну логіку, C45 замінено наEN-GJL-250.",
          "LearningØ40 ×15; reference-puck supplies geometric logic withC45 changed toEN-GJL-250.",
        ],
        [
          "Чистий документованийEN-GJL-250 Ø45 ×45 мм.",
          "Clean documentedEN-GJL-250 Ø45 ×45 mm.",
        ],
        [
          [
            "Токарний, K-інструмент, м’які кулачки, витяжка, мікрометр і чиста плита.",
            "Lathe, K tooling, soft jaws, extraction, micrometer and clean surface plate.",
          ],
        ],
        [
          step(
            ["Пил і ревізія", "Dust and revision"],
            [
              "Підготуйте пилоконтроль, захист напрямних і нову матеріальну карту; не копіюйте режимC45.",
              "Prepare dust control, way protection and a material revision rather than copyingC45 data.",
            ],
            [
              "Увімкнена й перевірена витяжка, заготовка без піску.",
              "Extraction is operating/checked and stock is sand-free.",
            ],
          ),
          step(
            ["A та діаметр", "A and diameter"],
            [
              "Обробіть A йØ40 з окремою чистовою крайкою; залиште довжину під відокремлення й повторне торцювання.",
              "Machine A/Ø40 with a separate finishing edge; preserve length for separation and reverse facing.",
            ],
            [
              "Немає викришування й нез’ясованих твердих зон.",
              "No chipping or unexplained hard zones.",
            ],
          ),
          step(
            ["Перестановка", "Remount"],
            [
              "За логікою reference-puck відокремте, очистіть A й м’які кулачки, перевірте посадку/биття.",
              "Separate under reference-puck logic, clean A/soft jaws and verify seating/runout.",
            ],
            [
              "Крихта не потрапила в осьову опору.",
              "No crumbs in the axial seat.",
            ],
          ),
          step(
            ["Друга площина", "Second face"],
            [
              "ДоведітьL15,00, статично оформіть ребра без ударів; очистіть перед плитою.",
              "FinishL15.00, statically break edges without impacts and clean before surface-plate use.",
            ],
            ["Опорні ребра не відколоті.", "Support edges are unchipped."],
          ),
          step(
            ["Контроль", "Inspect"],
            [
              "Перевірте довжину в п’яти точках таØ у двох перерізах; цей диск не є кінцевою мірою.",
              "Check length at five points and diameter at two sections; this puck is not a gauge block.",
            ],
            [
              "Вимірювання повторюються після повторного очищення.",
              "Readings repeat after cleaning again.",
            ],
          ),
        ],
        [
          "Матова чиста опора для невідповідального макета, без метрологічного сертифіката.",
          "A clean matte support for a noncritical model, without metrological certification.",
        ],
        [
          [
            "НавчальніØ39,95–40,05; L14,95–15,05; різнотовщинність≤0,03 мм, відмінні відC45-проєкту.",
            "LearningØ39.95–40.05; L14.95–15.05; thickness spread≤0.03 mm, differing from theC45 project.",
          ],
        ],
        ["reference-puck"],
      ),
      exercise(
        ["Отвори без викришеного виходу", "Holes without brittle breakout"],
        [
          "Брусок40 ×20 ×10 із двомаØ5,5; vise-stop є посиланням на базування з явною зміною матеріалу.",
          "40 ×20 ×10 block with twoØ5.5 holes; vise-stop illustrates datums with an explicit material change.",
        ],
        ["ЧистийEN-GJL-250 44 ×24 ×14 мм.", "CleanEN-GJL-250 44 ×24 ×14 mm."],
        [
          [
            "Фрезерний, K-інструмент, свердло5,5, підкладка й професійний пилозбір.",
            "Mill, K tooling,5.5 drill, backing and professional dust collection.",
          ],
        ],
        [
          step(
            ["Габарит", "Envelope"],
            [
              "Підготовленим інструментом створіть A/B/C й40 ×20 ×10; торці обробляйте збоку з підтримкою.",
              "Create A/B/C and40 ×20 ×10 using prepared tooling; side mill supported ends.",
            ],
            [
              "Габарит±0,10 мм, кути не відколоті.",
              "Envelope±0.10 mm and unchipped corners.",
            ],
          ),
          step(
            ["Виходи", "Exits"],
            [
              "Виготовте чисту підкладку з контрольованим виходом під(10;10),(30;10) мм.",
              "Make a clean backing with controlled drill exits at(10,10),(30,10) mm.",
            ],
            [
              "Підтримка близько до кожної вихідної кромки.",
              "Support lies close to each exit edge.",
            ],
          ),
          step(
            ["Свердління", "Drill"],
            [
              "Закріпіть і просвердліть перший отвір; огляньте вихід після зупинки перед повторенням другого.",
              "Clamp/drill the first hole; inspect its exit after stopping before repeating the second.",
            ],
            [
              "За сколу зупиніться й перегляньте вихід, не приховуйте його зенкуванням.",
              "Stop/review breakthrough if chipped rather than hiding it with countersinking.",
            ],
          ),
          step(
            ["Очищення", "Clean"],
            [
              "Зніміть деталь, обережно оформіть кромки й очистіть пил за робочим планом.",
              "Remove, gently break edges and clean dust under the work plan.",
            ],
            [
              "Пил не розноситься обдувом або сухим підмітанням.",
              "No air blowing or dry sweeping disperses dust.",
            ],
          ),
          step(
            ["Приймання", "Accept"],
            [
              "Перевірте дваØ, центри та відсутність відколів на A; повторіть чистим приладом.",
              "Check both diameters, centres and absence of A-edge chips; repeat with a clean instrument.",
            ],
            [
              "Крихта не створює хибної тугої посадки.",
              "Crumbs do not create a false tight fit.",
            ],
          ),
        ],
        [
          "Підтриманий чавунний зразок із чистими виходами й документованими вимірами.",
          "A backed grey-iron coupon with clean exits and recorded readings.",
        ],
        [
          [
            "Ø5,50–5,75; центри±0,15 мм; візуально без викришування функціональної A.",
            "Ø5.50–5.75; centres±0.15 mm; no visible chipping of functional A.",
          ],
        ],
        ["vise-stop"],
      ),
    ],
    finishing: [
      t(
        "Зберігайте очищеним і сухим, за потреби із сумісним захистом від корозії. Фактура сірого чавуну може бути неоднорідною без порушення розміру.",
        "Store clean/dry with compatible corrosion protection where needed. Grey-iron texture may vary without a dimensional defect.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Металевий/графітний пил контролюють професійною витяжкою й відповідним пилозбором. Пісок на піщаному виливку може містити респірабельний кристалічний кремнезем; це не тотожне кремнію у складі металу.",
        "Control metal/graphite dust with professional extraction and suitable collection. Sand on a sand casting may contain respirable crystalline silica; this is distinct from silicon in the metal composition.",
      ),
      t(
        "Без побутового пилососа, сухого підмітання й продування. Оцінка пилу визначає фільтрацію та захист дихання; сама маска не замінює контроль джерела.",
        "No household vacuum, dry sweeping or air blowing. Dust assessment determines filtration/respiratory protection; a mask alone does not replace source control.",
      ),
    ],
    sources: [
      "material-groups",
      "material-milling",
      "material-iron-tools",
      "material-foundry-dust",
      "material-dust",
    ],
    appearance: {
      color: "#555a5d",
      metalness: 0.6,
      roughness: 0.74,
      chip: "dust",
    },
  },
  {
    id: "copper",
    name: t(
      "Мідь Cu-ETP: чистий зріз без налипання",
      "Cu-ETP copper: clean cutting without adhesion",
    ),
    level: "intermediate",
    grades: t(
      "Cu-ETP / CW004A, споріднене позначення UNS C11000. Для цих вправ: C11000, підтверджений постачальником м’який відпалений стан, суцільний пруток або плита. Хімічна марка не задає стан наклепу; заміну за EN/UNS звіряють за документами.",
      "Cu-ETP / CW004A, related UNS designation C11000. These exercises specify C11000 in a supplier-certified soft annealed condition, as solid bar or plate. Alloy identity does not specify work-hardened condition; verify any EN/UNS substitution from documentation.",
    ),
    summary: t(
      "Тягуча мідь легко розмазується, утворює наріст на інструменті й вм’ятини від затиску. Навчіться відрізняти блиск від чистого різання, контролювати довгу стрічку та приймати розмір без деформації.",
      "Ductile copper can smear, adhere to the tool and dent under clamping. Learn to distinguish shine from clean cutting, manage long ribbons and inspect dimensions without distortion.",
    ),
    behaviour: [
      t(
        "Чиста мідь схильна прилипати до передньої поверхні інструмента. Наріст змінює кромку, залишає вириви й може втягувати частинки між інструментом та вже обробленою гранню.",
        "Pure copper tends to adhere to the rake face. Built-up material alters the edge, tears the finish and can trap particles between the tool and the freshly cut face.",
      ),
      t(
        "М’який відпалений стан легко приймає відбитки зубчастих кулачків і дрібної стружки під опорою. Довга безперервна стрічка можлива навіть за зовні доброї поверхні.",
        "Soft annealed stock readily takes impressions from serrated jaws or a chip beneath a support. A long continuous ribbon is possible even when the machined surface looks acceptable.",
      ),
      t(
        "Яскравий мідний колір, потемніння або блиск не встановлюють марку, твердість, шорсткість чи електричну придатність. Приклади нижче — невідповідальні механічні зразки, не розраховані струмові шини.",
        "Bright copper colour, tarnish and gloss establish neither alloy, hardness, roughness nor electrical suitability. The examples below are noncritical mechanical coupons, not rated electrical busbars.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "Підтвердьте C11000 і відпалений стан за документом. Виміряйте припуск, приберіть задирки опор і випробуйте захват на зразку: готову мідну поверхню тримайте чистими розточеними м’якими кулачками або придатною плоскою оснасткою без гострих відбитків.",
        "Confirm C11000 and its annealed condition from documentation. Measure stock allowances, deburr support contacts and qualify retention on a coupon: use clean bored soft jaws or suitable flat tooling without sharp impressions on a finished copper face.",
      ),
      t(
        "Підберіть гостру поліровану позитивну геометрію для міді; перевірте задній зазор, щоб інструмент різав, а не тиснув на поверхню. «Для кольорових металів» не означає однакової геометрії й режиму для міді та вільнорізальної латуні.",
        "Choose sharp polished positive-rake geometry suitable for copper; verify relief so the tool cuts rather than presses the surface. A nonferrous label does not imply identical geometry or cutting data for copper and free-cutting brass.",
      ),
      t(
        "Виберіть мастильно-охолоджувальну рідину, сумісну з міддю й верстатом, та перевірте її подачу до запуску. Передбачте місце для довгої стрічки й засіб її видалення після зупинки; не покладайтеся на відривання стрічки руками.",
        "Select cutting fluid compatible with copper and the machine, and verify delivery before starting. Provide space for long ribbons and equipment for removing them after stopping; do not rely on pulling chips off by hand.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "Гострий полірований HSS або позитивна твердосплавна геометрія, яку виробник допускає для чистої міді; мінімально потрібний виліт державки.",
          "Sharp polished HSS or positive carbide geometry approved by its maker for pure copper; minimum necessary holder overhang.",
        ],
        [
          "Різальна кромка по осі. Сирий поясок утримують із паспортним захватом; повторний затиск готового Ø20 виконують у розточених кулачках із чистим торцевим упором, перевіряючи биття та вм’ятини.",
          "Set the edge on centre. Retain raw stock with manual-approved engagement; remount a finished Ø20 in bored jaws with a clean axial seat, checking runout and impressions.",
        ],
        [
          "На зразку Ø20 спершу залиште Ø20,30; після виміру визначте фактичне радіальне зняття до цілі Ø19,99. Виконайте окремий чистовий прохід придатною гострою кромкою; швидкість і подача — за конкретним інструментом для відпаленої C11000.",
          "On the Ø20 coupon, first leave Ø20.30; measure before calculating actual radial removal to a Ø19.99 target. Make a separate finishing pass with a suitable sharp edge; select speed and feed for the actual tool and annealed C11000.",
        ],
        [
          "Стружка може виходити довгою гарячою стрічкою. Геометрію та робочий діапазон стружколама перевіряють пробою; зменшення подачі саме по собі не гарантує короткої стружки.",
          "Chips may form long hot ribbons. Qualify geometry and the chipbreaker operating range by trial; reducing feed alone does not guarantee short chips.",
        ],
        [
          "Послідовний слід без розмазаної губи; мікрометр підтверджує діаметр у кількох перерізах після розкріплення. Дзеркальний блиск не є критерієм за замовчуванням.",
          "Consistent traces without a smeared lip; a micrometer confirms size at several sections after release. A mirror finish is not the default criterion.",
        ],
        [
          "Не продовжуйте різання з наростом, заплутаною стрічкою або видимими слідами проковзування. Не намотуйте абразив на обертову деталь.",
          "Do not continue with built-up material, tangled ribbon or visible slipping. Never wrap abrasive around a rotating part.",
        ],
      ),
      method(
        "milling",
        [
          "Коротка гостра фреза для міді з полірованими канавками, позитивною геометрією та достатнім місцем для стружки; справна цанга й чистий хвостовик.",
          "A short sharp copper-suitable end mill with polished flutes, positive geometry and adequate chip space; a sound collet and clean shank.",
        ],
        [
          "Підтримайте площину A по жорсткій чистій підкладці, а притиски поставте над опорою. Захистіть м’яку мідь плоскими придатними контактами; перевірте утримання без вм’ятин на пробі, а не довільним послабленням затиску.",
          "Support A on a clean rigid backing and place clamps over support. Use suitable flat contacts on soft copper; qualify retention without dents on a trial rather than arbitrarily loosening the clamps.",
        ],
        [
          "Для навчальної площини залиште 0,20 мм по висоті до окремого фінішу; перед останнім проходом очистіть зону, перевірте кромку та реальний припуск. На ручному верстаті напрямок подачі обирають з урахуванням люфту й настанови верстата.",
          "For the learning face, retain 0.20 mm in height for a separate finish; clean the area and verify edge condition and actual stock before the last pass. On a manual mill, select feed direction for its backlash and operating instructions.",
        ],
        [
          "Широкі загнуті лусочки або стрічки не мають накопичуватися в канавці чи повторно потрапляти під кромку. Вихід стружки та подачу рідини плануйте ще до замкненої кишені.",
          "Broad curled flakes or ribbons must not pack the flute or be recut. Plan chip exit and fluid delivery before machining a closed pocket.",
        ],
        [
          "Рівний слід без випадкових глибоких рисок; приймайте товщину й габарит у вільному стані. Тонка стінка може віджатися без очевидного погіршення блиску.",
          "An even trace without random deep scores; inspect thickness and envelope in the free state. A thin wall can deflect without an obvious change in gloss.",
        ],
        [
          "Не копіюйте режим алюмінієвого проєкту після заміни матеріалу на мідь. Не фрезеруйте поверх крихти під опорою й не приймайте розмір у деформованому затиску.",
          "Do not copy aluminium cutting data after changing a project to copper. Never cut with debris under the support or accept a dimension while clamping distorts the part.",
        ],
      ),
      method(
        "drilling",
        [
          "Коротке гостре свердло з геометрією для в’язкої міді, вільними канавками та контрольованим биттям; для точного отвору — окреме розточування або інший кваліфікований фініш.",
          "A short sharp drill with geometry for ductile copper, clear flutes and controlled runout; use separate boring or another qualified finishing method for a precision bore.",
        ],
        [
          "Жорстко закріплена пластина й підкладка з виходами під вістря. Для прикладу завтовшки 10 мм із заглибленнями підкладки 5 мм обмежте вихід вістря до 3 мм нижче A, перевіривши фактичну геометрію свердла та всі зазори.",
          "Positively retain the plate on backing with drill-point reliefs. For the 10 mm example with 5 mm backing reliefs, limit point travel to 3 mm below A after checking actual drill geometry and all clearances.",
        ],
        [
          "Перевірте подачу рідини в канавки й пробу на заготовці тієї самої партії. Цикл виведення стружки та керування виходом виберіть за типом свердла; не затримуйте затуплену кромку в контакті.",
          "Verify fluid delivery into the flutes and trial the same material batch. Select chip-clearing and breakthrough control for the drill type; do not dwell a dull edge in contact.",
        ],
        [
          "Довгі тягучі спіралі можуть заклинити канавку. За затору або нестабільного навантаження зупиніться; стружку прибирають після повної зупинки, а не під час обертання.",
          "Long ductile helices can jam a flute. Stop for packing or unstable load; clear chips after a complete stop rather than during rotation.",
        ],
        [
          "Після дебурення отвір проходить окремий контроль діаметра й координат. Діаметр на хвостовику свердла не є результатом вимірювання отвору.",
          "After deburring, inspect diameter and coordinates independently. The size marked on the drill shank is not a hole measurement.",
        ],
        [
          "Не тримайте пластину рукою, не свердліть без перевіреного виходу та не ховайте розбитий отвір широкою фаскою.",
          "Never hand-hold the plate, drill without verified exit clearance or conceal an enlarged hole with a wide chamfer.",
        ],
      ),
      method(
        "finishing",
        [
          "Гострий ручний дебурер/скребок, придатний фасковий інструмент; дрібний абразив лише на жорсткій підкладці для окремо визначеного декоративного фінішу.",
          "A sharp hand deburrer/scraper or suitable chamfer tool; use fine abrasive on rigid backing only for a separately defined decorative finish.",
        ],
        [
          "Знята нерухома деталь на чистій м’якій опорі. Точні торці й отвори захищені від завалювання; вимірювання виконують після повного очищення.",
          "Remove and immobilise the part on clean nonmarking support. Protect accurate faces and bores from rounding; measure after complete cleaning.",
        ],
        [
          "Приберіть лише задирку, потім очистіть сумісним засобом і перевірте залишкові фрагменти. Якщо потрібний декоративний блиск, задайте його окремо; мідь може знову потемніти під час зберігання.",
          "Remove the burr rather than adjacent functional stock, clean compatibly and check for remaining fragments. Specify decorative shine separately if needed; copper may tarnish again during storage.",
        ],
        [
          "Відокремлюйте довгі гострі обрізки від дрібного абразивного пилу; збирайте відходи передбаченим способом.",
          "Separate long sharp trimmings from fine abrasive dust and collect waste by the specified method.",
        ],
        [
          "Без вільних частинок і виступаючих губ; усі функціональні розміри повторно виміряні. Полірована поверхня не підтверджує електричний контакт або тепловий опір.",
          "No loose particles or raised lips, with all functional dimensions rechecked. A polished face establishes neither electrical contact performance nor thermal resistance.",
        ],
        [
          "Не зривайте задирку пальцями й не поліруйте посадку до втрати розміру. Не використовуйте побутову кислоту або легкозаймистий розчинник як заміну технологічній рідині.",
          "Do not tear burrs off with fingers or polish a fit out of size. Never substitute a household acid or flammable solvent for a qualified process fluid.",
        ],
      ),
    ],
    defects: [
      defect(
        [
          "Рвані матові ділянки та блискучі розмазані язички.",
          "Torn dull patches and bright smeared lips.",
        ],
        [
          "Можливе налипання міді на кромку, затуплення або тертя замість різання.",
          "Possible copper adhesion, a worn edge or rubbing instead of cutting.",
        ],
        [
          "Після зупинки огляньте кромку під збільшенням, задній зазор, подачу рідини й фактичне зняття.",
          "After stopping inspect the edge under magnification, relief, fluid delivery and actual material removal.",
        ],
        [
          "Відновіть придатну гостру поліровану кромку; звірте геометрію й дані для C11000, перевірте контрольний прохід на припуску. Не стирайте дефект поліруванням до контролю.",
          "Restore a suitable sharp polished edge; verify geometry and C11000 data, then qualify a trial pass on allowance. Inspect before polishing away the evidence.",
        ],
      ),
      defect(
        [
          "Випадкові глибокі риски перетинають регулярний слід.",
          "Random deep scores cross the regular tool trace.",
        ],
        [
          "Можливе повторне різання затриманої стрічки або частинка під різальною кромкою.",
          "Possible recutting of retained ribbon or a particle trapped at the cutting edge.",
        ],
        [
          "Огляньте канавки, вихід стружки та кромку; перевірте також чистоту опор і поверхні перед вимірюванням.",
          "Inspect flutes, chip exit and edge; also check support and surface cleanliness before measurement.",
        ],
        [
          "Очистіть після зупинки, виправте виведення стружки; виміряйте глибину пошкодження належним методом і оцініть достатність припуску перед фінішем.",
          "Clean after stopping and correct evacuation; assess damage depth with an appropriate method and establish sufficient stock before finishing.",
        ],
      ),
      defect(
        [
          "Відбитки кулачків, овальність або зміна розміру після розкріплення.",
          "Jaw impressions, ovality or a size change after release.",
        ],
        [
          "Можливий надмірний локальний тиск, стружка в контакті або недостатня підтримка м’якої заготовки.",
          "Possible excessive local pressure, debris at a contact or inadequate support of soft stock.",
        ],
        [
          "Порівняйте чисту вільну деталь із виміром у затиску; огляньте площу контакту, биття й сліди проковзування.",
          "Compare the clean free part with its clamped reading; inspect contact area, runout and signs of slipping.",
        ],
        [
          "Переробіть контакт/м’які кулачки та кваліфікуйте утримання на зразку; не усувайте вм’ятини простим послабленням затиску без перевірки сили різання. Повторіть вільний контроль.",
          "Revise contacts/soft jaws and qualify retention on a coupon; do not cure dents by simply loosening the clamp without checking cutting-force retention. Repeat free-state inspection.",
        ],
      ),
      defect(
        [
          "Довга приєднана губа на виході свердла.",
          "A long attached lip at drill breakthrough.",
        ],
        [
          "В’язка мідь деформується на виході; причиною можуть бути слабка підтримка, зношені кромки або непридатне керування виходом.",
          "Ductile copper deforms at breakthrough; possible contributors include poor support, worn lips or unsuitable exit control.",
        ],
        [
          "Огляньте обидва боки, стан свердла та отвір підкладки; перевірте фактичний хід вістря до наступної проби.",
          "Inspect both faces, drill condition and backing relief; verify actual point travel before another trial.",
        ],
        [
          "Відновіть опору й відпрацюйте вихід на зразку за рекомендацією свердла. Зніміть губу окремою контрольованою операцією та повторно перевірте діаметр і прилягання.",
          "Restore support and qualify breakthrough on a sample using drillmaker guidance. Remove the lip in a separate controlled operation and recheck diameter and seating.",
        ],
      ),
      defect(
        [
          "Нестабільне навантаження свердла й подряпаний отвір.",
          "Unstable drilling load and a scored bore.",
        ],
        [
          "Можливий затор довгої стружки, биття або втрата подачі рідини.",
          "Possible long-chip packing, runout or loss of fluid delivery.",
        ],
        [
          "Зупиніться, перевірте канавки, обидві кромки, тримач і потік. Виміряйте отвір у двох напрямках на кількох глибинах.",
          "Stop and inspect flutes, both lips, holder and flow. Measure the bore in two directions at several depths.",
        ],
        [
          "Відновіть справний інструмент і відведення; перевірте цикл для реальної глибини. Отвір поза межами не приймають за діаметром свердла або виглядом фаски.",
          "Restore sound tooling and evacuation and qualify the cycle for the actual depth. Do not accept an out-of-limit bore from the marked drill size or chamfer appearance.",
        ],
      ),
    ],
    exercises: [
      exercise(
        [
          "Мідна навчальна проставка без відбитків кулачків",
          "Copper practice spacer without jaw impressions",
        ],
        [
          "Повторити геометрію spacer: Ø20 ×15 з наскрізним Ø8,5, але на відпаленій C11000. Це зміна матеріалу: геометрія, бази й перестановка з проєкту залишаються орієнтиром; інструмент, режими й утримання кваліфікують для міді.",
          "Repeat the spacer geometry: Ø20 ×15 with a through Ø8.5 bore, using annealed C11000. This is a material change: use the project geometry, datums and remounting as references, while requalifying tools, data and retention for copper.",
        ],
        [
          "C11000, підтверджений м’який відпалений стан, Ø22 ×40 мм; додаткова довжина потрібна для захвату й відділення пиляним різом.",
          "C11000, supplier-confirmed soft annealed condition, Ø22 ×40 mm; extra length provides grip and a saw-separation allowance.",
        ],
        [
          [
            "Токарний, гострий полірований різець для міді, свердло Ø8,0, малий розточний різець із паспортним мінімальним отвором не більше 8 мм, фасковий інструмент.",
            "Lathe, sharp polished copper-suitable tool, Ø8.0 drill, small boring tool with a rated minimum bore no larger than 8 mm, and chamfer tool.",
          ],
          [
            "Придатний патрон, розточувані м’які кулачки за маршрутом spacer, пилка з окремим затиском; мікрометр, нутромір/контрольні пробки та індикатор.",
            "Suitable chuck and boreable soft jaws following the spacer route, saw with separate workholding, micrometer, bore gauge/checking plugs and indicator.",
          ],
        ],
        [
          step(
            [
              "Приймання та проба захвату",
              "Receive stock and qualify retention",
            ],
            [
              "Перевірте марку/стан, запас і верстат; сплануйте 20 мм оброблюваного вильоту та достатній паспортний захват. На незадіяній ділянці випробуйте контакт без проковзування й неприйнятних відбитків. Підготуйте м’які кулачки під готовий Ø20 із торцевим упором за окремими кроками проєкту.",
              "Verify grade/condition, allowance and machine; plan 20 mm machining projection and sufficient manual-approved grip. Trial contact on unused stock for retention without unacceptable impressions. Prepare Ø20 bored soft jaws with an axial seat using the project’s separate manufacture steps.",
            ],
            [
              "Планований різець, свердло й тримач проходять усю траєкторію без контакту з кулачками; параметри обрані саме для C11000.",
              "The planned tool, drill and holder clear the jaws throughout their paths; data are selected for C11000.",
            ],
          ),
          step(
            [
              "База A, зовнішній діаметр і отвір",
              "Face A, outside diameter and bore",
            ],
            [
              "Підріжте A й установіть від нього нуль. Проточіть довжину 16,2 мм: чорновий Ø20,30, вимір, фініш до цілі Ø19,99. Просвердліть Ø8,0 за майбутню довжину 16,2 з перевіреним ходом, не доходячи до захвату; розточіть до цілі Ø8,55.",
              "Face A and establish zero there. Turn over 16.2 mm: rough Ø20.30, measure, then finish toward Ø19.99. Drill Ø8.0 beyond the future 16.2 mm length with verified travel clear of the grip; bore toward Ø8.55.",
            ],
            [
              "Ø19,98–20,00; отвір 8,50–8,60 мм. Огляньте кромку й стружку після зупинки; виміри робіть чистими охолодженими приладами.",
              "Ø19.98–20.00; bore 8.50–8.60 mm. Inspect edge and chips after stopping; use clean temperature-stabilised instruments.",
            ],
          ),
          step(
            [
              "Відділення та перенесення бази",
              "Separate and transfer the datum",
            ],
            [
              "Зніміть пруток після ізоляції й відпиляйте на 16,2±0,2 мм від A в окремому пильному затиску. Приберіть лише контактні задирки; очистіть A й кулачки. Посадіть A до торцевого упору, затисніть готовий Ø20 у розточених м’яких кулачках і перевірте биття до різання.",
              "After isolation remove the bar and saw at 16.2±0.2 mm from A using separate saw workholding. Remove contact burrs, clean A and jaws, seat A against the axial stop and retain finished Ø20 in the bored soft jaws. Check runout before cutting.",
            ],
            [
              "A прилягає без стружки; захват і виліт прийняті для цієї деталі, мідь не має нових вм’ятин.",
              "A seats without chips; qualify engagement/projection for this part and check for new copper impressions.",
            ],
          ),
          step(
            ["Другий торець і краї", "Finish the second face and edges"],
            [
              "Залишок довжини зніміть окремим чорновим і чистовим підрізанням до цілі 15,00 мм; визначайте останнє зняття виміром, а не лише шкалою. Виконайте фаски 0,3–0,5 мм за проєктом без втрати опорної площі.",
              "Remove remaining length with separate rough and finish facing toward 15.00 mm; calculate the final cut from measurement rather than the dial alone. Apply the project’s 0.3–0.5 mm chamfers without excessive loss of seating area.",
            ],
            [
              "Довжина 14,97–15,03 мм; жодної довгої приєднаної губи в отворі або на зовнішньому краї.",
              "Length 14.97–15.03 mm, with no long attached lip in the bore or at the outside edge.",
            ],
          ),
          step(
            [
              "Вільний контроль і порівняння поверхні",
              "Inspect free-state size and compare the finish",
            ],
            [
              "Розкріпіть, очистіть і термостабілізуйте. Виміряйте Ø у двох напрямках на трьох перерізах, отвір — на двох глибинах, довжину — у чотирьох місцях біля краю. Запишіть крайні значення, температуру й фото за одного світла; зіставте з виглядом налипання в ілюстраціях.",
              "Release, clean and temperature-stabilise. Measure OD in two directions at three sections, bore at two depths and length at four positions near the edge. Record extremes, temperature and a photo under consistent light; compare with the illustrated adhesion clues.",
            ],
            [
              "Кожний показ у своїх межах; розкид довжини не більше 0,03 мм. Контроль биття отвору від зовнішньої бази — за методом spacer, TIR не більше 0,05 мм.",
              "Every reading meets its limits; length spread no greater than 0.03 mm. Check bore runout from the external datum using the spacer method, TIR no greater than 0.05 mm.",
            ],
          ),
        ],
        [
          "Навчальна механічна проставка з прийнятими розмірами та без видимих відбитків готової поверхні. Вона не є силовою проставкою або електрично/термічно атестованою деталлю.",
          "A mechanical practice spacer with accepted dimensions and no visible impressions on its finished surface. It is not a load-rated spacer or an electrically/thermally qualified component.",
        ],
        [
          [
            "Ø19,98–20,00; довжина 14,97–15,03; отвір 8,50–8,60 мм. Зовнішній мікрометр і придатний нутромір/пробки; записуйте щонайменше два повтори у вільному стані.",
            "Ø19.98–20.00; length 14.97–15.03; bore 8.50–8.60 mm. Use an outside micrometer and suitable bore gauge/plugs; record at least two free-state repeats.",
          ],
          [
            "Розкид товщини по торцях ≤0,03 мм і биття отвору ≤0,05 мм TIR за проєктом; ці виміри не замінюють окрему атестацію площинності або шорсткості.",
            "Face-thickness spread ≤0.03 mm and bore runout ≤0.05 mm TIR under the project method; these checks do not replace separate flatness or roughness assessment.",
          ],
        ],
        ["spacer"],
      ),
      exercise(
        [
          "Мідна пластина: опори без вм’ятин і чотири чисті виходи",
          "Copper plate: nonmarking support and four clean breakthroughs",
        ],
        [
          "Використати геометрію й перестановки fixture-plate для мідного навчального макета. C11000 замінює алюміній: для міді окремо перевіряють інструмент, затиск, мастило й режим; несучу здатність проєкту не переносять.",
          "Use the fixture-plate geometry and remounting for a copper learning coupon. C11000 replaces aluminium: requalify tooling, workholding, lubrication and cutting data for copper; no load capacity is transferred.",
        ],
        [
          "C11000 у підтвердженому м’якому відпаленому стані, 84 ×54 ×14 мм; готова геометрія 80 ×50 ×10 мм.",
          "C11000 in supplier-confirmed soft annealed condition, 84 ×54 ×14 mm; finished geometry 80 ×50 ×10 mm.",
        ],
        [
          [
            "Фрезерний із DRO, гостра полірована фреза для міді, свердло Ø6,6, фасковий інструмент; рідина, сумісна з міддю.",
            "Mill with DRO, sharp polished copper-suitable end mill, Ø6.6 drill, chamfer tool and copper-compatible fluid.",
          ],
          [
            "Лещата/притиски з прийнятими плоскими контактами, підкладка за fixture-plate із виходами завглибшки 5 мм; мікрометр, висотомір із перевіреними пробками та придатні калібри отворів.",
            "Vise/clamps with qualified flat contacts, the fixture-plate backing with 5 mm-deep exit reliefs, micrometer, height gauge with known checking pins and suitable bore gauges.",
          ],
        ],
        [
          step(
            [
              "Маршрут, проба кромки й контакти",
              "Plan the route, trial the edge and contacts",
            ],
            [
              "Перевірте C11000 і припуск. На зразку тієї самої партії випробуйте гостру кромку, подачу рідини, вихід стружки й контакт затиску без проковзування/вм’ятин. Використовуйте карту шести граней fixture-plate як порядок створення A/B/C, але не її алюмінієві режими.",
              "Verify C11000 and allowance. Trial edge sharpness, fluid delivery, chip exit and clamp contact on the same batch for retention without slipping or dents. Use the fixture-plate six-face sheet to establish A/B/C, while replacing its aluminium cutting data.",
            ],
            [
              "Контакти підтримані; виліт фрези й огинаючі тримача/притисків перевірені. Немає стружки під опорною гранню.",
              "Support the contacts, verify cutter projection and holder/clamp envelopes, and remove all chips beneath the support face.",
            ],
          ),
          step(
            [
              "Шість граней і вільний габарит",
              "Machine six faces and inspect the free envelope",
            ],
            [
              "Створіть A — нижню опору, B — бік Y0, C — торець X0 за окремими встановленнями проєкту. До чистових проходів залиште 0,20 мм по висоті й 0,20 мм на оброблюваному боці; перед кожним фінішем виміряйте реальний залишок. Переносьте бази очищеними контактами, перевіряючи повторну посадку.",
              "Create A as the lower support, B as Y0 side and C as X0 end using the project’s separate setups. Retain 0.20 mm in height and 0.20 mm at the machined side before finishing; measure actual remaining stock before each final pass. Transfer datums through clean contacts and verify reseating.",
            ],
            [
              "У вільному стані: X 79,95–80,05; Y 49,95–50,05; Z 9,97–10,03 мм. Перевірте товщину в кількох точках і відсутність вм’ятин.",
              "Free-state limits: X 79.95–80.05; Y 49.95–50.05; Z 9.97–10.03 mm. Check thickness at several points and inspect for dents.",
            ],
          ),
          step(
            [
              "Виготовлення підкладки та координати",
              "Make the backing and establish coordinates",
            ],
            [
              "Виготовте й прийміть підкладку за окремими кроками fixture-plate. Перевірте центри виходів, їхню глибину 5 мм і чистоту площини. Установіть мідну пластину на A, відновіть X0 від C та Y0 від B. Центри отворів: (15;10), (65;10), (15;40), (65;40) мм.",
              "Manufacture and accept the backing using the separate fixture-plate steps. Check relief centres, 5 mm relief depth and face cleanliness. Seat the copper plate on A; recover X0 from C and Y0 from B. Hole centres are (15,10), (65,10), (15,40), (65,40) mm.",
            ],
            [
              "Нуль перевірений незалежно після перестановки. Притиски не перекривають отвори, а весь хід свердла й тримача доступний.",
              "Independently verify the origin after remounting. Clamps clear the holes and the complete drill/holder travel is accessible.",
            ],
          ),
          step(
            [
              "Свердління з визначеним виходом",
              "Drill with defined breakthrough travel",
            ],
            [
              "Після проби на відрізку тієї самої партії просвердліть чотири Ø6,6 з подачею сумісної рідини й кваліфікованим циклом. Обмежте вістря до 3 мм нижче A; перевірте, що фактичне вістря формує повний наскрізний Ø і залишається в 5-мм виході. Після зупинки зніміть деталь і контрольовано дебуруйте обидва боки.",
              "After trialling an offcut from the same batch, drill four Ø6.6 holes using compatible fluid and a qualified cycle. Limit point travel to 3 mm below A; verify that the actual drill forms a full-diameter breakthrough while remaining within the 5 mm relief. After stopping, remove the part and deburr both faces deliberately.",
            ],
            [
              "Немає затору, проковзування чи контакту вістря з дном виходу. Усі чотири нижні губи оглянуті; жодного знімання задирки пальцями.",
              "No chip packing, slipping or drill-point contact with the relief floor. Inspect all four exit lips; never pull burrs off with fingers.",
            ],
          ),
          step(
            [
              "Приймання й фото однаковим світлом",
              "Accept and photograph under consistent light",
            ],
            [
              "Очистіть, розкріпіть і термостабілізуйте. Перевірте габарит, кожний Ø, координати від B/C та кроки 50 мм уздовж X і 30 мм уздовж Y. Висотоміром із відомими пробками враховуйте їхні радіуси; порівняйте поверхню з ілюстраціями розмазування/рисок.",
              "Clean, release and temperature-stabilise. Check the envelope, each bore, coordinates from B/C and the 50 mm X and 30 mm Y pitches. When using a height gauge with known pins, account for their radii; compare the finish with the smear/score illustrations.",
            ],
            [
              "Отвори 6,60–6,75 мм; центри в межах ±0,05 мм від заданих X/Y, крок X 49,93–50,07 і Y 29,93–30,07 мм. Вхідна фаска не замінює контроль виходу.",
              "Holes 6.60–6.75 mm; centres within ±0.05 mm of the stated X/Y, X pitch 49.93–50.07 and Y pitch 29.93–30.07 mm. An entry chamfer does not replace exit inspection.",
            ],
          ),
        ],
        [
          "Мідний навчальний макет із чотирма виміряними отворами, чистими опорами й контрольованими кромками. Це не струмова шина, не тепловий інтерфейс із заданим опором і не силова плита затиску.",
          "A copper learning coupon with four measured holes, clean seating faces and controlled edges. It is not a rated busbar, a specified-resistance thermal interface or a load-rated clamping plate.",
        ],
        [
          [
            "X 79,95–80,05; Y 49,95–50,05; Z 9,97–10,03 мм. Отвори 6,60–6,75 мм. Запишіть мінімум/максимум товщини та всі координати після розкріплення.",
            "X 79.95–80.05; Y 49.95–50.05; Z 9.97–10.03 mm. Holes 6.60–6.75 mm. Record thickness minimum/maximum and all coordinates after release.",
          ],
          [
            "Координати ±0,05 мм і кроки ±0,07 мм перевіряйте придатними приладами, а не лише DRO або штангенциркулем. Фото документує видимі риски/вм’ятини, але не числове Ra.",
            "Verify ±0.05 mm coordinates and ±0.07 mm pitches with suitable instruments rather than DRO or calipers alone. Photographs document visible scores/dents, not numerical Ra.",
          ],
        ],
        ["fixture-plate"],
      ),
    ],
    finishing: [
      t(
        "Після різання спочатку контролюють геометрію й вихідні губи, потім — окремо заданий декоративний фініш. Полірування м’якої міді легко завалює краї й замазує сліди; функціональні площини захищають і повторно вимірюють.",
        "After cutting, inspect geometry and exit lips before any separately specified decorative finish. Polishing soft copper can round edges and smear evidence; protect functional faces and remeasure.",
      ),
      t(
        "Для зберігання очистіть і висушіть сумісним способом; вимоги до захисного покриття задають окремо. Не знімайте потемніння абразивом із посадки без оцінки втрати розміру.",
        "For storage, clean and dry by a compatible method; specify any protective coating separately. Do not abrade tarnish from a fit without assessing material loss.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Довга мідна стрічка гостра й може бути гарячою, намотуватися на патрон або свердло. За накопичення припиніть різання, дочекайтеся повної зупинки й застосуйте передбачений гачок/щітку; рукавички не наближають до обертання.",
        "Long copper ribbons are sharp, may be hot and can wind around a chuck or drill. Stop cutting for accumulation, wait for a complete stop and use the specified hook/brush; never bring gloves near rotation.",
      ),
      t(
        "Мідна стружка проводить струм: не допускайте її до електрошаф, розеток та відкритої електроніки. Навчальні зразки не випробовують під напругою як саморобні шини або контакти.",
        "Copper chips conduct electricity: keep them out of electrical cabinets, outlets and exposed electronics. Do not energise the practice coupons as improvised busbars or contacts.",
      ),
      t(
        "Не нагрівайте невідому мідну заготовку полум’ям для «поліпшення обробки»; стан постачання та будь-яку термообробку встановлюють документовано. Стружка, рідина й абразивний пил не мають потрапляти до їжі.",
        "Do not flame-heat unidentified copper to improve machining; establish supply condition and any heat treatment through a documented process. Keep chips, fluid and abrasive dust away from food.",
      ),
    ],
    sources: ["material-copper-cut", "material-c110", "material-drilling"],
    appearance: {
      color: "#bd7956",
      metalness: 0.86,
      roughness: 0.34,
      chip: "ribbon",
    },
  },

  {
    id: "titanium",
    name: t(
      "Титан Grade2: лише підготовлена операція",
      "Titanium Grade2: qualified operations",
    ),
    level: "advanced",
    grades: t(
      "Комерційно чистий титан Grade2 / UNSR50400 у документованому стані. Це не Ti-6Al-4V Grade5; дані й приймання для сплавів не підставляють автоматично.",
      "Commercially pure titanium Grade2 / UNSR50400 in a documented condition. This is not Ti-6Al-4V Grade5; alloy data and acceptance do not transfer automatically.",
    ),
    summary: t(
      "Низька теплопровідність, адгезія й пружний віджим вимагають підготовленого обладнання, охолодження та плану поводження зі стружкою. Вправи тут — інженерна підготовка й контроль готового зразка, не перший самостійний різ новачка.",
      "Low thermal conductivity, adhesion and elastic deflection require prepared equipment, cooling and chip management. Exercises cover engineering preparation and finished-coupon inspection rather than a beginner’s first independent cut.",
    ),
    behaviour: [
      t(
        "Тепло концентрується біля крайки, можливі налипання й швидка втрата ресурсу; декоративний колір не є термометром.",
        "Heat concentrates near the edge; adhesion and rapid wear are possible, while surface colour is not a thermometer.",
      ),
      t(
        "Нижча жорсткість порівняно зі сталлю збільшує значення підтримки; легкий повторний прохід може лише терти.",
        "Lower stiffness than steel increases support requirements; a light repeat pass may only rub.",
      ),
      appearanceNote,
    ],
    preparation: [
      machineGate,
      t(
        "До різання потрібні SDS саме поставки, документ інструмента дляGrade2, перевірена подача рідини, окреме збирання стружки та затверджений план аварійного реагування. За відсутності будь-якого пункту різання не починають.",
        "Before cutting obtain the stock SDS,Grade2 tool guidance, verified fluid delivery, segregated chip collection and an approved emergency response plan. Do not begin cutting with any item missing.",
      ),
      t(
        "Пожежні засоби мають бути сумісні саме з титаном за SDS й місцевим планом; напис «порошковий» сам по собі недостатній. Прибирання — за окремою процедурою, без побутового пилососа.",
        "Fire media must be titanium-compatible under the SDS/site plan; a generic powder label is insufficient. Use a separate cleaning procedure, never a household vacuum.",
      ),
      inspection,
    ],
    methods: [
      method(
        "turning",
        [
          "Гостра позитивна твердосплавна крайка дляGrade2 у короткій жорсткій державці; HSS лише там, де його виробник підтвердив операцію.",
          "Sharp positiveGrade2 carbide in a short rigid holder; HSS only where its maker qualifies the operation.",
        ],
        [
          "Підтримана масивна заготовка, перевірена висота центра й жорсткість; надійна доставка схваленої рідини.",
          "Supported solid stock with verified centre height/rigidity and reliable approved fluid delivery.",
        ],
        [
          "Застосуйте окремо кваліфікований режим, сталий різ і планову перевірку зносу. Не робіть пробу без охолодження як навчальне порівняння.",
          "Use a separately qualified schedule, consistent cutting and planned wear inspection. Do not compare by trial-cutting without coolant.",
        ],
        [
          "Коротка або стрічкова гаряча стружка; форма не підтверджує пожежної безпеки.",
          "Short or ribbon-like hot chips; shape does not establish fire safety.",
        ],
        [
          "Без налиплих борозен і розтирання; геометрія й стан поверхні прийняті окремо.",
          "No adhesive grooves or rubbing; accept geometry and surface condition separately.",
        ],
        [
          "Не копіюйте режими сталі/алюмінію й не продовжуйте при втраті рідини чи ознаках перегріву.",
          "Do not copy steel/aluminium data or continue after fluid loss or overheating signs.",
        ],
      ),
      method(
        "milling",
        [
          "Коротка твердосплавна фреза для титану, контрольований знос і тримач із перевіреним биттям.",
          "Short titanium-specific carbide cutter with wear control and a runout-checked holder.",
        ],
        [
          "Жорсткий підтриманий затиск, симуляція тримача/притисків і перевірена система охолодження.",
          "Rigid supported retention, holder/clamp simulation and verified coolant system.",
        ],
        [
          "Траєкторія з плавними змінами залучення й уникненням повторного різання стружки; режими затверджені до першого контакту.",
          "Use smooth engagement changes and avoid chip recutting; approve cutting data before first contact.",
        ],
        [
          "Гаряча стружка накопичується окремо за робочим планом; не змішується зі шліфувальним пилом.",
          "Collect hot chips separately under the work plan rather than mixing with grinding dust.",
        ],
        [
          "Рівний різ без локального замазування; віджим перевірений вільними вимірами.",
          "An even cut without local smearing; assess deflection through free-state inspection.",
        ],
        [
          "Не робіть суху пробу й не продувайте дрібний титан у повітря.",
          "Do not perform a dry trial or disperse titanium fines into the air.",
        ],
      ),
      method(
        "drilling",
        [
          "Коротке свердло, прямо рекомендоване дляGrade2 й глибини; карбід потребує відповідної жорсткості, HSS-Co — власних даних.",
          "Short drill explicitly suited toGrade2/depth; carbide requires rigidity and HSS-Co its own data.",
        ],
        [
          "Позитивне утримання, контроль осі та безперервна придатна доставка рідини до крайок.",
          "Positive retention, axis control and continuous suitable fluid delivery to the edges.",
        ],
        [
          "Використовуйте погоджений цикл відведення й перевірку зносу; втрату стружки, рідини чи різке зростання навантаження вважайте умовою зупинки.",
          "Use qualified clearing/wear checks; stop for loss of chips/fluid or a sharp load increase.",
        ],
        [
          "Затор гарячих спіралей небезпечний; руки й гачок не входять до обертового свердла.",
          "Blocked hot spirals are hazardous; keep hands/hooks away from the rotating drill.",
        ],
        [
          "Контрольована геометрія без адгезійних задирів; отвір прийнятий після очищення.",
          "Controlled geometry without adhesive scoring; accept after cleaning.",
        ],
        [
          "Не намагайтеся продавити затуплене свердло й не замінюйте рідину випадковим аерозолем.",
          "Do not force a dull drill or substitute a random aerosol for the approved fluid.",
        ],
      ),
      method(
        "finishing",
        [
          "Придатний ручний дебурер та окремі чисті інструменти; шліфування — лише в спеціально оціненому процесі.",
          "Suitable hand deburrer and dedicated clean tools; grinding requires a separately assessed process.",
        ],
        [
          "Статична підтримка, контроль дрібних відходів, визначений напрямок очищення.",
          "Static support, fine-waste control and a defined cleaning method.",
        ],
        [
          "Видаляйте тільки задирки. Для кольорового покриття/анодування потрібна окрема технологія; не нагрівайте деталь для демонстрації кольору.",
          "Remove only burrs. Colour coating/anodising needs a separate process; do not heat a part to demonstrate colour.",
        ],
        [
          "Дрібний пил істотно небезпечніший за масивну деталь; не створюйте його декоративним шліфуванням.",
          "Fine dust is materially more hazardous than solid stock; do not generate it through decorative grinding.",
        ],
        [
          "Чиста поверхня без залишків інструмента; відсутність кольору не доводить відсутності пошкодження.",
          "A clean surface without tool deposits; lack of colour does not prove absence of damage.",
        ],
        [
          "Не використовуйте полум’я, невідомий абразив або побутовий пилосос.",
          "Do not use flame, unidentified abrasives or a household vacuum.",
        ],
      ),
    ],
    defects: [
      defect(
        ["Налипання, борозни, задири.", "Adhesion, grooves and scoring."],
        [
          "Реакція з крайкою, знос або невідповідна рідина.",
          "Edge interaction, wear or unsuitable fluid.",
        ],
        [
          "Зупиніть і перевірте крайку, подачу рідини та марку матеріалу.",
          "Stop and check edge, fluid delivery and material grade.",
        ],
        [
          "Замініть інструмент/умови за кваліфікованою картою; оцініть пошкодження до наступного проходу.",
          "Replace tooling/conditions under the qualified sheet and assess damage before another pass.",
        ],
      ),
      defect(
        [
          "Розмір відновлюється після проходу.",
          "Size springs back after the cut.",
        ],
        ["Пружний віджим інструмента/деталі.", "Elastic tool/work deflection."],
        [
          "Перевірте підтримку, виліт і вільні повторні виміри.",
          "Check support, projection and repeated free-state measurements.",
        ],
        [
          "Підвищте жорсткість і перегляньте припуск; не тріть серією нульових проходів.",
          "Improve rigidity and review allowance rather than making repeated rubbing passes.",
        ],
      ),
      defect(
        [
          "Кольорова зона або різкий ріст температурних ознак.",
          "Heat tint or rapidly increasing heat signs.",
        ],
        [
          "Можливе порушення охолодження/знос, але колір не задає температуру.",
          "Possible cooling loss/wear, while colour does not specify temperature.",
        ],
        [
          "Зупиніть, перевірте систему й інструмент без торкання гарячої деталі.",
          "Stop and inspect system/tool without touching hot work.",
        ],
        [
          "Відновіть причину та оформіть рішення щодо поверхні; не поліруйте колір для приховування.",
          "Correct the cause and disposition the surface rather than polishing away colour to conceal it.",
        ],
      ),
      defect(
        [
          "Пил, іскри чи початок займання відходів.",
          "Dust, sparks or incipient waste ignition.",
        ],
        [
          "Неприйнятний нагрів/накопичення або невідповідний процес.",
          "Unacceptable heating/accumulation or unsuitable process.",
        ],
        [
          "Без наближення оцініть потребу виходу; застосуйте план тривоги.",
          "Assess evacuation without approaching and activate the alarm plan.",
        ],
        [
          "Новачок відходить, попереджає людей і викликає підготовлену допомогу; гасіння виконує лише навчена особа сумісним засобом.",
          "A beginner withdraws, warns others and summons trained help; only trained responders use compatible media.",
        ],
      ),
    ],
    exercises: [
      exercise(
        [
          "Grade2: перевірка готовності без різання",
          "Grade2: preflight without cutting",
        ],
        [
          "Підготувати інженерну картуØ20 ×15 зØ8,5; spacer — лише геометрична схема з новою матеріальною ревізією.",
          "Prepare an engineering sheet forØ20 ×15 withØ8.5; spacer is only a geometry reference with a new material revision.",
        ],
        [
          "ДокументованийGrade2 Ø25 ×45 мм; для пробної посадки — окремий інертний макет того самого габариту.",
          "DocumentedGrade2 Ø25 ×45 mm; use a separate inert same-size dummy for trial seating.",
        ],
        [
          [
            "Документи інструмента/SDS, креслення затиску, індикатор, засоби перевірки рідини та аварійний план.",
            "Tool/SDS documents, retention drawing, indicator, fluid-verification equipment and emergency plan.",
          ],
        ],
        [
          step(
            ["Матеріальна ревізія", "Material revision"],
            [
              "Запишіть Grade2, стан, невідповідальне призначення таØ20 ×15/Ø8,5; виключіть підміну Grade5.",
              "RecordGrade2, condition, noncritical purpose andØ20 ×15/Ø8.5; rule outGrade5 substitution.",
            ],
            [
              "Сертифікат і SDS відповідають партії.",
              "Certificate/SDS match the batch.",
            ],
          ),
          step(
            ["Оснастка", "Workholding"],
            [
              "На зупиненому ізольованому обладнанні приміряйте інертний макет, перевірте захват, доступ торців і зазор усіх інструментів.",
              "On stopped/isolated equipment trial the inert dummy; check grip, face access and every tool clearance.",
            ],
            [
              "Жодної прихованої перестановки або невідомого упора.",
              "No hidden remount or unintended stop.",
            ],
          ),
          step(
            ["Інструмент і рідина", "Tooling and fluid"],
            [
              "Оберіть конкретні артикули дляGrade2; запишіть їхні рекомендовані дані, обмеження верстата та перевірену доставку рідини без різання.",
              "Choose exactGrade2 tools; record recommended data, machine limits and verified fluid delivery without cutting.",
            ],
            [
              "Карту можна перевірити за документами, без вигаданих універсальнихRPM.",
              "The sheet is auditable against documents, without invented universalRPM.",
            ],
          ),
          step(
            ["Стружка й аварія", "Chips and emergency"],
            [
              "Визначте придатну тару/прибирання за SDS, маршрут відходу й сумісні засоби лише для підготовлених осіб.",
              "Define SDS-compliant collection/cleaning, evacuation route and compatible media for trained responders.",
            ],
            [
              "Новачок знає дію «зупинити безпечно, відійти, повідомити», не самостійне гасіння.",
              "Beginner action is safe stopping, withdrawal and alerting rather than independent firefighting.",
            ],
          ),
          step(
            ["Рішення", "Disposition"],
            [
              "Перевірте повноту карти з компетентним технологом; відсутні дані означають «до різання не готово». Вправа завершується без запуску різання.",
              "Review completeness with a competent process engineer; missing data means not ready for cutting. The exercise ends without starting a cut.",
            ],
            [
              "Є перелік підтверджених умов і конкретних невирішених пунктів.",
              "Record verified conditions and specific unresolved items.",
            ],
          ),
        ],
        [
          "Перевірювана карта підготовки та рішення про готовність, а не титановий виріб.",
          "An auditable preflight and readiness decision rather than a titanium product.",
        ],
        [
          [
            "Виміряйте фактичний габарит макета, відстані до кулачків і допустимі вильоти; занесіть числа в карту.",
            "Measure dummy envelope, jaw clearances and permissible projections; record values.",
          ],
        ],
        ["spacer"],
      ),
      exercise(
        [
          "Grade2: приймання готового зразка",
          "Grade2: inspect a finished coupon",
        ],
        [
          "Вивчити геометрію та поверхню заздалегідь виготовленого професійним процесом зразка без шліфування чи різання.",
          "Study geometry/surface on a professionally pre-machined sample without grinding or cutting.",
        ],
        [
          "Документований готовийGrade2 зразокØ20 ×15, наскрізнийØ8,5; не медична/силова деталь.",
          "Documented pre-machinedGrade2 sampleØ20 ×15,Ø8.5 through bore; no medical/load-bearing use.",
        ],
        [
          [
            "Мікрометр0–25, пробки/нутромір, чиста плита, лупа й фото з однаковим світлом.",
            "0–25 micrometer, plugs/bore gauge, clean plate, magnifier and consistent-light photographs.",
          ],
        ],
        [
          step(
            ["Походження", "Traceability"],
            [
              "Звірте Grade2, номер зразка й протокол виготовлення; фото процесу не підміняє сертифікат.",
              "CheckGrade2, sample ID and manufacturing record; process photos do not replace certification.",
            ],
            [
              "Відомі матеріал та межі навчального використання.",
              "Material and learning-use boundaries are known.",
            ],
          ),
          step(
            ["Очищення", "Clean"],
            [
              "Очистіть сумісним засобом, дайте температурі стабілізуватися, огляньте задирки без ручного торкання гострих зон.",
              "Clean compatibly, stabilise temperature and inspect burrs without touching sharp regions.",
            ],
            [
              "Жодного полірування або утворення пилу.",
              "No polishing or dust generation.",
            ],
          ),
          step(
            ["Зовнішній розмір", "External dimensions"],
            [
              "ВиміряйтеØ у двох напрямках на двох перерізах, довжину — у п’яти точках.",
              "Measure diameter in two directions at two sections and length at five points.",
            ],
            [
              "Записані окремі значення, мінімум і максимум.",
              "Record individual values, minimum and maximum.",
            ],
          ),
          step(
            ["Отвір і поверхня", "Bore and surface"],
            [
              "ПеревіртеØ8,5, огляньте задири й колір під одним світлом; жодного висновку про Ra/температуру лише за фото.",
              "CheckØ8.5 and inspect scoring/colour under consistent light; infer neitherRa nor temperature from a photo alone.",
            ],
            [
              "Невстановлені властивості позначені неперевіреними.",
              "Mark undetermined properties unverified.",
            ],
          ),
          step(
            ["Протокол", "Record"],
            [
              "Порівняйте з навчальними межами й відокремте геометричне приймання від стану поверхні. Збережіть фото дефектів для розбору.",
              "Compare with learning limits, separating geometry acceptance from surface integrity; save defect photographs for review.",
            ],
            [
              "Зразок не оголошений придатним для відповідального застосування.",
              "Do not approve the sample for critical service.",
            ],
          ),
        ],
        [
          "Карта вимірів і опис стану поверхні без небезпечного самостійного різання.",
          "A dimensional record and surface description without independent hazardous cutting.",
        ],
        [
          [
            "НавчальніØ19,95–20,05; L14,95–15,05; отвір8,50–8,70 мм. Це не критерії медичного/авіаційного виробу.",
            "LearningØ19.95–20.05; L14.95–15.05; bore8.50–8.70 mm; these are not medical/aerospace acceptance criteria.",
          ],
        ],
        ["spacer"],
      ),
    ],
    finishing: [
      t(
        "Хімічний стан, забруднення, шорсткість і втомні властивості не визначаються блиском. Відповідальні деталі потребують окремого інженерного процесу й простежуваності.",
        "Gloss does not establish chemistry, contamination, roughness or fatigue properties. Critical parts need a separate engineered traceable process.",
      ),
      appearanceNote,
    ],
    hazards: [
      rotation,
      t(
        "Дрібна титанова стружка/пил можуть займатися; новачок при ознаках займання відходить, попереджає людей і викликає підготовлену допомогу. Вода на палаючому титані може спричинити вибух, CO2 не є дієвим засобом; реагування визначає SDS і план саме для титану.",
        "Fine titanium chips/dust can ignite; a beginner withdraws, warns others and calls trained help at ignition signs. Water on burning titanium can cause an explosion andCO2 is ineffective; the titanium-specific SDS/site plan governs response.",
      ),
      t(
        "Схвалена водна рідина під час нормального різання та вода для гасіння палаючого металу — різні ситуації. Збирання мокрої/сухої стружки визначає підготовлена процедура, без імпровізованої тари.",
        "Approved water-based fluid during normal cutting and water applied to burning metal are different situations. A qualified procedure governs wet/dry chip collection rather than improvised containers.",
      ),
    ],
    sources: [
      "material-ti-machining",
      "material-ti-safety",
      "material-drilling",
      "material-dust",
    ],
    appearance: {
      color: "#9da1a3",
      metalness: 0.8,
      roughness: 0.4,
      chip: "segmented",
    },
  },
];
