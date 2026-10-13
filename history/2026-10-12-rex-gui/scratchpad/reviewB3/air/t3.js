const run = require('./page.js');
(async () => {
  for (const [kg, share] of [[1e5, 1], [1e5, 0.5], [1e6, 1], [1e7, 0.5], [1e7, 1]]) {
    const r = await run({ action: 'throw', obj: 'car', angle: 45, logKg: Math.log10(kg), airAbsorb: share }, { effort: 'allout' });
    const t = r.solo;
    const lines = t.split('\n').filter((l) => /Air resistance absorbed|No drag|Launch speed|^[\d.,]+ m\/s|Energy in the|flies|Lands at/.test(l));
    console.log('=== kg', kg, 'share', share, r.errs);
    const i = t.indexOf('Launch speed');
    console.log(t.slice(i, i + 300).replace(/\n/g, ' | '));
    for (const l of t.split('\n')) if (/No drag: their power takes back|Air resistance absorbed: their power takes back/.test(l)) console.log(l);
  }
})();
