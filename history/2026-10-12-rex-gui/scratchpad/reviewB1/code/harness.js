const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = path.join(__dirname, 'pages');
function wrap(name) {
  const body = fs.readFileSync(path.join(DIR, name + '-index.html'), 'utf8');
  const out = path.join(DIR, name + '-wrapped.html');
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  return pathToFileURL(out).href;
}
async function open(name, opts) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  if (opts && opts.init) await page.addInitScript(opts.init.fn, opts.init.arg);
  await page.goto(wrap(name));
  const settle = async (id, max) => { const t0 = Date.now(); while (Date.now() - t0 < (max || 60000)) { const busy = await page.evaluate((i) => /working it out|Working out/i.test((document.getElementById(i) || {}).textContent || ''), id); if (!busy) return true; await page.waitForTimeout(150); } return false; };
  const load = async (st, id) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(id || 'bay'); };
  const text = (id) => page.evaluate((i) => document.getElementById(i).textContent.replace(/\s+/g, ' '), id);
  return { browser, page, errs, settle, load, text };
}
module.exports = { open, wrap };
