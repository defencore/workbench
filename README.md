# Workbench by Defencore

**UA:** Практична база знань з металообробки для новачків: безпека, основи, токарні й фрезерні верстати, ЧПУ, матеріали, вимірювання та реверс-інжиніринг. Покрокові інструкції доповнені контрольними пунктами, перевіркою знань, навчальними маршрутами, проєктами деталей та інтерактивними 3D-моделями.

**EN:** A practical machining knowledge base for beginners: safety, fundamentals, turning, milling, CNC, materials, measurement and reverse engineering. Step-by-step lessons include checklists, knowledge checks, learning paths, practice projects and interactive 3D models.

**49 інструкцій · 10 розділів · 6 проєктів · 59 навчальних схем · 41 першоджерело.**

**UA:** Окремі розділи охоплюють введення верстата в експлуатацію, щоденний огляд, змащування, напрямні й люфти, юстування, перевірку геометрії та виставлення інструмента. Інтерактивний підбір порівнює 20 комбінацій операцій і відомих матеріалів; вибрані параметри залишаються в локальній адресі сторінки. Навчальні проєкти мають ортогональні схеми та відповідні 3D-моделі.

**EN:** Dedicated topics cover commissioning, daily inspection, lubrication, slideways and backlash, alignment, geometry verification and tool setting. Interactive tool selection compares 20 operation/material combinations, retaining selections in the local page address. Practice projects include orthographic drawings and matching 3D models.

Production / Публічна адреса: [workbench.defencore.com](https://workbench.defencore.com)

## Використання / Using Workbench

- **UA:** Почніть із безпеки або навчального маршруту. Шукайте інструкції, фільтруйте їх за розділом і складністю. Зберігайте корисні матеріали: вони потрапляють у «Збережене» й піднімаються в рекомендованому порядку. Перемикач UA/EN змінює інтерфейс та зміст уроків.
- **EN:** Start with safety or a learning path. Search guides and filter by topic and difficulty. Save useful materials to find them in Saved and prioritize them in recommended ordering. UA/EN switches both the interface and lesson content.

## Дані та офлайн / Data and offline use

**UA:** Обрані матеріали, мова, прогрес і контрольні пункти зберігаються в `localStorage` поточного браузера. Service worker кешує оболонку та ресурси для офлайн-доступу після завантаження. Зовнішні першоджерела потребують мережі. У налаштуваннях можна очистити саме дані та кеш Workbench; закладки й прогрес після цього втрачаються. Синхронізації між пристроями немає; браузер може видаляти локальні дані.

**EN:** Bookmarks, language, progress and checklist states remain in the current browser's `localStorage`. A service worker caches the application shell and resources for offline access after loading. External references require a connection. Settings can remove Workbench data and caches; doing so loses bookmarks and progress. There is no cross-device sync, and browsers may evict local data.

## Межі навчальних матеріалів / Educational limits

**UA:** Уроки не є допуском до верстата, оцінкою ризику конкретної майстерні або заміною інструкції виробника. Перші налаштування й різання потребують кваліфікованого наставника. Допустимі оберти, режими різання, зусилля кріплення та процедури ізоляції енергії визначаються конкретним обладнанням, оснащенням, матеріалом і місцевими правилами. Розміри навчальних деталей і 3D-моделі ілюстративні. Для відповідальних деталей потрібні окремі інженерні вимоги та приймання. Правила безпеки посилаються на першоджерела CCOHS, OSHA, NIOSH і виробників; ці посилання не означають сертифікації сервісу цими організаціями.

**EN:** Lessons do not authorize machine operation, replace a workshop risk assessment or supersede the manufacturer's manual. Initial setups and cuts require a qualified supervisor. Speeds, cutting conditions, workholding forces and energy-isolation procedures depend on the exact equipment, tooling, material and local rules. Practice dimensions and 3D models are illustrative. Safety-critical parts require separate engineering requirements and acceptance. Safety references link to CCOHS, OSHA, NIOSH and manufacturers; these references do not imply their certification of this service.

## Розробка / Development

Requires / Потрібні: **Node.js 24+**, npm.

```sh
npm ci
npm run dev
```

Verification and production preview / Перевірка та перегляд готової збірки:

```sh
node scripts/validate-content.mjs
npm run typecheck
npm run build
npm run preview
```

The curriculum validator checks both languages, unique IDs, all ten categories, lesson/project references, source URLs, prerequisite cycles, step counts, quiz answers and model names.

Валідатор перевіряє обидві мови, унікальні ID, усі десять розділів, посилання уроків і проєктів, адреси джерел, цикли передумов, кількість кроків, відповіді тестів і назви моделей.

## Архітектура / Architecture

| Location                            | Purpose / Призначення                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/App.tsx`                       | React interface and fragment routing / Інтерфейс React і hash-навігація                                |
| `src/data/content.ts`               | Bilingual lessons, projects and references / Двомовні уроки, проєкти й джерела                         |
| `src/data/preparation.ts`           | Preparation, maintenance and tool-selection lessons / Підготовка, обслуговування та вибір інструментів |
| `src/components/LessonDiagram.tsx`  | Annotated instructional schematics / Навчальні схеми з підписами                                       |
| `src/components/ProjectDrawing.tsx` | Project geometry and dimensions / Види й розміри навчальних деталей                                    |
| `src/components/ToolSelector.tsx`   | Interactive tooling shortlist / Інтерактивний підбір інструмента                                       |
| `src/data/types.ts`                 | Curriculum schema / Структура навчальних матеріалів                                                    |
| `src/data/ui.ts`                    | Interface translations and categories / Переклади інтерфейсу й розділи                                 |
| `src/components/ModelViewer.tsx`    | Procedural Three.js viewer / Інтерактивні моделі Three.js                                              |
| `src/storage.ts`                    | Local preferences and data reset / Локальні налаштування й очищення                                    |
| `scripts/validate-content.mjs`      | Curriculum integrity checks / Перевірка цілісності матеріалів                                          |
| `.github/workflows/deploy.yml`      | Build and GitHub Pages publication / Збірка й публікація                                               |

**UA:** Статичний сайт без сервера, бази даних чи облікових записів. Посилання через `#` працюють на GitHub Pages без правил перенаправлення. Усі коментарі в коді — англійською. Додаючи матеріал, заповнюйте обидві мови, перевіряйте першоджерела та запускайте валідатор.

**EN:** A static application without a backend, database or accounts. Fragment links work on GitHub Pages without server rewrite rules. All code comments are in English. When adding material, provide both languages, verify primary references and run the validator.

## Публікація / Publishing

**UA:** Push у `main` запускає збірку та публікацію через GitHub Actions. У Pages мають бути вибрані GitHub Actions і домен `workbench.defencore.com`; DNS CNAME — `workbench → defencore.github.io`. Сам файл `CNAME` не налаштовує домен для публікації через Actions.

**EN:** A push to `main` builds and publishes through GitHub Actions. Pages must use GitHub Actions with custom domain `workbench.defencore.com`; the DNS CNAME is `workbench → defencore.github.io`. A `CNAME` file alone does not configure the custom domain for Actions-based publishing.

See / Докладніше: [DEPLOYMENT.md](DEPLOYMENT.md).
