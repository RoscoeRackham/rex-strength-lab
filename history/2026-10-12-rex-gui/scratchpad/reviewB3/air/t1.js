const run = require('./page.js');
(async () => {
  const base = { action: 'throw', obj: 'baseball', angle: 0, logKg: Math.log10(1.8e23), inf: false };
  for (const [name, extra, effort] of [['allstar100', { airAbsorb: 1 }, 'allout'], ['allstar50', { airAbsorb: 0.5 }, 'allout'], ['allstar0off', { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, 'allout']]) {
    const r = await run(Object.assign({}, base, extra), { effort });
    console.log('=== ' + name, r.errs);
    console.log(r.solo.slice(0, 6000));
  }
})();
