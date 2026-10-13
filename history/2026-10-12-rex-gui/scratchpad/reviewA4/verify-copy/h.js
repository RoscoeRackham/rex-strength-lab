const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const S = __dirname;
async function open(state, opts = {}) {
  const browser = opts.browser || await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: opts.h || 900 } });
  if (state) await ctx.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, state);
  if (opts.init) await ctx.addInitScript(opts.init);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto('file://' + path.join(S, opts.file || 'branch.html'));
  await page.waitForTimeout(opts.wait || 2500);
  return { browser, ctx, page, errs };
}
module.exports = { open, chromium, S };
