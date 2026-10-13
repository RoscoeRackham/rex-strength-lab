const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
function wrap(src, out) {
  const html = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return 'file://' + out;
}
const BR = wrap(S + '/copy/dist/index.html', S + '/branch.html');
const MAIN = wrap(S + '/main-index.html', S + '/main.html');
async function open(browser, url, state, vp) {
  const ctx = await browser.newContext({ viewport: vp || { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  if (state) await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, state);
  await page.goto(url);
  await page.waitForTimeout(1500);
  return { ctx, page, errs };
}
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
module.exports = { BR, MAIN, open, launch, S };
