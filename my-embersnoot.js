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

  // ---- FIRE COLOURS --------------------------------------
  // Your pet's body is painted art (game-parts/art/embersnoot.png).
  // These colours paint everything the CODE draws around it:
  // its sparks, its glow, its kindle shine and the sparks it throws.
  // Colours are "hex codes": a # followed by 6 letters/numbers.
  // To find new ones, search "color picker" in your browser.
  colors: {
    flame:  "#ff8a24",   // outer sparks and glow
    core:   "#ffd256",   // the hottest, brightest sparks
  },

  // ---- BATTLE MOVES --------------------------------------
  // This is a "list" (the [ ] brackets). Each move is one { } block.
  // Plain numbers (no quotes) are values the game can do maths with.
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
  // Finish quests in the game to level up. (Skins are coming later.)
  auraColor: "",       // 🔒 Level 5: a glow around your pet, like "#ff4fa0"

};
