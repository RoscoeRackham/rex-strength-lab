'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const page = fs.readFileSync('/home/user/build-calc/dist/index.html', 'utf8');
const sk = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>';
const tmp = path.join('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/audit-numbers', 'preview.html');
fs.writeFileSync(tmp, sk);
module.exports = async function (fn) {
  const browser = await chromium.launch({ executablePath: CHROME });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route(/https:\/\/fonts\..*/, r => r.abort());
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + tmp);
  await p.waitForTimeout(200);
  try { await fn(p); } finally { if (errs.length) console.log('ERRS', errs); await browser.close(); }
};
