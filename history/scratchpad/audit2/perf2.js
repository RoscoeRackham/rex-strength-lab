const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const rate of [1, 4]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, JSON.stringify({ mode: 'real', action: 'jump' }));
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForFunction(() => document.querySelector('#ladder-viz svg'));
    const r = await page.evaluate(async () => {
      const wait = () => new Promise(r => { const mo = new MutationObserver(() => { mo.disconnect(); r(); }); mo.observe(document.querySelector('#ladder-viz'), { childList: true }); });
      const out = {};
      const s = document.querySelector('#strength');
      // slider moves incl forced layout
      let worst = 0;
      for (const act of ['throw', 'jump', 'stomp']) {
        document.querySelector('#tab-' + act).click();
        for (const v of [2.708, 3.5, 4, 5, 6, 8, 12, 20, 30]) { const t = performance.now(); s.value = v; s.dispatchEvent(new Event('input')); document.body.offsetHeight; worst = Math.max(worst, performance.now() - t); }
      }
      out.sliderWorstWithLayout = Math.round(worst);
      // change size chip (threshold recompute)
      for (const lbl of ['Kaiju (50 m)', 'Plush (40 cm)', 'Dino (2 m)']) {
        const b = [...document.querySelectorAll('#size-chips .chip')].find(x => x.textContent === lbl);
        const t = performance.now(); const p = wait(); b.click(); const sync = performance.now() - t; await p;
        out['size ' + lbl] = [Math.round(sync), Math.round(performance.now() - t)];
      }
      for (const v of ['sand', 'bedrock', 'concrete']) {
        const sel = document.querySelector('#surface'); if (![...sel.options].some(o => o.value === v)) continue;
        const t = performance.now(); const p = wait(); sel.value = v; sel.dispatchEvent(new Event('change')); await p;
        out['surface ' + v] = Math.round(performance.now() - t);
      }
      const cb = document.querySelector('#ground-holds');
      let t = performance.now(); let p = wait(); cb.click(); await p; out.groundHolds = Math.round(performance.now() - t);
      t = performance.now(); p = wait(); document.querySelector('#mode-comic').click(); await p; out.toComic = Math.round(performance.now() - t);
      t = performance.now(); p = wait(); document.querySelector('#mode-real').click(); await p; out.toReal = Math.round(performance.now() - t);
      return out;
    });
    console.log('CPU x' + rate, JSON.stringify(r));
    await ctx.close();
  }
  await browser.close();
})();
