const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const flat = (o, pre = '', out = {}, depth = 0) => { if (depth > 3) return out; for (const [k, v] of Object.entries(o || {})) { if (typeof v === 'function') continue; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, pre + k + '.', out, depth + 1); else out[pre + k] = Array.isArray(v) ? JSON.stringify(v).slice(0, 200) : v; } return out; };
const diffKeys = (a, b) => { const A = flat(a), B = flat(b); const ks = new Set([...Object.keys(A), ...Object.keys(B)]); return [...ks].filter((k) => !(A[k] === B[k] || (Number.isNaN(A[k]) && Number.isNaN(B[k])))); };
const allDiff = { throw: new Set(), lift: new Set(), jump: new Set(), punch: new Set(), catch: new Set() };
for (const F of [1e3, 9e4, 1e7, 1e12, Infinity]) for (const mode of ['comic', 'real']) for (const sid of ['concrete', 'sand']) {
  const c = ctxOf(F * g, { mode, surface: surf(sid) });
  for (const oid of ['car', 'desoto', 'piano', 'baseball', 'person']) {
    for (const use of [undefined, 1e3 * g, 1e5 * g]) {
      const cc = Object.assign({}, c, { use });
      const a = P.throwObject(cc, obj(oid), 45), b = P.throwObject(Object.assign({}, cc, { gentleHold: true }), obj(oid), 45);
      diffKeys(a, b).forEach((k) => allDiff.throw.add(k));
      const la = P.lift(cc, obj(oid)), lb = P.lift(Object.assign({}, cc, { gentleHold: true }), obj(oid));
      diffKeys(la, lb).forEach((k) => allDiff.lift.add(k));
    }
  }
  const ja = P.jump(c), jb = P.jump(Object.assign({}, c, { softLanding: true }));
  diffKeys(ja, jb).forEach((k) => allDiff.jump.add(k));
  const pa = P.punch(c), pb = P.punch(Object.assign({}, c, { silentStrike: true }));
  diffKeys(pa, pb).forEach((k) => allDiff.punch.add(k));
}
// catch legs
for (const F of [9e4, 1e7]) for (const oid of ['car', 'baseball', 'person']) {
  const cR = ctxOf(F * g), cO = Object.assign({}, cR, { body: ollie });
  const a = P.catchLeg(cR, cO, obj(oid), 30, 'easy'), b = P.catchLeg(Object.assign({}, cR, { gentleHold: true }), Object.assign({}, cO, { gentleHold: true }), obj(oid), 30, 'easy');
  diffKeys(a, b).forEach((k) => allDiff.catch.add(k));
}
for (const [k, v] of Object.entries(allDiff)) console.log(k, [...v].join(', '));
// soft landing details
const c = ctxOf(1e5 * g, { surface: surf('sand') });
const ja = P.jump(c), jb = P.jump(Object.assign({}, c, { softLanding: true }));
console.log('landing no switch', JSON.stringify(ja.landing));
console.log('landing soft     ', JSON.stringify(jb.landing));
