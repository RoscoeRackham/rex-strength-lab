// node r12.js <dist/index.html> : runs test/shots.js's round 1 and round 2 blocks of pull request 2 against a page
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SHOTS = fs.readFileSync(path.join(__dirname, 'repo/rex-strength-lab/test/shots.js'), 'utf8');
const a = SHOTS.indexOf('    // ---- review round 1 of BRIEF-canon.md pull request 2'), b = SHOTS.indexOf('    // ---- end of review round 2 of pull request 2');
const block = SHOTS.slice(a, b);
const { settle } = require(path.join(__dirname, 'repo/rex-strength-lab/test/make-page-fixture.js'));
const POWERS_OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const [, , htmlFile] = process.argv;
(async () => {
  const body = fs.readFileSync(htmlFile, 'utf8');
  const prev = path.join(__dirname, 'out', 'page-r12-' + path.basename(path.dirname(path.dirname(path.dirname(htmlFile)))) + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  let problems = 0;
  const fail = (m) => { problems++; console.log('PROBLEM ' + m.slice(0, 1500)); };
  const okLog = (m) => console.log('ok   ' + m.slice(0, 200));
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const fn = new Function('page', 'load', 'pick', 'settle', 'fail', 'okLog', 'POWERS_OFF', 'return (async () => {\n' + block + '\n})();');
  await fn(page, load, pick, settle, fail, okLog, POWERS_OFF);
  await browser.close();
  console.log('problems', problems);
})();
