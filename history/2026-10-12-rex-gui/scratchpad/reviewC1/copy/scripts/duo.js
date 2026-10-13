const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: Number(process.argv[2]||1280), height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type()==='error') errs.push(m.text()); });
  await page.goto(url);
  const RE = /(about|roughly) the same as|[\d.]+× |[\d.]+% of |beyond the ladder/;
  const seen = new Set();
  const cases = [];
  for (const logKg of [12, 16, 20, 24, 28, 32, 34]) for (const cObj of ['baseball','car']) for (const cStyle of ['hard']) for (const cLogD of [1, 4, 7]) cases.push({ duoOpen: true, duoAction: 'catch', logKg, cObj, cStyle, cLogD, mode: 'comic' });
  for (const colGB of [-2, 0, 1, 2, 3, 4]) for (const m of [3007, 1e10, 1e20]) cases.push({ duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB, m, oM: m, colBounce: 'splat' });
  for (const st of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(300);
    try { await page.selectOption('#duo-effort', 'allout'); } catch (e) {}
    await page.waitForTimeout(300); await settle(page, 'duo-bay');
    const sents = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const out = [];
      for (const n of b.querySelectorAll('.happens li, .tile, .verdict, .callout')) out.push(n.innerText.replace(/\s+/g,' ')); return out; });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    for (const s of sents) if (RE.test(s) && /J|TNT/.test(s)) { const key = s.replace(/[\d.,]+/g,'#'); if (!seen.has(key)) { seen.add(key); console.log(JSON.stringify(st), sw?'OVERFLOW '+sw:'', '\n   ', s.slice(0, 700)); } }
  }
  console.log('errors', errs);
  await browser.close();
})();
