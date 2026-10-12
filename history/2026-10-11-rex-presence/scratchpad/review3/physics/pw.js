const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const PREV = '/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html';
let browser;
async function open(state, opts = {}) {
  if (!browser) browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: 900 } });
  page.errs = [];
  page.on('pageerror', (e) => page.errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.errs.push(m.text()); });
  await page.goto(pathToFileURL(PREV).href);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), state || {});
  await page.reload();
  await page.waitForTimeout(300);
  return page;
}
async function waitDone(page, ms = 90000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const t = await page.evaluate(() => document.querySelector('#bay').textContent);
    if (!/working it out|Working out/i.test(t)) return t;
    await page.waitForTimeout(250);
  }
  return '[TIMEOUT]';
}
async function bayText(page) {
  await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => { d.open = true; }));
  return page.evaluate(() => document.querySelector('#bay').innerText);
}
async function close() { if (browser) await browser.close(); }
module.exports = { open, waitDone, bayText, close };
