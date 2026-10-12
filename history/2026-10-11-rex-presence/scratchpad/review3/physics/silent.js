const W = require('./pw.js');
(async () => {
  for (const act of ['punch','clap']) {
  const p = await W.open({ action: act, silentStrike: true });
  await W.waitDone(p);
  const t = await W.bayText(p);
  console.log('=== '+act); console.log(t.split('\n').filter(l => /Effort:|Silent|absorbed|thump|Mach|fist|hands|speed of sound|heat/i.test(l)).slice(0, 14).map(l => '  ' + l.slice(0, 300)).join('\n'));
  await p.close(); }
  await W.close();
})();
