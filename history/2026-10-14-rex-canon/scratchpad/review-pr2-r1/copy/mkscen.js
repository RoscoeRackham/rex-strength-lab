const groups = { def: {}, bolt: { anchor: 'bolted', oAnchor: 'bolted' }, noown: { ownRecoil: false }, off: { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false } };
const tabs = {
  throw_car_least: { action: 'throw', obj: 'car', effort: 'least' },
  throw_car_allout: { action: 'throw', obj: 'car', effort: 'allout' },
  throw_car_gentle: { action: 'throw', obj: 'car', effort: 'custom', effortLogKg: 2 },
  throw_loco_least: { action: 'throw', obj: 'loco', effort: 'least', angle: 0 },
  throw_loco_allout: { action: 'throw', obj: 'loco', effort: 'allout', angle: 0 },
  throw_person_least: { action: 'throw', obj: 'person', effort: 'least' },
  stomp_least: { action: 'stomp', effort: 'least' },
  stomp_allout: { action: 'stomp', effort: 'allout' },
  punch_least: { action: 'punch', effort: 'least' },
  punch_allout: { action: 'punch', effort: 'allout' },
  pull_least: { action: 'pull', obj: 'car', effort: 'least' },
  pull_allout: { action: 'pull', obj: 'car', effort: 'allout' },
  pull_plaster: { action: 'pull', obj: 'car', effort: 'plaster' },
  throw_car_ground: { action: 'throw', obj: 'car', effort: 'ground' },
  arm: { duo: true, duoOpen: true, duoAction: 'arm' },
  arm_allout: { duo: true, duoOpen: true, duoAction: 'arm', duoEffort: 'allout' },
  wr_push: { duo: true, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push' },
  wr_shove: { duo: true, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove' },
  wr_shove_allout: { duo: true, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', duoEffort: 'allout' },
  wr_throw: { duo: true, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw' },
  wr_throw_allout: { duo: true, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', duoEffort: 'allout' },
  catch_ball: { duo: true, duoOpen: true, duoAction: 'catch', cObj: 'baseball' },
  catch_ball_fast: { duo: true, duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', duoEffort: 'allout' },
  catch_bus_hard: { duo: true, duoOpen: true, duoAction: 'catch', cObj: 'bus', cStyle: 'hard', cLogD: 1, duoEffort: 'allout' },
  catch_partner: { duo: true, duoOpen: true, duoAction: 'catch', cObj: 'partner' },
  catch_partner_allout: { duo: true, duoOpen: true, duoAction: 'catch', cObj: 'partner', duoEffort: 'allout' },
};
const out = [];
for (const [g, gs] of Object.entries(groups)) for (const [t, ts] of Object.entries(tabs)) {
  const st = Object.assign({}, ts, gs); const duo = !!st.duo; delete st.duo;
  out.push({ name: g + '__' + t, state: st, duo, shot: false });
}
require('fs').writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(out.length);
