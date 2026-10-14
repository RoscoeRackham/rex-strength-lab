global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const ang of [90, 89, 60, 45, 10, 0]) for (const lg of [9, 10, 11, 12, 13]) {
  const c = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, ON);
  const t0 = Date.now(); const r = P.throwObject(c, obj('car'), ang); const dt = Date.now() - t0;
  const f = r.flight;
  console.log(ang, lg, 'v', (r.v/1000).toPrecision(3), 'km/s', 'ms', dt, f.relativistic ? 'rel' : '', f.escaped ? 'escaped' : '', f.orbit ? 'orbit' : '', f.landed ? 'landed ' + (f.range/1000).toPrecision(3) + 'km' : '', f.timedOut || f.stillFlying ? 'TIMEOUT' : '', Object.keys(f).filter(k=>/still|cap|steps/i.test(k)).join(','));
}
