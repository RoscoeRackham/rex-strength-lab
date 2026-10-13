// sweep.js's checks (NaN, negatives) with the four powers on (and at a half share), on the default Rex, plus RESTRAINT blast/shake/reach
global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(R + '/src/engine.js'); require(R + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const bad = [];
const scan = (label, obj, path = '', seen = new Set()) => {
  if (obj == null) return;
  if (typeof obj === 'number') { if (Number.isNaN(obj)) bad.push(label + ' ' + path + ' = NaN'); else if (obj < 0 && !/quake|thetaDeg|angle|bend/i.test(path)) bad.push(label + ' ' + path + ' = ' + obj); return; }
  if (Array.isArray(obj) || typeof obj !== 'object' || seen.has(obj)) return;
  seen.add(obj);
  for (const [k, v] of Object.entries(obj)) if (k !== 'path' && k !== 'gLoad' && typeof v !== 'function') scan(label, v, path + '.' + k, seen);
};
const M = P.RESTRAINT.MOVES;
let n = 0; const t0 = Date.now();
for (const build of ['rex']) {
  const body = P.makeBody(Object.assign({ build }, P.DEFAULT_BODIES[build]));
  for (const pw of [{ airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, { airAbsorb: 0.5, keepForm: true, unbreakable: true, ownRecoil: true }, { airAbsorb: 0.5 }, { ownRecoil: true }, { unbreakable: true }])
  for (const lg of [2, 3, 3.5, 4, 6, 9, 12, 15, 18, 21, 24, 30, 34, Infinity]) for (const mode of ['comic', 'real']) for (const surface of D.surfaces) for (const anchor of ['friction', 'bolted']) {
    const ctx = Object.assign({ F: isFinite(lg) ? Math.pow(10, lg) * g : Infinity, mode, body, surface, anchor }, pw);
    const L = `${JSON.stringify(pw)} lg=${lg} ${mode} ${surface.id} ${anchor}`;
    const opt = Object.assign({ near: 5, body, surface, anchor, m: body.m }, pw);
    for (const o of D.objects) {
      scan(L + ' lift ' + o.id, P.lift(ctx, o));
      if (!o.noPull) { const r = P.pull(ctx, o); scan(L + ' pull ' + o.id, r); scan(L + ' pull-reach ' + o.id, P.RESTRAINT.reach('pull', r, Object.assign({ obj: o }, opt))); }
      if (!o.noThrow && (surface.id === 'concrete' || surface.id === 'sand' || surface.id === 'ice')) for (const a of [0, 45, 90]) {
        const r = P.throwObject(ctx, o, a); scan(L + ' throw ' + o.id + ' ' + a, r);
        const oo = Object.assign({ obj: o, angle: a }, opt);
        scan(L + ' throw-reach ' + o.id + ' ' + a, P.RESTRAINT.reach('throw', r, oo));
        scan(L + ' throw-blast ' + o.id + ' ' + a, M.throw.blastParts(r, oo));
      }
    }
    for (const mv of ['jump', 'stomp', 'punch', 'clap', 'sprint']) { const r = P[mv](ctx); scan(L + ' ' + mv, r); scan(L + ' ' + mv + '-reach', P.RESTRAINT.reach(mv, r, opt)); }
    n++;
  }
}
console.log('contexts', n, 'ms', Date.now() - t0, 'problems', bad.length);
const seen = new Map(); for (const b of bad) { const k = b.replace(/^\{[^}]*\} lg=\S+ \S+ \S+ \S+ /, '').replace(/= .*$/, ''); if (!seen.has(k)) seen.set(k, b); }
console.log([...seen.values()].slice(0, 60).join('\n'));
