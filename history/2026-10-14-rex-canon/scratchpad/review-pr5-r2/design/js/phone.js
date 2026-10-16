const L = require('./lib.js');
(async () => {
  const browser = await L.launch();
  const pg = await L.newPage(browser, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme: 'light', deviceScaleFactor: 3 });
  for (const [nm, st, eff] of [['none', { action: 'walk' }], ['stomp9', { action: 'stomp', logKg: 9 }, 'allout'], ['full', { action: 'throw', obj: 'car', inf: true }, 'allout']]) {
    await L.load(pg, st, eff); await pg.evaluate(() => window.scrollTo(0, 0));
    const r = await pg.evaluate(() => { const q = document.getElementById('hero-art').getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; });
    await pg.screenshot({ path: `${L.SD}/out/phone-hero-${nm}.png`, clip: { x: r[0] + 0.15 * r[2], y: r[1], width: 0.6 * r[2], height: 0.4 * r[3] } });
  }
  await browser.close();
})();
