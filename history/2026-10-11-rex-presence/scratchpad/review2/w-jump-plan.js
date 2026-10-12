global.window = {};
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/wip/src/engine.js');
require('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/wip/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const [sid, Fk, mode, mv] = [process.argv[2], Number(process.argv[3]), process.argv[4] || 'comic', process.argv[5] || 'jump'];
const F = isFinite(Fk) ? Fk * g : Infinity;
const c = { F, mode, body: rex, surface: D.surfaces.find((s) => s.id === sid), groundHolds: false, anchor: 'friction' };
const p = R.planNow(mv, c, { target: 3 });
const kg = (x) => (x == null ? x : isFinite(x) ? (x / g).toPrecision(3) + ' kg' : x);
console.log(mv, sid, mode, Fk, 'goal', kg(p.goal().use), 'ceiling', JSON.stringify(Object.assign({}, p.ceiling(), { use: kg(p.ceiling().use), below: kg(p.ceiling().below) })));
for (const h of R.HAZARDS) { const r = p.result('hazard:' + h.id); console.log('  hazard', h.id, r.never ? 'never' : r.onlyUnlimited ? 'onlyUnlimited' : kg(r.use)); }
const all = p.run(undefined);
console.log('  all-out: v', all.v, 'hazards now', R.HAZARDS.filter((h) => h.test(R.MOVES[mv], all, p.opt)).map((h) => h.id).join(','));
