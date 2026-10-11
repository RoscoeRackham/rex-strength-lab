const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [390, 320]) {
    const page = await browser.newPage({ viewport: { width: w, height: 844 } });
    await page.goto('file://' + path.join(__dirname, 'preview.html'));
    await page.waitForTimeout(5500);
    for (const k of ['L:cap', 'L:human']) {
      // focus via keyboard: focus previous marker then Tab
      await page.focus(`#ladder-viz .mk[data-key="${k}"]`);
      await page.waitForTimeout(50);
      const box = await page.evaluate((k) => { const g = document.querySelector(`#ladder-viz .mk[data-key="${k}"]`); g.scrollIntoView({ block: 'center' }); const r = g.getBoundingClientRect(); const t = document.querySelector('#ladder-viz .tip').getBoundingClientRect(); return { y: Math.min(r.top, t.top) - 60 + scrollY, h: Math.max(r.bottom, t.bottom) - Math.min(r.top, t.top) + 120, focused: document.activeElement.getAttribute('data-key'), tipHidden: document.querySelector('#ladder-viz .tip').hidden }; }, k);
      console.log(w, k, JSON.stringify(box));
      await page.screenshot({ path: `n3-${w}-${k.replace(':', '')}.png`, fullPage: true, clip: { x: 0, y: box.y, width: w, height: box.h } });
    }
    await page.close();
  }
  await browser.close();
})();
