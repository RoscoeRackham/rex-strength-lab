// node r1check.js <dist html> : runs test/shots.js's round 1 block (pull request 2) on that page; prints which items fail
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const REPO = path.join(__dirname, 'repo/rex-strength-lab');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.join(REPO, 'test/make-page-fixture.js'));
const POWERS_OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const shots = fs.readFileSync(path.join(REPO, 'test/shots.js'), 'utf8');
const a = shots.indexOf('// ---- review round 1 of BRIEF-canon.md pull request 2'), b = shots.indexOf('// ---- end of review round 1 of pull request 2');
const block = shots.slice(a, b);
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
(async () => {
  const file = process.argv[2], tag = process.argv[3] || '';
  const body = fs.readFileSync(file, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'pages', 'r1-' + (tag || 'x') + '.html');
  fs.mkdirSync(path.dirname(prev), { recursive: true });
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const msgs = [];
  const fail = (m) => msgs.push('FAIL ' + m), okLog = (m) => msgs.push('ok ' + m);
  const fn = new AsyncFunction('page', 'load', 'pick', 'settle', 'POWERS_OFF', 'fail', 'okLog', block);
  try { await fn(page, load, pick, settle, POWERS_OFF, fail, okLog); } catch (e) { msgs.push('CRASH ' + e.message); }
  await browser.close();
  const items = msgs.flatMap((m) => m.startsWith('FAIL review round 1 (pull request 2): ') ? m.slice('FAIL review round 1 (pull request 2): '.length).split(' ;; ').map((x) => 'FAIL ' + x) : [m]);
  console.log(JSON.stringify({ tag, items: items.map((x) => x.slice(0, 400)), errs }, null, 1));
})();
