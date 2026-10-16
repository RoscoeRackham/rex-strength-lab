// Runs only pull request 3's block of test/shots.js against a built page, so each check can be tried on pull request
// 2's page (and on mutants) quickly. node block.js <shots.js> <dir holding dist/index.html and test/make-page-fixture.js>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SHOTS = process.argv[2], ROOT = process.argv[3];
const src = fs.readFileSync(SHOTS, 'utf8');
const a = src.indexOf('    // ---- BRIEF-canon.md item 5, pull request 3'), b = src.indexOf("    // ---- end of pull request 3's checks");
if (a < 0 || b < 0) throw new Error('block not found');
const block = src.slice(a, b);
const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
(async () => {
  const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'view', 'block-' + path.basename(path.dirname(ROOT)) + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  let problems = 0;
  const fail = (m) => { problems++; console.log('PROBLEM ' + m.slice(0, 600)); }, okLog = (m) => console.log('ok   ' + m);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const fn = new Function('page', 'load', 'pick', 'settle', 'fail', 'okLog', 'return (async () => {\n' + block + '\n})();');
  try { await fn(page, load, pick, settle, fail, okLog); } catch (e) { problems++; console.log('ERROR ' + e.message); }
  await browser.close();
  console.log(problems + ' problems');
})();
