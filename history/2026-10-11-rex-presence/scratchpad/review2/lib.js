const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const PREV = process.env.PREV || '/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html';
async function open(browser, saved, opts) {
  opts = opts || {};
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: 900 }, colorScheme: opts.scheme || 'light' });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.addInitScript((s) => {
    window.__long = [];
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
    if (s !== undefined) localStorage.setItem('rex-lab-v1', typeof s === 'string' ? s : JSON.stringify(s));
  }, saved);
  const t0 = Date.now();
  await page.goto(pathToFileURL(PREV).href);
  const tLoad = Date.now() - t0;
  return { page, errs, tLoad };
}
const bayText = (page) => page.evaluate(() => document.querySelector('#bay').innerText);
const launch = () => chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
module.exports = { open, bayText, launch };
