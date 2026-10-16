// Runs shots.js's pull request 3 block (taken verbatim from the reference clone) against the page built in <repo>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const repo = process.argv[2];
const ref = path.join(__dirname, '..', 'repo', 'rex-strength-lab', 'test', 'shots.js');
const src = fs.readFileSync(ref, 'utf8');
const a = src.indexOf('    // ---- BRIEF-canon.md item 5, pull request 3'), b = src.indexOf('    // ---- end of pull request 3\'s checks');
const block = src.slice(a, b);
const { settle } = require(path.join(__dirname, '..', 'repo', 'rex-strength-lab', 'test', 'make-page-fixture.js'));
(async () => {
  const body = fs.readFileSync(path.join(repo, 'rex-strength-lab/dist/index.html'), 'utf8');
  const f = path.join(__dirname, 'block-' + path.basename(path.dirname(repo)) + '.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(f).href);
  let problems = 0;
  const fail = (m) => { problems++; console.log('PROBLEM ' + m.slice(0, 700)); }, okLog = (m) => console.log('ok   ' + m.slice(0, 160));
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const fn = new Function('page', 'load', 'pick', 'settle', 'fail', 'okLog', 'return (async () => {' + block + '})();');
  await fn(page, load, pick, settle, fail, okLog);
  console.log(problems ? 'BLOCK FAILED: ' + problems : 'BLOCK ALL OK');
  await browser.close();
})();
