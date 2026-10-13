const { open, settle } = require('./lib.js');
const dist = process.argv[2];
(async () => {
  for (const st of JSON.parse(process.argv[3])) {
    const { browser, page, errs } = await open(dist, { tag: 'p9' + process.pid, state: st });
    await page.selectOption('#duo-effort', 'ground'); await page.waitForTimeout(300); await settle(page);
    const dg = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
    const bay = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    const m = bay.match(/[^.]*push still goes into the ground[^.]*\.[^.]*\./);
    console.log(JSON.stringify(st), '\n  read:', dg.slice(0, 700), '\n  bay push:', m ? m[0].slice(0, 300) : '(none)');
    if (errs.length) console.log('ERR', errs);
    await browser.close();
  }
})();
