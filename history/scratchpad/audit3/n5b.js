const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'n5-preview.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [obj, lk] of [['shot', 1.33], ['shot', 1.32], ['shot', 1.30], ['bowling', 1.33], ['bowling', 1.32]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); },
      { logKg: lk, inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj, angle: 45 });
    await page.goto('file://' + prev);
    await page.waitForTimeout(5000);
    const txt = await page.evaluate(() => {
      const m = document.querySelector('main.panel');
      const v = m.querySelector('.verdict');
      const tiles = [...m.querySelectorAll('.tile')].map(t => t.innerText.replace(/\n+/g, ' | '));
      const lis = [...m.querySelectorAll('li')].map(l => l.innerText);
      return { verdict: v && v.innerText, tiles, lis, strength: (document.querySelector('#strength-readout, .strength-value, output') || {}).innerText };
    });
    console.log('==', obj, lk, JSON.stringify(txt, null, 1), errs);
    if (obj === 'shot' && lk === 1.33) await (await page.$('main.panel')).screenshot({ path: path.join(__dirname, 'n5-shot-133.png') });
    await page.close();
  }
  await browser.close();
})();
