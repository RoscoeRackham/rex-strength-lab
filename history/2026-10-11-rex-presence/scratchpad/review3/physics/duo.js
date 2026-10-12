const W = require('./pw.js');
const cases = JSON.parse(process.argv[2]);
(async () => {
  for (const st of cases) {
    const p = await W.open(Object.assign({ group: 'duo' }, st));
    const t0 = Date.now();
    await W.waitDone(p, 120000);
    const t = await W.bayText(p);
    const lines = t.split('\n').filter(l => l.trim());
    const verdictIdx = 0;
    console.log('=== ' + JSON.stringify(st) + ' (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
    console.log(lines.filter(l => /Effort|ceiling|At this effort|harm|least|slides|breaks|destroy|crush|caught|catch|throw|press/i.test(l)).slice(0, 14).map(l => '  ' + l.slice(0, 300)).join('\n'));
    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await W.close();
})();
