// Runs shots.js's pull-request-3 block (and the mass migration check) against a given repo's dist/index.html.
// usage: node pr3harness.js <repo/rex-strength-lab> [--block-only]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const lab = path.resolve(process.argv[2]);
const { settle } = require(path.join(lab, 'test', 'make-page-fixture.js'));
const src = fs.readFileSync(path.join(lab, 'test', 'shots.js'), 'utf8');
const a = src.indexOf('// ---- BRIEF-canon.md item 5, pull request 3'), b = src.indexOf("// ---- end of pull request 3's checks");
if (a < 0 || b < 0) throw new Error('block not found');
const block = src.slice(a, b);
(async () => {
  const body = fs.readFileSync(path.join(lab, 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(path.dirname(__filename), 'h-' + process.pid + '.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let problems = 0;
  const fail = (msg) => { problems++; console.log('PROBLEM ' + msg.slice(0, 600)); };
  const okLog = (msg) => console.log('ok   ' + msg.slice(0, 200));
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const fn = new AsyncFunction('page', 'load', 'settle', 'pick', 'fail', 'okLog', block);
  try { await fn(page, load, settle, pick, fail, okLog); } catch (e) { fail('THREW ' + e.message); }
  if (errs.length) fail('page errors: ' + errs.slice(0, 3).join(' | '));
  await browser.close();
  fs.unlinkSync(prev);
  console.log(problems ? 'HARNESS PROBLEMS ' + problems : 'HARNESS ALL OK');
  process.exit(problems ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
