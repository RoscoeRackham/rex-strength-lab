global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, M = P.RESTRAINT.MOVES.jump;
for (const build of ['ollie']) for (const sid of ['sand', 'concrete']) {
  const body = P.makeBody({ build, H: 3.06, m: 3007 }), sf = D.surfaces.find(s => s.id === sid);
  const row = [];
  for (const lg of [7, 8, 9, 10, 11, 12.2]) {
    const on = { mode: 'comic', body, surface: sf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const r = P.jump(Object.assign({ F: Math.pow(10, lg) * P.K.g }, on));
    const all = M.shake(r, Object.assign({ near: 5, m: body.m, body, surface: sf }, on)).filter(Boolean), land = all.slice(0, 2);
    if (!r.landing.landed || all.length < 3) { row.push('10^' + lg + ': no landing/push ' + all.length); continue; } const Jbody = land[0].F * land[0].T / 2, Jpush = all[2].F * all[2].T / 2;
    row.push(`10^${lg}: bodyJ ${Jbody.toPrecision(3)} pushJ ${Jpush.toPrecision(3)} landPPV5 ${(P.ppvAt(land, 5)*1e3).toFixed(1)} landPlR ${P.plasterReach(land).toFixed(2)} wholePPV5 ${(P.ppvAt(all, 5)*1e3).toFixed(1)} wholePlR ${P.plasterReach(all).toFixed(2)} m·v1 ${(body.m*r.landV1).toFixed(0)}`);
  }
  console.log(build, sid); row.forEach(x => console.log('  ' + x));
}
