// Drag the launch angle (in the bay): the least-disruptive effort changes; does the effort slider follow?
const { launch, open } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, page } = await open(b, 1280, 900, 'light', { storage: JSON.stringify({ group: 'solo', action: 'throw' }), wait: 2500 });
  await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details.effort-adjust')) d.open = true; });
  const snap = (l) => page.evaluate((l) => { const e = document.querySelector('#effort-use'); const rd = document.querySelector('.effort-read'); return l + ' | angle ' + document.querySelector('#angle').value + ' | slider ' + (+e.value).toFixed(2) + ' "' + e.getAttribute('aria-valuetext') + '" | readout: ' + rd.innerText.split('\n')[0].slice(0, 80) + ' | focus ' + document.activeElement.id; }, l);
  console.log(await snap('start'));
  const box = await (await page.$('#angle')).boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width * 0.5, y); await page.mouse.down();
  for (let i = 0; i <= 15; i++) { await page.mouse.move(box.x + box.width * (0.5 + 0.025 * i), y); await page.waitForTimeout(40); }
  await page.mouse.up(); await page.waitForTimeout(2000);
  console.log(await snap('after angle drag'));
  await page.evaluate(() => document.activeElement.blur()); await page.click('#grp-solo'); await page.waitForTimeout(800);
  console.log(await snap('after a full render'));
  await b.close();
})();
