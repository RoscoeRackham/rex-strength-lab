const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const rate of [1, 4]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await page.addInitScript(() => {
      window.__lt = [];
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push({ start: e.startTime, dur: e.duration }); }).observe({ type: 'longtask', buffered: true });
    });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(1500);
    const loadLT = await page.evaluate(() => window.__lt.map(e => Math.round(e.dur)));
    console.log(`rate ${rate}x  load long tasks:`, loadLT);
    const steps = [
      ['Real', '#mode-real'],
      ['Kaiju', 'button.chip[data-h="50"]'],
      ['Comic', '#mode-comic'],
      ['Dino 2m', 'button.chip[data-h="2"]'],
      ['ground-holds on', '#ground-holds'],
      ['ground-holds off', '#ground-holds'],
      ['Real again', '#mode-real'],
      ['Comic again', '#mode-comic'],
    ];
    for (const [name, sel] of steps) {
      await page.evaluate(() => { window.__lt = []; });
      const t0 = await page.evaluate(() => performance.now());
      // measure time until ladder svg is replaced
      await page.evaluate(() => { window.__ladderDone = null; const w = document.querySelector('#ladder-viz'); const mo = new MutationObserver(() => { if (window.__ladderDone == null) window.__ladderDone = performance.now(); }); mo.observe(w, { childList: true, subtree: false }); });
      await page.click(sel);
      await page.waitForTimeout(rate === 1 ? 1200 : 3500);
      const r = await page.evaluate(() => ({ lt: window.__lt.map(e => Math.round(e.dur)), done: window.__ladderDone }));
      console.log(`  ${name.padEnd(18)} long tasks(ms): ${JSON.stringify(r.lt)}  ladder redrawn at +${r.done ? Math.round(r.done - t0) : 'n/a'} ms`);
    }
    // slider
    await page.evaluate(() => { window.__lt = []; });
    for (let i = 0; i < 20; i++) { await page.evaluate((v) => { const s = document.querySelector('#strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, 3 + i * 0.5); await page.waitForTimeout(30); }
    await page.waitForTimeout(800);
    console.log('  slider sweep long tasks:', await page.evaluate(() => window.__lt.map(e => Math.round(e.dur))));
    await page.close();
  }
  await browser.close();
})();
