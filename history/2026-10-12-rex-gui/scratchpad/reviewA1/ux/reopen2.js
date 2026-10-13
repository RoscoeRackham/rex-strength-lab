const { NEW, launch, DIR, path } = require('./common');
(async () => {
  const b = await launch();
  for (const st of [{ duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus' }, { duoOpen: true, duoAction: 'arm' }]) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(NEW()); await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(8000);
    await page.click('#duo > summary'); await page.waitForTimeout(300);
    await page.click('#tier-chips .chip >> nth=4'); await page.waitForTimeout(1500);
    const dial = await page.textContent('#dial-big');
    await page.evaluate(() => { window.__chg = null; const t0 = performance.now(); window.__t0 = t0; new MutationObserver(() => { if (window.__chg === null) window.__chg = Math.round(performance.now() - window.__t0); }).observe(document.getElementById('duo-bay'), { childList: true, subtree: true }); document.getElementById('duo').open = true; window.__t0 = performance.now(); });
    await page.waitForTimeout(50);
    const shotPath = path.join(DIR, 'shots', 'reopen-stale-' + st.duoAction + '.png');
    const r1 = await page.evaluate(() => ({ chg: window.__chg, fighter: (document.querySelector('#duo-bay .fighter') || {}).textContent }));
    await page.waitForTimeout(5000);
    const r2 = await page.evaluate(() => ({ chg: window.__chg, fighter: (document.querySelector('#duo-bay .fighter') || {}).textContent }));
    console.log(st.duoAction, 'dial now', dial, '| 50 ms after reopening:', JSON.stringify(r1), '| replaced after ms:', r2.chg, JSON.stringify(r2.fighter));
    await page.close();
  }
  await b.close();
})();
