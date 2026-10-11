const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'prev.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = (process.argv[2] || '33').split(',').map(Number);
  for (const logKg of cases) for (const action of ['jump', 'stomp']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', s); } catch (e) {} },
      JSON.stringify({ logKg: logKg > 100 ? 30 : logKg, inf: logKg > 100, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action, obj: 'car', angle: 45 }));
    await page.goto('file://' + prev);
    await page.waitForTimeout(1500);
    const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
    console.log('==== logKg', logKg, action, errs.length ? 'ERR ' + errs : '');
    console.log(txt.split('\n').filter(Boolean).slice(0, 40).join('\n'));
    await page.screenshot({ path: path.join(__dirname, `r10-${action}-${logKg}.png`) });
    await page.close();
  }
  await browser.close();
})();
