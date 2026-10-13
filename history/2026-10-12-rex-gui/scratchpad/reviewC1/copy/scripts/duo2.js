const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type()==='error') errs.push(m.text()); });
  await page.goto(url);
  const RE = /(Stopping it at .* frees|Near him that is|near the catch that is)/;
  const cases = [];
  for (const logKg of [16, 20, 24, 28, 34]) for (const cObj of ['baseball','car']) for (const cLogD of [0, 1, 2]) for (const airAbsorb of [0, 1]) for (const keepForm of [false, true]) cases.push({ duoOpen: true, duoAction: 'catch', logKg, cObj, cStyle: 'hard', cLogD, mode: 'comic', airAbsorb, keepForm });
  let n = 0;
  for (const st of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(250);
    try { await page.selectOption('#duo-effort', 'allout'); } catch (e) {}
    await page.waitForTimeout(250); await settle(page, 'duo-bay');
    const sents = await page.evaluate(() => Array.from(document.getElementById('duo-bay').querySelectorAll('.happens li')).map(n => n.innerText.replace(/\s+/g,' ')));
    const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    for (const s of sents) if (RE.test(s)) { n++; if (n < 14) console.log(JSON.stringify(st), sw?'OVERFLOW '+sw:'', '\n   ', s.slice(0, 600)); }
  }
  console.log('found', n, 'errors', errs);
  await browser.close();
})();
