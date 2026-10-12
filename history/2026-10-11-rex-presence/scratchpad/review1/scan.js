const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const RS = P.RESTRAINT;
const PER = +process.env.PER || 6;
const moves = [['throw', { obj: obj('car'), angle: 45, target: 30 }], ['throw', { obj: obj('baseball'), angle: 30, target: 50 }], ['throw', { obj: obj('bus'), angle: 90, target: 10 }], ['jump', { target: 3 }], ['stomp', {}], ['punch', { target: 10.4 }], ['clap', { target: 6 }], ['sprint', { target: 12.42 }], ['pull', { obj: obj('bus'), target: 10 }]];
const only = process.env.MOVE;
const bodies = { rex, cal, big };
const Fs = (process.env.FS || '1e5,1e8,inf').split(',');
const issues = [];
for (const bk of (process.env.BODIES || 'rex,cal,big').split(',')) for (const mode of (process.env.MODES || 'comic,real').split(',')) for (const sid of (process.env.SURF || 'concrete,sand').split(',')) for (const Fk of Fs) for (const [mv, o] of moves) {
  if (only && mv !== only) continue;
  const F = Fk === 'inf' ? Infinity : +Fk * g;
  const c = ctxOf(F, { body: bodies[bk], mode, surface: surf(sid) });
  const p = RS.planNow(mv, c, o);
  const M = RS.MOVES[mv], opt = p.opt;
  const tests = { goal: (r) => M.goal(r, opt) };
  for (const h of RS.HAZARDS) tests['hazard:' + h.id] = (r) => h.test(M, r, opt);
  for (const h of RS.PRESETS) tests['preset:' + h.id] = (r) => h.test(M, r, opt);
  // dense scan
  const us = [];
  const n = Math.ceil(PER * Math.log10(p.hi / p.lo));
  for (let i = 0; i <= n; i++) us.push(p.lo * Math.pow(p.hi / p.lo, i / n));
  if (!isFinite(F)) us.push(Infinity);
  const first = {};
  const flips = {};
  for (const k of Object.keys(tests)) { first[k] = undefined; flips[k] = 0; }
  const prev = {};
  for (const u of us) {
    const r = p.run(u);
    for (const [k, t] of Object.entries(tests)) {
      let v; try { v = !!t(r); } catch (e) { v = 'ERR ' + e.message; }
      if (v === true && first[k] === undefined) first[k] = u;
      if (prev[k] !== undefined && prev[k] !== v) flips[k]++;
      prev[k] = v;
    }
  }
  const tag = [mv, o.obj ? o.obj.id : '', bk, mode, sid, Fk].join('|');
  for (const k of Object.keys(tests)) {
    const res = p.result(k);
    const d = first[k];
    const pu = res.use;
    let bad = null;
    if (d !== undefined && (pu === Infinity || res.never) && isFinite(d)) bad = 'search says never/inf, dense finds onset at ' + (d / g).toExponential(3) + ' kg';
    else if (d !== undefined && isFinite(pu) && d < pu * 0.99) bad = 'dense onset ' + (d / g).toExponential(3) + ' < search ' + (pu / g).toExponential(3) + ' kg';
    else if (isFinite(pu) && !tests[k](p.run(pu))) bad = 'test false at search use ' + (pu / g).toExponential(3);
    if (bad || flips[k] > 1) issues.push(tag + ' ' + k + ': ' + (bad || '') + (flips[k] > 1 ? ' [non-monotone: ' + flips[k] + ' flips]' : ''));
  }
  // ceiling check
  const ce = p.ceiling();
  if (ce.by && ce.below > 0) {
    const r = p.run(ce.below);
    const under = RS.HAZARDS.filter((h) => h.test(M, r, opt)).map((h) => h.id);
    if (under.length) issues.push(tag + ' CEILING below not harmless: ' + under.join(','));
    if (!RS.HAZARDS.find((h) => h.id === ce.by).test(M, p.run(ce.use), opt)) issues.push(tag + ' CEILING named hazard not on at use');
  }
  const gl = p.goal();
  console.log(tag, 'goal', gl.reached ? (gl.use / g).toExponential(3) : 'unreached', 'ceiling', ce.by, isFinite(ce.below) ? (ce.below / g).toExponential(3) : ce.below);
}
console.log('\nISSUES (' + issues.length + ')');
for (const s of issues) console.log(s);
