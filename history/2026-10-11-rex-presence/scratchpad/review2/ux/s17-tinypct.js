const { launch, open } = require('./lib');
(async () => {
  const b = await launch();
  for (const st of [{ group: 'solo', action: 'throw', logKg: 20 }, { group: 'solo', action: 'pull', logKg: 25 }, { group: 'solo', action: 'stomp', logKg: 15 }, { group: 'duo', duoAction: 'arm', logKg: 20 }, { group: 'solo', action: 'throw', logKg: 10 }]) {
    const { ctx, page } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(st), wait: 1000 });
    for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText)))) break; }
    await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details')) d.open = true; });
    const t = await page.evaluate(() => document.querySelector('.effort-read').innerText.split('\n').filter(Boolean).slice(0, 6));
    console.log(JSON.stringify(st)); for (const l of t) console.log('   ', l);
    await ctx.close();
  }
  await b.close();
})();
