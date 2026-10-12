const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const cases = process.argv.slice(2).length ? JSON.parse(process.argv[2]) : [
    { w: 360, h: 740, st: {} }, { w: 390, h: 844, st: {} }, { w: 768, h: 1024, st: {} }, { w: 1280, h: 900, st: {} },
    { w: 360, h: 740, st: { walkD: 1000 } }, { w: 360, h: 740, st: { walkD: 0.5 } }, { w: 1280, h: 900, st: { walkD: 700 } },
    { w: 390, h: 844, st: { walker: 'both', surface: 'clay_soft' } }, { w: 390, h: 844, st: { surface: 'sand_loose' } },
  ];
  for (const cs of cases) {
    const ctx = await b.newContext({ viewport: { width: cs.w, height: cs.h }, colorScheme: cs.scheme || 'light', deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ action: 'walk' }, s))); }, cs.st);
    await page.goto(PREV); await page.waitForTimeout(1200);
    const stepE = cs.stepEffort;
    if (stepE != null) { await page.evaluate((v) => { const s = document.querySelector('#step-effort'); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }, stepE); await page.waitForTimeout(400); }
    const svg = await page.$('#bay .viz svg');
    if (!svg) { console.log('no chart', JSON.stringify(cs)); await ctx.close(); continue; }
    const info = await page.evaluate(() => {
      const svg = document.querySelector('#bay .viz svg'); const sr = svg.getBoundingClientRect();
      const ts = [...svg.querySelectorAll('text')].map((t) => { const r = t.getBoundingClientRect(); return { t: t.textContent, l: r.left - sr.left, r: r.right - sr.left, top: r.top - sr.top, b: r.bottom - sr.top }; });
      const over = [];
      for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) { const a = ts[i], c = ts[j]; if (a.l < c.r - 0.5 && c.l < a.r - 0.5 && a.top < c.b - 0.5 && c.top < a.b - 0.5) over.push(a.t + ' X ' + c.t); }
      const out = ts.filter((x) => x.l < -0.5 || x.r > sr.width + 0.5 || x.top < -0.5 || x.b > sr.height + 0.5).map((x) => x.t + ' l' + Math.round(x.l) + ' r' + Math.round(x.r) + ' of ' + Math.round(sr.width));
      return { w: Math.round(sr.width), over, out, legend: document.querySelector('#bay .ladder-legend') && document.querySelector('#bay .ladder-legend').innerText };
    });
    console.log(JSON.stringify(cs), JSON.stringify(info));
    await svg.screenshot({ path: OUT + `chart-${cs.w}-${JSON.stringify(cs.st).replace(/[^a-z0-9]/gi, '')}${stepE != null ? '-e' + stepE : ''}.png` });
    await ctx.close();
  }
  await b.close();
})();
