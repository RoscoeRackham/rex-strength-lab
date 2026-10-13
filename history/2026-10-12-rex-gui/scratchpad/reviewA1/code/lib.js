const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const S = __dirname;
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
async function launch() { return chromium.launch({ executablePath: CHROME }); }
const url = (f) => pathToFileURL(S + '/' + f).href;
async function settle(page, id, max = 60000) {
  const t0 = Date.now();
  while (Date.now() - t0 < max) {
    const busy = await page.evaluate((id) => { const b = document.getElementById(id); return !b || !b.firstChild || /working it out|Working out/i.test(b.textContent); }, id);
    if (!busy) return true;
    await page.waitForTimeout(200);
  }
  return false;
}
async function text(page, id) { return page.evaluate((id) => { const b = document.getElementById(id); const t = []; const w = (n) => { for (const c of n.childNodes) { if (c.nodeType === 3) t.push(c.textContent); else if (c.nodeType === 1 && !/^(SCRIPT|STYLE|svg)$/i.test(c.tagName)) w(c); } }; w(b); return t.join(' ').replace(/\s+/g, ' ').trim(); }, id); }
module.exports = { launch, url, settle, text, S };
