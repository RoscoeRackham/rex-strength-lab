const out = [];
const add = (name, st, duo) => out.push({ name, state: st, duo: !!duo, shot: false });
const groups = { def: {}, off: { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, noown: { ownRecoil: false } };
for (const [g, gs] of Object.entries(groups)) {
  add(g + '__d9_throw_car_ground', Object.assign({ logKg: 9, action: 'throw', obj: 'car', angle: 45, effort: 'ground' }, gs));
  add(g + '__d9_throw_semi0_least', Object.assign({ logKg: 9, action: 'throw', obj: 'semi', angle: 0, effort: 'least' }, gs));
  add(g + '__d9_throw_semi0_allout', Object.assign({ logKg: 9, action: 'throw', obj: 'semi', angle: 0, effort: 'allout' }, gs));
  add(g + '__throw_semi0_rattle', Object.assign({ action: 'throw', obj: 'semi', angle: 0, effort: 'rattle' }, gs));
  add(g + '__arm_pin', Object.assign({ duoOpen: true, duoAction: 'arm', oSame: false, oLogKg: 4.5, duoEffort: 'allout' }, gs), true);
  add(g + '__d20_catch_ball_fast', Object.assign({ logKg: 20, duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', duoEffort: 'allout' }, gs), true);
  add(g + '__d20_catch_fireball', Object.assign({ logKg: 20, duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', duoEffort: 'allout', keepForm: false, airAbsorb: 0.5 }, gs), true);
  add(g + '__wr_shove_plaster', Object.assign({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', duoEffort: 'allout' }, gs), true);
  add(g + '__d9_wr_throw_allout', Object.assign({ logKg: 9, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', duoEffort: 'allout' }, gs), true);
  add(g + '__d9_catch_partner_allout', Object.assign({ logKg: 9, duoOpen: true, duoAction: 'catch', cObj: 'partner', duoEffort: 'allout' }, gs), true);
  add(g + '__throw_car_mid', Object.assign({ action: 'throw', obj: 'car', effort: 'custom', effortLogKg: 4 }, gs));
  add(g + '__d9_stomp_allout', Object.assign({ logKg: 9, action: 'stomp', effort: 'allout' }, gs));
}
require('fs').writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(out.length);
