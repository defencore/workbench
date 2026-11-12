import { useEffect, useId, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Info,
  TriangleAlert,
} from "lucide-react";
import type { Lang, Text } from "../data/types";
import "./ToolSelector.css";

type Operation = "turning" | "milling" | "drilling" | "threading";
type Material = "aluminum" | "steel" | "stainless" | "cast-iron" | "plastic";
type Rigidity = "light" | "rigid";
type Feature = "rough" | "finish";
type Hole = "through" | "blind";
interface Advice {
  family: Text;
  geometry: Text;
  coating: Text;
  watch: Text;
  sources: string[];
}
const T = (uk: string, en: string): Text => ({ uk, en });
const operationNames: Record<Operation, Text> = {
  turning: T("Точіння", "Turning"),
  milling: T("Фрезерування", "Milling"),
  drilling: T("Свердління", "Drilling"),
  threading: T("Внутрішня різьба мітчиком", "Internal thread tapping"),
};
const materialNames: Record<Material, Text> = {
  aluminum: T("Відомий алюмінієвий сплав", "Identified aluminum alloy"),
  steel: T(
    "Відома незагартована м’яка сталь",
    "Identified unhardened mild steel",
  ),
  stainless: T(
    "Відома марка нержавіючої сталі",
    "Identified stainless steel grade",
  ),
  "cast-iron": T("Відомий тип чавуну", "Identified cast iron type"),
  plastic: T(
    "Відомий ненаповнений технічний пластик",
    "Identified unfilled engineering plastic",
  ),
};
const sources: Record<string, { name: Text; url: string }> = {
  inserts: {
    name: T(
      "Sandvik: вибір токарної пластини",
      "Sandvik: selecting a turning insert",
    ),
    url: "https://www.sandvik.coromant.com/en-us/knowledge/general-turning/how-to-choose-correct-turning-insert",
  },
  materials: {
    name: T(
      "Sandvik: групи оброблюваних матеріалів",
      "Sandvik: workpiece material groups",
    ),
    url: "https://www.sandvik.coromant.com/en-us/knowledge/materials/workpiece-materials",
  },
  nonferrous: {
    name: T(
      "Sandvik: пластини для кольорових металів",
      "Sandvik: non-ferrous turning grades",
    ),
    url: "https://www.sandvik.coromant.com/en-gb/turning-inserts-grades-non-ferrous-materia",
  },
  hss: {
    name: T(
      "Sherline: HSS та змінні пластини",
      "Sherline: HSS and carbide insert tools",
    ),
    url: "https://www.sherline.com/product/7605/",
  },
  milling: {
    name: T(
      "Sandvik: фрезерування різних матеріалів",
      "Sandvik: milling different materials",
    ),
    url: "https://www.sandvik.coromant.com/en-us/knowledge/milling/milling-different-materials",
  },
  aluminum: {
    name: T("Harvey: фрези для алюмінію", "Harvey: aluminum milling tools"),
    url: "https://www.harveyperformance.com/in-the-loupe/aluminum-machining-guide/",
  },
  plastic: {
    name: T(
      "Harvey: вибір фрези для пластику",
      "Harvey: selecting a plastic cutting end mill",
    ),
    url: "https://www.harveyperformance.com/in-the-loupe/choosing-right-plastic-cutting-end-mill/",
  },
  drills: {
    name: T(
      "Dormer Pramet: свердла HSS та HSS-E",
      "Dormer Pramet: HSS and HSS-E drills",
    ),
    url: "https://www.dormerpramet.com/exp/en/HSS-tools/",
  },
  holemaking: {
    name: T(
      "Dormer Pramet: сімейства свердлильних інструментів",
      "Dormer Pramet: holemaking tool families",
    ),
    url: "https://www.dormerpramet.com/holemaking-offer/",
  },
  drillmaterials: {
    name: T(
      "Sandvik: свердління різних матеріалів (PDF)",
      "Sandvik: drilling different materials (PDF)",
    ),
    url: "https://go.sandvik.coromant.com/rs/804-BTR-348/images/202001-NUR-SRT-C1_Listicle_Drilling_en-GB.pdf",
  },
  tap: {
    name: T(
      "LittleMachineShop: типи мітчиків і напрям стружки",
      "LittleMachineShop: tap styles and chip direction",
    ),
    url: "https://littlemachineshop.com/pages/choosing-the-correct-tap",
  },
  spiraltap: {
    name: T(
      "Sandvik: мітчик зі спіральними канавками",
      "Sandvik: spiral flute taps",
    ),
    url: "https://www.sandvik.coromant.com/en-us/tools/threading-tools/tapping-tools/corotap-300",
  },
  straighttap: {
    name: T(
      "Sandvik: мітчики з прямими канавками",
      "Sandvik: straight flute taps",
    ),
    url: "https://www.sandvik.coromant.com/en-us/tools/drilling-tools/solid-carbide-threading-tools/corotap-100",
  },
};
const advice: Record<Operation, Record<Material, Advice>> = {
  turning: {
    aluminum: {
      family: T(
        "Гострий HSS-різець або твердосплавна пластина для кольорових металів",
        "Sharp HSS tool or non-ferrous carbide insert",
      ),
      geometry: T(
        "Позитивна геометрія, гостра кромка та гладка передня поверхня. Держак і форма пластини мають дозволяти доступ до потрібного уступу.",
        "Positive geometry, a sharp edge and a smooth rake face. The holder and insert shape must reach the required shoulder.",
      ),
      coating: T(
        "Розгляньте непокритий шліфований сплав або покриття, прямо призначене виробником для цього алюмінію.",
        "Consider a ground uncoated grade or a coating explicitly approved for this aluminum alloy.",
      ),
      watch: T(
        "Налипання матеріалу на кромку змінює розмір і поверхню. Вміст кремнію впливає на знос — назви «алюміній» недостатньо.",
        "Built-up material changes size and finish. Silicon content affects wear; “aluminum” alone is not a complete specification.",
      ),
      sources: ["nonferrous", "hss", "inserts"],
    },
    steel: {
      family: T(
        "Заточений HSS-різець або пластина для групи ISO P",
        "Ground HSS tool or an ISO P carbide insert",
      ),
      geometry: T(
        "Виберіть стружколам і радіус вершини під фактичну чистову чи чорнову операцію. Гостра позитивна геометрія зменшує сили на гнучкій деталі.",
        "Match chipbreaker and nose radius to the actual finishing or roughing operation. Sharp positive geometry reduces forces on a flexible part.",
      ),
      coating: T(
        "Сплав і покриття беріть із карти виробника для марки, твердості та характеру різу, а не за кольором пластини.",
        "Select grade and coating from the maker’s chart for the steel, hardness and cut type, rather than insert color.",
      ),
      watch: T(
        "М’яка низьковуглецева сталь може давати довгу стружку й задирки. Надто легкий прохід не гарантує роботу стружколама.",
        "Soft low-carbon steel can produce long chips and burrs. An extremely light pass does not guarantee chipbreaker operation.",
      ),
      sources: ["inserts", "materials", "hss"],
    },
    stainless: {
      family: T(
        "Пластина для конкретної групи нержавіючої сталі",
        "Carbide insert for the specific stainless steel group",
      ),
      geometry: T(
        "Узгодьте гостроту кромки, міцність і стружколам із маркою та жорсткістю. Аустенітна, дуплексна й мартенситна сталі потребують різних рішень.",
        "Balance edge sharpness, strength and chipbreaker for the grade and rigidity. Austenitic, duplex and martensitic steels require different choices.",
      ),
      coating: T(
        "Покритий сплав із рекомендацією виробника для цієї нержавіючої сталі; універсального «найкращого покриття» немає.",
        "Use a coated grade recommended for that stainless steel; there is no universal best coating.",
      ),
      watch: T(
        "Тертя затупленою кромкою може наклепувати поверхню. Вібрація чи зростання зусилля — привід зупинити роботу й перевірити процес.",
        "Rubbing with a worn edge can work-harden the surface. Chatter or increasing force requires stopping and reviewing the process.",
      ),
      sources: ["materials", "inserts"],
    },
    "cast-iron": {
      family: T(
        "Зносостійка твердосплавна пластина для потрібного типу чавуну",
        "Wear-resistant carbide insert for the actual cast iron type",
      ),
      geometry: T(
        "Урахуйте ливарну кірку та переривчастий різ. Міцність кромки підбирають під ці умови, а не просто збільшують радіус вершини.",
        "Account for casting skin and interrupted cuts. Match edge strength to those conditions rather than merely increasing nose radius.",
      ),
      coating: T(
        "Сплав групи ISO K лише тоді, коли карта виробника відповідає конкретному чавуну та операції.",
        "Use an ISO K grade only when the maker’s application chart matches the particular iron and operation.",
      ),
      watch: T(
        "Сірий, високоміцний і загартований чавун не взаємозамінні. Абразивний пил потребує передбаченого процесом відведення, не здування на оператора.",
        "Gray, ductile and hardened iron are not interchangeable. Abrasive dust needs planned collection, never blowing toward the operator.",
      ),
      sources: ["materials", "inserts"],
    },
    plastic: {
      family: T(
        "Дуже гострий HSS-різець або полірований твердосплавний інструмент",
        "Very sharp HSS tool or polished carbide tool",
      ),
      geometry: T(
        "Кромка має різати, а не терти; забезпечте зазор і місце для стружки. Пружність заготовки врахуйте в затиску.",
        "The edge must cut rather than rub; allow clearance and chip space. Account for workpiece elasticity in the clamping setup.",
      ),
      coating: T(
        "Почніть із перевірки інструмента для саме цього полімеру. Покриття по сталі не є автоматичним вибором для пластику.",
        "First verify a tool intended for the actual polymer. A steel-machining coating is not an automatic choice for plastics.",
      ),
      watch: T(
        "Тепло, пружна деформація й довга стружка спотворюють розмір. Скло- та вугленаповнені пластики потребують окремого підбору й відведення пилу.",
        "Heat, elastic distortion and stringy chips affect size. Glass- and carbon-filled plastics need separate tooling and dust control.",
      ),
      sources: ["plastic", "materials", "hss"],
    },
  },
  milling: {
    aluminum: {
      family: T(
        "Кінцева фреза для алюмінію, часто з 2–3 зубцями",
        "Aluminum-specific end mill, commonly with 2–3 flutes",
      ),
      geometry: T(
        "Гострі кромки, місткі поліровані канавки. Для паза критичне місце для стружки; осьовий вхід потребує дозволеної для нього фрези з різанням до осі.",
        "Sharp edges and generous polished flutes. Slotting needs chip space; axial entry requires a suitable center-cutting tool.",
      ),
      coating: T(
        "Непокрита фреза або схвалені для сплаву ZrN/TiB₂ та інші покриття. Призначення в каталозі важливіше за колір.",
        "Uncoated tooling or alloy-approved ZrN/TiB₂ and other coatings. Catalog application matters more than color.",
      ),
      watch: T(
        "Більше зубців не завжди краще: канавки можуть забиватися. Число зубців узгодьте зі стратегією, діаметром і жорсткістю.",
        "More flutes are not always better: chip space can become insufficient. Match flute count to strategy, diameter and rigidity.",
      ),
      sources: ["aluminum", "milling"],
    },
    steel: {
      family: T(
        "Кінцева фреза по сталі з HSS/HSS-E або твердого сплаву",
        "Steel-cutting HSS/HSS-E or solid carbide end mill",
      ),
      geometry: T(
        "Для бокової обробки поширені багатозубі фрези; для повного паза перевірте місткість канавок і допустиму стратегію входу.",
        "Multi-flute tools are common for side cutting; full-width slots require checking chip space and permitted entry strategy.",
      ),
      coating: T(
        "Оберіть покриття й сплав із карти по сталі. HSS і твердий сплав мають різні робочі діапазони — не переносіть режими між ними.",
        "Choose coating and substrate from the steel application chart. HSS and carbide have different working ranges; do not transfer cutting data between them.",
      ),
      watch: T(
        "Довжина різальної частини має покривати обробку без зайвого вильоту. Глибокі кишені не є приводом одразу брати найдовшу фрезу.",
        "Flute length must cover the cut with minimal overhang. Deep pockets do not automatically justify the longest available tool.",
      ),
      sources: ["milling", "holemaking"],
    },
    stainless: {
      family: T(
        "Фреза, призначена для потрібної нержавіючої сталі",
        "End mill intended for the actual stainless grade",
      ),
      geometry: T(
        "Перевірте гостроту, канавки та міцність кромок. Змінний крок або спіраль можуть допомогти з коливаннями, але не виправлять люфт.",
        "Check edge sharpness, chip space and edge strength. Variable pitch or helix can help vibration, but cannot repair mechanical play.",
      ),
      coating: T(
        "Сумісні сплав і покриття для марки та мокрої або сухої операції за документацією виробника.",
        "Use a substrate and coating approved for the grade and the documented wet or dry application.",
      ),
      watch: T(
        "Не намагайтеся усунути наклеп довільним зменшенням подачі до тертя. Потрібне реальне зрізання стружки в дозволеному діапазоні.",
        "Do not respond to work hardening by arbitrarily reducing feed until the tool rubs. It must form a chip within the approved operating range.",
      ),
      sources: ["milling", "materials"],
    },
    "cast-iron": {
      family: T(
        "Фреза або пластини зі зносостійким сплавом для чавуну",
        "End mill or wear-resistant inserts rated for cast iron",
      ),
      geometry: T(
        "Зіставте кромку з ливарною кіркою й типом чавуну. Геометрію для сірого чавуну не переносіть без перевірки на високоміцний.",
        "Match the edge to casting skin and iron type. Do not transfer a gray-iron choice to ductile iron without verification.",
      ),
      coating: T(
        "Покритий твердий сплав є кандидатом; конкретна марка та застосування з охолодженням визначаються каталогом.",
        "Coated carbide is a candidate; the actual grade and coolant compatibility come from the catalog.",
      ),
      watch: T(
        "Потрібні захист напрямних від абразиву та контроль пилу. Кераміка й CBN не є автоматичним вибором для навчального верстата.",
        "Protect slideways from abrasive debris and control dust. Ceramics and CBN are not automatic choices for a training machine.",
      ),
      sources: ["milling", "materials"],
    },
    plastic: {
      family: T(
        "Спеціальна фреза для пластику, часто з 1–2 зубцями",
        "Plastic-specific end mill, often with 1–2 flutes",
      ),
      geometry: T(
        "Гостра геометрія та великі канавки відводять стружку й тепло. Напрям спіралі вибирайте з урахуванням опори тонкої деталі.",
        "Sharp geometry and large flute valleys remove chips and heat. Select upcut or downcut geometry with the thin part’s support in mind.",
      ),
      coating: T(
        "Перевірте призначення під конкретний ненаповнений полімер; непокрита гостра фреза може бути кандидатом.",
        "Check suitability for the particular unfilled polymer; a sharp uncoated tool can be a candidate.",
      ),
      watch: T(
        "Для термостійкіших полімерів виробник може пропонувати 2–3 зубці. Нагрівання, плавлення чи зварювання стружки вимагають зупинки й перегляду процесу.",
        "More heat-tolerant polymers may use 2–3 flute tools. Heating, melting or chip welding requires stopping and reviewing the process.",
      ),
      sources: ["plastic"],
    },
  },
  drilling: {
    aluminum: {
      family: T(
        "Коротке спіральне свердло HSS або твердосплавне для алюмінію",
        "Short HSS or carbide twist drill rated for aluminum",
      ),
      geometry: T(
        "Гостра вершина та канавки з місцем для довгої стружки. Перевірте довжину канавок і доступ для виходу стружки.",
        "Use a sharp point and flute space for long chips. Verify flute length and an unobstructed chip exit.",
      ),
      coating: T(
        "Гладка непокрита поверхня або спеціальне схвалене покриття; перевірте геометрію, а не лише напис HSS.",
        "Use a smooth bright finish or a specifically approved coating; verify geometry as well as the HSS label.",
      ),
      watch: T(
        "Коротка серія за достатньої робочої довжини краща за зайвий виліт. Велика глибина потребує окремо дозволеної стратегії й відведення стружки.",
        "Prefer a short series when it provides sufficient reach. Greater depth needs a separately approved strategy and chip evacuation.",
      ),
      sources: ["drillmaterials", "holemaking"],
    },
    steel: {
      family: T(
        "Коротке свердло HSS/HSS-E або твердосплавне, схвалене для сталі",
        "Short HSS/HSS-E or carbide drill approved for steel",
      ),
      geometry: T(
        "Спіральне свердло з геометрією для марки сталі. Розріджена перемичка або split point можуть зменшувати осьову силу.",
        "Use twist-drill geometry for the steel grade. Web thinning or a split point can reduce thrust.",
      ),
      coating: T(
        "Непокрите чи покрите виконання вибирайте за каталогом. Твердість заготовки й основа свердла змінюють допустимі режими.",
        "Choose bright or coated tooling from the catalog. Workpiece hardness and drill substrate change the permitted cutting data.",
      ),
      watch: T(
        "Після свердління розмір отвору треба виміряти. Номінал на хвостовику не гарантує посадку або придатність під мітчик.",
        "Measure the resulting hole. The shank marking does not guarantee a fit or suitability for the selected tap.",
      ),
      sources: ["drills", "holemaking"],
    },
    stainless: {
      family: T(
        "Свердло HSS-E з кобальтом або твердосплавне для цієї нержавіючої сталі",
        "Cobalt HSS-E or carbide drill rated for that stainless steel",
      ),
      geometry: T(
        "Гостра спеціальна вершина й канавки для в’язкої стружки. Вимоги до биття та затиску твердосплавного свердла перевірте окремо.",
        "Use a sharp material-specific point and flutes for tough chips. Verify carbide drill runout and holding requirements separately.",
      ),
      coating: T(
        "Схвалені виробником покриття або обробка поверхні. «Кобальт» позначає склад HSS-E, а не універсальне покриття.",
        "Use an approved coating or surface treatment. “Cobalt” describes the HSS-E substrate, not a universal coating.",
      ),
      watch: T(
        "Тертя може наклепувати поверхню; не тримайте затуплене свердло в контакті без різання. Подачу й охолодження погодьте за картою свердла.",
        "Rubbing can work-harden the surface; do not leave a worn drill rubbing in contact. Establish feed and coolant from the drill’s application data.",
      ),
      sources: ["drills", "drillmaterials"],
    },
    "cast-iron": {
      family: T(
        "Свердло HSS/HSS-E або твердосплавне для конкретного чавуну",
        "HSS/HSS-E or carbide drill rated for the particular cast iron",
      ),
      geometry: T(
        "Міцність вершини й зносостійкість узгодьте з типом чавуну та станом поверхні.",
        "Match point strength and wear resistance to the iron type and surface condition.",
      ),
      coating: T(
        "Потрібна пряма рекомендація виробника для матеріалу; сірий і високоміцний чавун можуть мати різні карти.",
        "Require an explicit material recommendation; gray and ductile iron may use different application charts.",
      ),
      watch: T(
        "Коротка абразивна стружка не усуває ризику забивання або пилу. Спосіб охолодження й збору відходів визначте до роботи.",
        "Short abrasive chips do not eliminate blockage or dust hazards. Establish coolant and waste collection before starting.",
      ),
      sources: ["drillmaterials", "holemaking"],
    },
    plastic: {
      family: T(
        "Гостре свердло, призначене для обраного полімеру",
        "Sharp drill intended for the selected polymer",
      ),
      geometry: T(
        "Перевірте рекомендовані вершину й канавки. Звичайне свердло по металу не є гарантованим рішенням для крихкого чи дуже в’язкого пластику.",
        "Verify the recommended point and flutes. A general metal drill is not a guaranteed choice for brittle or very ductile plastics.",
      ),
      coating: T(
        "Основа та поверхня мають бути схвалені для полімеру. Для наповнених матеріалів потрібний окремий підбір.",
        "The substrate and finish must be approved for the polymer. Filled materials need a separate selection.",
      ),
      watch: T(
        "Пружний затиск, нагрів і захоплення на виході змінюють отвір. Визначте опору й перевіряйте розмір після стабілізації температури.",
        "Clamping distortion, heat and grabbing at breakthrough affect the hole. Plan support and inspect after temperature stabilization.",
      ),
      sources: ["plastic", "materials", "holemaking"],
    },
  },
  threading: {
    aluminum: {
      family: T(
        "Різальний мітчик HSS/HSS-E, схвалений для сплаву",
        "HSS/HSS-E cutting tap approved for the alloy",
      ),
      geometry: T(
        "Гострі кромки й достатній простір для в’язкої стружки. Тип канавок залежить від наскрізного або глухого отвору.",
        "Use sharp edges and space for ductile chips. Flute style depends on whether the hole is through or blind.",
      ),
      coating: T(
        "Поліроване непокрите чи спеціальне покрите виконання — за картою виробника для алюмінію.",
        "Select a polished bright finish or a specialized coating from the aluminum application chart.",
      ),
      watch: T(
        "Безстружковий розкатник — інший інструмент з іншими вимогами до матеріалу, отвору й моменту. Не підмінюйте ним різальний мітчик.",
        "A forming tap is a different tool with different material, hole and torque requirements. Do not substitute it for a cutting tap.",
      ),
      sources: ["straighttap", "tap", "spiraltap"],
    },
    steel: {
      family: T(
        "Різальний мітчик HSS-E або HSS-E-PM для сталі",
        "Steel-cutting HSS-E or HSS-E-PM tap",
      ),
      geometry: T(
        "Узгодьте стандарт, крок, напрям і клас різьби. Форма забірної частини має відповідати доступній глибині.",
        "Match thread standard, pitch, hand and tolerance class. The lead chamfer must suit the available depth.",
      ),
      coating: T(
        "Покриття та геометрія для потрібної сталі й способу нарізання за документацією конкретного мітчика.",
        "Use coating and geometry rated for the actual steel and tapping method in the tap’s documentation.",
      ),
      watch: T(
        "Прямі канавки самі по собі не гарантують відведення довгої стружки. Отвір, напрям стружки та тримач перевіряйте разом.",
        "Straight flutes alone do not guarantee removal of long chips. Check the hole, chip direction and holder as one system.",
      ),
      sources: ["tap", "spiraltap", "straighttap"],
    },
    stainless: {
      family: T(
        "Мітчик HSS-E/HSS-E-PM для конкретної нержавіючої сталі",
        "HSS-E/HSS-E-PM tap for the actual stainless steel",
      ),
      geometry: T(
        "Гостра геометрія й контроль стружки без тертя затупленою кромкою. Тип канавок звірте з отвором та маркою.",
        "Use sharp geometry and chip control without rubbing with a worn edge. Match flute style to the hole and grade.",
      ),
      coating: T(
        "Сумісні поверхня й мастильний матеріал — лише за даними виробника та вимогами майстерні.",
        "Use a compatible surface treatment and lubricant according to manufacturer data and workshop requirements.",
      ),
      watch: T(
        "Машинне нарізання потребує сумісного тримача та синхронізації подачі з кроком. Не утримуйте мітчик рукою біля шпинделя.",
        "Machine tapping requires a compatible holder and feed synchronized with pitch. Never restrain a tap by hand near the spindle.",
      ),
      sources: ["spiraltap", "drills", "tap"],
    },
    "cast-iron": {
      family: T(
        "Різальний мітчик для чавуну, часто з прямими канавками",
        "Cast-iron cutting tap, commonly with straight flutes",
      ),
      geometry: T(
        "Для короткостружкового чавуну перевіряйте прямі канавки та відповідну забірну частину. Правило «глухий отвір = спіраль» тут не є універсальним.",
        "For short-chipping iron, check straight flutes and the correct lead chamfer. “Blind hole = spiral flute” is not a universal rule here.",
      ),
      coating: T(
        "Зносостійке виконання, прямо призначене для типу чавуну. Розкатник не є автоматично допустимою заміною.",
        "Use wear-resistant tooling explicitly rated for the iron type. A forming tap is not an automatically permitted substitute.",
      ),
      watch: T(
        "Для глухого отвору залиште погоджений запас під забірну частину й стружку; перевірте план очищення.",
        "For a blind hole, establish allowance for the lead chamfer and chips, and verify the clearing plan.",
      ),
      sources: ["straighttap", "tap", "materials"],
    },
    plastic: {
      family: T(
        "Гострий різальний мітчик, схвалений для полімеру",
        "Sharp cutting tap approved for the polymer",
      ),
      geometry: T(
        "Підберіть канавки для стружки й довжину забірної частини. Клас посадки визначайте для фактичного полімеру та призначення.",
        "Match flutes to the chips and select the lead length. Establish the fit for the actual polymer and intended use.",
      ),
      coating: T(
        "Застосуйте виконання, зазначене виробником для полімеру; покриття по сталі не є достатнім підтвердженням.",
        "Use a version rated for the polymer; a steel-cutting coating is not sufficient approval.",
      ),
      watch: T(
        "Різьба може деформуватися або повзти під навантаженням. Для робочого з’єднання окремо оцінюють міцність чи потребу в різьбовій вставці.",
        "Threads can distort or creep under load. A service joint needs a separate strength assessment or consideration of a threaded insert.",
      ),
      sources: ["materials", "tap", "plastic"],
    },
  },
};

