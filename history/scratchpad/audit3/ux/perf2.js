const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const url of ['file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/prev_orig.html', 'file://' + __dirname + '/preview.html']) {
    for (const rate of [1, 4]) {
      const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
      await ctx.addInitScript(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', obj: 'shuttle', angle: 89 })));
      const p = await ctx.newPage();
      await p.goto(url); await p.waitForTimeout(1500);
      const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate });
      const r = await p.evaluate(async () => {
        const s = document.querySelector('#strength'); const out = [];
        for (const lg of [6.5, 6.8, 7, 7.2, 7.5, 8, 9]) { s.value = lg; const t0 = performance.now(); s.dispatchEvent(new Event('input')); out.push(lg + ':' + (performance.now() - t0).toFixed(0)); await new Promise(r => setTimeout(r, 20)); }
        return out.join(' ') + ' | verdict ' + document.querySelector('#bay .verdict').textContent;
      });
      console.log(url.includes('audit2') ? 'OLD' : 'NEW', 'x' + rate, r);
      await ctx.close();
    }
  }
  await b.close();
})();
