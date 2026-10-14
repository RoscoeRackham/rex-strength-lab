const { open, waitDone, chromium } = require('./page.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const st of [{ duoOpen: true, duoAction: 'collide' }, { duoOpen: true, duoAction: 'collide', colSrc: 'jump' }, { duoOpen: true, duoAction: 'collide', anchor: 'bolted' }]) {
    const page = await open(browser, st);
    await page.selectOption('#duo-effort', 'plaster');
    await page.waitForTimeout(500);
    const t = await waitDone(page, '#duo-bay');
    const i = t.indexOf('Effort:'); 
    console.log('=== ', JSON.stringify(st));
    console.log(t.slice(Math.max(0, t.indexOf('All-out') - 10 > 0 ? 0 : 0), 2500));
    console.log('ERRS', page.errs);
    await page.close();
  }
  await browser.close();
})();
