# Workbench by Defencore

**UA:** Практична база знань з металообробки для новачків: безпека, основи, токарні й фрезерні верстати, ЧПУ, матеріали, вимірювання та реверс-інжиніринг. Покрокові інструкції доповнені контрольними пунктами, перевіркою знань, навчальними маршрутами, проєктами деталей та інтерактивними 3D-моделями.

**EN:** A practical machining knowledge base for beginners: safety, fundamentals, turning, milling, CNC, materials, measurement and reverse engineering. Step-by-step lessons include checklists, knowledge checks, learning paths, practice projects and interactive 3D models.

**49 інструкцій · 10 розділів · 24 технологічні маршрути · 9 довідників матеріалів · 39 моделей STEP.**

**UA:** Окремі розділи охоплюють введення верстата в експлуатацію, щоденний огляд, змащування, напрямні й люфти, юстування, перевірку геометрії та виставлення інструмента. Інтерактивний підбір порівнює 20 комбінацій операцій і відомих матеріалів; вибрані параметри залишаються в локальній адресі сторінки. 24 навчальні проєкти містять 124 встановлення, 372 операції, 197 контрольованих вимог і 27 пристроїв, які потрібно виготовити. Розмірні схеми та 3D-моделі будуються з однієї числової геометрії. Є номінальні STEP-моделі деталей і геометрично заданого оснащення, експорт маршрутів і протоколів у CSV, локальні записи вимірювань та фактичних умов встановлення.

**EN:** Dedicated topics cover commissioning, daily inspection, lubrication, slideways and backlash, alignment, geometry verification and tool setting. Interactive tool selection compares 20 operation/material combinations, retaining selections in the local page address. 24 projects contain 124 setups, 372 operations, 197 controlled requirements and 27 fixtures to fabricate. Dimensioned drawings and interactive solids share one numeric geometry. Nominal STEP files cover parts and geometrically defined fixtures. Routes and inspection records export as CSV; actual setup notes and measured ranges remain in the browser.

