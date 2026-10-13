const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('file://' + S + '/branch.html');
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 6, duoOpen: true })));
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#duo-bay .verdict'), null, { timeout: 60000 });
  await page.waitForTimeout(3000);
  const v1 = await page.evaluate(() => document.querySelector('#duo-bay .verdict').textContent);
  console.log('open, logKg 6 :', v1.slice(0, 140));
  // close the element
  await page.click('#duo > summary'); await page.waitForTimeout(500);
  console.log('closed?', await page.evaluate(() => !document.querySelector('#duo').open));
  // move strength dial to 9 while closed
  await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = '9'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.waitForTimeout(2000);
  console.log('saved logKg', await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).logKg));
  // reopen, sampling what is in the bay each frame and with timers
  await page.evaluate(() => {
    window.__log = []; const t0 = performance.now(); window.__t0 = t0;
    const rec = (src) => { const v = document.querySelector('#duo-bay .verdict'); const p = document.querySelector('#duo-bay > p.muted'); window.__log.push([Math.round(performance.now() - t0), src, document.querySelector('#duo').open, v ? v.textContent.slice(0, 90) : (p ? p.textContent : '(none)')]); };
    let n = 0; const loop = () => { rec('raf'); if (++n < 400) requestAnimationFrame(loop); }; requestAnimationFrame(loop);
    document.querySelector('#duo').addEventListener('toggle', () => rec('toggle-listener(after page handler)'), { once: true });
    window.__rec = rec;
  });
  await page.click('#duo > summary');
  await page.waitForTimeout(100);
  await page.screenshot({ path: S + '/reopen-100ms.png', clip: { x: 0, y: 0, width: 1280, height: 900 } });
  await page.waitForTimeout(6000);
  const log = await page.evaluate(() => window.__log);
  // collapse consecutive identical texts
  let last = null; for (const r of log) { const k = r[2] + '|' + r[3]; if (k !== last) { console.log(JSON.stringify(r)); last = k; } }
  console.log('final:', log[log.length - 1]);
  console.log('errors', errs);
  await b.close();
})();
