const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname + '/';
const cases = JSON.parse(process.argv[2]);
const full = process.argv[3]==='full';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st, scheme] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 }, colorScheme: scheme || 'light' });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file://' + S + 'preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(700);
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    console.log('==== ' + name + ' errors ' + JSON.stringify(errs) + '\n' + (full? t : t.slice(0, 5000)));
    if (process.argv[4]==='png') await (await page.$('main.panel')).screenshot({ path: S + name + '.png' });
    await page.close();
  }
  await browser.close();
})();
