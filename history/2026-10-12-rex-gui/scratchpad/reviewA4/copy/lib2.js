const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
async function session(opts = {}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: opts.h || 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  const file = 'file://' + S + '/' + (opts.main ? 'main.html' : 'branch.html');
  await page.goto(file);
  async function load(state) {
    await page.evaluate(s => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, state);
    await page.goto(file);
    await stable();
  }
  async function stable(sel = '#bay', sel2 = '#duo-bay') {
    let last = '', same = 0;
    for (let i = 0; i < 200; i++) {
      await page.waitForTimeout(150);
      const t = await page.evaluate(([a, b]) => (document.querySelector(a) || {}).innerText + '||' + (document.querySelector(b) || {}).innerText, [sel, sel2]);
      if (t === last && !/Working it out/.test(t)) { if (++same >= 4) return t; } else same = 0;
      last = t;
    }
    return last;
  }
  const text = (sel) => page.evaluate(s => { const n = document.querySelector(s); return n ? n.innerText : null; }, sel);
  return { browser, page, errs, load, stable, text };
}
module.exports = { session };
