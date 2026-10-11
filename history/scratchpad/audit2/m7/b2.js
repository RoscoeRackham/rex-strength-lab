const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, { logKg: Math.log10(1.81436948e23), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', H: 2, m: 180, action: 'pull', obj: 'car', angle: 45 });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  const txt = await page.evaluate(() => document.body.innerText);
  const i = txt.indexOf('Relativity is built in');
  console.log(txt.slice(i, i + 220));
  const j = txt.indexOf('Rex drags it');
  console.log('---', txt.slice(j - 50, j + 900));
  const vis = await page.evaluate(() => { const e = document.querySelector('.verdict'); const r = e.getBoundingClientRect(); return [r.top, r.height]; });
  console.log('verdict rect', vis);
  await browser.close();
})();
