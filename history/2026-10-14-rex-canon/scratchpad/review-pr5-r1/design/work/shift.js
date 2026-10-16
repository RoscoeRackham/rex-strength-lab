const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const u5 = prep(), u4 = prep(W + '/pr4-dist.html', 'pr4');
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const gb01 = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[390, 844], [1280, 900], [700, 900], [481, 800], [480, 800], [320, 700]]) {
    const r = {};
    for (const [nm, u] of [['pr4', u4], ['pr5', u5]]) {
      const pg = await browser.newPage({ viewport: { width: w, height: h } });
      await pg.goto(u); await loadOn(pg, DUO({ action: 'throw', obj: 'car', duoAction: 'collide', colSrc: 'set', colGB: gb01 }), 'allout');
      r[nm] = await pg.evaluate(() => { const R = (n) => { if (!n) return null; const b = n.getBoundingClientRect(); return [b.x, b.y + scrollY, b.width, b.height].map((v) => +v.toFixed(2)); };
        return { heroImg: R(document.querySelector('.hero img')), heroText: R(document.querySelector('.hero h1')), heroH: R(document.querySelector('.hero')), colImg: R(document.querySelector('#duo-bay .art-figure img')), cap: R(document.querySelector('#duo-bay .art-figure figcaption')), fig: R(document.querySelector('#duo-bay .art-figure')), sx: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
      await pg.close();
    }
    const diff = Object.keys(r.pr4).filter((k) => k !== 'colImg' && k !== 'cap' && k !== 'fig' ? JSON.stringify(r.pr4[k]) !== JSON.stringify(r.pr5[k]) : JSON.stringify(r.pr4[k].slice ? r.pr4[k].slice(2) : r.pr4[k]) !== JSON.stringify(r.pr5[k].slice ? r.pr5[k].slice(2) : r.pr5[k]));
    console.log(w, 'diff keys:', diff.join(',') || 'none', JSON.stringify(r));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
