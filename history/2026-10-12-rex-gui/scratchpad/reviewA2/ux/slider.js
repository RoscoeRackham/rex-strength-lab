const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  const tests = [['col-gb', { duoAction: 'collide', colSrc: 'set' }], ['c-dist', { duoAction: 'catch' }], ['w-angle', { duoAction: 'wrestle', wrestleMove: 'throw' }], ['duo-effort-use', { duoAction: 'arm' }]];
  for (const which of ['branch', 'main']) for (const [id, st] of tests) for (const action of ['throw', 'walk']) {
    const state = Object.assign({ duoOpen: true, action }, st);
    if (which === 'main') state.group = 'duo';
    const page = await open(b, { which, w: 1280, h: 900, state, wait: 4000 });
    const sid = which === 'main' && id === 'w-angle' ? 'angle' : which === 'main' && id === 'duo-effort-use' ? 'duo-effort-use' : id;
    await page.evaluate(() => { for (const d of document.querySelectorAll('details.effort-adjust')) d.open = true; });
    const exists = await page.evaluate((sid) => !!document.getElementById(sid), sid);
    if (!exists) { console.log(which, id, 'missing'); await page.context().close(); continue; }
    await page.evaluate(() => { window.__longs = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__longs.push(Math.round(e.duration)); }).observe({ type: 'longtask' }); });
    await page.focus('#' + sid);
    const t = Date.now();
    for (let i = 0; i < 15; i++) await page.keyboard.press('ArrowRight');
    const ms = Date.now() - t;
    await page.waitForTimeout(3000);
    const longs = await page.evaluate(() => window.__longs);
    console.log(which, id, 'Rex on ' + action, '15 key presses ' + ms + ' ms, long tasks total ' + longs.reduce((a, b) => a + b, 0) + ' ms (' + longs.length + ')', page.errs.length ? page.errs : '');
    await page.context().close();
  }
  await b.close();
})();
