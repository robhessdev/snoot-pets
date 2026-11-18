// =========================================================
//  BATTLE RULES — a friendly spar. Nobody gets hurt: whoever
//  runs out of "puff" first sits down for a rest.
//
//  Fire is strong against ferns, but dew puts fire out,
//  so neither pet always wins.
//
//  Kindle doubles your next hit that LANDS. A miss doesn't waste it,
//  but Dewsnoot's dew can put it out.
//
//  Two fairness rules:
//   • You can't miss more than twice in a row.
//   • Dewsnoot can only use Stubborn Stand (healing) twice per spar.
// =========================================================

const Battle = (() => {
  let S = null, game = null, busy = false;
  const $ = id => document.getElementById(id);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // Dewsnoot's moves. He's the opponent, so these stay the same.
  const DEW_MOVES = {
    splash: { name: "Dew Splash" },
    shield: { name: "Fern Shield" },
    stand:  { name: "Stubborn Stand" },
    sniff:  { name: "Snout Sniff" },
  };
  const MAX_STANDS = 2;

  function init(settings) {
    S = settings;
    renderMoveButtons();
    $("rematch").addEventListener("click", start);
  }

  function renderMoveButtons() {
    const box = $("moves"); box.innerHTML = "";
    S.moves.forEach((m, i) => {
      const wrap = document.createElement("div"); wrap.className = "move";
      const b = document.createElement("button");
      b.type = "button"; b.className = "move-btn"; b.dataset.i = i;
      const detail = m.kind === "hit" ? `power ${m.power}` : m.kind;
      b.innerHTML = `<span class="move-name"></span><span class="move-detail">${detail} · ${m.chance}%</span>`;
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
  }

  function start() {
    const level = Lessons.level();
    // Dewsnoot gets a little tougher each time Embersnoot levels up,
    // until Level 8. After that his strength stays the same.
    const L = Math.min(level, 8);
    game = {
      level,
      ember: { puff: 40, max: 40 },
      dew: { puff: 30 + L * 4, max: 30 + L * 4 },
      dewHit: 7 + Math.floor(L / 2),
      dewSmart: Math.min(.85, .15 + L * .1),
      charged: false, dodging: false, dewShield: false, over: false,
      missStreak: 0, stands: 0,
    };
    Ember.setLevel(level); Ember.walkIn();
    $("rematch").hidden = true;
    $("dew-level").textContent = L === 0 ? "gentle" : L === 8 ? "full strength" : `tougher ×${L}`;
    bars(); setButtons(false); lines = [];
    Fx.clearBanner();                       // remove last spar's "wins!" banner
    log("Dewsnoot waddles in to guard his garden…");
    const c = Lessons.cheerLine();                           // your cheer, from practice/my-functions.js
    if (c) log(`${S.trainerName || "You"}: “${c}”`);
    Dew.walkIn(() => { log(`Your turn. Pick one of ${S.name}'s moves below.`); setButtons(true); });
  }

  async function playerMove(i) {
    if (busy || game.over) return;
    busy = true; setButtons(false);
    const m = S.moves[i];
    let lands = Math.random() * 100 < m.chance;      // roll the dice
    let lucky = false;
    if (!lands && game.missStreak >= 2) { lands = true; lucky = true; }   // fairness rule
    game.missStreak = lands ? 0 : game.missStreak + 1;

    Fx.banner(`🔥 ${S.name} uses ${m.name}!`, "ember");
    if (m.kind === "hit") {
      Ember.play("attack"); Sound.play(m.power >= 12 ? "flare" : "spark"); Fx.shoot("ember", S.colors);
      await wait(420);
      if (!lands) {
        Fx.pop("dew", "MISS", "miss"); Sound.play("miss");
        // Kindle is saved until a hit actually lands, so a miss doesn't waste it.
        log(`${m.name} missed! Dewsnoot blinks, unimpressed.${game.charged ? " Your Kindle is still burning." : ""}`);
      }
      else {
        let power = m.power * (game.charged ? 2 : 1);
        let extra = game.charged ? " Kindled: double power!" : "";
        if (game.dewShield) { power = Math.ceil(power / 2); extra += " The Fern Shield took half, then burned away."; game.dewShield = false; }
        if (lucky) extra += " (Lucky break: no third miss in a row.)";
        game.dew.puff -= power;
        Dew.hurt(); Sound.play("hit"); Fx.pop("dew", `−${power}`, "dmg");
        log(`${m.name} hits for ${power}.${extra}`);
        game.charged = false; Ember.setCharged(false);     // Kindle used up: it landed
      }
    } else if (m.kind === "dodge") {
      Ember.play("dodge"); Sound.play("smoke");
      if (lands) { game.dodging = true; Fx.pop("ember", "HIDDEN", "info"); log(`${m.name}! ${S.name} is hard to see. Dewsnoot will probably miss.`); }
      else { Fx.pop("ember", "FIZZLE", "miss"); log(`${m.name} fizzled. Nothing but a cough.`); }
    } else if (m.kind === "charge") {
      Ember.play("charge"); Sound.play("charge");
      if (game.charged) { Fx.pop("ember", "ALREADY ×2", "info"); log(`${S.name} is already kindled. The flames can't burn any hotter. Time to hit!`); }
      else if (lands) { game.charged = true; Ember.setCharged(true); Fx.pop("ember", "×2 NEXT HIT", "info"); log(`${m.name}! The flames burn hotter. Your next hit does double.`); }
      else { Fx.pop("ember", "FIZZLE", "miss"); log(`${m.name} sputtered out.`); }
    }
    bars();
    if (await checkEnd()) { busy = false; return; }
    await wait(1200);
    await dewTurn();
    bars();
    if (!(await checkEnd())) { setButtons(true); }
    busy = false;
  }

  function chooseDewMove() {
    const g = game, canStand = g.stands < MAX_STANDS;
    let pick;
    if (Math.random() < g.dewSmart) {                       // a smart choice
      if (g.charged) pick = "splash";                       // douse the kindled flame
      else if (g.dodging) pick = "sniff";                   // sniff through the smoke
      else if (canStand && g.dew.puff < g.dew.max * .4 && Math.random() < .6) pick = "stand";
      else pick = Math.random() < .7 ? "splash" : "shield";
    } else {
      const pool = ["splash", "splash", "splash", "shield", "stand", "sniff"];   // a random choice
      pick = pool[Math.floor(Math.random() * pool.length)];
    }
    // Fairness rule: only 2 heals. And never heal when already at full puff.
    if (pick === "stand" && (!canStand || g.dew.puff >= g.dew.max)) pick = "splash";
    return pick;
  }

  async function dewTurn() {
    const g = game, pick = chooseDewMove(), name = DEW_MOVES[pick].name;
    Fx.banner(`🌿 Dewsnoot uses ${name}!`, "dew");
    if (pick === "splash") {
      Dew.play("hello"); Dew.lunge(); await wait(250); Sound.play("splash"); Fx.shoot("dew"); await wait(380);
      if (g.dodging && Math.random() < .75) { Fx.pop("ember", "MISS", "miss"); Sound.play("miss"); log(`${name}… but ${S.name} vanished in smoke. Miss!`); }
      else {
        g.ember.puff -= g.dewHit; Ember.play("hurt"); Sound.play("hit"); Fx.pop("ember", `−${g.dewHit}`, "dmg");
        let msg = `${name} hits for ${g.dewHit}.`;
        if (g.charged) { g.charged = false; Ember.setCharged(false); msg += " The dew douses the kindled flame!"; Fx.pop("ember", "DOUSED", "info", 300); }
        log(msg);
      }
      g.dodging = false;
    } else if (pick === "shield") {
      Dew.play("focus"); Sound.play("shield"); g.dewShield = true; Fx.pop("dew", "SHIELD UP", "info");
      log(`${name}! His ferns fan out. Your next hit will do half.`);
    } else if (pick === "stand") {
      Dew.play("wait"); g.stands++;
      const heal = Math.min(6, g.dew.max - g.dew.puff); g.dew.puff += heal;
      Sound.play("heal"); Fx.sparkle("dew"); Fx.pop("dew", `+${heal}`, "heal");
      const left = MAX_STANDS - g.stands;
      log(`${name}. He digs in and gets back ${heal} puff. (${left === 0 ? "No heals left this spar." : left + " heal left."})`);
    } else {
      Dew.play("review"); Sound.play("sniff"); const had = g.dodging; g.dodging = false;
      if (had) Fx.pop("ember", "FOUND YOU", "info");
      log(had ? `${name}. He sniffs straight through the smoke. No hiding now.` : `${name}. He sniffs the air suspiciously. Nothing happens.`);
    }
    await wait(700);
  }

  async function checkEnd() {
    const g = game;
    if (g.dew.puff <= 0) {
      g.over = true; g.dew.puff = 0; bars();
      Dew.play("oops", { hold: true }); Ember.play("win"); Sound.play("win");
      Fx.banner(`🔥 ${S.name} wins!`, "ember", true);
      log(`Dewsnoot sits down, out of puff. ${S.name}: “${S.victoryLine}”`);
      Lessons.recordWin();
      $("rematch").hidden = false; return true;
    }
    if (g.ember.puff <= 0) {
      g.over = true; g.ember.puff = 0; bars();
      Ember.play("lose"); Dew.play("hop"); Sound.play("lose");
      Fx.banner("🌿 Dewsnoot wins this one", "dew", true);
      log(`${S.name}'s flames burn low. Time for a nap. Dewsnoot looks very pleased with himself.`);
      Lessons.recordLoss();
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

  return { init, start, state, addPuff };
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

  return { shoot, pop, sparkle, banner, clearBanner };
})();
