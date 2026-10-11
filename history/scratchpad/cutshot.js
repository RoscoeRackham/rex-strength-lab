const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/';
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st, scheme] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 }, colorScheme: scheme || 'light', deviceScaleFactor: 2 });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(700);
    const svg = await page.$('svg[aria-label^="Cut-away"]');
    if (svg) await (await svg.evaluateHandle((n) => n.closest('div').parentElement)).screenshot({ path: S + name + '.png' });
    else console.log('no cutaway', name);
    await page.close();
  }
  await browser.close();
})();
