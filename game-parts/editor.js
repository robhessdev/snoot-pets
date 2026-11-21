// =========================================================
//  CODE EDITOR — only in the ONLINE version of the game.
//
//  On your own computer you change your files in VS Code.
//  Online there's no file to open, so this little editor shows
//  the same files right in the game. Your changes are kept in
//  this browser only (localStorage), and the game runs them
//  instead of the originals. "Reset" brings the originals back.
// =========================================================

const Editor = (() => {
  const $ = id => document.getElementById(id);
  const online = location.protocol !== "file:";
  const FILES = [
    { path: "my-embersnoot.js",         label: "my-embersnoot.js · your pet" },
    { path: "practice/bug-hunt.js",     label: "practice/bug-hunt.js" },
    { path: "practice/my-functions.js", label: "practice/my-functions.js" },
    { path: "my-quests.js",             label: "my-quests.js · your quests" },
    { path: "my-lore.js",               label: "my-lore.js · lore" },
  ];
  const KEY = path => "snoot-code:" + path;
  const originals = {};
  let current = FILES[0].path, ready = false;

  const mine = path => { try { return localStorage.getItem(KEY(path)); } catch (e) { return null; } };
  const isEdited = path => mine(path) != null;

  async function original(path) {
    if (originals[path] == null) {
      const r = await fetch(path, { cache: "no-store" });
      originals[path] = r.ok ? await r.text() : "";
    }
    return originals[path];
  }

  function init() {
    if (!online || ready) return;
    ready = true;
    const sel = $("ed-file");
    FILES.forEach(f => { const o = document.createElement("option"); o.value = f.path; o.textContent = f.label; sel.append(o); });
    sel.addEventListener("change", () => load(sel.value));
    $("ed-close").addEventListener("click", close);
    $("ed-save").addEventListener("click", saveAndRun);
    $("ed-undo").addEventListener("click", () => load(current));
    const reset = $("ed-reset"); let armed = false;
    reset.addEventListener("click", async () => {
      if (!armed) { armed = true; reset.textContent = "Sure? Click again"; setTimeout(() => { armed = false; reset.textContent = "Reset to original"; }, 4000); return; }
      try { localStorage.removeItem(KEY(current)); } catch (e) {}
      location.reload();
    });
    const ta = $("ed-text");
    ta.addEventListener("input", () => { gutter(); status(); });
    ta.addEventListener("scroll", () => { $("ed-gutter").scrollTop = ta.scrollTop; });
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end"); gutter(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); saveAndRun(); }
      if (e.key === "Escape") close();
      e.stopPropagation();                         // number keys here are typing, not moves
    });
  }

  async function load(path, find) {
    current = path; $("ed-file").value = path;
    const ta = $("ed-text");
    ta.value = mine(path) ?? await original(path);
    ta.dataset.loaded = ta.value;
    gutter(); status();
    ta.scrollTop = 0; $("ed-gutter").scrollTop = 0;
    if (find) {
      const at = ta.value.indexOf(find);
      if (at >= 0) {
        ta.focus({ preventScroll: true });
        ta.setSelectionRange(at, at + find.length);
        const line = ta.value.slice(0, at).split("\n").length;
        ta.scrollTop = Math.max(0, (line - 4) * parseFloat(getComputedStyle(ta).lineHeight));
        $("ed-gutter").scrollTop = ta.scrollTop;
      }
    }
  }

  function gutter() {
    const n = $("ed-text").value.split("\n").length;
    $("ed-gutter").textContent = Array.from({ length: n }, (_, i) => i + 1).join("\n");
  }

  function status() {
    const ta = $("ed-text"), changed = ta.value !== ta.dataset.loaded;
    $("ed-status").textContent = changed ? "Not saved yet." : isEdited(current) ? "Your version (kept in this browser)." : "The original file.";
    $("ed-reset").hidden = !isEdited(current);
  }

  // Phones and some keyboards type “curly” quotes. Code only understands "straight" ones.
  function straighten(text) {
    const fixed = text.replace(/[“”„‟]/g, '"').replace(/[‘’‚‛]/g, "'");
    return { fixed, changed: fixed !== text };
  }

  function saveAndRun() {
    const { fixed, changed } = straighten($("ed-text").value);
    try { localStorage.setItem(KEY(current), fixed); }
    catch (e) { $("ed-status").textContent = "Couldn't save: this browser blocks storage."; return; }
    if (changed) { try { sessionStorage.setItem("snoot-straightened", "1"); } catch (e) {} }
    location.reload();                              // the game starts again and runs your version
  }

  function open(path = FILES[0].path, find) {
    if (!online) return;
    init();
    $("editor").hidden = false;
    load(path, find);
    window.dispatchEvent(new CustomEvent("snoot-editor-open"));      // Quest 2 online: "Meet the code editor"
  }
  function close() { $("editor").hidden = true; }

  // Called once when the game starts: a note if the editor fixed curly quotes.
  function takeNote() {
    try { if (sessionStorage.getItem("snoot-straightened")) { sessionStorage.removeItem("snoot-straightened"); return true; } } catch (e) {}
    return false;
  }

  const editedFiles = () => FILES.map(f => f.path).filter(isEdited);

  return { online, open, close, init, takeNote, editedFiles };
})();
