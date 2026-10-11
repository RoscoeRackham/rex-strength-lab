const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const file = process.argv[2];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, touch] of [[1280, 900, false], [390, 844, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage();
    await page.goto('file://' + file);
    const n = await page.evaluate(() => document.querySelectorAll('#ladder-viz svg g.mk').length);
    let bad = 0;
    for (let i = 0; i < n; i++) {
      for (const where of ['dot', 'label']) {
        await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 1.5, inf: false })); });
        await page.reload(); await page.waitForTimeout(400);
        const pt = await page.evaluate(([i, where]) => {
          const g = document.querySelectorAll('#ladder-viz svg g.mk')[i];
          const c = g.querySelector('circle.ring'); c.scrollIntoView({ block: 'center' }); const svg = c.ownerSVGElement; const W = svg.viewBox.baseVal.width; const pxDec = W < 520 ? 26 : 22; const LG = (c) => 34 - (+c.getAttribute('cy') - 24) / pxDec;
          const left = g.querySelector('text').getAttribute('text-anchor') === 'end';
          if (where === 'dot') { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2 + (left ? -2.5 : 2.5), y: r.top + r.height / 2, label: g.getAttribute('aria-label'), lg: LG(c) }; }
          const r = g.querySelector('text').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, label: g.getAttribute('aria-label'), lg: LG(c) };
        }, [i, where]);
        if (touch) await page.touchscreen.tap(pt.x, pt.y); else await page.mouse.click(pt.x, pt.y);
        await page.waitForTimeout(250);
        const dial = await page.evaluate(() => document.querySelector('#dial-big').textContent);
        const got = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).logKg);
        const ok = Math.abs(got - pt.lg) < 0.02;
        if (!ok) bad++;
        console.log(`${w} ${where.padEnd(5)} ${ok ? 'ok ' : 'BAD'} ${pt.label.split('.')[0].padEnd(66)} => ${dial} (got lg ${got.toFixed(3)}, want ${pt.lg.toFixed(3)})`);
      }
    }
    console.log(`${w}: ${bad} mismatches`);
    await ctx.close();
  }
  await browser.close();
})();
