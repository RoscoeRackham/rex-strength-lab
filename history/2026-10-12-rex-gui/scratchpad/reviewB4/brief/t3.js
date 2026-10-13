const { open, load, text, pick } = require('./pg.js');
const lg = Math.log10(200e18 * 907.18474);
(async () => {
  const { browser, page, errs } = await open();
  for (const [s, kf] of [[1, true], [0.5, true], [0.5, false], [0, true], [0, false]]) {
    await load(page, { obj: 'allstar', angle: 0, logKg: lg, airAbsorb: s, keepForm: kf }, 'throw');
    await pick(page, '#effort', 'allout', 'bay');
    const t = await text(page, 'bay');
    const i = t.indexOf('Adjust effort');
    console.log('=== share', s, 'keepForm', kf, '\n', t.slice(i, i + 4500).replace(/\n0\n[\s\S]*?top [^\n]*\n/, '\n[chart]\n'));
  }
  console.log(errs);
  await browser.close();
})();
