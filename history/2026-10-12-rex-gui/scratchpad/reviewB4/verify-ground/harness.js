const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const HERE = __dirname;
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const page = path.join(HERE, 'page.html');
fs.writeFileSync(page, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
async function open() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  pg.on('pageerror', (e) => errs.push(String(e)));
  await pg.goto(pathToFileURL(page).href);
  return { browser, pg, errs };
}
async function settle(pg, id) {
  for (let i = 0; i < 240; i++) {
    const busy = await pg.evaluate((id) => { const b = document.getElementById(id); return !b || /working it out|Working out/i.test(b.textContent); }, id);
    if (!busy) return;
    await pg.waitForTimeout(250);
  }
  throw new Error('still working');
}
async function load(pg, st) {
  await pg.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await pg.reload(); await pg.waitForTimeout(1000);
}
const text = (pg, id) => pg.evaluate((id) => document.getElementById(id).innerText, id);
module.exports = { open, settle, load, text };
