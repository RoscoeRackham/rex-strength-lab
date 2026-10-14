// usage: const {withPage} = require('./page.js'); await withPage(async (page, load) => { await load(state, effort); ... })
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB1/air';
const html = fs.readFileSync(DIR + '/repo/dist/index.html', 'utf8');
fs.writeFileSync(DIR + '/wrapped.html', '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
async function withPage(fn, width) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: width || 1280, height: 1000 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  const url = 'file://' + DIR + '/wrapped.html';
  await page.goto(url);
  const settle = async () => {
    for (let i = 0; i < 600; i++) {
      const t = await page.evaluate(() => document.body.innerText);
      if (!/working it out|Working out/i.test(t)) return;
      await page.waitForTimeout(200);
    }
  };
  const load = async (st, effort, duoEffort) => {
    await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.goto(url);
    await page.waitForTimeout(300);
    await settle();
    if (effort) { await page.selectOption('#effort', effort); await page.waitForTimeout(200); await settle(); }
    if (duoEffort) { await page.selectOption('#duo-effort', duoEffort); await page.waitForTimeout(200); await settle(); }
  };
  try { await fn(page, load, settle, errs); } finally { await browser.close(); }
  return errs;
}
module.exports = { withPage, DIR };
