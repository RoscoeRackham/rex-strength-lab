global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const body = P.makeBody({});
const surf = D.surfaces.find(s => s.id === 'concrete');
let angleDep = 0, n = 0; const ex = []; const comicWorse = [];
const objs = D.objects.filter(o => !o.noThrow && o.m < 1e9);
for (const o of objs) {
  const hands = o.m > 20 ? 2 : 1;
  const style = o.m <= 1 ? 'whip' : 'push';
  const key = style === 'whip' ? 'throwWhip' : 'throwPush';
  const mB = o.m + hands * (style === 'whip' ? body.whipEff : body.handEff);
  for (const mode of ['comic', 'real']) {
    const frac = mode === 'real' ? P.MUSCLE[key].forceFrac : P.MUSCLE[key].comicFrac;
    const Fth = mB * P.K.g / (frac * hands); // strength where Fdrive = mB g
    for (const mult of [0.9, 0.99, 1.001, 1.01, 1.1]) {
      const F = Math.max(Fth * mult, 511 * P.K.g);
      const c = { F, mode, body, surface: surf, groundHolds: false, anchor: 'friction' };
      const by = [0, 20, 45, 70, 89].map(a => { const r = P.throwObject(c, o, a); return r.canHold ? (r.canMove ? 1 : 0) : -1; });
      n++;
      if (by.includes(1) && by.includes(0)) { angleDep++; ex.push([o.id, mode, mult, by.join(',')]); }
    }
  }
  // comic vs real at same strength: real's threshold vs comic's
  const fr = P.MUSCLE[key].forceFrac, fc = P.MUSCLE[key].comicFrac;
  const kgReal = Math.max(mB / (fr * hands), o.m, 511), kgComic = Math.max(mB / (fc * hands), o.m, 511);
  if (kgComic > kgReal * 1.0001) comicWorse.push([o.id, Math.round(kgReal), Math.round(kgComic)]);
}
console.log({ n, angleDep }, ex.slice(0, 10));
console.log('objects where comic needs more strength to throw than real (kg real, kg comic):'); console.log(comicWorse.map(x => x.join(': ')).join('\n'));
