const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of ['preview.html', 'fixed-preview.html']) for (const w of [390, 320, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 844 } });
    await page.goto('file://' + __dirname + '/' + f);
    await page.waitForTimeout(5500);
    const keys = await page.$$eval('#ladder-viz .mk', (gs) => gs.map((g) => g.getAttribute('data-key')));
    let worst = 0, worstK = '', anyOverlap = 0;
    for (const k of keys) {
      await page.focus(`#ladder-viz .mk[data-key="${k}"]`);
      const r = await page.evaluate((k) => { const g = document.querySelector(`#ladder-viz .mk[data-key="${k}"]`); const t = document.querySelector('#ladder-viz .tip').getBoundingClientRect(); const w = document.querySelector('#ladder-viz').getBoundingClientRect();
        const vis = [g.querySelector('circle'), ...g.querySelectorAll('text')].map((e) => e.getBoundingClientRect());
        const hit = vis.filter((r) => !(r.right <= t.left || r.left >= t.right || r.bottom <= t.top || r.top >= t.bottom)).length;
        return { below: t.bottom - w.bottom, above: w.top - t.top, hit }; }, k);
      if (r.below > worst) { worst = r.below; worstK = k; }
      if (r.hit) anyOverlap++;
    }
    console.log(f, w, 'max tip overhang below wrap', Math.round(worst), worstK, 'markers whose own dot/text the tip touches', anyOverlap, '/', keys.length);
    await page.close();
  }
  await browser.close();
})();
