# TRADR — design QA

## Faster agent economy — 0.0.13

- New registrations default the first agent to `$75,000`; the existing account migration preserves reserve + wallet capital while topping up the oldest active agent where funds are available.
- Careful/random strategies can hold four positions at 20% of total wallet value each; aggressive can hold five at 17%, keeping target deployment at 80–85%.
- Accelerated mode processes four internal market steps per visible 2.6-second tick. Normal accounts still evaluate only once per 23 visible ticks.
- Cooldown is 10 simulation steps. Take-profit, stop-loss, commissions, maximum holding time and loss possibility remain enabled.
- Frontend tests: 17 passed. TypeScript: passed. Backend tests including application context and Flyway V15: 24 passed.

final result: passed

---

## Auth onboarding — approved direction 2 — 0.0.11

### Evidence

- Selected visual source: `/Users/yaroslavfairfieldd/.codex/generated_images/01a0be07-7670-7ce0-b993-708e1ac78ec9/exec-45830958-0187-4565-b404-4674a5b6030e.png`.
- Browser-rendered implementation: `http://localhost:3010/register` and `http://localhost:3010/login`, checked in the Codex in-app Browser.
- Desktop settled state and the final agent step were visually compared with the selected direction. Mobile was checked with an exact `390 × 844` viewport override.
- The in-app Browser emitted the source/runtime images inline but did not expose a persistent runtime screenshot file path.

### Comparison and interaction checks

- The implementation preserves the approved centered `560px` card, white layered surfaces, slim brand header, three-step progress, compact strategy cards, large `$25 000` budget rail, account summary and magenta action hierarchy.
- Eight real local stock-logo spheres create the desktop atmosphere; breakpoint rules reduce them to four and two while retaining a protected, clickable central surface.
- Profile, security and agent steps animate horizontally by `18px`; card entry uses the specified `24px` rise, `8px` blur and `480ms` easing. Reduced motion removes continuous and spatial motion.
- Empty, invalid and boundary values show inline errors. Password visibility, live checklist, editable agent name, all three strategies, five budget presets, Back navigation and safe `next` behavior are present.
- At `390 × 844`, the first step fits cleanly; the final step is vertically scrollable and reports `scrollWidth === innerWidth === 390` with no horizontal overflow.
- Login and register runtime console checks returned `0` errors.

### Verification and findings

- Frontend tests: `17` passed, `0` failed.
- Backend non-context suite: `18` passed, `0` failed. The separate existing `contextLoads` smoke test remains environment-bound and rejects the current non-JDBC `DATABASE_URL` before application startup.
- Production frontend build: passed; `48` routes generated.
- Backend compilation: passed.
- No open P0–P3 findings remain for the authentication and first-agent onboarding scope.

final result: passed

---

## Agent-first dashboard and autonomous trading — 0.0.12

### Product flow

- A new local QA account opened directly on `/dashboard` after login with `$100,000` total capital, `$75,000` reserve, `$25,000` assigned to its paused first agent, and an explicit `Запустить агента` action.
- One click changed the agent to active. The live feed reported analysis, then autonomous AAPL and AMD purchases, and later an AAPL take-profit sale.
- Total wealth and agent P&L updated from `$100,000 / $0` to positive live values without any manual order controls.
- Navigation contains only `Обзор / Агенты / Активность / Рынок`; `/terminal`, `/portfolio`, and `/orders` redirect to read-only destinations.

### Responsive and accessibility checks

- `1440 × 900`: dashboard content and two-column control area fit without horizontal overflow.
- `820 × 900`: responsive layout fits without horizontal overflow.
- `390 × 844`: cards stack, the primary action remains reachable, and `documentElement.scrollWidth` equals `390px`.
- The start/pause action, speed switch, goal editor, sidebar navigation and agent links are exposed in the accessibility tree with descriptive labels.

### Technical verification

- Frontend unit tests: 17 passed.
- Frontend production build: passed; 49 routes generated. Font optimization emitted only the existing offline Google Fonts warning.
- Backend tests: 25 passed against local PostgreSQL.
- Flyway migrations V13 and V14 applied successfully and Hibernate schema validation passed.
- Fresh browser tab: meaningful content rendered, no framework overlay, browser console errors: 0.
- Full autonomous buy/sell cycle verified in the browser with agent-attributed activity.

final result: passed

---

## Marketing footer pages — Careers ecosystem — 0.0.10

### Evidence

