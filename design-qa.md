# TRADR — design QA

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
