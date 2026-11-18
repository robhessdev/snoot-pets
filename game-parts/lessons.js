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
  const extras = Checker.checkExtras();      // your lore, your quests, and the practice files

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
        "Try <b>Kindle</b>, then a hit. Kindle doubles your next hit that lands, unless Dewsnoot's dew puts it out first.",
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

    // ================= TIER 2: EXPLORER — look inside things =================
    {
      id: "changes", tier: 2, title: "Read the changes", manual: true,
      why: "A <b>diff</b> shows exactly what changed: red lines removed, green lines added. Reading diffs is how you check what Claude, or anyone, really did.",
      steps: [
        'Open your project on GitHub and click <b>Commits</b> to see your save points (for this project: <a href="https://github.com/robhessdev/snoot-pets/commits/main" target="_blank" rel="noopener">github.com/robhessdev/snoot-pets/commits/main</a>). Click the top one. Red lines were removed, green lines were added.',
        "In VS Code, change one small thing in <b>my-embersnoot.js</b> (your victoryLine, say) and save.",
        "Click the <b>Source Control</b> icon on VS Code's left edge (three dots joined by lines). Click <b>my-embersnoot.js</b> under Changes: there's your change in red and green, before you've even made a save point.",
      ],
      check: () => !!progress.done.changes,
    },
    {
      id: "peek", tier: 2, title: "Peek under the hood",
      why: "Every website is code running on your own computer, and the browser's <b>Console</b> lets you look inside it, and even change things, while it runs.",
      steps: [
        "Open the developer tools. <b>Chrome:</b> press <b>⌥⌘J</b> (Option + Command + J). <b>Safari:</b> first turn on Safari → Settings → Advanced → <i>Show features for web developers</i>, then press <b>⌥⌘C</b>.",
        "A panel opens. Click the <b>Console</b> tab if it isn't showing.",
        "Click in it and type <code>snoot.state()</code> then press Return. That's the game's live notes (its \"state\"): puff, kindled or not, and more. Type it yourself: some browsers block pasting into the Console.",
        "Now type <code>snoot.givePuff(10)</code> and press Return. Watch your puff bar jump.",
      ],
      check: () => !!(progress.flags && progress.flags.peek),
    },
    {
      id: "bughunt", tier: 2, title: "Bug hunt",
      why: "<b>Debugging</b> means finding why code does something different from what it should. Here the notes say what each bit of code should do. Find where the code disagrees.",
      steps: [
        "In VS Code, open the <b>practice</b> folder, then <b>bug-hunt.js</b>.",
        "Read each NOTE, then the code under it. Does the code do what the note says?",
        "Fix the code (not the note). Save (⌘S) and reload here (⌘R). The board below turns green as you fix each bug.",
      ],
      extra: () => board("🐞 Bug Hunt board", runTests(BUG_TESTS)) +
        '<details class="hint"><summary>Hint for bug 1</summary><p>Look at the symbol between <code>puff</code> and <code>5</code>. Does it add, or take away?</p></details>' +
        '<details class="hint"><summary>Hint for bug 2</summary><p><code>&gt;</code> means "more than", and 12 isn\'t more than 12. The symbol for "more than or equal to" is two characters: <code>&gt;=</code></p></details>',
      check: () => runTests(BUG_TESTS).every(t => t.ok),
    },
    {
      id: "functions", tier: 2, title: "Write your first function",
      why: "A <b>function</b> is a little machine: give it something, it gives something back. Almost all code is made of them, and you've been using the game's all along.",
      steps: [
        "In VS Code, open <b>practice → my-functions.js</b>.",
        "Read the notes. Change the line inside <code>powerUp</code> so it gives back the power plus 5.",
        "Save and reload. The board below checks your function. Try the bonus too: a working <code>cheer</code> shows up at the start of every spar.",
      ],
      extra: () => board("✏️ Function board", runTests(FN_TESTS)) + (cheerLine() ? `<p class="board-bonus">⭐ Bonus working: “${esc(cheerLine())}”</p>` : '<p class="board-bonus">Bonus (optional): make <code>cheer</code> work too.</p>'),
      check: () => runTests(FN_TESTS).every(t => t.ok),
    },

    // ================= TIER 3: BUILDER — work with AI agents =================
    {
      id: "subagent", tier: 3, title: "Make a subagent", manual: true,
      why: "A <b>subagent</b> is a helper AI with its own job description. Claude Code hands it a task and gets a report back. You'll write one from scratch: it's just a short text file.",
      steps: [
        "In VS Code's file list, make a new folder named <code>.claude</code> (with the dot), and inside it a folder named <code>agents</code>.",
        "Inside <code>agents</code>, make a new file named <code>snoot-reviewer.md</code>.",
        'Type this in, then save. The lines between the <code>---</code> marks are its name tag; the rest is its job description:<pre>---\nname: snoot-reviewer\ndescription: Reviews changes to the Snoot Pets game and explains problems in plain words for a beginner.\ntools: Read, Grep, Glob\n---\nYou review the Snoot Pets game. Read the files you are asked about,\nlook for bugs or confusing text, and explain each problem in one or\ntwo plain sentences a beginner can follow. Do not change any files.</pre>',
        'In the Claude app\'s <b>Code</b> tab (Snoot-Pets folder), paste: <code>Use the snoot-reviewer subagent to review practice/my-functions.js and my-embersnoot.js.</code> Watch for <b>snoot-reviewer</b> appearing as it works. If Claude can\'t find it, start a new Code session and try again.',
      ],
      check: () => !!progress.done.subagent,
    },
    {
      id: "terminal", tier: 3, title: "Claude and Codex talk", manual: true,
      why: "The <b>terminal</b> lets one program run another by typing a command. That's how one AI can send another a message and read its answer.",
      steps: [
        "Open the <b>Code</b> tab (Snoot-Pets folder).",
        'Paste: <code>Check whether the Codex command-line tool (codex) is installed. If not, walk me through installing it (Homebrew: brew install codex) and signing in with my ChatGPT account. Then use codex exec to ask Codex: "In game-parts/battle.js, what does chooseDewMove do, in two sentences?" Show me exactly what you sent and what Codex answered. Then send Codex one follow-up question and show that too. Do not change any files.</code>',
        "Approve the install and sign-in when asked. Then read the conversation: every message is one command in, one answer out.",
      ],
      check: () => !!progress.done.terminal,
    },
    {
      id: "myquest", tier: 3, title: "Design your own quest",
      why: "Each quest in this game is just data: a title, a hint and a tiny check. Designing one shows you understand how the whole thing fits together.",
      steps: [
        "In VS Code, open <b>my-quests.js</b> and read the notes at the top.",
        "Switch on the example by deleting the <code>//</code> at the start of its line, or write your own quest.",
        "Save and reload. Your quest appears under <b>⭐ Your quests</b>, and turns ✓ when its check comes true.",
      ],
      check: () => myQuests().length > 0,
    },
  ];

  const level = () => QUESTS.filter(q => progress.done[q.id]).length;
  const TIERS = { 1: "Starter", 2: "Explorer", 3: "Builder" };
  const tierOf = q => q.tier || 1;

  const UNLOCKS = {
    5: 'auraColor unlocked! Try  auraColor: "#ff4fa0",  in my-embersnoot.js for a glow.',
    7: "One Starter quest left: save points with Git.",
    8: "🧭 Tier 2, Explorer, is open: time to look inside the game.",
    12: "🛠️ Tier 3, Builder, is open: time to work with AI agents.",
    15: "Every quest done! Free play is open. The ideas are in the quest panel.",
  };

  // ---- Practice boards: the game runs your functions and checks the answers ----
  const BUG_TESTS = [
    { label: "luckyBonus(40) gives 45", run: () => luckyBonus(40), want: 45 },
    { label: "isBigHit(12) gives true", run: () => isBigHit(12), want: true },
    { label: "isBigHit(11) gives false", run: () => isBigHit(11), want: false },
  ];
  const FN_TESTS = [
    { label: "powerUp(8) gives 13", run: () => powerUp(8), want: 13 },
    { label: "powerUp(20) gives 25", run: () => powerUp(20), want: 25 },
  ];
  function runTests(tests) {
    return tests.map(t => {
      try { const got = t.run(); return { label: t.label, ok: got === t.want, got }; }
      catch (e) { return { label: t.label, ok: false, err: "the file couldn't be read. Check the red bar at the top." }; }
    });
  }
  function board(title, rows) {
    const items = rows.map(r => r.ok ? `<li class="ok">✓ ${esc(r.label)}</li>`
      : `<li class="no">✗ ${esc(r.label)}: ${r.err ? r.err : "right now it gives " + esc(JSON.stringify(r.got))}</li>`).join("");
    return `<div class="board"><p class="board-title">${title}</p><ul>${items}</ul></div>`;
  }
  // Your cheer from practice/my-functions.js, if it works (used at the start of a spar).
  function cheerLine() {
    try { const c = typeof cheer === "function" ? cheer(S.name) : ""; return typeof c === "string" && c.trim() ? c.trim().slice(0, 80) : ""; }
    catch (e) { return ""; }
  }
  const myQuests = () => extras.quests;

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
    else if (lv <= 8) msg += " Dewsnoot will be a little tougher next spar.";
    const lore = extras.lore.filter(l => l.unlockAt === lv);
    if (lore.length) msg += ` 📜 New lore: ${lore.map(l => l.title).join(", ")}.`;
    toast(msg);
    Ember.setLevel(lv);
    renderNotebook();
    setTimeout(maybeRemindSave, 400);
  }

  // ---- 📓 Notebook: chapters of flashcards, one card at a time ----
  const C = NOTEBOOK_CHAPTERS.concat([{
    id: "lore", title: "Hollowmere lore", icon: "📜",
    cards: extras.lore.map((l, i) => ({ id: "lore-" + i, lore: true, title: l.title, text: l.text, unlockAt: l.unlockAt })),
  }]);
  const unlocked = card => card.lore ? level() >= card.unlockAt : (!card.quest || !!progress.done[card.quest]);
  const spots = ch => ch.cards.length + (ch.check ? 1 : 0);      // cards, plus the question if there is one
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
        box.innerHTML = card.lore
          ? `<p class="nb-from">🔒 Locked lore</p><h3>${esc(card.title)}</h3><p>Reach <b>Level ${card.unlockAt}</b> to read this one.</p>`
          : `<p class="nb-from">🔒 Locked</p><h3>${card.title}</h3><p>Finish <b>Quest ${questNumber(card.quest)}</b> to unlock this card.</p>`;
      } else if (card.lore) {
        const isNew = !seen.includes(card.id);
        if (isNew) { seen.push(card.id); save(); }
        box.className = "nb-card nb-lore";
        box.innerHTML = `<p class="nb-from">Lore · from my-lore.js${isNew ? " · new" : ""}</p><h3>${esc(card.title)}</h3><p class="lore-text">${esc(card.text)}</p>`;
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
    const total = spots(ch), q = !!ch.check;
    $("nb-dots").innerHTML = Array.from({ length: total }, (_, i) =>
      `<span class="nb-dot${i === nbIdx ? " on" : ""}${q && i === total - 1 ? " q" : ""}">${q && i === total - 1 ? "?" : ""}</span>`).join("");
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
    const total = spots(C[nbCh]);
    nbIdx += dir;
    if (nbIdx >= total) { if (nbCh < C.length - 1) { nbCh++; nbIdx = 0; } else { closeNotebook(); return; } }
    if (nbIdx < 0) { if (nbCh > 0) { nbCh--; nbIdx = spots(C[nbCh]) - 1; } else nbIdx = 0; }
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
      const files = [...new Set(result.problems.map(p => p.file || "my-embersnoot.js"))];
      bar.innerHTML = `<p class="checker-title">✗ Something in ${files.join(" and ")} needs a fix</p><ul>${items}${more}</ul>
        <p class="checker-foot">${result.fileBroken ? "The game is using the original Embersnoot until the file can be read." : "The game used safe values where it could, so it still works."} Fix it, save (⌘S), reload (⌘R). Or ask Claude: <i>“Fix ${files[0]} and explain what was wrong.”</i></p>`;
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
      if (i === 0 || tierOf(q) !== tierOf(QUESTS[i - 1])) {
        const h = document.createElement("li"); h.className = "tier-head";
        h.textContent = `Tier ${tierOf(q)}: ${TIERS[tierOf(q)]}`; list.append(h);
      }
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
    renderMyQuests();
    const card = $("quest-card");
    if (!current) {
      card.innerHTML = `<p class="eyebrow">FREE PLAY</p><h3>You finished every quest.</h3>
        <p>Embersnoot is yours to keep shaping. Some ideas, from easy to bold:</p>
        <ul class="ideas"><li>Design more quests in <code>my-quests.js</code>, and add lore to <code>my-lore.js</code></li>
        <li>Ask your <b>snoot-reviewer</b> subagent to check each change you make</li>
        <li>Ask Claude in the Code tab: “Add a new move kind called heal that gives Embersnoot back puff. Explain each line you add.”</li>
        <li>Ask Claude: “Add a second opponent. Keep it simple and explain the plan before you change anything.”</li></ul>`;
      return;
    }
    const steps = current.steps.map(s => `<li>${s}</li>`).join("");
    const needsFile = !current.manual && current.id !== "win" && current.id !== "peek";
    const previewNote = needsFile && !isLocal
      ? `<p class="preview-note">This is the online version, which can't see your files. Do this quest in your own copy of the folder: double-click <b>index.html</b> there.</p>` : "";
    const status = current.manual
      ? `<button type="button" class="primary" id="manual-done">I did it ✓</button>`
      : `<p class="q-status">Waiting for you… ${needsFile ? "This checks itself when you reload (⌘R)." : ""}</p>`;
    card.innerHTML = `<p class="eyebrow">QUEST ${QUESTS.indexOf(current) + 1} OF ${QUESTS.length} · ${TIERS[tierOf(current)].toUpperCase()}</p>
      <h3>${current.title}</h3><p class="why"><b>Why:</b> ${current.why}</p><ol class="steps">${steps}</ol>${current.extra ? current.extra() : ""}${previewNote}${status}`;
    if (current.manual) $("manual-done").addEventListener("click", () => {
      progress.done[current.id] = true; save(); celebrate([current]); renderQuests();
    });
  }

  // ---- ⭐ Your quests, from my-quests.js ----
  function renderMyQuests() {
    const box = $("my-quests"), list = myQuests();
    if (!list.length && level() < 14) { box.hidden = true; return; }
    box.hidden = false;
    if (!list.length) { box.innerHTML = '<p class="eyebrow">⭐ YOUR QUESTS</p><p class="small">None yet. Open <code>my-quests.js</code> to design one.</p>'; return; }
    box.innerHTML = '<p class="eyebrow">⭐ YOUR QUESTS</p><ul class="quest-list">' + list.map(q => {
      let ok = false, err = "";
      try { ok = !!q.check(S); } catch (e) { err = "its check has a problem: " + e.message; }
      return `<li class="quest${ok ? " done" : ""}"><span class="q-mark">${ok ? "✓" : "☆"}</span><span><span class="q-title">${esc(q.title)}</span>${q.hint ? `<br><small>${esc(q.hint)}</small>` : ""}${err ? `<br><small class="q-err">⚠ ${esc(err)}</small>` : ""}</span></li>`;
    }).join("") + "</ul>";
  }

  function recordWin() { progress.wins++; save(); celebrate(evaluate()); renderQuests(); maybeRemindSave(); }
  function recordLoss() { progress.losses++; save(); maybeRemindSave(); }

  // ---- 💾 Save-point reminder ----
  // A "fingerprint" is your whole pet file written out as one line of text.
  // If it's different from the fingerprint at your last save point,
  // your pet has changed, so it's worth making a new save point.
  const practiceSource = () => { try { return [luckyBonus, isBigHit, powerUp, cheer].map(f => String(f)).join(""); } catch (e) { return ""; } };
  const fingerprint = () => JSON.stringify({ S, lore: extras.lore, quests: myQuests().map(q => q.title + String(q.check)), practice: practiceSource() });
  let remindedFor = null;           // don't nag twice in one visit
  function maybeRemindSave() {
    if (result.fileBroken || result.problems.length) return;    // fix the red bar first
    const fp = fingerprint();
    if (fp === progress.savedPrint || fp === remindedFor) return;
    remindedFor = fp;
    const how = progress.done.git
      ? `Make one: in Claude's <b>Code</b> tab, say <i>“Make a save point with a short message about what I changed.”</i>`
      : `Your file is already saved (that's what ⌘S did). A save point is a backup you can go back to. For now, the quick way: in Finder, click <b>my-embersnoot.js</b> and press <b>⌘D</b> to make a copy. Quest 8 teaches proper save points with Git.`;
    $("save-reminder").innerHTML = `<p><b>💾 Your files have changed since your last save point.</b> ${how}</p>
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
  const VERSION = "round-5";
  const WHATS_NEW = [
    "<b>7 new quests</b> in two new tiers: <b>Explorer</b> (look inside the game) and <b>Builder</b> (work with AI agents).",
    "New files that are yours: <code>my-lore.js</code>, <code>my-quests.js</code> and the <code>practice</code> folder.",
    "<b>Hollowmere lore</b> is in the 📓 Notebook, and it unlocks as you level up.",
    "The Notebook has a new chapter: <b>Working with AI</b>.",
  ];
  function showWhatsNew() {
    if (progress.seenVersion === VERSION) return;
    if (!progress.seenVersion && !progress.wins && !Object.keys(progress.done).length) { progress.seenVersion = VERSION; save(); return; }   // brand-new player: nothing is "new"
    const box = $("whats-new");
    box.innerHTML = `<div><p><b>🆕 What's new</b></p><ul>${WHATS_NEW.map(w => `<li>${w}</li>`).join("")}</ul></div><button type="button" class="chip" id="whats-new-ok">Got it</button>`;
    box.hidden = false;
    $("whats-new-ok").addEventListener("click", () => { progress.seenVersion = VERSION; save(); box.hidden = true; });
  }

  // ---- 🔍 The console helper, for Quest 10 ----
  // In the browser's Console, type  snoot.state()  or  snoot.givePuff(10)
  function initConsoleHelper() {
    window.snoot = {
      help() { return "Try: snoot.state() to see the game's notes, and snoot.givePuff(10) to change them."; },
      state() { return Battle.state(); },
      givePuff(n = 10) {
        n = Number(n);
        if (!Number.isFinite(n) || n <= 0) return "Give it a number above 0, like: snoot.givePuff(10)";
        n = Math.min(50, Math.round(n));
        if (!Battle.addPuff(n)) return "Start a spar first (or wait for the next one), then try again.";
        progress.flags = Object.assign({}, progress.flags, { peek: true }); save();
        celebrate(evaluate()); renderQuests();
        return `+${n} puff! You just changed the game's state from the Console.`;
      },
    };
    console.log("%c🔥 Snoot Pets console", "font-weight:bold;font-size:14px;color:#d9561f",
      "\nTry typing:  snoot.state()   then   snoot.givePuff(10)");
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
    result.problems = result.problems.concat(extras.problems);
    // Save-point fingerprints now cover all your files. Start counting from today's files.
    if (progress.printVersion !== 2 && !result.problems.length) { progress.savedPrint = fingerprint(); progress.printVersion = 2; save(); }
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
    initConsoleHelper();
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

  return { init, level, recordWin, recordLoss, peekMove, cheerLine };
})();

Lessons.init();
