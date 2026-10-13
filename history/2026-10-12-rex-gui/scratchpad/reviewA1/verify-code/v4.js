const { wrap, open, S } = require('./h.js');
(async () => {
  for (const [name, dir] of [['branch', 'lab'], ['B3', 'labB3']]) {
    const url = wrap(S + '/' + dir + '/dist/index.html', name + '.html');
    const { browser, page, errs } = await open(url, null, { wait: 2500 });
    const r = await page.evaluate(() => ({ ollieInAside: !!document.querySelector('aside.panel-controls #ollie-setup'), ollieInDuo: !!document.querySelector('#duo #ollie-setup'), oHeightInAside: !!document.querySelector('aside.panel-controls #o-height'),
      asideSections: Array.from(document.querySelector('aside.panel-controls').children).map((n) => n.id || n.tagName) }));
    console.log(name, JSON.stringify(r), 'errs', errs.length);
    await browser.close();
  }
})();
