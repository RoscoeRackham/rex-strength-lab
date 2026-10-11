const { open } = require('./harness');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const plan = JSON.parse(process.argv[2]);
  const out = [];
  for (const step of plan) {
    const r = await page.evaluate((s) => { window.__set(s); const x = window.__snap(); delete x.text; return x; }, step);
    out.push(Object.assign({ cfg: step }, r));
  }
  fs.writeFileSync(process.argv[3] || 'extra.json', JSON.stringify({ rows: out }));
  console.log('errs', errs);
  await browser.close();
})();
