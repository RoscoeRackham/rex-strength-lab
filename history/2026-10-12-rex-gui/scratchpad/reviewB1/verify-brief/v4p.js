const { open, settle } = require('./pw.js');
(async () => {
  for (const air of [0, 0.5]) {
    const { browser, page, errs } = await open({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: Math.log10(40), cStyle: 'hard', logKg: 17, airAbsorb: air });
    await page.selectOption('#duo-effort', 'allout').catch(e => console.log('sel fail', e.message));
    await settle(page);
    const t = await page.evaluate(() => document.getElementById('duo').innerText);
    console.log('=== air', air);
    console.log(t.split('\n').filter(l => /fireball|before it reaches|plasma|carried|sweep|Air resistance/i.test(l)).slice(0, 8).join('\n'));
    console.log('errs', errs);
    await browser.close();
  }
})();
