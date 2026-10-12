const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), { pathToFileURL } = require('url');
const PREV = pathToFileURL(path.join(__dirname, 'preview.html')).href;
async function open(opts = {}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: opts.h || 900 }, colorScheme: opts.scheme || 'light' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  if (opts.saved) {
    await page.goto(PREV); await page.waitForTimeout(500);
    await page.evaluate((s) => { const cur = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(cur, s))); }, opts.saved);
  }
  await page.goto(PREV); await page.waitForTimeout(opts.wait || 1500);
  return { browser, page, errs };
}
async function tab(page, id, duo, wait) {
  await page.click(duo ? '#grp-duo' : '#grp-solo');
  await page.click('#tab-' + id);
  await page.waitForTimeout(wait || 1500);
}
const bayText = (page) => page.evaluate(() => document.querySelector('#bay').innerText);
module.exports = { open, tab, bayText, PREV };
