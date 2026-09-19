# TRADR landing motion — QA frame log

Date: 2026-09-19  
Route: `http://localhost:3010/`  
Reference: `https://app.uniswap.org/?intro=true`

The comparison screenshots were captured in the Codex in-app Browser during the implementation run. The browser security policy prevented exporting those runtime captures as local PNG files, so this manifest records the exact checked frame and computed-state evidence without fabricating image artifacts.

| Frame | Viewport | Expected state | Observed state |
| --- | --- | --- | --- |
| Intro start | 2048 × 1092 | First heading segment moving from `translateY(100px)`, later segments hidden | first segment at `translateY(66.44px)` / opacity `.336`; segments 2–3 at `100px` / opacity `0` |
| Intro settled | 2048 × 1092 | Complete hero, 18 calm orbs, cue visible | all three segments and cue at opacity `1`; 18 visible orbs; zero horizontal overflow |
| Negative focus | 2048 × 1092 | TSLA sharp, paused, scaled/rotated, two rings, negative label | blur `0`, opacity `1`, float paused, rings `.3/.1` at `1.2/1.4`, label `TSLA ▼ 0,62%` |
| Positive focus | 2048 × 1092 | AAPL positive label and paused movement | label `AAPL ▲ 1,84%`, opacity `1`, float paused |
| Desktop | 1440 × 900 | 13 orbs | 13 visible orbs; zero horizontal overflow |
| Compact desktop | 1280 × 720 | 11 orbs | 11 visible orbs; zero horizontal overflow |
| Tablet | 834 × 1112 | no orb field; mobile header | orb field hidden, mobile header visible, zero horizontal overflow |
| Mobile | 390 × 844 | no orb field; stacked hero | zero orbs; heading and ticket within `18–372px`; zero horizontal overflow |
| Mobile menu | 390 × 844 | 500ms backdrop, 200ms panel, body lock | panel opacity `1`, backdrop opacity `~1`, body overflow locked; Escape restores all states |
| Metrics | 390 × 844 | one-shot digit roll | all digit strips reach final transforms; final state remains after leaving viewport |
| Product previews | 390 × 844 | run only near viewport | visible cards report `running`; off-screen cards report `paused` |
| Hero off-screen | 390 × 844 | pause decorative cycles | orb float/rotate, cue and statistics pulse report `paused` |

Console errors: `0`.

Final result: passed.
