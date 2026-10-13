const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const factor of [1, 0.5]) for (const m of [9000, 10000]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(([factor, m]) => {
      let d; Object.defineProperty(window, 'DINO_DATA', { configurable: true, get() { return d; }, set(v) { if (v && v.surfaces) for (const s of v.surfaces) if (/clay/.test(s.id)) s.shear *= factor; d = v; } });
      localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight', surface: 'softclay', m }));
    }, [factor, m]);
    const page = await ctx.newPage();
    await page.goto('file://' + __dirname + '/branch.html'); await page.waitForTimeout(2000);
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    console.log('clay shear x' + factor + ', mass ' + m + ' kg: ' + t.split('\n').filter(l => /sink|print|mired|stuck|deep/i.test(l)).slice(0, 3).join(' | ').slice(0, 400));
    await ctx.close();
  }
  await browser.close();
})();
