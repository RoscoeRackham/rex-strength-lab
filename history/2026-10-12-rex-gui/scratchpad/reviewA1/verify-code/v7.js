const { wrap, open, S } = require('./h.js');
(async () => {
  const url = wrap(S + '/lab/dist/index.html', 'branch.html');
  const { browser, page, errs } = await open(url, { duoOpen: true, duoAction: 'catch', action: 'throw' }, { wait: 4000 });
  await page.evaluate(() => {
    window.__writes = [];
    for (const id of ['bay-live', 'duo-live']) {
      const n = document.getElementById(id);
      new MutationObserver(() => window.__writes.push({ t: Math.round(performance.now()), id, text: n.textContent.slice(0, 70) })).observe(n, { childList: true, characterData: true, subtree: true });
    }
  });
  const before = await page.evaluate(() => ({ rex: document.getElementById('bay-live').textContent.slice(0, 70), live: document.getElementById('bay-live').getAttribute('aria-live') }));
  console.log('Rex live before', JSON.stringify(before));
  await page.selectOption('#c-obj', 'piano').catch(async () => { const v = await page.evaluate(() => Array.from(document.querySelectorAll('#c-obj option')).map((o) => o.value)); console.log('options', v); });
  await page.waitForTimeout(3500);
  console.log('writes after changing only the catch object:', JSON.stringify(await page.evaluate(() => window.__writes), null, 1));
  console.log('errs', errs);
  await browser.close();
})();
