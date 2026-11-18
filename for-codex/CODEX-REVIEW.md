# Snoot Pets — Codex Review

Reviewed the local project at commit `7a3603a`. The JavaScript files passed `node --check`. I could not open the local page in a browser in this environment, so I did not play a live spar; battle behavior and in-arena art alignment remain unverified.

## Findings, highest priority first

### 1. A missed attack consumes Kindle

**Files:** `game-parts/battle.js`; `game-parts/battle.js` also contains the Kindle instructions shown to players.

**What:** After a `hit` move is resolved, the code clears `game.charged` and calls `Ember.setCharged(false)` even when the move misses. The on-screen explanation says the next hit does double damage, which reads as though the charge is used by a successful hit.

**Why it matters:** A miss can spend the player's charge without dealing the promised payoff. That makes the rule feel inconsistent and may teach the wrong idea about the battle logic.

**Suggestion:** Consume Kindle only when the charged attack lands, or change the instructions so they clearly say it boosts the next attack attempt, including a miss.

### 2. Kindle tints the whole painted sprite

**Files:** `game-parts/embersnoot.js`; `my-embersnoot.js`.

**What:** The Kindle effect overlays a translucent color across the sprite's entire opaque frame. Since the delivered sprite sheet combines Embersnoot's body and flames, this also washes over the soot-plum fur instead of just brightening the fire. The configurable colors in `my-embersnoot.js` affect effects; they do not recolor the painted base sprite.

**Why it matters:** The full-body wash may muddy Embersnoot's palette and make the flame effect harder to read next to Dewsnoot. I reviewed the source behavior, but this needs an in-game visual check because I could not play a spar here.

**Suggestion:** Check Kindle in the arena. If the fur loses too much of its contrast, reduce or remove the full-frame tint; a separate flame mask could be considered later if the effect needs more control.

### 3. Setup text overpromises what beginners can customize

**Files:** `START-HERE.txt`; `guide.html`; `my-embersnoot.js`; `game-parts/notebook.js`.

**What:** The start instructions and guide imply that the pet's name, colors, and shape are all edited in `my-embersnoot.js`. The config comments clarify that the base appearance is painted into the PNG, and its color settings change effects. The Notebook card also describes these as the pet's colors without that distinction. The guide's PNG explanation describes only Dewsnoot's animation sheet, though Embersnoot is also supplied as a sheet.

**Why it matters:** A first-time learner may change a color setting and expect the painted body to change, or look for a shape setting that does not exist. This can make a successful edit feel broken.

**Suggestion:** Say plainly that `my-embersnoot.js` changes the name, team, victory line, moves, and effect colors; changing the painted body or shape requires editing the art. Describe both pets' PNGs as sprite sheets.

## Art and animation

Embersnoot reads clearly as a small flame creature, and the warm painted texture and palette fit Dewsnoot's storybook style. The two designs feel like they belong in the same game while remaining distinct. The sprite-sheet layout and the animation row definitions appear consistent with the brief. I found no definite static art defect; I could not assess how the sprites sit or move together in the live arena without a browser spar.

## Small improvement worth considering

`prefers-reduced-motion` currently slows some animation timing, but the looping idle animations still move. If you want the setting to reduce motion more fully, use a still pose or pause idle loops when that preference is active. This is lower priority than clarifying Kindle and the customization instructions.

I would fix the Kindle rule and clarify the customization text before adding more quests or features; the current game already has a useful set of learning pieces, and these changes would make the existing experience clearer.

## Live play-test

Tested the public build at `https://robhessdev.github.io/snoot-pets/`. Played two complete spars and used every move: Spark Flick, Flare Stamp, Smoke Puff, and Kindle. The first spar ended in a win at Level 0 (Embersnoot 33/40, Dewsnoot 0/30). The rematch ended in a loss at Level 1 (Embersnoot 0/40, Dewsnoot 6/34). The Notebook opened to its “Front end vs. back end” card, and the quest list and Quest 2 instructions opened. No browser console warnings or errors appeared.

### Fixes checked

- **Kindle after a missed attack — verified.** A charged Flare Stamp missed, and the game said “Your Kindle is still burning.” The next landed Spark Flick reported “Kindled: double power!” and consumed the charge. Dewsnoot's Fern Shield halved the displayed damage, which made the message especially useful for explaining how the two effects combine.
- **Dew Splash can still douse Kindle.** When Dewsnoot's Dew Splash hit while Embersnoot was charged, the game explicitly cleared the charge and said “The dew douses the kindled flame!” The opponent also chooses Dew Splash when Kindle is active. This looks like an intentional counter, but Quest 1 says Kindle doubles “your next hit” without mentioning that Dewsnoot can douse it first. Consider adding that exception to the quest explanation.
- **Flame halo — visually checked.** The full-body tint is gone; Embersnoot's painted fur keeps its normal colors while Kindle is active. The halo is subtle at this preview size, but the `kindled ×2` badge and turn text make the charged state clear.
- **Customization wording — verified in the live guide.** It now distinguishes editable settings (including effect colors) from the painted body and says both pets' PNGs are sprite sheets.
- **Reduce Motion — implementation checked, not exercised live.** This browser reported `prefers-reduced-motion: reduce` as false, so I could not see the reduced-motion mode in the live page. The current code holds looped Embersnoot and Dewsnoot animations on still frames and disables the walk-in motion when that preference is active.

### Additional play observation

**Files:** `game-parts/battle.js`.

**What:** After selecting “Spar again,” the previous result banner (“Embersnoot wins!” or “Dewsnoot wins this one”) remained on screen while the new spar was already active, including after its “Your turn” prompt appeared. It cleared when the first move was made.

**Why it matters:** For a moment the arena shows a new fight and the previous fight's outcome at the same time, which can make it unclear whether the rematch has started.

**Suggestion:** Clear the result banner as soon as a new spar starts.

**Difficulty note:** Dewsnoot had 34 puff at Level 1, could hit for 7, and used one 6-puff heal. My second spar was close, but Embersnoot lost with Dewsnoot at 6 puff. One play-through is not enough to call this a balance bug; it may be worth checking whether the first level-up should feel this demanding for a beginner.
