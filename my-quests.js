// =========================================================
//   ⭐  MY QUESTS  —  design your own quests (that's Quest 15).
// =========================================================
//
//   Each quest is one { } block with three parts:
//     title:  the quest's name
//     hint:   one line telling the player what to do
//     check:  a tiny function that answers true (done) or false (not yet).
//             The game hands it your pet's settings as  s ,
//             so  s.moves.length  is how many moves your pet has,
//             s.name  is its name, and so on.
//
//   s => ...  means "given s, answer this". For example:
//     s => s.moves.length >= 6     "true once my pet has 6 or more moves"
//     s => s.name.length > 10      "true once my pet's name is long"
//
//   To switch the example on: delete the two slashes // at the start of
//   its line. Then save (⌘S) and reload the game (⌘R).
//   Your quests appear under "⭐ Your quests" in the quest panel.
// =========================================================

const MY_QUESTS = [
  // { title: "Six moves", hint: "Give your pet 6 moves.", check: s => s.moves.length >= 6 },
];
