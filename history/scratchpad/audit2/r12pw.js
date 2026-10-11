const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const L = Math.log10(511);
  const cases = [
    { name: 'plush comic shot', st: { logKg: L, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 0.4, m: 180 * Math.pow(0.2, 3), action: 'throw', obj: 'shot', angle: 37 } },
    { name: 'plush real shot', st: { logKg: L, inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 0.4, m: 180 * Math.pow(0.2, 3), action: 'throw', obj: 'shot', angle: 37 } },
    { name: 'default 2m comic shot', st: { logKg: L, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'shot', angle: 37 } },
    { name: 'kaiju-ish 8m real baseball', st: { logKg: L, inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 8, m: 180 * 64, action: 'throw', obj: 'baseball', angle: 2 } },
    { name: '6m comic baseball', st: { logKg: L, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 6, m: 180 * 27, action: 'throw', obj: 'baseball', angle: 2 } },
  ];
  for (const k of cases) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, k.st);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const txt = await page.$eval('#bay', b => b.innerText);
    const lines = txt.split('\n').filter(l => /Reality check|Calculation failed|flies|can.t throw/.test(l));
    console.log('==', k.name, '\n', lines.join('\n '), errs.length ? '\n console errors: ' + errs.join(' ; ') : '');
    await page.screenshot({ path: k.name.replace(/\W+/g, '_') + '.png', fullPage: false });
    await ctx.close();
  }
  await browser.close();
})();
