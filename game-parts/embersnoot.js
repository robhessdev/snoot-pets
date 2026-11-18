// =========================================================
//  EMBERSNOOT'S BODY — draws your pet with code, many times
//  a second, using the settings from my-embersnoot.js.
//  You don't need to edit this file. Change my-embersnoot.js
//  instead, and this file uses your new numbers and colours.
// =========================================================

const Ember = (() => {
  const W = 300, H = 260, G = 236;            // drawing size and ground line
  const TAU = Math.PI * 2;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AMB = reduced ? 0 : 1;

  let canvas, ctx, S = null, level = 0;
  const st = {
    t: 0, anim: null, animStart: 0, animDur: 1,
    asleep: false, cheering: false, charged: false,
    blinkAt: 2, smoke: [], sparks: [], nextSmoke: 1.5, nextSpark: .4, flash: 0,
  };

  // ---- small colour helpers ----
  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(a, b, k) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`;
  }
  function rgba(h, a) { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; }

  function mount(el, settings) {
    canvas = el; ctx = canvas.getContext("2d"); S = settings;
    const fit = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round((canvas.clientWidth || W) * d);
      canvas.height = Math.round((canvas.clientHeight || H) * d);
    };
    fit(); addEventListener("resize", fit);
    let last = performance.now();
    const frame = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      update(dt); render();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
  function setLevel(n) { level = n; }

  // play("attack" | "charge" | "dodge" | "hurt" | "win" | "lose")
  function play(name) {
    const durs = { attack: .7, charge: .9, dodge: 1.1, hurt: .6, win: 1.4, lose: 1.2 };
    st.anim = name; st.animStart = st.t; st.animDur = durs[name] || .8;
    if (name === "lose") st.asleep = true;
    if (name === "win") st.cheering = true;
    if (name === "hurt") st.flash = 1;
    if (name === "attack" || name === "charge") burst(name === "charge" ? 10 : 6);
  }
  function reset() { st.asleep = false; st.cheering = false; st.charged = false; st.anim = null; }
  function setCharged(on) { st.charged = on; }

  function burst(n) {
    for (const p of crownPoints()) for (let i = 0; i < n / 2; i++)
      st.sparks.push({ x: p.x, y: p.y - 20, vx: (Math.random() - .5) * 70, vy: -60 - Math.random() * 70, life: 1, r: 1.5 + Math.random() * 1.6 });
  }

  function update(dt) {
    st.t += dt;
    st.flash = Math.max(0, st.flash - dt * 2.5);
    if (AMB && !st.asleep && st.t > st.nextSmoke) {
      st.smoke.push({ x: 252, y: 118, r: 4, life: 1, vx: 6 + Math.random() * 6, vy: -16 - Math.random() * 8 });
      st.nextSmoke = st.t + 1.8 + Math.random() * 2.2;
    }
    if (AMB && st.t > st.nextSpark) {
      const pts = crownPoints(), p = pts[Math.floor(Math.random() * pts.length)];
      st.sparks.push({ x: p.x, y: p.y - 22, vx: (Math.random() - .5) * 20, vy: -40 - Math.random() * 25, life: 1, r: 1.3 + Math.random() * 1.3 });
      st.nextSpark = st.t + (st.asleep ? 1.6 : .35 + Math.random() * .4);
    }
    st.smoke = st.smoke.filter(p => { p.life -= dt * .7; p.x += p.vx * dt; p.y += p.vy * dt; p.r += dt * 7; return p.life > 0; });
    st.sparks = st.sparks.filter(p => { p.life -= dt * .9; p.x += (p.vx + Math.sin(st.t * 6 + p.y * .05) * 10) * dt; p.y += p.vy * dt; return p.life > 0; });
    if (st.t > st.blinkAt + .15) st.blinkAt = st.t + 2.5 + Math.random() * 3.5;
  }

  function animP() {
    if (!st.anim) return 0;
    const p = (st.t - st.animStart) / st.animDur;
    if (p >= 1) { if (st.anim !== "lose" && st.anim !== "win") st.anim = null; return 1; }
    return p;
  }

  function crownPoints() {
    const n = S ? S.crownFlames : 3, pts = [];
    for (let i = 0; i < n; i++) {
      const u = n === 1 ? .5 : i / (n - 1);
      pts.push({ x: 176 + u * 34, y: 104 - Math.sin(u * Math.PI) * 7 + (1 - u) * 6, ang: -.55 + u * .7, len: 30 + Math.sin(u * Math.PI) * 14, i });
    }
    return pts;
  }

  // One flame: four nested teardrops, dark outside to bright inside.
  function flame(x, y, ang, len, scale, i) {
    const c = S.colors, t = st.t;
    const fl = AMB ? Math.sin(t * 9 + i * 2.1) * .08 + Math.sin(t * 14.3 + i * 1.3) * .05 : 0;
    const L = len * scale * (1 + fl);
    const wob = AMB ? Math.sin(t * 7 + i * 1.9) * .14 : 0;
    const W0 = (len * .22 + 6) * Math.max(.5, scale);
    const layers = [[mix(c.flame, "#5a0d00", .45), 1], [c.flame, .84], [mix(c.flame, c.core, .5), .62], [c.core, .36]];
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    for (const [col, k] of layers) {
      const h = L * k, w = W0 * (.35 + .65 * k), b = 7 * (1 - k);
      ctx.beginPath(); ctx.moveTo(0, b + w * .6);
      ctx.bezierCurveTo(-w * 1.25, b + w * .4, -w * .9, -h * .4, wob * h, -h);
      ctx.bezierCurveTo(w * .9, -h * .4, w * 1.25, b + w * .4, 0, b + w * .6);
      ctx.fillStyle = col; ctx.fill();
    }
    ctx.restore();
  }

  function render() {
    if (!S) return;
    const c = S.colors, t = st.t, p = animP();
    const k = canvas.width / W;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(k, 0, 0, k, 0, (canvas.height - H * k));

    // How the current move changes the pose.
    let dx = 0, dy = 0, alpha = 1, flameScale = 1, headDrop = 0;
    const breath = Math.sin(t * 2.4) * 1.4 * AMB;
    if (st.anim === "attack") { dx = Math.sin(p * Math.PI) * 42; flameScale = 1 + .45 * Math.sin(p * Math.PI); }
    if (st.anim === "charge") { flameScale = 1 + .5 * Math.sin(p * Math.PI); dx = Math.sin(p * 60) * 1.5 * (1 - p); }
    if (st.anim === "dodge") { alpha = 1 - .7 * Math.sin(p * Math.PI); dx = -18 * Math.sin(p * Math.PI); }
    if (st.anim === "hurt") { dx = Math.sin(p * 40) * 7 * (1 - p); }
    if (st.cheering) dy = -Math.abs(Math.sin((t - st.animStart) * 6)) * 14 * AMB;
    if (st.charged) flameScale *= 1.25;
    if (st.asleep) { flameScale = .35; headDrop = 18; }

    ctx.save(); ctx.translate(dx, dy); ctx.globalAlpha = alpha;

    // ground shadow
    ctx.beginPath(); ctx.ellipse(150, G + 2, 92, 9, 0, 0, TAU); ctx.fillStyle = "rgba(30,15,10,.22)"; ctx.fill();

    // aura (🔒 level 5)
    if (S.auraColor && level >= 5) {
      const g = ctx.createRadialGradient(150, 160, 20, 150, 160, 130);
      g.addColorStop(0, rgba(S.auraColor, .35 + .1 * Math.sin(t * 3))); g.addColorStop(1, rgba(S.auraColor, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 20, W, H);
    }
    // charged glow
    if (st.charged || st.anim === "charge") {
      const g = ctx.createRadialGradient(190, 110, 10, 190, 110, 110);
      g.addColorStop(0, rgba(c.core, .45)); g.addColorStop(1, rgba(c.core, 0));
      ctx.fillStyle = g; ctx.fillRect(60, 0, 240, 230);
    }

    const bodyD = mix(c.body, "#000000", .35), bodyL = mix(c.body, "#ffffff", .18);
    const shade = (x, y, r) => { const g = ctx.createRadialGradient(x - r * .3, y - r * .4, r * .1, x, y, r * 1.1); g.addColorStop(0, bodyL); g.addColorStop(.6, c.body); g.addColorStop(1, bodyD); return g; };
    const outline = () => { ctx.strokeStyle = "rgba(25,12,14,.55)"; ctx.lineWidth = 2; ctx.stroke(); };

    // tail with a flame on the tip
    const tl = S.tailLength, bx = 84, by = 178;
    const ex = bx + (34 - bx) * tl, ey = by + (104 - by) * tl, cx0 = bx - 62 * tl, cy0 = by + 6;
    const sway = AMB ? Math.sin(t * 1.8) * 6 : 0;
    const tailPt = u => { const v = 1 - u; return { x: v * v * bx + 2 * v * u * cx0 + u * u * (ex + sway), y: v * v * by + 2 * v * u * cy0 + u * u * ey }; };
    for (let i = 0; i <= 18; i++) {
      const u = i / 18, q = tailPt(u);
      ctx.beginPath(); ctx.arc(q.x, q.y, 12 - u * 7, 0, TAU); ctx.fillStyle = i < 18 ? c.body : bodyD; ctx.fill();
    }
    const tip = tailPt(1);
    const tf = level >= 3 ? S.tailFire : 1;
    flame(tip.x, tip.y + 2, -.15, 24 * tf, st.asleep ? .45 : flameScale, 9);

    // back legs
    const leg = (x, back) => {
      ctx.beginPath(); ctx.roundRect(x - 10, 186, 20, G - 186, [10, 10, 7, 7]);
      ctx.fillStyle = back ? bodyD : shade(x, 210, 20); ctx.fill(); outline();
      ctx.fillStyle = mix(c.body, "#000000", .55);
      ctx.beginPath(); ctx.ellipse(x, G - 3, 9, 3.4, 0, 0, TAU); ctx.fill();
    };
    leg(100, true); leg(122, true);

    // body
    ctx.beginPath(); ctx.ellipse(140, 178 - breath * .4, 64, 38 + breath * .4, 0, 0, TAU); ctx.fillStyle = shade(140, 178, 64); ctx.fill(); outline();
    ctx.beginPath(); ctx.ellipse(146, 198, 44, 13, 0, 0, TAU); ctx.fillStyle = rgba(c.belly, .75); ctx.fill();

    // glowing cracks
    const glow = .65 + .35 * Math.sin(t * 3) * AMB + (st.charged ? .3 : 0);
    ctx.save(); ctx.strokeStyle = c.cracks; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.shadowColor = c.cracks; ctx.shadowBlur = 9; ctx.globalAlpha = alpha * Math.min(1, glow) * (st.asleep ? .5 : 1);
    for (const path of [[[104, 166], [114, 172], [110, 181], [121, 189]], [[136, 157], [144, 167], [139, 176]], [[160, 170], [170, 178], [167, 186]]]) {
      ctx.beginPath(); path.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    }
    ctx.restore(); ctx.globalAlpha = alpha;

    // front legs
    leg(162, false); leg(184, false);

    // neck and head
    ctx.save(); ctx.translate(0, headDrop);
    ctx.beginPath(); ctx.ellipse(176, 150, 24, 30, -.35, 0, TAU); ctx.fillStyle = shade(176, 150, 28); ctx.fill();
    const es = S.earSize;
    const ear = (x, y, rot, back) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot + (st.asleep ? -.5 : 0));
      ctx.beginPath(); ctx.moveTo(-11 * es, 4); ctx.quadraticCurveTo(-4 * es, -22 * es, 2 * es, -36 * es); ctx.quadraticCurveTo(9 * es, -18 * es, 12 * es, 4); ctx.closePath();
      ctx.fillStyle = back ? bodyD : shade(0, -14, 20); ctx.fill(); outline();
      if (!back) { ctx.beginPath(); ctx.moveTo(-5 * es, 0); ctx.quadraticCurveTo(-1 * es, -16 * es, 2 * es, -26 * es); ctx.quadraticCurveTo(6 * es, -12 * es, 6 * es, 0); ctx.closePath(); ctx.fillStyle = rgba(c.cracks, .8); ctx.fill(); }
      ctx.restore();
    };
    ear(182, 100, -.45, true);
    ctx.beginPath(); ctx.arc(198, 126, 36, 0, TAU); ctx.fillStyle = shade(198, 126, 36); ctx.fill(); outline();
    ear(208, 96, -.15, false);

    // crown flames
    for (const f of crownPoints()) flame(f.x, f.y, f.ang, f.len, flameScale, f.i);

    // soot mask
    ctx.beginPath(); ctx.ellipse(208, 123, 30, 11, -.08, 0, TAU); ctx.fillStyle = "rgba(20,10,14,.42)"; ctx.fill();

    // eyes
    const blink = (st.t > st.blinkAt && st.t < st.blinkAt + .15) || st.asleep;
    const eye = (x, y, r, sq) => {
      if (blink) { ctx.beginPath(); ctx.arc(x, y - 2, r, .15 * Math.PI, .85 * Math.PI); ctx.strokeStyle = "#1c1014"; ctx.lineWidth = 2.6; ctx.stroke(); return; }
      ctx.beginPath(); ctx.ellipse(x, y, r * sq, r, 0, 0, TAU); ctx.fillStyle = c.eyes; ctx.fill();
      ctx.save(); ctx.shadowColor = c.eyes; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.ellipse(x + 1.5, y + .5, r * .45 * sq, r * .62, 0, 0, TAU); ctx.fillStyle = "#14141c"; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.arc(x - r * .25, y - r * .35, r * .28, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, y, r * sq, r, 0, 0, TAU); ctx.strokeStyle = "#1c1014"; ctx.lineWidth = 1.6; ctx.stroke();
    };
    eye(194, 124, 6, .8); eye(216, 122, 7.5, 1);

    // short upturned snout
    ctx.beginPath(); ctx.ellipse(236, 134, 19, 12, -.28, 0, TAU); ctx.fillStyle = shade(236, 134, 19); ctx.fill(); outline();
    ctx.beginPath(); ctx.ellipse(251, 127, 7, 6, -.3, 0, TAU); ctx.fillStyle = mix(c.body, "#000000", .45); ctx.fill();
    ctx.beginPath(); ctx.arc(253, 126, 1.8, 0, TAU); ctx.fillStyle = "#120a0c"; ctx.fill();
    ctx.beginPath(); ctx.arc(228, 145, 6, .2, Math.PI - .6); ctx.strokeStyle = "rgba(25,12,14,.6)"; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(214, 142, 6, 3.5, 0, 0, TAU); ctx.fillStyle = rgba(c.cracks, .35); ctx.fill();
    ctx.restore();

    // hurt flash
    if (st.flash > 0) { ctx.globalCompositeOperation = "source-atop"; ctx.fillStyle = `rgba(255,255,255,${st.flash * .5})`; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "source-over"; }
    ctx.restore();

    // smoke and sparks float free of the body
    for (const s of st.smoke) { ctx.beginPath(); ctx.arc(s.x + dx, s.y + dy + headDrop, s.r, 0, TAU); ctx.fillStyle = `rgba(150,140,140,${s.life * .35})`; ctx.fill(); }
    if (st.anim === "dodge") {
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * TAU + t, r = 30 + Math.sin(p * Math.PI) * 30;
        ctx.beginPath(); ctx.arc(150 + Math.cos(a) * r, 160 + Math.sin(a) * r * .6, 22 * Math.sin(p * Math.PI) + 4, 0, TAU);
        ctx.fillStyle = `rgba(160,150,150,${.45 * Math.sin(p * Math.PI)})`; ctx.fill();
      }
    }
    for (const s of st.sparks) { ctx.beginPath(); ctx.arc(s.x + dx, s.y + dy, s.r * (.5 + s.life * .5), 0, TAU); ctx.fillStyle = `rgba(255,${Math.round(150 + s.life * 80)},70,${s.life})`; ctx.fill(); }
  }

  return { mount, play, reset, setCharged, setLevel };
})();
