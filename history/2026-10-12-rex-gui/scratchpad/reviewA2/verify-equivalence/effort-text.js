const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await page.addInitScript(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'sprint', anchor: 'bolted' })));
  await page.goto('file://' + path.join(__dirname, 'wrapped-branch.html'));
  await page.waitForSelector('#bay .verdict');
  await page.selectOption('#effort', 'custom');
  // 2,000 kg: two-thirds of his 3,007 kg weight
  await page.evaluate(() => { const s = document.querySelector('#effort-use'); s.value = String(Math.log10(2000)); s.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(800);
  const t = await page.evaluate(() => document.querySelector('#bay').innerText);
  console.log(t.split('\n').filter((l) => /lifting|Effort|Top speed:|Bolted|push-off|Push-off/i.test(l)).join('\n'));
  await browser.close();
})();
