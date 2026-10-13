// main's text -> the branch's text, for the wording changes the branch makes on purpose (from git diff main...claude/rex-gui-a)
const INTENDED = [
  // Throw and Catch recoil hint: 'under Settings' and 'Claws dug in' gone
  [' To stay put he needs to dig in: try “Claws dug in” or “Bolted to the planet” under Settings.', ' To stay put he needs to be bolted: turn on Bolted to the planet for Rex in Their powers.'],
  // Walk hints: 'under Settings' renamed
  ['Pick firmer ground under Settings, or turn on Comic ground.', 'Pick firmer ground under Ground, or turn on Comic ground in Their powers.'],
  ['Pick soil, paving or rock under Settings to see the shaking.', 'Pick soil, paving or rock under Ground to see the shaking.'],
  // Weight growth what-if: 'Comic switches' renamed
  ['(under Comic switches)', '(under Their powers)'],
  ['Pick a growth mode under Comic switches', 'Pick a growth mode under Their powers'],
  // Wrestle push: dug-in terms removed (and the walking-drive sentence reworded, round 1 copy-5)
  ['Walking drive is friction under his own weight (plus a little claw or boot bite if dug in): ', 'Walking drive is friction under his own weight, and none at all if he is bolted (he can’t step) or too heavy to walk: '],
  ['A heavier body, or one dug in, wins.', 'A heavier body wins.'],
  [' (+ shear × buried area if dug in; unlimited if bolted)', ' (unlimited if bolted)'],
  [' + ¼ shear × buried area if dug in', ''],
  // Arm wrestle math: dug-in term removed
  [', plus shear × buried area if dug in', ''],
  // Collide verdict: grammar fix that came with the dug-in removal
  ['’s footing take most of it', '’s footing takes most of it'],
];
function mapMain(t) {
  if (typeof t !== 'string') return t;
  for (const [a, b] of INTENDED) t = t.split(a).join(b);
  // the shoving-match verdict no longer lower-cases a name
  t = t.replace(/Pushing straight across: (rex|ollie)\b/g, (m, n) => 'Pushing straight across: ' + n.charAt(0).toUpperCase() + n.slice(1));
  return t;
}
// Sprint with bolted feet (round 1 copy-4): the strength sentence and the push-off formula are reworded, and a sentence is
// added when effort sets the push-off. Applied only where the branch's text shows the bolted formula.
function mapSprintBolted(t) {
  if (typeof t !== 'string') return t;
  t = t.replace(/He isn’t strong enough yet to use all the grip on offer, so strength sets his push-off: ([^N]*N)\./g, 'Bolted to the planet, his feet can’t slip, so friction doesn’t cap his push-off: his strength sets it, $1.');
  t = t.split('Push-off = min(strength, μ × his weight)').join('Push-off = his strength (bolted: no friction limit)');
  return t;
}
// the sentence the branch adds for bolted feet when effort sets the push-off (compared separately)
const ADDED_EFFORT = /Bolted to the planet, his feet can’t slip, so friction doesn’t cap his push-off: the strength he uses sets it, [^N]*N\./g;
module.exports = { mapMain, mapSprintBolted, ADDED_EFFORT, INTENDED };
