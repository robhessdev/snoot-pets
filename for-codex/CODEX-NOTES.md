# Embersnoot sprite delivery notes

These files are a local art handoff for Snoot Pets. No existing project files were changed, and nothing was uploaded or published.

## Delivered format

- `game-parts/art/embersnoot.png` — combined body and flame atlas, transparent PNG, 1536×1664 px; 8 columns × 8 rows; each frame 192×208 px. Unused cells are transparent.

| Row | Animation | Frames | Suggested speed |
|---:|---|---:|---:|
| 0 | idle | 6 | 150 ms/frame |
| 1 | walk | 8 | 105 ms/frame |
| 2 | attack | 6 | 90 ms/frame |
| 3 | kindle | 6 | 110 ms/frame |
| 4 | dodge | 6 | 85 ms/frame |
| 5 | hurt | 4 | 125 ms/frame |
| 6 | win | 6 | 135 ms/frame |
| 7 | lose | 8 | 170 ms/frame |

## Difference from the brief

- The brief permits a single combined sheet if aligned flame-only layers cannot be produced reliably. I used that fallback: the crown/tail flames meet and overlap the painted fur, while orange ear interiors and flank cracks must stay on the body, so a mask made from this artwork could contaminate those identity details and make flame recolouring look ragged. The combined atlas preserves the complete painted character; Claude can adapt recolouring if needed.

- The win row uses a grounded paw stamp rather than a hop, which the brief explicitly allows and keeps the feet anchored to the shared ground line.

## Row contents

- Idle: breathing with a slow blink.
- Walk: left-facing trot cycle.
- Attack: coil, low lunge left, recover.
- Kindle: crouch and flare.
- Dodge: sidestep with a compact grey smoke puff.
- Hurt: recoil and squeeze eyes shut.
- Win: proud grounded stamp.
- Lose: flames shrink, then Embersnoot curls up asleep; final frame is resting.

The contact sheet and preview GIF are review aids; the sprite atlas is the game asset.
