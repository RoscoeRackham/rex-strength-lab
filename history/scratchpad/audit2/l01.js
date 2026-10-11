const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  const t = await p.$$eval('.scale-ends span', els => els.map(e => e.textContent));
  const mx = await p.$eval('#strength', e => e.max);
  console.log(t, 'max', mx);
  await p.evaluate(() => { const s = document.querySelector('#strength'); s.value = 34; s.dispatchEvent(new Event('input')); });
  await p.waitForTimeout(300);
  const st = JSON.parse(localStorage === undefined ? '{}' : '{}');
  console.log('logKg', await p.evaluate(() => localStorage.getItem('rex-lab-v1')));
  await b.close();
  console.log('Suns at 1e34:', 1e34/1.9884e30);
})();
