const { open } = require('./pw.js');
(async () => {
  const W = await open(process.argv[2]);
  const kg = await W.page.evaluate(() => window.DINO_DATA.tiers.find((t) => t.id === 'human').liftKg);
  await W.load({ action: 'throw', build: 'human', H: 2, m: 180, logKg: Math.log10(kg), obj: 'shot', angle: 37 });
  const t = await W.page.evaluate(() => Array.from(document.querySelectorAll('#bay .callout')).map((n) => n.textContent).find((x) => /Reality check/.test(x)));
  console.log('default powers:', t);
  await W.load({ action: 'throw', build: 'human', H: 2, m: 180, logKg: Math.log10(kg), obj: 'shot', angle: 37, airAbsorb: 0 });
  const t0 = await W.page.evaluate(() => Array.from(document.querySelectorAll('#bay .callout')).map((n) => n.textContent).find((x) => /Reality check/.test(x)));
  console.log('air 0%:', t0);
  console.log('errors', W.errs);
  await W.close();
})();
