const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const L = [];
const P = ['rattle', 'plaster', 'windows', 'ground', 'houses', 'block'];
const cases = [['arm', {}], ['wpush', { wrestleMove: 'push' }], ['wshove', { wrestleMove: 'shove' }], ['wlift', { wrestleMove: 'lift' }], ['wthrow', { wrestleMove: 'throw' }], ['cbase', { cObj: 'baseball' }], ['cpartner', { cObj: 'partner' }], ['col', {}], ['colpush', { colMode: 'push' }], ['colbolt', { anchor: 'bolted' }]];
for (const [n, st] of cases) for (const e of P) {
  const tab = n === 'arm' ? 'arm' : n[0] === 'w' ? 'wrestle' : n.startsWith('col') ? 'collide' : 'catch';
  L.push({ name: 'dp_' + n + '_' + e, tab, st, duoEffort: e });
}
for (const e of ['plaster', 'ground', 'rattle']) L.push({ name: 'dp_off_col_' + e, tab: 'collide', st: OFF, duoEffort: e });
for (const e of ['plaster', 'ground']) L.push({ name: 'dp_off_cbase_' + e, tab: 'catch', st: OFF, duoEffort: e });
for (const e of ['plaster']) L.push({ name: 'dp_ice_col_' + e, tab: 'collide', st: { surface: 'ice' }, duoEffort: e });
module.exports = L;
