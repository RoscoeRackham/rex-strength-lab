const { open } = require('./pw.js');
(async () => {
  for (const st of [{ action: 'stomp' }, { action: 'stomp', surface: 'sand' }, { action: 'stomp', unbreakable: false }]) {
    const { browser, page, errs } = await open(st);
    const t = await page.evaluate(() => document.querySelector('main') ? document.querySelector('main').innerText : document.body.innerText);
    const lines = t.split('\n').filter(l => /Effort|TNT|ground holds|taken back|Energy|Hole|dent|endless ocean|blast|Courtesy/i.test(l));
    console.log('=== ', JSON.stringify(st)); console.log(lines.slice(0, 30).join('\n'));
    console.log('errs', errs);
    await browser.close();
  }
})();
