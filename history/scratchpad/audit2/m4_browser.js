const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'plush-comic-shot', st: { H: 0.4, m: 180*Math.pow(0.2,3), mode: 'comic', obj: 'shot', angle: 37 } },
    { name: 'plush-real-shot', st: { H: 0.4, m: 180*Math.pow(0.2,3), mode: 'real', obj: 'shot', angle: 37 } },
    { name: 'dino-comic-shot', st: { H: 2, m: 180, mode: 'comic', obj: 'shot', angle: 37 } },
    { name: 'kaiju-comic-shot', st: { H: 50, m: 180*Math.pow(25,3), mode: 'comic', obj: 'shot', angle: 37 } },
    { name: 'kaiju-comic-baseball0', st: { H: 50, m: 180*Math.pow(25,3), mode: 'comic', obj: 'baseball', angle: 0 } },
    { name: 'h10-real-baseball', st: { H: 10, m: 180*Math.pow(5,3), mode: 'real', obj: 'baseball', angle: 2 } },
    { name: 'h7-comic-baseball', st: { H: 7, m: 180*Math.pow(3.5,3), mode: 'comic', obj: 'baseball', angle: 45 } },
    { name: 'h2-m400-comic-shot', st: { H: 2, m: 400, mode: 'comic', obj: 'shot', angle: 37 } },
  ];
  for (const c of cases) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    const st = Object.assign({ logKg: Math.log10(511), inf: false, surface: 'concrete', groundHolds: false, anchor: 'friction', action: 'throw' }, c.st);
    await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, st);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(600);
    const txt = await page.evaluate(() => { const b = document.querySelector('#bay'); return b ? b.innerText : document.body.innerText.slice(0, 500); });
    const lines = txt.split('\n').filter(l => /Reality check|Calculation failed|flies|can.t throw|can hold/i.test(l));
    console.log('==', c.name, '\n  ' + lines.join('\n  '), errs.length ? '\n  ERR: ' + errs.join(' ; ') : '');
    await ctx.close();
  }
  await browser.close();
})();
