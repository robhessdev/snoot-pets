// =========================================================
//  EMBERSNOOT'S BODY — two layers, drawn many times a second:
//
//   1. PAINTED ART: Codex painted 50 animation frames into one
//      sprite sheet (art/embersnoot.png). We show one frame at a
//      time, like a flip book, the same way Dewsnoot works.
//   2. CODE EFFECTS: the sparks, glow and kindle halos are drawn
//      by code in YOUR colours from my-embersnoot.js.
//
//  If your Mac's "Reduce motion" setting is on, Embersnoot stands
//  still when resting, and there are no drifting sparks.
//
//  The first, code-drawn Embersnoot is still saved in Git
//  (save point #1), if you ever want to look back at it.
// =========================================================

const Ember = (() => {
  const CELL_W = 192, CELL_H = 208;              // one frame of the sprite sheet
  const LW = 232, LH = 250;                      // drawing area: the frame plus room for sparks
  const OX = (LW - CELL_W) / 2, OY = LH - CELL_H; // where the frame sits in the drawing area
  const TAU = Math.PI * 2;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AMB = reduced ? 0 : 1;

  // Each animation = a row of the sheet, how many frames, and ms per frame.
  // hold: stay on the last frame (for winning and losing).
  const ROWS = {
    idle:   { row: 0, frames: 6, ms: 150, loop: true },
    walk:   { row: 1, frames: 8, ms: 105, loop: true },
    attack: { row: 2, frames: 6, ms: 90 },
    kindle: { row: 3, frames: 6, ms: 110 },
    dodge:  { row: 4, frames: 6, ms: 85 },
    hurt:   { row: 5, frames: 4, ms: 125 },
    win:    { row: 6, frames: 6, ms: 135, hold: true },
    lose:   { row: 7, frames: 8, ms: 170, hold: true },
  };

  // Where the flames are in a frame (sparks rise from here).
  const CROWN = { x: 44, y: 24 }, TAIL = { x: 140, y: 48 };

  let canvas, ctx, off, offCtx, S = null, level = 0;
  const sheet = new Image();
  sheet.src = "game-parts/art/embersnoot.png";
  const st = { anim: "idle", frame: 0, clock: 0, t: 0, charged: false, asleep: false, flash: 0, sparks: [], nextSpark: .3 };

  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgba(h, a) { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; }

  function mount(el, settings) {
    canvas = el; ctx = canvas.getContext("2d"); S = settings;
    off = document.createElement("canvas"); off.width = CELL_W; off.height = CELL_H; offCtx = off.getContext("2d");
    const fit = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round((canvas.clientWidth || LW) * d);
      canvas.height = Math.round((canvas.clientHeight || LH) * d);
    };
    fit(); addEventListener("resize", fit);
    let last = performance.now();
    const loop = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; update(dt); render(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  function setLevel(n) { level = n; }

  // play("attack" | "charge" | "dodge" | "hurt" | "win" | "lose")
  function play(name) {
    if (name === "charge") name = "kindle";
    if (!ROWS[name]) return;
    st.anim = name; st.frame = 0; st.clock = 0;
    if (name === "lose") st.asleep = true;
    if (name === "hurt") st.flash = 1;
    if (name === "attack" || name === "kindle") burst(name === "kindle" ? 12 : 7);
  }
  function reset() { st.asleep = false; st.charged = false; st.anim = "idle"; st.frame = 0; }
  function setCharged(on) { st.charged = on; }

  // Walks in from the right edge, then rests.
  function walkIn() {
    reset();
    if (reduced || !canvas.animate) return;
    st.anim = "walk";
    canvas.animate([{ transform: "translateX(70%)" }, { transform: "translateX(0)" }], { duration: 1500, easing: "ease-out" })
      .onfinish = () => { if (st.anim === "walk") play("idle"); };
  }

  function burst(n) {
    for (const p of [CROWN, TAIL]) for (let i = 0; i < n / 2; i++)
      st.sparks.push({ x: OX + p.x, y: OY + p.y, vx: (Math.random() - .5) * 70, vy: -60 - Math.random() * 70, life: 1, r: 1.5 + Math.random() * 1.8 });
  }

  function update(dt) {
    st.t += dt; st.flash = Math.max(0, st.flash - dt * 2.5);
    // step the flip book
    const a = ROWS[st.anim];
    if (reduced && a.loop) { st.frame = 0; st.clock = 0; } else st.clock += dt * 1000 * (reduced ? .5 : 1);
    while (st.clock >= a.ms) {
      st.clock -= a.ms; st.frame++;
      if (st.frame >= a.frames) {                 // reached the LAST frame
        if (a.loop) st.frame = 0;
        else if (a.hold) st.frame = a.frames - 1;
        else { st.anim = "idle"; st.frame = 0; break; }
      }
    }
    // a gentle stream of sparks
    if (AMB && st.t > st.nextSpark) {
      const p = Math.random() < .7 ? CROWN : TAIL;
      st.sparks.push({ x: OX + p.x + (Math.random() - .5) * 16, y: OY + p.y, vx: (Math.random() - .5) * 18, vy: -38 - Math.random() * 24, life: 1, r: 1.2 + Math.random() * 1.3 });
      st.nextSpark = st.t + (st.asleep ? 1.8 : st.charged ? .12 : .35 + Math.random() * .4);
    }
    st.sparks = st.sparks.filter(p => { p.life -= dt * .9; p.x += (p.vx + Math.sin(st.t * 6 + p.y * .05) * 10) * dt; p.y += p.vy * dt; return p.life > 0; });
  }

  function render() {
    if (!S) return;
    const c = S.colors, k = canvas.width / LW;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(k, 0, 0, k, 0, canvas.height - LH * k);

    // 🔒 level 5: aura behind your pet
    if (S.auraColor && level >= 5) {
      const g = ctx.createRadialGradient(LW / 2, OY + 120, 20, LW / 2, OY + 120, 125);
      g.addColorStop(0, rgba(S.auraColor, .38 + .1 * Math.sin(st.t * 3) * AMB)); g.addColorStop(1, rgba(S.auraColor, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, LW, LH);
    }
    // glow behind the head when kindled (in your flame colour)
    const kindling = st.anim === "kindle" || st.charged;
    if (kindling) {
      const g = ctx.createRadialGradient(OX + CROWN.x, OY + CROWN.y + 30, 8, OX + CROWN.x, OY + CROWN.y + 30, 120);
      g.addColorStop(0, rgba(c.core, .55)); g.addColorStop(.5, rgba(c.flame, .22)); g.addColorStop(1, rgba(c.flame, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, LW, LH);
    }

    // the painted frame (drawn on a small side canvas first, so the hurt flash can whiten it)
    if (sheet.complete && sheet.naturalWidth) {
      const a = ROWS[st.anim];
      offCtx.globalCompositeOperation = "source-over";
      offCtx.clearRect(0, 0, CELL_W, CELL_H);
      offCtx.drawImage(sheet, st.frame * CELL_W, a.row * CELL_H, CELL_W, CELL_H, 0, 0, CELL_W, CELL_H);
      if (st.flash > 0) { offCtx.globalCompositeOperation = "source-atop"; offCtx.fillStyle = `rgba(255,255,255,${st.flash * .55})`; offCtx.fillRect(0, 0, CELL_W, CELL_H); }
      ctx.drawImage(off, OX, OY);
      // Kindle: soft halos on the flames only, in your colours, so the painted fur stays clean.
      // ("lighter" adds light on top, like shining a torch on the flames.)
      if (kindling) {
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        for (const [p, r] of [[CROWN, 34], [TAIL, 24]]) {
          const g = ctx.createRadialGradient(OX + p.x, OY + p.y, 2, OX + p.x, OY + p.y, r);
          g.addColorStop(0, rgba(c.core, .35)); g.addColorStop(1, rgba(c.flame, 0));
          ctx.fillStyle = g; ctx.fillRect(OX + p.x - r, OY + p.y - r, r * 2, r * 2);
        }
        ctx.restore();
      }
    }

    // sparks, in a mix of your flame and core colours
    for (const p of st.sparks) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (.5 + p.life * .5), 0, TAU);
      ctx.fillStyle = rgba(p.life > .5 ? c.core : c.flame, p.life); ctx.fill();
    }
  }

  return { mount, play, reset, setCharged, setLevel, walkIn };
})();
