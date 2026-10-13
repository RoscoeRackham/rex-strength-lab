const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' }))); await page.reload(); await page.waitForTimeout(3000);
  const rd = () => page.evaluate(() => ({ rex: document.getElementById('bay-live').textContent.slice(0, 50), duo: document.getElementById('duo-live').textContent.slice(0, 50) }));
  console.log('initial', JSON.stringify(await rd()));
  await page.click('#tab-collide'); await page.waitForTimeout(1200); console.log('after duo tab Collide', JSON.stringify(await rd()));
  await page.click('#tab-jump'); await page.waitForTimeout(1200); console.log('after Rex tab Jump', JSON.stringify(await rd()));
  await b.close();
})();
