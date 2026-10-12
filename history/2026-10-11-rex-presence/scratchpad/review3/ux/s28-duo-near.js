// The two-player courtesy ceiling depends on 'Nearest people and buildings', but is that field on the two-player tabs?
const { launch, open, OUT } = require('./lib');
const busy = (page) => page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
(async () => {
  const b = await launch();
  for (const near of [5, 20]) {
    const { ctx, page } = await open(b, 390, 844, 'light', { wait: 500, storage: JSON.stringify({ group: 'duo', duoAction: 'collide', near }) });
    for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details')) d.open = true; });
    const r = await page.evaluate(() => ({ nearField: !!document.querySelector('#bay #near'), fields: [...document.querySelectorAll('#bay .bay-controls label')].map((l) => l.textContent.trim()).filter(Boolean), read: document.querySelector('#bay .effort-read').innerText.replace(/\n+/g, ' | ') }));
    console.log('saved near', near, '| near field on the tab:', r.nearField, '| labels:', JSON.stringify(r.fields), '\n   readout:', r.read);
    await ctx.close();
  }
  await b.close();
})();
