const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = __dirname + '/n6-preview.html';
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w,h] of [[1280,900],[390,844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('file://' + prev);
  await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: Math.log10(511), inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'lift', obj: 'bar511', angle: 37 })); });
  await page.reload();
  await page.waitForTimeout(5000);
  console.log('--- viewport', w);
  console.log('before sum:', await page.textContent('#setup-sum'));
  console.log('setup open:', await page.evaluate(() => document.querySelector('#setup').open));
  console.log('mode-hint before:', await page.textContent('#mode-hint'));
  const btn = page.locator('article.feat', { hasText: 'Hurdle a twenty-story building' }).locator('button.run');
  await btn.click();
  await page.waitForTimeout(1500);
  console.log('after sum:', await page.textContent('#setup-sum'));
  console.log('mode-hint after:', await page.textContent('#mode-hint'));
  console.log('saved:', await page.evaluate(() => localStorage.getItem('rex-lab-v1')));
  const bay = await page.textContent('main.panel');
  console.log('bay contains comic/real mention:', /comic|real muscle|real-muscle/i.test(bay));
  console.log('bay text:', bay.replace(/\s+/g,' ').slice(0, 2500));
  await page.screenshot({ path: __dirname + '/n6-after-' + w + '.png' });
  await page.close();
  }
  await browser.close();
})();
