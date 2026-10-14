const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
async function run(saved, newLog) {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('file://' + S + '/fixed.html');
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), saved);
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#duo-bay .verdict'), null, { timeout: 60000 });
  await page.waitForTimeout(8000);
  const snap = () => page.evaluate(() => { const r = document.querySelector('#duo-bay .effort-read'); const v = document.querySelector('#duo-bay .verdict'); return (r ? r.textContent.slice(0, 70) : '') + ' | ' + (v ? v.textContent.slice(0, 70) : ''); });
  console.log('settled at', saved.logKg, ':', await snap());
  await page.click('#duo > summary'); await page.waitForTimeout(300);
  await page.evaluate((x) => { const s = document.querySelector('#strength'); s.value = String(x); s.dispatchEvent(new Event('input', { bubbles: true })); }, newLog);
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    window.__log = []; const t0 = performance.now();
    const rec = (src) => { const r = document.querySelector('#duo-bay .effort-read'); const v = document.querySelector('#duo-bay .verdict'); const p = document.querySelector('#duo-bay > p.muted');
      window.__log.push([Math.round(performance.now() - t0), src, document.querySelector('#duo').open, v ? ((r ? r.textContent.slice(0, 60) : '') + ' | ' + v.textContent.slice(0, 60)) : (p ? p.textContent : '(none)')]); };
    let n = 0; const loop = () => { rec('raf'); if (++n < 600) requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  });
  await page.click('#duo > summary');
  await page.waitForTimeout(9000);
  const log = await page.evaluate(() => window.__log);
  let last = null, prevT = 0; for (const r of log) { const k = r[2] + '|' + r[3]; if (k !== last) { console.log(JSON.stringify(r)); last = k; } if (r[0] - prevT > 200) console.log('  frame gap', prevT, '->', r[0]); prevT = r[0]; }
  console.log('settled at', newLog, ':', await snap(), errs);
  await b.close();
}
(async () => {
  await run({ duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 6, duoOpen: true }, 9);
  await run({ duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 6, duoOpen: true, mode: 'real' }, 9);
})();
