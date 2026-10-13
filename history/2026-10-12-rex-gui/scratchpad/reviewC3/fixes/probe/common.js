const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC3/fixes/repo/rex-strength-lab/test/make-page-fixture.js');
async function open(distPath, w = 1280) {
  const body = fs.readFileSync(distPath, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'prev-' + path.basename(path.dirname(path.dirname(distPath))) + '-' + w + '.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate(() => localStorage.clear());
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(700); await settle(page, 'bay'); };
  return { browser, page, load, errs, settle };
}
module.exports = { open };
