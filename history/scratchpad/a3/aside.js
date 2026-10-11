const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[1280, 'light'], [390, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: 1400 }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html'); await page.waitForTimeout(800);
    await page.evaluate(() => { document.querySelector('#setup').open = true; document.querySelector('#ollie-setup').open = true; });
    await page.click('#o-own'); await page.click('#grp-duo'); await page.waitForTimeout(300);
    await (await page.$('.panel-controls')).screenshot({ path: S + 'aside-' + w + '.png' });
    await (await page.$('main.panel')).screenshot({ path: S + 'main-' + w + '.png' });
    console.log(w, errs);
    await page.close();
  }
  await browser.close();
})();
