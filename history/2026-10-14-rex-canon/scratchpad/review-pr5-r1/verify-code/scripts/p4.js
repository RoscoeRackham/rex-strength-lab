const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile } = await open();
  await load({ action: 'throw', obj: 'car', angle: 45 }, null);
  console.log('effort:', await page.$eval('#effort', (s) => s.value), '|', await tile('bay'));
  await load({ action: 'throw', obj: 'car', angle: 20 }, 'allout');
  console.log('20 deg allout:', await tile('bay'));
  await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1 }, 'allout');
  console.log('fastball catch:', await tile('duo-bay'));
  const gl = await page.evaluate(() => { const g = document.querySelector('#hero-glow'); return g && { strength: g.dataset.strength, glow: g.style.getPropertyValue('--glow') }; });
  await load({ action: 'stomp' }, 'allout');
  console.log('stomp hero glow:', await page.evaluate(() => { const g = document.querySelector('#hero-glow'); return g && { strength: g.dataset.strength, glow: g.style.getPropertyValue('--glow') }; }));
  console.log('errs', page.errs);
  await browser.close();
})();
