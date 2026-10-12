const H = require('./h.js');
(async () => {
  const combos = JSON.parse(process.argv[2]);
  for (const st of combos) {
    const p = await H.open(Object.assign({ action: 'walk', group: 'solo' }, st));
    if (st._step != null) { await p.evaluate((v) => { const s = document.querySelector('#step-effort'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, st._step); await p.waitForTimeout(300); }
    const t = await H.bay(p);
    const lines = t.split('\n');
    const start = lines.findIndex((l) => /^At |too heavy|sinks into|doesn’t model/.test(l));
    console.log('==================== ' + JSON.stringify(st));
    console.log(lines.slice(start).filter((l) => !/^(1|10|100) (m|km)$|µm\/s$|^\d+ (mm|m)\/s$|^0\.1 mm\/s$/.test(l)).join('\n').replace(/Show the math[\s\S]*/, ''));
    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
