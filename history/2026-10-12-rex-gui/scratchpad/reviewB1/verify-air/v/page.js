const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
const html = fs.readFileSync(DIR + '/repo/dist/index.html', 'utf8');
fs.writeFileSync(DIR + '/page.html', '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
async function withPage(fn, width) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: width || 1280, height: 1000 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  const url = 'file://' + DIR + '/page.html';
  await page.goto(url);
  const settle = async () => {
    await page.waitForTimeout(250);
    for (let i = 0; i < 900; i++) {
      const t = await page.evaluate(() => document.body.innerText);
      if (!/working it out|Working out/i.test(t)) return;
      await page.waitForTimeout(200);
    }
    throw new Error('never settled');
  };
  const load = async (st, effort, duoEffort) => {
    await page.evaluate((s) => { localStorage.clear(); if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.goto(url);
    await settle();
    if (effort) { await page.selectOption('#effort', effort); await settle(); }
    if (duoEffort) { await page.selectOption('#duo-effort', duoEffort); await settle(); }
  };
  try { await fn(page, load, settle, errs); } finally { await browser.close(); }
  return errs;
}
const grab = (t, start, n) => { const i = t.indexOf(start); return i < 0 ? '(not found: ' + start + ')' : t.slice(i, i + (n || 900)); };
module.exports = { withPage, DIR, grab };
