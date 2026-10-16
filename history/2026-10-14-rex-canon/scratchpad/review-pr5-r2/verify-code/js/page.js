const fs = require('fs'), path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = process.env.REPO || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r2/verify-code/repo/rex-strength-lab';
async function open() {
  const html = fs.readFileSync(R + '/dist/index.html', 'utf8');
  const out = path.join(__dirname, 'preview-' + process.pid + '.html');
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.errs = [];
  page.on('pageerror', (e) => page.errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.errs.push(m.text()); });
  await page.goto(pathToFileURL(out).href);
  const settledOn = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
  const load = async (st, effort) => {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload();
    await settledOn('bay'); if (st.duoOpen) await settledOn('duo-bay');
    if (effort) {
      const sel = st.duoOpen ? '#duo-effort' : '#effort', bay = st.duoOpen ? 'duo-bay' : 'bay';
      await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay);
      const cur = await page.$eval(sel, (x) => x.value);
      if (cur !== effort) {
        await page.selectOption(sel, effort);
        await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 30, timeout: 60000 });
      }
      await settledOn(bay);
    }
  };
  const tile = (bay) => page.evaluate((b) => { const t = document.querySelector('#' + b + ' .tile.shimmer'); return t ? t.textContent.replace(/ /g, ' ') : null; }, bay);
  const text = (bay) => page.evaluate((b) => document.getElementById(b).textContent.replace(/ /g, ' ').replace(/\s+/g, ' '), bay);
  return { browser, page, load, tile, text, settledOn };
}
module.exports = { open };
