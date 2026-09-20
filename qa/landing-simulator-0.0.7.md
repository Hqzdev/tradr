# Landing simulator — 0.0.7 QA

## Scope

- Interactive educational budget, stock and agent selection.
- Buy, sell and wait outcomes with whole-share quantity, explanation and educational probability.
- Eighteen unique instruments across NASDAQ and NYSE with local logo assets.
- Desktop orb hover/focus reliability, responsive layout and modal stock search.

## Browser evidence

- Runtime: `http://localhost:3010/` in the Codex in-app Browser.
- Desktop viewport: `1117 × 896`; all `18` orb links resolve to `display: block`.
- Mobile viewport: `390 × 844`; heading, simulator, disclaimer and supporting copy fit without horizontal overflow.
- Mobile selector fills the viewport, traps page scrolling, focuses search, scrolls its own 18-item list and closes with Escape/backdrop/close.
- Search `XOM` produced one result; selecting it updated the ticker, NYSE metadata and local logo.
- XOM + `$500` + cautious produced `Ждать`, `Без сделки`, `72%`.
- INTC + `$500` + aggressive produced `Продать`, `18 шт.`, `67%`.
- Empty, malformed, too-small and greater-than-`$1,000,000` budgets are rejected by the tested decision engine.
- Keyboard focus on TSLA pauses motion, removes blur, renders rings and exposes `TSLA ▼ 0,62%`.
- Keyboard focus on edge-positioned XOM keeps its label at `931–1003px` inside the `1117px` viewport.
- Browser console warnings/errors in the final checked state: `0`.

## Implementation verification

- `npm test`: passed, `10` tests.
- `npm run build`: passed, `41` routes generated.
- `./mvnw -Dtest=SyntheticMarketDataProviderTest test`: passed, `2` tests.
- Full Maven suite: the changed provider tests pass; the application-context test remains blocked by the local non-JDBC `DATABASE_URL` configuration.

## Findings fixed during QA

1. The selector was initially constrained by the transformed intro card. It now renders through a body portal and covers the full viewport.
2. An invalid budget initially retained the previous stock decision. Input, stock and agent changes now clear stale output.
3. Background-tab pausing could freeze intro elements before they became visible. Only looping animations are now paused when the page is inactive.
4. Desktop breakpoints initially hid three instruments at the QA width. All 18 unique orbs now remain visible above the tablet breakpoint.

Final result: passed.

## Dense orb field follow-up — 0.0.8

- Desktop `1117 × 896`: `30` из `30` сфер видимы, размеры `60–112px`, спокойное состояние использует `8px` blur и opacity `.42`.
- Центральная карточка не пересекается ни с одной сферой, поэтому все desktop hover/focus-зоны доступны.
- Tablet `820 × 900`: видимы `18` сфер; mobile `390 × 844`: видимы `8` декоративных сфер.
- На всех трёх проверенных ширинах `scrollWidth === clientWidth`; горизонтального overflow нет.
- Мобильный симулятор, заголовок и поясняющий текст сохраняют читаемость поверх размытого фонового поля.

Final result: passed.
