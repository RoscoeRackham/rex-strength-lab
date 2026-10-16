const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const pg = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  await pg.goto(url); await loadOn(pg, DUO({ action: 'weight', duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 14, keepForm: false, airAbsorb: 0.5 }), 'allout');
  for (const g of ['krakatoa', 'chicxulub', 'sun']) {
    await pg.click('#grow-what-' + g); await pg.waitForTimeout(500); await settledOn(pg, 'bay');
    const r = await pg.evaluate(() => { const t = document.querySelector('#bay .growth-whatif .tile.shimmer'); const h = document.getElementById('hero-glow'); return { t: t && t.textContent, h: h.hidden ? 0 : h.dataset.strength, sx: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    console.log(g, JSON.stringify(r));
  }
  const box = await pg.$('#bay .growth-whatif'); await box.screenshot({ path: W + '/../shots/weight-390-dark.png' });
  const fb = await pg.evaluate(() => { const t = document.querySelector('#duo-bay .tile.shimmer'); return t ? { text: t.textContent, row: Array.from(t.parentElement.children).length, prev: t.parentElement.previousElementSibling && t.parentElement.previousElementSibling.className, next: t.parentElement.nextElementSibling && t.parentElement.nextElementSibling.className } : null; });
  console.log('fireball', JSON.stringify(fb));
  const t = await pg.$('#duo-bay .tile.shimmer'); if (t) await t.screenshot({ path: W + '/../shots/fireball-390-dark.png' });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
