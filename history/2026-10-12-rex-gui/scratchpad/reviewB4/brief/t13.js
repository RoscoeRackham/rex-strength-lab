const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ surface: 'sand' }, { surface: 'sand', unbreakable: false }]) {
    await load(page, st, 'jump');
    const t = await text(page, 'bay');
    const i = t.indexOf('Adjust effort');
    console.log('=== jump ' + JSON.stringify(st) + '\n', t.slice(i, i + 2500).replace(/\n1 m\n[\s\S]*?Basketball hoop\n[^\n]*\n/, '\n[chart]\n'));
  }
  console.log(errs);
  await browser.close();
})();
