const INTENDED = [
  [' To stay put he needs to dig in: try “Claws dug in” or “Bolted to the planet” under Settings.', ' To stay put he needs to be bolted: turn on Bolted to the planet for Rex in Their powers.'],
  ['Pick firmer ground under Settings, or turn on Comic ground.', 'Pick firmer ground under Ground, or turn on Comic ground in Their powers.'],
  ['Pick soil, paving or rock under Settings to see the shaking.', 'Pick soil, paving or rock under Ground to see the shaking.'],
  ['(under Comic switches)', '(under Their powers)'],
  ['Pick a growth mode under Comic switches', 'Pick a growth mode under Their powers'],
  [' (plus a little claw or boot bite if dug in)', ''],
  ['A heavier body, or one dug in, wins.', 'A heavier body wins.'],
  [', plus shear × buried area if dug in', ''],
  [' (+ shear × buried area if dug in; unlimited if bolted)', ' (unlimited if bolted)'],
  [' + ¼ shear × buried area if dug in', ''],
  ['’s footing take most of it', '’s footing takes most of it'],
];
const mapMain = (t) => {
  if (typeof t !== 'string') return t;
  for (const [a, b] of INTENDED) t = t.split(a).join(b);
  // the shoving-match verdict no longer lower-cases a name
  t = t.replace(/Pushing straight across: (rex|ollie)\b/g, (m, n) => 'Pushing straight across: ' + n.charAt(0).toUpperCase() + n.slice(1));
  return t;
};
module.exports = mapMain;
