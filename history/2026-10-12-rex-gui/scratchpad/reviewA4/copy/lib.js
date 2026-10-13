const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S=__dirname;
async function open(state, opts={}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: opts.w||1280, height: opts.h||900 }, colorScheme: opts.dark?'dark':'light' });
  const page = await ctx.newPage();
  const errs=[]; page.on('pageerror', e=>errs.push(String(e))); page.on('console', m=>{ if(m.type()==='error') errs.push('console:'+m.text()); });
  const file = 'file://' + S + '/' + (opts.main?'main.html':'branch.html');
  if (state) {
    await page.goto(file); await page.evaluate(s=>localStorage.setItem('rex-lab-v1', JSON.stringify(s)), state);
  }
  await page.goto(file);
  await page.waitForTimeout(opts.wait||1500);
  return { browser, page, errs };
}
module.exports = { open, S };
