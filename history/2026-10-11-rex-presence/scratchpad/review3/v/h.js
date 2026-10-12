const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), { pathToFileURL } = require('url');
const PREV = pathToFileURL(path.join(__dirname, 'preview.html')).href;
let browser;
async function open(st, w = 1280) {
  if (!browser) browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await page.goto(PREV);
  await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st || {});
  await page.goto(PREV);
  await page.waitForTimeout(500);
  return page;
}
async function tab(page, t, duo) {
  await page.click(duo ? '#grp-duo' : '#grp-solo');
  await page.click('#tab-' + t);
  await page.waitForTimeout(300);
}
async function sel(page, id, v) { await page.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]); await page.waitForTimeout(300); }
async function check(page, id, on) { await page.evaluate(([id, on]) => { const e = document.getElementById(id); e.checked = on; e.dispatchEvent(new Event('change')); }, [id, on]); await page.waitForTimeout(200); }
async function settle(page, ms = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const t = await bay(page);
    if (!/Working out|working it out/.test(t)) return t;
    await page.waitForTimeout(300);
  }
  return bay(page);
}
async function bay(page) {
  return page.evaluate(() => { const b = document.querySelector('#bay'); b.querySelectorAll('details').forEach((d) => { d.open = true; }); return b.innerText; });
}
async function all(page) {
  return page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style,svg').forEach((x) => x.remove()); return c.textContent; });
}
async function close() { if (browser) await browser.close(); }
module.exports = { open, tab, sel, check, settle, bay, all, close };
