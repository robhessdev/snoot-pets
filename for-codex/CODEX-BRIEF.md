# Codex brief: painted Embersnoot sprite sheets

**Project:** Snoot Pets, a beginner learning game. The project folder is `Documents/Snoot-Pets`.
**Your job:** paint a new version of the player's pet, **Embersnoot**, as sprite sheets that match the painted style of the opponent, **Dewsnoot**. Claude will wire the sheets into the game afterwards.

---

## 1. Rules for this job

- **Only create new files.** Put the sprite sheets in `game-parts/art/` and the review files in `for-codex/`.
- **Do not edit or delete any existing file**: no code, not `my-embersnoot.js`, not `dewsnoot.png`.
- No external links, tracking, uploads or publishing. Don't create a Pet share link.
- If something in this brief can't be done well, say so in your notes. Don't quietly change it.

## 2. Files to look at first

| File | What it's for |
|---|---|
| `game-parts/art/dewsnoot.png` | **Style reference.** Match this painted storybook look: the soft painted shading, the outline weight, the lighting, the level of detail and the scale. |
| `for-codex/embersnoot-design-reference.png` | **Design reference.** The current Embersnoot, drawn with simple code, in six poses. Keep its identity (section 3), and make it look far better in Dewsnoot's painted style. |
| `index.html` (open in a browser) | Optional: shows how both pets appear side by side in the arena. |

## 3. Who Embersnoot is (keep these traits)

- A **lean, nimble fire creature**: restless, a bit of a show-off, quick on its feet. Dewsnoot is the opposite: squat, patient, stubborn.
- **Soot-plum fur** (dark greyish-purple), with a lighter tummy.
- **Pointed, fox-like ears** with glowing ember-orange insides.
- A **dark soot "mask"** across the eyes, and **icy pale-blue eyes**. The cool eyes against the warm body are part of the design.
- A **short, upturned snout** that sometimes puffs little grey smoke rings. It must NOT be long or trunk-like. That's Dewsnoot's feature.
- **Glowing ember-orange cracks** on its flank, like cooling lava.
- **3 flames** in a crown on its head, and a **long tail with a flame on the tip**.
- No ferns or leaves (those are Dewsnoot's), and no resemblance to existing game or franchise creatures.

This is a **full repaint**. Improve the proportions and the charm freely, as long as these traits stay.

## 4. The exact format (this is what makes it drop in cleanly)

- **PNG with a transparent background.** Unused cells are fully transparent.
- **Grid:** every frame is **192 px wide × 208 px tall**. There are **8 columns**, so every sheet is **1536 px wide**. There are 8 rows, so it's **1664 px tall**.
- **Facing LEFT in every frame**, the same direction as Dewsnoot's art.
- **Feet on the same line in every frame:** the bottom of the paws sits at **y = 189** inside each cell, the same as Dewsnoot.
- **Stay inside the frame:** everything fits between **x 6–186** and **y 6–189**, including the flames and the tail. Nothing gets cropped at a cell edge.
- **Same size and position in every frame.** The body is roughly centred horizontally, and only the pose changes.
- **Overall size:** about as tall as Dewsnoot including the flames, but slimmer.

### Rows, in this exact order

| Row | Animation | Frames | Notes |
|---|---|---|---|
| 0 | idle | 6 | Loops. Breathing, flames flicker, a slow blink around frame 3. |
| 1 | walk | 8 | Loops. Trotting left. |
| 2 | attack | 6 | Wind-up, a quick lunge to the left (toward the opponent), recover. |
| 3 | kindle | 6 | Crouches, and the flames flare much bigger and brighter. |
| 4 | dodge | 6 | Ducks or sidesteps inside a puff of grey smoke. |
| 5 | hurt | 4 | Flinches back, eyes squeezed shut. |
| 6 | win | 6 | Proud hop or stamp, chin up. |
| 7 | lose | 8 | Flames shrink to embers, lies down and curls up asleep. The last frame is the resting pose. |

## 5. Two layers: body and flames (important)

In the game, players can change their pet's flame colour. To keep that working, please deliver **two sheets with exactly the same grid and alignment**:

1. **`game-parts/art/embersnoot-body.png`**: everything except the flames. Body, ears, eyes, cracks, tail and smoke puffs.
2. **`game-parts/art/embersnoot-flames.png`**: only the flames (the head crown and the tail tip), painted in standard warm colours: a yellow core, orange, and darker red edges. Placed on top of the body sheet, it must line up pixel-perfectly so the pet looks complete.

The game recolours the flames layer by shifting its hue, so plain warm orange flames work best.

**If two aligned layers aren't reliably possible,** deliver one combined sheet, `game-parts/art/embersnoot.png`, and say so in your notes. Claude will adapt.

## 6. Review files (please include)

- `for-codex/embersnoot-contact-sheet.png`: every frame with body and flames combined, with the row names labelled.
- `for-codex/embersnoot-preview.gif`: the idle, attack and lose rows playing, for a quick look.
- `for-codex/CODEX-NOTES.md`: the rows and frame counts as delivered, a suggested speed for each row in milliseconds per frame, and anything that differs from this brief.

## 7. Check before you finish

- [ ] Transparent background, with no stray pixels, text or watermarks
- [ ] Facing left in every frame
- [ ] Paws on y = 189 in every frame, and nothing cropped
- [ ] Same scale and position in every frame
- [ ] The body and flames sheets line up exactly
- [ ] It looks like it belongs next to Dewsnoot (same painted style)
- [ ] It's clearly a different creature from Dewsnoot

## 8. Later: skins

Unlockable skins (bigger and better looks as the pet levels up) will use **exactly this same format**, named `embersnoot-<skin>-body.png` and `embersnoot-<skin>-flames.png`.
