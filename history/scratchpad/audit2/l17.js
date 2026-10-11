const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w,h] of [[390,844],[768,1024],[1280,800]]) {
    for (const action of ['lift','throw','pull','jump']) {
      const p = await b.newPage({ viewport: { width: w, height: h } });
      await p.addInitScript((a) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: a })); }, action);
      await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
      await p.waitForTimeout(400);
      const info = await p.evaluate(() => {
        const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top+scrollY), Math.round(b.height)]; };
        return { hero: r('.hero'), dialBig: r('#dial-big'), slider: r('#strength'), setup: r('#setup'), tabs: r('#tabs'), bayCtl: r('.bay-controls'), verdict: r('.verdict'), ladder: r('#ladder'), ladderViz: r('#ladder-viz'), verdictText: (document.querySelector('.verdict')||{}).textContent };
      });
      console.log(w, h, action, JSON.stringify(info));
      if (action==='lift') await p.screenshot({ path: `fold-${w}.png` });
      await p.close();
    }
  }
  await b.close();
})();
