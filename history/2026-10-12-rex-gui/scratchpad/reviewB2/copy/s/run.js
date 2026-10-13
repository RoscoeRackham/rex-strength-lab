// usage: node run.js '<state json>' '<opts json>' [label]
const L = require('./lib.js');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}'), op = JSON.parse(process.argv[3] || '{}');
  const { browser, page, errs } = await L.open(op);
  const id = await L.load(page, st, op);
  L.show(process.argv[4] || JSON.stringify(st), await L.read(page, id));
  if (op.sidebar) console.log(await page.evaluate(() => document.getElementById('powers-sum').textContent));
  if (errs.length) console.log('ERRS', errs);
  await browser.close();
})();
