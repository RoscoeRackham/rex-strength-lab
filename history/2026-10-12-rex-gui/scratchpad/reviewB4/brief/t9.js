const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  // neutron star density: m = rho * V
  const V = await page.evaluate(() => window.DinoPhys.bodyVolume(3.048, 'rex'));
  for (const rho of [2e4, 1e7, 4e17]) {
    await load(page, { m: rho * V }, 'weight');
    const t = await text(page, 'bay');
    const i = t.indexOf('DENSITY');
    console.log('=== weight rho ' + rho + '\n', t.slice(i + 100, i + 2600).split('\n').filter(l => l.length > 25 || /Ground|holds|stands|sinks/i.test(l)).slice(0, 14).join('\n'));
  }
  console.log(errs);
  await browser.close();
})();
