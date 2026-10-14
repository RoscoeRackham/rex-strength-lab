const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const prev = path.join(process.argv[3], 'preview.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const W = Number(process.argv[4] || 390);
  const page = await browser.newPage({ viewport: { width: W, height: 844 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const res = [];
  const cases = []; const XTRA = { airAbsorb: 0, keepForm: false };
  for (const m of []) for (const gb of [-2, 0, 2, 4]) cases.push({ duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: gb, m, oM: m, logKg: 34 });
  cases.push({ duoOpen: true, duoAction: 'collide', colSrc: 'set', colInf: true, m: 1e20, oM: 1e20, logKg: 34 });
  for (const obj of ['baseball', 'car', 'everest', 'moon']) for (const d of [1, 3, 5, 7]) for (const lk of [8, 14, 20, 26, 34]) cases.push(Object.assign({ duoOpen: true, duoAction: 'catch', cObj: obj, cStyle: 'hard', cLogD: d, logKg: lk, cMiss: false }, XTRA));
  for (const obj of ['baseball', 'car']) for (const d of [3, 6]) cases.push(Object.assign({ duoOpen: true, duoAction: 'catch', cObj: obj, cStyle: 'hard', cLogD: d, logKg: 34, cMiss: true }, XTRA));
  for (const st of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(500);
    try { await settle(page, 'duo-bay'); } catch (e) { res.push({ st, err: 'timeout' }); continue; }
    await page.selectOption('#duo-effort', 'allout').catch(() => {}); await page.waitForTimeout(400);
    try { await settle(page, 'duo-bay'); } catch (e) { res.push({ st, err: 'timeout2' }); continue; }
    const r = await page.evaluate(() => {
      const bay = document.getElementById('duo-bay');
      const t = bay.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ');
      const hits = t.match(/[^.·]*(?:beyond the ladder|the same as|\d× (?:the|a|an|Usain|Castle|SN|Earth|Jupiter)|% of (?:the|a|an|Usain|Castle|SN|Earth|Jupiter))[^.·]*/g) || [];
      const tiles = Array.from(bay.querySelectorAll('.tile')).map((x) => ({ w: x.scrollWidth - x.clientWidth, t: x.textContent })).filter((x) => x.w > 0);
      return { hits, tileOvf: tiles, ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    res.push({ st, ...r });
  }
  fs.writeFileSync(path.join(process.argv[3], 'duo2-' + W + '.json'), JSON.stringify({ res, errs }, null, 1));
  await browser.close(); console.log('done', errs.length);
})().catch((e) => { console.error(e); process.exit(1); });