function NumberMark({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g className="tool-selector-number">
      <rect x={x - 11} y={y - 11} width="22" height="22" rx="3" />
      <text x={x} y={y + 4} textAnchor="middle">
        {n}
      </text>
    </g>
  );
}
function ToolSketch({
  operation,
  material,
  hole,
  lang,
}: {
  operation: Operation;
  material: Material;
  hole: Hole;
  lang: Lang;
}) {
  const id = useId().replace(/:/g, "");
  const straight =
    operation === "threading" &&
    (material === "cast-iron" || hole === "through");
  const title =
    operation === "turning"
      ? T("Різець зі змінною пластиною", "Indexable turning tool")
      : operation === "milling"
        ? T("Кінцева фреза", "End mill")
        : operation === "drilling"
          ? T("Спіральне свердло", "Twist drill")
          : material === "cast-iron"
            ? T("Мітчик із прямими канавками", "Straight-fluted tap")
            : hole === "through"
              ? T("Мітчик spiral-point", "Spiral-point tap")
              : T("Мітчик зі спіральними канавками", "Spiral flute tap");
  const parts: Text[] =
    operation === "turning"
      ? [
          T("Держак", "Holder"),
          T("Кріплення пластини", "Insert fastening"),
          T("Стружколам", "Chipbreaker"),
          T("Вершина й радіус", "Nose and radius"),
        ]
      : operation === "milling"
        ? [
            T("Хвостовик для затиску", "Clamping shank"),
            T("Різальна довжина", "Cutting length"),
            T("Стружкові канавки", "Chip flutes"),
            T("Торцеві кромки", "End cutting edges"),
          ]
        : operation === "drilling"
          ? [
              T("Хвостовик", "Shank"),
              T("Стружкові канавки", "Chip flutes"),
              T("Різальні кромки", "Cutting lips"),
              T("Вершина й перемичка", "Point and chisel edge"),
            ]
          : [
              T("Хвостовик і привід", "Shank and drive"),
              T("Канавки", "Flutes"),
              T("Калібрувальні витки", "Full-form threads"),
              T("Забірна частина", "Lead chamfer"),
            ];
  const fluteCount =
    material === "plastic" ? 2 : material === "aluminum" ? 3 : 4;
  return (
    <figure className="tool-selector-figure">
      <div className="tool-selector-figure-title">
        <strong>{title[lang]}</strong>
        <span>{T("Умовна схема", "Schematic")[lang]}</span>
      </div>
      <svg
        viewBox="0 0 560 230"
        role="img"
        aria-labelledby={`tool-title-${id}`}
      >
        <title id={`tool-title-${id}`}>
          {title[lang]}. {parts.map((p) => p[lang]).join("; ")}
        </title>
        <defs>
          <marker
            id={`tool-arrow-${id}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 10 5 0 10Z" fill="#2563a3" />
          </marker>
        </defs>
        <g className="tool-selector-outline">
          {operation === "turning" ? (
            <>
              <path
                d="M64 78H302L376 133 318 170H64Z"
                className="tool-selector-body"
              />
              <path
                d="m292 94 80 40-54 18-80-40Z"
                className="tool-selector-cutting"
              />
              <path d="m290 106 58 28-31 8-58-28Z" />
              <ellipse
                cx="304"
                cy="125"
                rx="9"
                ry="6"
                className="tool-selector-body"
              />
              <path d="m340 126 32 8-25 9" className="tool-selector-edge" />
              <NumberMark x={117} y={119} n={1} />
              <NumberMark x={304} y={125} n={2} />
              <NumberMark x={268} y={104} n={3} />
              <NumberMark x={386} y={139} n={4} />
              <path
                d="M425 72h64v40l-20 13-44-16Z"
                className="tool-selector-body"
              />
              <path d="m425 109 44 16 20-13" className="tool-selector-edge" />
              <text
                x="456"
                y="157"
                className="tool-selector-sketch-text"
                textAnchor="middle"
              >
                HSS
              </text>
              <text
                x="456"
                y="177"
                className="tool-selector-sketch-small"
                textAnchor="middle"
              >
                {T("суцільний різець", "solid tool bit")[lang]}
              </text>
            </>
          ) : operation === "milling" ? (
            <>
              <path d="M73 84h153v62H73Z" className="tool-selector-body" />
              <path d="M226 84h236v62H226Z" className="tool-selector-cutting" />
              {Array.from({ length: fluteCount }, (_, i) => (
                <path
                  key={i}
                  d={`M${234 + i * 48} 84c26 19 10 43 33 62`}
                  className="tool-selector-edge"
                />
              ))}
              <path d="m450 85 11 20-11 21 11 19" />
              <path
                d="M226 168v15m236-15v15M226 176h236"
                className="tool-selector-dimension"
              />
              <text
                x="344"
                y="202"
                className="tool-selector-sketch-text"
                textAnchor="middle"
              >
                L
                <tspan baselineShift="sub" fontSize="11">
                  c
                </tspan>
              </text>
              <NumberMark x={129} y={114} n={1} />
              <NumberMark x={329} y={176} n={2} />
              <NumberMark x={338} y={109} n={3} />
              <NumberMark x={474} y={139} n={4} />
            </>
          ) : operation === "drilling" ? (
            <>
              <path d="M69 86h139v62H69Z" className="tool-selector-body" />
              <path
                d="M208 86h208l53 31-53 31H208Z"
                className="tool-selector-cutting"
              />
              <path
                d="M213 87c43 0 45 60 91 60s48-60 93-60M213 147c43 0 45-60 91-60s48 60 93 60"
                className="tool-selector-edge"
              />
              <path d="m416 86 17 34 36-3-36 3-17 28" />
              <path d="m433 114 0 12" className="tool-selector-edge" />
              <NumberMark x={123} y={115} n={1} />
              <NumberMark x={283} y={95} n={2} />
              <NumberMark x={420} y={79} n={3} />
              <NumberMark x={482} y={124} n={4} />
            </>
          ) : (
            <>
              <path
                d="M71 91h22v-8h115v10h27v48h-27v10H93v-8H71Z"
                className="tool-selector-body"
              />
              <path
                d="M235 82h181l38 24v22l-38 24H235Z"
                className="tool-selector-cutting"
              />
              {Array.from({ length: 14 }, (_, i) => (
                <path key={i} d={`M${243 + i * 12} 84l-9 66`} />
              ))}
              {straight ? (
                <>
                  <path
                    d="M237 111h198v14H237Z"
                    className="tool-selector-groove"
                  />
                  {material !== "cast-iron" && (
                    <path d="m412 111 32 18" className="tool-selector-edge" />
                  )}
                </>
              ) : (
                <path
                  d="M238 94c44 0 32 44 77 44s31-44 77-44l43 24"
                  className="tool-selector-groove"
                />
              )}
              <NumberMark x={129} y={116} n={1} />
              <NumberMark x={279} y={117} n={2} />
              <NumberMark x={363} y={83} n={3} />
              <NumberMark x={461} y={135} n={4} />
              {material !== "cast-iron" && (
                <>
                  <path
                    d={hole === "through" ? "M274 184H431" : "M431 184H274"}
                    className="tool-selector-chip-arrow"
                    markerEnd={`url(#tool-arrow-${id})`}
                  />
                  <text
                    x="352"
                    y="210"
                    className="tool-selector-sketch-small"
                    textAnchor="middle"
                  >
                    {
                      (hole === "through"
                        ? T(
                            "Стружка вперед — до виходу",
                            "Chips forward — toward the exit",
                          )
                        : T(
                            "Стружка назад — із глухого отвору",
                            "Chips back — out of the blind hole",
                          ))[lang]
                    }
                  </text>
                </>
              )}
            </>
          )}
        </g>
      </svg>
      <figcaption>
        <ol>
          {parts.map((part, i) => (
            <li key={i}>
              <b>{i + 1}</b>
              {part[lang]}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

function isToolingRoute() {
  return location.hash.slice(1).split("?")[0].replace(/\/$/, "") === "/tooling";
}
function readSelection() {
  const params = new URLSearchParams(
    isToolingRoute() ? location.hash.split("?").slice(1).join("?") : "",
  );
  function valid<T extends string>(
    key: string,
    values: readonly T[],
    fallback: T,
  ): T {
    const value = params.get(key);
    return values.includes(value as T) ? (value as T) : fallback;
  }
  return {
    operation: valid<Operation>(
      "operation",
      ["turning", "milling", "drilling", "threading"],
      "turning",
    ),
    material: valid<Material>(
      "material",
      ["aluminum", "steel", "stainless", "cast-iron", "plastic"],
      "aluminum",
    ),
    rigidity: valid<Rigidity>("rigidity", ["light", "rigid"], "light"),
    feature: valid<Feature>("context", ["rough", "finish"], "finish"),
    hole: valid<Hole>("context", ["through", "blind"], "through"),
  };
}
export default function ToolSelector({ lang }: { lang: Lang }) {
  const id = useId();
  const [initial] = useState(readSelection);
  const [operation, setOperation] = useState<Operation>(initial.operation);
  const [material, setMaterial] = useState<Material>(initial.material);
  const [rigidity, setRigidity] = useState<Rigidity>(initial.rigidity);
  const [feature, setFeature] = useState<Feature>(initial.feature);
  const [hole, setHole] = useState<Hole>(initial.hole);
  useEffect(() => {
    const restore = () => {
      if (!isToolingRoute()) return;
      const next = readSelection();
      setOperation(next.operation);
      setMaterial(next.material);
      setRigidity(next.rigidity);
      setFeature(next.feature);
      setHole(next.hole);
    };
    window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, []);
  useEffect(() => {
    if (!isToolingRoute()) return;
    const [path, ...query] = location.hash.slice(1).split("?");
    const params = new URLSearchParams(query.join("?"));
    params.set("operation", operation);
    params.set("material", material);
    params.set("rigidity", rigidity);
    params.set(
      "context",
      operation === "drilling" || operation === "threading" ? hole : feature,
    );
    const nextHash = `#${path}?${params.toString()}`;
    if (nextHash !== location.hash)
      history.replaceState(
        history.state,
        "",
        `${location.pathname}${location.search}${nextHash}`,
      );
  }, [operation, material, rigidity, feature, hole]);
  const selected = advice[operation][material];
  const isHole = operation === "drilling" || operation === "threading";
  const throughTap = hole === "through" && material !== "cast-iron";
  const holeNote =
    operation === "threading"
      ? material === "cast-iron"
        ? T(
            "Для короткостружкового чавуну розгляньте прямі канавки і для наскрізного, і для глухого отвору. Конкретну конструкцію підтверджує каталог.",
            "For short-chipping iron, consider straight flutes for through and blind holes. Confirm the particular design in the catalog.",
          )
        : throughTap
          ? T(
              "Для наскрізного отвору розгляньте spiral-point: косий підріз на забірній частині спрямовує стружку вперед. Прямі поздовжні канавки не роблять такий мітчик звичайним ручним.",
              "For a through hole, consider a spiral-point tap: its angled point drives chips forward. Straight longitudinal flutes do not make it a general hand tap.",
            )
          : T(
              "Для глухого отвору розгляньте spiral-flute: спіральні канавки виносять стружку назад. Потрібний запас глибини під забірну частину; повна різьба не починається на самому кінчику.",
              "For a blind hole, consider a spiral-flute tap, which lifts chips back out. Allow depth for the lead chamfer; full threads do not start at the very tip.",
            )
      : hole === "through"
        ? T(
            "Перевірте опору та вихід свердла: заготовка не має підхопитися, а вершина — потрапити в стіл, губки чи кріплення.",
            "Check backing and breakthrough: the work must not be grabbed, and the point must not hit the table, jaws or fixture.",
          )
        : T(
            "Розрізняйте глибину до вершини свердла та глибину повного діаметра. Форма дна і простір для стружки мають бути задані на ескізі.",
            "Distinguish depth to the drill tip from full-diameter depth. Define the bottom shape and chip space in the drawing.",
          );
  const contextNote =
    operation === "turning"
      ? feature === "finish"
        ? T(
            "Для чистового проходу перевірте робочий діапазон стружколама, радіус вершини та припуск. Великий радіус може збільшити радіальну силу й віджим деталі.",
            "For finishing, verify the chipbreaker range, nose radius and allowance. A large nose radius can increase radial force and workpiece deflection.",
          )
        : T(
            "Для чорнової обробки потрібна достатня міцність кромки й надійне кріплення. Пластина для легкої чистової операції не стає чорновою після збільшення подачі.",
            "Roughing requires sufficient edge strength and secure workholding. A light finishing insert does not become a rougher merely by increasing feed.",
          )
      : feature === "finish"
        ? T(
            "Для чистової обробки перевірте биття, залишковий припуск і вільний доступ до стінки або дна. Кульова фреза, плоска кінцева та торцева фреза утворюють різні поверхні.",
            "For finishing, check runout, remaining allowance and access to the wall or floor. Ball, square end and face mills generate different surfaces.",
          )
        : T(
            "Для чорнової вибірки перевірте заповнення канавок, ширину зачеплення та дозволений вхід. Зубчаста чорнова фреза залишає сліди й не замінює чистову.",
            "For roughing, verify flute loading, engagement width and permitted entry. A serrated roughing end mill leaves marks and does not replace a finishing tool.",
          );
  const required = [
    T(
      "Точна марка, стан і твердість матеріалу; для пластику — також наповнювачі й температурні обмеження.",
      "Exact material grade, condition and hardness; for plastics, also fillers and temperature limits.",
    ),
    T(
      "Артикул інструмента, основа, покриття, діаметр, робоча довжина й виліт; для пластини — геометрія та радіус.",
      "Tool part number, substrate, coating, diameter, usable length and overhang; for inserts, geometry and nose radius.",
    ),
    isHole
      ? T(
          "Глибина й вихід отвору; для різьби — стандарт, крок, клас, повна глибина та потрібний підготовчий отвір.",
          "Hole depth and exit; for threads, standard, pitch, class, full thread depth and the required pre-tap bore.",
        )
      : T(
          "Форма операції, ширина й глибина зрізу, припуск і вимоги до поверхні та точності.",
          "Operation shape, engagement width and depth, allowance, surface finish and accuracy requirements.",
        ),
    T(
      "Тип верстата й подачі, допустимі оберти, момент на потрібних обертах, стан шпинделя та люфти.",
      "Machine and feed type, permitted speed, available torque at that speed, spindle condition and mechanical play.",
    ),
    T(
      "Модель і стан тримача/цанги/патрона, допуск биття, дозволені оберти та процедура затиску.",
      "Holder/collet/chuck model and condition, permitted runout, rated speed and clamping procedure.",
    ),
    T(
      "Спосіб кріплення деталі, охолодження/мащення та безпечне відведення стружки за процедурою майстерні.",
      "Workholding, coolant/lubrication and safe chip removal under the workshop procedure.",
    ),
  ];
  const selectedSources = [
    ...new Set([
      ...selected.sources,
      ...(operation === "threading"
        ? [
            material === "cast-iron"
              ? "straighttap"
              : throughTap
                ? "tap"
                : "spiraltap",
          ]
        : []),
    ]),
  ];
  return (
    <section
      className="tool-selector"
      aria-label={
        T("Довідник вибору інструмента", "Tool selection reference")[lang]
      }
    >
      <header className="tool-selector-heading">
        <a className="text-link" href="#/materials">
          {
            T(
              "Практичні довідники за матеріалом →",
              "Practical material guides →",
            )[lang]
          }
        </a>
        <p>
          {
            T(
              "Виберіть операцію й відомий матеріал, порівняйте геометрію та перевірте кандидата в каталозі виробника.",
              "Select the operation and identified material, compare geometry, then check the candidate in the manufacturer’s catalog.",
            )[lang]
          }
        </p>
      </header>
      <div className="tool-selector-inputs">
        <label htmlFor={`${id}-operation`}>
          <span>{T("Операція", "Operation")[lang]}</span>
          <div>
            <select
              id={`${id}-operation`}
              value={operation}
              onChange={(event) =>
                setOperation(event.target.value as Operation)
              }
            >
              {Object.entries(operationNames).map(([value, name]) => (
                <option key={value} value={value}>
                  {name[lang]}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </label>
        <label htmlFor={`${id}-material`}>
          <span>{T("Матеріал", "Material")[lang]}</span>
          <div>
            <select
              id={`${id}-material`}
              value={material}
              onChange={(event) => setMaterial(event.target.value as Material)}
            >
              {Object.entries(materialNames).map(([value, name]) => (
                <option key={value} value={value}>
                  {name[lang]}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </label>
        <label htmlFor={`${id}-rigidity`}>
          <span>{T("Жорсткість встановлення", "Setup rigidity")[lang]}</span>
          <div>
            <select
              id={`${id}-rigidity`}
              value={rigidity}
              onChange={(event) => setRigidity(event.target.value as Rigidity)}
            >
              <option value="light">
                {
                  T(
                    "Легке / чутливе до вібрацій",
                    "Light / vibration-sensitive",
                  )[lang]
                }
              </option>
              <option value="rigid">
                {T("Жорстке / перевірене", "Rigid / verified")[lang]}
              </option>
            </select>
            <ChevronDown size={16} />
          </div>
        </label>
        <label htmlFor={`${id}-feature`}>
          <span>
            {
              (isHole
                ? T("Тип отвору", "Hole type")
                : T("Етап обробки", "Machining stage"))[lang]
            }
          </span>
          <div>
            {isHole ? (
              <select
                id={`${id}-feature`}
                value={hole}
                onChange={(event) => setHole(event.target.value as Hole)}
              >
                <option value="through">
                  {T("Наскрізний", "Through")[lang]}
                </option>
                <option value="blind">{T("Глухий", "Blind")[lang]}</option>
              </select>
            ) : (
              <select
                id={`${id}-feature`}
                value={feature}
                onChange={(event) => setFeature(event.target.value as Feature)}
              >
                <option value="rough">
                  {T("Чорнова обробка", "Roughing")[lang]}
                </option>
                <option value="finish">
                  {T("Чистова обробка", "Finishing")[lang]}
                </option>
              </select>
            )}
            <ChevronDown size={16} />
          </div>
        </label>
      </div>
      <div className="tool-selector-identification">
        <Info size={18} />
        <p>
          {
            T(
              "Матеріал невідомий, стіл хитається чи є люфт шпинделя? Спочатку ідентифікація й перевірка верстата. Вибір іншої фрези не усуває несправність.",
              "Unknown stock, a rocking table or spindle play? Identify the material and inspect the machine first. A different cutter does not repair a fault.",
            )[lang]
          }
        </p>
      </div>
      <div className="tool-selector-result">
        <div
          className="tool-selector-summary"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>
            {operationNames[operation][lang]} / {materialNames[material][lang]}
          </span>
          <h3>{selected.family[lang]}</h3>
          <p>
            {
              T(
                "Кандидат для перевірки в каталозі. Це навчальна підбірка принципів із документації виробників; вона не підтверджує придатність конкретного оснащення.",
                "A candidate to verify in the catalog. This educational shortlist synthesizes manufacturer guidance; it does not approve a particular tool assembly.",
              )[lang]
            }
          </p>
        </div>
        <div className="tool-selector-result-grid">
          <ToolSketch
            operation={operation}
            material={material}
            hole={hole}
            lang={lang}
          />
          <div className="tool-selector-details">
            <dl>
              <div>
                <dt>{T("Геометрія", "Geometry")[lang]}</dt>
                <dd>{selected.geometry[lang]}</dd>
              </div>
              <div>
                <dt>{T("Основа й покриття", "Substrate and coating")[lang]}</dt>
                <dd>{selected.coating[lang]}</dd>
              </div>
              <div>
                <dt>{T("На що звернути увагу", "What to watch")[lang]}</dt>
                <dd>{selected.watch[lang]}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="tool-selector-context">
          <div>
            <h4>
              {
                (isHole
                  ? T("Отвір і відведення стружки", "Hole and chip evacuation")
                  : T("Чорнова чи чистова операція", "Roughing or finishing"))[
                  lang
                ]
              }
            </h4>
            <p>{(isHole ? holeNote : contextNote)[lang]}</p>
          </div>
          <div>
            <h4>{T("Що змінює жорсткість", "What rigidity changes")[lang]}</h4>
            <p>
              {
                (rigidity === "light"
                  ? T(
                      "Шукайте геометрію з меншими силами, коротку робочу довжину й мінімальний виліт. HSS може бути доречним; твердий сплав теж можливий, якщо це дозволено виробником. Підтвердіть затиск і биття до різання.",
                      "Look for lower-force geometry, a short usable length and minimal overhang. HSS can be appropriate; carbide can also work when approved by the maker. Verify holding and runout before cutting.",
                    )
                  : T(
                      "Перевірена жорсткість дозволяє розглядати міцніші кромки й продуктивніші сімейства лише в межах карти інструмента. Потужність двигуна сама по собі не підтверджує жорсткість, допустимі оберти чи безпечне кріплення.",
                      "Verified rigidity allows considering stronger edges and higher-productivity families only within the tool’s application range. Motor power alone does not establish rigidity, permissible speed or safe workholding.",
                    ))[lang]
              }
            </p>
          </div>
        </div>
        {operation === "milling" && (
          <p className="tool-selector-method-note">
            <TriangleAlert size={17} />
            <span>
              {
                T(
                  "Ручна подача й ЧПУ мають різні умови. За люфту гвинта не переходьте до попутного фрезерування без дозволу виробника й перевірки механізму подачі.",
                  "Manual and CNC feed have different conditions. With screw backlash, do not adopt climb milling without manufacturer approval and checking the feed mechanism.",
                )[lang]
              }
            </span>
          </p>
        )}
        {operation === "threading" && (
          <p className="tool-selector-method-note">
            <Info size={17} />
            <span>
              {
                T(
                  "Цей режим стосується різальної внутрішньої різьби. Плашка, різьбовий різець, різьбофреза й розкатник — різні інструменти з окремим підбором. Машинне нарізання потребує синхронізації подачі з кроком за інструкцією верстата. Свердлильний патрон не є автоматично придатним тримачем мітчика.",
                  "This mode covers cut internal threads. Dies, single-point tools, thread mills and forming taps require separate selection. Machine tapping requires feed synchronized with pitch under the machine instructions. A drill chuck is not automatically a suitable tap holder.",
                )[lang]
              }
            </span>
          </p>
        )}
      </div>
      <section
        className="tool-selector-checks"
        aria-labelledby={`${id}-checks`}
      >
        <h3 id={`${id}-checks`}>
          {
            T(
              "Що потрібно для остаточного підбору й карти режимів",
              "Inputs for final selection and manufacturer cutting data",
            )[lang]
          }
        </h3>
        <ul>
          {required.map((item, index) => (
            <li key={index}>
              <Check size={17} />
              <span>{item[lang]}</span>
            </li>
          ))}
        </ul>
        <div className="tool-selector-no-settings">
          <TriangleAlert size={19} />
          <p>
            {
              T(
                "Універсальних обертів і подач тут немає. Використайте карту саме вашого інструмента, перевірте її обмеження з наставником і виконайте контрольований перший прохід за процедурою верстата.",
                "No universal speed or feed is supplied here. Use the actual tool’s data, verify the limits with a supervisor and make a controlled first cut under the machine’s procedure.",
              )[lang]
            }
          </p>
        </div>
      </section>
      <section className="tool-selector-sources">
        <h3>
          <BookOpen size={18} />
          {
            T(
              "Документація для цього вибору",
              "Documentation for this selection",
            )[lang]
          }
        </h3>
        {selectedSources.map((key) => (
          <a
            key={key}
            href={sources[key].url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {sources[key].name[lang]}
            <ArrowUpRight size={16} />
          </a>
        ))}
      </section>
    </section>
  );
}
