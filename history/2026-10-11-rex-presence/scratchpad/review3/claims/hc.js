// claims-lens harness: load page with saved state, pick tab, set controls, dump bay text
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const PREV = __dirname + '/preview.html';
let browser;
async function open(width = 1280) {
  if (!browser) browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.errs = [];
  page.on('pageerror', (e) => page.errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.errs.push(m.text()); });
  await page.goto(pathToFileURL(PREV).href);
  await page.waitForTimeout(300);
  return page;
}
async function setState(page, st) {
  await page.evaluate((st) => { const cur = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(cur, st))); }, st);
  await page.reload(); await page.waitForTimeout(300);
}
async function settle(page, ms = 60000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const t = await page.evaluate(() => document.getElementById('bay').innerText);
    if (!/working it out|Working out|Showing all-out until then/i.test(t)) { await page.waitForTimeout(150); return true; }
    await page.waitForTimeout(250);
  }
  return false;
}
async function bayText(page) {
  return page.evaluate(() => { const b = document.getElementById('bay'); b.querySelectorAll('details').forEach((d) => d.open = true); return b.innerText; });
}
async function tab(page, t) {
  const duo = ['arm', 'wrestle', 'catch', 'collide'].includes(t);
  await page.click(duo ? '#grp-duo' : '#grp-solo');
  await page.click('#tab-' + t);
  await page.waitForTimeout(200);
}
async function sel(page, id, v) { await page.selectOption(id, v); await page.waitForTimeout(150); }
module.exports = { open, setState, settle, bayText, tab, sel, close: () => browser && browser.close() };
