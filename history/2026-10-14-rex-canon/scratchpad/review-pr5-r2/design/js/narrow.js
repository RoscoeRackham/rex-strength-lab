const L = require('./lib.js');
const D = (x) => Object.assign({ duoOpen: true, action: 'walk' }, x);
const RUNS = [
  ['throw-inf', { action: 'throw', obj: 'car', inf: true }, 'allout'],
  ['weight-k', { action: 'weight' }, null, 'krakatoa'],
  ['wrestle9', D({ duoAction: 'wrestle', wrestleMove: 'throw', logKg: 9 }), 'allout'],
  ['collide01c', D({ duoAction: 'collide', colSrc: 'set', colGB: Math.log10(0.001 / Math.sqrt(1 - 1e-6)) }), 'allout'],
  ['catch-fastball', D({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1 }), 'allout'],
  ['fireball', D({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 14, keepForm: false, airAbsorb: 0.5 }), 'allout'],
];
(async () => {
  const browser = await L.launch();
  for (const w of [320, 390]) {
    const pg = await L.newPage(browser, { viewport: { width: w, height: 800 }, reducedMotion: 'reduce', colorScheme: 'dark' });
    for (const [nm, st, eff, grow] of RUNS) {
      await L.load(pg, st, eff);
      if (grow) { await pg.click('#grow-what-' + grow); await pg.waitForSelector('#bay .growth-whatif .tile.shimmer'); }
      const r = await pg.evaluate(() => { const ts = Array.from(document.querySelectorAll('.tile.shimmer')); return { n: ts.length, over: ts.map((t) => [t.scrollWidth - t.clientWidth, Math.round(t.getBoundingClientRect().right), Math.round(t.getBoundingClientRect().width)]), vw: innerWidth, sx: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
      console.log(w, nm, JSON.stringify(r));
      if (nm === 'collide01c' && w === 320) { const el = await pg.$('#duo-bay .tile.shimmer'); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: L.SD + '/out/tile-collide-320-dark.png' }); }
      if (nm === 'fireball' && w === 390) { const el = await pg.$('#duo-bay .tile.shimmer'); await el.scrollIntoViewIfNeeded(); const box = await pg.evaluate(() => { const t = document.querySelector('#duo-bay .tile.shimmer').closest('.tiles'); const p = t.previousElementSibling, n = t.nextElementSibling; return [p && (p.className + ':' + p.textContent.slice(0, 80)), n && (n.className + ':' + n.textContent.slice(0, 80))]; }); console.log('fireball tile neighbours', JSON.stringify(box)); }
    }
    console.log('errs', pg.errs);
    await pg.close();
  }
  await browser.close();
})();
