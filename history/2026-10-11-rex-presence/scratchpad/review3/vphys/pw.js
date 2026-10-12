const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const PREV = pathToFileURL(__dirname + '/preview.html').href;
let browser;
async function open(state, opts = {}) {
  if (!browser) browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript((s) => { try { if (!sessionStorage.getItem('init')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('init', '1'); } } catch (e) {} }, state);
  await page.goto(PREV);
  await page.waitForTimeout(opts.wait || 2500);
  page.errs = errs;
  return page;
}
async function bayText(page) {
  return page.evaluate(() => { const b = document.querySelector('#bay') || document.querySelector('main') || document.body; const c = b.cloneNode(true); c.querySelectorAll('script,style').forEach(x=>x.remove()); c.querySelectorAll('details').forEach(d=>d.open=true); return c.innerText || c.textContent; });
}
async function allText(page) {
  return page.evaluate(() => { document.querySelectorAll('details').forEach(d=>d.open=true); return document.body.innerText; });
}
async function setEffortLog(page, logKg) {
  // set the slider value and fire input
  await page.evaluate((v) => { const det = document.querySelector('details.effort-adjust'); if (det) det.open = true; const s = document.querySelector('#effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, logKg);
  await page.waitForTimeout(2500);
}
async function close() { if (browser) await browser.close(); }
module.exports = { open, bayText, allText, setEffortLog, close };
