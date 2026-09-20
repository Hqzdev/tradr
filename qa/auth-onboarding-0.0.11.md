# Auth onboarding — 0.0.11

## Selected direction

- Approved source concept: `/Users/yaroslavfairfieldd/.codex/generated_images/01a0be07-7670-7ce0-b993-708e1ac78ec9/exec-45830958-0187-4565-b404-4674a5b6030e.png` (second generated direction).
- Runtime routes: `http://localhost:3010/register` and `http://localhost:3010/login`.
- Intentional product adaptation: real local TRADR stock marks replace generic decoration; Russian product copy and the existing magenta token remain authoritative.

## Visual verification

- Desktop: the card stays within the approved `560px` ceiling and retains the reference hierarchy — brand bar, three-step rail, calm field stack, segmented strategies, oversized budget control, summary, and paired actions.
- Mobile `390 × 844`: `scrollWidth === innerWidth === 390`; the first step fits without horizontal overflow and the denser final step scrolls vertically to its actions.
- Decorative stock spheres remain behind the card, ignore pointer input, and reduce from eight to four to two across desktop/tablet/mobile.
- The screen settles from `translateY(24px)`, `blur(8px)` and zero opacity in `480ms`; steps travel `18px` in the correct direction and the card content height transitions without a layout jump.
- Reduced motion removes spatial travel and continuous sphere motion while preserving immediate opacity feedback.

## Interaction verification

- Empty profile submit exposes both inline errors without moving to step two.
- Valid profile and password values unlock the next steps; the password checklist updates for length and matching.
- Completed steps become keyboard-reachable navigation targets; the Back action keeps the wizard draft.
- Strategy cards, five budget presets, manual budget input, password visibility, field clear, loading, success, disabled, hover and focus-visible states are implemented.
- Login uses a single safe credential error and preserves only a validated local `next` path.
- Browser console errors in the final checked login/register states: `0`.

## Data and verification

- Frontend unit tests: `17` passed, `0` failed.
- Backend non-context suite: `18` passed, `0` failed, including registration, provisioning failure, backward compatibility, budget range and exposure boundary.
- The existing application-context smoke test still requires a valid JDBC-form `DATABASE_URL`; the current shell value is not JDBC-formatted, so that environment-dependent test was reported separately.
- Frontend production build: passed; `48` routes generated.
- Backend compilation: passed.
- Google Fonts optimization emitted a network-only warning; the CSS retains the local/system Inter fallback stack.

final result: passed
