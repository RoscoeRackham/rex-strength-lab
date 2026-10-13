const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await page.goto('file://' + S + '/branch.html');
  const solo = await page.evaluate(() => Array.from(document.querySelectorAll('#tabs [role=tab]')).map((t) => t.id.slice(4)));
  const duo = [['arm'], ['wrestle', 'throw'], ['wrestle', 'pin'], ['catch'], ['collide']];
  const wm = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay button, #duo-bay [data-move]')).length);
  const res = {}; let pairs = 0, nearPairs = 0;
  for (const s of solo) for (const [d, w] of duo) {
    const st = { action: s, duoAction: d, duoOpen: true }; if (w) st.wrestleMove = w;
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload();
    try { await page.waitForFunction(() => document.querySelector('#duo-bay .verdict'), null, { timeout: 30000 }); } catch (e) { res[s + '+' + d + (w || '')] = 'timeout'; continue; }
    const dups = await page.evaluate(() => { const c = {}; for (const e of document.querySelectorAll('[id]')) c[e.id] = (c[e.id] || 0) + 1; return Object.keys(c).filter((k) => c[k] > 1); });
    pairs++; if (dups.includes('near')) nearPairs++;
    if (dups.length) res[s + '+' + d + (w || '')] = dups.join(',');
  }
  console.log('solo tabs', solo.join(' '));
  console.log(JSON.stringify(res, null, 1));
  console.log('pairs', pairs, 'with near dup', nearPairs);
  await b.close();
})();
