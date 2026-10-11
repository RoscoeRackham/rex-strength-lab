// L4 (Kouri label overlap), L5 (value cells' ground), L6 (plate overflow), L11 (1,000 label), one drawing height per figure.
const { open, SHOTS } = require('./h.js');
(async () => {
  for (const w of [360, 375, 390, 720, 768, 1280]) {
    const { browser, p } = await open({ w, h: 900 });
    // L4: close-up forest axis labels
    await p.click('#zHum'); await p.waitForTimeout(200);
    const l4 = await p.evaluate(() => {
      const sp = [...document.querySelectorAll('#fpAxis .lbls span')].map((s) => { const r = s.getBoundingClientRect(); return { t: s.textContent, l: r.left, r: r.right }; });
      const k = sp.find((s) => /Kouri/.test(s.t)), e = sp.find((s) => /real men|no real man/.test(s.t));
      return { kouri: k ? [k.l, k.r].map(Math.round) : null, end: e ? [e.t, Math.round(e.l), Math.round(e.r)] : null, overlap: k && e ? Math.max(0, Math.min(k.r, e.r) - Math.max(k.l, e.l)) : 0 };
    });
    // L11: whole-scale axis end label
    await p.click('#zAll'); await p.waitForTimeout(200);
    const l11 = await p.evaluate(() => {
      const tp = document.querySelector('#fpAxis .tp'), tr = tp.getBoundingClientRect();
      const bs = [...tp.querySelectorAll('b')].map((b) => { const r = b.getBoundingClientRect(); return { t: b.textContent, l: r.left, r: r.right }; });
      const card = document.getElementById('fpAxis').closest('section, .card, .forest') || document.body; const cr = card.getBoundingClientRect();
      const last = bs[bs.length - 1], first = bs[0];
      return { tape: [Math.round(tr.left), Math.round(tr.right)], last: last.t + ' ' + Math.round(last.l) + '-' + Math.round(last.r), first: first.t + ' ' + Math.round(first.l) + '-' + Math.round(first.r), pastTape: Math.round(Math.max(0, last.r - tr.right)), sw: document.documentElement.scrollWidth, iw: innerWidth };
    });
    // one drawing height: effective scale of every figure (Same height, Front and Side)
    const scales = {};
    for (const view of ['vFront', 'vSide']) {
      await p.click('#' + view); await p.waitForTimeout(300);
      scales[view] = await p.evaluate(() => {
        const out = [];
        document.querySelectorAll('.fig svg').forEach((svg) => {
          const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
          const s = Math.min(r.width / vb.width, r.height / vb.height);
          out.push({ id: svg.closest('.fig').getAttribute('data-id'), s: s, h: r.height, w: r.width, vbw: vb.width });
        });
        const ss = out.map((o) => o.s), mx = Math.max(...ss), mn = Math.min(...ss);
        const small = out.filter((o) => o.s < mx * 0.99).map((o) => o.id + ' ' + (o.s / mx).toFixed(2));
        return { max: mx.toFixed(3), min: mn.toFixed(3), shrunk: small };
      });
    }
    // L6: plate overflow in Real heights + Side
    await p.click('#hReal'); await p.waitForTimeout(300);
    const l6 = await p.evaluate(() => {
      const bad = [];
      document.querySelectorAll('.fig').forEach((c) => { const cr = c.getBoundingClientRect(); c.querySelectorAll('.plate *').forEach((el) => { const r = el.getBoundingClientRect(); if (r.width && r.right > cr.right + 0.5) bad.push(c.getAttribute('data-id') + ' +' + (r.right - cr.right).toFixed(1)); }); });
      return [...new Set(bad)].slice(0, 6);
    });
    // L5: value cells have their own ground on phones
    const l5 = await p.evaluate(() => { const v = document.querySelector('.fp-row .vl'); const cs = getComputedStyle(v); return cs.backgroundColor + ' z' + cs.zIndex; });
    console.log(w + 'px L4', JSON.stringify(l4), '| L11', JSON.stringify(l11), '| L6 overflow', JSON.stringify(l6), '| L5', l5);
    console.log('    figure scale (same height) front', JSON.stringify(scales.vFront), 'side', JSON.stringify(scales.vSide));
    await browser.close();
  }
})();
