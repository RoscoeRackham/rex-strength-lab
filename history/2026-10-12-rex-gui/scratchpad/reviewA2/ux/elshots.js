const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h, scheme] of [[390, 844, 'light'], [1280, 900, 'dark'], [360, 740, 'dark'], [768, 1024, 'light']]) {
    let page = await open(b, { w, h, scheme, state: { duoOpen: true, duoAction: 'arm' }, wait: 3500 });
    await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
    await page.waitForTimeout(300);
    await page.locator('#duo').screenshot({ path: S + '/shots/el-duo-open-' + w + '-' + scheme + '.png' });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    await page.locator('aside').screenshot({ path: S + '/shots/el-aside-' + w + '-' + scheme + '.png' });
    await page.evaluate(() => { document.getElementById('duo').open = false; });
    await page.waitForTimeout(300);
    await page.locator('#duo').screenshot({ path: S + '/shots/el-duo-closed-' + w + '-' + scheme + '.png' });
    await page.context().close();
  }
  await b.close();
})();
