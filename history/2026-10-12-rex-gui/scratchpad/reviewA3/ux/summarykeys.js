const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const page = await open(b, { w: 390, h: 844, wait: 2500 });
  const st = async () => page.evaluate(() => [document.getElementById('duo').open, JSON.parse(localStorage.getItem('rex-lab-v1')).duoOpen, !!document.querySelector('#duo-bay .verdict'), document.activeElement.tagName + (document.activeElement.closest('#duo') ? '@duo' : '')]);
  await page.focus('#duo > summary');
  await page.keyboard.press('Space'); await page.waitForTimeout(1500); console.log('Space', JSON.stringify(await st()));
  await page.keyboard.press('Enter'); await page.waitForTimeout(600); console.log('Enter', JSON.stringify(await st()));
  await page.click('#duo-title'); await page.waitForTimeout(1500); console.log('click h2', JSON.stringify(await st()));
  await page.click('#duo-sum'); await page.waitForTimeout(600); console.log('click summary line', JSON.stringify(await st()));
  await page.reload(); await page.waitForTimeout(2500); console.log('reload', JSON.stringify(await st()));
  console.log(page.errs);
  await b.close();
})();
