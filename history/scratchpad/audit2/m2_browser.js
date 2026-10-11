const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'concrete-hulk', logKg: Math.log10(90718.474), surface: 'concrete' },
    { name: 'granite-1e12', logKg: 12, surface: 'granite' },
    { name: 'granite-secretwars', logKg: Math.log10(136077711000000), surface: 'granite' },
    { name: 'granite-earth', logKg: Math.log10(5.9724e24), surface: 'granite' },
    { name: 'granite-1e34', logKg: 34, surface: 'granite' },
    { name: 'steel-1e14', logKg: 14, surface: 'steel' },
  ];
  for (const cs of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 1800 } });
    const page = await ctx.newPage();
    await page.addInitScript((st) => { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); },
      { logKg: cs.logKg, inf: false, mode: 'real', surface: cs.surface, groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => document.querySelector('#bay').innerText);
    console.log('=== ' + cs.name + ' ===');
    console.log(txt.split('\n').filter(l => /jumps|Ground|ground|craters|Energy|TNT|punch/i.test(l)).join('\n'));
    await page.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/m2_' + cs.name + '.png', fullPage: false });
    await ctx.close();
  }
  await browser.close();
})();
