// helper: wrap a dist/index.html into a page and open it
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const S = __dirname;
function wrap(src, name) {
  const html = fs.readFileSync(src, 'utf8');
  const out = path.join(S, name);
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return pathToFileURL(out).href;
}
async function settle(page, id) {
  for (let i = 0; i < 160; i++) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id);
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}
async function readResult(page, bayId) {
  return page.evaluate((id) => {
    const bay = document.getElementById(id);
    const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
    const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq') };
  }, bayId);
}
module.exports = { chromium, CHROME, wrap, settle, readResult, S };
