const L = [];
for (const s of [1, 0.5, 0]) {
  L.push({ name: 'cat_b8_' + s, tab: 'catch', st: { cObj: 'baseball', cStyle: 'hard', logKg: 8, airAbsorb: s }, duoEffort: 'allout' });
  L.push({ name: 'cat_b15_' + s, tab: 'catch', st: { cObj: 'baseball', cStyle: 'hard', logKg: 15, airAbsorb: s, cLogD: 1 }, duoEffort: 'allout' });
}
L.push({ name: 'cat_b15_far_1', tab: 'catch', st: { cObj: 'baseball', cStyle: 'hard', logKg: 15, cLogD: 5 }, duoEffort: 'allout' });
L.push({ name: 'cat_p15_1', tab: 'catch', st: { cObj: 'partner', cStyle: 'hard', logKg: 20 }, duoEffort: 'allout' });
L.push({ name: 'cat_p15_05', tab: 'catch', st: { cObj: 'partner', cStyle: 'hard', logKg: 20, airAbsorb: 0.5 }, duoEffort: 'allout' });
L.push({ name: 'wt_rel_1', tab: 'wrestle', st: { wrestleMove: 'throw', logKg: 20 }, duoEffort: 'allout' });
L.push({ name: 'wt_rel_05', tab: 'wrestle', st: { wrestleMove: 'throw', logKg: 20, airAbsorb: 0.5 }, duoEffort: 'allout' });
L.push({ name: 'arm_super', tab: 'arm', st: { logKg: 9 }, duoEffort: 'allout' });
L.push({ name: 'arm_super_least', tab: 'arm', st: { logKg: 9 } });
module.exports = L;
