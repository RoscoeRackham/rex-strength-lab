const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const w of [360, 390, 560, 720, 768, 1024, 1280]) {
    const p = await open(b, { width: w, height: 900, skel: 'host' });
    for (const z of ['zHum', 'zAll']) {
      await p.click('#' + z);
      const r = await p.evaluate(() => {
        const sp = Array.from(document.querySelectorAll('#fpAxis .lbls span')).map(s => { const r = s.getBoundingClientRect(); return { t: s.textContent, l: Math.round(r.left), r: Math.round(r.right) }; });
        let ov = 0; for (let i = 0; i < sp.length; i++) for (let j = i + 1; j < sp.length; j++) ov = Math.max(ov, Math.min(sp[i].r, sp[j].r) - Math.max(sp[i].l, sp[j].l));
        return { sp, overlapPx: ov };
      });
      console.log(w, z, JSON.stringify(r));
      if (z === 'zHum' && (w === 390 || w === 768)) { await p.evaluate(() => document.getElementById('fpAxis').scrollIntoView({ block: 'center' })); await p.waitForTimeout(100); const el = await p.$('#fpAxis'); await el.screenshot({ path: `${DIR}/l4-${w}.png` }); }
    }
    await p._ctx.close();
  }
  await b.close();
})();
