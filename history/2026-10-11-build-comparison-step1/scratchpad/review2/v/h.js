const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const page0 = fs.readFileSync(S + '/tree/build-comparison/dist/index.html', 'utf8');
const wrapped = S + '/page.html';
fs.writeFileSync(wrapped, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page0 + '</body></html>');
async function open(w, h, scheme, opts) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext(Object.assign({ viewport: { width: w, height: h || 900 }, colorScheme: scheme || 'light', permissions: ['clipboard-read', 'clipboard-write'] }, opts || {}));
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (r) => r.abort());
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file://' + wrapped);
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  return { browser, ctx, p, errs };
}
module.exports = { open, S };
