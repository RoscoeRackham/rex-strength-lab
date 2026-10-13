const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
function wrap(src, out, extraCss) {
  const html = fs.readFileSync(src, 'utf8');
  const css = extraCss ? '<style>' + extraCss + '</style>' : '';
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + css + '</body></html>');
  return 'file://' + out;
}
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
module.exports = { wrap, launch, D };
