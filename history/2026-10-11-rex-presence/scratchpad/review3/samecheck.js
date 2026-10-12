// Does the search's early stop (same) ever change a result? Compare the engine's plan with a copy whose `same` is off.
global.window = {};
const fs = require('fs'), path = require('path');
const SRC = '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js';
const e0 = fs.readFileSync(SRC, 'utf8');
const find = 'const same = (u0, u1) => { const a = M.speed(at(u0)), b = M.speed(at(u1)); return eqv(a, b) && eqv(b, M.speed(at(hi))); };';
if (e0.split(find).length !== 2) throw new Error('find');
const tmp = path.join(__dirname, 'engine-nosame.js');
fs.writeFileSync(tmp, e0.replace(find, 'const same = null;'));
const P = require(SRC), Q = require(tmp);
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id), surf = (id) => D.surfaces.find((s) => s.id === id);
const moves = (process.argv[2] || 'throw,jump,stomp,punch,clap,sprint,pull').split(',');
const lgs = (process.argv[3] || '3,4,5,6,8,10,12,inf').split(',');
const surfs = (process.argv[4] || 'concrete,sand,ice,softclay,granite,steel').split(',');
const objs = (process.argv[5] || 'car,piano,person,tank,baseball').split(',');
let n = 0, diffs = 0;
const t0 = Date.now();
for (const mv of moves) for (const lg of lgs) for (const sid of surfs) for (const mode of ['comic', 'real']) for (const anchor of ['friction', 'bolted']) for (const ob of (mv === 'throw' || mv === 'pull' ? objs : [null])) {
  const F = lg === 'inf' ? Infinity : Math.pow(10, Number(lg)) * g;
  const mk = (PP) => ({ F, mode, body: PP.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf(sid), groundHolds: false, anchor });
  const o = { near: 5, target: { throw: 30, jump: 3, punch: 10.4, clap: 6, sprint: 12.42, pull: 10 }[mv], obj: ob ? obj(ob) : undefined, angle: 45 };
  const a = P.RESTRAINT.planNow(mv, mk(P), o), b = Q.RESTRAINT.planNow(mv, mk(Q), o);
  const jobs = ['goal'].concat(P.RESTRAINT.HAZARDS.map((h) => 'hazard:' + h.id), P.RESTRAINT.PRESETS.map((x) => 'preset:' + x.id));
  for (const j of jobs) {
    const ra = a.result(j), rb = b.result(j);
    const sameRes = ra.never === rb.never && ra.onlyUnlimited === rb.onlyUnlimited && (ra.use === rb.use || Math.abs(Math.log(ra.use / rb.use)) < 0.02);
    if (!sameRes) { diffs++; if (diffs <= 40) console.log('DIFF', mv, lg, sid, mode, anchor, ob || '', j, 'early-stop:', JSON.stringify({ use: ra.use / g, never: ra.never, ou: ra.onlyUnlimited }), 'full grid:', JSON.stringify({ use: rb.use / g, never: rb.never, ou: rb.onlyUnlimited })); }
  }
  n++;
}
console.log('plans', n, 'diffs', diffs, 'ms', Date.now() - t0);
