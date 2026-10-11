const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w,h] of [[375,667],[390,844],[412,915]]) {
    for (const action of ['lift','throw','pull']) {
      const p = await b.newPage({ viewport: { width: w, height: h } });
      await p.addInitScript((a) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: a })); }, action);
      await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
      await p.waitForTimeout(400);
      const info = await p.evaluate(() => {
        const r = (s) => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); return [Math.round(b.top+scrollY), Math.round(b.bottom+scrollY)]; };
        const sl = r('#strength'), v = r('.verdict');
        const markers = document.querySelectorAll('#ladder-viz g.mk').length;
        return { slider: sl, verdict: v, span: v[1]-sl[0], markers, now: [...document.querySelectorAll('#ladder-viz text')].filter(t=>/now/.test(t.textContent)).length };
      });
      console.log(w, h, action, JSON.stringify(info), 'coVisible=', info.span <= h);
      if (w===390 && action==='throw') { await p.evaluate(() => scrollTo(0, 590)); await p.waitForTimeout(200); await p.screenshot({ path: 'covis-390-throw.png' }); }
      await p.close();
    }
  }
  await b.close();
})();
