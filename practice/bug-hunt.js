// =========================================================
//   🐞  BUG HUNT  (Quest 11)
// =========================================================
//
//   This file has 2 bugs hidden in it, on purpose.
//
//   For each one: read the NOTE, then read the CODE under it.
//   Does the code do what the note says? If not, fix the code
//   (not the note). Then save (⌘S), reload the game (⌘R) and
//   look at the Bug Hunt board in the quest panel.
//
//   This is practice only. It can't break the real game.
// =========================================================


// ---- BUG 1 ------------------------------------------------
// NOTE: when Embersnoot wins, it gets a bonus of 5 puff.
//       So luckyBonus(40) should give back 45.
function luckyBonus(puff) {
  return puff - 5;
}


// ---- BUG 2 ------------------------------------------------
// NOTE: a "big hit" is any hit with power 12 OR MORE.
//       So isBigHit(12) should be true, and isBigHit(11) false.
function isBigHit(power) {
  return power > 12;
}
