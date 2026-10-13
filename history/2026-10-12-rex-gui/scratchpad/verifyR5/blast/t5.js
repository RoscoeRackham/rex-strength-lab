const res = {};
for (const tree of ['old', 'new']) {
  const L = require('./lib.js')(tree); const { P, obj, ctxOf, rex, conc } = L;
  const M = P.RESTRAINT.MOVES.throw;
  const sets = { off: {}, keep: { keepForm: true }, unb: { unbreakable: true }, own: { ownRecoil: true }, air1: { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, air0on: { airAbsorb: 0, keepForm: true, unbreakable: true, ownRecoil: true } };
  for (const [sn, pw] of Object.entries(sets)) for (const id of ['baseball', 'car', 'pyramid', 'allstar']) for (const ang of [0, 45, 90]) for (const lg of [12, 15, 20, 30]) for (const anchor of ['friction', 'bolted']) {
    const ctx = Object.assign(ctxOf(Math.pow(10, lg), pw), { anchor }); const o = obj(id);
    const r = P.throwObject(ctx, o, ang); const opt = Object.assign({ obj: o, angle: ang, surface: conc, body: rex, near: 5 }, ctx);
    const key = [sn, id, ang, lg, anchor].join('|');
    res[key] = res[key] || {};
    res[key][tree] = JSON.stringify([P.RESTRAINT.reach('throw', r, opt), tree === 'new' ? M.blastAt(r, opt, 1000) : null]);
  }
}
let diff = 0, nonNull = 0;
for (const [k, v] of Object.entries(res)) { const a = JSON.parse(v.old), b = JSON.parse(v.new); if (JSON.stringify(a[0]) !== JSON.stringify(b[0])) { diff++; const fs = Object.keys(a[0]).filter((f) => a[0][f] !== b[0][f]); console.log("DIFF", k, fs.join(",")); } if (b[1] != null) { nonNull++; console.log('blastAt non-null', k); } }
console.log('cases', Object.keys(res).length, 'reach diffs', diff, 'blastAt non-null', nonNull);