- Source visual truth: `https://careers.uniswap.org`, `https://www.uniswapfoundation.org/governance`, `https://developers.uniswap.org/docs`, `https://support.uniswap.org/hc/en-us`, the source contact form, and the source support legal article. The source pages were captured in the Codex in-app Browser.
- Browser-rendered implementation: `http://localhost:3011/careers`, `/governance`, `/developers`, `/help`, `/contact`, and `/privacy`. The in-app Browser emitted the comparison screenshots inline and did not expose persistent screenshot file paths.
- Desktop normalization: source and implementation `1440 × 1024` pixels, `1440 × 1024` CSS pixels, DPR `1`.
- Mobile normalization: source and implementation `390 × 844` pixels, `390 × 844` CSS pixels, DPR `1`.
- State: public page top, settled animation state, empty support search, default open careers department, light theme except the intentionally dark developer page.
- Source and implementation screenshots were emitted together in the same comparison inputs for careers, governance, developers, help, and legal layouts. Contact uses the captured source form structure plus the visually verified Help support shell because a later source revisit presented Cloudflare verification; no challenge was bypassed.
- Intentional scope: Russian TRADR copy and local TRADR assets replace source branding and editorial imagery. Blog and trademark pages are excluded by request.

### Full-view comparison

- Fonts and typography: the pages use the project Inter stack for interface/editorial copy; governance uses a restrained Georgia serif display treatment. Desktop display sizes, compact support copy, dark documentation hierarchy, mobile wrapping, weights, line heights, and tracking preserve the reference hierarchy without clipping.
- Spacing and layout rhythm: the careers hero/canvas, governance editorial hero, developer sidebar/grid, support rail/cards, contact form, and legal article reproduce the reference page structures. All six routes report `scrollWidth === clientWidth` at `1440px` and `390px`.
- Colors and tokens: white and `#fafafa` surfaces, `#f50fb4` accent, pale pink support panels, dark navy CTA surfaces, and the near-black developer palette consistently map the reference language into TRADR branding.
- Image quality and assets: local `128 × 128` stock PNGs and project icons render sharply at their intended sizes. White stock marks receive a deterministic black treatment on light circles. No Uniswap logo, character, photograph, copy, or hotlink is present; this is an explicit product constraint, not an unresolved asset placeholder.
- Copy and content: every heading, card, role, guide, help article, form label, and privacy section is standalone Russian TRADR content. Legal copy clearly describes the educational product and does not claim to be legal advice.

### Focused regions and interactions

- Focused top-of-page comparisons covered the careers heading/team canvas, governance title/intro, developer hero/command card/guides, help hero/topic cards/search, and legal title/sidebar. Separate crops were unnecessary because these regions were readable at native `1×` viewport captures.
- Careers: mobile menu opens; the default department is expanded and can be collapsed; anchor CTA and role links are keyboard-reachable.
- Help: typing `агенты` reduces the FAQ grid from eight to two matching articles and exposes the clear action.
- Contact: required fields, email validation, consent checkbox, and the local success state were exercised. The page explicitly sends no data.
- Developer page: the install command remains selectable and the copy control uses Clipboard API with a legacy fallback where the browser permits clipboard access.
- Responsive and accessibility: heading order, labels, alt behavior, semantic links/buttons, visible focus styles, practical mobile tap targets, and `prefers-reduced-motion` overrides were reviewed. Motion is removed for careers words, floating marks, and governance marks under reduced motion.
- Browser console after a clean preview restart: `0` local errors across all six routes.

### Findings and comparison history

1. Initial desktop governance comparison found a [P2] collision between `TRADR` and `управление`. The title grid was changed to `max-content/minmax(0,1fr)`, given a responsive column gap, and reduced to a `116px` ceiling. Post-fix evidence shows two clearly separated title blocks with no overflow.
2. Initial mobile privacy comparison found a [P2] long-word clip in `конфиденциальности`. The mobile legal heading now uses `overflow-wrap: anywhere` and a `40px` scale. Post-fix evidence keeps the entire title inside the `390px` viewport.
3. Initial careers asset comparison found a [P2] set of white stock logos disappearing into white circular surfaces. The team marks were switched to local PNG assets and normalized with `brightness(0)`. Post-fix desktop evidence shows five distinct, sharp marks.
4. Post-fix desktop and mobile comparisons show no open P0, P1, or P2 findings. No P3 polish item is required for handoff.

### Verification

- Frontend tests: `10` passed, `0` failed.
- TypeScript: `npx tsc --noEmit --incremental false` passed.
- Production build: passed; `48` routes generated, including all six new static marketing routes.
- `git diff --check`: passed.

