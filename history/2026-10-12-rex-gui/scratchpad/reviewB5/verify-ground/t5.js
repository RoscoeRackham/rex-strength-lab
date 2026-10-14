const { P, D, rex, surf, obj, ctxOf } = require('./common.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const g = P.K.g, s = surf('concrete');
for (const [own, bB] of [[false, 'bolted'], [true, 'bolted'], [false, 'friction'], [true, 'friction']]) {
  const cA = ctxOf({ F: 1e6 * g, surface: s, ownRecoil: own }), cB = Object.assign(ctxOf({ F: 1e6 * g, surface: s, anchor: bB }), { body: ollie });
  const r = P.shove(cA, cB);
  const tg = r.toGround;
  const push = r.push;
  const Fpush = push.xA + push.xB > 0 ? push.work / (push.xA + push.xB) : 0;
  const pA = r.vA * rex.m;
  const Jb = Fpush * push.t, Tb = Math.max(P.limbPulse(ollie), push.t);
  const srcB = P.impulseSource(s, Jb, Tb);
  console.log(`own=${own} ollie=${bB}: stalled=${r.stalled} vA=${r.vA.toFixed(2)} vB=${r.vB.toFixed(2)} pA=${pA.toFixed(0)} toGround(Rex feet) J=${tg ? tg.J.toFixed(0) : '-'} T=${tg ? (tg.T*1000).toFixed(1) : '-'}ms ppv5=${tg ? (P.ppvAt(P.impulseSource(s, tg.J, tg.T), 5)*1000).toFixed(2) : '-'}mm/s plaster=${tg ? P.plasterReach(P.impulseSource(s, tg.J, tg.T)).toFixed(1) : '-'} | bolts F t=${Jb.toFixed(0)} over ${(Tb*1000).toFixed(1)}ms ppv5=${(P.ppvAt(srcB,5)*1000).toFixed(1)} plaster=${P.plasterReach(srcB).toFixed(1)}m`);
}
