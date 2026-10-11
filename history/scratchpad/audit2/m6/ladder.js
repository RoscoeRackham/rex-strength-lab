const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = '/home/user/dino-strength-sim/dist/preview.html';
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const cs of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, cs.state);
    await page.goto('file://' + prev);
    await page.waitForTimeout(1000);
    const out = await page.evaluate(() => [...document.querySelectorAll('#ladder-viz .mk')].map((g) => g.getAttribute('aria-label')));
    console.log('=== ' + JSON.stringify(cs.state));
    console.log(out.filter((s) => /\d{1,3},\d{3}/.test(s)).join('\n'));
    await page.close();
  }
  await browser.close();
})();
