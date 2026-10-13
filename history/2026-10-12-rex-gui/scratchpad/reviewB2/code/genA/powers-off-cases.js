// The engine calls compared by the powers-off check (test/powers.js): with the four powers of BRIEF-gui.md section 5
// off, every engine result must equal what the engine gave before they existed. Each case runs one engine function
// and reduces its whole result to a fingerprint (every number to 12 significant figures; functions left out).
// test/make-powers-off.js writes the fingerprints from an engine file; test/powers.js recomputes them.
const g = 9.80665;

// a stable text form of a result: numbers to 12 figures, keys in order, functions and cycles left out
function canon(x, seen) {
  seen = seen || new Set();
  if (x === null || x === undefined) return String(x);
  if (typeof x === 'number') return Number.isFinite(x) ? (x === 0 ? '0' : x.toPrecision(12)) : String(x);
  if (typeof x === 'boolean' || typeof x === 'string') return JSON.stringify(x);
  if (typeof x === 'function') return 'fn';
  if (typeof x !== 'object') return String(x);
  if (seen.has(x)) return 'cycle';
  seen.add(x);
  let out;
  if (Array.isArray(x)) out = '[' + x.map((v) => canon(v, seen)).join(',') + ']';
  else out = '{' + Object.keys(x).sort().filter((k) => typeof x[k] !== 'function').map((k) => k + ':' + canon(x[k], seen)).join(',') + '}';
  seen.delete(x);
  return out;
}
// FNV-1a, 2 x 32 bits: enough to tell two fingerprints apart
function hash(s) {
  let a = 0x811c9dc5, b = 0x01000193 ^ 0x5bd1e995;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); a = Math.imul(a ^ c, 0x01000193) >>> 0; b = Math.imul(b ^ c, 0x5bd1e995) >>> 0; b ^= b >>> 15; }
  return a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0') + ':' + s.length;
}

