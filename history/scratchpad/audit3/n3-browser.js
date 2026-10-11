const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const S = process.argv[2];
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = S + '/n3-preview.html';
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    ['A comic concrete standing 10^4.2 car 45', { logKg: 4.2, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 }],
    ['B real braced 10^8 car 45', { logKg: 8, inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'braced', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 }],
    ['C real friction 10^34 tank 30', { logKg: 34, inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'tank', angle: 30 }],
  ];
  for (const [label, st] of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto('file://' + prev);
    await page.waitForTimeout(5000);
    const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
    console.log('==== ' + label + ' errs=' + JSON.stringify(errs));
    console.log(txt.split('\n').filter(l => /hold|Grip|palms|plate|Drive|footing|flies|Launch/i.test(l)).join('\n'));
    await page.screenshot({ path: S + '/n3-' + label.split(' ')[0] + '.png', fullPage: false });
    await ctx.close();
  }
  await browser.close();
})();