final result: passed

---

## About page — About Uniswap adaptation — 0.0.9

### Evidence

- Source visual truth: `https://about.uniswap.org`, captured in the Codex in-app Browser at `1440 × 1024` and `390 × 844` CSS pixels, DPR `1`.
- Browser-rendered implementation: `http://localhost:3011/about`, captured at the same `1440 × 1024` and `390 × 844` CSS viewports, DPR `1`.
- Source and implementation were emitted together in the same desktop and mobile comparison inputs. The in-app Browser did not expose persistent screenshot file paths.
- Settled state: page top, light theme, no authentication. Intentional deviation: the reference hero photograph is omitted and its layout slot is collapsed, as requested.

### Full-view comparison

- Typography: Inter drives the interface, with a `90px` desktop hero and a compact mobile scale; Georgia italic is limited to editorial emphasis.
- Layout: the desktop page uses a centered `1290px` shell and 12-column composition; mobile becomes a single column with a horizontal scroll-snap feature rail.
- Color: primary `#131416`, accent `#f50fb4`, neutral `#fafafa`, and CTA surface `#fef5ff` match the approved reference system.
- Assets: all editorial previews and stock marks are local TRADR assets. No Uniswap logo, photograph, copy, or hotlinked dependency is present.
- Content: the Russian hierarchy remains coherent from project story through financial literacy, capabilities, materials, and the final learning CTA.

### Focused interaction checks

- Sticky header changes state after scrolling; desktop anchor navigation lands below the header (`#materials` measured at approximately `107px` with a `68px` header).
- Hero words enter sequentially; content reveals on scroll; card artwork scales on hover; the mobile feature rail swipes and snaps correctly.
- The final stock-logo composition changes groups cyclically (`AMZN/GOOGL/META/AMD` to `NFLX/JPM/KO/V`) and pauses while the document is hidden.
- Keyboard focus is visible: the header CTA reports a `2px` solid `#f50fb4` outline with a `4px` offset.
- `prefers-reduced-motion` removes transforms, smooth scrolling, reveal transitions, and the cyclic CTA animation.
- No horizontal overflow: `scrollWidth === clientWidth` at both `1440px` and `390px`.
- Browser console: `0` errors and `0` warnings in the checked implementation state.

### Findings and comparison history

1. Initial reference comparison found a [P2] oversized blank area below the hero after removing the source photograph.
2. The hero minimum height, bottom padding, and following section spacing were reduced so content starts immediately without a phantom media container.
3. Post-fix desktop evidence places the first content section at approximately `y=306px` and its label at `y=378px`; on mobile, the hero bottom and history top meet at approximately `y=230px`.
4. A runtime pass also removed the browser-default body margin, consolidated scroll work into one listener, and restored reliable reveal activation.
5. Final desktop and mobile comparisons show no open P0, P1, or P2 findings. The source flower/avatar decoration is intentionally replaced by animated stock marks from the approved TRADR content model.

final result: passed

---

## Evidence

- Source visual truth: `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-e79b26e1-3f42-469c-a664-bac37e98e189.png`
- Source pixels: `4832 × 2576`, including browser chrome and an approximately `2300 CSS px` wide page viewport at Retina density.
- Browser-rendered implementation: `/Users/yaroslavfairfieldd/Desktop/tradr/qa/docs-desktop-current.png`
- Implementation pixels and CSS viewport: `1117 × 897`, density `1x`, Codex in-app Browser.
- Route and state: `/docs/team-workflow`, light theme, page top, help closed, search empty.
- Density normalization: not applied because the available implementation viewport does not match the wide reference viewport.

## Full-view comparison

The available desktop capture confirms the intended hierarchy: a two-level sticky header, independent left navigation, compact centered article, rounded TRADR controls, pale-magenta active states, and a floating help action. At `1117 × 897`, the wide global navigation and right table of contents correctly collapse, so this capture cannot validate their reference-positioned desktop state.

## Focused comparison

- Header: first and second navigation levels are visually separate; search and CTA no longer collide at medium width.
- Article: title scale, vertical rhythm, section numbering, lists, file tables, notes, and light code surfaces match the density of the reference while retaining TRADR tokens.
- Left navigation: fixed rail, compact group labels, and rounded active row match the reference structure.
- Assets: the supplied TRADR mark is used; visible icons come from Hugeicons. No reference branding or imagery was copied.

## Interaction checks

