const { open, close } = require('./h.js');
(async () => {
  for (const w of [390, 320]) {
    const { page, ctx } = await open({ w, h: 844, state: { action: 'lift' }, wait: 0 });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 30000 });
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => {
      const out = [];
      for (const g of document.querySelectorAll('#ladder-viz .mk')) {
        g.focus();
        const tr = document.querySelector('#ladder-viz .tip').getBoundingClientRect();
        const inside = (r) => r.left >= tr.left - 0.5 && r.right <= tr.right + 0.5 && r.top >= tr.top - 0.5 && r.bottom <= tr.bottom + 0.5;
        const parts = [...g.querySelectorAll('text, circle')].map(n => n.getBoundingClientRect());
        if (parts.every(inside)) out.push(g.getAttribute('aria-label').split(',')[0]);
        g.blur();
      }
      return out;
    });
    console.log(w, 'markers whose dot and every label line are fully under their own focus tooltip:', r.join(' | '));
    await ctx.close();
  }
  await close();
})();
