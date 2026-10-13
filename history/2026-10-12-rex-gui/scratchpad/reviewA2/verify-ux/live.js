// Watch #duo-live. Open on Arm wrestle, click Collide, close the element after `closeAfter` ms (by clicking its summary),
// wait 1.5 s, reopen it, wait 3 s. Print every write to the live region with its time and whether #duo was open then.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const dir = __dirname;
const f = process.argv[2] || 'branch.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const closeAfter of [100, 200, 400, 1500]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(() => { try { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })); sessionStorage.setItem('x', '1'); } } catch (e) {} });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('file://' + path.join(dir, f));
    await page.waitForFunction(() => { const v = document.querySelector('#duo-bay .verdict'); return v && v.textContent.length > 10; }, null, { timeout: 60000 });
    await page.waitForTimeout(1500); // let the first announcement land
    await page.evaluate(() => {
      window.__w = []; window.__t0 = performance.now();
      new MutationObserver(() => { const t = document.getElementById('duo-live').textContent; window.__w.push({ t: Math.round(performance.now() - window.__t0), open: document.getElementById('duo').open, hiddenToAT: getComputedStyle(document.getElementById('duo-live')).display + '/' + (document.getElementById('duo-live').checkVisibility ? document.getElementById('duo-live').checkVisibility() : '?'), text: t.slice(0, 60) }); })
        .observe(document.getElementById('duo-live'), { childList: true, characterData: true, subtree: true });
    });
    const before = await page.$eval('#duo-live', (n) => n.textContent.slice(0, 60));
    await page.click('#tab-collide');
    const tClick = await page.evaluate(() => Math.round(performance.now() - window.__t0));
    await page.waitForTimeout(closeAfter);
    await page.click('#duo > summary', { position: { x: 5, y: 5 } });
    const tClose = await page.evaluate(() => ({ t: Math.round(performance.now() - window.__t0), open: document.getElementById('duo').open }));
    await page.waitForTimeout(1500);
    await page.click('#duo > summary', { position: { x: 5, y: 5 } });
    const tOpen = await page.evaluate(() => ({ t: Math.round(performance.now() - window.__t0), open: document.getElementById('duo').open }));
    await page.waitForTimeout(3000);
    const res = await page.evaluate(() => ({ writes: window.__w, verdict: (document.querySelector('#duo-bay .verdict') || {}).textContent }));
    console.log(`${f} closeAfter=${closeAfter}ms: live before=${JSON.stringify(before)} clickDoneAt=${tClick} close=${JSON.stringify(tClose)} reopen=${JSON.stringify(tOpen)}`);
    for (const w of res.writes) console.log('   write', JSON.stringify(w));
    const reopenedWrites = res.writes.filter((w) => w.t > tOpen.t);
    console.log(`   writes after reopening: ${reopenedWrites.length}; verdict now: ${JSON.stringify((res.verdict || '').slice(0, 60))}; errs=${errs.length}`);
    await ctx.close();
  }
  await browser.close();
})();
