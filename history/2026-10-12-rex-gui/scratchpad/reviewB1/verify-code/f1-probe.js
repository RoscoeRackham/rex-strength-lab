const { open, settle } = require('./lib.js');
(async () => {
  const { browser, page, errs } = await open('branchdbg', { duoOpen: true, duoAction: 'collide', anchor: 'bolted' });
  await settle(page, '#duo-bay');
  await page.selectOption('#duo-effort', 'ground');
  await settle(page, '#duo-bay');
  const r = await page.evaluate(() => {
    const D = window.__dbg, g = D.g, p = D.duoPlanFor('collide');
    const jr = p.job('preset:ground:real'), jp = p.job('preset:ground');
    const out = { FR_t: D.fullF('R') / g / 1000, lo_t: p.lo / g / 1000, least: { never: p.s.never, below_t: p.s.below / g / 1000, use_t: p.s.use / g / 1000 },
      groundReal: { never: jr.never, below_t: jr.below / g / 1000, use_t: jr.use / g / 1000 } };
    const probe = [];
    for (const t of [3.0, 3.5, 3.66, 3.7, 4, 5, 7.86, 8, 20, 90]) {
      const u = t * 1000 * g;
      const fp = p.factsAt(u), frl = p.factsAt(u, 'real');
      probe.push({ t, powerOn_ground: fp.ground, powerOn_harm: fp.harm, real_ground: frl.ground, real_harm: frl.harm });
    }
    out.probe = probe;
    out.eff = (() => { const e = D.resolveDuoEffort('collide'); return { use_t: e.use / g / 1000, already: e.already, real: e.real, harm: e.harm }; })();
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  console.log('errs', errs);
  await browser.close();
})();
