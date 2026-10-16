const root = process.argv[2];
const P = require(root + '/src/engine.js'); global.window = {}; require(root + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, conc = D.surfaces.find((s) => s.id === 'concrete');
const body = (b) => P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] });
const rex = body('rex'), ollie = body('ollie');
const st = { airAbsorb: 1, keepForm: true, unbreakable: false, ownRecoil: true };
const ctx = (F, b, anchor) => Object.assign({ F, mode: 'comic', body: b, surface: conc, anchor, use: F }, st);
for (const F of [1e34 * g, Infinity]) { const r = P.shove(ctx(F, rex, 'friction'), ctx(F, ollie, 'bolted')); console.log(F, JSON.stringify({ clash: r.clash, stalled: r.stalled, vB: r.vB, oneSided: r.oneSided, EA: r.EA, rJ: r.recoilAbsorbed && r.recoilAbsorbed.J })); }
const u = Object.assign({}, st, { unbreakable: true }); const cu = (F, b, a) => Object.assign({ F, mode: 'comic', body: b, surface: conc, anchor: a, use: F }, u);
const r = P.shove(cu(Infinity, rex, 'friction'), cu(Infinity, ollie, 'bolted')); console.log('unbreakable', JSON.stringify({ clash: r.clash, stalled: r.stalled, oneSided: r.oneSided, EA: r.EA }));
