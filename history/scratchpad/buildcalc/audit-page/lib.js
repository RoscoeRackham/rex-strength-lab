const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DIR = __dirname;
const page = fs.readFileSync('/home/user/build-calc/dist/index.html', 'utf8');
const skeleton = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
  '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>' +
  '</head><body>' + page + '</body></html>';
const tmp = path.join(DIR, 'preview.html');
fs.writeFileSync(tmp, skeleton);
const cache = {};
async function routeAll(ctx, log) {
  await ctx.route(/.*/, async (route) => {
    const url = route.request().url();
    if (url.startsWith('file://')) return route.continue();
    log && log.push(url);
    if (/https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(url)) {
      try {
        if (!cache[url]) {
          const body = execFileSync('curl', ['-sS', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', url], { maxBuffer: 1 << 24 });
          cache[url] = { body, type: url.includes('googleapis') ? 'text/css' : (url.endsWith('.woff2') ? 'font/woff2' : 'font/ttf') };
        }
        return route.fulfill({ status: 200, body: cache[url].body, contentType: cache[url].type, headers: { 'access-control-allow-origin': '*' } });
      } catch (e) { return route.abort(); }
    }
    return route.abort();
  });
}
async function open(browser, w, h, scheme, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: opts.dpr || 1 });
  const reqs = [];
  await routeAll(ctx, reqs);
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => errs.push('pageerror: ' + String(e)));
  p.on('dialog', d => { errs.push('dialog: ' + d.message()); d.dismiss(); });
  await p.goto('file://' + tmp);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);
  return { ctx, p, errs, reqs };
}
module.exports = { chromium, CHROME, open, DIR };
