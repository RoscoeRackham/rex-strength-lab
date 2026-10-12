const H = require('./h.js');
(async () => {
  for (const [n, st] of [['walk-sand', { action: 'walk', surface: 'sand' }], ['walk-sand-ollie', { action: 'walk', surface: 'sand', walker: 'ollie' }]]) {
    const p = await H.open(st); await H.waitDone(p); const t = await H.bay(p);
    require('fs').writeFileSync(n + '.txt', t); console.log('==', n); console.log(t.split('\n').slice(15, 45).join('\n'));
    await p.close();
  }
  await H.close();
})();
