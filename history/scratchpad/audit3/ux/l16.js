const { open, close } = require('./h.js');
(async () => {
  for (const rate of [1, 4]) {
    const { page, ctx } = await open({ w: 1280, h: 900, state: { action: 'jump', mode: 'real' }, wait: 0 });
    await page.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([e.startTime, e.duration]); }).observe({ type: 'longtask', buffered: true }); });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 60000 });
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    const steps = [
      ['Size → Kaiju (real)', () => [...document.querySelectorAll('#size-chips .chip')].find(c => c.dataset.h === '50').click()],
      ['Real → Comic', () => document.querySelector('#mode-comic').click()],
      ['Size → Dino', () => [...document.querySelectorAll('#size-chips .chip')].find(c => c.dataset.h === '2').click()],
      ['Surface → sand', () => { const s = document.querySelector('#surface'); s.value = 'sand'; s.dispatchEvent(new Event('change')); }],
      ['Comic ground on', () => { const s = document.querySelector('#ground-holds'); s.checked = true; s.dispatchEvent(new Event('change')); }],
      ['Anchor → braced', () => { const s = document.querySelector('#anchor'); s.value = 'braced'; s.dispatchEvent(new Event('change')); }],
      ['Comic → Real', () => document.querySelector('#mode-real').click()],
      ['Feat: Hurdle 20-story (jump60)', () => [...document.querySelectorAll('.feat')].find(f => f.textContent.includes('twenty-story')).querySelector('.run').click()],
    ];
    for (const [name, fn] of steps) {
      const t0 = await page.evaluate(() => performance.now());
      await page.evaluate(fn);
      const t1 = Date.now();
      await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 120000 }).catch(() => {});
      const took = Date.now() - t1;
      await page.waitForTimeout(200);
      const lt = await page.evaluate((t0) => window.__lt.filter(x => x[0] >= t0 - 5), t0);
      console.log(`x${rate} ${name}: ladder ready ${took} ms; long tasks: ${lt.length}, max ${Math.round(Math.max(0, ...lt.map(x => x[1])))} ms`);
    }
    await ctx.close();
  }
  await close();
})();
