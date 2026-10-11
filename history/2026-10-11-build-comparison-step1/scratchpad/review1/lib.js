'use strict';
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DIR = __dirname;
const page = fs.readFileSync('/home/user/rex-strength-lab/build-comparison/dist/index.html', 'utf8');
function writeWrapped(theme, extraHead) {
  const htmlOpen = theme ? '<html data-theme="' + theme + '">' : '<html>';
  const s = '<!doctype html>' + htmlOpen + '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' + (extraHead || '') + '</head><body>' + page + '</body></html>';
  const f = path.join(DIR, 'wrapped-' + (theme || 'none') + (extraHead ? '-x' : '') + '.html');
  fs.writeFileSync(f, s);
  return pathToFileURL(f).href;
}
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
async function open(browser, o) {
  const ctx = await browser.newContext({ viewport: { width: o.w, height: o.h }, colorScheme: o.scheme || 'light', deviceScaleFactor: o.dpr || 1, hasTouch: !!o.touch, isMobile: !!o.mobile });
  if (o.fonts !== false) await routeFonts(ctx);
  if (o.init) await ctx.addInitScript(o.init);
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', (e) => errs.push('pageerror: ' + String(e)));
  await p.goto(writeWrapped(o.theme, o.extraHead));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 }).catch(() => errs.push('tool did not finish'));
  await p.waitForTimeout(300);
  return { ctx, p, errs };
}
module.exports = { chromium, CHROME, DIR, open, writeWrapped };
