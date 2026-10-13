// harness: wrap a dist/index.html into a page under scratch and give helpers
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = path.join(__dirname, '..');
function wrap(src, name) {
  const html = fs.readFileSync(src, 'utf8');
  const out = path.join(S, 'pages', name + '.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return pathToFileURL(out).href;
}
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
async function readResult(page, bayId) {
  return page.evaluate((id) => {
    const bay = document.getElementById(id);
    const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
    const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq') };
  }, bayId);
}
async function settle(page, bayId, maxMs = 40000) {
  const t0 = Date.now();
  await page.waitForTimeout(300);
  while (Date.now() - t0 < maxMs) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), bayId);
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}
module.exports = { wrap, launch, readResult, settle, S };