- Search returns Russian documentation results for `миграции`.
- `⌘K` focuses the documentation search.
- The help control opens a labelled dialog and its “Найти ответ” action focuses search.
- All 12 documentation routes were generated successfully by the production build.
- Browser console: no errors in the checked desktop state.

## Findings

- [P2] Exact breakpoint captures are unavailable.
  - Location: responsive documentation shell.
  - Evidence: the in-app Browser exposes a fixed `1117 × 897` viewport and rejected the isolated `390 × 844` preview for browser-security reasons.
  - Impact: the required `1920 × 1080`, `1440 × 900`, `1024 × 768`, and `390 × 844` visual comparisons cannot be asserted from browser-rendered evidence.
  - Fix: capture those four sizes with an explicitly approved viewport-capable browser runner, then compare the wide desktop state and mobile drawer against the source.

## Comparison history

1. Initial desktop capture: global navigation collided with the search area at medium width.
2. Fix: global navigation now collapses below `1280px`; search and CTA remain aligned.
3. Post-fix evidence: `qa/docs-desktop-current.png` shows a clean two-level header and independent content rail at `1117 × 897`.
4. Readability pass: article copy, navigation, metadata, tables, code, notes, right-side contents and mobile headings were increased by roughly `15–25%`; the updated capture preserves the same column geometry without clipping or crowding.

## Follow-up polish

- No P3 items recorded before the missing breakpoint captures are completed.

previous result (documentation scope): blocked

---

## Interactive hero and instrument page — 0.0.4

### Evidence

- Hero reference: `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-7632a7a8-096b-4f45-898f-b3df9db9e3be.png`.
- Browser implementation: `http://localhost:3000/`, default Codex in-app Browser viewport `1280 × 720`.
- Instrument implementation: `http://localhost:3000/market/AAPL`, authenticated local QA account, real synthetic backend data.
- Responsive states: exact browser viewport overrides `820 × 900` and `390 × 844`.

### Reference comparison

- Calm state reproduces the reference geometry: white field, softly blurred colored instruments around a centered headline and ticket, with clear central whitespace.
- Keyboard focus (same visual state as hover) stops the active orb, removes blur, scales the logo, draws three concentric rings, and reveals the ticker plus positive/negative percent.
- Focused TSLA was repositioned after comparison so its rings and label do not cover the hero headline or central ticket.
- The asset page keeps the TRADR sidebar while following the reference composition: sticky instrument header, large chart on the left, sticky trading card on the right, metrics/about/activity below.

### Responsive checks

- `1280 × 720`: 18 visible orbs; chart and trading panel form a two-column desktop composition.
- `820 × 900`: 12 visible orbs; hero remains centered with no horizontal overflow.
- `390 × 844`: 6 visible orbs; `documentElement.scrollWidth === clientWidth === 390`; chart stays readable and the trading form stacks beneath it.
- `prefers-reduced-motion` disables floating animation.

### Interaction and data checks

- All orbs are labelled links and keyboard reachable; touch/click navigates directly to the canonical ticker route.
- Anonymous AAPL navigation resolves to `/login?next=%2Fmarket%2FAAPL`; login returns to AAPL.
- External `next=https://evil.example` is reduced to the internal `/market` fallback and is preserved safely between login and registration.
- Real backend candles load for `1м / 5м / 15м / 1ч / 1Д`; line/candle controls and price/volume tooltip are present.
- Market buy and market sell both returned “Сделка исполнена”; balance, position, metrics, candles and trades refreshed.
- A buy limit below market returned “Заявка выставлена”.
- An oversized market buy returned the Russian insufficient-funds error and retained the entered value.
- Unknown ticker `/market/XXXX` renders the dedicated 404 with a market return link.

### Verification

- Frontend production build: passed (40 routes generated).
- Backend suite with local Postgres: passed (`10` tests, `0` failures, `0` errors), including all `7` order calculation tests.
- Browser console in final checked states: no new application errors.

### Findings

- No open P1–P3 findings for the 0.0.4 hero, auth-return, instrument detail, trading, or responsive scope.

final result: passed

---

## Dense hero stock field — 0.0.8

### Evidence

- Source composition: supplied Uniswap desktop reference with softly blurred peripheral spheres and a clear central interaction corridor.
- Runtime implementation: `http://localhost:3010/`, checked at `1117 × 896`, `820 × 900` and `390 × 844`.
- The Product Design workflow guided the breakpoint-specific density and the protected central interaction zone rather than applying one crowded layout at every width.

### Comparison and verification

