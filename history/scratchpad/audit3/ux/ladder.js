const { open, close } = require('./h.js');
const ST = 907.18474;
(async () => {
  const cases = [
    ['default', {}],
    ['spidey', { logKg: Math.log10(9071.8474) + 1e-12 }],
    ['secretwars', { logKg: Math.log10(136077711000000) + 1e-12 }],
    ['inf', { inf: true }],
    ['real-kaiju', { mode: 'real', H: 50, m: 180 * 15625 }],
    ['comic-plush-sand', { H: 0.4, m: 180 * 0.008, surface: 'sand' }],
    ['comicground', { groundHolds: true }],
    ['min', { logKg: 1 }],
    ['max', { logKg: 34 }],
  ];
  for (const w of [320, 390, 768, 1280]) for (const scheme of ['light']) for (const [name, st] of cases) {
    if (w !== 390 && name !== 'default' && name !== 'inf' && name !== 'min' && name !== 'max' && name !== 'real-kaiju') continue;
    const { page, ctx, errs } = await open({ w, h: 844, scheme, state: Object.assign({ action: 'throw' }, st), wait: 0 });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 30000 });
    await page.waitForTimeout(300);
    const res = await page.evaluate(() => {
      const wrap = document.querySelector('#ladder-viz'), svg = wrap.querySelector('svg');
      const wr = wrap.getBoundingClientRect(), sr = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const texts = [...svg.querySelectorAll('text')].map((t) => { const r = t.getBoundingClientRect(); const b = t.getBBox(); return { s: t.textContent, g: t.closest('g') ? t.closest('g').getAttribute('data-key') : null, r: { l: r.left, r: r.right, t: r.top, b: r.bottom }, bb: b }; });
      const clipped = texts.filter((t) => t.bb.x < vb.x - 0.5 || t.bb.x + t.bb.width > vb.x + vb.width + 0.5 || t.bb.y < -0.5 || t.bb.y + t.bb.height > vb.height + 0.5).map((t) => t.s + ' bbox x' + t.bb.x.toFixed(0) + '..' + (t.bb.x + t.bb.width).toFixed(0) + ' vbW ' + vb.width);
      const ov = [];
      for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i].r, b = texts[j].r;
        const ix = Math.min(a.r, b.r) - Math.max(a.l, b.l), iy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
        if (ix > 1 && iy > 2) ov.push(texts[i].s + ' X ' + texts[j].s + ' (' + ix.toFixed(0) + 'x' + iy.toFixed(0) + ')');
      }
      // does the now-rule cross any text?
      const lines = [...svg.querySelectorAll(':scope > line')];
      const now = lines.filter((l) => l.getAttribute('stroke') === 'var(--ink)')[0];
      let nowHits = [];
      if (now) { const nr = now.getBoundingClientRect(); for (const t of texts) { const a = t.r; if (a.l < nr.right && a.r > nr.left && a.t < nr.bottom + 1 && a.b > nr.top - 1) nowHits.push(t.s); } }
      const fs = [...svg.querySelectorAll('text')].map((t) => parseFloat(getComputedStyle(t).fontSize) * sr.width / vb.width);
      return { wrapW: wr.width, svgW: sr.width, vbW: vb.width, minFont: Math.min(...fs).toFixed(1), n: texts.length, clipped, ov, nowHits, overflowDoc: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    console.log(`${w} ${scheme} ${name}: wrap ${res.wrapW.toFixed(0)} svg ${res.svgW.toFixed(0)} vb ${res.vbW} minFont ${res.minFont}px texts ${res.n} docOverflow ${res.overflowDoc}`);
    if (res.clipped.length) console.log('  CLIPPED:', res.clipped.join(' | '));
    if (res.ov.length) console.log('  OVERLAP:', res.ov.join(' | '));
    if (res.nowHits.length) console.log('  NOW-RULE crosses:', res.nowHits.join(' | '));
    if (errs.length) console.log('  ERRS', errs);
    if (w === 390 || w === 320) await page.locator('#ladder').screenshot({ path: `ladder-${w}-${name}.png` });
    await ctx.close();
  }
  await close();
})();
