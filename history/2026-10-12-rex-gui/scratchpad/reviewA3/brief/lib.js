const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const wrap = (src, out) => { const html = fs.readFileSync(src, 'utf8'); fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>'); return pathToFileURL(out).href; };
const NEW = wrap(path.join(S, 'work/rex-strength-lab/dist/index.html'), path.join(S, 'new.html'));
const OLD = wrap(path.join(S, 'main-index.html'), path.join(S, 'old.html'));
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
async function open(browser, url, st, opts) {
  opts = opts || {};
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: opts.h || 900 }, colorScheme: opts.scheme || 'light' });
  page.__errs = [];
  page.on('pageerror', (e) => page.__errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.__errs.push(m.text()); });
  if (opts.init) await page.addInitScript(opts.init.fn, opts.init.arg);
  await page.goto(url);
  await page.evaluate((s) => { localStorage.clear(); if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st || null);
  await page.reload();
  await page.waitForTimeout(opts.wait || 1500);
  return page;
}
async function settle(page, id, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < (ms || 20000)) { const busy = await page.evaluate((i) => /working it out/i.test(document.getElementById(i).textContent), id); if (!busy) break; await page.waitForTimeout(200); }
  await page.waitForTimeout(700);
}
const txt = (page, sel) => page.evaluate((s) => { const n = document.querySelector(s); if (!n) return null; const c = n.cloneNode(true); c.querySelectorAll('details').forEach((d) => d.open = true); return c.textContent.replace(/\s+/g, ' ').trim(); }, sel);
module.exports = { NEW, OLD, launch, open, settle, txt, S };
