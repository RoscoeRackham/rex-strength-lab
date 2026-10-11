const { open, S } = require('./h.js');
(async () => {
  for (const w of [360, 390, 414, 1280]) {
    const { browser, p } = await open(w, 800, 'light', { deviceScaleFactor: w < 500 ? 3 : 1 });
    await p.evaluate(() => document.getElementById('tool').scrollIntoView());
    await p.waitForFunction(() => document.querySelectorAll('#viewCaps span').length === 3, null, { timeout: 60000 });
    await p.waitForTimeout(500);
    const o = await p.evaluate(() => {
      const sp = Array.from(document.querySelectorAll('#viewCaps span'));
      const r = sp.map((s) => { const b = s.getBoundingClientRect(); const lh = parseFloat(getComputedStyle(s).lineHeight) || 13.2; return { t: s.textContent, x0: Math.round(b.left), x1: Math.round(b.right), lines: Math.round(b.height / lh), h: Math.round(b.height) }; });
      const gaps = r.slice(1).map((x, i) => x.x0 - r[i].x1);
      return { r, gaps, font: getComputedStyle(sp[0]).fontFamily };
    });
    console.log(w, JSON.stringify(o));
    if (w <= 390) { const b = await p.$('#viewCaps'); await b.scrollIntoViewIfNeeded(); const bb = await b.boundingBox(); await p.screenshot({ path: S + '/caps-' + w + '.png', clip: { x: 0, y: bb.y - 60, width: w, height: bb.height + 70 } }); }
    await browser.close();
  }
})();
