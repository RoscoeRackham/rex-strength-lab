const H = require('./h.js');
(async () => {
  const p = await H.open({ action: 'jump', surface: 'sand', logKg: 6 });
  await H.waitDone(p, 90000); const t = await H.bay(p);
  require('fs').writeFileSync('jump-sand-1e6.txt', t);
  console.log(t.split('\n').filter((l) => /jump|Ground|ceiling|Courtesy|gives|crater|footprint|Effort|least|harm|ground/i.test(l)).slice(0, 30).join('\n'));
  await p.close(); await H.close();
})();
