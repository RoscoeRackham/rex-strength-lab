const run = require('./page.js');
(async () => {
  const base = { duoAction: 'catch', duoOpen: true, cObj: 'bus', cLogD: Math.log10(300), cStyle: 'hard', logKg: 9, inf: false };
  for (const share of [0, 0.5, 0.9]) {
    const r = await run(Object.assign({}, base, { airAbsorb: share }), { duoEffort: 'allout', duo: true });
    console.log('=== share ' + share, r.errs);
    const t = r.duo;
    const i = t.indexOf('All-out');
    console.log(t.slice(Math.max(0, i - 200), i + 7000));
  }
})();
