const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB4/copy';
const body = fs.readFileSync(DIR + '/lab/dist/index.html', 'utf8');
const prev = DIR + '/preview.html';
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
let browser;
async function open(w = 1280, h = 900, scheme = 'light') {
  if (!browser) browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
  page.errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') page.errs.push(m.text()); });
  page.on('pageerror', (e) => page.errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  return page;
}
async function settle(page, ms = 60000) {
  const t0 = Date.now();
  await page.waitForTimeout(400);
  while (Date.now() - t0 < ms) {
    const busy = await page.evaluate(() => /working it out|Working out/i.test(document.body.innerText));
    if (!busy) break;
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(200);
}
async function load(page, st) {
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st || {});
  await page.reload();
  await settle(page);
}
// structured dump of a bay
async function dump(page, sel = '#bay') {
  return page.evaluate((sel) => {
    const b = document.querySelector(sel); if (!b) return null;
    const txt = (n) => n ? n.textContent.replace(/\s+/g, ' ').trim() : '';
    return {
      verdict: Array.from(b.querySelectorAll('.verdict')).map(txt),
      chips: Array.from(b.querySelectorAll('.status-row .status, .status')).map(txt),
      all: txt(b),
    };
  }, sel);
}
async function full(page, sel = '#bay') { return page.evaluate((sel) => { const b = document.querySelector(sel); return b ? b.innerText : null; }, sel); }
async function fullText(page, sel = '#bay') { return page.evaluate((sel) => { const b = document.querySelector(sel).cloneNode(true); b.querySelectorAll('script,style').forEach((x) => x.remove());
  // keep paragraphs apart
  b.querySelectorAll('li,p,div,summary,h3,h4').forEach((x) => x.append('\n'));
  return b.textContent.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n'); }, sel); }
async function close() { if (browser) await browser.close(); }
module.exports = { open, settle, load, dump, full, fullText, close, DIR };
