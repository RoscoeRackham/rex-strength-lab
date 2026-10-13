const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const ball = D.objects.find(o => o.id === 'baseball');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, kg, share) => ({ F: kg * P.K.g, mode: 'comic', body: b, surface, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
const c = P.K.c;
const pick = (o, ks) => Object.fromEntries(ks.filter(k => o && k in o).map(k => [k, o[k]]));
for (const s of [0.9993281401882652, 0.9993281401882743, 0.99999, 1]) {
  const L = P.catchLeg(mk(rex, 1e20, s), mk(ollie, 1e20, s), ball, 1000, 'hard');
  console.log('share', s, L.result);
  if (L.fireball) console.log(' fireball', pick(L.fireball, ['kind','E','Egap','Earr','Ehere','Eafter','Ecarry','Enear','Eblast','mLump','p','vLumpAt']), 'pushV/c', L.fireball.push.recoilV / c);
  if (L.catch) console.log(' catch', pick(L.catch, ['relativistic','carried','uAfter','v1','E1','Ecatch','Ediss','Eride','Enear','pIn','mh']), 'uAfter/c', L.catch.uAfter / c);
  if (L.sheath) console.log(' sheath', L.sheath);
}
