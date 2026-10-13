const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB1/verify-brief/copy/rex-strength-lab/';
const P = require(R+'src/engine.js'); global.window = {}; require(R+'src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find(s => s.id === 'concrete');
const mk = (kg, pw, extra) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction', airAbsorb: pw?1:0, keepForm: pw, unbreakable: pw, ownRecoil: pw }, extra||{});
for (const kg of [1e5,1e7,1e9]) {
  for (const pw of [false,true]) {
    const r = P.collide(mk(kg,pw), mk(kg,pw), { source:'stomp' });
    console.log(kg, pw?'defaults':'off', 'noCharge=', r.noCharge, 'v0=', r.speed && r.speed.v && r.speed.v.toFixed(2));
  }
  const r = P.collide(mk(kg,false,{ownRecoil:true}), mk(kg,false,{ownRecoil:true}), { source:'stomp' });
  console.log(kg, 'ownRecoil only noCharge=', r.noCharge);
}
