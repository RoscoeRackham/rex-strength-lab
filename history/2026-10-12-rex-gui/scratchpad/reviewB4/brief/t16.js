const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  const gb = (b) => Math.log10(b / Math.sqrt(1 - b * b));
  for (const st of [{ colSrc: 'set', colGB: gb(0.5) }, { colSrc: 'set', colGB: gb(0.5), anchor: 'bolted' }, { colSrc: 'set', colGB: Math.log10(1000 / 299792458) }]) {
    await load(page, st, 'collide', true);
    const t = await text(page, 'duo-bay');
    const i = t.indexOf('What happens when');
    console.log('=== ' + JSON.stringify(st) + '\n', t.slice(i + 100, i + 3500).split('\n').filter(l => l.length > 3).slice(0, 40).join('\n'));
  }
  console.log(errs);
  await browser.close();
})();
