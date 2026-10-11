const { open, close } = require('./h.js');
(async () => {
  for (const w of [390, 1280, 320]) {
    const { page, ctx } = await open({ w, h: 844, state: { action: 'lift' }, wait: 0 });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 30000 });
    await page.waitForTimeout(300);
    const res = await page.evaluate(() => {
      const wrap = document.querySelector('#ladder-viz');
      const out = [];
      const ov = getComputedStyle(wrap).overflowY + '/' + getComputedStyle(wrap).overflowX;
      for (const g of wrap.querySelectorAll('.mk')) {
        g.dispatchEvent(new FocusEvent('focus'));
        const tip = wrap.querySelector('.tip');
        const tr = tip.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        // marker label rect
        const lr = [...g.querySelectorAll('text')].map(t => t.getBoundingClientRect());
        const top = Math.min(...lr.map(r => r.top)), bot = Math.max(...lr.map(r => r.bottom));
        const covers = tr.top < bot && tr.bottom > top && tr.left < Math.max(...lr.map(r => r.right)) && tr.right > Math.min(...lr.map(r => r.left));
        const dot = g.querySelector('circle').getBoundingClientRect();
        const coversDot = tr.top < dot.bottom && tr.bottom > dot.top && tr.left < dot.right && tr.right > dot.left;
        out.push({ k: g.getAttribute('data-key'), below: Math.round(tr.bottom - wr.bottom), above: Math.round(wr.top - tr.top), h: Math.round(tr.height), coversOwnLabel: covers, coversDot });
        g.dispatchEvent(new FocusEvent('blur'));
      }
      return { ov, out };
    });
    console.log(w, 'overflow', res.ov);
    for (const o of res.out) if (o.below > 0 || o.above > 0 || o.coversOwnLabel || o.coversDot) console.log('  ', JSON.stringify(o));
    // screenshot captain america tooltip
    await page.focus('#ladder-viz .mk[data-key="L:cap"]');
    await page.waitForTimeout(100);
    const tb = await page.locator('#ladder-viz .tip').boundingBox();
    const sb = await page.locator('#ladder-viz').boundingBox();
    await page.screenshot({ path: `l14-${w}.png`, clip: { x: 0, y: Math.max(0, Math.min(tb.y, sb.y + sb.height - 300) - 20), width: w, height: 360 } });
    await ctx.close();
  }
  await close();
})();