- Desktop now renders `30` spheres at `60–112px` with `8px` blur and `.42` resting opacity; the source's soft peripheral depth is preserved while the user's requested density is increased.
- Tablet renders `18` spheres and mobile renders `8`, retaining visual atmosphere without obscuring the simulator.
- Automated geometry inspection found `0` intersections between desktop spheres and the simulator card after the final position correction.
- All tested viewports have `scrollWidth === clientWidth`; no horizontal overflow was introduced.
- The existing hover/focus reveal, motion pause, rings and reduced-motion behavior remain attached to the same orb component.

### Findings

- The first dense pass placed five moving sphere bounds partly beneath the simulator. Positions were corrected and the central safe zone now has zero intersections.
- No open P0–P3 findings remain for the 0.0.8 dense-orb scope.

final result: passed

---

## Interactive landing simulator — 0.0.7

### Evidence

- Live layout/motion reference: `https://app.uniswap.org/?lng=ru-RU`.
- Browser-rendered implementation: `http://localhost:3010/` at `1117 × 896` and `390 × 844`.
- Detailed interaction measurements: `qa/landing-simulator-0.0.7.md`.

### Comparison and interaction checks

- The centered two-surface card keeps the reference's soft border, pale secondary panel, blur-to-focus orbs, rings, intro rise and restrained state transitions while using TRADR copy and controls.
- Stock search exposes all 18 unique instruments; local logos, ticker, company, price and NASDAQ/NYSE metadata render in a viewport-level modal.
- Budget validation and buy/sell/wait results were exercised; changing any input clears stale output.
- All 18 desktop orbs are keyboard reachable. Focus pauses movement, removes blur, reveals rings and keeps edge labels inside the viewport.
- Mobile keeps the complete simulator inside `390px`; its selector becomes a full-height bottom surface with internal scrolling.
- Browser console errors: `0`.

### Verification

- Frontend tests: `10` passed.
- Frontend production build: passed, `41` routes.
- Targeted backend provider tests: `2` passed.

### Findings

- No open P0–P3 findings for the 0.0.7 simulator, stock catalog, local assets or responsive interaction scope.

final result: passed

---

## Landing typography — 0.0.6

### Evidence

- Source visual truth: the user-provided Basel typography specification and `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-fb3599b2-0a93-40f0-aa20-9cebab440d56.png`.
- Live motion/layout reference: `https://app.uniswap.org/?lng=ru-RU`.
- Browser-rendered implementation: `http://localhost:3010/`, captured in the Codex in-app Browser at `1440 × 900` and `390 × 844`, density `1x`. The browser displayed both runtime captures but did not expose a local export path.
- State: public landing, settled hero, light theme.

### Full-view comparison

- Desktop uses a balanced two-line display heading, centered ticket, compact navigation and unchanged hero proportions; `documentElement.scrollWidth === clientWidth === 1440`.
- Mobile retains the compact header, four-line balanced heading, complete ticket, body copy and scroll cue inside the `390px` viewport without horizontal overflow.
- The typography change does not alter colors, imagery, icons, card radii or the existing Uniswap-derived motion system.

### Focused typography comparison

- Every landing text surface resolves to `Inter` through `--font-basel`; `document.fonts.check` passed for weights `400`, `485` and `535`.
- Desktop hero: `59.04px / 57.86px`, weight `485`, tracking `-1.1808px` (`-0.02em`).
- Desktop navigation: `13px / 19.5px`, weight `500`, tracking `-0.26px` (`-0.02em`).
- Desktop ticket value: `36px / 36px`, weight `485`, tracking `-0.72px` (`-0.02em`).
- Mobile label: `13px`, weight `400`, tracking `-0.26px`; mobile ticket value: `24px`, weight `485`, tracking `-0.48px`.
- No separate focused image crop was needed because the browser computed styles directly verify family, weight, size, line height and tracking while the full runtime captures verify wrapping and rhythm.

### Comparison history

1. First desktop pass found the new `64px` ceiling plus the looser `-0.02em` tracking could clip the one-line hero heading on the right.
2. Fix: constrained the heading to `1040px` and enabled balanced wrapping, matching the two-line reference composition.
3. First computed-style pass found inherited tracking was fixed at the parent’s `16px` calculation on smaller labels.
4. Fix: applied the `-0.02em` token to every landing descendant so each size computes its own correct pixel value.
5. Post-fix desktop and mobile captures show no clipping or overflow; browser console errors: `0`.

### Required fidelity surfaces

