// load a solo state, pick an effort preset, wait for the search, print the verdict and effort readout
const { open, bayText, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const { page, errs } = await open(b, JSON.parse(process.argv[2]));
  const settle = async () => { for (let i = 0; i < 120; i++) { await page.waitForTimeout(400); if (!/working it out|Working out/i.test(await bayText(page))) return; } };
  await settle();
  for (const eff of process.argv.slice(3)) {
    await page.selectOption('#effort', eff);
    await settle();
    await page.evaluate(() => document.querySelectorAll('#bay details.haz-list').forEach((d) => (d.open = true)));
    const t = await bayText(page);
    const lines = t.split('\n').filter((l) => l.trim());
    const vi = lines.findIndex((l) => /^(Effort|All-out)/.test(l));
    console.log('--- effort=' + eff);
    console.log(lines.filter((l, i) => i >= vi - 4 && i <= vi + 12).join('\n'));
  }
  console.log('errs', errs.slice(0, 3));
  await b.close();
})();
