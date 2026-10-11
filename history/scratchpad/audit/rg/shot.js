const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cases = JSON.parse(process.argv[2]);
const maxLen = Number(process.argv[3] || 6000);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    const t0 = Date.now();
    await page.reload(); await page.waitForTimeout(700);
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    const saved = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
    console.log('==== ' + name + ' (' + (Date.now() - t0) + ' ms) errors ' + JSON.stringify(errs) + '\nSTATE ' + saved + '\n' + t.slice(0, maxLen));
    await page.close();
  }
  await browser.close();
})();
