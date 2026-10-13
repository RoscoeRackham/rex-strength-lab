const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const L = [];
for (const e of ['rattle', 'plaster', 'windows', 'ground', 'houses', 'block', 'ceiling'])
  L.push({ name: 'pre_car6_' + e, tab: 'throw', st: { obj: 'car', logKg: 6 }, effort: e });
for (const e of ['windows', 'houses', 'block'])
  L.push({ name: 'pre_bowl_' + e, tab: 'throw', st: { obj: 'bowling', logKg: 4.96 }, effort: e });
L.push({ name: 'pre_car_windows_def', tab: 'throw', st: { obj: 'car' }, effort: 'windows' });
L.push({ name: 'pre_car_block_def', tab: 'throw', st: { obj: 'car' }, effort: 'block' });
L.push({ name: 'pre_car_ground_def', tab: 'throw', st: { obj: 'car' }, effort: 'ground' });
L.push({ name: 'pre_car_ground_sand', tab: 'throw', st: { obj: 'car', surface: 'sand' }, effort: 'ground' });
L.push({ name: 'pre_jump_ground', tab: 'jump', st: {}, effort: 'ground' });
L.push({ name: 'pre_stomp_ground', tab: 'stomp', st: {}, effort: 'ground' });
L.push({ name: 'pre_stomp_plaster', tab: 'stomp', st: {}, effort: 'plaster' });
L.push({ name: 'pre_punch_plaster', tab: 'punch', st: {}, effort: 'plaster' });
L.push({ name: 'pre_punch_rattle', tab: 'punch', st: {}, effort: 'rattle' });
L.push({ name: 'pre_pull_plaster', tab: 'pull', st: {}, effort: 'plaster' });
L.push({ name: 'pre_pull_plaster_off', tab: 'pull', st: { ownRecoil: false }, effort: 'plaster' });
L.push({ name: 'pre_sprint_plaster', tab: 'sprint', st: {}, effort: 'plaster' });
L.push({ name: 'pre_clap_plaster', tab: 'clap', st: {}, effort: 'plaster' });
L.push({ name: 'pre_throw_ice_plaster', tab: 'throw', st: { surface: 'ice' }, effort: 'plaster' });
module.exports = L;
