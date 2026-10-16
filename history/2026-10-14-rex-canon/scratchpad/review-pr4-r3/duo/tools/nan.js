const { P, D, g, surf, rex, ollie, ON } = require('./eng.js');
const nanPaths = (o, p, out, seen) => { if (o === null || o === undefined) return; if (typeof o === 'number') { if (Number.isNaN(o)) out.push(p); return; } if (typeof o !== 'object' || seen.has(o)) return; seen.add(o); for (const k of Object.keys(o)) nanPaths(o[k], p + '.' + k, out, seen); };
const FS = [2600 * g, 1e5 * g, 1e9 * g, 1e15 * g, Infinity];
const SUR = ['concrete', 'sand', 'ice', 'granite', 'softclay'];
const PW = { on: ON, off: {}, ro: Object.assign({}, ON, { ownRecoil: false }), ub: { unbreakable: true }, oro: { ownRecoil: true } };
let n = 0; const bad = new Map();
const note = (k, x) => { if (!bad.has(k)) bad.set(k, x); };
for (const [pn, pw] of Object.entries(PW)) for (const sid of SUR) for (const FA of FS) for (const FB of FS) for (const [aA, aB] of [['friction','friction'],['bolted','friction'],['friction','bolted'],['bolted','bolted']]) for (const mode of ['comic', 'real']) for (const kf of [true, false]) {
  const base = { mode, surface: surf(sid), keepForm: kf };
  const cA = Object.assign({ F: FA, body: rex, anchor: aA }, pw, base), cB = Object.assign({ F: FB, body: ollie, anchor: aB }, pw, base);
  if (!pw.keepForm && kf && pn !== 'on') continue;
  const calls = {
    arm: () => P.armWrestle(cA, cB), match: () => P.pushMatch(cA, cB), shove: () => P.shove(cA, cB), both: () => P.shoveBoth(cA, cB), push: () => P.standoff(cB, cA),
    sprint: () => P.collide(cB, cA, { source: 'sprint' }), bounce: () => P.collide(cB, cA, { source: 'sprint', bounce: true }), jump: () => P.collide(cB, cA, { source: 'jump' }),
    set: () => P.collide(cB, cA, { source: 'set', gb: 1e-3 }), setB: () => P.collide(cB, cA, { source: 'set', gb: 1e-6 * 400 / 299.792458, bounce: true }), mean: () => P.collide(cB, cA, { source: 'set', gb: 1e-3, meanIt: true }),
  };
  for (const [nm, f] of Object.entries(calls)) {
    n++;
    let r; try { r = f(); } catch (e) { note(nm + ' THROW ' + e.message, [pn, sid, FA / g, FB / g, aA, aB, mode, kf].join('|')); continue; }
    const out = []; nanPaths(r, nm, out, new Set());
    for (const p of out) note(p.replace(/\.\d+/g, '[]'), [pn, sid, FA / g, FB / g, aA, aB, mode, kf].join('|'));
  }
}
console.log(n + ' calls'); for (const [k, v] of bad) console.log('NaN', k, '@', v);
