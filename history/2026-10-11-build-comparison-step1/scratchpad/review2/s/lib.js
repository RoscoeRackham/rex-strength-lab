'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2';
const page = fs.readFileSync(R + '/tree/build-comparison/dist/index.html', 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>';
const FILE = R + '/ux/ux-page.html';
fs.writeFileSync(FILE, wrapped);
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
async function open(browser, w, h, scheme, opts) {
  opts = opts || {};
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme || 'light', deviceScaleFactor: opts.dpr || 1, hasTouch: !!opts.touch });
  if (!opts.noFonts) await routeFonts(ctx);
  if (opts.init) await ctx.addInitScript(opts.init);
  const p = await ctx.newPage();
  p._errs = [];
  p.on('console', (m) => { if (m.type() === 'error') p._errs.push(m.text()); });
  p.on('pageerror', (e) => p._errs.push(String(e)));
  await p.goto('file://' + FILE);
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  return { ctx, p };
}
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
module.exports = { launch, open, R };
