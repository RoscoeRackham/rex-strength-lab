const { open } = require('./pg.js');
(async () => {
  const { browser, page, load, text, errs, settle } = await open();
  const cases = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
  const n = +process.argv[3] || 4000, grepRe = process.argv[4] ? new RegExp(process.argv[4], 'i') : null;
  for (const [lab, st, pick] of cases) {
    await load(Object.assign({ duoOpen: true, saveV: 3 }, st));
    if (pick) { await page.selectOption('#duo-effort', pick); await page.waitForTimeout(500); await settle('duo-bay'); await page.waitForTimeout(300); await settle('duo-bay'); }
    let t = await text();
    const i = t.indexOf('What happens when'), j = t.indexOf('Two players') ;
    t = t.slice(Math.max(0, t.indexOf('Just standing\n\n') > 0 ? t.lastIndexOf('Just standing') : 0));
    if (grepRe) t = t.split('\n').filter((l) => grepRe.test(l)).join('\n');
    console.log('===== ' + lab + '\n' + t.slice(0, n));
  }
  console.log('errors', errs);
  await browser.close();
})();
