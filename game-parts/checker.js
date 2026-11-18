// =========================================================
//  CHECKER — reads my-embersnoot.js and spots mistakes.
//  If something is wrong, it uses a safe default for that one
//  thing (so the game still works) and explains the problem
//  in the red bar.
// =========================================================

const DEFAULT_EMBERSNOOT = {
  name: "Embersnoot",
  victoryLine: "Hah! Still warm.",
  trainerName: "",
  teamName: "Team Flame",
  colors: { flame: "#ff8a24", core: "#ffd256" },
  moves: [
    { name: "Spark Flick", kind: "hit",    power: 8,  chance: 95 },
    { name: "Flare Stamp", kind: "hit",    power: 13, chance: 70 },
    { name: "Smoke Puff",  kind: "dodge",  power: 0,  chance: 100 },
    { name: "Kindle",      kind: "charge", power: 0,  chance: 100 },
  ],
  auraColor: "",
};

const Checker = (() => {
  const HEX = /^#[0-9a-fA-F]{6}$/;
  const KINDS = ["hit", "dodge", "charge"];

  // Turns the browser's error message into plain words.
  function explainBrowserError(message) {
    const m = String(message || "");
    if (/[“”‘’]|invalid character|invalid or unexpected token|unterminated/i.test(m))
      return 'Probably a curly quote (“ ” or ‘ ’) or a quote that was never closed. Code only understands straight quotes: "like this". Delete the quote and type it again in VS Code.';
    if (/is not defined|can.t find variable/i.test(m))
      return 'A word is missing its quotes. Words need straight quotes around them, like  name: "Blaze",';
    if (/unexpected identifier|unexpected string|unexpected number|expected '?[,}\]]/i.test(m))
      return "Probably a missing comma. Check the end of this line and the line above: each item ends with a comma ,";
    if (/end of input|unexpected eof|end of script/i.test(m))
      return "A bracket was deleted. Every { needs a matching } and every [ needs a matching ]. Ctrl+Z (⌘Z) in VS Code can undo.";
    if (/unexpected token/i.test(m))
      return "Something extra or missing near here, usually a comma, bracket or quote.";
    return "The browser couldn't read the file. The usual causes are a curly quote, a missing comma, or a deleted bracket.";
  }

  function check() {
    const problems = [];            // { where, msg }
    // (try/catch: if the file stopped halfway, even asking for MY_EMBERSNOOT throws an error)
    let raw = null;
    try { raw = MY_EMBERSNOOT; } catch (e) { raw = null; }

    // 1) Could the browser read the file at all?
    if (!raw) {
      const err = (window.SNOOT_ERRORS || [])[0];
      const where = err && err.line ? `Line ${err.line} of my-embersnoot.js` : "my-embersnoot.js";
      problems.push({
        where,
        msg: explainBrowserError(err && err.message) +
             " VS Code also puts a red squiggly line under the exact spot.",
      });
      return { settings: structuredClone(DEFAULT_EMBERSNOOT), problems, fileBroken: true };
    }

    const s = structuredClone(DEFAULT_EMBERSNOOT);

    function text(key, value, max) {
      if (typeof value !== "string" || !value.trim()) {
        problems.push({ where: key, msg: `${key} should be words inside quotes, like  ${key}: "${DEFAULT_EMBERSNOOT[key]}",` });
        return null;
      }
      if (value.length > max) {
        problems.push({ where: key, msg: `${key} is ${value.length} letters long. Keep it to ${max} or fewer so it fits on screen.` });
        return value.slice(0, max);
      }
      return value;
    }
    function num(key, value, lo, hi, whole) {
      if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
        problems.push({ where: key, msg: `${key} is "${value}" in quotes. Numbers don't use quotes: write  ${key}: ${value},` });
        value = Number(value);
      }
      if (typeof value !== "number" || isNaN(value)) {
        problems.push({ where: key, msg: `${key} needs to be a number between ${lo} and ${hi}.` });
        return null;
      }
      if (whole && !Number.isInteger(value)) {
        problems.push({ where: key, msg: `${key} needs a whole number (like 3, not 3.5). The game rounded it.` });
        value = Math.round(value);
      }
      if (value < lo || value > hi) {
        const used = Math.min(hi, Math.max(lo, value));
        problems.push({ where: key, msg: `${key} is ${value}, but it only goes from ${lo} to ${hi}. The game used ${used}.` });
        return used;
      }
      return value;
    }
    function color(label, value) {
      if (typeof value !== "string" || !HEX.test(value.trim())) {
        const shown = typeof value === "string" ? `"${value}"` : String(value);
        problems.push({ where: label, msg: `${label} is ${shown}. Colours need a # and then 6 letters/numbers, like "#ff8a24".` });
        return null;
      }
      return value.trim();
    }

    const name = text("name", raw.name, 18); if (name) s.name = name;
    const line = text("victoryLine", raw.victoryLine, 60); if (line) s.victoryLine = line;
    // Your name may be empty (""), so it gets its own gentler check.
    if (raw.trainerName !== undefined) {
      if (typeof raw.trainerName !== "string") problems.push({ where: "trainerName", msg: 'trainerName should be your name inside quotes, like  trainerName: "Robin",  or empty quotes "" for no name.' });
      else s.trainerName = raw.trainerName.trim().slice(0, 16);
    }
    if (raw.teamName !== undefined) { const t = text("teamName", raw.teamName, 18); if (t) s.teamName = t; }

    if (raw.colors && typeof raw.colors === "object") {
      for (const k of Object.keys(DEFAULT_EMBERSNOOT.colors)) {
        if (raw.colors[k] === undefined) {
          problems.push({ where: `colors → ${k}`, msg: `colors → ${k} is missing. Add a line like  ${k}: "${DEFAULT_EMBERSNOOT.colors[k]}",` });
          continue;
        }
        const c = color(`colors → ${k}`, raw.colors[k]); if (c) s.colors[k] = c;
      }
    } else problems.push({ where: "colors", msg: "The colors { } block is missing or broken." });


    if (Array.isArray(raw.moves) && raw.moves.length) {
      if (raw.moves.length > 6) problems.push({ where: "moves", msg: `You have ${raw.moves.length} moves. The most is 6, so the game used the first 6.` });
      const moves = [];
      raw.moves.slice(0, 6).forEach((m, i) => {
        const label = `Move ${i + 1}${m && m.name ? ` ("${m.name}")` : ""}`;
        if (!m || typeof m !== "object") { problems.push({ where: label, msg: `${label} isn't a { } block.` }); return; }
        const mv = { name: "", kind: "hit", power: 8, chance: 90 };
        if (typeof m.name === "string" && m.name.trim()) mv.name = m.name.slice(0, 16);
        else { problems.push({ where: label, msg: `${label} needs a name in quotes, like  name: "Ash Tackle",` }); mv.name = `Move ${i + 1}`; }
        if (KINDS.includes(m.kind)) mv.kind = m.kind;
        else problems.push({ where: label, msg: `${label}: kind is "${m.kind}". It has to be "hit", "dodge" or "charge". The game used "hit".` });
        const p = Number(m.power);
        if (typeof m.power === "string") problems.push({ where: label, msg: `${label}: power is in quotes. Numbers don't use quotes.` });
        if (isNaN(p)) problems.push({ where: label, msg: `${label}: power needs to be a number from 0 to 30.` });
        else if (p < 0 || p > 30) { problems.push({ where: label, msg: `${label}: power is ${p}. It goes from 0 to 30, so the game used ${Math.min(30, Math.max(0, p))}.` }); mv.power = Math.min(30, Math.max(0, p)); }
        else mv.power = p;
        const c = Number(m.chance);
        if (typeof m.chance === "string") problems.push({ where: label, msg: `${label}: chance is in quotes. Numbers don't use quotes.` });
        if (isNaN(c)) problems.push({ where: label, msg: `${label}: chance needs to be a number from 1 to 100.` });
        else if (c < 1 || c > 100) { problems.push({ where: label, msg: `${label}: chance is ${c}. It goes from 1 to 100, so the game used ${Math.min(100, Math.max(1, c))}.` }); mv.chance = Math.min(100, Math.max(1, c)); }
        else mv.chance = c;
        if (mv.kind === "hit" && mv.power === 0) problems.push({ where: label, msg: `${label} is a "hit" with power 0, so it won't do anything. Give it some power.` });
        moves.push(mv);
      });
      if (moves.length) s.moves = moves;
    } else problems.push({ where: "moves", msg: "The moves [ ] list is missing or empty. Embersnoot needs at least one move." });

    if (raw.auraColor) { const a = color("auraColor", raw.auraColor); if (a) s.auraColor = a; }

    return { settings: s, problems, fileBroken: false, raw };
  }

  return { check, explainBrowserError };
})();
