const { open, bayText, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const st = JSON.parse(process.argv[2]);
  const { page, errs, tLoad } = await open(b, st);
  const t0 = Date.now();
  let txt = '';
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(1000); txt = await bayText(page); if (!/Working out|working it out/.test(txt)) break; }
  const tDone = Date.now() - t0;
  await page.waitForTimeout(Number(process.argv[3] || 0));
  const long = await page.evaluate(() => window.__long);
  console.log('load', tLoad, 'ms; settled after', tDone, 'ms; long tasks n=', long.length, 'sum', long.reduce((a, b) => a + b, 0), 'max', Math.max(0, ...long), 'over500', long.filter((x) => x > 500).length);
  console.log('errs', errs.slice(0, 3));
  console.log(txt.split('\n').filter((l) => /Effort|ceiling|Courtesy|Working/.test(l)).slice(0, 6).join('\n'));
  await b.close();
})();
