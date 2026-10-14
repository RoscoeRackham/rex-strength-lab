const { open, settle } = require('./pw.js');
(async () => {
  for (const st of [null, { airAbsorb: 0.5 }]) {
    const { browser, page, errs } = await open(st);
    const t = await page.evaluate(() => document.getElementById('bay').innerText);
    console.log('=== ', JSON.stringify(st));
    console.log(t.split('\n').filter(l => /drag|no air|vacuum/i.test(l)).slice(0, 8).join('\n'));
    const leg = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .ladder-legend')).map(n => n.innerText.replace(/\n/g, ' / ')));
    console.log('legend:', leg);
    const paths = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .viz svg path')).map(p => p.getAttribute('d').slice(-40)));
    console.log('paths ends:', paths);
    await page.screenshot({ path: __dirname + '/v5-' + (st ? 'half' : 'default') + '.png', fullPage: false });
    console.log('errs', errs);
    await browser.close();
  }
})();
