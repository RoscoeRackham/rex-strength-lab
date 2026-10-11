const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  const st = { logKg: Math.log10(90718.474) + 1e-12, inf: false, mode: 'real', surface: process.argv[2] || 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 };
  if (process.argv[3]) st.logKg = +process.argv[3];
  await page.evaluate(s => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await page.reload();
  await page.waitForTimeout(5000);
  const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
  console.log(txt);
  console.log('ERR', errs);
  await page.screenshot({ path: __dirname + '/n5-' + (process.argv[2]||'concrete') + '.png', fullPage: false });
  await browser.close();
})();
