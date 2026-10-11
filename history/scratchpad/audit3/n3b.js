global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
for (const surfId of ['concrete','sand']) for (const gh of [false,true]) for (const anchor of ['friction','braced','bolted']) {
  const hits = {};
  for (let lk = Math.log10(511); lk <= 9; lk += 0.25) {
    const c = { F: Math.pow(10, lk)*g, mode:'comic', body, surface: D.surfaces.find(s=>s.id===surfId), groundHolds: gh, anchor };
    for (const [n, fn] of [['jump',P.jump],['stomp',P.stomp],['punch',P.punch],['clap',P.clap]]) {
      const r = fn(c);
      if (r.basis === 'real') (hits[n] = hits[n] || []).push(lk.toFixed(2));
    }
  }
  console.log(surfId, gh, anchor, JSON.stringify(hits));
}
// throw: which objects/angles at default
const hitsT = [];
for (let lk = Math.log10(511); lk <= 9; lk += 0.5) for (const o of D.objects.filter(x=>!x.noThrow)) for (const a of [30,45]) {
  const c = { F: Math.pow(10, lk)*g, mode:'comic', body, surface: D.surfaces.find(s=>s.id==='concrete'), groundHolds: false, anchor:'friction' };
  const r = P.throwObject(c, o, a);
  if (r.basis === 'real') hitsT.push(o.id+'@'+lk.toFixed(1)+'/'+a);
}
console.log('throw real-basis count', hitsT.length, hitsT.slice(0,40).join(' '));
