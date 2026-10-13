const { open, settle } = require('./pw.js');
(async () => {
  for (const [surf, move] of [['ice', 'shove'], ['steel', 'throw']]) {
    const { browser, page, errs } = await open({ duoOpen: true, duoAction: 'wrestle', wrestleMove: move, surface: surf, logKg: 8 });
    await page.selectOption('#duo-effort', 'plaster');
    await settle(page);
    const t = await page.evaluate(() => document.getElementById('duo').innerText);
    console.log('=== ', surf, move);
    console.log(t.split('\n').filter(l => /Effort:|All-out|plaster|no model|ground-wave|doesn’t shake/i.test(l)).slice(0, 10).join('\n'));
    console.log('errs', errs);
    await browser.close();
  }
})();
