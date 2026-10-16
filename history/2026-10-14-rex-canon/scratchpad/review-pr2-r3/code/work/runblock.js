// Run selected check blocks of a shots.js against a given dist/index.html.
// usage: node runblock.js <index.html> <shots.js> <block...>   blocks: r1, r2, pull (the 'Pull says where' check), recoilwhy (the two-player plaster presets loop)
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const [html, shotsPath, ...blocks] = process.argv.slice(2);
const shots = fs.readFileSync(shotsPath, 'utf8');
const { settle } = require(path.join(path.dirname(shotsPath), 'make-page-fixture.js'));
const cut = (a, b) => { const i = shots.indexOf(a), j = shots.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('marker ' + a); return shots.slice(i, j); };
const BLOCKS = {
  r1: () => cut('// ---- review round 1 of BRIEF-canon.md pull request 2', '// ---- end of review round 1 of pull request 2'),
  r2: () => cut('// ---- review round 2 of BRIEF-canon.md pull request 2', '// ---- end of review round 2 of pull request 2'),
  pull: () => cut('// Pull says where its ground shaking comes from', '// the Throw tab at the default least disruptive car throw'),
  recoilwhy: () => cut('// the plaster preset on the other two-player tests', '// ---- review round 1 of BRIEF-canon.md pull request 2'),
  recoilplanet: () => cut('// BRIEF-canon.md items 2 and 7: their own recoil', '// Pull says where its ground shaking comes from'),
};
const POWERS_OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
(async () => {
  const body = fs.readFileSync(html, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(path.dirname(html), 'preview-rb-' + process.pid + '.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  let problems = 0;
  const fail = (msg) => { problems++; console.log('PROBLEM ' + msg); };
  const okLog = (msg) => console.log('ok   ' + msg);
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
  const bayText = () => page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  for (const b of blocks) {
    const t0 = Date.now();
    const fn = new AsyncFunction('page', 'load', 'pick', 'settle', 'fail', 'okLog', 'POWERS_OFF', 'saved', 'bayText', 'SOLO', 'DUO', BLOCKS[b]());
    try { await fn(page, load, pick, settle, fail, okLog, POWERS_OFF, saved, bayText, SOLO, DUO); } catch (e) { fail('block ' + b + ' threw: ' + e.message); }
    console.log('[' + b + ' ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s]');
  }
  if (errs.length) fail('console: ' + errs.slice(0, 3).join(' | '));
  await browser.close();
  fs.unlinkSync(prev);
  console.log(problems ? problems + ' problem(s)' : 'clean');
  process.exit(problems ? 1 : 0);
})();
