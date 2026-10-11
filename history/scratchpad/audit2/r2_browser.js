const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const runs = [
    { name: 'real-inf-concrete', st: { inf: true, mode: 'real', surface: 'concrete', groundHolds: false, action: 'jump' } },
    { name: 'real-inf-concrete-comicground', st: { inf: true, mode: 'real', surface: 'concrete', groundHolds: true, action: 'jump' } },
    { name: 'real-1e34-concrete', st: { inf: false, logKg: 34, mode: 'real', surface: 'concrete', groundHolds: false, action: 'jump' } },
    { name: 'real-1e34-comicground', st: { inf: false, logKg: 34, mode: 'real', surface: 'concrete', groundHolds: true, action: 'jump' } },
  ];
  for (const r of runs) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ H: 2, m: 180, anchor: 'friction', obj: 'car', angle: 45, logKg: 5 }, s))); }, r.st);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => {
      const v = document.querySelector('.verdict');
      const tiles = [...document.querySelectorAll('.tile')].map(t => t.innerText.replace(/\n/g,' | '));
      const lis = [...document.querySelectorAll('.happens li')].map(l => l.innerText);
      const chips = [...document.querySelectorAll('.status')].map(s => s.innerText);
      return { dial: (document.querySelector('#dial-big')||{}).innerText, verdict: v && v.innerText, tiles, lis, chips };
    });
    console.log('=== ' + r.name, JSON.stringify(txt, null, 1), errs);
    await page.screenshot({ path: r.name + '.png', fullPage: false });
    await ctx.close();
  }
  await browser.close();
})();
