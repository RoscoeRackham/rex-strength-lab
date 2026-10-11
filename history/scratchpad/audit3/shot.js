const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PREV = 'file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/preview.html';
(async () => {
  const [st, outFile, w] = [JSON.parse(process.argv[2]), process.argv[3], +(process.argv[4] || 1280)];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(PREV);
  await page.evaluate((st) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, st);
  await page.reload();
  await page.waitForTimeout(500);
  const bay = await page.$('main.panel');
  await bay.screenshot({ path: outFile });
  await browser.close();
})();
