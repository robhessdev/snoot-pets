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
| `4595814` | Round 5 follow-ups: result banner, Kindle and Quest 9 wording, Notebook intro, this notes file |
| `c4ff1a6` | Round 6: cleaner screen layout. Slim top bar, ☰ menu, one quest at a time under the game, ✏️ rename preview, green bar only after a change, ❓ How to play pop-up (first visit, after updates, ☰ menu, Tier 2/3 intros). Round 7: fight rework (see below) |
| *next* | Online code editor: ✏️ Edit code in the online game, Save & run in the browser, Reset to original, quest buttons that open the right file, "Skip for now" for computer-only quests |

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

## Design decisions

- **Renaming in the game is a preview.** Web pages aren't allowed to write files on your computer (a browser safety rule), so the ✏️ button shows the new name and gives you the exact line to paste into `my-embersnoot.js`.
- **The screen puts the game first.** Notes and extras live in the ☰ menu; quests sit under the arena, one at a time.
- **Round 7: the fight was checked against other games** (pet battlers, virtual pets, learn-to-code games) and common bad-game mistakes. A simulation of thousands of spars found:
  - Pressing Flare Stamp every turn was the best plan. One button beats thinking, so the choices didn't matter.
  - Kindle was a trap: a smart Dewsnoot always splashed it out.
  - Levelling up only made Dewsnoot tougher, so progress felt like punishment. At Level 6–8, almost every spar was lost.
- **What changed (all in `game-parts/battle.js`):**
  - Dewsnoot's bubble shows his next move and never lies.
  - Each of your moves answers one of his: Smoke Puff dodges a splash (90%) and counters for 6. A kindled hit burns through Fern Shield. Hit hard while he heals. After a sniff, his next splash can't be dodged.
  - Your pet grows: 40 puff, +2 a level up to Level 10, and +1 power on hits every 4 levels.
  - Gentle, Normal and Fierce in the ☰ menu. Fierce hides the hints.
  - A loss shows a tip based on that spar. After 3 losses in a row, it suggests Gentle.
  - Win record and streaks in the menu. Keys 1–4 pick moves. A small shake on hits, off for Reduce Motion.
- **Simulated results at Level 8 (Normal):** mashing one button wins about 60%; reading the bubble wins about 98%; random clicking about 23%. On Fierce, reading the bubble wins about 89% and mashing about 15%. The simulation is in Claude's test scripts, not in your folder.
- **Already fine, checked:** clear goal on screen, no grinding, saves by itself, no long unskippable text, sound toggle, Reduce Motion, works on a phone, never more than two misses in a row. The learning is the game itself: changing code changes your pet, so it isn't "chocolate-covered broccoli" (a quiz with a game painted on top).
- **First-time play-through after Round 7:** nothing big. Small fixes: Dewsnoot's Level 0 label now says "warming up" (it said "gentle", which looked like the Gentle setting), the "has your scent" and shield tags clear when a spar ends, and his puff bar drops right when you counter.
- **Playing online, with nothing to download:** the online version has its own ✏️ code editor (`game-parts/editor.js`).
  - The ✏️ next to the pet's name opens `my-embersnoot.js` right in the game. Practice files, lore and quests can be picked from the same editor.
  - Save & run keeps the changes in that browser only, and the game runs them instead of the originals. The same green and red bar checks apply, with line numbers. Curly quotes from phone keyboards are straightened automatically, with a note saying so.
  - Reset to original brings a file back.
  - Each quest card online says where to do it and has a button that opens the right file. Quests that need the Claude app on a computer (Git, diffs, Console, subagent, terminal) have "Skip for now".
  - On your Mac nothing changes: you still use VS Code, and the ✏️ is still the name preview.
- **Skipped on purpose:** achievements and badges for everything (rewards that aren't tied to learning tend to replace the fun), and a fast-forward button (a spar takes about half a minute).

## Open: watch while playing

- **Difficulty after the Round 7 rework:** does Normal feel fair? Is Fierce a good test? Numbers are easy to tune in `battle.js` (look for `DIFFICULTY`).
- **The bubble's hints:** helpful, or too much hand-holding once you know the moves?

## Next up for Robin

1. Catch up in your own copy: press ⌘R, win a spar (Quest 1), then Quest 2 (VS Code) onward. At Quest 8, click "I did it ✓" (Git is already set up).
2. Read the lore in the Notebook, and change anything you like in `my-lore.js`.
3. Read the code as you go: the "Show me the code" buttons, and Quest 9's red and green changes.

## Parked ideas (for later)

- **More quests,** ramping evenly in learning and challenge, most not too hard.
- **Skins** that unlock as you level up. Same sprite format as Embersnoot: see `for-codex/CODEX-BRIEF.md`, section 8.
- **A real desktop pet:** Embersnoot living on your Mac screen.
- A leaderboard: decided it isn't needed.
- **More opponents** with their own moves and bubbles (each would need art, like Dewsnoot).
- **Spar speed setting,** if spars ever feel slow.
