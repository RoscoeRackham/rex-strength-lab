const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const path = require('path');
async function open(opts) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: (opts && opts.w) || 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  if (opts && opts.state) await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, opts.state);
  await page.goto(pathToFileURL(path.join(__dirname, 'prev.html')).href);
  await page.waitForTimeout(2000);
  const tab = async (t, duo) => { await page.click(duo ? '#grp-duo' : '#grp-solo'); await page.click('#tab-' + t); await page.waitForTimeout(duo ? 1500 : 800); };
  const bay = () => page.evaluate(() => document.querySelector('#bay').innerText);
  const openAll = () => page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
  return { browser, page, tab, bay, errs, openAll };
}
module.exports = { open };
