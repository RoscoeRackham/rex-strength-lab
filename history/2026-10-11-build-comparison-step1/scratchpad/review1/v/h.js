// shared harness for my independent verification
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { execFileSync } = require('child_process');
const DIR = __dirname;
const page = fs.readFileSync('/home/user/rex-strength-lab/build-comparison/dist/index.html', 'utf8');
const task = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>';
const host = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}</style></head><body>' + page + '</body></html>';
const hostHidden = host.replace('img{max-width:100%}', 'img{max-width:100%}[hidden]{display:none!important}');
fs.writeFileSync(path.join(DIR, 'task.html'), task);
fs.writeFileSync(path.join(DIR, 'host.html'), host);
fs.writeFileSync(path.join(DIR, 'hosthidden.html'), hostHidden);
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
async function open(browser, { width = 390, height = 844, dark = false, skel = 'host', fonts = true, touch = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: dark ? 'dark' : 'light', reducedMotion: 'reduce', hasTouch: touch, isMobile: false, deviceScaleFactor: 1 });
  if (fonts) await routeFonts(ctx); else await ctx.route(/fonts\.(googleapis|gstatic)/, (r) => r.abort());
  const p = await ctx.newPage();
  const errs = []; p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file://' + path.join(DIR, skel + '.html'));
  await p.waitForTimeout(800);
  try { await p.evaluate(() => document.fonts.ready); } catch (e) {}
  await p.waitForTimeout(300);
  p._errs = errs; p._ctx = ctx;
  return p;
}
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
module.exports = { open, launch, DIR };
