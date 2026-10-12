const H = require('./h.js');
(async () => {
  const cases = [
    ['walk-default', { action: 'walk' }],
    ['stomp-default', { action: 'stomp' }],
    ['jump-sand', { action: 'jump', surface: 'sand' }],
    ['jump-concrete', { action: 'jump' }],
  ];
  for (const [name, st] of cases) {
    const p = await H.open(st);
    await H.waitDone(p);
    const t = await H.bay(p);
    require('fs').writeFileSync(name + '.txt', t + '\nERRS ' + JSON.stringify(p.errs));
    console.log('==', name, t.length);
    await p.close();
  }
  await H.close();
})();
