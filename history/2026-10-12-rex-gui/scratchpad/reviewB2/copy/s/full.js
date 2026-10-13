// dump the whole bay text: node full.js '<state>' '<opts>'
const L = require('./lib.js');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}'), op = JSON.parse(process.argv[3] || '{}');
  const { browser, page, errs } = await L.open(op);
  const id = await L.load(page, st, op);
  const t = await page.evaluate((id) => document.getElementById(id).innerText, id);
  console.log(t);
  if (op.svg) console.log(await page.evaluate((id) => Array.from(document.getElementById(id).querySelectorAll('svg')).length, id));
  if (errs.length) console.log('ERRS', errs);
  await browser.close();
})();
