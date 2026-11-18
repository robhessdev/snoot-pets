// =========================================================
//  LESSONS — quests, the green/red checker bar, the
//  "Show me the code" panel, and saving your progress.
//
//  Progress is saved in your browser ("localStorage"), so it
//  stays on this browser on this computer. It never leaves
//  your machine. The "Start over" button wipes it.
// =========================================================

const Lessons = (() => {
  const KEY = "snoot-pets-progress-v1";
  const $ = id => document.getElementById(id);
  const D = DEFAULT_EMBERSNOOT;
  const isLocal = location.protocol === "file:";
  let S = null, result = null;
  let progress = { wins: 0, losses: 0, done: {} };

  function load() { try { const p = JSON.parse(localStorage.getItem(KEY)); if (p && p.done) progress = p; } catch (e) {} }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (e) {} }

  const fileOK = () => !result.fileBroken;

  // ---- THE QUESTS ----
  // Each quest: a title, WHY it matters, the steps, and a check that
  // looks at your settings to see if you've done it.
  const QUESTS = [
    {
      id: "win", title: "Win your first spar",
      why: "Play first, so you know what you're about to change.",
      steps: [
        "Pick a move under the arena. Watch what it does.",
        "Try <b>Kindle</b>, then a hit. Kindle doubles your next hit.",
        "Keep going until Dewsnoot sits down, out of puff.",
      ],
      check: () => progress.wins >= 1,
    },
    {
      id: "vscode", title: "Install VS Code and open the folder", manual: true,
      why: "VS Code is a free editor made for code. It colours the code so mistakes stand out, and it never sneaks in curly quotes like TextEdit does.",
      steps: [
        'Go to <b>code.visualstudio.com</b> and click <b>Download for Mac</b>.',
        "Open your <b>Downloads</b> folder and drag <b>Visual Studio Code</b> into <b>Applications</b>.",
        "Open VS Code. If your Mac asks “Are you sure?”, click <b>Open</b>.",
        "Click <b>File → Open Folder…</b>, then pick <b>Documents → Snoot-Pets</b>. If it asks whether you trust the authors, click <b>Yes</b> (that's you and Claude).",
        "In the list on the left, click <b>my-embersnoot.js</b>. That's your pet.",
      ],
      check: () => !!progress.done.vscode,
    },
    {
      id: "rename", title: "Rename your pet",
      why: "Words inside quotes are called a <b>string</b>. The game shows them, but doesn't try to run them as code.",
      steps: [
        'In <b>my-embersnoot.js</b>, find the line <code>name: "Embersnoot",</code>',
        "Change the word between the quotes to any name you like. Keep both quotes and the comma.",
        'Bonus: a few lines down, put <b>your</b> name in <code>trainerName: "",</code> (between the quotes). You can rename <code>teamName</code> too. Watch your badge in the arena change.',
        "Save: <b>⌘S</b>. Then come back here and reload: <b>⌘R</b>.",
      ],
      check: () => fileOK() && S.name !== D.name,
    },
    {
      id: "color", title: "Pick a new fire colour",
      why: 'Colours in code are <b>hex codes</b>: a # and 6 letters or numbers. <code>"#ff0000"</code> is red, <code>"#00aaff"</code> is sky blue. Your colour paints the sparks, glow and kindle shine around your pet.',
      steps: [
        'Find <code>flame: "#ff8a24",</code> inside the <b>colors</b> block.',
        "Search “color picker” in your browser, choose a colour, and copy its hex code.",
        "Paste it between the quotes. Keep the #. Save (⌘S), then reload here (⌘R). Watch the sparks, and try Kindle to see the glow.",
      ],
      check: () => fileOK() && (S.colors.flame !== D.colors.flame || S.colors.core !== D.colors.core),
    },
    {
      id: "power", title: "Make a move stronger",
      why: "Numbers without quotes are values the game can do maths with. <b>power</b> is subtracted from Dewsnoot's puff.",
      steps: [
        "Find the <b>moves</b> list. Pick a hit move, like Spark Flick.",
        "Change its <code>power: 8</code> to a bigger number (30 at most). No quotes around numbers.",
        "Save, reload, and click the <b>&lt;/&gt;</b> next to that move to see the new number at work.",
      ],
      check: () => fileOK() && S.moves.some((m, i) => D.moves[i] && m.kind === "hit" && m.power > D.moves[i].power),
    },
    {
      id: "newmove", title: "Invent a new move",
      why: "The moves are a <b>list</b>: the [ ] brackets hold several { } blocks, one per move. Adding a block adds a move.",
      steps: [
        "Select the whole Spark Flick line, from <code>{</code> to <code>},</code> and copy it (⌘C).",
        "Click at the end of the Kindle line, press Return for a new line, and paste (⌘V).",
        'Change the name, for example <code>name: "Ash Tackle",</code> and its numbers. Save, then reload.',
      ],
      check: () => fileOK() && S.moves.length > D.moves.length,
    },
    {
      id: "claude", title: "Ask Claude to make a change",
      why: "This is how you'll build bigger things: describe what you want in plain words, then read what Claude changed so you learn from it.",
      steps: [
        "Open the <b>Claude</b> app and switch to the <b>Code</b> tab at the top.",
        "Choose the <b>Snoot-Pets</b> folder in Documents as the folder to work in.",
        'Paste this: <code>In my-embersnoot.js, change victoryLine to something my pet would brag after winning. Change nothing else, then explain what you changed in two plain sentences.</code>',
        "In VS Code, look at the line Claude changed. Then reload here and win a spar to hear it.",
      ],
      check: () => fileOK() && S.victoryLine !== D.victoryLine,
    },
    {
      id: "git", title: "Make your first save point (Git)", manual: true,
      why: "Git takes a snapshot of your whole folder, called a <b>commit</b>. If you ever break something, you can jump back to any snapshot. Real developers use it every day, and it's how GitHub works.",
      steps: [
        "Open the <b>Claude</b> app, switch to the <b>Code</b> tab, and choose the <b>Snoot-Pets</b> folder.",
        'Paste this: <code>Set up Git in this folder and make my first save point (a commit) with the message "First save point". Then explain in plain words what Git just did, and how I would go back to a save point if I break something.</code>',
        "If your Mac asks to install <b>command line developer tools</b>, click <b>Install</b>, wait for it to finish, then ask Claude again.",
        "Read Claude's explanation. From now on, when the game reminds you, ask Claude: <i>“Make a save point with a short message about what I changed.”</i>",
      ],
      check: () => !!progress.done.git,
    },
  ];

  const level = () => QUESTS.filter(q => progress.done[q.id]).length;

  const UNLOCKS = {
    5: 'auraColor unlocked! Try  auraColor: "#ff4fa0",  in my-embersnoot.js for a glow.',
    7: "One quest left: save points with Git.",
    8: "Every quest done! Free play is open. The ideas are in the quest panel.",
  };

  function evaluate() {
    const newly = [];
    for (const q of QUESTS) if (!progress.done[q.id] && !q.manual && q.check()) { progress.done[q.id] = true; newly.push(q); }
    if (newly.length) save();
    return newly;
  }

  function celebrate(newly) {
    if (!newly.length) return;
    const lv = level();
    let msg = `✓ Quest complete: ${newly.map(q => q.title).join(", ")}. ${S.name} is now Level ${lv}.`;
    msg += " 📓 New Notebook card unlocked.";
    if (UNLOCKS[lv]) msg += " " + UNLOCKS[lv];
    else if (lv < QUESTS.length) msg += " Dewsnoot will be a little tougher next spar.";
    toast(msg);
    Ember.setLevel(lv);
    renderNotebook();
    setTimeout(maybeRemindSave, 400);
  }

  // ---- 📓 Notebook: chapters of flashcards, one card at a time ----
  const C = NOTEBOOK_CHAPTERS;
  const unlocked = card => !card.quest || !!progress.done[card.quest];
  const questNumber = id => QUESTS.findIndex(q => q.id === id) + 1;
  let nbCh = 0, nbIdx = 0;          // which chapter, which card (the last spot is the question)

  // Keeps the little number on the Notebook button up to date.
  function renderNotebook() {
    const seen = progress.seen || [];
    const fresh = C.flatMap(ch => ch.cards).filter(c => unlocked(c) && !seen.includes(c.id)).length;
    $("nb-count").textContent = fresh ? String(fresh) : "";
    if (!$("notebook").hidden) drawNotebook();
  }

  function drawNotebook() {
    const ch = C[nbCh], seen = progress.seen || (progress.seen = []);
    // chapter tabs
    $("nb-tabs").innerHTML = "";
    C.forEach((c, i) => {
      const open = c.cards.filter(unlocked).length, done = progress.checks && progress.checks[c.id];
      const b = document.createElement("button");
      b.type = "button"; b.className = "nb-tab"; b.setAttribute("aria-pressed", String(i === nbCh));
      b.innerHTML = `<span class="nb-tab-icon">${c.icon}</span><span><b>${i + 1}. ${c.title}</b><small>${open}/${c.cards.length} cards${done ? " · ✓" : ""}</small></span>`;
      b.addEventListener("click", () => { nbCh = i; nbIdx = 0; drawNotebook(); });
      $("nb-tabs").append(b);
    });
    // the card (or the question)
    const box = $("nb-card");
    if (nbIdx < ch.cards.length) {
      const card = ch.cards[nbIdx];
      if (!unlocked(card)) {
        box.className = "nb-card locked";
        box.innerHTML = `<p class="nb-from">🔒 Locked</p><h3>${card.title}</h3><p>Finish <b>Quest ${questNumber(card.quest)}</b> to unlock this card.</p>`;
      } else {
        const isNew = !seen.includes(card.id);
        if (isNew) { seen.push(card.id); save(); }
        box.className = "nb-card";
        box.innerHTML = `<p class="nb-from">${card.from}${isNew ? " · new" : ""}</p><h3>${card.title}</h3>
          <div class="nb-part"><p class="nb-label">What it is</p><p>${card.what}</p></div>
          <div class="nb-part"><p class="nb-label">Example</p>${card.example}</div>
          <div class="nb-part nb-remember"><p class="nb-label">Remember</p><p>${card.remember}</p></div>`;
      }
    } else drawCheck(box, ch);
    // dots + back/next
    const total = ch.cards.length + 1;
    $("nb-dots").innerHTML = Array.from({ length: total }, (_, i) =>
      `<span class="nb-dot${i === nbIdx ? " on" : ""}${i === total - 1 ? " q" : ""}">${i === total - 1 ? "?" : ""}</span>`).join("");
    $("nb-back").disabled = nbCh === 0 && nbIdx === 0;
    $("nb-next").textContent = nbIdx === total - 1 ? (nbCh < C.length - 1 ? "Next chapter →" : "Done") : "Next →";
    $("nb-count").textContent = "";
    renderBadgeOnly();
  }
  function renderBadgeOnly() {
    const fresh = C.flatMap(ch => ch.cards).filter(c => unlocked(c) && !(progress.seen || []).includes(c.id)).length;
    $("nb-count").textContent = fresh ? String(fresh) : "";
  }

  // The "check yourself" question at the end of each chapter.
  function drawCheck(box, ch) {
    const allOpen = ch.cards.every(unlocked);
    progress.checks = progress.checks || {};
    if (!allOpen) {
      box.className = "nb-card locked";
      box.innerHTML = `<p class="nb-from">🔒 Check yourself</p><h3>One quick question</h3><p>Unlock every card in this chapter first. Quests unlock them.</p>`;
      return;
    }
    const k = ch.check, done = progress.checks[ch.id];
    box.className = "nb-card nb-check";
    box.innerHTML = `<p class="nb-from">Check yourself${done ? " · ✓ answered" : ""}</p><h3>${k.q}</h3><div class="nb-options"></div><p class="nb-feedback" aria-live="polite"></p>`;
    k.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "nb-option"; b.textContent = opt;
      b.addEventListener("click", () => {
        const fb = box.querySelector(".nb-feedback");
        box.querySelectorAll(".nb-option").forEach(o => o.classList.remove("right", "wrong"));
        if (i === k.answer) {
          b.classList.add("right");
          fb.className = "nb-feedback good"; fb.innerHTML = `<b>✓ Yes!</b> ${k.why}`;
          if (!progress.checks[ch.id]) { progress.checks[ch.id] = true; save(); Sound.play("win"); }
          box.querySelector(".nb-from").textContent = "Check yourself · ✓ answered";
        } else {
          b.classList.add("wrong");
          fb.className = "nb-feedback bad"; fb.innerHTML = "<b>Not quite.</b> Have another look at the cards in this chapter, then try again.";
          Sound.play("miss");
        }
      });
      box.querySelector(".nb-options").append(b);
    });
    if (done) { const b = box.querySelectorAll(".nb-option")[k.answer]; b.classList.add("right"); }
  }

  function nbStep(dir) {
    const total = C[nbCh].cards.length + 1;
    nbIdx += dir;
    if (nbIdx >= total) { if (nbCh < C.length - 1) { nbCh++; nbIdx = 0; } else { closeNotebook(); return; } }
    if (nbIdx < 0) { if (nbCh > 0) { nbCh--; nbIdx = C[nbCh].cards.length; } else nbIdx = 0; }
    drawNotebook();
  }

  const hasCard = questId => C.some(ch => ch.cards.some(c => c.quest === questId));
  function openNotebookAt(questId) {
    C.forEach((ch, i) => ch.cards.forEach((c, j) => { if (c.quest === questId) { nbCh = i; nbIdx = j; } }));
    $("notebook").hidden = false; drawNotebook(); $("notebook-close").focus();
  }

  function openNotebook() {
    // Start at the first new card, if there is one.
    const seen = progress.seen || [];
    outer: for (let i = 0; i < C.length; i++) for (let j = 0; j < C[i].cards.length; j++) {
      const c = C[i].cards[j];
      if (unlocked(c) && !seen.includes(c.id)) { nbCh = i; nbIdx = j; break outer; }
    }
    $("notebook").hidden = false; drawNotebook(); $("notebook-close").focus();
  }
  function closeNotebook() { $("notebook").hidden = true; renderBadgeOnly(); }

  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toast.timer); toast.timer = setTimeout(() => t.hidden = true, 9000);
  }

  // ---- The green/red bar at the top ----
  function renderChecker() {
    const bar = $("checker");
    if (result.problems.length) {
      bar.className = "checker bad";
      const items = result.problems.slice(0, 4).map(p => p.msg.startsWith(p.where) ? `<li>${esc(p.msg)}</li>` : `<li><b>${esc(p.where)}:</b> ${esc(p.msg)}</li>`).join("");
      const more = result.problems.length > 4 ? `<li>…and ${result.problems.length - 4} more. Fix these first.</li>` : "";
      bar.innerHTML = `<p class="checker-title">✗ Something in my-embersnoot.js needs a fix</p><ul>${items}${more}</ul>
        <p class="checker-foot">${result.fileBroken ? "The game is using the original Embersnoot until the file can be read." : "The game used safe values for these, so it still works."} Fix it, save (⌘S), reload (⌘R). Or ask Claude: <i>“Fix my-embersnoot.js and explain what was wrong.”</i></p>`;
    } else {
      bar.className = "checker good";
      const changed = S.name !== D.name ? ` Meet ${esc(S.name)}.` : "";
      bar.innerHTML = `<p class="checker-title">✓ my-embersnoot.js looks great.${changed}</p>`;
    }
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---- Quest panel ----
  function renderQuests() {
    const lv = level();
    $("level").textContent = `Level ${lv}`;
    const list = $("quest-list"); list.innerHTML = "";
    const current = QUESTS.find(q => !progress.done[q.id]);
    QUESTS.forEach((q, i) => {
      const li = document.createElement("li");
      const done = !!progress.done[q.id];
      li.className = "quest" + (done ? " done" : "") + (q === current ? " current" : "");
      li.innerHTML = `<span class="q-mark">${done ? "✓" : i + 1}</span><span class="q-title">${q.title}</span>`;
      // A finished quest becomes a button that opens its Notebook card.
      if (done && hasCard(q.id)) {
        const b = document.createElement("button"); b.type = "button";
        b.title = "Open this quest's Notebook card";
        b.innerHTML = li.innerHTML + '<span class="q-nb">📓</span>';
        b.addEventListener("click", () => openNotebookAt(q.id));
        li.innerHTML = ""; li.append(b);
      }
      list.append(li);
    });
    const card = $("quest-card");
    if (!current) {
      card.innerHTML = `<p class="eyebrow">FREE PLAY</p><h3>You finished every quest.</h3>
        <p>Embersnoot is yours to keep shaping. Some ideas, from easy to bold:</p>
        <ul class="ideas"><li>Give it ice-blue sparks: <code>flame: "#3fb8ff",</code> <code>core: "#e8fbff",</code></li>
        <li>Set an <code>auraColor</code> and invent a sixth move</li>
        <li>Ask Claude in the Code tab: “Add a new move kind called heal that gives Embersnoot back puff. Explain each line you add.”</li>
        <li>Ask Claude: “Add a second opponent. Keep it simple and explain the plan before you change anything.”</li></ul>`;
      return;
    }
    const steps = current.steps.map(s => `<li>${s}</li>`).join("");
    const needsFile = !current.manual && current.id !== "win";
    const previewNote = needsFile && !isLocal
      ? `<p class="preview-note">You're on the online preview, which can't see your Mac. Do this quest with the copy in <b>Documents → Snoot-Pets</b>: double-click <b>index.html</b> there.</p>` : "";
    const status = current.manual
      ? `<button type="button" class="primary" id="manual-done">I did it ✓</button>`
      : `<p class="q-status">Waiting for you… ${needsFile ? "This checks itself when you reload (⌘R)." : ""}</p>`;
    card.innerHTML = `<p class="eyebrow">QUEST ${QUESTS.indexOf(current) + 1} OF ${QUESTS.length}</p>
      <h3>${current.title}</h3><p class="why"><b>Why:</b> ${current.why}</p><ol class="steps">${steps}</ol>${previewNote}${status}`;
    if (current.manual) $("manual-done").addEventListener("click", () => {
      progress.done[current.id] = true; save(); celebrate([current]); renderQuests();
    });
  }

  function recordWin() { progress.wins++; save(); celebrate(evaluate()); renderQuests(); maybeRemindSave(); }
  function recordLoss() { progress.losses++; save(); maybeRemindSave(); }

  // ---- 💾 Save-point reminder ----
  // A "fingerprint" is your whole pet file written out as one line of text.
  // If it's different from the fingerprint at your last save point,
  // your pet has changed, so it's worth making a new save point.
  const fingerprint = () => JSON.stringify(S);
  let remindedFor = null;           // don't nag twice in one visit
  function maybeRemindSave() {
    if (result.fileBroken || result.problems.length) return;    // fix the red bar first
    const fp = fingerprint();
    if (fp === progress.savedPrint || fp === remindedFor) return;
    remindedFor = fp;
    const how = progress.done.git
      ? `Make one: in Claude's <b>Code</b> tab, say <i>“Make a save point with a short message about what I changed.”</i>`
      : `Your file is already saved (that's what ⌘S did). A save point is a backup you can go back to. For now, the quick way: in Finder, click <b>my-embersnoot.js</b> and press <b>⌘D</b> to make a copy. Quest 8 teaches proper save points with Git.`;
    $("save-reminder").innerHTML = `<p><b>💾 ${esc(S.name)} has changed since your last save point.</b> ${how}</p>
      <div class="save-actions"><button type="button" class="primary" id="saved-yes">I made a save point ✓</button><button type="button" class="chip" id="saved-later">Later</button></div>`;
    $("save-reminder").hidden = false;
    $("saved-yes").addEventListener("click", () => { progress.savedPrint = fp; save(); $("save-reminder").hidden = true; toast("💾 Save point noted. Nice habit."); });
    $("saved-later").addEventListener("click", () => $("save-reminder").hidden = true);
  }

  // ---- "Show me the code" ----
  function showPeek(title, code, notes, tryIt) {
    $("peek-title").textContent = title;
    $("peek-code").textContent = code;
    $("peek-notes").innerHTML = notes.map(([bit, words]) => `<li><code>${esc(bit)}</code> ${words}</li>`).join("");
    $("peek-try").innerHTML = tryIt || "";
    $("peek").hidden = false;
    $("peek").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function peekMove(i) {
    const m = S.moves[i];
    const line = `{ name: "${m.name}", kind: "${m.kind}", power: ${m.power}, chance: ${m.chance}, },`;
    const rule = {
      hit: `if (Math.random() * 100 < move.chance) {\n  dewsnoot.puff = dewsnoot.puff - move.power;\n}`,
      dodge: `if (Math.random() * 100 < move.chance) {\n  dodging = true;   // Dewsnoot's next splash will probably miss\n}`,
      charge: `if (Math.random() * 100 < move.chance) {\n  charged = true;   // the next hit's power gets doubled\n}`,
    }[m.kind];
    const notes = [
      [`name: "${m.name}"`, "the words on the button. It's a string, so it has quotes."],
      [`kind: "${m.kind}"`, m.kind === "hit" ? "tells the game this move knocks puff off Dewsnoot." : m.kind === "dodge" ? "tells the game to make Embersnoot hard to hit." : "tells the game to power up the next hit."],
      [`power: ${m.power}`, m.kind === "hit" ? `how much puff it takes away. A plain number, so no quotes.` : "not used by this kind of move, so it's 0."],
      [`chance: ${m.chance}`, `out of 100 tries, it works about ${m.chance} times.`],
      ["Math.random() * 100", "rolls a random number from 0 to 100, like dice."],
      ["if ( … ) { … }", "only runs the part inside { } when the roll is lower than the chance."],
    ];
    if (m.kind === "hit") notes.push(["dewsnoot.puff - move.power", "the minus takes the power away from Dewsnoot's puff."]);
    showPeek(`How “${m.name}” works`, `// In YOUR file, my-embersnoot.js:\n${line}\n\n// In the game rules (game-parts/battle.js), simplified:\n${rule}`, notes,
      `<b>Try it:</b> in my-embersnoot.js, change <code>chance: ${m.chance}</code> to a different number, save (⌘S), reload (⌘R), and open this panel again. Your new number will be here.`);
  }

  function peekTopic(topic) {
    if (topic === "bar") showPeek("How the puff bar knows how full to be",
      `bar.style.width = (puff / maxPuff * 100) + "%";`,
      [["puff / maxPuff", "puff left divided by puff at the start. Half left gives 0.5."],
       ["* 100", "turns 0.5 into 50."],
       ['+ "%"', "sticks a % sign on the end, so the bar is 50% wide."],
       ["bar.style.width =", "sets the width of the coloured bar on the page."]],
      "This is JavaScript (behaviour) changing CSS (looks) while the game runs.");
    if (topic === "dew") showPeek("How Dewsnoot moves",
      `// His picture is one big image with rows of little frames.\nsprite.style.backgroundPosition =\n  (-frame * 192) + "px " + (-row * 208) + "px";`,
      [["row", "which animation: row 0 is resting, row 5 is “oops”."],
       ["frame", "which picture in that row. It counts 0, 1, 2…"],
       ["* 192", "each frame is 192 pixels wide, so frame 2 starts at 384."],
       ["backgroundPosition", "slides the big image behind a small window, so you see one frame at a time."]],
      "<b>A fix Claude made:</b> the first version stopped one frame early, so his last pose never showed. Now it counts every frame. It's a classic beginner bug: computers start counting at 0, so 6 frames are numbered 0 to 5.");
    if (topic === "checker") showPeek("How the green/red bar checks your file",
      `const HEX = /^#[0-9a-fA-F]{6}$/;\nif (!HEX.test(colors.flame)) {\n  problems.push("Colours need a # and 6 letters/numbers");\n}`,
      [["/^#[0-9a-fA-F]{6}$/", "a pattern: a #, then exactly 6 of 0–9 or a–f. Programmers call this a regular expression."],
       [".test( … )", "asks “does this colour fit the pattern?”"],
       ["!", "means “not”. So: if it does NOT fit…"],
       ["problems.push( … )", "adds a message to the list the red bar shows."]],
      "Checking what people type and explaining problems kindly is a big part of real software.");
  }

  // ---- 🆕 What's new: shown once after each update round ----
  const VERSION = "round-3";
  const WHATS_NEW = [
    "Embersnoot is now <b>painted</b>, by Codex, to match Dewsnoot's style. It walks into the arena too.",
    "Your <b>fire colours</b> now paint the sparks, glow, kindle shine and the sparks it throws. (The painted body colours and shape settings were retired.)",
    "Click a <b>finished quest</b> (✓) to open its Notebook card.",
  ];
  function showWhatsNew() {
    if (progress.seenVersion === VERSION) return;
    if (!progress.seenVersion && !progress.wins && !Object.keys(progress.done).length) { progress.seenVersion = VERSION; save(); return; }   // brand-new player: nothing is "new"
    const box = $("whats-new");
    box.innerHTML = `<div><p><b>🆕 What's new</b></p><ul>${WHATS_NEW.map(w => `<li>${w}</li>`).join("")}</ul></div><button type="button" class="chip" id="whats-new-ok">Got it</button>`;
    box.hidden = false;
    $("whats-new-ok").addEventListener("click", () => { progress.seenVersion = VERSION; save(); box.hidden = true; });
  }

  function initStartOver() {
    const b = $("start-over"); let armed = false;
    b.addEventListener("click", () => {
      if (!armed) { armed = true; b.textContent = "Sure? Click again to wipe progress"; setTimeout(() => { armed = false; b.textContent = "Start over"; }, 4000); return; }
      progress = { wins: 0, losses: 0, done: {}, seen: [], checks: {} }; save(); location.reload();   // savedPrint resets too
    });
  }

  function init() {
    load();
    result = Checker.check(); S = result.settings;
    if (!progress.savedPrint && !result.problems.length) { progress.savedPrint = JSON.stringify(S); save(); }
    renderChecker();
    if (!isLocal) $("preview-banner").hidden = false;
    document.querySelectorAll(".pet-name").forEach(el => el.textContent = S.name);
    // Your badge: "ROBIN · TEAM FLAME 🔥", or "YOU · TEAM FLAME 🔥" with no name.
    $("badge-you").textContent = `${(S.trainerName || "You").toUpperCase()} · ${S.teamName.toUpperCase()} 🔥`;
    document.title = `Snoot Pets — ${S.name} vs Dewsnoot`;
    Ember.mount($("ember-canvas"), S);
    Dew.mount($("dew-sprite"), $("dew-mover"));
    const newly = evaluate();
    Ember.setLevel(level());
    renderQuests(); celebrate(newly);
    document.querySelectorAll("[data-peek]").forEach(b => b.addEventListener("click", () => peekTopic(b.dataset.peek)));
    $("peek-close").addEventListener("click", () => $("peek").hidden = true);
    initStartOver();
    showWhatsNew();
    Sound.bindToggle($("sound-toggle"));
    renderNotebook();
    $("notebook-open").addEventListener("click", openNotebook);
    $("notebook-close").addEventListener("click", closeNotebook);
    $("nb-back").addEventListener("click", () => nbStep(-1));
    $("nb-next").addEventListener("click", () => nbStep(1));
    document.addEventListener("keydown", e => {
      if ($("notebook").hidden) return;
      if (e.key === "Escape") closeNotebook();
      if (e.key === "ArrowRight") nbStep(1);
      if (e.key === "ArrowLeft") nbStep(-1);
    });
    Battle.init(S); Battle.start();
  }

  return { init, level, recordWin, recordLoss, peekMove };
})();

Lessons.init();
