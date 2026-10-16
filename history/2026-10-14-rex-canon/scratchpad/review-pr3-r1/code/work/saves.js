const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url'), path = require('path');
const U = (n) => pathToFileURL(path.join(__dirname, n + '.html')).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(U('pr3'));
  const read = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1') || 'null'); return { sw: document.getElementById('sw-passenger').checked, saved: s && s.safePassenger, v: s && s.saveV, m: s && s.m, oM: s && s.oM, sum: document.getElementById('powers-sum').textContent }; });
  const loadRaw = async (raw) => { await page.evaluate((x) => { if (x == null) localStorage.clear(); else localStorage.setItem('rex-lab-v1', x); }, raw); await page.reload(); await page.waitForTimeout(1200); return read(); };
  const cases = [
    ['fresh', null],
    ['no mark, sp false', JSON.stringify({ safePassenger: false })],
    ['no mark, sp true', JSON.stringify({ safePassenger: true })],
    ['mark 2, sp false', JSON.stringify({ safePassenger: false, saveV: 2 })],
    ['mark 2, sp true', JSON.stringify({ safePassenger: true, saveV: 2 })],
    ['mark 3, sp false', JSON.stringify({ safePassenger: false, saveV: 3 })],
    ['mark 3, sp true', JSON.stringify({ safePassenger: true, saveV: 3 })],
    ['mark 2, m 3007', JSON.stringify({ m: 3007, oM: 3007, saveV: 2, safePassenger: false })],
    ['mark 3, m 3007', JSON.stringify({ m: 3007, oM: 3007, saveV: 3, safePassenger: false })],
    ['no mark, m 3007', JSON.stringify({ m: 3007, oM: 3007, safePassenger: false })],
    ['mark "3" string, sp false', JSON.stringify({ safePassenger: false, saveV: '3' })],
    ['mark 4, sp false, m 3007', JSON.stringify({ safePassenger: false, saveV: 4, m: 3007 })],
    ['mark 3.0, sp false', '{"safePassenger":false,"saveV":3.0}'],
    ['mark 1, sp false', JSON.stringify({ safePassenger: false, saveV: 1 })],
    ['mark null', JSON.stringify({ safePassenger: false, saveV: null })],
    ['mark 3, sp "no"', JSON.stringify({ safePassenger: 'no', saveV: 3 })],
    ['mark 3, sp 0', JSON.stringify({ safePassenger: 0, saveV: 3 })],
    ['array', '[]'],
    ['number 5', '5'],
    ['string', '"abc"'],
    ['junk', '{not json'],
    ['mark 3 sp false via 2.9999', JSON.stringify({ safePassenger: false, saveV: 2.9999 })],
  ];
  for (const [label, raw] of cases) console.log(label.padEnd(30), JSON.stringify(await loadRaw(raw)));
  // reader's choice: toggle off on this page, reload
  await loadRaw(null);
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  await page.click('#sw-passenger'); await page.waitForTimeout(500);
  console.log('after unticking            ', JSON.stringify(await read()));
  await page.reload(); await page.waitForTimeout(1200);
  console.log('after reload               ', JSON.stringify(await read()));
  await page.reload(); await page.waitForTimeout(1200);
  console.log('after 2nd reload           ', JSON.stringify(await read()));
  // saves from main and PR 2 pages, written by the pages themselves
  for (const src of ['main', 'pr2']) {
    for (const tick of [false, true]) {
      await page.goto(U(src)); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1500);
      await page.evaluate(() => { document.getElementById('powers').open = true; });
      if (tick) { await page.click('#sw-passenger'); await page.waitForTimeout(500); }
      // change something so it saves
      await page.selectOption('#obj', 'person').catch(() => {}); await page.waitForTimeout(800);
      const savedThere = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
      const s = JSON.parse(savedThere);
      await page.goto(U('pr3')); await page.waitForTimeout(1500);
      console.log(('from ' + src + ' sp ' + (tick ? 'ticked on' : 'default')).padEnd(30), 'saved there sp=' + s.safePassenger + ' v=' + s.saveV + ' m=' + s.m, '-> pr3', JSON.stringify(await read()));
    }
  }
  console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
