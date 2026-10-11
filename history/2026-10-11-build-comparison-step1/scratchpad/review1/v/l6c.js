const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const skel of ['host', 'task']) for (const w of [360, 375, 390, 414]) {
    const p = await open(b, { width: w, height: 844, skel });
    for (const mode of [['hSame', 'vFront'], ['hSame', 'vSide'], ['hReal', 'vFront'], ['hReal', 'vSide']]) {
      await p.click('#' + mode[0]); await p.click('#' + mode[1]); await p.waitForTimeout(50);
      const r = await p.evaluate(() => {
        const out = [];
        document.querySelectorAll('.fig[data-id]').forEach(c => {
          const cr = c.getBoundingClientRect(), pl = c.querySelector('.plate');
          let maxR = cr.right, who = '';
          pl.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.right > maxR + 0.5) { maxR = r.right; who = el.className + ':' + el.textContent.slice(0, 22); } });
          if (maxR > cr.right + 0.5) { const nxt = c.nextElementSibling; out.push({ id: c.dataset.id, cellW: +cr.width.toFixed(1), over: +(maxR - cr.right).toFixed(1), who, nextSameRow: !!(nxt && Math.abs(nxt.getBoundingClientRect().top - cr.top) < 1) }); }
        });
        return out;
      });
      console.log(skel, w, mode.join('+'), JSON.stringify(r));
      if (skel === 'host' && w === 390 && mode[0] === 'hReal' && mode[1] === 'vFront' && r.length) {
        const el = await p.$('.fig[data-id="thing"]'); await el.scrollIntoViewIfNeeded(); const box = await el.boundingBox();
        await p.screenshot({ path: `${DIR}/l6-thing-real-390.png`, clip: { x: Math.max(0, box.x - 4), y: box.y + box.height - 150, width: Math.min(390 - Math.max(0, box.x - 4), box.width * 2 + 8), height: 150 } });
      }
    }
    await p._ctx.close();
  }
  await b.close();
})();
