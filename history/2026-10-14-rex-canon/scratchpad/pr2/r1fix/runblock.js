// Runs the round 1 shots.js block (block.js, or the block cut out of a shots.js) against a given dist/index.html, with
// the same helpers the powers section of test/shots.js has in scope. Usage: node runblock.js <index.html> [shots.js]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const POWERS_OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
let blockSrc;
if (process.argv[3]) { const s = fs.readFileSync(process.argv[3], 'utf8'), a = s.indexOf('    // ---- review round 1 of BRIEF-canon.md pull request 2'), b = s.indexOf('    // ---- end of review round 1 of pull request 2'); blockSrc = s.slice(a, b); }
else blockSrc = fs.readFileSync(path.join(__dirname, 'block.js'), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
(async () => {
  const body = fs.readFileSync(process.argv[2], 'utf8');
  const prev = path.join(__dirname, 'runblock-' + Date.now() + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  let problems = 0;
  const fail = (msg) => { problems++; console.log('PROBLEM ' + msg); }, okLog = (msg) => console.log('ok   ' + msg);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const bayText = () => page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const fn = new AsyncFunction('page', 'load', 'settle', 'pick', 'bayText', 'fail', 'okLog', 'POWERS_OFF', blockSrc);
  await fn(page, load, settle, pick, bayText, fail, okLog, POWERS_OFF);
  if (errs.length) fail('page errors: ' + errs.join(' | '));
  await browser.close(); fs.unlinkSync(prev);
  console.log(problems ? problems + ' problem(s)' : 'no problems');
  process.exit(problems ? 1 : 0);
})();
