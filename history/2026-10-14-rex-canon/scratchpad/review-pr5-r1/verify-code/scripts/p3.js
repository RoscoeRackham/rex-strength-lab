const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile } = await open();
  await load({ action: 'throw', obj: 'car', angle: 45, logKg: 12, m: 1e12 }, 'allout');
  console.log('setup:', await page.$eval('#setup-sum', (n) => n.textContent));
  console.log('TILE:', await tile('bay'));
  const t = await page.evaluate(() => document.getElementById('bay').textContent.replace(/ /g, ' ').match(/The shimmer \(the Shimmer tile\)[^.]*\./));
  console.log('ITEM:', t && t[0]);
  const v = await page.evaluate(() => { const tx = document.getElementById('bay').textContent.replace(/ /g, ' '); const m = tx.match(/[^.]*(well|own pull|his gravity)[^.]*\./gi); return m && m.slice(0, 3); });
  console.log('GRAVITY TEXT:', v);
  console.log('errs', page.errs);
  await browser.close();
})();
