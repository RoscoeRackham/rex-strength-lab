const { NEW, launch, DIR, path } = require('./common');
(async () => {
  const b = await launch();
  const url = NEW();
  for (const scheme of ['light', 'dark']) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(DIR, 'shots', `rig-closed-1280-${scheme}.png`), clip: { x: 0, y: 300, width: 1280, height: 1500 }, fullPage: true });
    await page.click('#duo > summary'); await page.waitForTimeout(3000);
    const h = await page.evaluate(() => document.querySelector('.rig').getBoundingClientRect().height);
    console.log('rig height open', h);
    await page.screenshot({ path: path.join(DIR, 'shots', `rig-open-1280-${scheme}.png`), clip: { x: 0, y: 1550, width: 1280, height: 1400 }, fullPage: true });
    await page.close();
  }
  await b.close();
})();
