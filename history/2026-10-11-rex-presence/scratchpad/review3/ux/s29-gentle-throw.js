// Gentle hold on the Throw tab: what the visible readout says, and what the folded hazard list says.
const { launch, open, OUT } = require('./lib');
const busy = (page) => page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
(async () => {
  const b = await launch();
  for (const st of [{ group: 'solo', action: 'throw', obj: 'car' }, { group: 'solo', action: 'throw', obj: 'car', logKg: 7 }]) {
    for (const on of [false, true]) {
      const { ctx, page } = await open(b, 390, 844, 'light', { wait: 500, storage: JSON.stringify(Object.assign({ gentleHold: on }, st)) });
      for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
      const vis = await page.evaluate(() => document.querySelector('#bay .effort-read').innerText.replace(/\n+/g, ' | '));
      const chips = await page.evaluate(() => [...document.querySelectorAll('#bay .status')].map((x) => x.innerText).join(' ; '));
      await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details.haz-list')) d.open = true; });
      const haz = await page.evaluate(() => { const d = document.querySelector('#bay details.haz-list'); return d ? d.innerText.replace(/\n+/g, ' | ') : null; });
      console.log('==', JSON.stringify(st), 'gentleHold', on, '\n  readout (folded):', vis, '\n  chips:', chips, '\n  hazard list opened:', haz);
      await ctx.close();
    }
  }
  await b.close();
})();
