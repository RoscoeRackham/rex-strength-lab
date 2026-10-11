const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const w of [360, 390, 768, 1280]) {
    const p = await open(b, { width: w, height: 900, skel: 'host' });
    for (const z of ['zAll', 'zHum']) {
      await p.click('#' + z);
      const r = await p.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.fp-bg i')).filter(i => /solid/.test(i.style.borderLeft) && !/rule-2/.test(i.style.borderLeft)).map(i => { const r = i.getBoundingClientRect(); return { x: r.left, w: parseFloat(getComputedStyle(i).borderLeftWidth), c: i.style.borderLeft }; });
        const res = lines.map(L => {
          let vl = 0, nm = 0, total = 0, ex = [];
          document.querySelectorAll('.fp-row').forEach(row => {
            const v = row.querySelector('.vl'); if (!v || !v.textContent.trim()) return; total++;
            // text-only rect via range
            const rg = document.createRange(); rg.selectNodeContents(v); const rects = Array.from(rg.getClientRects());
            if (rects.some(rr => L.x + L.w > rr.left && L.x < rr.right)) { vl++; if (ex.length < 3) ex.push(v.textContent); }
            const n = row.querySelector('.nm'); const rg2 = document.createRange(); rg2.selectNodeContents(n); if (Array.from(rg2.getClientRects()).some(rr => L.x + L.w > rr.left && L.x < rr.right)) nm++;
          });
          return { line: L.c, x: Math.round(L.x), crossesValueText: vl + '/' + total, crossesNameText: nm, ex };
        });
        return res;
      });
      console.log(w, z, JSON.stringify(r));
      if (w === 390) { await p.evaluate(() => document.querySelector('.fp-row[data-row="bruce_banner"]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(100); await p.screenshot({ path: `${DIR}/l5-${w}-${z}.png`, clip: { x: 0, y: 300, width: 390, height: 300 } }); }
    }
    await p._ctx.close();
  }
  await b.close();
})();
