const { open } = require('./pw.js');
(async () => {
  const { browser, page, errs } = await open({ duoOpen: true, duoAction: 'collide', colSrc: 'stomp' });
  const t = await page.evaluate(() => document.getElementById('duo-bay') ? document.getElementById('duo-bay').innerText : document.getElementById('duo').innerText);
  const lines = t.split('\n').filter(l => /Bolted|bolted|no cap|All-out|Just standing|stomp/i.test(l));
  console.log(lines.join('\n'));
  console.log('errs', errs);
  await browser.close();
})();
