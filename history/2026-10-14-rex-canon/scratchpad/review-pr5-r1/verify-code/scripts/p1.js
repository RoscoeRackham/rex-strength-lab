const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile } = await open();
  await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: Math.log10(300), logKg: 8 }, 'allout');
  console.log('CASE1:', await tile('duo-bay'));
  await load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 4, logKg: 9 }, 'allout');
  console.log('CASE2:', await tile('duo-bay'));
  await load({ action: 'throw', obj: 'pyramid', angle: 90, logKg: 17 }, 'allout');
  console.log('PYR tile:', await tile('bay'));
  const t = await page.evaluate(() => document.getElementById('bay').textContent.replace(/ /g, ' ').match(/The shimmer \(the Shimmer tile\)[^.]*\.[^.]*\./));
  console.log('PYR item:', t && t[0]);
  console.log('errs', page.errs);
  await browser.close();
})();
