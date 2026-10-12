const W = require('./pw.js');
(async () => {
  for (const st of [{ action: 'throw', obj: 'tank', surface: 'sand', logKg: 7 }, { action: 'throw', obj: 'bus', surface: 'ice' }]) {
    const p = await W.open(st);
    await W.waitDone(p);
    const t = await W.bayText(p);
    console.log('=== ' + JSON.stringify(st));
    console.log(t.split('\n').filter(l => l.trim()).slice(42, 80).map(l => '  ' + l.slice(0, 400)).join('\n'));
    await p.close();
  }
  await W.close();
})();
