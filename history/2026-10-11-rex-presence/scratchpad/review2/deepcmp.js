// Deep-compare all-out results of main's engine and HEAD's on the same inputs (switches off, no use).
global.window = {};
const PM = require('./main/engine.js'); require('./main/data.js'); const DM = window.DINO_DATA;
delete require.cache[require.resolve('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js')];
global.window = {};
const PH = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const DH = window.DINO_DATA;
const g = 9.80665;
const diffs = new Map();
function cmp(a, b, path, depth) {
  if (depth > 6) return;
  if (typeof a === 'function' || typeof b === 'function') return;
  if (typeof a === 'number' && typeof b === 'number') { if (!(a === b || (Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) <= 1e-12 * Math.abs(a))) diffs.set(path, (diffs.get(path) || 0) + 1); return; }
  if (a && b && typeof a === 'object' && typeof b === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { if (!(k in a)) { diffs.set(path + '.' + k + ' (new)', 1); continue; } if (!(k in b)) { diffs.set(path + '.' + k + ' (removed)', 1); continue; } cmp(a[k], b[k], path + '.' + k, depth + 1); } return; }
  if (a !== b) diffs.set(path, (diffs.get(path) || 0) + 1);
}
const mk = (P, D, b, F, mode, sid, anchor) => ({ F, mode, body: P.makeBody(b), surface: D.surfaces.find((s) => s.id === sid), groundHolds: false, anchor });
for (const mode of ['comic', 'real']) for (const sid of ['sand', 'concrete', 'granite']) for (const lg of [4, 7, 12, 20]) for (const anchor of ['friction', 'bolted']) {
  const F = Math.pow(10, lg) * g;
  const R = { build: 'rex', H: 3.048, m: 3007 }, O = { build: 'ollie', H: 3.06, m: 3007 };
  const run = (P, D) => {
    const cR = mk(P, D, R, F, mode, sid, anchor), cO = mk(P, D, O, F, mode, sid, anchor), ob = (id) => D.objects.find((o) => o.id === id);
    return {
      throwCar: P.throwObject(cR, ob('car'), 45), jump: P.jump(cR), stomp: P.stomp(cR), punch: P.punch(cR), clap: P.clap(cR), sprint: P.sprint(cR), pull: P.pull(cR, ob('bus')), lift: P.lift(cR, ob('pickup')),
      arm: P.armWrestle(cR, cO), shove: P.shove(cR, cO), tp: P.throwPartner(cR, cO, 45),
      catchB: P.catchLeg(cR, cO, ob('baseball'), 10, 'easy'), catchCar: P.catchLeg(cR, cO, ob('car'), 100, 'hard'),
      col: P.collide(cR, cO, { source: 'sprint', gb: 1e-6, bounce: false }),
    };
  };
  cmp(run(PM, DM), run(PH, DH), '', 0);
}
const rows = [...diffs.entries()].sort();
console.log('differing paths:', rows.length);
for (const [k, v] of rows) console.log(v, k);