Production / Публічна адреса: [workbench.defencore.com](https://workbench.defencore.com)

## Використання / Using Workbench

- **UA:** Почніть із безпеки або навчального маршруту. Шукайте інструкції, фільтруйте їх за розділом і складністю. Зберігайте корисні матеріали: вони потрапляють у «Збережене» й піднімаються в рекомендованому порядку. Перемикач UA/EN змінює інтерфейс та зміст уроків.
- **EN:** Start with safety or a learning path. Search guides and filter by topic and difficulty. Save useful materials to find them in Saved and prioritize them in recommended ordering. UA/EN switches both the interface and lesson content.

## Матеріали й візуалізація / Materials and visual learning

**UA:** Окремі довідники охоплюють 6061/6082-T6, нормалізовану C45, 304/316L, латунь, ненаповнений POM-C, PA6, сірий чавун, Cu-ETP і технічно чистий титан Grade 2. Для кожного наведено вибір інструмента, підготовку, точіння, фрезерування, свердління, фініш, характер стружки, очікуваний результат, діагностику дефектів та вправи. Інтерактивна лабораторія показує поступове зняття матеріалу. Ілюстрації поверхонь є створеними схемами, а не фотографіями чи виміряною шорсткістю.

**EN:** Separate guides cover 6061/6082-T6, normalized C45, 304/316L, brass, unfilled POM-C, PA6, grey cast iron, Cu-ETP and commercially pure Grade 2 titanium. Each covers tool selection, preparation, turning, milling, drilling, finishing, chips, expected outcomes, troubleshooting and exercises. The interactive lab shows progressive material removal. Surface illustrations are authored diagrams, not photographs or measured roughness.

## Дані та офлайн / Data and offline use

**UA:** Обрані матеріали, мова, прогрес, контрольні пункти, покази вимірювань і нотатки про встановлення зберігаються в `localStorage` поточного браузера. Service worker кешує оболонку та ресурси для офлайн-доступу після завантаження. Зовнішні першоджерела потребують мережі. У налаштуваннях можна очистити саме дані та кеш Workbench; закладки й прогрес після цього втрачаються. Синхронізації між пристроями немає; браузер може видаляти локальні дані.

**EN:** Bookmarks, language, progress, checklists, measurement readings and setup notes remain in the current browser's `localStorage`. A service worker caches the application shell and resources for offline access after loading. External references require a connection. Settings can remove Workbench data and caches; doing so loses bookmarks and progress. There is no cross-device sync, and browsers may evict local data.

## Межі навчальних матеріалів / Educational limits

**UA:** Уроки не є допуском до верстата, оцінкою ризику конкретної майстерні або заміною інструкції виробника. Перші налаштування й різання потребують кваліфікованого наставника. Допустимі оберти, режими різання, зусилля кріплення та процедури ізоляції енергії визначаються конкретним обладнанням, оснащенням, матеріалом і місцевими правилами. Маршрути є інженерними навчальними прикладами з визначеними цільовими розмірами; фізична апробація не заявлена. Числові приклади режимів перевіряють арифметику за заданими припущеннями. STEP відтворює номінальну геометрію в мм, без неописаних різьб, малих фасок і форми вершини свердла. Контроль визначає таблиця вимог, а не екранна модель. Для відповідальних деталей потрібні окремі інженерні вимоги та приймання. Правила безпеки посилаються на першоджерела CCOHS, OSHA, NIOSH і виробників; ці посилання не означають сертифікації сервісу цими організаціями.

**EN:** Lessons do not authorize machine operation, replace a workshop risk assessment or supersede the manufacturer's manual. Initial setups and cuts require a qualified supervisor. Speeds, cutting conditions, workholding forces and energy-isolation procedures depend on the exact equipment, tooling, material and local rules. Routes are engineered learning examples with defined dimensional targets; physical prove-out is not claimed. Cutting calculations demonstrate arithmetic under explicit assumptions. STEP reproduces nominal geometry in millimetres, omitting unmodelled threads, small chamfers and drill-point forms. The requirements table controls acceptance. Safety-critical parts require separate engineering requirements and acceptance. Safety references link to CCOHS, OSHA, NIOSH and manufacturers; these references do not imply their certification of this service.

## Розробка / Development

Requires / Потрібні: **Node.js 24+**, npm.

```sh
npm ci
npm run dev
```

Verification and production preview / Перевірка та перегляд готової збірки:

```sh
npm run check
npm run preview
```

The validator checks both languages, references, source URLs, prerequisite cycles, numeric geometry, feature bindings and limits, setup/operation/fixture coverage, material exercises and cutting arithmetic. CAD validation checks geometry revisions and hashes, file hashes, coverage and recorded native STEP round-trip solidity, volume and bounds. Regression tests cover measurement decisions, arithmetic, revision-scoped records and browser storage handling.

Перевірки охоплюють обидві мови, посилання, геометрію, зв’язки розмірів, встановлення й оснащення, вправи з матеріалами, арифметику режимів та цілісність STEP. Тести перевіряють числові рішення, межі допусків і збереження записів у браузері.

## Архітектура / Architecture

| Location                             | Purpose / Призначення                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `src/App.tsx`                        | React interface and fragment routing / Інтерфейс React і hash-навігація                                |
| `src/data/content.ts`                | Bilingual lessons, projects and references / Двомовні уроки, проєкти й джерела                         |
| `src/data/preparation.ts`            | Preparation, maintenance and tool-selection lessons / Підготовка, обслуговування та вибір інструментів |
| `src/components/LessonDiagram.tsx`   | Annotated instructional schematics / Навчальні схеми з підписами                                       |
| `src/components/ProjectDrawing.tsx`  | Project geometry and dimensions / Види й розміри навчальних деталей                                    |
| `src/components/ToolSelector.tsx`    | Interactive tooling shortlist / Інтерактивний підбір інструмента                                       |
| `src/data/projects/`                 | Dimensional manufacturing routes and fixtures / Розмірні технологічні маршрути й оснащення             |
| `src/data/material-guides.ts`        | Grade-specific material guidance and exercises / Матеріали й практичні вправи                          |
| `src/components/MachiningLab.tsx`    | Progressive 3D material removal / Покрокова 3D-обробка                                                 |
| `src/components/SurfaceExamples.tsx` | Surface and chip illustrations / Ілюстрації поверхні та стружки                                        |
| `public/models/`                     | Versioned nominal STEP solids and verification manifest / Номінальні STEP-моделі                       |
| `src/data/types.ts`                  | Curriculum schema / Структура навчальних матеріалів                                                    |
| `src/data/ui.ts`                     | Interface translations and categories / Переклади інтерфейсу й розділи                                 |
| `src/components/ModelViewer.tsx`     | Procedural Three.js viewer / Інтерактивні моделі Three.js                                              |
| `src/storage.ts`                     | Local preferences and data reset / Локальні налаштування й очищення                                    |
| `scripts/validate-content.mjs`       | Curriculum integrity checks / Перевірка цілісності матеріалів                                          |
| `.github/workflows/deploy.yml`       | Build and GitHub Pages publication / Збірка й публікація                                               |

**UA:** Статичний сайт без сервера, бази даних чи облікових записів. Посилання через `#` працюють на GitHub Pages без правил перенаправлення. Усі коментарі в коді — англійською. Додаючи матеріал, заповнюйте обидві мови, перевіряйте першоджерела та запускайте валідатор.

**EN:** A static application without a backend, database or accounts. Fragment links work on GitHub Pages without server rewrite rules. All code comments are in English. When adding material, provide both languages, verify primary references and run the validator.

## Публікація / Publishing

**UA:** Push у `main` запускає збірку та публікацію через GitHub Actions. У Pages мають бути вибрані GitHub Actions і домен `workbench.defencore.com`; DNS CNAME — `workbench → defencore.github.io`. Сам файл `CNAME` не налаштовує домен для публікації через Actions.

**EN:** A push to `main` builds and publishes through GitHub Actions. Pages must use GitHub Actions with custom domain `workbench.defencore.com`; the DNS CNAME is `workbench → defencore.github.io`. A `CNAME` file alone does not configure the custom domain for Actions-based publishing.

See / Докладніше: [DEPLOYMENT.md](DEPLOYMENT.md).

## Оновлення моделей / Updating CAD assets

Export project data as JSON, then run `scripts/export-project-cad.py` with an existing FreeCAD Python environment and `--input` / `--output public/models`. The exporter uses pure Part solids, opens no GUI document, writes geometry-hashed filenames and verifies native STEP round trips. Commit the updated manifest and files together. `npm run check` rejects stale geometry hashes, revisions or missing models. This verifies digital geometry, not machining feasibility or physical acceptance.
