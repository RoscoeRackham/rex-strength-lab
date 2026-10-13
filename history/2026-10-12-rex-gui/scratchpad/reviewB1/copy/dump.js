// node dump.js '<json array of specs>'  spec: {state, tab, duo, effort, label}
const H = require('./h.js');
(async () => {
  const specs = JSON.parse(process.argv[2]);
  for (const s of specs) {
    const p = await H.open({ state: s.state, w: s.w, h: s.h });
    await H.tab(p, s.tab, s.duo);
    if (s.pre) { await p.evaluate(s.pre); await H.settle(p); }
    if (s.effort) await H.setEffort(p, s.effort, s.duo);
    const t = await H.text(p, s.duo ? '#duo-bay' : '#bay');
    console.log('=========== ' + (s.label || JSON.stringify(s)));
    console.log(t);

    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
