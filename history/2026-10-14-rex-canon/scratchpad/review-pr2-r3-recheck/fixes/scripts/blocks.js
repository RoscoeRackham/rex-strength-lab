// Runs test/shots.js's review round 2 and round 3 blocks (verbatim, extracted from the clone's def9546 test) against
// the dist/index.html of the given rex-strength-lab directory. Usage: node blocks.js <dir> [r2|r3|both]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const CLONE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/fixes/repo/rex-strength-lab';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(CLONE + '/test/make-page-fixture.js');
const dir = process.argv[2], which = process.argv[3] || 'both';
const src = fs.readFileSync(CLONE + '/test/shots.js', 'utf8');
const cut = (a, b) => { const i = src.indexOf(a), j = src.indexOf(b); if (i < 0 || j < 0) throw new Error('marker'); return src.slice(i, j); };
const r2 = cut('    // ---- review round 2 of BRIEF-canon.md pull request 2', '    // ---- end of review round 2 of pull request 2');
const r3 = cut('    // ---- review round 3 of BRIEF-canon.md pull request 2', '    // ---- end of review round 3 of pull request 2');
const code = (which === 'r2' ? r2 : which === 'r3' ? r3 : r2 + r3);
(async () => {
  const body = fs.readFileSync(path.join(dir, 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(dir, 'dist', 'preview-blocks.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const POWERS_OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
  let problems = 0; const fail = (m) => { problems++; console.log('PROBLEM ' + m); }, okLog = (m) => console.log('ok   ' + m);
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  await new AsyncFunction('page', 'load', 'pick', 'settle', 'fail', 'okLog', 'POWERS_OFF', code)(page, load, pick, settle, fail, okLog, POWERS_OFF);
  if (errs.length) { problems++; console.log('PAGE ERRORS ' + errs.slice(0, 3).join(' | ')); }
  await browser.close();
  console.log(problems ? 'BLOCKS FAIL ' + problems : 'BLOCKS PASS');
  process.exit(problems ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
