// does each mutation change a powers-off result that the page can show?
global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const { canon } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const g = 9.80665, surf = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((o) => o.id === id);
const load = (f) => { delete require.cache[require.resolve(f)]; return require(f); };
const P0 = load('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const probes = {
  'mA-fireball-E': (P) => { const R = { F: 1e14 * g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction' }; const O = Object.assign({}, R, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) }); const L = P.catchLeg(R, O, obj('baseball'), 30, 'hard'); return [L.result, L.fireball && L.fireball.E, L.fireball && L.fireball.Egap]; },
  'mB-well-easy': (P) => { const R = { F: Infinity, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 1e21 }), surface: surf, anchor: 'friction' }; const O = Object.assign({}, R, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 1e21 }) }); const L = P.catchLeg(R, O, obj('baseball'), 30, 'easy'); return [L.result, L.vArrive, L.wells && L.wells.wellDominated]; },
  'mC-catchIt-rel': (P) => { const R = { F: 1e12 * g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction', keepForm: false }; const O = Object.assign({}, R, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) }); const L = P.catchLeg(R, O, obj('person'), 30, 'hard'); return [L.result, L.catch && L.catch.E1]; },
  'mD-toss': (P) => { const R = { F: 1e13 * g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction' }; const r = P.tossPartner(R, P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }), 'Ollie', 'hard', 10, 'friction'); return [r.result, r.v]; },
  'mE-wellRun': (P) => { const R = { F: Infinity, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 1e21 }), surface: surf, anchor: 'friction' }; const O = Object.assign({}, R, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 1e21 }) }); const L = P.catchLeg(R, O, obj('baseball'), 30, 'easy'); return [L.result, L.vArrive]; },
  'mF-relthrow-blast': (P) => { const c = { F: 1e20 * g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction' }; const r = P.throwObject(c, obj('baseball'), 0); return [P.RESTRAINT.MOVES.throw.blast(r, { obj: obj('baseball'), angle: 0 })]; },
};
for (const [m, f] of Object.entries(probes)) { const P1 = load(__dirname + '/' + m + '.js'); const a = f(P0), b = f(P1); console.log(m, canon(a) === canon(b) ? 'NO EFFECT on probe' : 'changes a powers-off result:', JSON.stringify(a), '->', JSON.stringify(b)); }
