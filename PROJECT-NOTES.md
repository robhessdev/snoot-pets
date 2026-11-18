# Snoot Pets: project notes

The one place to see where everything is, what's done, what's open, and what's planned.
Claude updates this after every round, so it travels with each save point.

## Where things live

| What | Where |
|---|---|
| Your folder (the real project) | `Documents/Snoot-Pets` on your Mac |
| Save points online (public) | github.com/robhessdev/snoot-pets |
| The live game (public) | robhessdev.github.io/snoot-pets |
| Private preview | the "Snoot Pets" artifact in Claude |
| Lore workbook | the "Snoot Pets: Pet Lore Workbook" doc in Claude (its snippets now live in `my-lore.js`) |

## How to save and publish

In the Claude app's **Code** tab (Snoot-Pets folder), ask:
*"Make a save point with a short message about what changed, then push it to GitHub."*
The live game updates a minute or two later.

## Save points so far

| Save point | What it added |
|---|---|
| `35e65b3` | First save point, before Codex's art |
| `7a3603a` | Codex's painted Embersnoot |
| `1595784` | Fixes from Codex's first review (Kindle, flame halos, wording, Reduce Motion) |
| `dca3db2` | Round 5: Explorer and Builder quests, lore, your own quests, practice files |
| *next* | Round 5 follow-ups: result banner clears on a new spar, Kindle and Quest 9 wording, Notebook intro, this notes file |

## Reviews and what happened to them

- **Codex review 1** (`for-codex/CODEX-REVIEW.md`, top): 4 findings. All fixed in `1595784`.
- **Codex live play-test** (same file, "Live play-test"):
  - Old result banner stays up after *Spar again*: **fixed** (next save point).
  - Quest 1 should mention dew can put out Kindle: **fixed** (next save point).
  - Reduce Motion: checked in the code; Codex's browser couldn't switch it on.
  - Level 1 felt demanding in one close loss: **watching** (see Open).
- **Codex Round 5 pass** (its chat reply, not in the file):
  - Result banner: **fixed** (same as above).
  - The Notebook said every chapter has a question, but the lore chapter doesn't: **wording fixed**.
  - Quest 9 "links to a private page": the repository is public; the wording is now general anyway.
  - Codex didn't repeat Claude's file-breaking tests (Claude runs those every round).

## Open: watch while playing

- **Difficulty around Levels 1–3:** is Dewsnoot too tough too soon? Change only if it keeps feeling unfair.

## Next up for Robin

1. Catch up in your own copy: press ⌘R, win a spar (Quest 1), then Quest 2 (VS Code) onward. At Quest 8, click "I did it ✓" (Git is already set up).
2. Read the lore in the Notebook, and change anything you like in `my-lore.js`.
3. Read the code as you go: the "Show me the code" buttons, and Quest 9's red and green changes.

## Parked ideas (for later)

- **More quests,** ramping evenly in learning and challenge, most not too hard.
- **Skins** that unlock as you level up. Same sprite format as Embersnoot: see `for-codex/CODEX-BRIEF.md`, section 8.
- **A real desktop pet:** Embersnoot living on your Mac screen.
- A leaderboard: decided it isn't needed.
