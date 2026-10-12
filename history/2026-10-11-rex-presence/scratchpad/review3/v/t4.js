const H = require('./h.js');
const { P, ctx } = require('./n.js');
(async () => {
  const p = await H.open({ action: 'jump', softLanding: true });
  await H.tab(p, 'jump');
  let t = await H.settle(p, 30000);
  for (const l of t.split('\n')) if (/Soft landing|taken back|Landing on|absorbed|Effort:/.test(l)) console.log('PAGE:', l);
  const info = await p.evaluate(() => { return null; });
  await p.close(); await H.close();
  // engine
  const pl = P.RESTRAINT.planNow('jump', ctx({ extra: { softLanding: true } }), { target: 3, near: 5, softLanding: true });
  const g = pl.goal(); const r = pl.run(g.use);
  console.log('engine least: use t', (g.use / 9.80665 / 1000).toFixed(1), 'landing.E', r.landing.E.toFixed(0), 'absorbed', r.landing.absorbed.toFixed(0), 'ratio', r.landing.ratio.toFixed(3), 'soft', r.landing.soft);
  const ra = pl.run(undefined); console.log('allout E', ra.landing.E.toFixed(0), 'absorbed', ra.landing.absorbed.toFixed(0));
})();
