// Render dist/index.html and run a callback; usage: node render.js <out.json> [width]
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const TREE = path.join(__dirname, 'tree', 'build-comparison');
async function open(width, opts) {
  opts = opts || {};
  const page = fs.readFileSync(path.join(TREE, 'dist', 'index.html'), 'utf8');
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>';
  const tmp = path.join(__dirname, 'page.html'); fs.writeFileSync(tmp, html);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: width || 1280, height: 900 }, colorScheme: opts.dark ? 'dark' : 'light' });
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (r) => r.abort());
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file://' + tmp);
  return { browser, p, errs };
}
module.exports = { open, TREE };
