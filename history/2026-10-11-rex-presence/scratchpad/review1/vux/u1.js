const { open, tab, bayText } = require('./lib');
(async () => {
  for (const [saved, t] of [[{ gThrow: 5000, action: 'throw' }, 'throw'], [{ near: 20, action: 'stomp' }, 'stomp'], [{ near: 50, action: 'stomp' }, 'stomp'], [{}, 'stomp'], [{ gJump: 50, action: 'jump' }, 'jump'], [{ gSprint: 50, action: 'sprint' }, 'sprint']]) {
    const { browser, page, errs } = await open({ saved });
    await tab(page, t, false, 2500);
    const sel = await page.$eval('#effort', (e) => e.value);
    const txt = await bayText(page);
    const i = txt.indexOf('Effort:') >= 0 ? txt.indexOf('Effort:') : txt.indexOf('All-out:');
    console.log('=== ', JSON.stringify(saved), 'select=', sel);
    const v = await page.$eval('#bay .verdict', (e) => e.innerText);
    console.log('VERDICT:', v);
    console.log(txt.slice(i, i + 900));
    console.log(errs);
    await browser.close();
  }
})();
