// DPR 1 shots of the header at none, the stomp at 10^9 kg and full, 1280 light; and spot geometry vs features
const L = require('./lib.js'), fs = require('fs');
(async () => {
  const browser = await L.launch();
  const out = {};
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const pg = await L.newPage(browser, { viewport: { width: w, height: h }, reducedMotion: 'reduce', colorScheme: 'light', deviceScaleFactor: 1 });
    for (const [nm, st, eff] of [['none', { action: 'walk' }], ['stomp9', { action: 'stomp', logKg: 9 }, 'allout'], ['full', { action: 'throw', obj: 'car', inf: true }, 'allout']]) {
      await L.load(pg, st, eff);
      await pg.evaluate(() => window.scrollTo(0, 0));
      const r = await pg.evaluate(() => { const q = document.getElementById('hero-art').getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; });
      await pg.screenshot({ path: `${L.SD}/out/dpr1-hero-${nm}-${w}.png`, clip: { x: r[0], y: r[1], width: r[2], height: r[3] } });
      out[nm + w] = r;
    }
    await pg.close();
  }
  console.log(JSON.stringify(out));
  await browser.close();
})();
