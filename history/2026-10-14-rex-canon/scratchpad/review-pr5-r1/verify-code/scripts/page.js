const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = process.env.REPO || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/verify-code/repo/rex-strength-lab';
const SCR = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/verify-code/scripts';
async function open() {
  const html = fs.readFileSync(path.join(REPO, 'dist', 'index.html'), 'utf8');
  const prev = path.join(SCR, 'preview-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.errs = []; page.on('pageerror', (e) => page.errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const load = async (st, effort) => {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload();
    await settled('bay'); if (st.duoOpen) await settled('duo-bay');
    if (effort) {
      const sel = st.duoOpen ? '#duo-effort' : '#effort', bay = st.duoOpen ? 'duo-bay' : 'bay';
      const cur = await page.$eval(sel, (s) => s.value);
      if (cur !== effort) {
        await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay);
        await page.selectOption(sel, effort);
        await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 50, timeout: 60000 });
        await settled(bay);
      }
    }
  };
  const tile = (bay) => page.evaluate((b) => { const t = document.querySelector('#' + b + ' .tile.shimmer'); return t ? t.textContent.replace(/ /g, ' ') : null; }, bay);
  const text = (bay) => page.evaluate((b) => document.getElementById(b).textContent.replace(/ /g, ' ').replace(/\s+/g, ' '), bay);
  return { browser, page, load, tile, text };
}
module.exports = { open };
