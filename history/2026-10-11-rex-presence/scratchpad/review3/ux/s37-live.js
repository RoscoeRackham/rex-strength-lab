// The screen-reader live region while a two-player search is pending, and after.
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, page } = await open(b, 1280, 900, 'light', { storage: JSON.stringify({ group: 'duo', duoAction: 'catch', cObj: 'car', cStyle: 'hard' }), wait: 50 });
  const log = [];
  for (let i = 0; i < 80; i++) {
    const r = await page.evaluate(() => ({ busy: /working it out|Working out/i.test(document.querySelector('#bay').innerText), live: document.querySelector('#bay-live').textContent.slice(0, 80), verdict: (document.querySelector('#bay .verdict') || {}).textContent.slice(0, 80) }));
    const k = JSON.stringify(r);
    if (!log.length || log[log.length - 1] !== k) log.push(k);
    await page.waitForTimeout(100);
  }
  for (const x of log) console.log(x);
  await ctx.close(); await b.close();
})();
