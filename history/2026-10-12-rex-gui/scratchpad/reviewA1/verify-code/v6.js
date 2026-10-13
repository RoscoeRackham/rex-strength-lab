const { wrap, open, S } = require('./h.js');
(async () => {
  const url = wrap(S + '/lab/dist/index.html', 'branch.html');
  const { browser, page, errs } = await open(url, { duoOpen: true, duoAction: 'catch', action: 'throw' }, { wait: 4000 });
  const st = () => page.evaluate(() => ({ rexAdjust: document.querySelector('#bay details.effort-adjust').open, duoAdjust: document.querySelector('#duo-bay details.effort-adjust').open }));
  console.log('start', JSON.stringify(await st()));
  await page.click('#duo-bay details.effort-adjust > summary'); await page.waitForTimeout(300);
  console.log('after opening the element\'s Adjust effort', JSON.stringify(await st()));
  // a change made from Rex's side: pick a Rex tab and come back (redraws only Rex's bay)
  await page.click('#tab-jump'); await page.waitForTimeout(500); await page.click('#tab-throw'); await page.waitForTimeout(500);
  console.log('after Rex tab Jump -> Throw', JSON.stringify(await st()));
  // now close Rex's and change a shared setting (redraws both)
  await page.click('#bay details.effort-adjust > summary'); await page.waitForTimeout(200);
  console.log('after closing Rex\'s', JSON.stringify(await st()));
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  await page.click('#bolt-rex'); await page.waitForTimeout(3000);
  console.log('after toggling Bolted (both redraw)', JSON.stringify(await st()));
  console.log('errs', errs);
  await browser.close();
})();
