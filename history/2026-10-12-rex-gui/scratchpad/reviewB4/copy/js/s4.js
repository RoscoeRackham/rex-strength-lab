const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const L = [];
L.push({ name: 'duo_arm_def', tab: 'arm', st: {} });
L.push({ name: 'duo_arm_off', tab: 'arm', st: OFF });
L.push({ name: 'duo_arm_allout', tab: 'arm', st: {}, duoEffort: 'allout' });
L.push({ name: 'duo_arm_allout_off', tab: 'arm', st: OFF, duoEffort: 'allout' });
for (const m of ['push', 'shove', 'lift', 'throw']) {
  L.push({ name: 'duo_w_' + m + '_def', tab: 'wrestle', st: { wrestleMove: m } });
  L.push({ name: 'duo_w_' + m + '_allout', tab: 'wrestle', st: { wrestleMove: m }, duoEffort: 'allout' });
  L.push({ name: 'duo_w_' + m + '_off_allout', tab: 'wrestle', st: Object.assign({ wrestleMove: m }, OFF), duoEffort: 'allout' });
}
for (const o of ['baseball', 'car', 'partner', 'bowling']) {
  L.push({ name: 'duo_c_' + o + '_def', tab: 'catch', st: { cObj: o } });
  L.push({ name: 'duo_c_' + o + '_hard_allout', tab: 'catch', st: { cObj: o, cStyle: 'hard' }, duoEffort: 'allout' });
}
L.push({ name: 'duo_col_def', tab: 'collide', st: {} });
L.push({ name: 'duo_col_bolted', tab: 'collide', st: { anchor: 'bolted' } });
L.push({ name: 'duo_col_push', tab: 'collide', st: { colMode: 'push' } });
L.push({ name: 'duo_col_push_bolted', tab: 'collide', st: { colMode: 'push', anchor: 'bolted', oAnchor: 'bolted' } });
L.push({ name: 'duo_col_imm', tab: 'collide', st: { colImm: true } });
L.push({ name: 'duo_col_off', tab: 'collide', st: OFF });
module.exports = L;
