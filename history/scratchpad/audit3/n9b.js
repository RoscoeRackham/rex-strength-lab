const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'n9preview.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + prev);
  for (const lg of [29.5]) {
    for (const action of ['stomp']) {
      await page.evaluate(([lg, action]) => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: lg, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action, obj: 'car', angle: 45 })), [lg, action]);
      await page.reload();
      await page.waitForTimeout(1500);
      await page.click('#tab-' + action).catch(()=>{});
      await page.waitForTimeout(300);
      const txt = await page.$eval('main.panel', (e) => e.innerText);
      const lines = txt.split("\n");
      console.log('=== 10^' + lg, action); console.log(lines.join('\n'));
    }
  }
  await browser.close();
})();
