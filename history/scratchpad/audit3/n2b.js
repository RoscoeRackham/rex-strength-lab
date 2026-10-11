const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'prev-n2.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { logKg: 4.0, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 },
    { logKg: 34, inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'tank', angle: 30 },
  ];
  for (const st of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto('file://' + prev);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload();
    await page.waitForTimeout(5000);
    const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
    console.log('=====', JSON.stringify(st), errs);
    console.log(txt.slice(0, 2500));
    await page.screenshot({ path: path.join(__dirname, `n2-${st.obj}.png`), fullPage: false });
    await page.close();
  }
  await browser.close();
})();
