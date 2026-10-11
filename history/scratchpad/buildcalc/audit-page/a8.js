const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const scheme of ['light', 'dark']) {
    const { ctx, p } = await open(browser, 1280, 900, scheme);
    const res = await p.evaluate(() => {
      function parse(c) { const m = c.match(/[\d.]+/g).map(Number); return m; }
      function lum(c) { const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
      function bg(el) { while (el) { const c = getComputedStyle(el).backgroundColor; const m = parse(c); if (m.length < 4 || m[3] > 0) return m; el = el.parentElement; } return [255, 255, 255]; }
      const out = {};
      const sel = ['.eyebrow', '.k', '.stats dt', '.g .site small', '.g .v2', '.figure figcaption', '.fact .use', '.fact summary', '.foot', '.src-group h4', '.spec', '.unit', '.cmp-axis .ax', '.chip.unknown', '.hint', '.legend li', '#hFt'];
      sel.forEach(s => { const el = document.querySelector(s); if (!el) return; const cs = getComputedStyle(el); const fg = parse(cs.color); const b = bg(el); const L1 = lum(fg), L2 = lum(b); const r = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05); out[s] = r.toFixed(2) + ' @' + cs.fontSize + ' ' + cs.fontWeight; });
      // placeholder
      return out;
    });
    console.log(scheme, res);
    await ctx.close();
  }
  await browser.close();
})();
