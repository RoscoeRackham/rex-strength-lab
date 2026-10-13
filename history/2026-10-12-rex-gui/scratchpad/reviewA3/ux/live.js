const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'arm', action: 'throw' }, wait: 4000 });
  await page.evaluate(() => { window.__live = []; for (const id of ['bay-live', 'duo-live']) new MutationObserver(() => window.__live.push(id + ': ' + document.getElementById(id).textContent.slice(0, 50))).observe(document.getElementById(id), { childList: true, characterData: true, subtree: true }); });
  const step = async (label, fn, ms = 2500) => { await page.evaluate(() => { window.__live = []; }); await fn(); await page.waitForTimeout(ms); console.log(label, JSON.stringify(await page.evaluate(() => window.__live))); };
  await step('Rex tab Jump', () => page.click('#tab-jump'));
  await step('duo tab Catch', () => page.click('#tab-catch'), 5000);
  await step('strength chip', () => page.click('#tier-chips .chip:nth-child(2)'), 5000);
  await step('Ollie height 4', async () => { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.fill('#o-height', '4'); await page.press('#o-height', 'Enter'); }, 5000);
  await step('close element, then strength chip', async () => { await page.click('#duo > summary'); await page.waitForTimeout(300); await page.click('#tier-chips .chip:nth-child(3)'); }, 4000);
  await step('reopen', () => page.click('#duo > summary'), 5000);
  console.log(page.errs);
  await b.close();
})();
