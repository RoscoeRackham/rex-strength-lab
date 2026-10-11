// Shared Playwright harness: loads build-comparison/dist/index.html in the artifact-like skeleton.
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIST = process.env.DIST || '/home/user/rex-strength-lab/build-comparison/dist/index.html';
const R = '/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review1';
function wrapped() {
  const page = fs.readFileSync(DIST, 'utf8');
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>';
  const f = path.join(R, 'page.html'); fs.writeFileSync(f, html); return f;
}
async function open(opts) {
  opts = opts || {};
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1280, height: 900 }, colorScheme: opts.scheme || 'light' });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push('pageerror ' + String(e)));
  const f = wrapped();
  const t0 = Date.now();
  await p.goto('file://' + f, { waitUntil: opts.waitUntil || 'load', timeout: 120000 });
  const tLoad = Date.now() - t0;
  return { browser, ctx, p, errs, tLoad };
}
module.exports = { open, R };
