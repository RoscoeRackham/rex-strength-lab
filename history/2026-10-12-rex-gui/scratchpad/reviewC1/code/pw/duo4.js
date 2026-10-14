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
  for (const m of [3e20, 1e21, 3e21]) cases.push({ duoOpen: true, duoAction: 'collide', logKg: 34, colSrc: 'set', colGB: 4, mode: 'comic', m, oM: m });
  for (const H of [50, 500]) cases.push({ duoOpen: true, duoAction: 'collide', logKg: 34, colSrc: 'set', colGB: 4, mode: 'comic', H, oH: H, m: 1e24, oM: 1e24 });
  for (const st of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(800);
    try { await page.selectOption('#duo-effort', 'allout', { timeout: 3000 }); } catch (e) { console.log('no duo-effort'); }
    await page.waitForTimeout(2500);
    const t = await page.evaluate((shorts) => { const b = document.querySelector('#duo-bay'); if (!b) return []; const out = []; for (const tile of b.querySelectorAll('.tile')) { const s = tile.textContent; if (/Energy freed/.test(s)) out.push('TILE: ' + Array.from(tile.children).map(c => c.textContent).join(' | ')); } for (const li of b.querySelectorAll('li, p')) { const s = li.textContent; if (shorts.some(x => s.includes(x)) || /beyond the ladder|no energy to compare/.test(s)) out.push('TEXT: ' + s.slice(0, 500)); } return out; }, await page.evaluate(() => window.DINO_DATA.energyRefs.map(e => e.short)));
    const sc = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    console.log(JSON.stringify(st), '\n   ', JSON.stringify(t), sc ? 'HSCROLL' : '');
  }
  console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
