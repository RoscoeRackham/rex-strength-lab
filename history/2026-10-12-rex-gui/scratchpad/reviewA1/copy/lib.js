const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
async function open(which, state, opts = {}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: 900 }, colorScheme: opts.dark ? 'dark' : 'light' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  if (state) await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, state);
  await page.goto('file://' + S + '/' + which + '.html');
  await page.waitForTimeout(opts.wait || 1500);
  return { browser, page, errs };
}
async function settle(page, sel = '#bay', ms = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const busy = await page.evaluate((s) => { const b = document.querySelector(s); return !b || /Working it out|working it out|Finding|finding/.test(b.textContent); }, sel);
    if (!busy) break;
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(400);
}
module.exports = { open, settle, S };
