const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'granite claws 1e34 baseball', s: { logKg: 34, inf: false, mode: 'real', surface: 'granite', groundHolds: false, anchor: 'braced', H: 2, m: 180, action: 'throw', obj: 'baseball', angle: 45 } },
    { name: 'hulk concrete shot', s: { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'shot', angle: 45 } },
    { name: 'hulk sand baseball', s: { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'real', surface: 'sand', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'baseball', angle: 45 } },
  ];
  for (const c of cases) {
    const ctx = await b.newContext();
    const p = await ctx.newPage();
    await p.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, c.s);
    await p.goto('file:///home/user/dino-strength-sim/dist/index.html');
    await p.waitForTimeout(1500);
    const txt = await p.evaluate(() => {
      const chips = [...document.querySelectorAll('.status-row')].map(e => e.innerText.replace(/\n+/g, ' | '));
      const lis = [...document.querySelectorAll('li')].map(e => e.innerText).filter(t => /sink|ground|footing/i.test(t));
      return { chips, lis };
    });
    console.log('== ' + c.name); console.log(JSON.stringify(txt, null, 1));
    await ctx.close();
  }
  await b.close();
})();
