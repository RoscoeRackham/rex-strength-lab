const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = '/home/user/dino-strength-sim/dist/preview.html';
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const cs of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, cs.state);
    await page.goto('file://' + prev);
    await page.waitForTimeout(700);
    const txt = await page.evaluate(() => document.body.innerText);
    console.log('=== ' + JSON.stringify(cs.state));
    for (const re of cs.grep) {
      const lines = txt.split('\n').filter((l) => new RegExp(re).test(l));
      console.log('  [' + re + '] ' + JSON.stringify(lines.slice(0, 6)));
    }
    await page.close();
  }
  await browser.close();
})();
