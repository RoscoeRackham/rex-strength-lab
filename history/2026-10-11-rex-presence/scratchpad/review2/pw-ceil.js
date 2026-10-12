const { open, bayText, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const rows = [];
  for (const st of JSON.parse(process.argv[2])) {
    const { page } = await open(b, Object.assign({ mode: 'real', inf: true }, st));
    const settle = async () => { const t0 = Date.now(); for (let i = 0; i < 200; i++) { await page.waitForTimeout(200); if (!/working it out|Working out/i.test(await bayText(page))) break; } return Date.now() - t0; };
    await settle();
    await page.evaluate(() => { window.__long = []; });
    const t0 = Date.now();
    await page.selectOption('#effort', 'ceiling');
    const tSel = Date.now() - t0;
    const tSettle = await settle();
    const long = await page.evaluate(() => window.__long);
    rows.push(JSON.stringify(st) + ' select returned ' + tSel + ' ms; settled ' + tSettle + ' ms; long tasks ' + long.length + ' sum ' + long.reduce((a, c) => a + c, 0) + ' max ' + Math.max(0, ...long));
    await page.close();
  }
  console.log(rows.join('\n'));
  await b.close();
})();
