const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
const body = fs.readFileSync(path.join(DIR, 'copy/rex-strength-lab/dist/index.html'), 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
const file = path.join(DIR, 'page.html'); fs.writeFileSync(file, wrapped);
async function settle(page, id) {
  for (let i = 0; i < 240; i++) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id);
    if (!busy) return;
    await page.waitForTimeout(250);
  }
  throw new Error('still working');
}
async function run(browser, st, opts) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(file).href);
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.reload(); await page.waitForTimeout(1500);
  const bay = opts.bay || 'bay';
  await settle(page, bay);
  if (opts.pick) { await page.selectOption('#effort', opts.pick); await page.waitForTimeout(500); await settle(page, bay); }
  if (opts.duoPick) { await page.selectOption('#duo-effort', opts.duoPick); await page.waitForTimeout(500); await settle(page, bay); }
  const txt = await page.evaluate((id) => document.getElementById(id).innerText, bay);
  await page.close();
  return { txt, errs };
}
module.exports = { run, chromium };
