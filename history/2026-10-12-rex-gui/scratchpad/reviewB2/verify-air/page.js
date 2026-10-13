const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const HERE = __dirname;
async function open() {
  const body = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const f = path.join(HERE, 'wrapped.html'); fs.writeFileSync(f, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(f).href);
  return { browser, page, errs };
}
async function settle(page, id) {
  for (let i = 0; i < 400; i++) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id);
    if (!busy) return; await page.waitForTimeout(250);
  }
  throw new Error('still working');
}
async function load(page, st, bay) {
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.reload(); await page.waitForTimeout(1000); await settle(page, bay || 'bay');
}
async function pick(page, sel, val, bay) { await page.selectOption(sel, val); await page.waitForTimeout(500); await settle(page, bay || 'bay'); }
async function text(page, id) { return page.evaluate((id) => document.getElementById(id).textContent.replace(/\s+/g, ' ').trim(), id); }
module.exports = { open, settle, load, pick, text };
