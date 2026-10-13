const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const width = Number(process.argv[3] || 1280);
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(process.argv[2]).href);
  const cases = [];
  for (const logKg of [6, 12, 18, 24, 30, 34]) for (const cObj of ['baseball', 'car', 'partner']) cases.push({ duoOpen: true, duoAction: 'catch', logKg, cObj, cLogD: 2, mode: 'comic' });
  for (const logKg of [6, 12, 18, 24, 30, 34]) cases.push({ duoOpen: true, duoAction: 'collide', logKg, mode: 'comic' });
  cases.push({ duoOpen: true, duoAction: 'collide', logKg: 34, colInf: true, mode: 'comic' });
  cases.push({ duoOpen: true, duoAction: 'collide', logKg: 34, colSrc: 'set', colGB: 4, mode: 'comic', m: 1e20, oM: 1e20 });
  for (const st of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(800);
    try { await page.selectOption('#duo-effort', 'allout', { timeout: 3000 }); } catch (e) { console.log('no duo-effort'); }
    await page.waitForTimeout(2500);
    const t = await page.evaluate(() => { const b = document.querySelector('#duo-bay'); if (!b) return []; const txt = b.innerText; return (txt.match(/[^.\n]*(?:frees|Near him that is|near the catch that is|Energy freed at the hit)[^\n]*/g) || []).map(s => s.slice(0, 400)); });
    const sc = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    console.log(JSON.stringify(st), '\n   ', JSON.stringify(t), sc ? 'HSCROLL' : '');
  }
  console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
