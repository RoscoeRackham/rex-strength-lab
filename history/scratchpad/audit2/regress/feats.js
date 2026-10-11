const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const mode of ['comic', 'real']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.addInitScript((m) => localStorage.setItem('rex-lab-v1', JSON.stringify({ mode: m })), mode);
    await page.goto('file://' + __dirname + '/preview.html'); await page.waitForTimeout(400);
    const n = await page.$$eval('.feat .run', (b) => b.length);
    for (let i = 0; i < n; i++) {
      await page.evaluate((i) => document.querySelectorAll('.feat .run')[i].click(), i);
      await page.waitForTimeout(120);
      const t = await page.evaluate((i) => { const f = document.querySelectorAll('.feat')[0] && [...document.querySelectorAll('.feat')].filter((x) => x.querySelector('.run'))[i]; return (f ? f.querySelector('.t').textContent : '?') + ' => ' + document.querySelector('#dial-big').textContent + ' | ' + document.querySelector('.verdict').textContent + ' | ' + [...document.querySelectorAll('#bay .status')].map((s) => s.textContent).join('; '); }, i);
      console.log(mode, t);
    }
    if (errs.length) console.log('ERRORS', errs);
    await page.close();
  }
  await browser.close();
})();
