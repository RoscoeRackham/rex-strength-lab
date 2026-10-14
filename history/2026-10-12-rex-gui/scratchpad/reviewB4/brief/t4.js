const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const [tab, st] of [['throw', {}], ['jump', {}], ['stomp', {}], ['sprint', {}], ['throw', { surface: 'sand' }], ['stomp', { surface: 'sand' }], ['jump', { surface: 'ice' }]]) {
    await load(page, st, tab);
    await pick(page, '#effort', 'ground', 'bay');
    const t = await text(page, 'bay');
    const i = t.indexOf('Adjust effort');
    console.log('=== ' + tab + ' ' + JSON.stringify(st) + '\n', t.slice(i, i + 1400).split('\n').slice(0, 14).join('\n'));
  }
  console.log(errs);
  await browser.close();
})();
