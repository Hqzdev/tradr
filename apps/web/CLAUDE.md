# TRADR web — conventions for Claude

## Icon library

Icons come from **Hugeicons only** (`@hugeicons/react` + `@hugeicons/core-free-icons`).

- Do **not** add `lucide-react` or any other icon package. It was removed from this
  project on purpose (2026-09-16) and replaced everywhere — `components/icons.tsx`
  (the shared `Icon*` set used across screens) and `components/Sidebar.tsx` both
  wrap `HugeiconsIcon` from `@hugeicons/react`.
- To add a new icon: find its name in `@hugeicons/core-free-icons` (free tier only —
  don't reach for a paid/pro Hugeicons package), then either add it to the `huge()`
  wrapper table in `components/icons.tsx` (if it's used in more than one place) or
  import it directly where it's used, the same way `Sidebar.tsx` does.
- Exception: `IconLogo` in `components/icons.tsx` embeds the official TRADR mark
  from `public/logo.png`, not a generic icon-set glyph. Keep every branded surface
  tied to that single asset and do not swap it for a Hugeicons icon.

## Design fidelity

`design.pen` (opened via the Pencil/pen.dev MCP tools) is the source of truth for
colors, spacing, typography and component variants — read the actual node data
before building a screen, don't work from screenshots alone.

## No animation libraries

Animations are hand-rolled CSS (Tailwind `keyframes`/`animation` in
`tailwind.config.ts`, plus `requestAnimationFrame` tweens like
`lib/useAnimatedNumber.ts`) — no Framer Motion or similar.

## Segmented controls

Segmented controls use one persistent selection indicator. It stays visible and slides horizontally between options when the selection changes; do not replace it with a separately appearing or disappearing active background.

## Changelog

`lib/changelog.json` is the source of truth for the version/changelog block shown
in the sidebar above the profile card (`components/Sidebar.tsx`, imports
`currentRelease` from `lib/changelog.ts`). **Update it manually before every commit
that changes the product**: bump `version`/`label`/`date` and add a new entry at
the top of the array (newest first) listing what changed, in plain Russian, short
bullet-style sentences — `currentRelease` is just `changelog[0]`, so the sidebar
always reflects the newest entry. Entries are typed via `ChangelogEntry` in
`lib/types.ts`. Don't skip this for small fixes — the whole point is that the
popover in the sidebar stays trustworthy as a real changelog, not a stale label.
