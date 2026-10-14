const L = [];
for (const s of [1, 0.5]) for (const e of ['windows', 'houses', 'block', 'rattle'])
  L.push({ name: 'hint_car10_' + s + '_' + e, tab: 'throw', st: { obj: 'car', angle: 0, logKg: 10, airAbsorb: s }, effort: e });
L.push({ name: 'hint_base_def_windows', tab: 'throw', st: { obj: 'baseball', angle: 0, logKg: 7 }, effort: 'windows' });
L.push({ name: 'hint_base_def_block', tab: 'throw', st: { obj: 'baseball', angle: 0, logKg: 7 }, effort: 'block' });
L.push({ name: 'hint_car_up_10_block', tab: 'throw', st: { obj: 'car', angle: 90, logKg: 10 }, effort: 'block' });
module.exports = L;
