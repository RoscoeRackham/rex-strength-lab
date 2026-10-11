const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const skel of ['host', 'task']) for (const w of [360, 375, 390, 414]) {
    const p = await open(b, { width: w, height: 844, skel });
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('.fig[data-id]').forEach(c => {
        const cr = c.getBoundingClientRect(), pl = c.querySelector('.plate');
        let maxR = cr.right, who = '';
        pl.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.right > maxR + 0.5) { maxR = r.right; who = el.className + ':' + el.textContent.slice(0, 25); } });
        if (maxR > cr.right + 0.5) {
          const nxt = c.nextElementSibling; const sameRow = nxt && Math.abs(nxt.getBoundingClientRect().top - cr.top) < 1;
          const cols = getComputedStyle(pl).gridTemplateColumns;
          out.push({ id: c.dataset.id, cellW: +cr.width.toFixed(1), over: +(maxR - cr.right).toFixed(1), who, plateCols: cols, coveredByNext: !!sameRow });
        }
      });
      return out;
    });
    console.log(skel, w, JSON.stringify(r));
    if (skel === 'host' && w === 390) {
      const el = await p.$('.fig[data-id="thing"]'); await el.scrollIntoViewIfNeeded(); 
      const box = await el.boundingBox(); await p.screenshot({ path: `${DIR}/l6-thing-390.png`, clip: { x: Math.max(0, box.x - 10), y: box.y + box.height - 140, width: Math.min(390 - Math.max(0, box.x - 10), box.width * 2 + 20), height: 140 } });
    }
    await p._ctx.close();
  }
  await b.close();
})();
