const run = require('./page.js');
(async () => {
  const base = { duoAction: 'catch', duoOpen: true, cObj: 'baseball', cLogD: 3, cStyle: 'hard', oAnchor: 'bolted' };
  for (const [name, extra] of [['allstar99', { logKg: Math.log10(1.81e23), airAbsorb: 0.99 }], ['allstar100', { logKg: Math.log10(1.81e23), airAbsorb: 1 }], ['1e27_100', { logKg: 27, airAbsorb: 1 }], ['inf_100', { inf: true, airAbsorb: 1 }]]) {
    const r = await run(Object.assign({}, base, extra), { duoEffort: 'allout', duo: true });
    console.log('=== ' + name, r.errs);
    const t = r.duo;
    const i = t.indexOf('VS');
    const lines = t.slice(i).split('\n').filter((l) => /fires|Stopping it|sheath|Energy|Throw|arrives|carries|kg·m\/s|Catch force|TNT/.test(l));
    console.log(lines.slice(0, 25).join('\n'));
  }
})();
