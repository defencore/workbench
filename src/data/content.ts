import { projectSources } from "./projects/index.ts";
import { latheAnatomySources } from "./lathe-anatomy.ts";
import { materialSources } from "./material-guides.ts";
export { projects } from "./projects/index.ts";
import type { Lesson, Source, Step, Text } from "./types";
import { preparationLessons, preparationSources } from "./preparation.ts";

const t = (uk: string, en: string): Text => ({ uk, en });
const s = (
  uk: string,
  en: string,
  bodyUk: string,
  bodyEn: string,
  checkUk?: string,
  checkEn?: string,
): Step => ({
  title: t(uk, en),
  body: t(bodyUk, bodyEn),
  ...(checkUk && checkEn ? { check: t(checkUk, checkEn) } : {}),
});
const q = (
  uk: string,
  en: string,
  options: Text[],
  correct: number,
  explanationUk: string,
  explanationEn: string,
): Lesson["quiz"] => ({
  question: t(uk, en),
  options,
  correct,
  explanation: t(explanationUk, explanationEn),
});

export const sources: Source[] = [
  ...preparationSources,
  {
    id: "ccohs-general",
    title: "Metalworking Machines — General",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/safety_haz/metalworking/general.html",
  },
  {
    id: "ccohs-lathe",
    title: "Metalworking Machines — Lathes",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/safety_haz/metalworking/lathes.html",
  },
  {
    id: "ccohs-mill",
    title: "Metalworking Machines — Milling Machines",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/safety_haz/metalworking/millingmachines.html",
  },
  {
    id: "ccohs-drill",
    title: "Metalworking Machines — Drill Presses",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/safety_haz/metalworking/drillpresses.html",
  },
  {
    id: "ccohs-hand",
    title: "General Hand Tool Operation",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/safety_haz/hand_tools/general.html",
  },
  {
    id: "ccohs-machinist",
    title: "Machinist — Occupational Hazards",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/occup_workplace/machinist.html",
  },
  {
    id: "osha-loto",
    title: "Control of Hazardous Energy",
    publisher: "OSHA",
    url: "https://www.osha.gov/control-hazardous-energy",
  },
  {
    id: "niosh-energy",
    title: "Hazardous Energy Control Resource Guide",
    publisher: "NIOSH / CDC",
    url: "https://www.cdc.gov/niosh/manufacturing/hazardous-energy-control/resource-guide.html",
  },
  {
    id: "osha-dust",
    title: "Combustible Dust: An Explosion Hazard",
    publisher: "OSHA",
    url: "https://www.osha.gov/combustible-dust",
  },
  {
    id: "ccohs-fire",
    title: "Fire Extinguishers — Portable",
    publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/safety_haz/fire_extinguishers.html",
  },
  {
    id: "osha-metals",
    title: "Fire Protection — Combustible Metal Fires",
    publisher: "OSHA",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910SubpartLAppA",
  },
  {
    id: "safework-polishing",
    title: "Using Emery Cloth on Metal Working Lathes",
    publisher: "SafeWork NSW",
    url: "https://www.safework.nsw.gov.au/safety-alerts/safety-alerts/using-emery-cloth-on-metal-working-lathes",
  },
  {
    id: "haas-safety",
    title: "Mill Operator’s Manual — Safety",
    publisher: "Haas Automation",
    url: "https://www.haascnc.com/service/online-operator-s-manuals/mill-operator-s-manual/mill---safety.html",
  },
  {
    id: "haas-lathe",
    title: "Lathe Operator’s Manual — Safety",
    publisher: "Haas Automation",
    url: "https://www.haascnc.com/service/online-operator-s-manuals/lathe-operator-s-manual/lathe---safety.html",
  },
  {
    id: "haas-setup",
    title: "Mill Operator’s Manual — Part Setup",
    publisher: "Haas Automation",
    url: "https://haascnc.com/service/online-operator-s-manuals/mill-operator-s-manual/mill---part-setup.html.html",
  },
  {
    id: "haas-chuck",
    title: "Chuck and Tailstock — Recommended Maximum Pressure",
    publisher: "Haas Automation",
    url: "https://www.haascnc.com/service/troubleshooting-and-how-to/reference-documents/chuck-and-tailstock---recommended-maximum-pressure.html",
  },
  {
    id: "mitutoyo-small",
    title: "E-learning — Calipers, Micrometers and Indicators",
    publisher: "Mitutoyo",
    url: "https://www.mitutoyo.com.sg/sg-en/support/smalltools",
  },
  {
    id: "mitutoyo-caliper",
    title: "Calipers — Precision Measurement Tools",
    publisher: "Mitutoyo",
    url: "https://www.mitutoyo.com/metrology-insights/mitutoyo-calipers-digital-dial-and-vernier-calipers-precision-measurement-tools-for-manufacturing/",
  },
  {
    id: "mitutoyo-guide",
    title: "Quick Guide to Precision Measuring Instruments — Calipers",
    publisher: "Mitutoyo",
    url: "https://www.mitutoyo.com/webfoo/wp-content/uploads/D_section.pdf",
  },
  {
    id: "mitutoyo-micro",
    title: "Correct Use of Micrometers",
    publisher: "Mitutoyo",
    url: "https://www.mitutoyo.co.jp/about-metrology/knowledge/micrometers/",
  },
  {
    id: "mitutoyo-indicator",
    title: "Dial Test Indicators — Correct Use",
    publisher: "Mitutoyo",
    url: "https://www.mitutoyo.co.jp/about-metrology/knowledge/dial-test/",
  },
  {
    id: "sandvik-materials",
    title: "Materials in Manufacturing",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/materials",
  },
  {
    id: "sandvik-external",
    title: "External Turning",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-us/knowledge/general-turning/external-turning",
  },
  {
    id: "sandvik-milling",
    title: "Milling Formulas and Definitions",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/milling-formulas-definitions",
  },
  {
    id: "sandvik-turning",
    title: "How to Improve Tool Life in Turning",
    publisher: "Sandvik Coromant",
    url: "https://www.sandvik.coromant.com/en-us/knowledge/general-turning/how-to-improve-tool-life-in-turning",
  },
  ...projectSources,
  ...materialSources,
  ...latheAnatomySources,
];

