global.window = {}; const P = require('./repo/src/engine.js'); require('./repo/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
for (const lg of [5, 6]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('sand'), anchor: 'friction', unbreakable: true };
  const j = P.jump(c);
  const o = { surface: c.surface, body: rex, m: rex.m, unbreakable: true, near: 5 };
  const src = M.jump.shake(j, o);
  const RB = P.qultFor(c.surface, rex.footB) * 2 * rex.footArea;
  console.log('sand dial 10^' + lg + ' kg: v', j.v.toPrecision(3), 'pushOff', JSON.stringify(j.pushOff), 'overLimitReal', j.overLimitReal, 'bearing RB', RB.toPrecision(3), 'N');
  const T = j.pushOff ? j.pushOff.T : 0, J = j.pushOff ? j.pushOff.J : 0;
  const Jcap = Math.min(J, (RB) * T);
  const full = P.impulseSource(c.surface, J, T), cap = P.impulseSource(c.surface, Jcap, T);
  console.log('  shaking from the full push: ppv@5m', (P.ppvAt(full, 5) * 1000).toPrecision(3), 'mm/s, plaster to', P.plasterReach(full).toPrecision(3), 'm; from the push the sand bears (', Jcap.toPrecision(3), 'N s): ppv', (P.ppvAt(cap, 5) * 1000).toPrecision(3), 'mm/s, plaster to', P.plasterReach(cap).toPrecision(3), 'm');
}
