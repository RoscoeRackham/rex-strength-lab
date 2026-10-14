const { P, D, surf, obj, rex, ollie, tons, ctx } = require('./lib.js');
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
const T = (o) => o ? JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k,v])=>typeof v==='number').map(([k, v]) => [k, +v.toPrecision(4)]))) : '-';
for (const s of ['concrete', 'sand']) for (const t of [100, 1000, 1e4]) for (const anc of ['bolted', 'friction']) {
  const cO = ctx({ body: ollie(), surface: s, kg: tons(t) });
  const cR = ctx({ body: rex(), surface: s, kg: tons(t), extra: { anchor: anc } });
  const r = P.collide(cO, cR, { source: 'jump', gb: 1, bounce: false });
  if (r.noCharge) { console.log(s, t, anc, 'noCharge', r.noCharge); continue; }
  const j = r.speed.jump;
  const hit = r.toGround ? P.impulseSource(cR.surface, r.toGround.J, r.toGround.T) : null;
  const po = j && j.pushOff ? P.impulseSource(cO.surface, j.pushOff.J, Math.max(1e-9, j.pushOff.T)) : null;
  console.log(s, t + 't', anc, 'outcome', r.outcome, 'v', fmt(r.v0), 'hold', r.hold.why, 'toGround', T(r.toGround), 'ppv5 hit', fmt(P.ppvAt(hit, 5) * 1e3), 'plaster', fmt(P.plasterReach(hit)),
    '| pushOff', T(j && j.pushOff), 'ppv5', fmt(P.ppvAt(po, 5) * 1e3), 'plaster', fmt(P.plasterReach(po)));
  // weight check for above: Nmax - mR g vs Nmax - (mR + mO) g
  const b = cR.body, Nmax = P.qultFor(cR.surface, b.footB) * 2 * b.footArea;
  if (anc === 'friction') console.log('   Nmax', fmt(Nmax), 'bear(R only)', fmt(Nmax - b.m * 9.80665), 'bear(R+O)', fmt(Math.max(0, Nmax - 2 * b.m * 9.80665)));
}
