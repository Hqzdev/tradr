# Design QA — TRADR landing

## Comparison target

- Source visual truth:
  - hero: `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-038ce7af-767c-470a-9880-2a8fe9e4139f.png` — 4832×2576 px;
  - overview and metrics: `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-2ee37cd1-76f3-4a5b-9d1a-620ad4764991.png` — 4700×2444 px;
  - product grid: `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-0b643bac-304e-479b-8abd-4a810f38f488.png` and `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-d69b97d8-c601-482f-b405-3852cb33f5b7.png` — 4700×2444 px;
  - resources and footer: `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-e858c53f-43d6-470e-aec1-d62301e58cc2.png` — 4700×2444 px.
- Browser-rendered implementation evidence:
  - `/private/tmp/tradr-landing-reference-viewport.png`;
  - `/private/tmp/tradr-landing-about.png`;
  - `/private/tmp/tradr-landing-products.png`;
  - `/private/tmp/tradr-landing-footer.png`;
  - normalized hero comparison: `/private/tmp/tradr-landing-comparison.png`.
- Desktop comparison viewport: 1536×720 CSS px, device scale 1.
- Mobile verification viewport: 390×844 CSS px, device scale 1.
- Source browser chrome was excluded from layout judgment. The hero source page area was cropped and scaled to 1536×720 before the side-by-side comparison.
- State: public unauthenticated landing page, light theme, completed entrance animations.

## Full-view comparison

- The implementation now follows the reference sequence: sticky compact navigation, viewport-height centered hero, asymmetric narrative/metrics section, six tall cards in a 2×3 grid, four resource rows, and the split footer.
- Hero content uses the same center axis, compact two-panel widget, soft CTA, supporting caption, bottom scroll cue, and edge-weighted blurred objects.
- Product content and imagery are original TRADR interfaces while preserving the reference card proportions, padding, pastel zoning, and visual density.

## Required fidelity surfaces

- Typography: Inter is used throughout with tight tracking and intermediate display weights. Display, body, UI, and metric scales reproduce the source hierarchy without cramped desktop copy.
- Spacing and rhythm: desktop max width is 1120px; stats are 2×2; cards are two columns with 14px gutters and tall portrait-like proportions. Mobile collapses to one column.
- Colors and tokens: white canvas, near-black text, subtle grey borders, magenta actions, one green active metric, and the same blue/pink/violet/mint/orange/magenta card progression.
- Image and icon quality: third-party marks are absent. TRADR's existing mark and Hugeicons provide the product imagery; blurred hero objects remain deliberately defocused like the source.
- Copy and content: all labels, metrics, cards, routes, resources, and disclaimers describe TRADR rather than Uniswap.
- Interaction: the hero agent changes automatically and from its button; navigation, CTA links, anchors, and mobile menu are functional.
- Accessibility: semantic headings, labeled controls, visible focus, keyboard-operable links/buttons, practical mobile targets, and reduced-motion behavior are present.

## Comparison history

### Iteration 3 — navigation correction

- Removed the temporary vertical public sidebar after the follow-up direction.
- Restored a horizontal desktop header with the TRADR mark, four landing anchors, login, and registration CTA.
- Removed Market, Terminal, Portfolio, and Agents from both desktop and mobile public navigation; the application routes themselves remain intact.
- Verified scroll-aware active states for `#hero`, `#about`, `#products`, and `#resources`, including the compact mobile menu at 390×844.

### Iteration 4 — centered header capsule

- Consolidated the logo, landing anchors, login, and registration CTA into one centered floating capsule.
- Removed the visible `TRADR` wordmark from desktop and mobile navigation while preserving the accessible logo label.
- Verified the 390×844 capsule with logo, login, registration CTA, and menu control on one row without overflow.

### Iteration 1

- [P1] The previous implementation used an original split-dashboard hero rather than the centered reference composition.
- [P1] The product area contained three asymmetrical cards rather than the source's six-card 2×3 grid.
- Fix: rebuilt the page around the supplied screenshots and replaced the hero, metrics, product grid, resources, and footer composition.

### Iteration 2

