// usage: node pw.js <dist/index.html> ; probes the Shimmer tile in states
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SRC = process.argv[2] || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/code/repo/rex-strength-lab/dist/index.html';
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(SRC, 'utf8') + '</body></html>';
const out = path.join(__dirname, 'page-' + path.basename(path.dirname(path.dirname(SRC))) + '.html'); fs.writeFileSync(out, wrapped);
module.exports = async function run(fn) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(out).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const load = async (st, effort) => {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload();
    await settled('bay'); if (st.duoOpen) await settled('duo-bay');
    if (effort) { const sel = st.duoOpen ? '#duo-effort' : '#effort', bay = st.duoOpen ? 'duo-bay' : 'bay';
      await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.old = true; }, bay);
      await page.selectOption(sel, effort);
      await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.old), bay, { polling: 50, timeout: 60000 });
      await settled(bay); }
  };
  const tile = (bay) => page.evaluate((b) => { const t = document.querySelector('#' + b + ' .tile.shimmer'); return t ? Array.from(t.children).map((c) => c.textContent.replace(/ /g, ' ')) : null; }, bay);
  const text = (bay) => page.evaluate((b) => document.getElementById(b).textContent.replace(/ /g, ' ').replace(/\s+/g, ' '), bay);
  const glow = (sel) => page.evaluate((q) => { const g = document.querySelector(q); return g ? { hidden: g.hidden, s: g.dataset.strength, glow: g.style.getPropertyValue('--glow') } : null; }, sel);
  try { await fn({ page, load, tile, text, glow, settled }); } finally { if (errs.length) console.log('PAGE ERRORS', errs.slice(0, 3)); await browser.close(); }
};
