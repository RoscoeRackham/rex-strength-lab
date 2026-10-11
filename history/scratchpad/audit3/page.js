const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'prev.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><style>[hidden]{display:none!important}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    ['car', 45, 'friction'], ['tank', 30, 'friction'], ['car', 45, 'braced'], ['car', 10, 'friction'],
  ];
  for (const [obj, angle, anchor] of cases) for (const lv of [34, 12]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file://' + prev);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { logKg: lv === 'inf' ? 34 : lv, inf: lv === 'inf', mode: 'real', surface: 'concrete', groundHolds: false, anchor, H: 2, m: 180, action: 'throw', obj, angle });
    await page.reload();
    await page.waitForTimeout(1500);
    const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
    const lines = txt.split('\n').filter((l) => /flies|shoved|Footing|recoil|Launch|launch|m\/s/i.test(l)).slice(0, 8);
    console.log(`== ${obj} ${angle}° ${anchor} ${lv}`); console.log('  ' + lines.join('\n  '));
    await page.close();
  }
  await browser.close();
})();
