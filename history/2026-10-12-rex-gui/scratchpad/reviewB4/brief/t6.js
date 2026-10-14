const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{}, { anchor: 'bolted' }, { anchor: 'bolted', colSrc: 'jump', logKg: 6 }, { colSrc: 'jump' }]) {
    for (const e of ['plaster', 'rattle', 'ground']) {
      await load(page, st, 'collide', true);
      await pick(page, '#duo-effort', e, 'duo-bay');
      const t = await text(page, 'duo-bay');
      const i = t.indexOf('What happens when');
      console.log('=== collide ' + e + ' ' + JSON.stringify(st) + '\n', t.slice(i + 100, i + 1600).split('\n').slice(0, 12).join('\n'));
    }
  }
  console.log(errs);
  await browser.close();
})();