- Fonts and typography: passed; one family, only weights `400 / 485 / 500 / 535`, responsive display line heights and size-relative `-0.02em` tracking.
- Spacing and layout rhythm: passed; the heading wrap correction preserves the centered hero and ticket spacing.
- Colors and visual tokens: unchanged from the verified 0.0.5 landing.
- Image quality and asset fidelity: unchanged; existing local logo assets remain intact.
- Copy and content: unchanged.

### Verification

- Production build: passed, 41 static/dynamic routes generated.
- The isolated build warned that Google Fonts could not be downloaded for optimization; the browser runtime loaded all requested Inter weights successfully.
- `git diff --check`: passed.

### Findings

- No open P0–P3 findings for the 0.0.6 landing typography scope.

final result: passed

---

## Documentation secondary navigation removal — 2026-09-19

### Evidence

- Removal reference: `/var/folders/yb/rjltyvqj4r53lq1zg_s081fc0000gn/T/codex-clipboard-4ba74fd8-84a4-43f1-ba46-229f14b3434c.png`.
- Browser implementation: `qa/docs-without-secondary-nav.png`, route `/docs/team-workflow`, `1117 × 720` viewport.

### Comparison

- The complete «Обзор / Репозиторий / Интерфейс / Сервер / Процессы» row and its divider are absent.
- The article, fixed left navigation and sticky offsets begin directly below the remaining primary header; no empty `44px` band remains.
- Search, primary CTA, left documentation navigation and floating help remain visible and unchanged.

### Verification

- Browser accessibility tree contains no secondary navigation links.
- No visible clipping, overlap or orphaned spacing in the checked desktop state.
- TypeScript and whitespace checks passed.

final result: passed

---

## Full Uniswap motion transfer — 0.0.5

### Evidence

- Live reference inspected at `https://app.uniswap.org/?intro=true`; TRADR keeps its own copy, colors, local logos and destinations.
- Runtime implementation inspected at `http://localhost:3010/` in the Codex in-app Browser.
- Frame-by-frame measurements and responsive results: `qa/landing-motion-0.0.5.md`.
- Browser screenshots were captured for intro-start, settled desktop, focused TSLA, `1440 × 900`, `1280 × 720`, `834 × 1112`, `390 × 844`, the open mobile menu and the metrics/product sections. Browser security policy blocked exporting those runtime captures as local PNGs, so the QA manifest records the measured evidence without substituting fabricated images.

### Motion comparison

- The three heading segments use the measured `100px` rise, `1s` duration, source easing and `0/100/200ms` delays. Body, ticket and scroll cue follow at `300/400/2000ms`.
- The calm orb state uses approximately `6px` blur and `.5` opacity. Each orb has an independent five-second vertical float and an `11–15s` counter-rotation.
- Keyboard focus was checked for both signs: TSLA exposes `▼ 0,62%`, AAPL exposes `▲ 1,84%`; movement pauses, blur reaches zero, the core reaches `scale(1.2) rotate(-7deg)`, and two rings settle at scales `1.2/1.4` with opacity `.3/.1`.
- Digit rollers start on the first statistics intersection and keep their final values. Repeating card previews, hero decoration and the statistics pulse pause outside the viewport; all cycles also pause with the document visibility state.
- Card and resource interactions no longer lift whole surfaces. CTAs and rows use the requested opacity/easing behavior.

### Responsive checks

- `2048 × 1092`: 18 orbs, settled hero and cue visible, no horizontal overflow.
- `1440 × 900`: 13 orbs, no horizontal overflow.
- `1280 × 720`: 11 orbs, no horizontal overflow.
- `834 × 1112`: orbit field hidden; mobile header active; no horizontal overflow.
- `390 × 844`: orbit field hidden; hero/ticket remain inside `18px` side margins; no horizontal overflow.
- Mobile menu: backdrop reaches opacity `1`, panel reaches its final transform after `200ms`, Escape closes it, restores body scrolling and removes all links from the tab order while hidden.

### Accessibility and technical checks

- Orb links retain descriptive Russian `aria-label` values and keyboard focus parity with hover.
- `prefers-reduced-motion` has explicit final-state rules for intro, orbs, metrics, previews and safety artwork; automatic agent rotation is disabled by the shared media-query hook.
- Production build: passed, including type checking and all 40 generated routes. The isolated build environment only warned that Google Fonts could not be downloaded for optimization.
- Browser console errors in the final checked session: `0`.
- `git diff --check`: passed.

### Findings

- No open P1–P3 findings for the 0.0.5 public-landing motion scope.

final result: passed
