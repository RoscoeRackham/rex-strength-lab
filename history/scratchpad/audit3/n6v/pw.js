const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const files = { cur: __dirname + '/cur-preview.html', prev: __dirname + '/../../audit2/prev_orig.html', fix: __dirname + '/fix-preview.html' };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const which of ['fix']) for (const mode of ['real', 'comic']) for (const rate of [1, 4]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, JSON.stringify({ mode, action: 'throw', obj: 'shuttle', angle: 89, surface: 'concrete', anchor: 'friction', groundHolds: false, H: 2, m: 180 }));
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + files[which]);
    await page.waitForFunction(() => document.querySelector('#ladder-viz svg'));
    await page.waitForTimeout(5000);
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    const r = await page.evaluate(async () => {
      const s = document.querySelector('#strength');
      const out = [];
      for (const v of [5.5, 6, 6.5, 6.96, 7.5, 8, 9, 10, 12, 15, 20]) {
        const t = performance.now();
        s.value = v; s.dispatchEvent(new Event('input', { bubbles: true }));
        document.body.offsetHeight;
        out.push([v, Math.round(performance.now() - t)]);
        await new Promise(r => setTimeout(r, 50));
      }
      const sel = document.querySelector('#bay select, #bay [id*=obj]');
      const verdict = (document.querySelector('#bay .verdict') || {}).textContent;
      const ang = [...document.querySelectorAll('#bay label')].map(l => l.textContent).join(' | ');
      return { out, verdict: (verdict || '').slice(0, 100), ang: ang.slice(0, 160) };
    });
    console.log(which, mode, 'x' + rate, JSON.stringify(r.out.map(x => x[1])), 'max', Math.max(...r.out.map(x => x[1])), '|', r.ang, '|', r.verdict, errs.join(';'));
    await ctx.close();
  }
  await browser.close();
})();
