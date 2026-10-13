global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, M = P.RESTRAINT.MOVES;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
for (const sid of ['concrete', 'sand']) {
  const surface = D.surfaces.find(s => s.id === sid);
  console.log('== ' + sid);
  for (let lg = 4; lg <= 11; lg += 0.5) {
    for (const [nm, pw] of [['on', ON], ['off', OFF]]) {
      const ctx = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface, anchor: 'friction' }, pw);
      const r = P.jump(ctx);
      const o = Object.assign({ surface, body: rex, m: rex.m, near: 5 }, pw);
      const src = M.jump.shake(r, o);
      const list = Array.isArray(src) ? src : [src];
      const parts = list.map(s => s ? (P.ppvAt(s, 5) * 1000).toFixed(1) : '-').join(',');
      console.log(lg.toFixed(1), nm, 'v', r.v.toPrecision(3), 'landed', r.landing.landed, 'ppv5 total', (P.ppvAt(src, 5) * 1000).toFixed(1), 'mm/s parts[' + parts + ']', r.pushOff ? 'pushOff J ' + r.pushOff.J.toPrecision(4) + ' T ' + (r.pushOff.T * 1000).toPrecision(3) + 'ms' : '');
    }
  }
}
