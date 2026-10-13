const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const quick of [true, false]) {
    const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'arm' }, wait: 4000 });
    await page.evaluate(() => { window.__live = []; new MutationObserver(() => window.__live.push(Math.round(performance.now()) + ' ' + document.getElementById('duo-live').textContent.slice(0, 40))).observe(document.getElementById('duo-live'), { childList: true, characterData: true, subtree: true }); });
    await page.click('#tab-collide');
    await page.waitForTimeout(quick ? 200 : 1500);
    await page.click('#duo > summary');   // close
    await page.waitForTimeout(1500);
    const beforeReopen = await page.evaluate(() => window.__live.length);
    await page.click('#duo > summary');   // reopen
    await page.waitForTimeout(3000);
    const r = await page.evaluate(() => ({ live: window.__live, verdict: document.querySelector('#duo-bay .verdict').textContent.slice(0, 40), open: document.getElementById('duo').open }));
    console.log((quick ? 'closed 200 ms after the tab change' : 'closed 1.5 s after the tab change') + ': writes before reopening ' + beforeReopen + ', all writes ' + JSON.stringify(r.live) + ', verdict now "' + r.verdict + '"');
    await page.context().close();
  }
  await b.close();
})();
