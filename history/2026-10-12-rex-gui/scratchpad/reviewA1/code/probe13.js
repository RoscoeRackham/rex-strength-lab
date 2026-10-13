const { launch, url, settle, text, S } = require('./lib.js');
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url('branch.html'));
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', action: 'throw' })));
  await page.reload(); await page.waitForTimeout(300); await settle(page, 'bay'); await settle(page, 'duo-bay'); await page.waitForTimeout(800);
  const st = () => page.evaluate(() => ({ rexAdjust: document.querySelector('#bay details.effort-adjust').open, duoAdjust: document.querySelector('#duo-bay details.effort-adjust').open }));
  console.log('start:', JSON.stringify(await st()));
  // open "Adjust effort" in the Rex + Ollie element only
  await page.click('#duo-bay details.effort-adjust > summary'); await page.waitForTimeout(200);
  console.log('after opening the duo one:', JSON.stringify(await st()));
  // a shared setting changes (the strength chip), which redraws Rex's bay
  await page.click('#tier-chips .chip:nth-child(4)'); await page.waitForTimeout(800); await settle(page, 'bay'); await settle(page, 'duo-bay');
  console.log('after a strength change:', JSON.stringify(await st()));
  // live regions: watch both while only a two-player setting changes (the catch ball)
  await page.waitForTimeout(1000);
  await page.evaluate(() => { window.__live = []; for (const id of ['bay-live', 'duo-live']) new MutationObserver(() => window.__live.push(id + ': ' + document.getElementById(id).textContent.slice(0, 70))).observe(document.getElementById(id), { childList: true, characterData: true, subtree: true }); });
  await page.selectOption('#c-obj', { index: 3 }); await page.waitForTimeout(1500); await settle(page, 'duo-bay'); await page.waitForTimeout(1000);
  console.log('live-region writes after changing only the catch ball:', JSON.stringify(await page.evaluate(() => window.__live), null, 1));
  await br.close();
})();
