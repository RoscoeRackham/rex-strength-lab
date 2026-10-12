// Harness: open the page with given saved state, pick tab and effort, return bay text.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), { pathToFileURL } = require('url');
const PREV = path.join(__dirname, '..', 'snap' + (process.env.SNAP || 'B'), 'dist', 'preview.html');
let browser;
async function open(state, opts = {}) {
  if (!browser) browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, state);
  await page.goto(pathToFileURL(PREV).href);
  await page.waitForTimeout(800);
  page._errs = errs;
  return page;
}
async function tab(page, t, duo) {
  await page.click(duo ? '#grp-duo' : '#grp-solo');
  await page.click('#tab-' + t);
  await page.waitForTimeout(600);
}
async function effort(page, v) {
  await page.selectOption('#effort', v);
  await settle(page);
}
async function settle(page) {
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(300);
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    if (!/Working out|working it out/.test(t)) return;
  }
}
async function text(page) {
  await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => { d.open = true; }));
  await page.waitForTimeout(200);
  return page.evaluate(() => document.querySelector('#bay').innerText);
}
async function aria(page) { return page.evaluate(() => [...document.querySelectorAll('#bay [aria-label]')].map((e) => e.getAttribute('aria-label')).join('\n')); }
async function close() { if (browser) await browser.close(); }
module.exports = { open, tab, effort, settle, text, aria, close };
module.exports.absorb = async (page, v) => { await page.evaluate((v) => { const s = document.querySelector('#absorb'); s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); }, v); await settle(page); };
