const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await pg.goto(url); await loadOn(pg, { action: 'throw', obj: 'car', inf: true }, 'allout');
  for (const fc of ['none', 'active']) {
    await pg.emulateMedia({ forcedColors: fc }); await pg.waitForTimeout(300);
    const e = await pg.$('#hero-art'); await e.screenshot({ path: W + '/../shots/forced-' + fc + '.png' });
    const st = await pg.evaluate(() => { const i = document.querySelector('#hero-glow i'); const cs = getComputedStyle(i); return [cs.backgroundImage.slice(0, 40), cs.backgroundColor, getComputedStyle(document.getElementById('hero-glow')).opacity]; });
    console.log(fc, JSON.stringify(st));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
