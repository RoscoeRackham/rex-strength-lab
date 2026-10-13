// main's text -> the branch's text, for each wording change the branch makes on purpose (git diff main...claude/rex-gui-a).
// Each entry has a tag so the compare can count how often it fired.
const INTENDED = [
  ['recoil-hint', ' To stay put he needs to dig in: try “Claws dug in” or “Bolted to the planet” under Settings.', ' To stay put he needs to be bolted: turn on Bolted to the planet for Rex in Their powers.'],
  ['walk-hint', 'Pick firmer ground under Settings, or turn on Comic ground.', 'Pick firmer ground under Ground, or turn on Comic ground in Their powers.'],
  ['walk-hint', 'Pick soil, paving or rock under Settings to see the shaking.', 'Pick soil, paving or rock under Ground to see the shaking.'],
  ['growth-text', '(under Comic switches)', '(under Their powers)'],
  ['growth-text', 'Pick a growth mode under Comic switches', 'Pick a growth mode under Their powers'],
  ['wrestle-drive', 'Walking drive is friction under his own weight (plus a little claw or boot bite if dug in): ', 'Walking drive is friction under his own weight, and none at all if he is bolted (the sim keeps a bolted wrestler planted: he holds but doesn’t walk the other out) or too heavy to walk: '],
  ['wrestle-dugin', 'A heavier body, or one dug in, wins.', 'A heavier body wins.'],
  ['wrestle-math', ' (+ shear × buried area if dug in; unlimited if bolted)', ' (unlimited if bolted)'],
  ['wrestle-math', ' + ¼ shear × buried area if dug in', ''],
  ['arm-math', ', plus shear × buried area if dug in', ''],
  ['collide-grammar', '’s footing take most of it', '’s footing takes most of it'],
];
function mapMain(t, hits) {
  if (typeof t !== 'string') return t;
  for (const [tag, a, b] of INTENDED) if (t.includes(a)) { t = t.split(a).join(b); if (hits) hits[tag] = (hits[tag] || 0) + 1; }
  const t2 = t.replace(/Pushing straight across: (rex|ollie)\b/g, (m, n) => 'Pushing straight across: ' + n.charAt(0).toUpperCase() + n.slice(1));
  if (t2 !== t && hits) hits['shove-caps'] = (hits['shove-caps'] || 0) + 1;
  return t2;
}
// Sprint (rounds 1 and 2): reworded push-off text and formula
const SPRINT_MAIN_FORMULA = 'Push-off = min(strength, μ × his weight)';
const SPRINT_BOLT_FORMULA = 'Push-off = the strength he uses (bolted: no friction or soft-ground limit), and none if that strength is no more than his weight';
const SPRINT_STAND_FORMULA = 'Push-off = min(the strength he uses, μ × min(his weight, what the ground under one foot bears ÷ 2.5)), and none if that strength is no more than his weight';
const SPRINT_MAIN_STRENGTH = /He isn’t strong enough yet to use all the grip on offer, so strength sets his push-off: (.*?N)\.(?=[A-Z]|$|\s)/;
const SPRINT_BOLT_STRENGTH = (x) => 'Bolted to the planet, his strides can’t slip, and the sim doesn’t let a bolted stride sink either, so neither friction nor soft ground caps his push-off: his strength sets it, ' + x + '.';
const SPRINT_BOLT_EFFORT = /Bolted to the planet, his strides can’t slip, and the sim doesn’t let a bolted stride sink either, so neither friction nor soft ground caps his push-off: the strength he uses sets it, (.*?N)\.(?=[A-Z]|$|\s)/;
const SPRINT_TOO_GENTLE = /At this effort he pushes no harder than his own weight \(([^)]*N)\), so he can’t get going: in this sim his speed comes only from the force he has beyond his own weight\./;
// Arm wrestle (round 2): the bolt tear-out flags show only once the table breaks
const ARM_TEAR_CHIPS = ['Ground around Rex’s bolts tears out', 'Ground around Ollie’s bolts tears out'];
const ARM_TEAR_ITEM = /Bolted to the planet holds, but the ground around the bolts doesn’t: past about .*?N the surface breaks up around his feet\./;
module.exports = { INTENDED, mapMain, SPRINT_MAIN_FORMULA, SPRINT_BOLT_FORMULA, SPRINT_STAND_FORMULA, SPRINT_MAIN_STRENGTH, SPRINT_BOLT_STRENGTH, SPRINT_BOLT_EFFORT, SPRINT_TOO_GENTLE, ARM_TEAR_CHIPS, ARM_TEAR_ITEM };
