const { wrap, open, S } = require('./h.js');
(async () => {
  const url = wrap(S + '/lab/dist/index.html', 'branch.html');
  for (const st of [{ inf: true, anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'wrestle' }, { logKg: 9, anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'wrestle' }]) {
    const { browser, page, errs } = await open(url, st, { wait: 5000 });
    const r = await page.evaluate(() => ({
      hint: document.getElementById('bolt-rex').closest('.field').querySelector('.hint').textContent,
      boltRex: document.getElementById('bolt-rex').checked,
      verdict: document.querySelector('#duo-bay .verdict').textContent,
      chips: Array.from(document.querySelectorAll('#duo-bay .status-row .status, #duo-bay .status')).map((x) => x.textContent).filter((t) => /bolt|tear/i.test(t)),
    }));
    console.log(JSON.stringify(st)); console.log(JSON.stringify(r, null, 1)); console.log('errs', errs);
    await browser.close();
  }
})();
