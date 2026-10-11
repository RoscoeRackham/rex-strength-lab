const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l14/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(2500);
    const loc = page.locator('#ladder-viz .mk[aria-label^="Captain America"]');
    await loc.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);
    const circle = page.locator('#ladder-viz .mk[aria-label^="Captain America"] circle');
    await circle.hover({ force: true });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const wrap = document.querySelector('#ladder-viz'); const tip = wrap.querySelector('.tip');
      const wr = wrap.getBoundingClientRect(); const tr = tip.getBoundingClientRect();
      // visible part via elementFromPoint at the tip's bottom-ish
      const midX = tr.left + tr.width / 2;
      const probes = [tr.top + 5, wr.bottom - 3, wr.bottom + 5, tr.bottom - 5].map((yy) => { const e = document.elementFromPoint(midX, yy); return yy.toFixed(0) + ':' + (e ? (e.tagName + '.' + e.className + '#' + e.id) : null); });
      return { hidden: tip.hidden, text: tip.textContent, over: tr.bottom - wr.bottom, probes, scrollbarW: wrap.offsetWidth - wrap.clientWidth };
    });
    console.log(width, JSON.stringify(r));
    await page.screenshot({ path: OUT + `hover-cap-${width}.png` });
    // keyboard focus via Tab path
    await page.mouse.move(0, 0);
    await page.evaluate(() => document.querySelector('#ladder-viz .mk[aria-label^="Captain America"]').focus());
    await page.waitForTimeout(200);
    const r2 = await page.evaluate(() => { const wrap = document.querySelector('#ladder-viz'); const tip = wrap.querySelector('.tip'); return { hidden: tip.hidden, over: tip.getBoundingClientRect().bottom - wrap.getBoundingClientRect().bottom, active: document.activeElement.getAttribute('aria-label') }; });
    console.log(width, 'focus', JSON.stringify(r2));
    await page.screenshot({ path: OUT + `focus-cap-${width}.png` });
    await page.close();
  }
  await browser.close();
})();
