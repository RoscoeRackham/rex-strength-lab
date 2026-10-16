const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/design/repo/rex-strength-lab';
const W = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/design/work';
function prep(distPath, name) {
  const html = fs.readFileSync(distPath || path.join(REPO, 'dist/index.html'), 'utf8');
  const p = path.join(W, (name || 'page') + '.html');
  fs.writeFileSync(p, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return pathToFileURL(p).href;
}
const settledOn = (pg, id) => pg.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
async function loadOn(pg, st, effort) {
  await pg.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await pg.reload();
  await settledOn(pg, 'bay'); if (st.duoOpen) await settledOn(pg, 'duo-bay');
  if (effort) {
    const sel = st.duoOpen ? '#duo-effort' : '#effort', bay = st.duoOpen ? 'duo-bay' : 'bay';
    if (await pg.$eval(sel, (x) => x.value) !== effort) {
      await pg.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay);
      await pg.selectOption(sel, effort);
      await pg.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 30, timeout: 60000 });
    }
    await settledOn(pg, bay);
  }
}
module.exports = { chromium, prep, loadOn, settledOn, REPO, W, CHROME: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' };
