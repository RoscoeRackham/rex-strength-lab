const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC1/copy/repo/rex-strength-lab';
const OUT='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC1/copy/shots';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
function preview(distFile, name) {
  const body = fs.readFileSync(distFile || path.join(R,'dist','index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const p = path.join(OUT, (name||'preview')+'.html'); fs.writeFileSync(p, wrapped); return pathToFileURL(p).href;
}
async function settle(page, bayId) {
  for (let i = 0; i < 160; i++) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), bayId);
    if (!busy) return;
    await page.waitForTimeout(250);
  }
}
module.exports = { chromium, CHROME, preview, settle, R, OUT, fs, path };
