// =========================================================
//  DEWSNOOT — plays his painted animation frames.
//
//  His picture file (art/dewsnoot.png) is a "sprite sheet":
//  one big image with 11 rows of little frames. Each frame is
//  192 wide and 208 tall. To animate him, we show one frame at
//  a time by sliding the image behind a small window.
//
//  FIX from the first version: it used to stop one frame early,
//  so the last pose never showed. Now we step through every
//  frame from first to last.
// =========================================================

const Dew = (() => {
  const FRAME_W = 192, FRAME_H = 208;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Each animation = which row of the sheet, how many frames, and how
  // long each frame stays on screen (in milliseconds).
  const ROWS = {
    idle:     { row: 0, frames: 6, ms: 210 },  // sniffing, keeping watch
    walkLeft: { row: 2, frames: 8, ms: 95  },  // walking (mirrored, so he walks right)
    hello:    { row: 3, frames: 4, ms: 170 },  // paw raise (used for Dew Splash)
    hop:      { row: 4, frames: 5, ms: 130 },  // happy hop (used when he wins)
    oops:     { row: 5, frames: 8, ms: 150 },  // sits down, out of puff
    wait:     { row: 6, frames: 6, ms: 180 },  // digs in (Stubborn Stand)
    focus:    { row: 7, frames: 6, ms: 160 },  // concentrating (Fern Shield)
    review:   { row: 8, frames: 6, ms: 160 },  // sniffing closely (Snout Sniff)
  };

  let sprite, mover, timer = null, loopsSinceBlink = 0;

  function mount(spriteEl, moverEl) { sprite = spriteEl; mover = moverEl; play("idle"); }

  function showFrame(row, frame) {
    sprite.style.backgroundPosition = `${-frame * FRAME_W}px ${-row * FRAME_H}px`;
  }

  // play("hop") once, or play("idle", { loop: true }).
  // hold: true keeps the last frame on screen (used when he loses).
  function play(name, opts = {}) {
    const a = ROWS[name] || ROWS.idle;
    const loop = opts.loop ?? (name === "idle" || name === "walkLeft");
    clearTimeout(timer);
    let f = 0;
    const step = () => {
      showFrame(a.row, f);
      let wait = a.ms;
      // Slow blink: about every third idle loop, he holds his
      // eyes-closed frame a little longer. (An idea borrowed from Miso.)
      if (name === "idle" && f === 3 && loopsSinceBlink >= 2) { wait = 750; loopsSinceBlink = -1; }
      f++;
      if (f >= a.frames) {                       // reached the LAST frame
        if (loop) { f = 0; if (name === "idle") loopsSinceBlink++; }
        else { timer = setTimeout(() => { if (!opts.hold) play("idle"); opts.onDone && opts.onDone(); }, a.ms + 120); return; }
      }
      timer = setTimeout(step, reduced ? wait * 2 : wait);
    };
    step();
  }

  // Gentle startle: a quick little jump that settles. (Also from Miso.)
  function startle() {
    if (reduced || !sprite.animate) return;
    sprite.animate([
      { transform: "translate(0,0) scale(1)" },
      { transform: "translate(4px,-12px) scale(1.05,0.96)", offset: .25 },
      { transform: "translate(0,2px) scale(0.98,1.03)", offset: .6 },
      { transform: "translate(0,0) scale(1)" },
    ], { duration: 480, easing: "ease-out" });
  }

  // When he's hit: a bright flash plus the startle jump.
  function hurt() {
    startle();
    if (reduced || !sprite.animate) return;
    sprite.animate([{ filter: "brightness(1)" }, { filter: "brightness(1.9) saturate(.6)" }, { filter: "brightness(1)" }], { duration: 360 });
  }

  // A little lunge toward Embersnoot when he splashes.
  function lunge() {
    if (reduced || !mover.animate) return;
    mover.animate([{ transform: "translateX(0)" }, { transform: "translateX(28px)", offset: .35 }, { transform: "translateX(0)" }],
      { duration: 520, easing: "ease-out" });
  }

  // Walks in from the LEFT edge of the garden, then rests.
  // (His art faces left, so the page mirrors him to face right, toward your pet.)
  function walkIn(done) {
    if (reduced || !mover.animate) { play("idle"); done && done(); return; }
    play("walkLeft");
    mover.animate([{ transform: "translateX(-70%)" }, { transform: "translateX(0)" }], { duration: 1500, easing: "ease-out" })
      .onfinish = () => { play("idle"); done && done(); };
  }

  return { mount, play, startle, hurt, lunge, walkIn };
})();
