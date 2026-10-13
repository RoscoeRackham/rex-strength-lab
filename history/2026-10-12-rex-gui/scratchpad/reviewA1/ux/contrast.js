const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  for (const [scheme, attr] of [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']]) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await page.goto(NEW()); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1500);
    if (attr) await page.evaluate((a) => document.documentElement.setAttribute('data-theme', a), attr);
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('duo').open = true; document.getElementById('ollie-setup').open = true; });
    await page.waitForTimeout(2500);
    const out = await page.evaluate(() => {
      const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
      const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const bgOf = (n) => { while (n) { const c = parse(getComputedStyle(n).backgroundColor); if (c.a > 0.5) return c; n = n.parentElement; } return { r: 255, g: 255, b: 255 }; };
      const ratio = (fg, bg) => { const a = lum(fg), b2 = lum(bg); return (Math.max(a, b2) + 0.05) / (Math.min(a, b2) + 0.05); };
      const rows = [];
      const check = (sel, pseudo) => { const n = document.querySelector(sel); if (!n) return rows.push(sel + ' MISSING'); const cs = getComputedStyle(n, pseudo || null); const fg = parse(cs.color); const bg = bgOf(n); rows.push(sel + (pseudo || '') + ' ' + ratio(fg, bg).toFixed(2) + ' (' + cs.fontSize + ' ' + cs.fontWeight + ')'); };
      ['#ground-sec .side-head', '#ground-hint', '#powers-sum', '#powers > p.hint', '#powers .eyebrow', '#bolt-lbl', '#powers .pair .check span', '#powers .field .hint', '#duo-title', '.duo-title .eyebrow', '#duo-sum', '#ollie-sum', '#ollie-setup .hint', '#duo-tabs .tab[aria-selected="true"]', '#duo-tabs .tab[aria-selected="false"]', '#tabs .tab[aria-selected="false"]'].forEach((s) => check(s));
      check('details.duo-panel > summary', '::after'); check('#powers > summary', '::after');
      // border of duo panel vs page bg (3:1 for UI component boundary not required for a panel; just report)
      const cb = document.getElementById('bolt-rex'); rows.push('checkbox accent ' + getComputedStyle(cb).accentColor);
      return rows;
    });
    console.log('== ' + scheme + (attr ? ' data-theme=' + attr : '')); console.log(out.join('\n'));
    await page.close();
  }
  await b.close();
})();
