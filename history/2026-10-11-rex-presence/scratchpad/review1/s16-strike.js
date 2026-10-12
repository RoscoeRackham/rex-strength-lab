const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const w of [360, 390, 768, 1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk' })); sessionStorage.setItem('x', 1); } });
    await page.goto(PREV); await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const svg = document.querySelector('#bay .viz svg'); const sr = svg.getBoundingClientRect(); const k = sr.width / svg.viewBox.baseVal.width;
      const lines = [...svg.querySelectorAll('line')].filter((l) => l.getAttribute('stroke-dasharray') || l.getAttribute('stroke') === 'var(--ink)').map((l) => ({ x1: +l.getAttribute('x1') * k, x2: +l.getAttribute('x2') * k, y1: +l.getAttribute('y1') * k, y2: +l.getAttribute('y2') * k, kind: l.getAttribute('stroke-dasharray') ? 'threshold' : 'listener' }));
      const labels = [...svg.querySelectorAll('text.lbl-strong')].map((t) => { const r = t.getBoundingClientRect(); return { t: t.textContent, l: r.left - sr.left, r: r.right - sr.left, top: r.top - sr.top, b: r.bottom - sr.top }; });
      const hits = [];
      for (const L of labels) for (const ln of lines) {
        if (ln.kind === 'threshold' && ln.y1 > L.top + 2 && ln.y1 < L.b - 2 && ln.x1 < L.r && ln.x2 > L.l) hits.push('"' + L.t + '" crossed by threshold line at y=' + ln.y1.toFixed(1) + ' (text ' + L.top.toFixed(1) + '-' + L.b.toFixed(1) + ')');
        if (ln.kind === 'listener' && ln.x1 > L.l + 1 && ln.x1 < L.r - 1 && L.t !== 'listener') hits.push('"' + L.t + '" crossed by the listener line');
      }
      return hits;
    });
    console.log(w, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
