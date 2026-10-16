const run = require('./page.js');
(async () => {
  const base = { duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 16, cLogD: 4.5, saveV: 3 };
  const res = await run([
    { name: 'air 1', state: Object.assign({}, base, { airAbsorb: 1 }), effort: 'allout' },
    { name: 'air 0.999', state: Object.assign({}, base, { airAbsorb: 0.999 }), effort: 'allout' },
    { name: 'inf air 1', state: { duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, inf: true, cLogD: 4.5, saveV: 3 }, effort: 'allout' },
    { name: 'logKg 34 air 1', state: Object.assign({}, base, { logKg: 34 }), effort: 'allout' },
  ]);
  for (const r of res) {
    const m = r.text.match(/Rex fires the person[\s\S]{0,1600}?(No catch|Show the math)/);
    console.log('###', r.name, '\n', m ? m[0] : r.text.slice(0, 1500));
    const ef = r.text.match(/Effort:[\s\S]{0,1200}/); console.log('  EFFORT:', ef && ef[0].slice(0, 1200));
    console.log('  SP mentions:', (r.text.match(/Safe passenger[^.]*\./g) || []).slice(0,4));
  }
})();
