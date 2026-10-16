const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/verify-copy';
const LAB = ROOT + '/repo/rex-strength-lab';
async function open(w) {
  const body = fs.readFileSync(LAB + '/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = ROOT + '/scripts/page.html'; fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: w || 1280, height: 900 } });
  page.errs = []; page.on('pageerror', (e) => page.errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') page.errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const load = async (st, effort) => {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload();
    await settled('bay'); if (st.duoOpen) await settled('duo-bay');
    if (effort) {
      const sel = st.duoOpen ? '#duo-effort' : '#effort', bay = st.duoOpen ? 'duo-bay' : 'bay';
      await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay);
      await page.selectOption(sel, effort);
      await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 50, timeout: 60000 });
      await settled(bay);
    }
  };
  const text = (sel) => page.evaluate((q) => { const n = document.querySelector(q); return n ? n.innerText.replace(/ /g, ' ') : null; }, sel);
  return { browser, page, load, text, settled };
}
module.exports = { open, LAB, ROOT };
