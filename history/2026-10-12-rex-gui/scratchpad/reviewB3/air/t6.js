const run = require('./page.js');
(async () => {
  const r = await run({ action: 'throw', obj: 'esb', angle: 0, logKg: 20.2844, airAbsorb: 0.86, keepForm: true }, { effort: 'allout' });
  console.log(r.errs);
  for (const l of r.solo.split('\n')) if (/Past about 1%/.test(l)) console.log(l);
})();
