// node mkstates.js <out.json> <powers: on|recoilOff|off> [dials]
const [outP, pw, dialsArg] = process.argv.slice(2);
const T = {
  arm: { duoAction: 'arm' },
  armK: { duoAction: 'arm', keepForm: false },
  match: { duoAction: 'wrestle', wrestleMove: 'push' },
  shoveR: { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' },
  shoveO: { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'ollie' },
  both: { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' },
  lift: { duoAction: 'wrestle', wrestleMove: 'lift' },
  throw: { duoAction: 'wrestle', wrestleMove: 'throw' },
  sprint: { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint' },
  bounce: { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint', colBounce: 'bounce' },
  rexCh: { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint', colWho: 'rex' },
  jump: { duoAction: 'collide', colMode: 'charge', colSrc: 'jump' },
  stomp: { duoAction: 'collide', colMode: 'charge', colSrc: 'stomp' },
  set: { duoAction: 'collide', colMode: 'charge', colSrc: 'set' },
  push: { duoAction: 'collide', colMode: 'push' },
  pushR: { duoAction: 'collide', colMode: 'push', colWho: 'rex' },
  catch: { duoAction: 'catch' },
  fire: { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', keepForm: false, airAbsorb: 0.5 },
  toss: { duoAction: 'catch', cObj: 'partner' },
};
const B = { n: {}, r: { anchor: 'bolted' }, o: { oAnchor: 'bolted' }, b: { anchor: 'bolted', oAnchor: 'bolted' } };
const DIALS = { d: {}, k9: { logKg: 9 }, inf: { inf: true } };
const P = { on: {}, recoilOff: { ownRecoil: false }, off: { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false } };
const dials = (dialsArg || 'd,k9,inf').split(',');
const out = {};
for (const [t, ts] of Object.entries(T)) for (const [b, bs] of Object.entries(B)) for (const d of dials) {
  const st = Object.assign({}, ts, bs, DIALS[d], P[pw]);
  if (t === 'fire' && d !== 'inf') st.logKg = 14;
  out[[t, b, d, pw].join('|')] = { state: st };
}
require('fs').writeFileSync(outP, JSON.stringify(out));
console.log(Object.keys(out).length);
