// shared helpers: load the built page into Playwright, set a saved state, wait for it to settle
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SD = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r2/design';
const REPO = process.env.REPO || SD + '/repo/rex-strength-lab';
function preview() {
  const body = fs.readFileSync(REPO + '/dist/index.html', 'utf8');
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const p = SD + '/out/page.html'; fs.writeFileSync(p, html); return pathToFileURL(p).href;
}
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
async function newPage(browser, opts) {
  const pg = await browser.newPage(Object.assign({ viewport: { width: 1280, height: 900 } }, opts || {}));
  pg.errs = [];
  pg.on('pageerror', (e) => pg.errs.push('PAGEERROR ' + e.message));
  pg.on('console', (m) => { if (m.type() === 'error') pg.errs.push(m.text()); });
  await pg.goto(URL);
  return pg;
}
const URL = preview();
const settled = (pg, id) => pg.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
async function load(pg, st, effort) {
  await pg.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await pg.reload();
  await settled(pg, 'bay'); if (st.duoOpen) await settled(pg, 'duo-bay');
  if (effort && await pg.$(st.duoOpen ? '#duo-effort' : '#effort')) {
    const sel = st.duoOpen ? '#duo-effort' : '#effort', bay = st.duoOpen ? 'duo-bay' : 'bay';
    await pg.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay);
    await pg.selectOption(sel, effort);
    await pg.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 30, timeout: 60000 });
    await settled(pg, bay);
  }
}
async function setEffort(pg, bayId, effort) {
  const sel = bayId === 'duo-bay' ? '#duo-effort' : '#effort';
  await pg.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bayId);
  await pg.selectOption(sel, effort);
  await pg.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bayId, { polling: 30, timeout: 60000 });
  await settled(pg, bayId);
}
const glowOf = (pg, sel) => pg.evaluate((q) => { const g = document.querySelector(q); return g ? { hidden: g.hidden, strength: Number(g.dataset.strength), glow: g.style.getPropertyValue('--glow'), grow: g.style.getPropertyValue('--grow'), n: g.children.length, display: getComputedStyle(g).display, opacity: getComputedStyle(g).opacity } : null; }, sel);
const tileOf = (pg, bay, inSel) => pg.evaluate(([b, sel]) => {
  const box = sel ? document.querySelector('#' + b + ' ' + sel) : document.getElementById(b), all = box ? Array.from(box.querySelectorAll('.tile.shimmer')) : [], t = all[0];
  if (!t) return null;
  const tx = (n) => n.textContent.replace(/ /g, ' ');
  const row = t.parentElement; const sibs = Array.from(row.children).map((c) => (c.classList.contains('shimmer') ? '[Shimmer]' : (c.querySelector('.k') || c).textContent.slice(0, 30)));
  return { n: all.length, last: row.classList.contains('tiles') && row.lastElementChild === t, row: sibs, k: tx(t.querySelector('.k')), v: tx(t.querySelector('.v')), s: Array.from(t.querySelectorAll('.s')).map(tx) };
}, [bay, inSel || null]);
module.exports = { SD, REPO, URL, launch, newPage, load, settled, setEffort, glowOf, tileOf };
