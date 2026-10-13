const H = require('./h.js');
(async () => {
  for (const [w, h, scheme] of [[390, 844, 'light'], [390, 844, 'dark'], [1280, 900, 'dark']]) {
    const p = await H.open({ w, h, scheme, state: { airAbsorb: 0.3 } });
    await p.evaluate(() => { document.getElementById('powers').open = true; });
    await p.waitForTimeout(300);
    const el = await p.$('#powers');
    await el.screenshot({ path: `out/powers-${w}-${scheme}.png` });
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    // contrast of the read-out and the big %
    const cs = await p.evaluate(() => { const g = (id) => { const n = document.getElementById(id); const s = getComputedStyle(n); return { color: s.color, bg: s.backgroundColor, fs: s.fontSize }; }; return { big: g('air-absorb-big'), read: g('air-absorb-read'), body: getComputedStyle(document.body).backgroundColor, panel: getComputedStyle(document.getElementById('powers')).backgroundColor }; });
    console.log(w, scheme, 'overflow', ov, JSON.stringify(cs));
    await p.close();
  }
  await H.close();
})();