function cases(P, D) {
  const out = [];
  const surf = (id) => D.surfaces.find((s) => s.id === id);
  const obj = (id) => D.objects.find((o) => o.id === id);
  const bodies = {
    rex: () => P.makeBody({ build: 'rex', H: 3.048, m: 3007 }),
    ollie: () => P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }),
    cal: () => P.makeBody({}),
    kaiju: () => P.makeBody({ build: 'rex', H: 50, m: 1060 * P.bodyVolume(50, 'rex') }),
    dense: () => P.makeBody({ build: 'rex', H: 3.048, m: 1e9 }),
  };
  const Fs = { 2.7: Math.pow(10, 2.7) * g, 4: 1e4 * g, 6: 1e6 * g, 9: 1e9 * g, 12: 1e12 * g, 14: 1e14 * g, 14.5: Math.pow(10, 14.5) * g, 14.75: Math.pow(10, 14.75) * g, 15: 1e15 * g, 16: 1e16 * g, 20: 1e20 * g, 22: 1e22 * g, inf: Infinity };
  const add = (key, run) => out.push({ key, run });
  const ctxOf = (bk, mode, sid, lg, anchor, gh, extra) => Object.assign({ F: Fs[lg], mode, body: bodies[bk](), surface: surf(sid), groundHolds: gh, anchor }, extra || {});

  // solo moves over a wide grid
  for (const bk of ['rex', 'cal', 'kaiju']) for (const mode of ['comic', 'real']) for (const sid of ['sand', 'softclay', 'concrete', 'granite']) for (const lg of ['2.7', '4', '9', '20', 'inf']) for (const anchor of ['friction', 'braced', 'bolted']) for (const gh of [false, true]) {
    const k = [bk, mode, sid, lg, anchor, gh].join('|');
    const C = (x) => ctxOf(bk, mode, sid, lg, anchor, gh, x);
    add('throw-car45|' + k, (x) => P.throwObject(C(x), obj('car'), 45));
    add('throw-ball30|' + k, (x) => P.throwObject(C(x), obj('baseball'), 30));
    if (sid === 'concrete' || sid === 'sand') {
      add('throw-person20|' + k, (x) => P.throwObject(C(x), obj('person'), 20));
      add('throw-shot0|' + k, (x) => P.throwObject(C(x), obj('shot'), 0));
      add('throw-bus90|' + k, (x) => P.throwObject(C(x), obj('bus'), 90));
      add('throw-piano60|' + k, (x) => P.throwObject(C(x), obj('piano'), 60));
    }
    add('jump|' + k, (x) => P.jump(C(x)));
    add('stomp|' + k, (x) => P.stomp(C(x)));
    add('punch|' + k, (x) => P.punch(C(x)));
    add('clap|' + k, (x) => P.clap(C(x)));
    add('sprint|' + k, (x) => P.sprint(C(x)));
    add('pull-bus|' + k, (x) => P.pull(C(x), obj('bus')));
    add('lift-pickup|' + k, (x) => P.lift(C(x), obj('pickup')));
    add('lift-piano|' + k, (x) => P.lift(C(x), obj('piano')));
    // effort below all-out
    if (lg === '9' || lg === 'inf') for (const use of [1e3 * g, 1e6 * g]) {
      add('throw-car45-use' + use + '|' + k, (x) => P.throwObject(C(Object.assign({ use }, x)), obj('car'), 45));
      add('jump-use' + use + '|' + k, (x) => P.jump(C(Object.assign({ use }, x))));
      add('stomp-use' + use + '|' + k, (x) => P.stomp(C(Object.assign({ use }, x))));
      add('punch-use' + use + '|' + k, (x) => P.punch(C(Object.assign({ use }, x))));
    }
  }
  // dense and very dense bodies, and the Weight tab
  for (const bk of ['rex', 'dense', 'cal']) for (const sid of ['sand', 'concrete', 'granite']) for (const gh of [false, true]) for (const lg of ['4', '12']) {
    const C = (x) => ctxOf(bk, 'comic', sid, lg, 'friction', gh, x);
    add(['weight', bk, sid, gh, lg].join('|'), (x) => { const w = P.weight(C(x)); return Object.assign({}, w, { fall: w.fall ? { t: w.fall.t, minR: w.fall.minR, maxV: w.fall.maxV, stuck: w.fall.stuck, firstPass: w.fall.firstPass } : null }); });
    add(['throw-ball0-dense', bk, sid, gh, lg].join('|'), (x) => P.throwObject(C(x), obj('baseball'), 0));
    add(['lift-dense', bk, sid, gh, lg].join('|'), (x) => P.lift(C(x), obj('car')));
  }
  // a very fast throw (past 1% of light speed), the All-Star case and a dial-limited one
  for (const ang of [0, 30, 90]) for (const lg of ['20', 'inf']) for (const sid of ['concrete', 'sand']) for (const anchor of ['friction', 'bolted']) {
    const C = (x) => ctxOf('rex', 'comic', sid, lg, anchor, false, x);
    add(['throw-rel', ang, lg, sid, anchor].join('|'), (x) => P.throwObject(C(x), obj('baseball'), ang));
  }
  add('throw-allstar', (x) => P.throwObject(Object.assign({ F: 1.8e23 * g, mode: 'comic', body: bodies.rex(), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, x), obj('baseball'), 0));

  // restraint: whole plans (goal, every hazard, every preset) on a smaller grid
  const moves = [['throw', { obj: obj('car'), angle: 45, target: 30 }], ['throw', { obj: obj('baseball'), angle: 30, target: 100 }], ['throw', { obj: obj('person'), angle: 30, target: 30 }], ['jump', { target: 3 }], ['stomp', {}], ['punch', { target: 10.4 }], ['clap', { target: 6 }], ['sprint', { target: 12.42 }], ['pull', { obj: obj('bus'), target: 10 }]];
  for (const lg of ['4', 'inf']) for (const sid of ['concrete', 'sand']) for (const anchor of ['friction', 'bolted']) for (const gh of [false, true]) for (const [mv, o] of moves) {
    for (const sw of [{}, { gentleHold: true, silentStrike: true, softLanding: true, coolFlight: true, safePassenger: true }]) {
      const C = (x) => ctxOf('rex', 'comic', sid, lg, anchor, gh, Object.assign({}, sw, x));
      add(['plan', mv, (o.obj || {}).id, lg, sid, anchor, gh, Object.keys(sw).length].join('|'), (x) => {
        const p = P.RESTRAINT.planNow(mv, C(x), Object.assign({}, sw, o));
        const res = { goal: p.goal(), ceiling: p.ceiling(), hazards: p.hazards(), presets: p.presets() };
        // and what each hazard reaches at the least disruptive effort and all-out
        const u = res.goal.reached ? res.goal.use : undefined;
        res.reachLeast = P.RESTRAINT.reach(mv, p.run(u), p.opt);
        res.reachAll = P.RESTRAINT.reach(mv, p.run(undefined), p.opt);
        return res;
      });
    }
  }

  // two-player tests
  for (const mode of ['comic', 'real']) for (const sid of ['sand', 'concrete', 'granite']) for (const lg of ['4', '9', 'inf']) for (const aR of ['friction', 'bolted']) for (const aO of ['friction', 'bolted']) for (const gh of [false, true]) {
    const k = [mode, sid, lg, aR, aO, gh].join('|');
    const R = (x) => ctxOf('rex', mode, sid, lg, aR, gh, x), O = (x) => ctxOf('ollie', mode, sid, lg, aO, gh, x);
    add('arm|' + k, (x) => P.armWrestle(R(x), O(x)));
    add('push|' + k, (x) => P.pushMatch(R(x), O(x)));
    add('shove|' + k, (x) => P.shove(R(x), O(x)));
    add('shoveBoth|' + k, (x) => P.shoveBoth(R(x), O(x)));
    add('liftP|' + k, (x) => P.liftPartner(R(x), O(x)));
    add('throwP45|' + k, (x) => P.throwPartner(R(x), O(x), 45));
    add('throwP0|' + k, (x) => P.throwPartner(R(x), O(x), 0));
    add('standoff|' + k, (x) => P.standoff(R(x), O(x)));
    add('standoffImm|' + k, (x) => P.standoff(R(x), O(Object.assign({ immovable: true }, x))));
    for (const src of ['sprint', 'jump', 'stomp']) for (const bounce of [false, true]) add(['collide', src, bounce, k].join('|'), (x) => P.collide(R(x), O(x), { source: src, bounce }));
    for (const gb of [1e-3, 0.5, 30, Infinity]) add(['collide-set', gb, k].join('|'), (x) => P.collide(R(x), O(x), { source: 'set', gb }));
    add('collide-imm|' + k, (x) => P.collide(R(x), O(Object.assign({ immovable: true }, x)), { source: 'sprint' }));
  }
  // the game of catch (slow: a smaller grid)
  for (const lg of ['4', '12']) for (const sid of ['concrete', 'sand']) for (const aR of ['friction', 'bolted']) for (const gh of [false, true]) for (const [oid, D0] of [['baseball', 10], ['baseball', 1e4], ['car', 30], ['person', 30], ['piano', 100]]) for (const style of ['easy', 'hard']) {
    for (const sw of [{}, { gentleHold: true, coolFlight: true, safePassenger: true }]) {
      const R = (x) => ctxOf('rex', 'comic', sid, lg, aR, gh, Object.assign({}, sw, x)), O = (x) => ctxOf('ollie', 'comic', sid, lg, 'friction', gh, Object.assign({}, sw, x));
      add(['catch', oid, D0, style, lg, sid, aR, gh, Object.keys(sw).length].join('|'), (x) => { const L = P.catchLeg(R(x), O(x), obj(oid), D0, style); if (L && L.flight) L.flight = Object.assign({}, L.flight, { path: L.flight.path ? L.flight.path.length : 0 }); return L; });
    }
  }
  for (const lg of ['4', '9', 'inf']) for (const style of ['easy', 'hard']) {
    const R = (x) => ctxOf('rex', 'comic', 'concrete', lg, 'friction', false, x);
    add(['toss', lg, style].join('|'), (x) => P.tossPartner(R(x), bodies.ollie(), 'Ollie', style, 10, 'friction'));
  }
  // paths the powers touched that the grids above miss (review round 1): catch throws past 1% of light speed (the
  // fireball), dense partners (the straight line through their pull), the toss either side of 1% of light speed, and
  // the relativistic throw's blast and reach
  for (const lg of ['14', '16', '20']) for (const [oid, D0] of [['baseball', 30], ['baseball', 1000], ['car', 30], ['car', 1000]]) for (const kf of [false, true]) {
    const R = (x) => ctxOf('rex', 'comic', 'concrete', lg, 'friction', false, Object.assign(kf ? { gentleHold: true } : {}, x)), O = (x) => ctxOf('ollie', 'comic', 'concrete', lg, 'friction', false, Object.assign(kf ? { gentleHold: true } : {}, x));
    add(['catch-fast', oid, D0, lg, kf].join('|'), (x) => { const L = P.catchLeg(R(x), O(x), obj(oid), D0, 'hard'); if (L && L.flight) L.flight = Object.assign({}, L.flight, { path: L.flight.path ? L.flight.path.length : 0 }); return L; });
  }
  for (const lg of ['12', '20', '22']) for (const D0 of [10, 1e4]) for (const style of ['easy', 'hard']) {
    const R = (x) => ctxOf('dense', 'comic', 'granite', lg, 'bolted', false, x), O = (x) => ctxOf('dense', 'comic', 'granite', lg, 'bolted', false, x);
    add(['catch-dense', D0, style, lg].join('|'), (x) => { const L = P.catchLeg(R(x), O(x), obj('baseball'), D0, style); if (L && L.flight) L.flight = Object.assign({}, L.flight, { path: L.flight.path ? L.flight.path.length : 0 }); return L; });
  }
  for (const lg of ['14', '14.5', '14.75', '15']) for (const style of ['easy', 'hard']) {
    const R = (x) => ctxOf('rex', 'comic', 'concrete', lg, 'friction', false, x);
    add(['toss-fast', lg, style].join('|'), (x) => P.tossPartner(R(x), bodies.ollie(), 'Ollie', style, 10, 'friction'));
  }
  for (const ang of [0, 30, 90]) for (const lg of ['16', '20', 'inf']) {
    const C = (x) => ctxOf('rex', 'comic', 'concrete', lg, 'friction', false, x);
    add(['throw-rel-blast', ang, lg].join('|'), (x) => {
      const r = P.throwObject(C(x), obj('baseball'), ang), c = C(x), o = Object.assign({ near: 5, obj: obj('baseball'), angle: ang, body: c.body, surface: c.surface, anchor: c.anchor }, x), M = P.RESTRAINT.MOVES.throw;
      return { blast: M.blast(r, o), from: M.blastFrom(r, o), boom: M.boomSpeed(r, o), reach: P.RESTRAINT.reach('throw', r, o) };
    });
  }
  // walking and footprints
  for (const bk of ['rex', 'cal', 'kaiju', 'dense']) for (const sid of ['sand', 'gravel', 'softclay', 'stiffclay', 'concrete', 'granite']) for (const gh of [false, true]) for (const effort of [0, 0.5, 1]) for (const pace of ['stroll', 'fast']) {
    add(['walk', bk, sid, gh, effort, pace].join('|'), (x) => { const pr = P.presence(bodies[bk](), surf(sid), Object.assign({ pace, effort, groundHolds: gh }, x)); return { step: pr.step, reach: pr.reach, v5: pr.ppv(5), v50: pr.ppv(50) }; });
  }
  // growth
  for (const E of [1e6, 1e15, 4.2e23]) for (const gh of [false, true]) for (const sid of ['sand', 'concrete']) {
    add(['instant', E, gh, sid].join('|'), (x) => P.instantGrowth(bodies.rex(), E, 0.5, Object.assign({ surface: surf(sid), groundHolds: gh }, x)));
    add(['runaway', E, gh, sid].join('|'), (x) => P.runawayGrowth(bodies.rex(), E, 0.5, Object.assign({ surface: surf(sid), groundHolds: gh }, x)));
  }
  return out;
}
// the four powers, explicitly off: the same results as leaving them out
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
module.exports = { cases, canon, hash, OFF };
