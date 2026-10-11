// Shared harness: load the built page in Chromium like test/shots.js does.
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.join(__dirname, '..', 'tree', 'build-comparison');
const page = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>';
const file = path.join(__dirname, '..', 'page.html');
fs.writeFileSync(file, html);
const cache = {};
async function routeFonts(ctx) {
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, async (route) => {
    const url = route.request().url();
    try {
      if (!cache[url]) {
        const body = execFileSync('curl', ['-sS', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', url], { maxBuffer: 1 << 24 });
        cache[url] = { body, type: url.includes('googleapis') ? 'text/css' : (url.endsWith('.woff2') ? 'font/woff2' : 'font/ttf') };
      }
      await route.fulfill({ status: 200, body: cache[url].body, contentType: cache[url].type, headers: { 'access-control-allow-origin': '*' } });
    } catch (e) { await route.abort(); }
  });
}
async function open(opts) {
  opts = opts || {};
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: opts.h || 900 }, colorScheme: opts.dark ? 'dark' : 'light', hasTouch: !!opts.touch, isMobile: !!opts.mobile, deviceScaleFactor: opts.dpr || 1 });
  if (opts.fonts !== false) await routeFonts(ctx); else await ctx.route(/fonts\./, (r) => r.abort());
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await p.goto('file://' + file);
  await p.waitForFunction(() => window.__bc && document.querySelector('.fig'));
  if (opts.fonts !== false) await p.evaluate(() => document.fonts.ready);
  return { browser, ctx, p, errors };
}
module.exports = { open, ROOT, SHOTS: path.join(__dirname, '..', 'shots') };
fs.mkdirSync(path.join(__dirname, '..', 'shots'), { recursive: true });
