const { open, tab } = require('./lib');
(async () => {
  for (const [w, d] of [[390, 3], [360, 1000]]) {
    const { browser, page } = await open({ w, h: 900, saved: { action: 'walk', walkD: d, walker: 'rex', surface: 'concrete' } });
    await tab(page, 'walk', false, 1500);
    const el = await page.$('#bay .viz svg');
    await el.screenshot({ path: `u7-chart-${w}-${d}.png` });
    await browser.close();
  }
})();
