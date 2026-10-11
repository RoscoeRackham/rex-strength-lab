const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage();
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  for (const gh of [false, true]) {
  await page.evaluate((st) => localStorage.setItem('rex-lab-v1', JSON.stringify(st)), { logKg: 5, inf: true, mode: 'real', surface: 'gravel', groundHolds: gh, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 });
  await page.reload(); await page.waitForTimeout(800);
  console.log('groundHolds', gh, (await page.evaluate(() => { const v=document.querySelector('.verdict'); return (v?v.innerText:'') + ' :: ' + [...document.querySelectorAll('li')].map(e=>e.innerText).filter(t=>/Real muscle caps/.test(t)).join(''); })).replace(/\s+/g,' '));
  }
  await b.close();
})();
