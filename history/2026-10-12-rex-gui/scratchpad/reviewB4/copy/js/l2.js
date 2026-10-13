const H = require('./h.js');
(async () => {
  const page = await H.open(1280, 900);
  await H.load(page, { action: 'throw', airAbsorb: 0 });
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  const read = () => page.evaluate(() => ({ r: document.getElementById('air-absorb-read').textContent, vt: document.getElementById('air-absorb').getAttribute('aria-valuetext'), sum: document.getElementById('powers-sum').textContent }));
  console.log(await read());
  for (const id of ['sw-unbreakable', 'sw-recoil', 'sw-keep']) { await page.click('#' + id); await H.settle(page); }
  console.log(await read());
  // keyboard on slider
  await page.focus('#air-absorb'); await page.keyboard.press('ArrowRight'); await H.settle(page);
  console.log(await read());
  await page.keyboard.press('End'); await H.settle(page);
  console.log(await read());
  // tab order around slider
  await page.focus('#sw-passenger');
  const order = [];
  for (let i = 0; i < 4; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => document.activeElement.id || document.activeElement.tagName)); }
  console.log('tab order after passenger', order);
  console.log(page.errs);
  await H.close();
})();
