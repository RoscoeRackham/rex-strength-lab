const { P, D, rex, surf, obj, ctxOf, ppv5, plaster } = require('./common.js');
const s = surf('sand');
const qult = P.qultFor(s, rex.footB), Nmax = qult * 2 * rex.footArea;
console.log('sand qult', qult.toFixed(0), 'Nmax both', Nmax.toFixed(0), 'mu', s.mu, 'mu*Nmax', (s.mu * Nmax).toFixed(0), 'W', (rex.m * P.K.g).toFixed(0));
for (const [kg, th, own] of [[1e5, 0, true], [1e6, 0, true], [1e6, 45, false], [1e5, 45, false], [1e5, 45, true]]) {
  const r = P.throwOnce(ctxOf({ F: kg * P.K.g, surface: s, ownRecoil: own }), obj('car'), th);
  const tg = r.toGround;
  const Jh = tg.whole ? tg.whole * Math.cos(th * Math.PI / 180) : tg.J * Math.cos(th * Math.PI / 180);
  console.log(`kg=${kg} th=${th} own=${own}: toGround J=${tg.J.toFixed(0)} T=${(tg.T*1000).toFixed(1)}ms whole=${tg.whole} supplied=${tg.supplied}  sideways=${Jh.toFixed(0)} meanF=${(Jh/tg.T/1000).toFixed(0)}kN  ppv5=${ppv5(s, tg).toFixed(2)}mm/s plaster=${plaster(s, tg).toFixed(1)}m  recoilV=${r.recoilV.toFixed(2)} anchor=${r.anchor.limit} slide? ; capH=mu*Nmax*T=${(s.mu*Nmax*tg.T).toFixed(0)} ppv5(capped)=${ppv5(s,{J:Math.hypot(Math.min(Jh, s.mu*Nmax*tg.T), tg.whole? tg.J*0 + Math.sqrt(Math.max(0,tg.J**2 - Jh**2)) : tg.J*Math.sin(th*Math.PI/180)), T:tg.T}).toFixed(2)}`);
}
