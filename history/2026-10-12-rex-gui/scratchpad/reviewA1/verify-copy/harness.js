// Render a build of the Rex lab with a saved state and return bay text.
// usage: node harness.js <html-path> '<json state>' [soloEffort] [duoEffort] [openAllDetails]
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;

async function render(htmlPath, saved, opts = {}) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>';
  const tag = path.basename(path.dirname(path.dirname(htmlPath))) + '-' + Math.random().toString(36).slice(2, 8);
  const f = path.join(DIR, 'page-' + tag + '.html');
  fs.writeFileSync(f, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', s); } catch (e) {} }, JSON.stringify(saved));
  await page.goto('file://' + f);
  await page.waitForTimeout(500);
  const waitIdle = async () => {
    for (let i = 0; i < 120; i++) {
      const busy = await page.evaluate(() => /Working it out/.test(document.body.innerText));
      if (!busy) break;
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(300);
  };
  await waitIdle();
  if (opts.soloEffort) { await page.selectOption('#effort', opts.soloEffort); await page.waitForTimeout(300); await waitIdle(); }
  if (opts.duoEffort) {
    const has = await page.$('#duo-effort');
    if (has) { await page.selectOption('#duo-effort', opts.duoEffort); await page.waitForTimeout(300); await waitIdle(); }
  }
  if (opts.openAll) { await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true))); await page.waitForTimeout(500); await waitIdle(); }
  const out = await page.evaluate(() => ({
    bay: (document.querySelector('#bay') || {}).innerText || '',
    duo: (document.querySelector('#duo-bay') || {}).innerText || '',
    body: document.body.innerText,
  }));
  out.errs = errs;
  await browser.close();
  fs.unlinkSync(f);
  return out;
}
module.exports = { render };
