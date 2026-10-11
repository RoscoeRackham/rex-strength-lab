const { open, close } = require('./h.js');
(async () => {
  for (const w of [390, 1280]) {
    const { page, ctx } = await open({ w, h: 844, state: { action: 'lift' }, wait: 0 });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 30000 });
    const hits = await page.evaluate(async () => {
      const out = {};
      const s = document.querySelector('#strength');
      for (let lg = 1; lg <= 34.001; lg += 0.1) {
        s.value = lg; s.dispatchEvent(new Event('input'));
        await new Promise(r => setTimeout(r, 140));
        const svg = document.querySelector('#ladder-viz svg');
        const rule = [...svg.querySelectorAll(':scope > line')].find(l => l.getAttribute('stroke') === 'var(--ink)');
        const arrow = [...svg.querySelectorAll(':scope > path')].find(p => p.getAttribute('fill') === 'var(--ink)');
        for (const m of [rule, arrow]) {
          const r = m.getBoundingClientRect();
          for (const t of svg.querySelectorAll('text')) {
            const q = t.getBoundingClientRect();
            // shrink text box to glyph core
            const qt = q.top + q.height * 0.25, qb = q.bottom - q.height * 0.2;
            if (r.left < q.right - 1 && r.right > q.left + 1 && r.top < qb && r.bottom > qt) (out[t.textContent] = out[t.textContent] || []).push(lg.toFixed(1));
          }
        }
      }
      return out;
    });
    console.log(w, Object.entries(hits).map(([k, v]) => `"${k}" at log ${v[0]}..${v[v.length - 1]} (${v.length})`).join('\n    '));
    await ctx.close();
  }
  await close();
})();
