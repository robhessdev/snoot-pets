// =========================================================
//  SOUNDS — tiny sound effects made with code, not sound
//  files. Each sound is a few quick "tones" or a burst of
//  "noise" (like static), shaped to rise or fall.
//  The 🔊 button turns them on and off.
// =========================================================

const Sound = (() => {
  const KEY = "snoot-pets-sound";
  let on = true, ctx = null;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) {}

  // Browsers only allow sound after you click something,
  // so the audio engine starts on the first sound we play.
  function engine() {
    if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // A tone: starts at one pitch, slides to another, then fades.
  function tone(from, to, secs, type = "sine", vol = .12, delay = 0) {
    const c = engine(); if (!c) return;
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(to, t + secs);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + secs);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + secs + .02);
  }
  // Noise: a short burst of static, filtered to sound like crackle or splash.
  function noise(secs, freq, vol = .15, delay = 0) {
    const c = engine(); if (!c) return;
    const t = c.currentTime + delay, len = Math.floor(c.sampleRate * secs);
    const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = "bandpass"; f.frequency.value = freq; g.gain.value = vol;
    src.buffer = buf; src.connect(f).connect(g).connect(c.destination); src.start(t);
  }

  const SOUNDS = {
    spark:  () => { noise(.25, 3200, .18); tone(900, 1800, .12, "triangle", .05); },
    flare:  () => { noise(.4, 1400, .22); tone(220, 90, .35, "sawtooth", .05); },
    charge: () => { tone(200, 700, .5, "triangle", .08); noise(.5, 2500, .06); },
    smoke:  () => { noise(.6, 500, .16); },
    splash: () => { noise(.35, 900, .2); tone(700, 250, .25, "sine", .06, .05); },
    hit:    () => { tone(180, 70, .18, "square", .07); },
    miss:   () => { tone(500, 300, .15, "sine", .05); tone(300, 200, .15, "sine", .04, .12); },
    shield: () => { tone(330, 330, .25, "triangle", .06); tone(495, 495, .3, "triangle", .05, .08); },
    heal:   () => { [523, 659, 784].forEach((f, i) => tone(f, f, .22, "sine", .07, i * .09)); },
    sniff:  () => { noise(.08, 1800, .1); noise(.08, 1800, .1, .14); },
    win:    () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, f, .25, "triangle", .08, i * .12)); },
    lose:   () => { [392, 330, 262].forEach((f, i) => tone(f, f * .97, .35, "sine", .07, i * .2)); },
  };

  function play(name) { if (on && SOUNDS[name]) { try { SOUNDS[name](); } catch (e) {} } }

  function bindToggle(btn) {
    const show = () => {
      btn.textContent = on ? "🔊" : "🔇";
      btn.title = on ? "Sound on (click to mute)" : "Sound off (click to turn on)";
      btn.setAttribute("aria-label", on ? "Sound on" : "Sound off");
      btn.setAttribute("aria-pressed", String(on));
    };
    show();
    btn.addEventListener("click", () => {
      on = !on; try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
      show(); if (on) play("heal");
    });
  }

  return { play, bindToggle };
})();
