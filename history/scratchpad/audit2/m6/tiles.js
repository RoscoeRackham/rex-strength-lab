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
    const out = await page.evaluate(() => {
      const t = [...document.querySelectorAll('#bay .tile, main .tile')].map((x) => [...x.children].map((c) => c.textContent).join(' | '));
      const st = [...document.querySelectorAll('main .status')].map((x) => x.textContent);
      const vd = [...document.querySelectorAll('main .verdict')].map((x) => x.textContent);
      return { vd, st, t: [...new Set(t)] };
    });
    console.log('=== ' + JSON.stringify(cs.state));
    console.log(JSON.stringify(out, null, 1));
    await page.close();
  }
  await browser.close();
})();
