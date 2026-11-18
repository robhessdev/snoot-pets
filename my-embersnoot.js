// =========================================================
//   🔥  MY EMBERSNOOT  —  THIS IS YOUR PET.  CHANGE THIS FILE.
// =========================================================
//
//   Everything about Embersnoot lives in this one file:
//   its name, colours, shape and battle moves.
//
//   HOW TO MAKE A CHANGE
//     1. Change something below. (Start with the name.)
//     2. Save this file ............................ ⌘ + S
//     3. Go to the game in your browser and reload .. ⌘ + R
//     4. Look at the bar at the top of the game:
//          GREEN = it worked
//          RED   = something's off. It says what, and how to fix it.
//
//   THREE RULES THAT KEEP CODE HAPPY
//     • Words go inside straight quotes:   "like this"
//     • Every item ends with a comma:      power: 8,
//     • Don't delete the  { }  or  [ ]  brackets. They hold things together.
//
//   Lines that start with // are notes for humans. The computer skips them.
//
//   Stuck? Ask Claude:  "Fix my-embersnoot.js and explain what was wrong."
// =========================================================

const MY_EMBERSNOOT = {

  // ---- WHO IT IS -----------------------------------------
  // Text inside quotes is called a "string": words the game shows.
  name: "Embersnoot",
  victoryLine: "Hah! Still warm.",

  // ---- WHO YOU ARE ---------------------------------------
  // Shown on your badge in the arena. Leave trainerName as ""
  // (empty quotes) and the badge just says YOU.
  trainerName: "",
  teamName: "Team Flame",

  // ---- COLOURS -------------------------------------------
  // Colours are "hex codes": a # followed by 6 letters/numbers.
  // To find new ones, search "color picker" in your browser.
  colors: {
    body:   "#5b4a52",   // soot-plum fur
    belly:  "#8c706b",   // lighter tummy
    flame:  "#ff8a24",   // outer part of each flame
    core:   "#ffd256",   // hot centre of each flame
    cracks: "#ffb347",   // the glowing cracks in its skin
    eyes:   "#8fe3ff",   // eye colour
  },

  // ---- SHAPE ---------------------------------------------
  // Plain numbers (no quotes) are values the game can do maths with.
  crownFlames: 3,      // flames on its head: 1 to 5
  tailLength: 1,       // 0.6 = stubby,  1 = normal,  1.4 = very long
  earSize: 1,          // 0.7 = small,   1 = normal,  1.3 = big

  // ---- BATTLE MOVES --------------------------------------
  // This is a "list" (the [ ] brackets). Each move is one { } block.
  //   kind:   "hit"    = knocks puff off Dewsnoot
  //           "dodge"  = Dewsnoot's next move will probably miss
  //           "charge" = your next hit does double
  //   power:  how hard a hit lands (1 to 30). Dodge and charge use 0.
  //   chance: how often it works, out of 100
  // You can have up to 6 moves.
  moves: [
    { name: "Spark Flick", kind: "hit",    power: 8,  chance: 95,  },
    { name: "Flare Stamp", kind: "hit",    power: 13, chance: 70,  },
    { name: "Smoke Puff",  kind: "dodge",  power: 0,  chance: 100, },
    { name: "Kindle",      kind: "charge", power: 0,  chance: 100, },
  ],

  // ---- 🔒 LOCKED EXTRAS ----------------------------------
  // These only switch on when Embersnoot reaches the level shown.
  // Finish quests in the game to level up.
  tailFire: 1,         // 🔒 Level 3: size of the tail flame, 1 to 2
  auraColor: "",       // 🔒 Level 5: a glow around your pet, like "#ff4fa0"

};
