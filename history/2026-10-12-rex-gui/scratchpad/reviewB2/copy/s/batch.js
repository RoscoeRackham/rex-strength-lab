// usage: node batch.js cases.json > out.txt ; cases: [{label, state, effort, duoEffort, duo, sidebar}]
const L = require('./lib.js'), fs = require('fs');
(async () => {
  const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const { browser, page, errs } = await L.open({});
  for (const c of cases) {
    errs.length = 0;
    const id = await L.load(page, c.state, c);
    L.show(c.label, await L.read(page, id));
    if (c.sidebar) console.log('powers-sum: ' + await page.evaluate(() => document.getElementById('powers-sum').textContent));
    if (errs.length) console.log('ERRS', errs);
  }
  await browser.close();
})();