export const lessons: Lesson[] = [
  ...preparationLessons,
  {
    id: "safety-first",
    category: "safety",
    title: t("Перед першим запуском", "Before the first start"),
    summary: t(
      "Робоче місце, захисне спорядження та перевірки, які мають передувати кожному запуску.",
      "Prepare your workspace, personal protection and a deliberate pre-start check.",
    ),
    minutes: 8,
    level: "beginner",
    tags: [t("Почніть тут", "Start here"), t("Безпека", "Safety")],
    prerequisites: [],
    hazards: [
      t(
        "Навіть настільний верстат може захопити одяг, зламати кістки або викинути заготовку. Мала потужність не робить його безпечним.",
        "Even a benchtop machine can entangle clothing, break bones or eject work. Low power does not make it safe.",
      ),
      t(
        "Навчальний матеріал не є допуском до роботи. Перші налаштування й різання виконуйте з кваліфікованим наставником за інструкцією саме вашого верстата.",
        "Reading is not operator authorization. Perform initial setups and cuts with a qualified supervisor using the manual for your exact machine.",
      ),
    ],
    steps: [
      s(
        "Визначте межі завдання",
        "Define the task",
        "Назвіть матеріал, операцію, спосіб кріплення та засіб контролю. Прочитайте паспорт верстата; якщо щось невідоме, не починайте й залучіть наставника.",
        "Identify the material, operation, workholding and inspection method. Read the machine manual; if any element is unknown, stop and involve your supervisor.",
        "Можу пояснити весь процес до ввімкнення.",
        "I can explain the whole process before starting.",
      ),
      s(
        "Підготуйте себе",
        "Prepare yourself",
        "Одягніть захисні окуляри з бічним захистом і закрите взуття. Приберіть прикраси, заправте волосся й обтисніть рукави. Захист слуху добирайте за оцінкою шуму; щиток не замінює окуляри.",
        "Wear safety glasses with side protection and closed footwear. Remove jewelry, contain hair and secure sleeves. Select hearing protection from the noise assessment; a face shield supplements safety glasses.",
      ),
      s(
        "Огляньте робоче місце",
        "Inspect the area",
        "Заберіть їжу, напої, ганчірки та зайві інструменти. Підлога має бути сухою, вихід — вільним. Перевірте освітлення, огородження та видимі пошкодження кабелів без розбирання електрики.",
        "Remove food, drinks, rags and spare tools. Keep the floor dry and the exit clear. Check lighting, guards and visible cable damage without opening electrical equipment.",
      ),
      s(
        "Знайдіть засоби зупинки",
        "Locate the stop controls",
        "Попросіть наставника показати штатну зупинку, аварійну зупинку й ізолятор. Перевіряйте їх лише за процедурою виробника. Аварійна кнопка не гарантує миттєвої зупинки та не ізолює енергію.",
        "Have your supervisor identify normal stop, emergency stop and the isolator. Test them only by the manufacturer’s procedure. An emergency button does not ensure an instant stop or isolate energy.",
      ),
      s(
        "Виконайте останній огляд",
        "Complete the final check",
        "Переконайтеся, що заготовка й інструмент закріплені, ключі прибрані, огородження закриті, люди поза небезпечною зоною. За нового шуму, вібрації, диму чи зміщення кріплення припиніть роботу.",
        "Confirm work and tooling are secure, keys removed, guards closed and people outside the hazard zone. Stop for new noise, vibration, smoke or any movement in the workholding.",
        "Наставник перевірив налаштування; знаю, коли зупинятися.",
        "My supervisor checked the setup; I know the stop conditions.",
      ),
    ],
    takeaways: [
      t(
        "Безпечний запуск — це послідовність перевірок, а не звичка натискати кнопку.",
        "Safe starting is a sequence of checks, not a habit of pressing a button.",
      ),
      t(
        "Якщо умови змінилися — зупиніться та повторіть оцінку.",
        "If conditions change, stop and reassess.",
      ),
    ],
    sources: ["ccohs-general", "ccohs-machinist"],
    quiz: q(
      "Що робити, якщо спосіб кріплення незрозумілий?",
      "What should you do if the workholding method is unclear?",
      [
        t("Зробити дуже легкий пробний різ", "Try a very light cut"),
        t(
          "Зупинитися та перевірити з наставником",
          "Stop and check with a supervisor",
        ),
        t("Знизити оберти й продовжити", "Lower the speed and continue"),
      ],
      1,
      "Невизначеність потрібно усунути до запуску. Малий різ і низькі оберти не виправляють ненадійного кріплення.",
      "Resolve uncertainty before starting. A light cut or low speed cannot correct insecure workholding.",
    ),
  },
  {
    id: "entanglement",
    category: "safety",
    title: t("Обертання та захоплення", "Rotation and entanglement"),
    summary: t(
      "Чому рукавички, волосся, ганчірки та ручне полірування небезпечні біля шпинделя.",
      "Understand why gloves, hair, rags and hand-held polishing are hazardous around spindles.",
    ),
    minutes: 7,
    level: "beginner",
    tags: [t("Обертання", "Rotation"), t("Токарний", "Lathe")],
    prerequisites: ["safety-first"],
    model: "lathe",
    hazards: [
      t(
        "Не носіть рукавичок біля обертових частин. Захоплення може відбутися швидше, ніж людина встигне натиснути стоп.",
        "Do not wear gloves around rotating parts. Entanglement can occur before you can reach a stop button.",
      ),
      t(
        "Не обгортайте наждачну стрічку, ганчірку чи шнур навколо заготовки. Новачкам не слід полірувати або обпилювати деталь під час обертання.",
        "Never wrap abrasive strip, cloth or cord around work. Beginners should not polish or file a rotating workpiece.",
      ),
    ],
    steps: [
      s(
        "Позначте всі обертові частини",
        "Identify every rotating part",
        "На зупиненому верстаті знайдіть патрон, кулачки, вал, муфти й можливий вихід прутка ззаду. Небезпечна зона ширша за поверхню самої деталі.",
        "With the machine stopped, locate the chuck, jaws, shaft, couplings and any bar emerging at the rear. The hazard zone extends beyond the part surface.",
      ),
      s(
        "Усуньте петлі й вільні краї",
        "Remove loops and loose edges",
        "Зніміть годинник, каблучки, шнурки й навушники з дротами. Довге волосся має бути повністю утримане; просто перекинути його за спину недостатньо.",
        "Remove watches, rings, lanyards and wired headphones. Long hair must be fully contained; moving it behind your shoulders is insufficient.",
      ),
      s(
        "Відокремте обробку від очищення",
        "Separate cutting from cleaning",
        "Не торкайтеся стружки та не тягніть її з різця. Зупиніть рух, виконайте потрібну ізоляцію, а потім застосуйте придатний гачок або щітку; тримайте руки поза гострими витками.",
        "Do not touch chips or pull them off the tool. Stop motion, apply the required isolation and then use a suitable hook or brush, keeping hands clear of sharp coils.",
      ),
      s(
        "Вимірюйте лише нерухому деталь",
        "Measure only stationary work",
        "Дочекайтеся повної зупинки. Не намагайтеся гальмувати патрон рукою, інструментом чи вимірювальними губками. Перед наближенням виключіть неочікуваний пуск за місцевою процедурою.",
        "Wait until all movement has stopped. Never brake a chuck with a hand, tool or measuring jaws. Prevent unexpected startup before approaching, following the local procedure.",
      ),
      s(
        "Завершуйте поверхню без обертання",
        "Finish the surface without rotation",
        "Для ручного зняття задирок перенесіть деталь у лещата після безпечного зняття. Спеціальне механізоване полірування вимагає окремого пристрою, оцінки ризику й навчання.",
        "For hand deburring, safely remove the part and secure it in a bench vice. Dedicated mechanized polishing requires its own fixture, risk assessment and training.",
        "Нічого не тримаю біля деталі, що обертається.",
        "I hold nothing near rotating work.",
      ),
    ],
    takeaways: [
      t(
        "Рукавички можуть захистити від гострих країв лише під час окремої роботи з нерухомим, ізольованим обладнанням.",
        "Gloves may protect against sharp edges only during separate tasks on stationary, isolated equipment.",
      ),
      t(
        "Низькі оберти теж здатні затягнути людину.",
        "Low rotational speed can still entangle a person.",
      ),
    ],
    sources: ["safework-polishing", "ccohs-lathe"],
    quiz: q(
      "Коли можна прикласти штангенциркуль до токарної деталі?",
      "When may you apply calipers to a lathe workpiece?",
      [
        t("На найнижчих обертах", "At the lowest speed"),
        t(
          "Коли поверхня здається нерухомою",
          "When the surface appears stationary",
        ),
        t(
          "Після повної зупинки та захисту від неочікуваного пуску",
          "After a complete stop and prevention of unexpected startup",
        ),
      ],
      2,
      "Зорове враження оманливе; вимірювання біля обертання створює ризик захоплення й викидання інструмента.",
      "Appearance is misleading; measuring around rotation risks entanglement and ejected instruments.",
    ),
  },
  {
    id: "energy-isolation",
    category: "safety",
    title: t(
      "Електрика та ізоляція енергії",
      "Electricity and energy isolation",
    ),
    summary: t(
      "Розрізняємо зупинку, аварійну кнопку та безпечну ізоляцію всіх джерел енергії.",
      "Distinguish normal stopping, emergency stopping and verified isolation of all energy sources.",
    ),
    minutes: 9,
    level: "beginner",
    tags: [t("Електробезпека", "Electrical safety"), t("LOTO", "LOTO")],
    prerequisites: ["safety-first"],
    hazards: [
      t(
        "Не відкривайте електрошафи та не ремонтуйте проводку. Конденсатори й частотні перетворювачі можуть зберігати небезпечну напругу після вимкнення.",
        "Do not open electrical cabinets or repair wiring. Capacitors and drives can retain hazardous voltage after power is switched off.",
      ),
      t(
        "Пневматика, гідравліка, пружини та підняті вузли також містять запасену енергію.",
        "Pneumatics, hydraulics, springs and raised components also contain stored energy.",
      ),
    ],
    steps: [
      s(
        "Визначте характер роботи",
        "Identify the work category",
        "Заміна оснащення, усунення заклинювання й обслуговування потребують визначеної виробником та майстернею процедури. Якщо руки входять у небезпечну зону, однієї команди «стоп» недостатньо.",
        "Tooling changes, jam removal and maintenance require the procedure defined by the manufacturer and workshop. A stop command alone is insufficient when hands enter a hazard zone.",
      ),
      s(
        "Залучіть уповноважену людину",
        "Involve an authorized person",
        "Попросіть навченого працівника визначити електричні, механічні й допоміжні джерела. Новачок не має самостійно встановлювати електричну відсутність напруги чи розбирати силові вузли.",
        "Ask a trained authorized person to identify electrical, mechanical and auxiliary energy sources. A beginner must not independently test electrical deadness or dismantle power components.",
      ),
      s(
        "Ізолюйте та унеможливте пуск",
        "Isolate and prevent restart",
        "Уповноважений працівник зупиняє обладнання, відокремлює джерела та застосовує персональне блокування й маркування за процедурою LOTO. Не покладайтеся на екран, програму або аварійну кнопку.",
        "The authorized person stops the equipment, disconnects energy sources and applies personal lockout and identification under the LOTO procedure. Do not rely on a screen, program or emergency button.",
      ),
      s(
        "Врахуйте запасену енергію",
        "Control stored energy",
        "Небезпечний тиск скидають, рухомі вузли надійно підпирають, а дозволений час розряду витримують за документацією. Ефективність ізоляції перевіряє уповноважений працівник визначеним методом.",
        "Hazardous pressure is released, moving components securely blocked and specified discharge times observed. The authorized person verifies the effectiveness of isolation by the prescribed method.",
        "Мені підтвердили безпечний стан для конкретного завдання.",
        "The safe state for this specific task has been confirmed.",
      ),
      s(
        "Поверніть обладнання за процедурою",
        "Restore equipment by procedure",
        "Після роботи перевірте збирання, огородження та відсутність людей у зоні. Блокування знімають лише за встановленими правилами; не знімайте чужий замок і не відновлюйте живлення самовільно.",
        "After the task, check assembly, guards and personnel clearance. Remove lockout only under the established rules; never remove another person’s lock or restore energy on your own.",
      ),
    ],
    takeaways: [
      t(
        "Вимкнений дисплей не доводить відсутності небезпечної енергії.",
        "A dark display does not prove absence of hazardous energy.",
      ),
      t(
        "Пошкоджений кабель, запах ізоляції, удар струмом або повторне спрацювання захисту — причина припинити роботу й повідомити відповідального.",
        "Cable damage, insulation smell, a shock or repeated protective trips require stopping work and notifying the responsible person.",
      ),
    ],
    sources: ["osha-loto", "niosh-energy"],
    quiz: q(
      "Чи є натиснутий E-stop достатньою ізоляцією для ремонту?",
      "Is an engaged E-stop sufficient isolation for repair?",
      [
        t("Так, якщо екран згас", "Yes, if the screen is dark"),
        t(
          "Ні, потрібна перевірена процедура ізоляції всіх джерел",
          "No, verified isolation of all energy sources is required",
        ),
        t("Так, якщо поруч є інша людина", "Yes, if someone else is nearby"),
      ],
      1,
      "E-stop — функція керування. Він не замінює фізичної ізоляції, блокування та перевірки.",
      "An E-stop is a control function. It does not replace isolation, lockout and verification.",
    ),
  },
  {
    id: "chips-fire",
    category: "safety",
    title: t("Стружка, пил і пожежа", "Chips, dust and fire"),
    summary: t(
      "Захищаємо очі, відокремлюємо їжу та запобігаємо займанню металевих відходів.",
      "Protect eyes, separate food and prevent combustible metal waste incidents.",
    ),
    minutes: 9,
    level: "beginner",
    tags: [t("Стружка", "Chips"), t("Пожежа", "Fire")],
    prerequisites: ["safety-first", "energy-isolation"],
    hazards: [
      t(
        "Дрібна стружка та пил алюмінію, магнію, титану й інших металів можуть горіти або утворювати вибухонебезпечну хмару. Не працюйте з невідомим матеріалом.",
        "Fine chips and dust of aluminum, magnesium, titanium and other metals may burn or form an explosible cloud. Do not machine unidentified material.",
      ),
      t(
        "Не здувайте стружку стисненим повітрям. Не застосовуйте побутовий пилосос до металевого пилу або гарячих частинок.",
        "Do not blow chips with compressed air. Do not use a household vacuum for metal dust or hot particles.",
      ),
    ],
    steps: [
      s(
        "Оцініть матеріал до різання",
        "Assess the material before cutting",
        "Перевірте марку матеріалу та паспорт безпеки SDS. Для горючих металів потрібні окремий технологічний процес, сумісна система прибирання й план реагування; магній і титан не є стартовими матеріалами.",
        "Check the material grade and safety data sheet. Combustible metals need a specific process, compatible collection and response plan; magnesium and titanium are not beginner materials.",
      ),
      s(
        "Відокремте чисту зону",
        "Separate the clean zone",
        "Їжу, воду й особисті речі тримайте поза виробничою зоною. Після прибирання вимийте руки; не витирайте обличчя робочою ганчіркою та не несіть стружку на одязі до місця харчування.",
        "Keep food, drinks and personal items outside the production area. Wash hands after cleanup; do not wipe your face with a shop rag or carry chips on clothing to eating areas.",
      ),
      s(
        "Прибирайте без розсіювання",
        "Clean without dispersing particles",
        "Після повної зупинки та потрібної ізоляції зберіть стружку щіткою, гачком або схваленою для цього матеріалу системою. Розділяйте відходи за процедурою майстерні; не змішуйте пил із горючим сміттям.",
        "After a full stop and required isolation, use a brush, hook or approved collection system for the material. Segregate waste under workshop rules; keep metal dust separate from combustible rubbish.",
      ),
      s(
        "Заздалегідь визначте реакцію на вогонь",
        "Plan the fire response in advance",
        "Знайдіть вихід і сигналізацію. Для металевої пожежі засіб класу D має бути сумісним саме з цим металом. Вода, CO₂ і звичайний ABC не є універсальним рішенням та можуть погіршити ситуацію.",
        "Locate the exit and alarm. A Class D agent for metal fires must be compatible with the specific metal. Water, CO₂ and ordinary ABC agents are not universal solutions and can worsen the event.",
      ),
      s(
        "За займання — повідомте й евакуюйтеся",
        "If fire starts, raise the alarm and evacuate",
        "Не розворушуйте палаючу стружку й не створюйте пилової хмари. Повідомте про тип металу. Гасити дозволено лише навченій людині, відповідним засобом, за планом майстерні та з вільним шляхом відступу.",
        "Do not disturb burning chips or create a dust cloud. Report the metal involved. Only trained personnel may attempt extinguishment with a compatible agent under the workshop plan and with a clear escape route.",
        "Знаю шлях виходу та правила відходів для свого матеріалу.",
        "I know the exit route and waste rules for my material.",
      ),
    ],
    takeaways: [
      t(
        "Великі шматки й пил одного металу мають різні ризики займання.",
        "Bulk metal and fine dust of the same metal have different ignition risks.",
      ),
      t(
        "Огорожа верстата не є вибухозахисною камерою або системою пожежогасіння.",
        "A machine enclosure is not an explosion containment or fire suppression system.",
      ),
    ],
    sources: ["osha-dust", "ccohs-fire", "osha-metals", "haas-safety"],
    quiz: q(
      "Що найважливіше за появи металевої пожежі?",
      "What matters most when a metal fire starts?",
      [
        t("Одразу залити водою", "Immediately pour water on it"),
        t("Здути стружку подалі", "Blow the chips away"),
        t(
          "Підняти тривогу, відійти та діяти за планом для цього металу",
          "Raise the alarm, withdraw and follow the plan for that metal",
        ),
      ],
      2,
      "Несумісний засіб або розсіювання пилу може посилити пожежу. Пріоритет — люди й безпечний вихід.",
      "An incompatible agent or dispersed dust may intensify a fire. People and a safe escape take priority.",
    ),
  },
  {
    id: "technical-drawing",
    category: "fundamentals",
    title: t("Читаємо креслення деталі", "Read a part drawing"),
    summary: t(
      "Види, розрізи, бази, діаметри й допуски перед першою технологічною операцією.",
      "Understand views, sections, datums, diameters and tolerances before planning operations.",
    ),
    minutes: 10,
    level: "beginner",
    tags: [t("Креслення", "Drawing"), t("Бази", "Datums")],
    prerequisites: ["safety-first"],
    model: "shaft",
    hazards: [
      t(
        "Не виготовляйте навантажені або відповідальні деталі за ескізом із невідомими допусками, матеріалом і термообробкою.",
        "Do not produce load-bearing or safety-critical parts from a sketch with unknown tolerances, material or heat treatment.",
      ),
    ],
    steps: [
      s(
        "Перевірте документ",
        "Check the document",
        "Знайдіть назву, ревізію, одиниці, масштаб і матеріал. Розміри беріть із чисел, а не вимірювання зображення лінійкою. За суперечності між видами уточніть креслення до роботи.",
        "Find the title, revision, units, scale and material. Use stated dimensions instead of measuring the image. Resolve conflicting views before manufacturing.",
      ),
      s(
        "Уявіть об’ємну форму",
        "Reconstruct the shape",
        "Порівняйте основний, бічний і торцевий види. Позначення Ø стосується діаметра, R — радіуса; штрихування на розрізі показує перерізаний матеріал, а не кишеню.",
        "Compare front, side and end views. Ø marks a diameter and R a radius; section hatching indicates cut material rather than a pocket.",
      ),
      s(
        "Знайдіть функціональні бази",
        "Find the functional datums",
        "Визначте поверхню встановлення, вісь і опорний торець. Від них зручно координувати виготовлення та контроль; не замінюйте задану базу випадковим необробленим краєм.",
        "Identify the mounting face, axis and locating end. Coordinate manufacture and inspection from them; do not replace a specified datum with an arbitrary raw edge.",
      ),
      s(
        "Прочитайте вимоги до точності",
        "Read the precision requirements",
        "Відрізняйте номінал від допустимих меж. Перевірте загальні примітки, шорсткість і геометричні вимоги. Наприклад, 20 ±0,1 мм задає межі 19,9–20,1 мм, але саме по собі не задає круглості.",
        "Separate nominal size from acceptable limits. Check general notes, surface finish and geometric requirements. For example, 20 ±0.1 mm specifies 19.9–20.1 mm limits, but does not itself specify roundness.",
      ),
      s(
        "Складіть короткий маршрут",
        "Make a short process plan",
        "Випишіть заготовку, послідовність баз, операцій і вимірювань. Залиште місце для кріплення та фінішної обробки. Позначте розміри, які треба перевірити до наступного встановлення.",
        "List the stock, datum sequence, operations and measurements. Allow for workholding and finishing. Mark dimensions that must be checked before the next setup.",
        "Для кожного важливого розміру визначено спосіб контролю.",
        "Every important dimension has an inspection method.",
      ),
    ],
    takeaways: [
      t(
        "Розмір, форма й положення — різні вимоги.",
        "Size, form and position are different requirements.",
      ),
      t(
        "Невказаний допуск не дорівнює нульовому або будь-якому допуску.",
        "An unstated tolerance does not mean zero tolerance or any tolerance you choose.",
      ),
    ],
    sources: ["mitutoyo-guide"],
    quiz: q(
      "Що означає Ø20 ±0,1 мм?",
      "What does Ø20 ±0.1 mm mean?",
      [
        t("Діаметр від 19,9 до 20,1 мм", "A diameter from 19.9 to 20.1 mm"),
        t("Радіус рівно 20 мм", "A radius of exactly 20 mm"),
        t(
          "Автоматичну гарантію співвісності",
          "An automatic guarantee of coaxiality",
        ),
      ],
      0,
      "Це межі діаметра. Вимоги до положення осі або форми задають окремо.",
      "These are diameter limits. Axis location and form requirements are specified separately.",
    ),
  },
  {
    id: "marking-out",
    category: "fundamentals",
    title: t("Розмічання та кернування", "Marking out and center punching"),
    summary: t(
      "Переносимо розміри на заготовку від єдиних баз без накопичення помилок.",
      "Transfer dimensions to stock from consistent datums without accumulating errors.",
    ),
    minutes: 8,
    level: "beginner",
    tags: [t("Розмітка", "Layout"), t("Ручний інструмент", "Hand tools")],
    prerequisites: ["technical-drawing", "workholding-basics"],
    hazards: [
      t(
        "Рисувалка та краї заготовки гострі. Під час удару кернером можливі уламки; потрібні окуляри та справний інструмент.",
        "Scribers and stock edges are sharp. Center punching may produce fragments; use eye protection and sound tools.",
      ),
    ],
    steps: [
      s(
        "Підготуйте поверхню",
        "Prepare the surface",
        "Очистіть заготовку від бруду та зніміть небезпечні задирки. За потреби нанесіть сумісну розмічальну фарбу з вентиляцією згідно з SDS; не маскуйте нею дефекти опорної поверхні.",
        "Clean the stock and remove hazardous burrs. If needed, use compatible layout dye with ventilation required by its SDS; do not conceal defects on a locating surface.",
      ),
      s(
        "Виберіть дві базові кромки",
        "Choose two datum edges",
        "Перевірте їхню придатність і кут між ними. Позначте бази A та B. Якщо край заготовки кривий, спочатку створіть опорну поверхню або використайте іншу погоджену базу.",
        "Check their suitability and included angle. Label them A and B. If a raw edge is irregular, first create a locating face or choose another agreed datum.",
      ),
      s(
        "Відкладайте координати від баз",
        "Lay out coordinates from the datums",
        "Лінійкою, кутником і рисувалкою нанесіть осьові та контури. Координати кількох отворів відкладайте від спільної бази, а не послідовно від попереднього отвору.",
        "Use a rule, square and scriber for centerlines and outlines. Locate multiple holes from a common datum instead of chaining each location from the previous hole.",
      ),
      s(
        "Накерніть після перевірки",
        "Punch only after checking",
        "Порівняйте розмітку з кресленням. Зафіксуйте деталь на придатній опорі та зробіть кернером контрольовану мітку на перетині ліній. Не тримайте малу деталь у долоні під ударом.",
        "Compare the layout with the drawing. Secure the part on a suitable support and make a controlled center mark at the intersection. Do not support a small part in your palm while striking.",
      ),
      s(
        "Виконайте незалежний контроль",
        "Make an independent check",
        "Перевірте відстань від протилежного краю або симетрію. Розмітка допомагає орієнтуватися, але не замінює координатного встановлення й точного контролю відповідальних отворів.",
        "Check from the opposite edge or verify symmetry. Layout assists positioning but does not replace coordinate setup and precise inspection for important hole locations.",
        "Координати та сторона деталі відповідають кресленню.",
        "The coordinates and the selected side match the drawing.",
      ),
    ],
    takeaways: [
      t(
        "Одна система баз зменшує накопичення похибок.",
        "A single datum scheme reduces accumulated error.",
      ),
      t(
        "Керн — орієнтир для свердління, а не гарантія точного положення.",
        "A punch mark guides drilling; it does not guarantee accurate location.",
      ),
    ],
    sources: ["ccohs-hand"],
    quiz: q(
      "Як краще розмітити ряд точних координат?",
      "How should you lay out a row of accurate coordinates?",
      [
        t(
          "Кожен розмір від попередньої мітки",
          "Measure each position from the previous mark",
        ),
        t("Від однієї визначеної бази", "Measure from one defined datum"),
        t("На око за симетрією", "Judge the symmetry by eye"),
      ],
      1,
      "Спільна база запобігає послідовному додаванню похибок кожного відкладання.",
      "A common datum avoids serial accumulation of individual layout errors.",
    ),
  },
  {
    id: "workholding-basics",
    category: "fundamentals",
    title: t("Надійне кріплення заготовки", "Secure workholding"),
    summary: t(
      "Опори, затиск і напрямки сил: чому просто «сильно затягнути» недостатньо.",
      "Understand supports, clamps and cutting-force directions instead of relying on tightening alone.",
    ),
    minutes: 12,
    level: "beginner",
    tags: [t("Кріплення", "Workholding"), t("Лещата", "Vice")],
    prerequisites: ["safety-first", "energy-isolation"],
    model: "vice",
    hazards: [
      t(
        "Заготовка, що зірвалася, стає снарядом. Не тримайте її рукою під час механічного свердління чи фрезерування.",
        "Released work becomes a projectile. Never hold it by hand during powered drilling or milling.",
      ),
      t(
        "Надмірне затягування може деформувати деталь або зламати кріплення; зусилля визначає виробник оснащення.",
        "Excessive tightening may distort the work or break fasteners; the workholding manufacturer specifies the force.",
      ),
    ],
    steps: [
      s(
        "Уявіть напрямок навантаження",
        "Consider the load directions",
        "Визначте, куди інструмент штовхатиме, підніматиме або обертатиме заготовку. Кріплення має протидіяти всім цим рухам; нерухомість під легкою рукою не доводить достатньої міцності.",
        "Identify where the tool will push, lift or rotate the work. The setup must resist all these movements; apparent stability under a light hand check does not prove capacity.",
      ),
      s(
        "Створіть чисті опори",
        "Create clean support points",
        "Очистіть лещата, паралельні підкладки та бази. Заберіть задирки з опорних місць. Стружка під деталлю змінює висоту й може ослабити затиск після її зминання.",
        "Clean the vice, parallels and datums. Remove burrs from contact points. Chips beneath the part change its height and may loosen the setup when crushed.",
      ),
      s(
        "Підберіть придатне оснащення",
        "Select suitable equipment",
        "Застосуйте лещата, патрон, цангу або спеціальний пристрій для форми й розміру деталі. Саме оснащення також має бути закріплене до столу або шпинделя належним способом.",
        "Choose a vice, chuck, collet or dedicated fixture suited to the part’s shape and size. The workholding itself must also be correctly secured to the table or spindle.",
      ),
      s(
        "Затисніть без втрати геометрії",
        "Clamp without losing geometry",
        "Дотримуйтеся допустимого вильоту й довжини захоплення з документації. Підкладайте опору біля зони різання; не використовуйте подовжувач ключа, якщо це прямо не передбачено виробником.",
        "Observe the permitted overhang and grip length from the documentation. Support near the cut; do not extend a wrench unless the manufacturer specifically permits it.",
      ),
      s(
        "Перевірте весь простір руху",
        "Check the complete motion envelope",
        "На безпечно зупиненому обладнанні перевірте зазори між інструментом, губками, болтами й столом на всьому маршруті. Попросіть наставника оцінити жорсткість; після першого різу зупиніться й огляньте кріплення.",
        "With equipment safely stopped, check clearance between tooling, jaws, bolts and table throughout the operation. Ask a supervisor to assess rigidity; stop and inspect the setup after the first cut.",
        "Кріплення витримує заплановані сили та не перетинає траєкторію.",
        "The setup is rated for the planned loads and clears the toolpath.",
      ),
    ],
    takeaways: [
      t(
        "Надійне кріплення починається з опори, а не з моменту затягування.",
        "Reliable workholding begins with support, not tightening torque.",
      ),
      t(
        "Зміна встановлення потребує повторної перевірки баз і зазорів.",
        "Every setup change requires rechecking datums and clearances.",
      ),
    ],
    sources: ["ccohs-mill", "haas-chuck"],
    quiz: q(
      "Чому не можна затискати деталь поверх стружки?",
      "Why must you not clamp a part on chips?",
      [
        t("Лише тому, що це псує вигляд", "Only because it looks untidy"),
        t(
          "Стружка створює похибку опори й може зім’ятися під навантаженням",
          "Chips introduce locating error and may collapse under load",
        ),
        t(
          "Це завжди збільшує тертя та надійність",
          "It always increases friction and security",
        ),
      ],
      1,
      "Нестабільна опора погіршує точність і може зменшити затискне зусилля.",
      "An unstable support affects accuracy and can reduce clamping security.",
    ),
  },
  {
    id: "hand-tools",
    category: "fundamentals",
    title: t("Напилок, пилка та зняття задирок", "Files, saws and deburring"),
    summary: t(
      "Ручна підготовка заготовки й безпечні кромки без пошкодження базових поверхонь.",
      "Prepare stock by hand and make safe edges without damaging datum surfaces.",
    ),
    minutes: 9,
    level: "beginner",
    tags: [t("Ручний інструмент", "Hand tools"), t("Задирки", "Deburring")],
    prerequisites: ["safety-first", "workholding-basics", "tool-condition"],
    hazards: [
      t(
        "Напилок без руків’я може травмувати долоню хвостовиком. Пошкоджені полотна та інструменти вилучають із роботи.",
        "A file without a handle can injure your palm with its tang. Remove damaged blades and tools from service.",
      ),
      t(
        "Не обпилюйте й не шліфуйте деталь, що обертається в патроні, вручну.",
        "Do not hand-file or hand-sand a part rotating in a chuck.",
      ),
    ],
    steps: [
      s(
        "Оберіть і перевірте інструмент",
        "Select and inspect the tool",
        "Підберіть напилок за матеріалом і формою, ножівкове полотно — за товщиною перерізу. Перевірте руків’я, кріплення полотна та ріжучі краї. Не замінюйте напилок важелем чи молотком.",
        "Choose a file for the material and shape, and a saw blade suited to section thickness. Check handles, blade mounting and cutting edges. Never use a file as a lever or hammer.",
      ),
      s(
        "Зафіксуйте деталь",
        "Secure the part",
        "Використайте верстачні лещата й придатні накладки. Розташуйте лінію різання близько до опори, залишивши місце для ходу інструмента. Руки та тіло не повинні бути на продовженні різу.",
        "Use a bench vice with suitable jaw protection. Place the cutting line near support while leaving tool clearance. Keep hands and body out of the cutting line.",
      ),
      s(
        "Знімайте матеріал контрольовано",
        "Remove material deliberately",
        "Ведіть інструмент рівно, без скручування й надмірного тиску. Ножівку не затискайте боковим перекосом. Під час наближення до розміру зменшіть знімання й частіше перевіряйте площину.",
        "Guide the tool evenly without twisting or excessive force. Do not bind a saw by side loading it. Near final size, reduce material removal and check the surface more often.",
      ),
      s(
        "Приберіть лише потрібну задирку",
        "Remove only the unwanted burr",
        "Зніміть гострий виступ фаскознімачем або дрібним напилком, рухаючись від руки. Не округляйте посадкові кромки й не змінюйте фаску, якщо вона задана кресленням.",
        "Remove the sharp projection using a deburring tool or fine file, cutting away from your hand. Do not round locating edges or alter a dimensioned chamfer.",
      ),
      s(
        "Очистіть і перевірте",
        "Clean and inspect",
        "Приберіть ошурки щіткою. Огляньте кромку при доброму світлі та перевірте розмір; не проводьте голим пальцем уздовж неперевіреного краю. Зберігайте інструмент так, щоб він не падав і не тупився.",
        "Brush away filings. Inspect the edge under good light and check size; do not slide a bare finger along an unchecked edge. Store tools to prevent falling and edge damage.",
        "Немає гострих виступів; функціональні розміри збережені.",
        "Sharp projections are removed and functional dimensions preserved.",
      ),
    ],
    takeaways: [
      t(
        "Зняття задирок — керована операція, а не довільне округлення.",
        "Deburring is a controlled operation, not arbitrary rounding.",
      ),
      t(
        "Ручна робота теж потребує кріплення та захисту очей.",
        "Hand operations also require workholding and eye protection.",
      ),
    ],
    sources: ["ccohs-hand", "safework-polishing"],
    quiz: q(
      "Що перевірити перед роботою напилком?",
      "What should you check before filing?",
      [
        t(
          "Справне надійне руків’я та затиск деталі",
          "A sound secure handle and clamped work",
        ),
        t(
          "Чи достатньо високі оберти патрона",
          "Whether chuck speed is high enough",
        ),
        t("Лише колір металу", "Only the metal color"),
      ],
      0,
      "Безпечний напилок має справне руків’я, а заготовка повинна бути нерухомо закріплена.",
      "A safe file has a sound handle, and the work must be secured stationary.",
    ),
  },
  {
    id: "drill-press",
    category: "fundamentals",
    title: t(
      "Свердління на свердлильному верстаті",
      "Drilling on a drill press",
    ),
    summary: t(
      "Кріплення, вибір свердла й контроль виходу отвору без обертання деталі в руках.",
      "Secure the work, select the drill and control breakthrough without hand-held work.",
    ),
    minutes: 10,
    level: "beginner",
    tags: [t("Свердління", "Drilling"), t("Кріплення", "Workholding")],
    prerequisites: [
      "workholding-basics",
      "marking-out",
      "entanglement",
      "cutting-parameters",
      "daily-inspection",
      "drilling-tools",
    ],
    hazards: [
      t(
        "На виході свердло може підхопити й обертати деталь. Закріпіть лещата або пристрій до столу; не утримуйте їх рукою.",
        "At breakthrough, a drill can grab and spin the work. Secure the vice or fixture to the table; do not hold it by hand.",
      ),
      t(
        "Не носіть рукавичок при обертанні; ключ патрона виймають одразу після затягування.",
        "Do not wear gloves around rotation; remove the chuck key immediately after tightening.",
      ),
    ],
    steps: [
      s(
        "Підготуйте отвір і підкладку",
        "Plan the hole and backing",
        "Перевірте діаметр, глибину та положення. Для наскрізного отвору встановіть придатну жертовну підкладку й перевірте, що свердло не ввійде в стіл або кріплення.",
        "Check diameter, depth and position. For a through hole, use suitable sacrificial backing and verify that the drill cannot enter the table or fasteners.",
      ),
      s(
        "Закріпіть деталь та оснащення",
        "Secure work and workholding",
        "Підтримайте нерівну форму в пристрої, а круглу — у відповідній призмі. Затисніть заготовку й зафіксуйте самі лещата. Перевірте доступ свердла до мітки при зупиненому шпинделі.",
        "Support irregular shapes in a fixture and round stock in an appropriate V-block. Clamp the work and secure the vice itself. Check drill access to the mark with the spindle stopped.",
      ),
      s(
        "Підберіть свердло та режим",
        "Select the drill and conditions",
        "Огляньте свердло й затисніть його на достатню довжину за правилами патрона. Швидкість, подачу, пілотний отвір і мастило визначайте за матеріалом, діаметром та рекомендаціями виробників.",
        "Inspect the drill and grip sufficient shank length under the chuck rules. Determine speed, feed, pilot-hole needs and lubricant from material, diameter and manufacturer recommendations.",
      ),
      s(
        "Свердліть під наглядом",
        "Drill under supervision",
        "Опустіть захист і виконайте перше свердління з наставником. Уникайте надмірного натиску, особливо біля виходу. Стружку видаляйте лише після повної зупинки; глибокі отвори потребують окремого процесу.",
        "Lower the guard and perform the first drilling operation with a supervisor. Avoid excessive force, particularly near breakthrough. Remove chips only after a complete stop; deep holes require a separate process.",
      ),
      s(
        "Контролюйте результат",
        "Inspect the result",
        "Після зупинки й захисту від пуску зніміть деталь, видаліть задирки з обох боків та виміряйте. Свердління саме по собі не гарантує точного діаметра, круглості або положення.",
        "After stopping and preventing startup, remove the work, deburr both sides and measure it. Drilling alone does not guarantee precise diameter, roundness or location.",
        "Отвір перевірено; стіл та оснащення не пошкоджені.",
        "The hole is inspected; the table and fixture are undamaged.",
      ),
    ],
    takeaways: [
      t(
        "Надійно затискають і деталь, і пристрій.",
        "Secure both the workpiece and its workholding.",
      ),
      t(
        "Точні отвори можуть потребувати розточування або розгортання за окремою технологією.",
        "Precision holes may need boring or reaming under a separate process.",
      ),
    ],
    sources: ["ccohs-drill"],
    quiz: q(
      "Як утримувати коротку пластину при свердлінні?",
      "How should a short plate be held while drilling?",
      [
        t("Щільно притиснути долонею", "Press firmly with your palm"),
        t(
          "У закріплених до столу лещатах або пристрої",
          "In a vice or fixture secured to the table",
        ),
        t("Затиснути пасатижами в руці", "Hold it in hand-held pliers"),
      ],
      1,
      "Свердло може створити великий крутний момент, особливо на виході.",
      "A drill can produce substantial torque, especially at breakthrough.",
    ),
  },
  {
    id: "lathe-setup",
    category: "lathe",
    title: t(
      "Підготовка токарного верстата до роботи",
      "Preparing a lathe for use",
    ),
    summary: t(
      "Шпиндель, супорт, задня бабка та безпечна підготовка навчального встановлення.",
      "Meet the spindle, carriage and tailstock, and prepare a supervised learning setup.",
    ),
    minutes: 12,
    level: "beginner",
    tags: [t("Ручний токарний", "Manual lathe"), t("Налаштування", "Setup")],
    prerequisites: [
      "entanglement",
      "energy-isolation",
      "workholding-basics",
      "daily-inspection",
    ],
    model: "lathe",
    hazards: [
      t(
        "Патрон, кулачки й незахищений пруток створюють зону удару та захоплення. Максимум обертів визначає найнижча допустима межа всього встановлення.",
        "The chuck, jaws and exposed bar create impact and entanglement zones. The lowest permitted rating of the entire setup governs the speed limit.",
      ),
      t(
        "Не залишайте довгий пруток незахищеним із заднього боку шпинделя. Потрібна належна система підтримки та огородження.",
        "Never leave a long bar exposed at the rear of the spindle. Proper support and guarding are required.",
      ),
    ],
    steps: [
      s(
        "Ознайомтеся з органами керування",
        "Learn the controls",
        "За паспортом саме вашої моделі знайдіть рукоятки частоти обертання шпинделя, напрямку й величини подачі, вмикання ходового гвинта/вала, механічної подачі та маточної гайки. Розрізняйте маховики поздовжнього переміщення супорта, поперечних і верхніх полозків та пінолі. Кнопки пуску, зупинки, аварійна зупинка й гальмо мають окремі функції; їхня наявність залежить від моделі. Спочатку опрацюйте довідник будови й органів керування.",
        "Use the actual model manual to identify spindle-speed, feed-direction/rate, leadscrew/feed-rod, power-feed and half-nut selectors. Distinguish carriage, cross-slide, compound-slide and quill hand controls. Start, stop, emergency stop and brake serve separate functions; their presence depends on the model. Study the anatomy and controls reference first.",
      ),
      s(
        "Перевірте стан і мастило",
        "Check condition and lubrication",
        "Огляньте огородження, кріплення патрона та доступні точки змащування за документацією. Люфт, пошкоджені кулачки або несправне гальмо потребують оцінки відповідального, а не компенсації сильнішим затиском.",
        "Inspect guards, chuck attachment and accessible lubrication points under the manual. Play, damaged jaws or a faulty brake need assessment, not compensation by harder clamping.",
      ),
      s(
        "Встановіть заготовку",
        "Mount the stock",
        "Ізолюйте верстат для налаштування за процедурою. Виберіть сумісні кулачки або цангу, мінімізуйте виліт і дотримуйтеся вимог до захоплення. Ключ виймайте відразу, не відпускаючи його в патроні.",
        "Apply the setup isolation procedure. Select compatible jaws or a collet, minimize overhang and follow grip requirements. Remove the key immediately; never let go of it in the chuck.",
      ),
      s(
        "Налаштуйте різець і зазори",
        "Set the tool and clearances",
        "Встановіть придатний різець із коротким вильотом, правильною висотою вершини й жорстким затиском. Після відведення інструмента перевірте обертальну огинаючу способом, дозволеним виробником при ізольованому приводі.",
        "Mount an appropriate tool with short overhang, correct tip height and rigid clamping. Retract it and check the rotational envelope by a manufacturer-approved method with the drive isolated.",
      ),
      s(
        "Зробіть контрольований перший запуск",
        "Make a controlled first start",
        "Наставник перевіряє допустимі оберти патрона, кулачків, деталі та опор. Приберіть усе зі станини, закрийте захист і виконайте запуск за паспортом. За биття чи вібрації негайно зупиніть.",
        "Have the supervisor verify permissible speed for chuck, jaws, work and supports. Clear the bed, close guards and start under the manual. Stop immediately if runout or vibration appears.",
        "Ключ прибраний, межі швидкості перевірені, зазори вільні.",
        "The key is removed, speed limits checked and clearances free.",
      ),
    ],
    takeaways: [
      t(
        "Потужність двигуна не визначає безпечної частоти обертання конкретного кріплення.",
        "Motor power does not determine a safe speed for a particular workholding setup.",
      ),
      t(
        "Усі налаштування виконують у передбаченому безпечному стані.",
        "Make all adjustments in the prescribed safe state.",
      ),
    ],
    sources: [
      "ccohs-lathe",
      "haas-lathe",
      "lathe-anatomy-tv6m-passport",
      "lathe-anatomy-grizzly",
    ],
    quiz: q(
      "Яку межу обертів слід застосувати?",
      "Which speed limit must be used?",
      [
        t("Максимум із таблички двигуна", "The motor nameplate maximum"),
        t(
          "Найнижчу допустиму межу патрона, кулачків, деталі, опор і процесу",
          "The lowest permissible limit of chuck, jaws, work, supports and process",
        ),
        t("Будь-яку, якщо різець гострий", "Any speed if the tool is sharp"),
      ],
      1,
      "Безпечне встановлення обмежене найслабшим елементом і умовами процесу.",
      "The weakest element and process conditions limit the safe setup.",
    ),
  },
  {
    id: "lathe-centering",
    category: "lathe",
    title: t("Центрування та перевірка биття", "Centering and checking runout"),
    summary: t(
      "Виставляємо заготовку індикатором і розуміємо межі трикулачкового патрона.",
      "Align work with an indicator and understand the limits of a three-jaw chuck.",
    ),
    minutes: 12,
    level: "intermediate",
    tags: [t("Центрування", "Centering"), t("Індикатор", "Indicator")],
    prerequisites: ["lathe-setup", "dial-indicator", "spindle-condition"],
    model: "shaft",
    hazards: [
      t(
        "Індикаторне встановлення не повинно залишатися в зоні обертання під час пуску. Виставляйте деталь лише при ізольованому приводі.",
        "Indicator equipment must not remain in the rotating envelope at startup. Align the part only with the drive isolated.",
      ),
    ],
    steps: [
      s(
        "Визначте, яку поверхню центрувати",
        "Choose the surface to center",
        "За кресленням знайдіть функціональну вісь. Не центруйтеся автоматично по необробленій поверхні, якщо готова посадка має іншу базу. Перевірте чистоту й придатність вимірювальної доріжки.",
        "Find the functional axis from the drawing. Do not automatically center on a raw surface when the finished fit uses another datum. Check the measuring track is clean and suitable.",
      ),
      s(
        "Виберіть спосіб кріплення",
        "Choose the holding method",
        "Трикулачковий патрон зручний, але не гарантує повторної співвісності після перевстановлення. Для регулювання може знадобитися чотирикулачковий патрон, цанга або пристрій, схвалений наставником.",
        "A three-jaw chuck is convenient but does not guarantee repeat coaxiality after remounting. Adjustment may require a four-jaw chuck, collet or supervisor-approved fixture.",
      ),
      s(
        "Встановіть індикатор",
        "Mount the indicator",
        "Закріпіть стійку жорстко поза можливими зіткненнями. Налаштуйте контакт і попередній натяг за інструкцією індикатора. Спосіб ручного провертання при ізольованому приводі має дозволяти виробник верстата.",
        "Mount the stand rigidly clear of collisions. Set contact and preload under the indicator instructions. Manual rotation with the drive isolated must be permitted by the machine manufacturer.",
      ),
      s(
        "Порівняйте покази по колу",
        "Compare readings around the circle",
        "Повільно перевірте повний оберт дозволеним методом. Запишіть максимум і мінімум: їхня різниця — повне індикаторне биття, яке містить вплив форми та встановлення. Коригуйте затиск малими кроками з наставником.",
        "Check a complete revolution slowly using the approved method. Record maximum and minimum: their difference is total indicated runout, incorporating form and setup effects. Adjust clamping in small supervised increments.",
      ),
      s(
        "Перевірте повторно й приберіть оснащення",
        "Recheck and remove the equipment",
        "Після остаточного затягування повторіть вимірювання біля патрона та, якщо потрібно, далі вздовж деталі. Приберіть індикатор і ключі до відновлення приводу. Не називайте биття автоматично похибкою діаметра.",
        "After final tightening, repeat near the chuck and, if needed, farther along the work. Remove indicator and keys before restoring the drive. Do not treat runout as diameter error.",
        "Биття задокументоване, індикатор і ключ прибрані.",
        "Runout is recorded, indicator and key removed.",
      ),
    ],
    takeaways: [
      t(
        "Нуль у одному положенні не доводить центрування.",
        "A zero reading at one position does not prove centering.",
      ),
      t(
        "Повне биття й ексцентриситет не завжди тотожні через некруглість поверхні.",
        "Total runout and eccentricity are not always equivalent because surface form also contributes.",
      ),
    ],
    sources: ["mitutoyo-indicator", "ccohs-lathe"],
    quiz: q(
      "Індикатор показав від −0,03 до +0,02 мм. Який повний розмах?",
      "The indicator ranges from −0.03 to +0.02 mm. What is the total range?",
      [
        t("0,01 мм", "0.01 mm"),
        t("0,05 мм", "0.05 mm"),
        t("0,025 мм", "0.025 mm"),
      ],
      1,
      "Розмах дорівнює максимум мінус мінімум: 0,02 − (−0,03) = 0,05 мм.",
      "The range is maximum minus minimum: 0.02 − (−0.03) = 0.05 mm.",
    ),
  },
  {
    id: "lathe-facing",
    category: "lathe",
    title: t("Торцювання та базовий торець", "Facing and the reference end"),
    summary: t(
      "Створюємо торцеву базу, від якої можна вимірювати довжину деталі.",
      "Create an end datum from which part length can be measured.",
    ),
    minutes: 10,
    level: "beginner",
    tags: [t("Торцювання", "Facing"), t("База", "Datum")],
    prerequisites: [
      "lathe-setup",
      "cutting-parameters",
      "caliper",
      "tool-setting-lathe",
    ],
    model: "shaft",
    hazards: [
      t(
        "На торці різець наближається до осі та кулачків. Не допускайте контакту тримача з патроном; не міняйте висоту різця під час обертання.",
        "Facing brings the tool toward the axis and jaws. Prevent holder-to-chuck contact; never adjust tool height during rotation.",
      ),
    ],
    steps: [
      s(
        "Заплануйте припуск і затиск",
        "Plan allowance and grip",
        "Залиште достатній припуск на вирівнювання торця, водночас мінімізуючи виліт. Підтвердіть, що після операції залишиться місце для наступного кріплення та кінцевої довжини.",
        "Allow enough material to clean up the end while minimizing overhang. Confirm adequate stock remains for the next grip and final length.",
      ),
      s(
        "Виставте інструмент",
        "Set the tool",
        "У безпечному стані встановіть придатний торцювальний різець на висоту осі за дозволеним методом. Перевірте кути й зазор для всієї подачі до центра; неправильною висотою не компенсують тупу кромку.",
        "In the safe state, set a suitable facing tool to spindle center height by the approved method. Check geometry and clearance throughout travel to center; incorrect height cannot compensate for a dull edge.",
      ),
      s(
        "Виконайте пробне торцювання",
        "Make a trial facing cut",
        "Після перевірки наставником оберіть режим за інструментом, матеріалом і можливостями верстата. Підводьте інструмент контрольовано; не торкайтеся стружки й не спирайтеся на супорт, що рухається.",
        "After supervisor approval, select conditions for tool, material and machine capacity. Approach under control; do not touch chips or lean on the moving carriage.",
      ),
      s(
        "Оцініть поверхню після зупинки",
        "Assess the face after stopping",
        "Повністю зупиніть рух і захистіть верстат від пуску. Перевірте залишок необробленої поверхні, центральний виступ і стан кромки. За нерівностей перевірте затиск, інструмент та його висоту.",
        "Fully stop motion and prevent startup. Check for uncut areas, a center pip and edge condition. If the face is uneven, inspect clamping, tool condition and tip height.",
      ),
      s(
        "Призначте базу довжини",
        "Establish the length datum",
        "Позначте готовий торець як базу в технологічних записах. Вимірюйте наступні осьові розміри від нього, враховуючи задирки й температуру. Знімати фаску слід окремою контрольованою операцією.",
        "Record the finished end as the length datum. Measure subsequent axial dimensions from it, accounting for burrs and temperature. Add the chamfer as a separate controlled operation.",
        "Торець суцільно оброблений, база визначена.",
        "The face is fully cleaned up and the datum established.",
      ),
    ],
    takeaways: [
      t(
        "Якісний базовий торець спрощує весь подальший контроль довжини.",
        "A sound end datum simplifies all later length checks.",
      ),
      t(
        "Центральний виступ є приводом перевірити налаштування, а не торкатися його на ходу.",
        "A center pip calls for checking the setup, never touching it while moving.",
      ),
    ],
    sources: ["sandvik-external", "ccohs-lathe"],
    quiz: q(
      "Коли оцінювати центральний виступ на торці?",
      "When should you assess a center pip on the face?",
      [
        t("Пальцем під час обертання", "With a finger during rotation"),
        t(
          "Після повної зупинки та захисту від пуску",
          "After a full stop and prevention of startup",
        ),
        t(
          "Підвівши губки штангенциркуля на ходу",
          "By bringing caliper jaws to it while running",
        ),
      ],
      1,
      "Огляд і вимірювання потребують повної зупинки та безпечного стану.",
      "Inspection and measurement require a full stop and the safe state.",
    ),
  },
  {
    id: "lathe-turning",
    category: "lathe",
    title: t(
      "Поздовжнє точіння та уступи",
      "Longitudinal turning and shoulders",
    ),
    summary: t(
      "Переходимо від чорнових проходів до контрольованого діаметра та довжини уступу.",
      "Move from roughing passes to a controlled diameter and shoulder length.",
    ),
    minutes: 14,
    level: "intermediate",
    tags: [t("Точіння", "Turning"), t("Уступ", "Shoulder")],
    prerequisites: [
      "lathe-facing",
      "micrometer",
      "lathe-centering",
      "backlash-leadscrews",
    ],
    model: "shaft",
    hazards: [
      t(
        "Довга тонка деталь може прогнутися або почати бити. Потребу в задній бабці чи люнеті визначають за геометрією та документацією, не за універсальним правилом вильоту.",
        "Long slender work may deflect or whip. Determine tailstock or steady-rest support from geometry and documentation rather than a universal overhang rule.",
      ),
    ],
    steps: [
      s(
        "Розділіть чорнову й чистову обробку",
        "Separate roughing and finishing",
        "За кресленням запишіть діаметри, довжини уступів і припуски. Передбачте радіус вершини: гострий внутрішній кут не утворюється автоматично й може заважати спряженню.",
        "List diameters, shoulder lengths and allowances from the drawing. Account for tool nose radius: a sharp internal corner is not automatic and may interfere with mating parts.",
      ),
      s(
        "Перевірте підтримку та рух супорта",
        "Check support and carriage travel",
        "У безпечному стані перевірте виліт, опору, затиск різця й межу наближення до кулачків. Якщо застосована задня бабка, її встановлення та зусилля задає процедура верстата.",
        "In the safe state, check overhang, support, tool clamping and approach limits near the jaws. If a tailstock is used, set it and its load under the machine procedure.",
      ),
      s(
        "Зніміть основний припуск",
        "Remove the bulk allowance",
        "Виконайте погоджені з наставником проходи, залишивши запас на чистову обробку. На ручному верстаті заздалегідь визначте спосіб зупинки подачі перед уступом; не покладайтеся лише на реакцію.",
        "Make supervisor-approved passes, retaining finishing allowance. On a manual lathe, establish how feed will stop before the shoulder; do not rely only on reaction time.",
      ),
      s(
        "Виміряйте та розрахуйте корекцію",
        "Measure and calculate the correction",
        "Після зупинки й охолодження виміряйте діаметр у кількох перерізах. Для зменшення діаметра на 0,20 мм радіальне знімання становить 0,10 мм; перевірте, як саме проградуйований ваш лімб.",
        "After stopping and temperature stabilization, measure diameter in several sections. Reducing diameter by 0.20 mm requires 0.10 mm radial removal; verify whether your dial displays radius or diameter change.",
      ),
      s(
        "Завершіть і проконтролюйте",
        "Finish and inspect",
        "Виконайте чистовий прохід за погодженим режимом, потім перевірте діаметри, конусність, довжини й фаски. Не намагайтеся виправити замалий діаметр шліфуванням; зафіксуйте відхилення та обговоріть рішення.",
        "Make the finishing pass under the approved conditions, then check diameters, taper, lengths and chamfers. Do not attempt to fix an undersize diameter by sanding; record the deviation and discuss disposition.",
        "Усі діаметри й довжини записані разом із межами допусків.",
        "All diameters and lengths are recorded with their tolerance limits.",
      ),
    ],
    takeaways: [
      t(
        "Радіальна подача й зміна діаметра можуть відрізнятися вдвічі.",
        "Radial movement and diameter change can differ by a factor of two.",
      ),
      t(
        "Змінний діаметр уздовж довжини вимагає пошуку причини, а не випадкових поправок.",
        "Diameter variation along the length requires finding a cause rather than random corrections.",
      ),
    ],
    sources: ["sandvik-external", "sandvik-turning"],
    quiz: q(
      "На скільки радіально наблизити різець для зменшення Ø на 0,10 мм?",
      "What radial movement reduces the diameter by 0.10 mm?",
      [
        t("0,20 мм", "0.20 mm"),
        t("0,10 мм", "0.10 mm"),
        t(
          "0,05 мм, з перевіркою показу лімба",
          "0.05 mm, checking the dial convention",
        ),
      ],
      2,
      "Матеріал знімається з обох боків діаметра. Показ лімба залежить від конструкції верстата.",
      "Material is removed around both sides of the diameter. Dial indication depends on the machine design.",
    ),
  },
  {
    id: "lathe-drilling",
    category: "lathe",
    title: t("Центровий і осьовий отвір", "Center holes and axial drilling"),
    summary: t(
      "Свердління із задньої бабки та підготовка центра для підтримки деталі.",
      "Drill from the tailstock and prepare a center hole for supporting the work.",
    ),
    minutes: 11,
    level: "intermediate",
    tags: [t("Свердління", "Drilling"), t("Задня бабка", "Tailstock")],
    prerequisites: [
      "lathe-facing",
      "drill-press",
      "drilling-tools",
      "spindle-condition",
    ],
    model: "shaft",
    hazards: [
      t(
        "Свердло чи патрон задньої бабки можуть провернутися при неправильному встановленні. Не стримуйте їх рукою.",
        "A tailstock drill or chuck may spin if incorrectly mounted. Never restrain it by hand.",
      ),
      t(
        "Осьовий отвір не завжди є придатним центровим гніздом для опори; потрібні відповідна геометрія й центр.",
        "An ordinary axial hole is not necessarily a suitable support center hole; the geometry and center must match.",
      ),
    ],
    steps: [
      s(
        "Уточніть призначення отвору",
        "Clarify the hole function",
        "Відрізніть отвір під кріплення від центрового гнізда для опори. Визначте діаметр, глибину та допустиму форму дна; звичайне свердло залишає конічний кінець.",
        "Distinguish a fastener hole from a support center hole. Define diameter, depth and acceptable bottom shape; a normal twist drill leaves a conical bottom.",
      ),
      s(
        "Перевірте торець і співвісність",
        "Check the face and alignment",
        "Торець має бути підготовлений, а задня бабка — перевірена за процедурою. У безпечному стані очистіть конічні посадки й встановіть відповідне оснащення; не вставляйте брудний конус.",
        "Prepare the face and verify tailstock alignment under the procedure. In the safe state, clean taper seats and fit suitable tooling; never insert a dirty taper.",
      ),
      s(
        "Виберіть початковий інструмент",
        "Choose the starting tool",
        "Для осьового свердління доберіть засіб початкового центрування, сумісний із кутом основного свердла. Для опорного центра використайте центрове свердло потрібної форми й розміру за технологією.",
        "For axial drilling, choose a spotting method compatible with the main drill point angle. For a support center, use the specified center-drill form and size under the process plan.",
      ),
      s(
        "Свердліть за погодженим процесом",
        "Drill under the approved process",
        "З наставником установіть режим і контроль глибини з урахуванням вершини свердла. Не перевищуйте хід пінолі та не допускайте її слабкого затиску. Стружку прибирайте після зупинки.",
        "Set cutting conditions and depth control with the supervisor, allowing for the drill point. Do not exceed quill travel or leave the tailstock unsecured. Remove chips after stopping.",
      ),
      s(
        "Перевірте отвір і опору",
        "Check the hole and support",
        "Після зупинки перевірте вхід, глибину та задирки. Якщо отвір слугуватиме опорою, наставник має підтвердити правильний контакт центра, змащування та допустимі оберти відповідно до типу центра.",
        "After stopping, check entry, depth and burrs. If the hole supports the part, have the supervisor verify center contact, lubrication and permissible speed for that center type.",
        "Отвір відповідає своєму призначенню; стружки в посадці немає.",
        "The hole suits its function and the seat is free of chips.",
      ),
    ],
    takeaways: [
      t(
        "Глибина циліндричної частини отвору відрізняється від глибини до вершини свердла.",
        "Full-diameter hole depth differs from depth to the drill tip.",
      ),
      t(
        "Підтримка центром потребує сумісних поверхонь, а не будь-якого заглиблення.",
        "Center support requires compatible surfaces, not just any depression.",
      ),
    ],
    sources: ["ccohs-lathe", "sandvik-turning"],
    quiz: q(
      "Чому важливо врахувати вершину свердла?",
      "Why must you account for the drill point?",
      [
        t("Вона не впливає на геометрію", "It has no effect on geometry"),
        t(
          "Глибина до вершини більша за глибину повного діаметра",
          "Tip depth exceeds full-diameter depth",
        ),
        t("Вона замінює контроль глибини", "It replaces depth control"),
      ],
      1,
      "Конус вершини займає частину глибини; це особливо важливо для глухих отворів.",
      "The point cone occupies part of the depth, especially important in blind holes.",
    ),
  },
  {
    id: "mill-setup",
    category: "milling",
    title: t(
      "Підготовка ручного фрезерного верстата",
      "Prepare a manual milling machine",
    ),
    summary: t(
      "Напрямки осей, лещата, тримачі інструмента та обмеження ручної подачі.",
      "Understand axis directions, the vice, toolholders and manual-feed limitations.",
    ),
    minutes: 12,
    level: "beginner",
    tags: [t("Ручний фрезерний", "Manual mill"), t("Налаштування", "Setup")],
    prerequisites: [
      "workholding-basics",
      "entanglement",
      "energy-isolation",
      "daily-inspection",
    ],
    model: "vice",
    hazards: [
      t(
        "Кінцеву фрезу не затискають у звичайний свердлильний патрон, не призначений для бокових сил. Потрібний сумісний фрезерний тримач.",
        "Do not hold an end mill in an ordinary drill chuck not designed for side loads. Use a compatible milling holder.",
      ),
      t(
        "Люфт гвинтів може дозволити фрезі самовільно підтягнути стіл при попутному фрезеруванні; спосіб подачі узгодьте з наставником.",
        "Screw backlash can let the cutter pull the table during climb milling; agree the feed strategy with your supervisor.",
      ),
    ],
    steps: [
      s(
        "Вивчіть напрямки руху",
        "Learn the motion directions",
        "На зупиненому верстаті визначте X, Y і Z, напрямки маховиків, лімби, фіксатори та обмеження ходу. Не переносіть напрямок руху стола бездумно на напрямок руху інструмента відносно деталі.",
        "With the machine stopped, identify X, Y and Z, handwheel directions, dials, locks and travel limits. Do not confuse table movement with tool movement relative to the work.",
      ),
      s(
        "Встановіть лещата",
        "Mount the vice",
        "Очистіть стіл і підошву, встановіть придатні Т-пазові кріплення. Лещата мають бути закріплені, а їхня нерухома губка — перевірена індикатором, якщо маршрут потребує паралельності осі.",
        "Clean the table and vice base and use appropriate T-slot hardware. Secure the vice and indicate the fixed jaw when the process requires alignment with an axis.",
      ),
      s(
        "Встановіть інструмент",
        "Mount the cutter",
        "За процедурою ізоляції очистіть посадки й затисніть справну фрезу в сумісному тримачі з мінімальним достатнім вильотом. Момент затягування й затиск хвостовика беріть із документації оснащення.",
        "Under the isolation procedure, clean seats and clamp a sound cutter in a compatible holder with minimal necessary overhang. Use the holder documentation for tightening and shank grip requirements.",
      ),
      s(
        "Перевірте люфт і траєкторію",
        "Check backlash and travel",
        "З наставником оцініть люфт, спосіб вибору зазору й допустимий напрямок різання. Перевірте, що фреза, шпиндель і стіл не зіткнуться з губками, підкладками та болтами на всьому ході.",
        "With the supervisor, assess backlash, how to take it up and the permitted cutting direction. Check that cutter, spindle and table clear jaws, parallels and bolts over the complete travel.",
      ),
      s(
        "Підготуйте запуск",
        "Prepare to start",
        "Закріпіть заготовку, приберіть ключі, встановіть захист і перевірте режим. Першу операцію виконуйте під наглядом; не змінюйте кріплення або вимірювальне оснащення до повної зупинки.",
        "Secure the work, remove keys, fit guards and verify cutting conditions. Perform the first operation under supervision; change neither workholding nor measurement equipment before a full stop.",
        "Оснащення закріплене; рухи й напрямок подачі зрозумілі.",
        "Workholding is secured; motions and feed direction are understood.",
      ),
    ],
    takeaways: [
      t(
        "Різальна частина та тримач утворюють одну систему з обмеженнями.",
        "The cutter and holder form one system with defined limits.",
      ),
      t(
        "Зручна траєкторія має враховувати весь габарит інструмента, а не лише його вісь.",
        "A usable path must clear the whole tool envelope, not only its centerline.",
      ),
    ],
    sources: ["ccohs-mill", "sandvik-milling"],
    quiz: q(
      "Чи можна використати звичайний свердлильний патрон для бокового фрезерування?",
      "May an ordinary drill chuck be used for side milling?",
      [
        t("Так, якщо різ легкий", "Yes, for a light cut"),
        t(
          "Лише якщо виробник прямо дозволяє відповідне фрезерне навантаження",
          "Only if the manufacturer explicitly rates it for that milling load",
        ),
        t("Так, на низьких обертах", "Yes, at low speed"),
      ],
      1,
      "Бокові сили та ризик виходу інструмента вимагають придатної конструкції тримача.",
      "Side loads and tool pullout risks require a suitable holder design.",
    ),
  },
  {
    id: "mill-datums",
    category: "milling",
    title: t("Бази, край і нуль деталі", "Datums, edges and part zero"),
    summary: t(
      "Прив’язуємо координати до фізичних поверхонь і враховуємо радіус вимірювального щупа.",
      "Tie coordinates to physical surfaces and account for the locating probe radius.",
    ),
    minutes: 11,
    level: "intermediate",
    tags: [t("Базування", "Datums"), t("Нуль деталі", "Part zero")],
    prerequisites: ["mill-setup", "technical-drawing", "dial-indicator"],
    model: "bracket",
    hazards: [
      t(
        "Механічні крайкошукачі та електронні щупи працюють за різними правилами. Не копіюйте оберти або прийоми одного пристрою на інший.",
        "Mechanical edge finders and electronic probes follow different rules. Do not transfer the speed or technique from one device to another.",
      ),
    ],
    steps: [
      s(
        "Оберіть повторювані бази",
        "Choose repeatable datums",
        "За кресленням визначте опорну площину, бічну базу й торець. Запишіть місце нуля на ескізі, щоб координати не залежали від пам’яті оператора.",
        "Identify the support face, side datum and end from the drawing. Mark the origin on a sketch so coordinates do not depend on the operator’s memory.",
      ),
      s(
        "Підготуйте пристрій прив’язки",
        "Prepare the locating device",
        "Оберіть щуп, крайкошукач або індикатор, перевірте справність і калібрування за його інструкцією. Підведення до краю виконуйте лише дозволеним методом і з малими керованими переміщеннями.",
        "Select a probe, edge finder or indicator and check condition and calibration under its instructions. Approach the edge only by the approved method with small controlled moves.",
      ),
      s(
        "Врахуйте геометрію контакту",
        "Account for contact geometry",
        "Якщо прилад визначає положення своєї осі на відстані радіуса від краю, внесіть правильну знакову поправку. Наприклад, радіус 5 мм не означає, що край уже перебуває під віссю шпинделя.",
        "If the device locates its axis one radius away from the edge, apply the correct signed correction. A 5 mm radius does not mean the edge is already beneath the spindle axis.",
      ),
      s(
        "Встановіть висотну базу",
        "Establish the height datum",
        "Використайте схвалений метод визначення Z із зупиненим різальним інструментом. Врахуйте товщину контактного еталона. Не затискайте пальці між фрезою й заготовкою та не підсовуйте папір до обертової фрези.",
        "Use an approved Z-setting method with the cutting tool stopped. Account for the reference block thickness. Keep fingers out of the gap and never offer paper to a rotating cutter.",
      ),
      s(
        "Перевірте незалежною точкою",
        "Verify with an independent point",
        "Відведіть прилад і перевірте відому відстань або іншу поверхню. Перед різанням переконайтеся, що напрямки координат та одиниці правильні. Після перевстановлення повторіть прив’язку.",
        "Retract the device and check a known distance or another surface. Verify coordinate directions and units before cutting. Re-establish the location after any remounting.",
        "Нуль і знаки перевірені іншим вимірюванням.",
        "The origin and signs are checked by another measurement.",
      ),
    ],
    takeaways: [
      t(
        "Контакт із краєм і координата осі щупа — різні положення.",
        "Edge contact and probe-axis position are different locations.",
      ),
      t(
        "Нуль деталі має бути однаковим на ескізі, в програмі й на верстаті.",
        "The part origin must agree between sketch, program and machine.",
      ),
    ],
    sources: ["haas-setup", "mitutoyo-indicator"],
    quiz: q(
      "Що перевірити після встановлення нуля?",
      "What should you verify after setting the origin?",
      [
        t(
          "Відому незалежну відстань, одиниці та знаки осей",
          "An independent known distance, units and axis signs",
        ),
        t(
          "Лише те, що дисплей показує нулі",
          "Only that the display shows zeros",
        ),
        t("Тільки колір заготовки", "Only the stock color"),
      ],
      0,
      "Нулі на дисплеї можуть бути правильними для неправильного фізичного положення.",
      "A display can show zeros at the wrong physical location.",
    ),
  },
  {
    id: "mill-facing",
    category: "milling",
    title: t("Площини, паралельність і розмір", "Faces, parallelism and size"),
    summary: t(
      "Створюємо опорні площини та доводимо прямокутну заготовку до розміру.",
      "Create reference faces and bring rectangular stock to size.",
    ),
    minutes: 13,
    level: "intermediate",
    tags: [t("Площина", "Face"), t("Паралельність", "Parallelism")],
    prerequisites: [
      "mill-datums",
      "cutting-parameters",
      "micrometer",
      "tool-setting-mill",
    ],
    model: "bracket",
    hazards: [
      t(
        "Фреза може підняти погано посаджену заготовку. Перевіряйте опору й затиск після кожного перевстановлення.",
        "A cutter can lift poorly seated work. Check support and clamping after every setup change.",
      ),
    ],
    steps: [
      s(
        "Позначте порядок поверхонь",
        "Define the face sequence",
        "Виберіть першу площину A, потім протилежну та бічну базу B. Передбачте припуск на кожний бік, щоб жодна необроблена поверхня не стала випадковою кінцевою базою.",
        "Choose the first face A, then the opposite face and side datum B. Allocate allowance on each side so no unfinished face accidentally becomes a final datum.",
      ),
      s(
        "Посадіть деталь на опори",
        "Seat the work on supports",
        "Очистіть підкладки й губки, затисніть заготовку придатним способом. Перевірте посадку за процедурою майстерні; не простукуйте по крихких підкладках або деталях невідповідним молотком.",
        "Clean parallels and jaws and clamp by a suitable method. Verify seating under the workshop procedure; do not strike brittle parallels or parts with an unsuitable hammer.",
      ),
      s(
        "Обробіть першу площину",
        "Machine the first face",
        "З наставником перевірте діаметр фрези, охоплення й режим. Заплануйте вхід, вихід та перекриття проходів. Різання не повинно вимагати наближення рук до фрези або очищення на ходу.",
        "Verify cutter diameter, engagement and conditions with your supervisor. Plan entry, exit and pass overlap. Cutting must not require hands near the cutter or cleaning while running.",
      ),
      s(
        "Переверніть і доведіть товщину",
        "Reverse and finish thickness",
        "Після повної зупинки та потрібної ізоляції очистіть базу A й покладіть її на опори. Виміряйте товщину в кількох місцях, зніміть обчислений припуск і залиште керований запас на фініш.",
        "After stopping and required isolation, clean face A and locate it on the supports. Measure thickness in several places, remove the calculated allowance and retain a controlled finishing allowance.",
      ),
      s(
        "Окремо перевірте форму",
        "Check form separately",
        "Виміряйте товщину, паралельність і перпендикулярність відповідними засобами. Одна правильна товщина не підтверджує плоскість. Позначте готові бази для наступного встановлення.",
        "Check thickness, parallelism and squareness with suitable instruments. One correct thickness reading does not establish flatness. Identify finished datums for the next setup.",
        "Готові бази позначені; перевірено кілька точок.",
        "Finished datums are marked and multiple points checked.",
      ),
    ],
    takeaways: [
      t(
        "Кожне перевстановлення починається з очищення баз.",
        "Every remounting begins with cleaning the datums.",
      ),
      t(
        "Товщина, плоскість і паралельність перевіряються окремо.",
        "Thickness, flatness and parallelism require separate checks.",
      ),
    ],
    sources: ["ccohs-mill", "mitutoyo-small"],
    quiz: q(
      "Чи достатньо одного вимірювання товщини для підтвердження паралельності?",
      "Is one thickness reading enough to confirm parallelism?",
      [
        t("Так, якщо інструмент цифровий", "Yes, if the instrument is digital"),
        t(
          "Ні, потрібен відповідний контроль у кількох місцях",
          "No, suitable checks at multiple locations are needed",
        ),
        t("Так, якщо різання було повільним", "Yes, if cutting was slow"),
      ],
      1,
      "Один вимір характеризує лише одну ділянку, а не взаємну орієнтацію поверхонь.",
      "One reading describes one location, not the relative orientation of the faces.",
    ),
  },
  {
    id: "mill-pockets",
    category: "milling",
    title: t(
      "Пази, кишені та внутрішні кути",
      "Slots, pockets and internal corners",
    ),
    summary: t(
      "Плануємо доступ інструмента, врізання й контроль глибини без перевантаження фрези.",
      "Plan tool access, entry and depth control without overloading the cutter.",
    ),
    minutes: 14,
    level: "advanced",
    tags: [t("Паз", "Slot"), t("Кишеня", "Pocket")],
    prerequisites: [
      "mill-facing",
      "mill-datums",
      "cutting-parameters",
      "milling-cutters",
      "backlash-leadscrews",
    ],
    model: "bracket",
    hazards: [
      t(
        "Не кожна кінцева фреза допускає осьове врізання. Замкнене різання може швидко забити канавки стружкою та зламати інструмент.",
        "Not every end mill permits axial plunging. Enclosed cutting can rapidly pack flutes with chips and break the tool.",
      ),
    ],
    steps: [
      s(
        "Перевірте технологічність геометрії",
        "Check the geometry can be machined",
        "Порівняйте ширину паза, глибину, радіуси та доступ із діаметром і робочою довжиною фрези. Кругла фреза залишає радіус у внутрішньому куті; гострий кут потребує іншого рішення.",
        "Compare slot width, depth, radii and access against cutter diameter and flute length. A round cutter leaves internal radii; a sharp corner requires another solution.",
      ),
      s(
        "Сплануйте вхід та вихід",
        "Plan entry and exit",
        "Оберіть попередній отвір, дозволене врізання або іншу стратегію за даними інструмента. Під час ручної обробки складний замкнений маршрут спочатку перевірте з наставником без різання.",
        "Choose a predrilled entry, permitted plunge or another strategy from tool data. For manual machining, review a complex enclosed path with your supervisor before cutting.",
      ),
      s(
        "Розділіть глибину на погоджені проходи",
        "Divide depth into approved passes",
        "Глибину, бокове охоплення й подачу погоджуйте як пов’язаний набір параметрів. Не переносіть режим бокового фрезерування на повний паз без перерахунку за рекомендаціями виробника.",
        "Treat depth, radial engagement and feed as a linked parameter set. Do not transfer side-milling conditions to full-slot cutting without recalculating under the manufacturer’s recommendations.",
      ),
      s(
        "Контролюйте стружку та стан різання",
        "Monitor chips and cutting behavior",
        "Залишайте зону різання закритою захистом і спостерігайте з безпечного положення. За наростання вібрації, забивання або перегріву зупиніться; очищення виконуйте після зупинки й потрібної ізоляції.",
        "Keep the cutting area guarded and observe from a safe position. Stop for increasing chatter, chip packing or overheating; clean only after stopping and required isolation.",
      ),
      s(
        "Виміряйте ширину й глибину",
        "Measure width and depth",
        "На нерухомій очищеній деталі перевірте ширину, глибину та радіуси відповідними засобами. Не припускайте, що ширина дорівнює маркованому діаметру фрези: биття й відгин змінюють результат.",
        "On stationary clean work, check width, depth and radii with suitable instruments. Do not assume width equals marked cutter diameter: runout and deflection change the result.",
        "Кишеня виміряна; внутрішні радіуси враховані.",
        "The pocket is measured and internal radii accounted for.",
      ),
    ],
    takeaways: [
      t(
        "Геометрія інструмента обмежує форму внутрішнього кута.",
        "Tool geometry limits internal corner shape.",
      ),
      t(
        "Повний паз навантажує інструмент інакше, ніж легкий боковий прохід.",
        "Full-slot cutting loads the tool differently from a light side cut.",
      ),
    ],
    sources: ["sandvik-milling"],
    quiz: q(
      "Чи можна будь-якою кінцевою фрезою врізатися прямо вниз?",
      "Can every end mill plunge straight down?",
      [
        t("Так, усі фрези однакові", "Yes, all end mills are equivalent"),
        t(
          "Ні, потрібен дозволений виробником спосіб входу",
          "No, entry must be permitted by the tool manufacturer",
        ),
        t("Так, якщо додати мастила", "Yes, with more lubricant"),
      ],
      1,
      "Здатність різати центром і допустимі режими входу залежать від конструкції фрези.",
      "Center-cutting capability and entry limits depend on cutter design.",
    ),
  },
  {
    id: "cnc-workflow",
    category: "cnc",
    title: t(
      "Від CAD до ЧПУ: весь маршрут",
      "From CAD to CNC: the complete workflow",
    ),
    summary: t(
      "Модель, CAM, постпроцесор і налаштування верстата як одна перевірена послідовність.",
      "Connect the model, CAM, postprocessor and machine setup into one verified sequence.",
    ),
    minutes: 12,
    level: "intermediate",
    tags: [t("ЧПУ", "CNC"), t("CAD / CAM", "CAD / CAM")],
    prerequisites: [
      "technical-drawing",
      "mill-setup",
      "cutting-parameters",
      "tooling-requirements",
    ],
    model: "bracket",
    hazards: [
      t(
        "Симуляція не гарантує відсутності зіткнень на реальному верстаті. Помилки нуля, інструмента або постпроцесора залишаються небезпечними.",
        "Simulation cannot guarantee collision-free operation on the actual machine. Origin, tool and postprocessor errors remain hazardous.",
      ),
      t(
        "Не обходьте блокування дверей і не залишайте навчальну обробку без нагляду.",
        "Do not bypass door interlocks or leave a learning operation unattended.",
      ),
    ],
    steps: [
      s(
        "Зафіксуйте ревізію моделі",
        "Freeze the model revision",
        "Перевірте одиниці, матеріал і креслення. Запишіть ревізію CAD та орієнтацію заготовки. Модель без допусків не замінює виробничої документації.",
        "Verify units, material and drawing. Record the CAD revision and stock orientation. A model without tolerances does not replace manufacturing documentation.",
      ),
      s(
        "Описуйте реальне встановлення в CAM",
        "Model the actual setup in CAM",
        "Внесіть розмір заготовки, нуль, губки, затиски, тримачі й виліт інструмента. Заплануйте послідовність так, щоб після кожної операції залишалося надійне кріплення.",
        "Enter stock size, origin, jaws, clamps, holders and tool overhang. Sequence operations so secure workholding remains after each cut.",
      ),
      s(
        "Перевірте траєкторії",
        "Review the toolpaths",
        "Перегляньте входи, виходи, швидкі переміщення, залишок матеріалу й можливі зіткнення тримача. Сверління, врізання та бокове різання мають власні обмеження інструмента.",
        "Review entries, exits, rapid moves, remaining stock and holder collisions. Drilling, plunging and side cutting have separate tool limitations.",
      ),
      s(
        "Використайте перевірений постпроцесор",
        "Use a validated postprocessor",
        "Постпроцесор має відповідати моделі верстата, контролеру та його конфігурації. З наставником звірте одиниці, площину, компенсації, координати й команди зміни інструмента в отриманій програмі.",
        "The postprocessor must match the machine, controller and configuration. Review units, plane, compensation, coordinates and tool-change commands in the output with your supervisor.",
      ),
      s(
        "Передайте комплект налаштування",
        "Create the setup package",
        "Разом із програмою збережіть лист налаштування: затиск, нуль, інструменти, виступи, режими й точки контролю. Перед першим різанням обов’язково пройдіть окрему перевірку прив’язок і пробний прогін.",
        "Save a setup sheet with the program: workholding, origin, tools, stickout, conditions and inspection points. Before first cutting, complete separate offset checks and a prove-out.",
        "Фізичне встановлення відповідає CAM та листу налаштування.",
        "The physical setup matches CAM and the setup sheet.",
      ),
    ],
    takeaways: [
      t(
        "Програма без листа налаштування не описує весь процес.",
        "A program without a setup sheet does not describe the whole process.",
      ),
      t(
        "Зміна затиску, довжини інструмента чи ревізії моделі потребує повторної перевірки.",
        "Changes to workholding, tool length or model revision require revalidation.",
      ),
    ],
    sources: ["haas-safety", "haas-setup"],
    quiz: q(
      "Що обов’язково включити до CAM-встановлення?",
      "What must be included in a CAM setup?",
      [
        t("Лише готову деталь", "Only the finished part"),
        t(
          "Заготовку, затиски, тримачі та реальний нуль",
          "Stock, clamps, holders and the actual origin",
        ),
        t("Лише бажаний час обробки", "Only the desired cycle time"),
      ],
      1,
      "Колізії часто пов’язані з кріпленням і тримачем, яких не видно в моделі готової деталі.",
      "Collisions often involve clamps and holders absent from a finished-part model.",
    ),
  },
  {
    id: "cnc-offsets",
    category: "cnc",
    title: t("Робочі та інструментальні корекції", "Work and tool offsets"),
    summary: t(
      "Розрізняємо машинний нуль, нуль деталі, довжину інструмента та поправку на знос.",
      "Separate machine home, part origin, tool length and wear correction.",
    ),
    minutes: 13,
    level: "intermediate",
    tags: [t("ЧПУ", "CNC"), t("Корекції", "Offsets")],
    prerequisites: ["cnc-workflow", "mill-datums", "tool-setting-mill"],
    hazards: [
      t(
        "Хибна корекція Z може спрямувати інструмент у деталь, лещата або стіл. Не вводьте значення, не розуміючи активної системи координат.",
        "An incorrect Z offset can drive the tool into work, vice or table. Never enter a value without understanding the active coordinate system.",
      ),
    ],
    steps: [
      s(
        "Розділіть системи координат",
        "Separate coordinate systems",
        "Машинна система походить від реферування верстата. Робоча система описує розташування деталі. Інструментальна корекція описує інструмент; ці дані не можна взаємозамінювати.",
        "Machine coordinates originate from machine referencing. Work coordinates locate the part. Tool compensation describes the tool; these values are not interchangeable.",
      ),
      s(
        "Перевірте карту інструментів",
        "Check the tool map",
        "Зіставте номер інструмента, комірку, діаметр, довжину й потрібний регістр із листом налаштування. Поведінка автоматичного застосування корекцій залежить від контролера та версії, тому користуйтеся його паспортом.",
        "Match tool number, pocket, diameter, length and required register to the setup sheet. Automatic offset behavior depends on controller and version, so use its manual.",
      ),
      s(
        "Встановіть робочий нуль",
        "Set the work origin",
        "З наставником виконайте дозволену процедуру щупом або іншим засобом. Запишіть, які поверхні задають X, Y та Z, і яку робочу систему вибрано в програмі.",
        "With the supervisor, follow the approved probing or locating procedure. Record which surfaces establish X, Y and Z and which work system the program selects.",
      ),
      s(
        "Виміряйте інструменти окремо",
        "Measure the tools separately",
        "Використайте штатний вимірювач або іншу схвалену методику. Не змішуйте абсолютні значення й прирости. Після введення уважно звірте знак, одиниці та порядок величини з очікуваними.",
        "Use the machine tool setter or another approved method. Do not confuse absolute values with increments. After entry, check sign, units and order of magnitude against expectations.",
      ),
      s(
        "Перевірте прив’язки без різання",
        "Verify offsets without cutting",
        "У безпечному режимі, визначеному контролером, перевірте прогнозоване положення вершини на погодженій відстані від деталі. Інша людина має незалежно звірити критичні значення перед пробним прогоном.",
        "In the safe mode defined by the controller, verify the predicted tool-tip position at an agreed clearance from the part. Have another person independently check critical values before prove-out.",
        "Активні робоча система й регістри відповідають програмі.",
        "Active work coordinates and registers match the program.",
      ),
    ],
    takeaways: [
      t(
        "Корекція на знос — мала керована поправка, а не місце для приховування помилок налаштування.",
        "Wear compensation is a small controlled correction, not a place to hide setup errors.",
      ),
      t(
        "Кнопки й порядок прив’язки залежать від конкретного контролера.",
        "Buttons and offset-setting order depend on the specific controller.",
      ),
    ],
    sources: ["haas-setup"],
    quiz: q(
      "Чи взаємозамінні робочий нуль і довжина інструмента?",
      "Are the work origin and tool length interchangeable?",
      [
        t(
          "Так, якщо результат однаковий на дисплеї",
          "Yes, if the display looks the same",
        ),
        t(
          "Ні, вони описують різні фізичні величини",
          "No, they describe different physical quantities",
        ),
        t("Так, для будь-якого контролера", "Yes, on every controller"),
      ],
      1,
      "Змішування цих даних створює приховані помилки, особливо після зміни інструмента.",
      "Mixing these values creates hidden errors, especially after a tool change.",
    ),
  },
  {
    id: "cnc-prove-out",
    category: "cnc",
    title: t(
      "Перший прогін і контроль ЧПУ",
      "CNC prove-out and first-part control",
    ),
    summary: t(
      "Перевірка першого циклу з наставником, закритими дверима та визначеними умовами зупинки.",
      "Validate the first cycle with a supervisor, closed doors and clear stop conditions.",
    ),
    minutes: 14,
    level: "advanced",
    tags: [t("ЧПУ", "CNC"), t("Перший прогін", "Prove-out")],
    prerequisites: [
      "cnc-offsets",
      "inspection-plan",
      "chips-fire",
      "tool-condition",
      "daily-inspection",
    ],
    hazards: [
      t(
        "Single Block, Dry Run і зменшення подачі не усувають колізій та можуть діяти на цикли й швидкі переміщення по-різному. Вивчіть поведінку конкретного контролера.",
        "Single Block, Dry Run and feed overrides do not eliminate collisions and may affect cycles and rapids differently. Learn the exact controller behavior.",
      ),
      t(
        "Не відкривайте двері й не відключайте блокування для кращого огляду.",
        "Never open doors or defeat interlocks for a better view.",
      ),
    ],
    steps: [
      s(
        "Проведіть спільну перевірку",
        "Conduct a joint review",
        "З наставником звірте програму, ревізію, інструменти, затиск, нуль і допустимі оберти. Визначте місця обов’язкової зупинки та які розміри перевіряти після кожного етапу.",
        "With the supervisor, verify program, revision, tools, workholding, origin and permissible speed. Define mandatory stop points and measurements after each stage.",
      ),
      s(
        "Виконайте передбачену симуляцію",
        "Run the supported simulation",
        "Перегляньте графіку контролера й CAM із повним оснащенням. Окремо оцініть зміну інструмента, повернення до референса та швидкі переходи. Програма має відповідати фактичному встановленню, не лише моделі.",
        "Review controller graphics and CAM with complete tooling. Assess tool changes, reference returns and rapid transitions separately. The program must match the actual setup, not just the model.",
      ),
      s(
        "Застосуйте дозволений режим перевірки",
        "Use the approved verification mode",
        "Спосіб холостого або покрокового прогону визначає виробник і наставник. Контрольована перевірка на відстані від заготовки потребує окремо перевірених прив’язок; самовільне зміщення нуля небезпечне.",
        "The manufacturer and supervisor define air-cut or step-through methods. Controlled verification clear of the stock requires separately checked offsets; casually shifting the origin is hazardous.",
      ),
      s(
        "Спостерігайте за першим різанням",
        "Observe the first cutting operation",
        "Тримайте двері закритими та залишайтеся біля пульта. За неочікуваного руху, шуму, вібрації, задимлення чи зміщення деталі зупиняйте обладнання відповідним засобом; не лізьте всередину.",
        "Keep doors closed and remain at the controls. Stop with the appropriate control for unexpected motion, noise, vibration, smoke or work movement; do not reach inside.",
      ),
      s(
        "Перевірте першу деталь",
        "Inspect the first part",
        "Після зупинки та безпечного доступу очистіть і виміряйте критичні ознаки. Внесіть лише обґрунтовані документовані корекції. Успішна симуляція або один розмір не є прийманням усієї деталі.",
        "After stopping and securing safe access, clean and measure critical features. Make only justified documented corrections. Successful simulation or one correct dimension does not accept the whole part.",
        "Перша деталь пройшла весь план контролю.",
        "The first part passed the complete inspection plan.",
      ),
    ],
    takeaways: [
      t(
        "Навчальний цикл потребує постійного нагляду.",
        "A learning cycle requires continuous supervision.",
      ),
      t(
        "Після змін програми чи встановлення поверніться до відповідного етапу перевірки.",
        "After program or setup changes, repeat the relevant validation stage.",
      ),
    ],
    sources: ["haas-safety", "haas-lathe"],
    quiz: q(
      "Що гарантує режим Single Block?",
      "What does Single Block guarantee?",
      [
        t("Відсутність усіх зіткнень", "Absence of all collisions"),
        t("Безпечність невідомих корекцій", "Safety of unknown offsets"),
        t(
          "Лише передбачену контролером покрокову поведінку; перевірки все одно потрібні",
          "Only the controller-defined stepping behavior; verification is still required",
        ),
      ],
      2,
      "Це допоміжний режим керування, а не доказ безпечності програми.",
      "It is an aid to control, not proof that the program is safe.",
    ),
  },
  {
    id: "material-identification",
    category: "materials",
    title: t(
      "Як обрати й визначити матеріал",
      "Choose and identify the material",
    ),
    summary: t(
      "Марка, стан постачання, сертифікат і SDS важливіші за колір та припущення.",
      "Grade, supply condition, certification and SDS matter more than color or guesswork.",
    ),
    minutes: 9,
    level: "beginner",
    tags: [t("Матеріали", "Materials"), t("Заготовка", "Stock")],
    prerequisites: ["safety-first", "chips-fire"],
    hazards: [
      t(
        "Не визначайте невідомий метал за іскрою, підпалюванням чи агресивною хімією в навчальній майстерні.",
        "Do not identify unknown metal by spark testing, burning or aggressive chemicals in a beginner workshop.",
      ),
      t(
        "Покриття й домішки можуть створювати токсичний пил, навіть якщо основа здається знайомою.",
        "Coatings and alloying elements can produce hazardous dust even when the base metal looks familiar.",
      ),
    ],
    steps: [
      s(
        "Почніть із вимог деталі",
        "Start with the part requirements",
        "Для навчання обирайте невідповідальну деталь із відомої заготовки. Не підміняйте марку матеріалу схожою без оцінки властивостей, корозії, міцності та оброблюваності.",
        "For learning, choose a noncritical part from identified stock. Do not substitute a similar-looking grade without assessing properties, corrosion, strength and machinability.",
      ),
      s(
        "Перевірте походження",
        "Check traceability",
        "Знайдіть етикетку, маркування, накладну або сертифікат постачальника. Перенесіть ідентифікацію на відрізану заготовку, щоб згодом її не переплутати з іншими сплавами.",
        "Find the label, marking, delivery record or supplier certificate. Transfer identification to the cut blank so it cannot later be confused with other alloys.",
      ),
      s(
        "Врахуйте стан матеріалу",
        "Account for material condition",
        "Одна марка може постачатися відпаленою, загартованою або зміцненою. Твердість і напруження впливають на інструмент, деформацію й режим; невідомий стан потребує уточнення.",
        "One grade may be supplied annealed, hardened or strengthened. Hardness and residual stress affect tooling, distortion and conditions; clarify an unknown condition.",
      ),
      s(
        "Прочитайте дані безпеки",
        "Read the safety information",
        "Перегляньте SDS матеріалу, покриття та рідини. Зверніть увагу на пил, контакт зі шкірою, вентиляцію й пожежу; не переносіть правила для масивного металу на його дрібний пил.",
        "Review the material, coating and fluid SDS. Consider dust, skin contact, ventilation and fire; do not transfer bulk-metal assumptions to fine dust.",
      ),
      s(
        "Позначте придатну заготовку",
        "Identify suitable stock",
        "Запишіть марку, стан, розмір і партію в технологічну картку. Якщо походження не встановлене, відкладіть матеріал і візьміть відому навчальну заготовку.",
        "Record grade, condition, dimensions and batch on the process sheet. If identity cannot be established, set the material aside and select known learning stock.",
        "Матеріал і його стан підтверджені документально.",
        "Material identity and condition are documented.",
      ),
    ],
    takeaways: [
      t(
        "Колір і магніт не визначають точну марку.",
        "Color and a magnet do not establish an exact grade.",
      ),
      t(
        "Відомий матеріал дозволяє обґрунтовано вибрати процес.",
        "Identified material enables a reasoned process choice.",
      ),
    ],
    sources: ["sandvik-materials", "osha-dust"],
    quiz: q(
      "Який найнадійніший початок ідентифікації заготовки?",
      "What is the most reliable starting point for stock identification?",
      [
        t("Колір і вага в руці", "Color and weight in your hand"),
        t(
          "Маркування та документація постачальника",
          "Marking and supplier documentation",
        ),
        t("Підпалити маленьку стружку", "Ignite a small chip"),
      ],
      1,
      "Документована ідентифікація значно надійніша за побутові спостереження.",
      "Documented identification is much more reliable than informal observations.",
    ),
  },
  {
    id: "material-machining",
    category: "materials",
    title: t(
      "Алюміній, сталь і пластики в роботі",
      "Machining aluminum, steel and plastics",
    ),
    summary: t(
      "Відмінності стружки, нагріву, пружності й підбору інструмента для відомих матеріалів.",
      "Understand differences in chips, heat, elasticity and tooling for identified materials.",
    ),
    minutes: 11,
    level: "intermediate",
    tags: [t("Оброблюваність", "Machinability"), t("Інструмент", "Tooling")],
    prerequisites: [
      "material-identification",
      "cutting-parameters",
      "tooling-materials",
    ],
    hazards: [
      t(
        "Пластик може плавитися або утворювати небезпечний пил і випари; його точна марка та правила вентиляції мають бути відомі.",
        "Plastic may melt or generate hazardous dust and fumes; its exact grade and ventilation requirements must be known.",
      ),
      t(
        "Мастильні рідини, розчинники та аерозолі добирають за процесом і SDS; не використовуйте легкозаймисті побутові замінники.",
        "Select lubricants, solvents and aerosols under the process and SDS; do not use flammable household substitutes.",
      ),
    ],
    steps: [
      s(
        "Порівняйте поведінку матеріалів",
        "Compare material behavior",
        "Алюмінієві сплави можуть налипати на кромку, сталі мають різну твердість, а пластики — значну температурну й пружну деформацію. Не існує одного режиму «для всього металу».",
        "Aluminum alloys can adhere to the edge, steels vary in hardness, and plastics may show substantial thermal and elastic distortion. There is no single setting for all metal.",
      ),
      s(
        "Доберіть різальну систему",
        "Select the cutting system",
        "Виберіть геометрію, матеріал кромки, канавки й покриття за рекомендаціями для конкретної марки. Кількість зубів і відведення стружки важливі не менше за діаметр.",
        "Choose geometry, cutting material, flutes and coating for the exact grade. Tooth count and chip evacuation matter as much as diameter.",
      ),
      s(
        "Перевірте кріплення",
        "Review workholding",
        "Тонкий алюміній і пластики легко деформуються під затиском; після звільнення розмір може змінитися. Передбачте опору та погоджене зусилля без спроб компенсувати прогин випадковим підтисканням.",
        "Thin aluminum and plastics can distort under clamping and change size when released. Provide support and an approved clamp load instead of compensating with arbitrary tightening.",
      ),
      s(
        "Виконайте контрольну операцію",
        "Make a controlled trial",
        "Під наглядом обробіть відому навчальну заготовку за підтвердженим стартовим режимом. За налипання, плавлення, надмірного нагріву або вібрації зупиніться й перевірте причину.",
        "Under supervision, machine known learning stock using verified starting conditions. Stop for adhesion, melting, excessive heating or chatter and investigate the cause.",
      ),
      s(
        "Виміряйте після стабілізації",
        "Measure after stabilization",
        "Дайте деталі охолонути природно до умов контролю, очистіть і перевірте після звільнення, якщо це потрібно. Результати й фактичний інструмент запишіть для повторення, не узагальнюючи на всі сплави.",
        "Allow the part to stabilize naturally to inspection conditions, clean and check after unclamping if required. Record results and the actual tool for repeatability without generalizing to every alloy.",
        "Режим і результат прив’язані до конкретної марки.",
        "Conditions and results are tied to a specific grade.",
      ),
    ],
    takeaways: [
      t(
        "Схожа назва матеріалу не означає однакову оброблюваність.",
        "Similar material names do not imply identical machinability.",
      ),
      t(
        "Вимірювання затиснутої та вільної деталі можуть відрізнятися.",
        "Measurements of clamped and free parts may differ.",
      ),
    ],
    sources: ["sandvik-materials", "sandvik-turning"],
    quiz: q(
      "Чому пластикова деталь може змінити розмір після зняття?",
      "Why might a plastic part change size after unclamping?",
      [
        t(
          "Через пружну й температурну деформацію",
          "Because of elastic and thermal distortion",
        ),
        t(
          "Тому що штангенциркуль завжди показує точно",
          "Because calipers are always exact",
        ),
        t(
          "Матеріал ніколи не впливає на результат",
          "Material never affects the result",
        ),
      ],
      0,
      "Затиск і нагрів можуть тимчасово змінювати геометрію.",
      "Clamping and heat can temporarily change the geometry.",
    ),
  },
  {
    id: "cutting-parameters",
    category: "materials",
    title: t(
      "Оберти, подача та глибина різання",
      "Speed, feed and depth of cut",
    ),
    summary: t(
      "Розуміємо параметри, формули й обмеження без небезпечних універсальних таблиць.",
      "Understand parameters, formulas and limits without unsafe universal setting tables.",
    ),
    minutes: 13,
    level: "beginner",
    tags: [t("Режими різання", "Cutting data"), t("Потужність", "Power")],
    prerequisites: [
      "safety-first",
      "workholding-basics",
      "tooling-requirements",
    ],
    hazards: [
      t(
        "Розраховані оберти не є дозволом на запуск. Межі верстата, патрона, кулачків, інструмента й кріплення мають пріоритет.",
        "Calculated speed is not permission to run. Machine, chuck, jaw, tool and workholding limits take priority.",
      ),
      t(
        "Зменшення подачі до майже нуля не завжди безпечніше: тертя, нагрів і наклеп можуть погіршити процес.",
        "Reducing feed almost to zero is not always safer: rubbing, heat and work hardening can worsen the process.",
      ),
    ],
    steps: [
      s(
        "Зберіть вхідні дані",
        "Collect the inputs",
        "Потрібні точна марка й стан матеріалу, інструмент, діаметр різання, тип операції, виліт і жорсткість. Початкові дані беріть із документації виробника інструмента для цього застосування.",
        "You need exact material grade and condition, tool, cutting diameter, operation, overhang and rigidity. Obtain starting data from the tool manufacturer for this application.",
      ),
      s(
        "Розрізняйте швидкість та оберти",
        "Separate cutting speed and rpm",
        "Для метричних одиниць n = 1000 × vc / (π × D), де vc — м/хв, D — мм, n — об/хв. Для точіння D стосується деталі, для фрезерування — ефективного діаметра різання фрези.",
        "For metric units, n = 1000 × vc / (π × D), with vc in m/min, D in mm and n in rev/min. In turning D refers to the work; in milling it is the cutter’s effective cutting diameter.",
      ),
      s(
        "Перевірте вид подачі",
        "Identify the feed definition",
        "Для фрезерування vf = fz × zc × n: подача на зуб, ефективна кількість зубів і оберти дають мм/хв. Для точіння подача часто задається в мм/об; не змішуйте ці одиниці.",
        "For milling, vf = fz × zc × n: feed per tooth, effective tooth count and speed give mm/min. Turning feed is often in mm/rev; do not confuse these units.",
      ),
      s(
        "Узгодьте знімання та можливості",
        "Match engagement to capacity",
        "Осьову глибину й бокове охоплення оцінюйте разом із подачею, крутним моментом, потужністю та жорсткістю. Паспортна потужність сама по собі не підтверджує придатності на конкретних обертах.",
        "Assess axial depth and radial engagement together with feed, torque, power and rigidity. Nameplate power alone does not establish capacity at a particular speed.",
      ),
      s(
        "Підтвердьте режим із наставником",
        "Confirm the conditions with a supervisor",
        "Перевірте всі граничні значення, напрямок обертання та відведення стружки. Запишіть погоджений режим і умови зупинки. Коригуйте один зрозумілий фактор за раз після аналізу результату.",
        "Check all limits, rotation direction and chip evacuation. Record approved conditions and stop triggers. After analyzing results, change one understood factor at a time.",
        "Одиниці, джерело даних і всі обмеження перевірені.",
        "Units, data source and all limits are checked.",
      ),
    ],
    takeaways: [
      t(
        "Формула пов’язує параметри, але не обирає безпечний процес.",
        "A formula relates parameters but does not choose a safe process.",
      ),
      t(
        "Оберти, подача й знімання працюють як пов’язана система.",
        "Speed, feed and engagement operate as a linked system.",
      ),
    ],
    sources: ["sandvik-milling", "sandvik-turning"],
    quiz: q(
      "Що робити, якщо розраховані оберти перевищують межу патрона?",
      "What if calculated rpm exceeds the chuck rating?",
      [
        t(
          "Використати розрахунок як дозвіл",
          "Treat the calculation as authorization",
        ),
        t(
          "Перепланувати режим у межах усього встановлення з наставником",
          "Replan the conditions within the complete setup limits with a supervisor",
        ),
        t("Прибрати захисний кожух", "Remove the guard"),
      ],
      1,
      "Допустимі межі обладнання та оснащення мають пріоритет над розрахунком.",
      "Equipment and tooling limits take priority over a calculation.",
    ),
  },
  {
    id: "caliper",
    category: "measurement",
    title: t(
      "Штангенциркуль без зайвих похибок",
      "Use calipers with fewer errors",
    ),
    summary: t(
      "Зовнішні, внутрішні, глибинні та ступінчасті вимірювання з повторною перевіркою.",
      "Make external, internal, depth and step measurements with repeatability checks.",
    ),
    minutes: 10,
    level: "beginner",
    tags: [t("Штангенциркуль", "Caliper"), t("Вимірювання", "Measurement")],
    prerequisites: ["safety-first", "entanglement"],
    hazards: [
      t(
        "Ніколи не вимірюйте рухому деталь. Задирки можуть травмувати й давати хибний розмір.",
        "Never measure moving work. Burrs can injure you and give false readings.",
      ),
    ],
    steps: [
      s(
        "Оберіть придатний прилад",
        "Choose a suitable instrument",
        "Перевірте діапазон, заявлену похибку та стан калібрування. Ціна поділки або останній знак дисплея не дорівнюють точності. Для вузького допуску може знадобитися інший засіб.",
        "Check range, specified error and calibration status. Scale resolution or the last display digit is not measurement accuracy. A narrow tolerance may require another instrument.",
      ),
      s(
        "Очистіть і перевірте нуль",
        "Clean and check zero",
        "Очистіть губки та поверхні, перевірте плавний хід і нуль без надмірного натиску. За можливості перевірте відомий еталон у робочій частині діапазону; несправний прилад не підлаштовуйте під очікуваний результат.",
        "Clean the jaws and work surfaces; check smooth travel and zero without excessive pressure. If possible, verify a known reference near the working range; do not adjust a faulty instrument to match your expectation.",
      ),
      s(
        "Виконайте зовнішнє вимірювання",
        "Make an external measurement",
        "Поставте губки перпендикулярно вимірюваній відстані й застосуйте легке повторюване зусилля. Не міряйте лише кінчиками без потреби; перекіс і прогин губок змінюють показ.",
        "Align jaws with the measured distance and apply light repeatable force. Avoid unnecessary tip-only contact; misalignment and jaw deflection alter the reading.",
      ),
      s(
        "Змініть метод для внутрішніх розмірів",
        "Use the appropriate internal or depth method",
        "Внутрішніми губками шукайте правильне діаметральне положення без перекосу. Глибиномір спирайте повною опорною поверхнею на чисту базу. Для малих отворів враховуйте обмеження геометрії губок.",
        "With internal jaws, locate the proper diametral position without tilt. Seat the depth-measuring reference fully on a clean datum. Account for jaw-geometry limits in small holes.",
      ),
      s(
        "Повторіть і запишіть",
        "Repeat and record",
        "Зніміть і встановіть прилад кілька разів, перевірте інші місця та орієнтації. Запишіть одиниці, точки вимірювання та розкид. Значний розкид означає, що метод або форма потребують перевірки.",
        "Remove and reapply the instrument several times and check other locations and orientations. Record units, measuring points and spread. A large spread calls for checking method or form.",
        "Нуль перевірено; повторні покази узгоджуються.",
        "Zero is checked and repeated readings agree.",
      ),
    ],
    takeaways: [
      t(
        "Цифровий дисплей не усуває перекосу й помилок зусилля.",
        "A digital display does not remove alignment and force errors.",
      ),
      t(
        "Внутрішні губки не замінюють спеціальний контроль точних отворів.",
        "Internal jaws do not replace specialized inspection of precision bores.",
      ),
    ],
    sources: ["mitutoyo-caliper", "mitutoyo-guide"],
    quiz: q(
      "Чи означає роздільність 0,01 мм точність ±0,01 мм?",
      "Does 0.01 mm resolution imply ±0.01 mm accuracy?",
      [
        t("Так, завжди", "Yes, always"),
        t(
          "Ні, потрібно врахувати специфікацію, калібрування та метод",
          "No, consider specification, calibration and method",
        ),
        t("Так, якщо батарейка нова", "Yes, with a new battery"),
      ],
      1,
      "Роздільність — лише крок відображення, а не повна похибка вимірювання.",
      "Resolution is only the display increment, not the complete measurement error.",
    ),
  },
  {
    id: "micrometer",
    category: "measurement",
    title: t(
      "Мікрометр і контроль діаметра",
      "Micrometers and diameter inspection",
    ),
    summary: t(
      "Стале вимірювальне зусилля, температура та пошук конусності й овальності.",
      "Use consistent measuring force and check temperature, taper and ovality.",
    ),
    minutes: 11,
    level: "intermediate",
    tags: [t("Мікрометр", "Micrometer"), t("Діаметр", "Diameter")],
    prerequisites: ["caliper"],
    model: "shaft",
    hazards: [
      t(
        "Не використовуйте мікрометр як затискач і не прикладайте його до гарячої або рухомої деталі.",
        "Do not use a micrometer as a clamp or apply it to hot or moving work.",
      ),
    ],
    steps: [
      s(
        "Перевірте діапазон і еталон",
        "Check range and reference",
        "Виберіть мікрометр, що охоплює потрібний розмір. Очистіть вимірювальні поверхні й перевірте нуль або установочний еталон за паспортом. Не прирівнюйте перевірку нуля до повного калібрування.",
        "Choose a micrometer covering the required size. Clean measuring faces and check zero or the setting reference under the manual. A zero check is not a full calibration.",
      ),
      s(
        "Стабілізуйте температуру",
        "Stabilize temperature",
        "Дайте деталі й приладу вирівняти температуру до умов контролю. Не тримайте рамку довго теплою рукою й не охолоджуйте деталь випадковими рідинами заради швидкого вимірювання.",
        "Allow the work and instrument to reach inspection conditions. Avoid warming the frame with prolonged handling or using arbitrary liquids to cool work for a quick reading.",
      ),
      s(
        "Встановіть правильний контакт",
        "Establish proper contact",
        "Розташуйте вісь вимірювання через діаметр, без перекосу. Підводьте шпиндель плавно, а кінцеве зусилля створюйте штатним тріскачковим або фрикційним механізмом за інструкцією.",
        "Align the measuring axis across the diameter without tilt. Advance smoothly and use the specified ratchet or friction device for final measuring force.",
      ),
      s(
        "Перевірте форму в кількох перерізах",
        "Check form at several sections",
        "Виміряйте біля обох кінців і посередині, повторюючи у взаємно повернутих напрямках. Це допомагає виявити конусність і овальність, хоча не замінює спеціального контролю круглості.",
        "Measure near both ends and at the middle, repeating in different angular directions. This helps reveal taper and ovality but does not replace specialized roundness inspection.",
      ),
      s(
        "Зафіксуйте межі та результат",
        "Record limits and results",
        "Порівняйте кожну точку з допустимими межами. Запишіть прилад і умови; значення біля межі потребує оцінки невизначеності, а не округлення до бажаного числа.",
        "Compare each location with the tolerance limits. Record instrument and conditions; a value near a limit requires uncertainty assessment rather than rounding to a preferred number.",
        "Перевірено кілька перерізів і напрямків.",
        "Several sections and angular directions have been checked.",
      ),
    ],
    takeaways: [
      t(
        "Стале зусилля й температура — частина вимірювального методу.",
        "Consistent force and temperature are part of the measurement method.",
      ),
      t(
        "Один правильний діаметр не підтверджує всю циліндричну поверхню.",
        "One correct diameter does not validate the whole cylindrical surface.",
      ),
    ],
    sources: ["mitutoyo-micro"],
    quiz: q(
      "Навіщо міряти вал у різних перерізах і напрямках?",
      "Why measure a shaft at different sections and angles?",
      [
        t(
          "Щоб знайти конусність і можливу овальність",
          "To reveal taper and possible ovality",
        ),
        t("Щоб обрати найкрасивіше число", "To select the nicest number"),
        t("Щоб не перевіряти нуль", "To avoid checking zero"),
      ],
      0,
      "Зміни вздовж осі та по колу характеризують різні відхилення форми.",
      "Changes along the axis and around the circumference indicate different form deviations.",
    ),
  },
  {
    id: "dial-indicator",
    category: "measurement",
    title: t(
      "Індикатор: биття та вирівнювання",
      "Indicators: runout and alignment",
    ),
    summary: t(
      "Жорстке встановлення, напрямок контакту та порівняльні вимірювання.",
      "Build a rigid setup, align contact and make comparative measurements.",
    ),
    minutes: 11,
    level: "intermediate",
    tags: [t("Індикатор", "Indicator"), t("Биття", "Runout")],
    prerequisites: ["caliper", "energy-isolation"],
    hazards: [
      t(
        "Не запускайте шпиндель з індикатором, стійкою або ключем у зоні обертання. Ручне провертання дозволене лише за процедурою ізольованого верстата.",
        "Do not start the spindle with an indicator, stand or key in the rotating envelope. Manual rotation is allowed only under the isolated-machine procedure.",
      ),
    ],
    steps: [
      s(
        "Визначте тип приладу",
        "Identify the indicator type",
        "Плунжерний і важільний індикатори мають різні напрямки чутливості. Перевірте діапазон, ціну поділки, справність контакту та вимоги до положення щупа.",
        "Plunger and lever-type test indicators have different sensitive directions. Check range, resolution, contact condition and stylus-orientation requirements.",
      ),
      s(
        "Створіть жорстку стійку",
        "Create a rigid mounting",
        "Закріпіть основу на чистій придатній поверхні й мінімізуйте довжину плеча. М’яка або рухома опора додає власний прогин до результату; магнітна основа не працює належно на будь-якому матеріалі.",
        "Mount the base on a clean suitable surface and keep arms short. A flexible or moving support adds its own deflection; a magnetic base is not effective on every material.",
      ),
      s(
        "Узгодьте напрямок вимірювання",
        "Align the measuring direction",
        "Розташуйте плунжер уздовж вимірюваного переміщення. Для важільного індикатора задайте положення щупа за його паспортом; надмірний кут спричиняє косинусну похибку.",
        "Align a plunger with the measured displacement. For a test indicator, set stylus orientation under its manual; excessive angular misalignment causes cosine error.",
      ),
      s(
        "Задайте контакт і зніміть покази",
        "Set contact and take readings",
        "Введіть невеликий попередній натяг у дозволеному діапазоні й оберіть початковий відлік. Переміщуйте поверхню лише дозволеним контрольованим способом, не допускаючи ударів та перевищення ходу.",
        "Apply a small preload within the permitted range and choose a reference reading. Move the surface only by the approved controlled method, avoiding impact and travel overrun.",
      ),
      s(
        "Перевірте повторюваність",
        "Check repeatability",
        "Поверніться в початкову точку й повторіть вимірювання. Запишіть максимум, мінімум і розмах. Якщо нуль не повертається, перевірте кріплення, контакт і чистоту до корекції деталі.",
        "Return to the starting point and repeat. Record maximum, minimum and total range. If the reference does not return, check mounting, contact and cleanliness before adjusting the part.",
        "Повернення до початку дає повторюваний показ.",
        "Returning to the start gives a repeatable reading.",
      ),
    ],
    takeaways: [
      t(
        "Індикатор показує зміну відносно встановленої бази, а не автоматично абсолютний розмір.",
        "An indicator shows change relative to a setup reference, not automatically an absolute size.",
      ),
      t(
        "Нестійка стійка може виглядати як дефект деталі.",
        "An unstable stand can masquerade as a part defect.",
      ),
    ],
    sources: ["mitutoyo-indicator", "mitutoyo-small"],
    quiz: q(
      "Що перевірити, якщо індикатор не повертається до початкового показу?",
      "What should you check if the indicator fails to return to the initial reading?",
      [
        t("Спочатку підрізати деталь", "Machine the part first"),
        t(
          "Кріплення, контакт, чистоту та хід приладу",
          "Mounting, contact, cleanliness and instrument movement",
        ),
        t("Збільшити оберти", "Increase spindle speed"),
      ],
      1,
      "Спочатку потрібно виключити помилку вимірювального встановлення.",
      "First eliminate errors in the measuring setup.",
    ),
  },
  {
    id: "inspection-plan",
    category: "measurement",
    title: t("План контролю готової деталі", "Create a part inspection plan"),
    summary: t(
      "Для кожної вимоги визначаємо базу, прилад, точки вимірювання та рішення.",
      "Assign a datum, instrument, measuring locations and acceptance decision to each requirement.",
    ),
    minutes: 12,
    level: "intermediate",
    tags: [t("Контроль", "Inspection"), t("Допуски", "Tolerances")],
    prerequisites: ["technical-drawing", "caliper", "micrometer"],
    hazards: [
      t(
        "Не перевіряйте посадку запуском механізму або силовим запресовуванням невідомої деталі. Геометрична схожість не доводить придатності.",
        "Do not test fit by running a mechanism or forcibly pressing an unknown part. Geometric similarity does not establish suitability.",
      ),
    ],
    steps: [
      s(
        "Перетворіть креслення на список",
        "Turn the drawing into a checklist",
        "Випишіть усі розміри, форму, положення, матеріал, фаски та вимоги поверхні. Призначте кожній ознаці номер і допустимі межі; не обмежуйтеся зручними зовнішніми розмірами.",
        "List all dimensions, form, location, material, chamfers and surface requirements. Number each characteristic and its limits; do not inspect only convenient external dimensions.",
      ),
      s(
        "Доберіть засоби й бази",
        "Select instruments and datums",
        "Для кожної ознаки визначте прилад із придатною похибкою, доступом і діапазоном. Вимірювальна база має відповідати кресленню. Критичну геометрію за потреби передайте на спеціалізований контроль.",
        "For each characteristic, choose an instrument with suitable error, access and range. Measurement datums must follow the drawing. Send demanding geometry for specialized inspection when needed.",
      ),
      s(
        "Перевіряйте в правильний момент",
        "Inspect at the right stage",
        "Деякі ознаки стануть недоступними після наступної операції. Додайте проміжні перевірки перед перевстановленням, відрізанням чи складанням, а остаточний контроль виконуйте на чистій стабілізованій деталі.",
        "Some features become inaccessible after later operations. Add intermediate checks before remounting, cutting off or assembly, and perform final inspection on clean stabilized work.",
      ),
      s(
        "Запишіть фактичні дані",
        "Record actual data",
        "Фіксуйте числа й точки, а не лише позначку «добре». За великого розкиду повторіть метод незалежно. Не приймайте результат біля межі без належного врахування невизначеності.",
        "Record actual readings and locations, not only a pass mark. If readings vary, repeat independently. Do not accept a near-limit result without considering measurement uncertainty.",
      ),
      s(
        "Прийміть обґрунтоване рішення",
        "Make a justified decision",
        "Порівняйте повний набір даних із вимогами, позначте відхилення та збережіть ревізію документа. Не виправляйте запис під бажаний результат. Для навчальної деталі окремо запишіть, чого навчилися.",
        "Compare the complete dataset with requirements, identify deviations and retain document revision. Never alter a record to fit the desired result. For a practice part, also record what you learned.",
        "Усі вимоги мають результат або явно зазначене обмеження контролю.",
        "Every requirement has a result or an explicitly stated inspection limitation.",
      ),
    ],
    takeaways: [
      t(
        "Приймання стосується всіх вимог, а не одного успішного вимірювання.",
        "Acceptance concerns all requirements, not one successful measurement.",
      ),
      t(
        "Невиміряна ознака залишається непідтвердженою.",
        "An unmeasured characteristic remains unverified.",
      ),
    ],
    sources: ["mitutoyo-guide", "mitutoyo-small"],
    quiz: q(
      "Що робити з вимогою, яку наявним приладом перевірити неможливо?",
      "What should you do with a requirement your available instrument cannot verify?",
      [
        t(
          "Вважати виконаною за зовнішнім виглядом",
          "Assume it passes from appearance",
        ),
        t(
          "Позначити обмеження й залучити відповідний засіб контролю",
          "Record the limitation and obtain suitable inspection",
        ),
        t("Викреслити з креслення", "Delete it from the drawing"),
      ],
      1,
      "Відсутність вимірювання не є доказом відповідності.",
      "Absence of a measurement is not evidence of conformity.",
    ),
  },
  {
    id: "reverse-survey",
    category: "reverse",
    title: t("Знімаємо розміри з існуючої деталі", "Survey an existing part"),
    summary: t(
      "Документуємо функцію, бази, знос і невідомі параметри перед моделюванням.",
      "Document function, datums, wear and unknown properties before modeling.",
    ),
    minutes: 14,
    level: "intermediate",
    tags: [t("Реверс-інжиніринг", "Reverse engineering"), t("Обмір", "Survey")],
    prerequisites: ["inspection-plan", "material-identification"],
    model: "flange",
    hazards: [
      t(
        "Для навчання обирайте лише невідповідальні деталі: ручки, проставки, макети. Деталі гальм, підйому, тиску, високих обертів та інші відповідальні вузли потребують інженерного проєкту й кваліфікованої перевірки.",
        "Learn on noncritical items such as knobs, spacers and mockups. Braking, lifting, pressure, high-speed and other safety-critical parts require engineering design and qualified validation.",
      ),
      t(
        "Не розбирайте підключений або навантажений механізм; спочатку належно ізолюйте всі джерела енергії.",
        "Never dismantle an energized or loaded mechanism; first isolate all energy sources properly.",
      ),
    ],
    steps: [
      s(
        "Визначте функцію та межі відтворення",
        "Define function and reproduction limits",
        "Запишіть, що деталь з’єднує, рухає або обмежує, і що буде при її відмові. Якщо наслідок небезпечний або функція неясна, обмежтеся навчальним макетом і зверніться до інженера.",
        "Record what the part connects, moves or locates and what failure would cause. If failure is hazardous or function unclear, restrict the work to a learning mockup and consult an engineer.",
      ),
      s(
        "Збережіть вихідний стан",
        "Capture the original condition",
        "До очищення сфотографуйте всі сторони з масштабом і позначте орієнтацію. Запишіть маркування, сліди зносу й місця контакту, не пошкоджуючи поверхні.",
        "Photograph every side with a scale and record orientation before cleaning. Note markings, wear and contact areas without damaging surfaces.",
      ),
      s(
        "Призначте бази обміру",
        "Establish survey datums",
        "Виберіть незношену опорну площину, вісь або отвір. Розділіть зовнішню форму й функціональні інтерфейси. Усі координати пов’язуйте з однією зрозумілою системою.",
        "Choose an unworn locating face, axis or bore. Separate cosmetic shape from functional interfaces. Relate all coordinates to one clear system.",
      ),
      s(
        "Зніміть повторні вимірювання",
        "Take repeated measurements",
        "Виміряйте габарити, отвори, міжосьові відстані, глибини й радіуси придатними приладами. Для діаметра зробіть кілька перерізів. Різьбу визначайте за профілем, кроком і стандартом, а не лише зовнішнім Ø.",
        "Measure envelope, holes, center distances, depths and radii with suitable instruments. Check diameters at several sections. Identify a thread by profile, pitch and standard, not outer diameter alone.",
      ),
      s(
        "Відокремте факт від припущення",
        "Separate observations from assumptions",
        "Позначте виміряні значення, імовірні номінали та невідомі параметри різними записами. Знос не копіюйте автоматично в нову деталь. Матеріал і термообробку не можна встановити лише геометрією.",
        "Record measured values, inferred nominals and unknown properties separately. Do not automatically copy wear into the new part. Geometry alone cannot establish material or heat treatment.",
        "Є карта обміру з базами, розкидом і невідомими параметрами.",
        "A survey sheet lists datums, variation and unknown properties.",
      ),
    ],
    takeaways: [
      t(
        "Відтворюють функціональний задум, а не випадкові пошкодження.",
        "Reproduce functional intent, not accidental damage.",
      ),
      t(
        "Розмір оригіналу не є автоматично його початковим номіналом.",
        "An original’s measured size is not automatically its intended nominal.",
      ),
    ],
    sources: ["mitutoyo-guide", "mitutoyo-caliper"],
    quiz: q(
      "Зношена шийка має Ø19,86 мм. Чи це достатня підстава задати новій Ø19,86?",
      "A worn journal measures Ø19.86 mm. Is that enough to specify the replacement at Ø19.86?",
      [
        t(
          "Так, копія завжди має повторювати вимір",
          "Yes, a copy must always match the reading",
        ),
        t(
          "Ні, потрібно відновити функцію, номінал і посадку",
          "No, establish function, intended nominal and fit",
        ),
        t("Так, якщо замір повторився", "Yes, if the measurement repeats"),
      ],
      1,
      "Повторюваність вимірювання не відділяє початкову геометрію від зносу.",
      "Measurement repeatability cannot separate original geometry from wear.",
    ),
  },
  {
    id: "reverse-cad",
    category: "reverse",
    title: t(
      "Від обміру до параметричної CAD-моделі",
      "From survey to parametric CAD",
    ),
    summary: t(
      "Будуємо модель із баз, перевірених розмірів і явних припущень; оцінюємо 3D-сканування.",
      "Build from datums, verified dimensions and explicit assumptions; assess when 3D scanning helps.",
    ),
    minutes: 16,
    level: "advanced",
    tags: [t("CAD", "CAD"), t("3D-сканування", "3D scanning")],
    prerequisites: ["reverse-survey", "technical-drawing"],
    model: "flange",
    hazards: [
      t(
        "Скан поверхні не показує матеріалу, внутрішніх дефектів, термообробки й прихованих каналів. Красивий меш не є готовою виробничою моделлю.",
        "A surface scan does not reveal material, internal defects, heat treatment or hidden passages. An attractive mesh is not a finished manufacturing model.",
      ),
    ],
    steps: [
      s(
        "Побудуйте систему баз",
        "Build the datum system",
        "Створіть площини та осі, що відповідають карті обміру. Зафіксуйте одиниці й орієнтацію. Залежності ескізу мають відображати функцію, а не випадкове розташування на екрані.",
        "Create planes and axes matching the survey sheet. Fix units and orientation. Sketch constraints should reflect function rather than incidental screen placement.",
      ),
      s(
        "Моделюйте основну форму",
        "Model the primary shape",
        "Почніть з обертання для осесиметричної деталі або витягування для призматичної. Додавайте уступи, отвори й кишені як окремі ознаки з осмисленими назвами та параметрами.",
        "Start with a revolve for an axisymmetric part or an extrusion for a prismatic one. Add shoulders, holes and pockets as separate features with meaningful names and parameters.",
      ),
      s(
        "Не підганяйте все під одну похибку",
        "Avoid fitting everything to one error",
        "Перевіряйте суперечливі розміри повторним вимірюванням. Симетрію, стандартний крок чи номінал вводьте лише як позначене інженерне припущення, яке ще потребує підтвердження.",
        "Resolve conflicting dimensions through remeasurement. Introduce symmetry, a standard pitch or nominal only as a documented engineering assumption requiring confirmation.",
      ),
      s(
        "Використовуйте сканування вибірково",
        "Use scanning selectively",
        "3D-скан зручний для складної вільної форми, але потребує масштабу, контрольних розмірів і оцінки похибки. Посадкові отвори й бази підтверджуйте контактними вимірюваннями або придатною метрологією.",
        "A 3D scan can help with complex freeform shapes but needs scale, reference dimensions and error assessment. Verify fits and datums by contact measurements or suitable metrology.",
      ),
      s(
        "Створіть креслення й перевірте технологічність",
        "Create the drawing and review manufacturability",
        "Винесіть функціональні розміри, допустимі межі та невідомі характеристики в документ. Перевірте доступ інструмента, внутрішні радіуси й можливість затиску. Збережіть ревізію та таблицю припущень.",
        "Document functional dimensions, limits and unknown characteristics. Check tool access, internal radii and workholding feasibility. Save the revision and assumptions table.",
        "Критичні розміри перевірені; припущення позначені.",
        "Critical dimensions are verified and assumptions marked.",
      ),
    ],
    takeaways: [
      t(
        "Параметрична модель має залишатися зрозумілою після зміни розмірів.",
        "A parametric model should remain understandable when dimensions change.",
      ),
      t(
        "Збіг зі сканом не доводить функціональної придатності.",
        "Agreement with a scan does not prove functional suitability.",
      ),
    ],
    sources: ["mitutoyo-guide", "haas-setup"],
    quiz: q(
      "Що 3D-скан не може самостійно підтвердити?",
      "What can a 3D scan not establish by itself?",
      [
        t(
          "Видиму зовнішню форму в межах похибки",
          "Visible external shape within its uncertainty",
        ),
        t(
          "Марку матеріалу, термообробку та внутрішню цілісність",
          "Material grade, heat treatment and internal integrity",
        ),
        t(
          "Наявність великого зовнішнього виступу",
          "The presence of a large external protrusion",
        ),
      ],
      1,
      "Оптичний знімок поверхні не вимірює внутрішні та матеріальні властивості.",
      "An optical surface capture does not measure internal or material properties.",
    ),
  },
  {
    id: "reverse-validation",
    category: "reverse",
    title: t(
      "Відтворення, примірка та перевірка",
      "Reproduction, trial fit and validation",
    ),
    summary: t(
      "Плануємо навчальну копію, перевіряємо інтерфейси й фіксуємо межі придатності.",
      "Plan a practice reproduction, inspect interfaces and document the limits of suitability.",
    ),
    minutes: 15,
    level: "advanced",
    tags: [
      t("Реверс-інжиніринг", "Reverse engineering"),
      t("Перевірка", "Validation"),
    ],
    prerequisites: [
      "reverse-cad",
      "cnc-prove-out",
      "inspection-plan",
      "geometry-verification",
    ],
    model: "bracket",
    hazards: [
      t(
        "Не встановлюйте навчальну копію у відповідальний механізм. Безпечність вимагає підтвердження конструкції, матеріалу, процесу та випробувань компетентним фахівцем.",
        "Do not install a learning reproduction in a safety-critical mechanism. Safety requires qualified verification of design, material, process and testing.",
      ),
      t(
        "Не використовуйте обертання або навантаження як першу перевірку посадки.",
        "Do not use powered motion or loading as the first fit check.",
      ),
    ],
    steps: [
      s(
        "Визначте критерії до виготовлення",
        "Define acceptance before manufacture",
        "Для невідповідального прототипу запишіть габарити, посадкові поверхні й дозволену функцію. Вкажіть, що не підтверджується: ресурс, міцність, температура або інші невідомі властивості.",
        "For a noncritical prototype, record envelope, mating surfaces and permitted function. State what remains unverified: life, strength, temperature capability or other unknown properties.",
      ),
      s(
        "Оберіть матеріал і маршрут",
        "Choose material and process",
        "Підтвердіть матеріал, спосіб затиску, послідовність баз і контроль. Для перевірки лише геометрії можна спершу зробити явно позначений макет, який не використовуватиметься під навантаженням.",
        "Confirm material, workholding, datum sequence and inspection. For a geometry-only check, first make a clearly marked mockup that will not be used under load.",
      ),
      s(
        "Виготовте за перевіреною технологією",
        "Manufacture using a verified process",
        "Виконайте відповідні інструкції з ручної або ЧПУ-обробки під наглядом. Після кожного встановлення перевіряйте доступні критичні розміри, перш ніж втратите базу чи доступ.",
        "Follow the relevant manual or CNC machining instructions under supervision. After each setup, inspect accessible critical dimensions before losing the datum or access.",
      ),
      s(
        "Проведіть нерухому примірку",
        "Perform a stationary fit check",
        "Лише в ізольованому, розвантаженому й безпечному вузлі перевірте геометричну сумісність без примусу. Якщо є заклинювання, перекіс або невідповідність, зупиніться й поверніться до обміру.",
        "Only in an isolated, unloaded and secured assembly, check geometric compatibility without force. Stop for binding, tilt or mismatch and return to the survey.",
      ),
      s(
        "Зафіксуйте висновок і наступну ревізію",
        "Record conclusions and the next revision",
        "Збережіть виміри, фото, матеріал, ревізію CAD та перелік обмежень. Для невдалої примірки змінюйте обґрунтований параметр, а не підпилюйте випадково. Прототип залишається прототипом до належної перевірки.",
        "Retain measurements, photos, material, CAD revision and limitations. For a failed fit, change a justified parameter rather than filing at random. A prototype remains a prototype until appropriately validated.",
        "Результат і межі застосування задокументовані.",
        "The result and application limits are documented.",
      ),
    ],
    takeaways: [
      t(
        "Геометрична сумісність — лише частина перевірки відтвореної деталі.",
        "Geometric compatibility is only one part of validating a reproduction.",
      ),
      t(
        "Кожна ітерація повинна мати зрозумілу причину та ревізію.",
        "Every iteration should have a clear reason and revision.",
      ),
    ],
    sources: ["mitutoyo-small", "ccohs-general"],
    quiz: q(
      "Копія входить у вузол. Чи підтверджує це її міцність і ресурс?",
      "A reproduction fits the assembly. Does that establish strength and service life?",
      [
        t("Так, посадка підтверджує все", "Yes, fit proves everything"),
        t(
          "Ні, потрібні окремі інженерні перевірки",
          "No, separate engineering validation is needed",
        ),
        t(
          "Так, якщо вона важча за оригінал",
          "Yes, if it is heavier than the original",
        ),
      ],
      1,
      "Правильна форма не підтверджує матеріал, структуру, напруження або довговічність.",
      "Correct shape does not establish material, structure, stresses or durability.",
    ),
  },
];
