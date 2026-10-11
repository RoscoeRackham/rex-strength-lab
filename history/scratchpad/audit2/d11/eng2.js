global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
for (const mode of ['real','comic']) {
  const c = { F: 511 * P.K.g, mode, body, surface, groundHolds: false, anchor: 'friction' };
  console.log(mode, P.punch(c).vFist);
}
const row = D.sources ? null : null;
// find the source row
const find = (o, path='') => { if (o && typeof o === 'object') { for (const k in o) { const v = o[k]; if (v && typeof v === 'object' && v.label && /punch/i.test(v.label)) console.log(path+'.'+k, JSON.stringify(v).slice(0,300)); find(v, path+'.'+k);} } };
find(D);
