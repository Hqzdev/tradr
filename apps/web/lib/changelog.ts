import type { ChangelogEntry } from "./types";
import changelogData from "./changelog.json";

// The source of truth is changelog.json — see CLAUDE.md ("Changelog") for
// the rule: add an entry here before every commit that changes the product,
// newest version first. This file just types and re-exports it.
export const changelog: ChangelogEntry[] = changelogData;
export const currentRelease: ChangelogEntry = changelog[0];
