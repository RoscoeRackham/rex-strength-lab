const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const mode of ['real', 'comic']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, JSON.stringify({ mode, action: 'throw' }));
    const page = await ctx.newPage();
    const t0 = Date.now();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForFunction(() => document.querySelector('#ladder-viz svg'));
    console.log(mode, 'load to ladder', Date.now() - t0, 'ms');
    for (const action of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
      await page.click('#tab-' + action);
      const res = await page.evaluate(async () => {
        const s = document.querySelector('#strength');
        const out = [];
        for (const v of [2.708, 4, 6, 8, 10, 14, 18, 22, 26, 30, 33.9]) {
          const t = performance.now();
          s.value = v; s.dispatchEvent(new Event('input', { bubbles: true }));
          const sync = performance.now() - t;
          out.push([v, Math.round(sync)]);
        }
        return out;
      });
      const worst = res.reduce((a, b) => (b[1] > a[1] ? b : a));
      console.log(' ', mode, action, 'slider input sync ms:', JSON.stringify(res.map(r => r[1])), 'worst at logKg', worst[0]);
    }
    // ladder render cost after slider move (thresholds cached)
    const lad = await page.evaluate(async () => {
      const s = document.querySelector('#strength');
      s.value = 5; s.dispatchEvent(new Event('input', { bubbles: true }));
      const t = performance.now();
      await new Promise(r => { const mo = new MutationObserver(() => { mo.disconnect(); r(); }); mo.observe(document.querySelector('#ladder-viz'), { childList: true }); });
      return performance.now() - t;
    });
    console.log(' ', mode, 'ladder re-render after slider (incl 120ms debounce):', Math.round(lad));
    // mode toggle cost (threshold recompute)
    const tog = await page.evaluate(async (mode) => {
      const b = document.querySelector(mode === 'real' ? '#mode-comic' : '#mode-real');
      let t = performance.now(); b.click(); const sync = performance.now() - t;
      t = performance.now();
      await new Promise(r => { const mo = new MutationObserver(() => { mo.disconnect(); r(); }); mo.observe(document.querySelector('#ladder-viz'), { childList: true }); });
      return [sync, performance.now() - t];
    }, mode);
    console.log(' ', mode, '-> toggle mode: sync', Math.round(tog[0]), 'ms; ladder appears after', Math.round(tog[1]), 'ms');
    await ctx.close();
  }
  await browser.close();
})();
