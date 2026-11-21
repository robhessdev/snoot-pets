// =========================================================
//  BATTLE RULES — a friendly spar. Nobody gets hurt: whoever
//  runs out of "puff" first sits down for a rest.
//
//  Dewsnoot shows his NEXT move in a bubble before you pick yours.
//  Every one of your moves has an answer to one of his:
//   • 💧 Dew Splash   → Smoke Puff dodges it, and you counter-spark.
//   • 🌿 Fern Shield  → halves plain hits. A KINDLED hit burns straight through.
//   • 💪 Stubborn Stand → he heals. A good time to hit hard.
//   • 👃 Snout Sniff  → his next splash can't be dodged. Safe time to Kindle.
//
//  Kindle doubles your next hit that LANDS. A splash that hits you puts it out.
//
//  Levelling up makes Embersnoot stronger too: +2 puff a level (up to Level 10)
//  and +1 power on every hit move every 4 levels.
//
//  Fairness rules:
//   • You can't miss more than twice in a row.
//   • Dewsnoot can only use Stubborn Stand twice per spar.
//   • His bubble never lies: what it shows is what he does.
// =========================================================

const Battle = (() => {
  let S = null, game = null, busy = false;
  const $ = id => document.getElementById(id);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // Dewsnoot's moves. He's the opponent, so these stay the same.
  const DEW_MOVES = {
    splash: { name: "Dew Splash",     icon: "💧" },
    shield: { name: "Fern Shield",    icon: "🌿" },
    stand:  { name: "Stubborn Stand", icon: "💪" },
    sniff:  { name: "Snout Sniff",    icon: "👃" },
  };
  const MAX_STANDS = 2, HEAL = 6, DODGE = .9, COUNTER = 6;

  // How strong each side is. Your pet grows with your level.
  const DIFFICULTY = {
    gentle: { label: "Gentle", puff: .8,   hit: -2, smart: 0 },
    normal: { label: "Normal", puff: 1,    hit: 0,  smart: 0 },
    fierce: { label: "Fierce", puff: 1.25, hit: 3,  smart: .1 },
  };
  const emberMax = lv => 40 + 2 * Math.min(lv, 10);
  const powerBonus = lv => Math.floor(lv / 4);

  function init(settings) {
    S = settings;
    renderMoveButtons();
    $("rematch").addEventListener("click", start);
    initKeys();
  }

  function renderMoveButtons() {
    const box = $("moves"); box.innerHTML = "";
    const bonus = powerBonus(Lessons.level());
    S.moves.forEach((m, i) => {
      const wrap = document.createElement("div"); wrap.className = "move";
      const b = document.createElement("button");
      b.type = "button"; b.className = "move-btn"; b.dataset.i = i;
      const detail = m.kind === "hit" ? `power ${m.power}${bonus ? `<span class="bonus">+${bonus}</span>` : ""}` : m.kind;
      b.innerHTML = `${i < 9 ? `<kbd class="key">${i + 1}</kbd>` : ""}<span class="move-name"></span><span class="move-detail">${detail} · ${m.chance}%</span>`;
      b.querySelector(".move-name").textContent = m.name;
      b.addEventListener("click", () => playerMove(i));
      const peek = document.createElement("button");
      peek.type = "button"; peek.className = "peek-btn"; peek.title = "Show me the code for this move";
      peek.setAttribute("aria-label", `Show me the code for ${m.name}`);
      peek.textContent = "</>";
      peek.addEventListener("click", () => Lessons.peekMove(i));
      wrap.append(b, peek); box.append(wrap);
    });
  }

  // Number keys 1–9 pick a move. Ignored while typing or while a panel is open.
  function initKeys() {
    document.addEventListener("keydown", e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (["modal", "notebook", "more"].some(id => $(id) && !$(id).hidden)) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= S.moves.length) { const b = document.querySelector(`.move-btn[data-i="${n - 1}"]`); if (b && !b.disabled) { e.preventDefault(); playerMove(n - 1); } }
    });
  }

  function setButtons(on) { document.querySelectorAll(".move-btn").forEach(b => b.disabled = !on); }

  // Shows the last two things that happened, so your move doesn't
  // vanish the moment Dewsnoot replies. The older line is faded.
  let lines = [];
  function log(msg) {
    lines = [...lines, msg].slice(-2);
    const box = $("battle-log"); box.innerHTML = "";
    lines.forEach((text, i) => {
      const p = document.createElement("span");
      p.className = i === lines.length - 1 ? "log-new" : "log-old";
      p.textContent = text; box.append(p);
    });
  }

  function bars() {
    // The bar's width is: puff left ÷ puff at the start × 100, as a percent.
    $("ember-bar").style.width = Math.min(100, game.ember.puff / game.ember.max * 100) + "%";
    $("dew-bar").style.width = (game.dew.puff / game.dew.max * 100) + "%";
    $("ember-puff").textContent = `${Math.max(0, game.ember.puff)} / ${game.ember.max}`;
    $("dew-puff").textContent = `${Math.max(0, game.dew.puff)} / ${game.dew.max}`;
    $("dew-shield").hidden = !game.dewShield;
    $("shield-bubble").hidden = !game.dewShield;
    $("ember-charged").hidden = !game.charged;
    $("dew-scent").hidden = !game.sniffed;
  }

  // ---- Dewsnoot's bubble: his next move, picked from what you can both see ----
  function chooseIntent() {
    const g = game;
    if (g.charged && Math.random() < g.dewSmart) return "splash";              // he wants to douse your Kindle
    if (g.stands < MAX_STANDS && g.dew.puff < g.dew.max * .4 && Math.random() < .5) return "stand";
    const pool = [];
    const add = (k, n) => { for (let i = 0; i < n; i++) pool.push(k); };
    add("splash", 50); add("sniff", 15);
    if (!g.dewShield) add("shield", 25);
    if (g.stands < MAX_STANDS && g.dew.puff < g.dew.max) add("stand", 10);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function showIntent() {
    const g = game, k = g.intent, d = DEW_MOVES[k], el = $("dew-intent");
    let hint = "";
    if (k === "splash") hint = g.sniffed ? "He has your scent: Smoke won't fool this one." : g.charged ? "It would put out your Kindle. Smoke Puff dodges it." : "Smoke Puff dodges it, then you counter.";
    if (k === "shield") hint = "Halves plain hits. A kindled hit burns through.";
    if (k === "stand")  hint = `He'll heal up to ${HEAL}. Hit hard now.`;
    if (k === "sniff")  hint = "His next splash can't be dodged. Safe time to Kindle.";
    el.innerHTML = `<b>${d.icon} Next: ${d.name}</b>${g.diff === "fierce" ? "" : `<span>${hint}</span>`}`;
    el.hidden = false;
    el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
  }
  function hideIntent() { $("dew-intent").hidden = true; }

  function start() {
    const level = Lessons.level(), diffKey = Lessons.difficulty(), D = DIFFICULTY[diffKey];
    // Dewsnoot gets a little tougher each time Embersnoot levels up,
    // until Level 8. Embersnoot keeps growing until Level 10.
    const L = Math.min(level, 8);
    const dewMax = Math.round((32 + L * 5) * D.puff);
    game = {
      level, diff: diffKey, bonus: powerBonus(level),
      ember: { puff: emberMax(level), max: emberMax(level) },
      dew: { puff: dewMax, max: dewMax },
      dewHit: Math.max(4, 7 + Math.round(L * .75) + D.hit),
      dewSmart: Math.min(.9, .3 + L * .08) + D.smart,
      charged: false, dodging: false, dewShield: false, sniffed: false, over: false,
      missStreak: 0, stands: 0, intent: null,
      stats: { splashed: 0, smokes: 0, doused: 0, halved: 0, kindles: 0, sniffedHits: 0 },
    };
    renderMoveButtons();
    Ember.setLevel(level); Ember.walkIn();
    $("rematch").hidden = true;
    const strength = L === 0 ? "warming up" : L === 8 ? "full strength" : `tougher ×${L}`;
    $("dew-level").textContent = diffKey === "normal" ? strength : `${D.label} · ${strength}`;
    bars(); setButtons(false); lines = []; hideIntent();
    Fx.clearBanner();                       // remove last spar's "wins!" banner
    log("Dewsnoot waddles in to guard his garden…");
    const c = Lessons.cheerLine();                           // your cheer, from practice/my-functions.js
    if (c) log(`${S.trainerName || "You"}: “${c}”`);
    Dew.walkIn(() => { newTurn(); log(`Your turn. The bubble shows his next move. Pick one of ${S.name}'s moves.`); });
  }

  function newTurn() { game.intent = chooseIntent(); showIntent(); setButtons(true); }

  async function playerMove(i) {
    if (busy || !game || game.over || !game.intent) return;
    busy = true; setButtons(false);
    const g = game, m = S.moves[i];
    let lands = Math.random() * 100 < m.chance;      // roll the dice
    let lucky = false;
    if (!lands && g.missStreak >= 2) { lands = true; lucky = true; }   // fairness rule
    g.missStreak = lands ? 0 : g.missStreak + 1;

    Fx.banner(`🔥 ${S.name} uses ${m.name}!`, "ember");
    if (m.kind === "hit") {
      Ember.play("attack"); Sound.play(m.power >= 12 ? "flare" : "spark"); Fx.shoot("ember", S.colors);
      await wait(420);
      if (!lands) {
        Fx.pop("dew", "MISS", "miss"); Sound.play("miss");
        // Kindle is saved until a hit actually lands, so a miss doesn't waste it.
        log(`${m.name} missed! Dewsnoot blinks, unimpressed.${g.charged ? " Your Kindle is still burning." : ""}`);
      }
      else {
        const kindled = g.charged;
        let power = (m.power + g.bonus) * (kindled ? 2 : 1);
        let extra = kindled ? " Kindled: double power!" : "";
        if (g.dewShield) {
          if (kindled) extra += " It burned straight through the Fern Shield!";
          else { power = Math.ceil(power / 2); extra += " The Fern Shield took half, then fell apart."; g.stats.halved++; }
          g.dewShield = false;
        }
        if (lucky) extra += " (Lucky break: no third miss in a row.)";
        g.dew.puff -= power;
        Dew.hurt(); Sound.play("hit"); Fx.pop("dew", `−${power}`, "dmg"); Fx.shake(kindled || power >= 14 ? "big" : "small");
        log(`${m.name} hits for ${power}.${extra}`);
        g.charged = false; Ember.setCharged(false);     // Kindle used up: it landed
      }
    } else if (m.kind === "dodge") {
      Ember.play("dodge"); Sound.play("smoke"); g.stats.smokes++;
      if (lands) { g.dodging = true; Fx.pop("ember", "HIDDEN", "info"); log(`${m.name}! ${S.name} is hard to see.${g.sniffed ? " But Dewsnoot has your scent…" : ""}`); }
      else { Fx.pop("ember", "FIZZLE", "miss"); log(`${m.name} fizzled. Nothing but a cough.`); }
    } else if (m.kind === "charge") {
      Ember.play("charge"); Sound.play("charge");
      if (g.charged) { Fx.pop("ember", "ALREADY ×2", "info"); log(`${S.name} is already kindled. The flames can't burn any hotter. Time to hit!`); }
      else if (lands) { g.charged = true; g.stats.kindles++; Ember.setCharged(true); Fx.pop("ember", "×2 NEXT HIT", "info"); log(`${m.name}! The flames burn hotter. Your next hit does double.`); }
      else { Fx.pop("ember", "FIZZLE", "miss"); log(`${m.name} sputtered out.`); }
    }
    bars();
    if (await checkEnd()) { busy = false; return; }
    await wait(1100);
    hideIntent();
    await dewTurn();
    bars();
    if (!(await checkEnd())) newTurn();
    busy = false;
  }

  async function dewTurn() {
    const g = game, pick = g.intent, name = DEW_MOVES[pick].name;
    Fx.banner(`🌿 Dewsnoot uses ${name}!`, "dew");
    if (pick === "splash") {
      Dew.play("hello"); Dew.lunge(); await wait(250); Sound.play("splash"); Fx.shoot("dew"); await wait(380);
      if (g.dodging && !g.sniffed && Math.random() < DODGE) {
        const ctr = COUNTER + g.bonus;
        g.dew.puff -= ctr;
        Fx.pop("ember", "DODGED", "miss"); Sound.play("miss");
        await wait(250); Dew.hurt(); Sound.play("spark"); Fx.pop("dew", `−${ctr}`, "dmg"); Fx.shake("small");
        bars();
        log(`${name} splashes into the smoke and misses. ${S.name} counters for ${ctr}!`);
      } else {
        g.ember.puff -= g.dewHit; g.stats.splashed++; if (g.sniffed && g.dodging) g.stats.sniffedHits++;
        Ember.play("hurt"); Sound.play("hit"); Fx.pop("ember", `−${g.dewHit}`, "dmg"); Fx.shake("small");
        let msg = `${name} hits for ${g.dewHit}.`;
        if (g.dodging && g.sniffed) msg = `${name} sniffs you out through the smoke and hits for ${g.dewHit}.`;
        if (g.charged) { g.charged = false; g.stats.doused++; Ember.setCharged(false); msg += " The dew douses your kindled flame!"; Fx.pop("ember", "DOUSED", "info", 300); }
        log(msg);
      }
      g.sniffed = false;
    } else if (pick === "shield") {
      Dew.play("focus"); Sound.play("shield"); g.dewShield = true; Fx.pop("dew", "SHIELD UP", "info");
      log(`${name}! His ferns fan out. Plain hits do half. A kindled hit burns through.`);
    } else if (pick === "stand") {
      Dew.play("wait"); g.stands++;
      const heal = Math.min(HEAL, g.dew.max - g.dew.puff); g.dew.puff += heal;
      Sound.play("heal"); Fx.sparkle("dew"); Fx.pop("dew", `+${heal}`, "heal");
      const left = MAX_STANDS - g.stands;
      log(`${name}. He digs in and gets back ${heal} puff. (${left === 0 ? "No heals left this spar." : left + " heal left."})`);
    } else {
      Dew.play("review"); Sound.play("sniff"); g.sniffed = true; Fx.pop("ember", "SCENTED", "info");
      log(`${name}. He learns your scent. His next splash can't be dodged.`);
    }
    g.dodging = false;                      // smoke only lasts one of his turns
    await wait(700);
  }

  // After a loss: one tip, based on what actually happened this spar.
  function lossTip(g) {
    const s = g.stats;
    if (s.splashed >= 3 && s.smokes === 0) return "Tip: when the bubble shows 💧 Splash, use Smoke Puff. He usually misses, and you counter.";
    if (s.halved >= 2) return "Tip: Fern Shield halves plain hits. Kindle first: a kindled hit burns straight through.";
    if (s.doused >= 1) return "Tip: a splash puts out Kindle. Kindle when the bubble shows 🌿, 💪 or 👃, not 💧.";
    if (s.sniffedHits >= 1) return "Tip: after 👃 Sniff, Smoke Puff can't fool his next splash. Hit him instead.";
    if (s.kindles === 0) return "Tip: try Kindle when he's about to shield, heal or sniff. Your next hit does double.";
    return "Tip: read the bubble over Dewsnoot before every move. Each of your moves answers one of his.";
  }

  async function checkEnd() {
    const g = game;
    if (g.dew.puff <= 0) {
      g.over = true; g.dew.puff = 0; g.sniffed = g.dewShield = false; bars(); hideIntent();
      Dew.play("oops", { hold: true }); Ember.play("win"); Sound.play("win"); Fx.shake("big");
      const streak = Lessons.recordWin();
      Fx.banner(`🔥 ${S.name} wins!${streak >= 2 ? ` ${streak} in a row!` : ""}`, "ember", true);
      log(`Dewsnoot sits down, out of puff. ${S.name}: “${S.victoryLine}”`);
      $("rematch").hidden = false; return true;
    }
    if (g.ember.puff <= 0) {
      g.over = true; g.ember.puff = 0; g.sniffed = g.dewShield = false; bars(); hideIntent();
      Ember.play("lose"); Dew.play("hop"); Sound.play("lose");
      Fx.banner("🌿 Dewsnoot wins this one", "dew", true);
      const lossesInRow = Lessons.recordLoss();
      log(`${S.name}'s flames burn low. Time for a nap.`);
      let tip = lossTip(g);
      if (lossesInRow >= 3 && g.diff !== "gentle") tip += " Want it easier for now? ☰ Menu → Gentle.";
      log(tip);
      $("rematch").hidden = false; return true;
    }
    return false;
  }

  // For the Console quest: look at the game's notes, and add puff.
  function state() { return game ? JSON.parse(JSON.stringify(game)) : null; }
  function addPuff(n) {
    if (!game || game.over || busy) return false;
    game.ember.puff = Math.min(game.ember.max + 30, game.ember.puff + n);
    bars(); Fx.pop("ember", `+${n}`, "heal"); Sound.play("heal"); return true;
  }
  const isBusy = () => busy;

  return { init, start, state, addPuff, isBusy, DIFFICULTY, emberMax, powerBonus };
})();

