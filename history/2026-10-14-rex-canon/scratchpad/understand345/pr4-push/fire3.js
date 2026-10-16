global.window = {};
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P0 = require(M + '/src/engine.js'); require(M + '/src/data.js');
const P1 = require('./engine-pr4.js');
const D = window.DINO_DATA, g = P0.K.g, surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const sig = (x) => (typeof x === 'number' ? x.toPrecision(4) : String(x));
const mk = (P, F, x, b) => Object.assign({ F, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface: surf('concrete'), anchor: 'friction' }, x);
const base = { airAbsorb: 0, keepForm: false, unbreakable: true, ownRecoil: true };
for (const [lg, oid, D0] of [[14, 'baseball', 10], [16, 'car', 30], [20, 'baseball', 10], [20, 'car', 30]]) for (const anc of ['friction', 'bolted']) for (const nkb of [false, true]) {
  const P = P1;
  const L = P.catchLeg(mk(P, Math.pow(10, lg) * g, base, 'rex'), mk(P, Math.pow(10, lg) * g, Object.assign({}, base, { anchor: anc, noKnockback: nkb }), 'ollie'), obj(oid), D0, 'hard');
  const L0 = P0.catchLeg(mk(P0, Math.pow(10, lg) * g, base, 'rex'), mk(P0, Math.pow(10, lg) * g, Object.assign({}, base, { anchor: anc }), 'ollie'), obj(oid), D0, 'hard');
  const fb = L.fireball, fb0 = L0.fireball;
  console.log(lg, oid, D0, anc, 'nkb', nkb, L.result, fb && fb.kind, 'p', sig(fb.p), 'push', JSON.stringify(fb.push, (k, v) => typeof v === 'number' ? sig(v) : v), 'Ehere', sig(fb.Ehere), 'Ecarry', sig(fb.Ecarry), 'Eblast', sig(fb.Eblast), '| main recoilV', sig(fb0.push.recoilV), 'Eblast', sig(fb0.Eblast), 'sameAsMain', JSON.stringify(L) === JSON.stringify(L0));
}
// infinite dial
for (const nkb of [false, true]) { const L = P1.catchLeg(mk(P1, Infinity, base, 'rex'), mk(P1, Infinity, Object.assign({}, base, { noKnockback: nkb }), 'ollie'), obj('baseball'), 10, 'hard'); console.log('inf nkb', nkb, L.result, L.fireball && JSON.stringify(L.fireball.push), L.fireball && L.fireball.p); }
