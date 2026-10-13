const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const S = __dirname;
const url = (which) => 'file://' + path.join(S, which + '.html');
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
// open a page with a saved state; opts: w,h,scheme,theme,which
async function open(browser, opts = {}) {
  const { w = 1280, h = 900, scheme = 'light', theme = null, which = 'branch', state = null, wait = 2500, init = null } = opts;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.addInitScript(({ state, theme }) => {
    if (!sessionStorage.getItem('__init')) { sessionStorage.setItem('__init', '1'); localStorage.clear(); if (state) localStorage.setItem('rex-lab-v1', JSON.stringify(state)); }
    if (theme) document.addEventListener('readystatechange', () => document.documentElement.setAttribute('data-theme', theme), { once: true });
  }, { state, theme });
  if (init) await page.addInitScript(init.fn, init.arg);
  await page.goto(url(which));
  if (theme) await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
  await page.waitForTimeout(wait);
  page.errs = errs;
  return page;
}
module.exports = { launch, open, S, url };
