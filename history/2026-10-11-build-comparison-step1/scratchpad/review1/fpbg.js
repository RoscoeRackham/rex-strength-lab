const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1280, 900]]) {
    const { ctx, p } = await open(browser, { w, h, dpr: 2, extraHead: '<style>body{margin:0}[hidden]{display:none!important}</style>' });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    for (const z of ['#zAll', '#zHum']) {
      await p.click(z); await p.waitForTimeout(100);
      const r = await p.evaluate(() => {
        const lab = Array.from(document.querySelectorAll('#fpAxis .lbls span')).filter((s) => s.getBoundingClientRect().width);
        const ov = [];
        for (let i = 0; i < lab.length; i++) for (let j = i + 1; j < lab.length; j++) { const a = lab[i].getBoundingClientRect(), b = lab[j].getBoundingClientRect(); if (a.left < b.right && b.left < a.right) ov.push('"' + lab[i].textContent + '" x "' + lab[j].textContent + '" by ' + Math.round(Math.min(a.right, b.right) - Math.max(a.left, b.left)) + 'px'); }
        // background vertical lines (rules) crossing value text
        const lines = Array.from(document.querySelectorAll('#fp .fp-bg i')).filter((i) => /border-left/.test(i.getAttribute('style')) && !/rule-2/.test(i.getAttribute('style'))).map((i) => ({ x: i.getBoundingClientRect().left, c: /alarm/.test(i.getAttribute('style')) ? 'red real-men line' : /chalk/.test(i.getAttribute('style')) ? 'blue 924 line' : 'Kouri 25 line' }));
        const hits = {};
        document.querySelectorAll('#fp .fp-row .vl').forEach((v) => { const r = v.getBoundingClientRect(); if (!r.width || !v.textContent) return; lines.forEach((l) => { if (l.x > r.left + 1 && l.x < r.right - 1) hits[l.c] = (hits[l.c] || 0) + 1; }); });
        const rows = document.querySelectorAll('#fp .fp-row .vl').length;
        return { labelOverlap: ov, valueCellsCrossedByRule: hits, rows };
      });
      console.log(w, z, JSON.stringify(r));
    }
    if (w === 360) { await p.click('#zHum'); await p.evaluate(() => { const a = document.getElementById('fpAxis'); window.scrollTo(0, a.getBoundingClientRect().top + scrollY - 20); }); await p.waitForTimeout(100); await p.screenshot({ path: path.join(DIR, 't-closeup-axis-360.png'), clip: { x: 0, y: 0, width: 360, height: 220 } }); }
    await ctx.close();
  }
  await browser.close();
})();
