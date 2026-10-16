global.window = {};
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const F0 = 100 * 907.18474 * g, POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const body = (b) => P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] });
const ctxOf = (extra, b) => Object.assign({ F: F0, mode: 'comic', body: body(b || 'rex'), surface: sf('concrete'), anchor: 'friction' }, POW, extra || {});
const FL = 517100, FX = 5e23, level = (e) => (e > 0 ? sig((Math.log10(e) - Math.log10(FL)) / (Math.log10(FX) - Math.log10(FL)), 2) : '-');
for (const [F, objId, mode] of [[F0, 'baseball', 'hard'], [1e9 * g, 'baseball', 'hard'], [F0, 'car', 'gentle'], [1e9 * g, 'car', 'hard']]) {
  const t0 = Date.now();
  const L = P.catchLeg(ctxOf({ F }), ctxOf({ F }, 'ollie'), ob(objId), 10, mode);
  const c = L.catch || {};
  console.log(objId, sig(F / g) + ' kg-f', mode, 'result', L.result, 'throw v', sig(L.aim && L.aim.vL), 'Ecatch', sig(c.Ecatch), 'Ediss', sig(c.Ediss), 'level', level(c.Ecatch), 'carried', !!c.carried, 'ocean.E', sig(L.flight && L.flight.ocean ? L.flight.ocean.E : 0), (Date.now() - t0) + ' ms', 'keys', Object.keys(L).join(','));
}
const T = P.tossPartner(ctxOf(), ctxOf({}, 'ollie'), {});
console.log('tossPartner keys', Object.keys(T).join(','));
const cc = T.catch || T.catchR || {};
console.log('toss catch', Object.keys(cc).slice(0, 40).join(','), 'Ecatch', sig(cc.Ecatch));