// ---- Flying effects, pop-up numbers, the action banner and heal sparkles ----
const Fx = (() => {
  const $ = id => document.getElementById(id);
  const target = who => document.getElementById(who === "ember" ? "ember-canvas" : "dew-sprite");
  function centre(who, fx, fy) {
    const arena = $("fx").getBoundingClientRect(), r = target(who).getBoundingClientRect();
    return { x: r.left + r.width * fx - arena.left, y: r.top + r.height * fy - arena.top };
  }

  // Sparks fly from Embersnoot (right) to Dewsnoot (left); dew drops the other way.
  function shoot(from, colors) {
    const layer = $("fx");
    const s = from === "ember" ? centre("ember", .2, .45) : centre("dew", .7, .45);
    const t = from === "ember" ? centre("dew", .5, .55) : centre("ember", .5, .6);
    for (let i = 0; i < 6; i++) {
      const d = document.createElement("span");
      d.className = from === "ember" ? "fx-spark" : "fx-drop";
      if (colors) d.style.background = `radial-gradient(circle, #fffbe6, ${colors.core} 40%, ${colors.flame} 60%, transparent 72%)`;
      layer.append(d);
      const j = () => (Math.random() - .5) * 30;
      d.animate([
        { transform: `translate(${s.x}px,${s.y}px) scale(.6)`, opacity: 1 },
        { transform: `translate(${(s.x + t.x) / 2 + j()}px,${Math.min(s.y, t.y) - 50 + j()}px) scale(1)`, opacity: 1, offset: .5 },
        { transform: `translate(${t.x + j()}px,${t.y + j()}px) scale(.4)`, opacity: 0 },
      ], { duration: 520 + i * 40, easing: "ease-in" }).onfinish = () => d.remove();
    }
  }

  // A word or number that floats up over a pet: "−8", "MISS", "+6"…
  function pop(who, text, kind, delay = 0) {
    setTimeout(() => {
      const p = centre(who, .5, .2), el = document.createElement("span");
      el.className = `fx-pop pop-${kind}`; el.textContent = text; $("fx").append(el);
      el.style.left = p.x + "px"; el.style.top = p.y + "px";
      el.animate([
        { transform: "translate(-50%,0) scale(.6)", opacity: 0 },
        { transform: "translate(-50%,-14px) scale(1.15)", opacity: 1, offset: .2 },
        { transform: "translate(-50%,-50px) scale(1)", opacity: 0 },
      ], { duration: 1300, easing: "ease-out" }).onfinish = () => el.remove();
    }, delay);
  }

  // Green sparkles rising (healing).
  function sparkle(who) {
    for (let i = 0; i < 10; i++) {
      const p = centre(who, .2 + Math.random() * .6, .55 + Math.random() * .3), el = document.createElement("span");
      el.className = "fx-heal"; el.textContent = "✦"; $("fx").append(el);
      el.style.left = p.x + "px"; el.style.top = p.y + "px";
      el.animate([{ transform: "translateY(0)", opacity: 0 }, { opacity: 1, offset: .3 }, { transform: "translateY(-60px)", opacity: 0 }],
        { duration: 900 + Math.random() * 500, delay: i * 60, easing: "ease-out" }).onfinish = () => el.remove();
    }
  }

  // The "Embersnoot uses Spark Flick!" banner across the top of the arena.
  // stay: true keeps it up (used for the result) until the next spar clears it.
  let bannerTimer;
  function banner(text, side, stay = false) {
    const b = $("action-banner");
    b.textContent = text; b.className = `action-banner show banner-${side}`;
    clearTimeout(bannerTimer);
    if (!stay) bannerTimer = setTimeout(clearBanner, 1300);
  }
  function clearBanner() { clearTimeout(bannerTimer); $("action-banner").className = "action-banner"; }

  // A little shake of the arena when a hit lands. Off for "reduce motion".
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function shake(size = "small") {
    if (still) return;
    const a = $("arena"); a.classList.remove("shake-small", "shake-big"); void a.offsetWidth;
    a.classList.add("shake-" + size);
    setTimeout(() => a.classList.remove("shake-" + size), 420);
  }

  return { shoot, pop, sparkle, banner, clearBanner, shake };
})();
