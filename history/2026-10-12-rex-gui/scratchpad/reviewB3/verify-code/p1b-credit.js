const { open } = require('./lib.js');
(async () => {
  for (const [name, st] of [['default', null], ['baseball', { obj: 'baseball' }], ['sand', { surface: 'sand' }], ['bolted', { anchor: 'bolted' }]]) {
    const { browser, page } = await open(null, { state: st, tag: 'credit' });
    const lis = await page.evaluate(() => Array.from(document.querySelectorAll('.haz-list li')).map((l) => l.textContent));
    console.log('== ' + name); lis.forEach((l) => console.log('  - ' + l));
    await browser.close();
  }
})();
