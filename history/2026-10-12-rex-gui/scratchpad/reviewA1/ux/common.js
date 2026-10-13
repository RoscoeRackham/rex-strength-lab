const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
function wrap(src, name) {
  const html = fs.readFileSync(src, 'utf8');
  const out = path.join(DIR, name);
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return pathToFileURL(out).href;
}
const NEW = () => wrap(path.join(DIR, 'lab/dist/index.html'), 'new.html');
const OLD = () => wrap(path.join(DIR, 'main-index.html'), 'old.html');
const launch = () => chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
module.exports = { NEW, OLD, launch, DIR, path, fs };
