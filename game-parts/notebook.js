// =========================================================
//  NOTEBOOK — the cards in your 📓 Notebook.
//
//  Cards are grouped into 5 chapters (plus your lore, from my-lore.js). Every card has the same
//  three parts:  WHAT IT IS  →  EXAMPLE  →  REMEMBER
//
//  quest: null      → the card is always open (things learned while building)
//  quest: "rename"  → the card unlocks when you finish that quest
//
//  Each chapter ends with one "check yourself" question.
//  Claude adds new cards here after each round you build together.
// =========================================================

const NOTEBOOK_CHAPTERS = [
  {
    id: "how", title: "How the game works", icon: "⚙️",
    cards: [
      {
        id: "frontend", quest: null, from: "Round 1",
        title: "Front end vs. back end",
        what: "The <b>front end</b> is the part that runs on your own device. A <b>back end</b> is a computer somewhere else (a “server”) that stores things for everyone.",
        example: `<div class="nb-diagram"><div class="nb-box"><b>💻</b>Your browser<br><small>the game runs here</small></div><div class="nb-box dim"><b>☁️</b>A server<br><small>none, not needed</small></div></div>`,
        remember: "This game is front end only. That's why your progress stays in one browser, and everyone you share it with starts fresh.",
      },
      {
        id: "saving", quest: null, from: "Round 1",
        title: "Two kinds of saving",
        what: "<b>⌘S saves a file</b> for good, like a document. <b>The browser saves progress</b> by itself, in a small storage box called <b>localStorage</b>.",
        example: "<p>Your pet's name, moves and fire colours → saved in <code>my-embersnoot.js</code> (⌘S).<br>Your quests and level → saved in this browser, automatically.</p>",
        remember: "Files are the real, permanent save. Browser storage belongs to one browser on one computer.",
      },
      {
        id: "state", quest: "win", from: "Quest 1",
        title: "The game remembers: “state”",
        what: "During a spar, the game keeps a few notes: each pet's puff, whether you're kindled, whether you're hidden in smoke. Programmers call these notes <b>state</b>.",
        example: "<pre>charged: false,\ndodging: false,\nember: { puff: 40 }</pre><p>Every move reads these notes, then changes them.</p>",
        remember: "Lots of bugs are state that wasn't reset, like an old message hanging around after a rematch.",
      },
      {
        id: "random", quest: null, from: "Quest 1, with Claude playing",
        title: "Dice, chance and unlucky streaks",
        what: "Each move rolls a random number from 0 to 100. If the roll is under the move's <code>chance</code>, the move works.",
        example: "<pre>if (Math.random() * 100 < move.chance) {\n  // it lands\n}</pre><p>Flare Stamp (chance 70) once missed 3 times in a row. That happens about 3 times in 100.</p>",
        remember: "Random doesn't mean evenly spread out. Games add quiet fairness rules. Ours: you can't miss more than twice in a row.",
      },
      {
        id: "console", quest: "peek", from: "Quest 10",
        title: "The Console: talking to a page",
        what: "Every browser has hidden <b>developer tools</b>. Its <b>Console</b> is a box where you type JavaScript, and it runs right inside the page.",
        example: "<pre>snoot.state()       // look at the game's notes\nsnoot.givePuff(10)  // change them</pre>",
        remember: "A website is code running on your own computer, so you can peek inside it.",
      },
    ],
    check: {
      q: "You share the game with a friend. What do they see when they open it?",
      options: ["Your level, your wins and your changed pet", "A fresh start with the original pet", "Nothing, because it only works on your computer"],
      answer: 1,
      why: "The game has no back end, so nothing of yours travels with it. Your progress lives in your browser, and your changes live in your own files.",
    },
  },
  {
    id: "pics", title: "Pictures & animation", icon: "🎨",
    cards: [
      {
        id: "sprites", quest: null, from: "Fixing the Codex version",
        title: "Sprite sheets",
        what: "Dewsnoot's art is <b>one big picture</b> with rows of small frames. The game shows one frame at a time, like a flip book.",
        example: `<div class="nb-pic"><div class="nb-strip" role="img" aria-label="Dewsnoot's resting animation: six frames in a row"></div><div class="nb-strip-labels"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div></div>`,
        remember: "One image, many frames. The game slides it behind a small window to show each frame.",
      },
      {
        id: "zero", quest: null, from: "Fixing the Codex version",
        title: "Computers count from 0",
        what: "Most code starts counting at 0, not 1. So 6 frames are numbered 0, 1, 2, 3, 4, 5.",
        example: "<p>The first version stopped at frame 4, so Dewsnoot's last pose never showed. Programmers call this an <b>off-by-one</b> bug, and it's one of the most common bugs there is.</p>",
        remember: "If something is “one short” or “one too many”, suspect counting from 0.",
      },
      {
        id: "twoways", quest: null, from: "Designing the pets",
        title: "Painted art vs. drawn by code",
        what: "<b>Painted</b> art is a picture file: to change it, someone paints new frames. Art <b>drawn by code</b> is made from shapes and numbers, many times a second.",
        example: "<p>Both pets = painted (.png sprite sheets).<br>The sparks, glow and pop-up numbers = drawn by code, in the colours from your file.</p><p>Your pet started out drawn by code. That first version is still saved in Git.</p>",
        remember: "Painted art looks richer. Code art is easier to change. This game layers both: code effects on top of painted art.",
      },
      {
        id: "mirror", quest: null, from: "Round 1",
        title: "Flipping a picture with one line",
        what: "To swap sides, nobody redrew the pets. One line of CSS mirrors each picture.",
        example: "<pre>transform: scaleX(-1);</pre><p><code>scaleX</code> stretches sideways. <code>1</code> = normal, <code>-1</code> = normal size but flipped.</p>",
        remember: "Small, clever changes often beat big rewrites.",
      },
      {
        id: "sound", quest: null, from: "Round 1",
        title: "Sounds made from code",
        what: "The game's sounds aren't recordings. Code makes them on the spot from <b>tones</b> (a pitch that slides up or down) and <b>noise</b> (like radio static).",
        example: "<p>Splash = a burst of static, softened. Win = four quick rising notes.</p>",
        remember: "No sound files means nothing extra to download. The browser builds every sound when it's needed.",
      },
    ],
    check: {
      q: "Dewsnoot's resting animation has 6 frames. How does the code number them?",
      options: ["1 to 6", "0 to 5", "0 to 6"],
      answer: 1,
      why: "Code usually counts from 0, so 6 frames are 0, 1, 2, 3, 4, 5. Forgetting that causes “off-by-one” bugs.",
    },
  },
  {
    id: "words", title: "Code words", icon: "🔤",
    cards: [
      {
        id: "strings", quest: "rename", from: "Quest 3",
        title: "Strings: words inside quotes",
        what: "Anything inside quotes is a <b>string</b>: text the game shows but doesn't try to run.",
        example: '<pre>name: "Embersnoot",   ✓ a string\nname: Embersnoot,     ✗ no quotes</pre><p>Without quotes, the computer thinks the word is something it should already know, and gets confused.</p>',
        remember: "Quotes mean: “these are just words, don't try to understand them.”",
      },
      {
        id: "hex", quest: "color", from: "Quest 4",
        title: "Hex colours",
        what: "A hex colour is a # and then 3 pairs that say how much <b>red</b>, <b>green</b> and <b>blue</b> light to mix, from 00 (none) to ff (full).",
        example: `<div class="nb-swatches"><span style="background:#ff0000">#ff0000</span><span style="background:#00aa00">#00aa00</span><span style="background:#0055ff">#0055ff</span><span style="background:#ff8a24">#ff8a24</span></div>`,
        remember: "Screens mix every colour from red, green and blue light. Hex is a short way to write the recipe.",
      },
      {
        id: "numbers", quest: "power", from: "Quest 5",
        title: "Numbers you can do maths with",
        what: "Numbers without quotes are real numbers, so the game can add and subtract them.",
        example: "<pre>power: 8,     ✓ a number\npower: \"8\",   ✗ only the picture of an 8</pre>",
        remember: "Numbers: no quotes. Words: quotes.",
      },
      {
        id: "lists", quest: "newmove", from: "Quest 6",
        title: "Lists and blocks",
        what: "<code>[ ]</code> is a <b>list</b>: several things in order. <code>{ }</code> is a <b>block</b>: one thing's settings, grouped together.",
        example: '<pre>moves: [\n  { name: "Spark Flick", … },\n  { name: "Kindle", … },\n]</pre><p>The game makes one button for each block in the list.</p>',
        remember: "Add a block, get a button. The code doesn't care whether you have 4 moves or 6.",
      },
      {
        id: "functions", quest: "functions", from: "Quest 12",
        title: "Functions: little machines",
        what: "A <b>function</b> is a little machine: you give it something, and it gives something back.",
        example: "<pre>function powerUp(power) {\n  return power + 5;\n}\npowerUp(8)   // gives 13</pre>",
        remember: "A name, the input in ( ), and return for what comes out.",
      },
      {
        id: "questdata", quest: "myquest", from: "Quest 15",
        title: "A quest is just data",
        what: "Each quest in this game is a small { } block: a title, a hint, and a tiny <b>check</b> function that answers true or false.",
        example: '<pre>{ title: "Six moves",\n  check: s => s.moves.length >= 6 }</pre><p><code>s => …</code> means: given your settings (s), answer this.</p>',
        remember: "Big programs are built from lots of small pieces like this.",
      },
    ],
    check: {
      q: "Which line is written correctly?",
      options: ['power: "8",', "name: Blaze,", 'name: "Blaze",'],
      answer: 2,
      why: 'Words need quotes ("Blaze"). Numbers must NOT have quotes, so power: "8" is the picture of an 8, not a number.',
    },
  },
  {
    id: "dev", title: "Working like a developer", icon: "🛠️",
    cards: [
      {
        id: "testing", quest: null, from: "Testing the game",
        title: "Testing = breaking things on purpose",
        what: "Testers try to break things before anyone else does, then check that the problem is handled well.",
        example: "<p>Claude put curly quotes, a colour without a #, and a word without quotes into your file on purpose, then checked that the red bar explained each one. That caught 2 real bugs.</p>",
        remember: "Every mistake you can predict is one you can explain kindly.",
      },
      {
        id: "editor", quest: "vscode", from: "Quest 2",
        title: "Code editors vs. word processors",
        what: "Word processors (TextEdit, Pages) “prettify” text and swap \" for curly “ ”. A <b>code editor</b> (VS Code, or the ✏️ editor in the online game) keeps your text exactly as typed.",
        example: "<p>VS Code also colours the code so the parts stand out, and puts red squiggles under mistakes.</p>",
        remember: "Write code in a code editor. It's like using a ruler instead of eyeballing it.",
      },
      {
        id: "git", quest: "git", from: "Quest 8",
        title: "Save points with Git",
        what: "<b>Git</b> takes snapshots of your whole folder. Each snapshot is a <b>commit</b>, with a short message saying what changed.",
        example: "<pre>“First save point”\n“Blue flames and new move”\n“Fixed the typo in Kindle”</pre><p>Broke something? Jump back to an earlier commit.</p>",
        remember: "Commit often, with clear messages. It's an undo button for your whole project.",
      },
      {
        id: "diff", quest: "changes", from: "Quest 9",
        title: "Diffs: seeing exactly what changed",
        what: "A <b>diff</b> shows exactly what changed between two versions: <b>red</b> lines were removed, <b>green</b> lines were added.",
        example: '<pre>- power: 8,\n+ power: 10,</pre>',
        remember: "Reading the diff is how you check what Claude, or anyone, really changed.",
      },
      {
        id: "debugging", quest: "bughunt", from: "Quest 11",
        title: "Debugging: mind the gap",
        what: "<b>Debugging</b> means finding out why code does something different from what it should.",
        example: "<p>The note said “add 5”. The code said <code>puff - 5</code>. Where the note and the code disagree, that's the bug.</p>",
        remember: "Compare what the code SHOULD do with what it DOES. The bug lives in the gap.",
      },
    ],
    check: {
      q: "What does a Git commit (a save point) do?",
      options: ["Uploads your files to the internet", "Saves a snapshot of your project that you can go back to", "Deletes your old versions"],
      answer: 1,
      why: "A commit is a save point on your own computer. A push is the separate step that uploads it to GitHub.",
    },
  },
  {
    id: "ai", title: "Working with AI", icon: "🤖",
    cards: [
      {
        id: "prompting", quest: "claude", from: "Quest 7",
        title: "How to ask an AI for code",
        what: "A good request says <b>what to change</b>, <b>what to leave alone</b>, and <b>how to explain it</b>.",
        example: "<p class=\"nb-quote\">“Change victoryLine in my-embersnoot.js. Change nothing else. Explain what you did in two plain sentences.”</p>",
        remember: "You don't need to know the code to steer it. Say clearly what you want, then read what changed.",
      },
      {
        id: "brief", quest: null, from: "Round 3: Codex's painting",
        title: "Briefs: making two people's work fit",
        what: "A <b>brief</b> is a set of exact instructions, so someone else's work slots into yours. Claude wrote one; Codex painted to it.",
        example: "<p>The brief set the exact frame size (192×208), the facing direction (left) and where the paws sit (y = 189). Codex's 50 frames dropped into the game first try.</p>",
        remember: "Be exact about the parts that must fit, and leave freedom everywhere else.",
      },
      {
        id: "review", quest: null, from: "Round 4: Codex's review",
        title: "Second opinions catch different things",
        what: "A <b>code review</b> is someone else reading your work to find problems. A different reviewer spots different problems.",
        example: "<p>Claude's tests caught things that only show up when the game runs, like the phone layout. Codex's review caught a rule that didn't match its own words: Kindle promised your next <i>hit</i> doubles, but a miss used it up.</p>",
        remember: "Whoever wrote something is the worst at spotting its mistakes, AIs included. Ask for a second pair of eyes.",
      },
      {
        id: "subagent", quest: "subagent", from: "Quest 13",
        title: "Subagents: helpers with a job",
        what: "A <b>subagent</b> is a helper AI with its own job description. The main AI hands it a task and gets a report back.",
        example: "<pre>---\nname: snoot-reviewer\ndescription: Reviews Snoot Pets changes\n---\nExplain problems in plain words.</pre>",
        remember: "A clear job description is the whole trick.",
      },
      {
        id: "cli", quest: "terminal", from: "Quest 14",
        title: "The terminal: programs talking to programs",
        what: "The <b>terminal</b> (command line) lets you, or an AI, run programs by typing commands.",
        example: '<pre>codex exec "What does chooseDewMove do?"</pre><p>Claude sends one message, Codex prints one answer, repeat.</p>',
        remember: "One message in, one answer out. That's how AIs can talk to each other.",
      },
    ],
    check: {
      q: "What is a subagent?",
      options: ["A second app you have to install", "A helper AI with its own job description that the main AI can hand work to", "A backup copy of your project"],
      answer: 1,
      why: "A subagent is just a short file describing a job. The main AI delegates to it and gets a report back.",
    },
  },
];
