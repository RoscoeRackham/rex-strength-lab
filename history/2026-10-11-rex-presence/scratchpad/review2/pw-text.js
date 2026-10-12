const { open, bayText, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const { page, errs, tLoad } = await open(b, JSON.parse(process.argv[2]), { w: Number(process.argv[4] || 1280) });
  for (let i = 0; i < 120; i++) { await page.waitForTimeout(500); if (!/working it out|Working out/i.test(await bayText(page))) break; }
  if (process.argv[3]) await page.waitForTimeout(Number(process.argv[3]));
  console.log('load', tLoad, 'errs', errs.slice(0, 3));
  console.log((await bayText(page)).slice(0, Number(process.env.N || 3000)));
  await b.close();
})();
