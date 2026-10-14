const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'catch', action: 'throw' }, wait: 4000 });
  const st = () => page.evaluate(() => ({ soloMath: document.querySelector('#bay details.math').open, duoMath: document.querySelector('#duo-bay details.math').open }));
  console.log('start', JSON.stringify(await st()));
  await page.evaluate(() => { const s = document.querySelector('#bay details.math > summary'); s.focus(); s.click(); });
  await page.waitForTimeout(300);
  console.log('opened Rex math', JSON.stringify(await st()));
  await page.selectOption('#surface', { index: 2 }); await page.waitForTimeout(2500);
  console.log('after surface change (both redraw)', JSON.stringify(await st()));
  await page.evaluate(() => document.querySelector('#duo-bay details.math > summary').click()); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector('#bay details.math > summary').click()); await page.waitForTimeout(300);
  console.log('duo open, Rex closed', JSON.stringify(await st()));
  await page.click('#tab-jump'); await page.waitForTimeout(800);
  await page.click('#tab-collide'); await page.waitForTimeout(2500);
  console.log('after tab changes', JSON.stringify(await st()));
  // a background duo search finishing: pick a preset on duo effort
  await page.evaluate(() => { const s = document.querySelector('#duo-effort'); s.value = s.options[s.options.length - 1].value; s.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.waitForTimeout(3000);
  console.log('after duo effort change', JSON.stringify(await st()), page.errs);
  await b.close();
})();
