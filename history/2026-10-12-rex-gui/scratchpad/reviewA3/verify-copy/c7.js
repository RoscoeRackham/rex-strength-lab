const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const st of [{ action: 'walk', walker: 'ollie', oM: 30000 }, { action: 'walk', walker: 'ollie' }]) {
    const { ctx, page } = await open(b, 'branch', st);
    const t = await settle(page, '#bay');
    console.log('== ' + JSON.stringify(st));
    console.log('  duo open:', await page.evaluate(() => document.querySelector('#duo').open));
    for (const line of t.split('\n')) if (/At 3 m|Ollie|30 t|set in|Rex \+ Ollie/.test(line)) console.log('  BAY: ' + line.slice(0, 300));
    console.log('  duo-sum:', await page.evaluate(() => document.querySelector('#duo-sum').innerText), '| ollie-sum:', await page.evaluate(() => document.querySelector('#ollie-sum').innerText));
    console.log('  duo summary visible text:', await page.evaluate(() => document.querySelector('#duo > summary').innerText.replace(/\n/g, ' / ')));
    console.log('  errors:', page.errs);
    await ctx.close();
  }
  await b.close();
})();
