const { wrap, launch, readResult, settle, S } = require('./h.js');
const path = require('path');
(async () => {
  const b = await launch();
  const st = JSON.parse(process.argv[2]);
  const pm = await b.newPage({ viewport: { width: 1280, height: 900 } }), pn = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await pm.goto(wrap(path.join(S, 'main.html'), 'main')); await pn.goto(wrap(path.join(S, 'lab/dist/index.html'), 'new'));
  const run = async (p, s, bay) => { await p.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), s); await p.reload(); await p.waitForTimeout(700); await settle(p, bay); return readResult(p, bay); };
  const t = process.argv[3], duo = ['arm','wrestle','catch','collide'].includes(t);
  const a = await run(pm, Object.assign({}, st, duo ? { group: 'duo', duoAction: t } : { group: 'solo', action: t }), 'bay');
  const z = await run(pn, Object.assign({}, st, duo ? { duoOpen: true, duoAction: t } : { action: t }), duo ? 'duo-bay' : 'bay');
  for (const k of Object.keys(a)) if (JSON.stringify(a[k]) !== JSON.stringify(z[k])) { console.log(k, '\nMAIN', JSON.stringify(a[k]), '\nNEW ', JSON.stringify(z[k])); }
  await b.close();
})();
