const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [scheme, theme] of [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']]) {
    const page = await open(b, { w: 1280, h: 900, scheme, theme, state: { duoOpen: true, duoAction: 'wrestle', anchor: 'bolted' }, wait: 3500 });
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('ollie-setup').open = true; });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
      const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
      const bgOf = (n) => { const stack = []; for (let x = n; x; x = x.parentElement) { const c = parse(getComputedStyle(x).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } } let bg = { r: 255, g: 255, b: 255, a: 1 }; for (const c of stack.reverse()) bg = blend(c, bg); return bg; };
      const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
      const out = [];
      const seen = new Set();
      for (const root of [document.querySelector('aside'), document.querySelector('#duo')]) {
        const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let t;
        while ((t = tw.nextNode())) {
          if (!t.textContent.trim()) continue;
          const e = t.parentElement; if (!e.getClientRects().length || e.closest('.sr-only, #duo-bay .viz')) continue;
          const cs = getComputedStyle(e);
          let op = 1; for (let x = e; x; x = x.parentElement) op *= Number(getComputedStyle(x).opacity);
          const fg = parse(cs.color); const bg = bgOf(e);
          const fgb = blend(Object.assign({}, fg, { a: fg.a * op }), bg);
          const rr = ratio(fgb, bg);
          const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
          const need = big ? 3 : 4.5;
          const key = (e.id || e.tagName + '.' + e.className) + '|' + t.textContent.trim().slice(0, 20);
          if (seen.has(key)) continue; seen.add(key);
          if (rr < need) out.push(key + ' ' + rr.toFixed(2) + ' need ' + need + (op < 1 ? ' (opacity ' + op + ')' : '') + ' disabled=' + !!e.closest(':disabled, [disabled]'));
        }
      }
      // pseudo glyphs and focus ring
      const extra = [];
      for (const sel of ['#duo > summary', '#powers > summary', '#ollie-setup > summary']) { const s = document.querySelector(sel); const cs = getComputedStyle(s, '::after'); extra.push(sel + '::after ' + ratio(blend(parse(cs.color), bgOf(s)), bgOf(s)).toFixed(2)); }
      const acc = parse(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().replace(/^#(..)(..)(..)$/, (m, a, b, c) => 'rgb(' + parseInt(a, 16) + ',' + parseInt(b, 16) + ',' + parseInt(c, 16) + ')'));
      extra.push('focus ring (accent) vs panel ' + ratio(acc, bgOf(document.querySelector('#duo > summary'))).toFixed(2) + ' vs page bg ' + ratio(acc, bgOf(document.body)).toFixed(2));
      const sel = document.querySelector('#duo-tabs [aria-selected=true]'); const un = document.querySelector('#duo-tabs [aria-selected=false]');
      extra.push('selected tab text ' + ratio(parse(getComputedStyle(sel).color), bgOf(sel)).toFixed(2) + '; selected tab fill vs panel ' + ratio(bgOf(sel), bgOf(sel.parentElement)).toFixed(2) + '; unselected border vs panel ' + ratio(parse(getComputedStyle(un).borderTopColor), bgOf(un.parentElement)).toFixed(2));
      const cb = document.querySelector('#bolt-rex');
      extra.push('checkbox accent ' + getComputedStyle(cb).accentColor);
      return { out: out.slice(0, 30), extra };
    });
    console.log('==', scheme, theme || '-');
    console.log(r.out.join('\n') || 'text all pass');
    console.log(r.extra.join('\n'));
    await page.context().close();
  }
  await b.close();
})();
