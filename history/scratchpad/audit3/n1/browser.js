const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'preview.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { logKg: Math.log10(90718.474), inf: false, obj: 'tank', angle: 30 },
    { logKg: 34, inf: false, obj: 'tank', angle: 30 },
    { logKg: 34, inf: true, obj: 'tank', angle: 30 },
    { logKg: 6.2, inf: false, obj: 'car', angle: 45 },
    { logKg: 34, inf: true, obj: 'car', angle: 45 },
  ];
  for (const cs of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const st = Object.assign({ mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw' }, cs);
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, JSON.stringify(st));
    await page.goto('file://' + prev);
    await page.waitForTimeout(5000);
    const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
    console.log('=====', JSON.stringify(cs));
    console.log(txt.split('\n').filter(l => /flies|shoved|limit|holds back|m\/s|carrying|Range|Launch|Distance/i.test(l)).slice(0, 18).join('\n'));
    if (cs.inf && cs.obj === 'tank') await page.locator('main.panel').screenshot({ path: path.join(__dirname, 'tank-inf.png') });
    await page.close();
  }
  await browser.close();
})();