- [P2] Product cards were too short, causing the market preview to overlap the CTA.
- [P2] Anchor captures placed section headings too close to the sticky navigation.
- Fix: increased desktop card height to 620px and mobile card height to 700px; added sticky-header scroll margins and section top spacing.
- Post-fix evidence: `/private/tmp/tradr-landing-products.png` and the 390×844 browser capture show separated copy/preview zones and no horizontal overflow.

## Final checks

- Production build and TypeScript validation pass after the horizontal-header update.
- Desktop hero, metrics, six cards, resources, and footer inspected in the in-app browser.
- Centered capsule header inspected at rest and while scrolled; anchor highlighting follows the visible section.
- Mobile hero, open menu, first product card, and document geometry inspected at 390×844.
- Mobile document width equals the 390px viewport; no horizontal overflow.
- Agent-switch interaction updates decision, confidence, and action content.
- Browser console: no warnings or errors.
- Remaining P0/P1/P2 findings: none.
- P3: Russian hero copy is longer than the English source, so its line length differs while retaining the source font scale and center axis.

final result: passed

---

# Design QA — рабочие страницы документации

## Проверенный результат

- Реализован маршрут `/docs` и 11 связанных подразделов в `apps/web`.
- Источник визуального направления: предоставленная светлая система с белым холстом, Inter, near-black типографикой, magenta-акцентом, тонкими границами, pill-поиском и радиусами 16–20px.
- Desktop проверен в Codex in-app browser: фиксированный header, левое содержание, центральная статья и правое оглавление не перекрываются.
- Mobile проверен при 390×844: ширина документа и viewport совпадают (`390px`), горизонтальный скролл отсутствует.
- Поиск `JwtService` находит файл, показывает русское объяснение и открывает `/docs/backend-auth`.
- Внутренняя страница авторизации проверена визуально: активный пункт, заголовок, таблица файлов и оглавление отображаются корректно.
- Консоль браузера: ошибок и предупреждений нет.
- `npm run build`: успешно; сгенерировано 12 статических docs-страниц. Предупреждение оптимизатора Google Fonts связано с недоступностью внешней таблицы стилей во время сборки и не ломает интерфейс.
- Все пользовательские заголовки и навигационные группы написаны по-русски; английский оставлен только в именах файлов, технологий и API-терминах.

## Содержание

- Обзор и запуск.
- Карта репозитория.
- Маршруты, компоненты и данные frontend.
- Архитектура, авторизация, рынок, торговля и агенты backend.
- Миграции, тесты и технические документы.
- Командные правила и критерии готовности задачи простыми словами.

final result: passed

---

# Design QA — TRADR documentation screens

## Scope

- Pencil source: `design/design.pen`.
- Reference: `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-5c1dd73f-7fbe-4ac5-8c19-bc2b9341e0e5.png`.
- Four 1440×1024 screens are placed in a 2×2 block beside the existing product screens:
  - `Docs 01 — Обзор` at 47310×0;
  - `Docs 02 — Инфраструктура` at 48910×0;
  - `Docs 03 — Функции и API` at 47310×1184;
  - `Docs 04 — Код и задачи` at 48910×1184.

## Visual and content checks

- Shared documentation shell is consistent across all screens: compact global header, grouped left navigation, wide article column, and right in-page table of contents.
- TRADR styling is preserved through Inter typography, near-black text, white surfaces, subtle borders, magenta active states, and restrained violet, green, blue, and orange semantic accents.
- Overview includes audience guidance, four-step setup, executable command block, repository map, and a clear next-section link.
- Infrastructure includes an explicit service/data-flow diagram, service contract table, environment states, owners, and a boundary rule.
- Functions/API includes base URL and authentication state, endpoint registry, stability labels, request/response controls, and a JSON example.
- Code/tasks includes engineering principles, change workflow, Definition of Done, and a three-column task board with priorities and owners.
- Typography and vertical rhythm were checked at fit-to-frame zoom in Pencil. Long titles were shortened after inspection to prevent lead-text overlap.
- All four frames were reopened from disk and visually inspected in Pencil after the final write.
- Pencil document parses as valid JSON; no duplicate replacement docs frames remain.

final result: passed
