// Runs part of shots.js's pull request 4 block against a built page: node blk.js <shots.js> <ROOT with dist/ and test/> <r1|all>
// r1: the block's helpers plus the review round 1 checks only; all: the whole block
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SHOTS = process.argv[2], ROOT = process.argv[3], MODE = process.argv[4] || 'r1';
const src = fs.readFileSync(SHOTS, 'utf8');
const a = src.indexOf('    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });\n    const errs = [];\n    page.on(\'pageerror\'', src.indexOf('BRIEF-canon.md item 4, pull request 4: contests'));
const pre = src.slice(a, src.indexOf("    const COL = { duoOpen: true, duoAction: 'collide' };") + "    const COL = { duoOpen: true, duoAction: 'collide' };".length);
const r1a = src.indexOf('    // ---- review round 1 of pull request 4'), endA = src.indexOf("    if (errs.length) r4.push('page errors: '", r1a);
const rest = MODE === 'all' ? src.slice(src.indexOf("    const COL = { duoOpen: true, duoAction: 'collide' };") + "    const COL = { duoOpen: true, duoAction: 'collide' };".length, endA) : src.slice(r1a, endA);
if (a < 0 || r1a < 0 || endA < 0) throw new Error('block not found');
const { readResult, settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
(async () => {
  const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const prev = path.join(ROOT, 'dist', 'blk-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const code = pre + '\n' + rest + "\n    if (errs.length) r4.push('page errors: ' + errs.slice(0, 3).join(' | '));\n    return r4;";
  const fn = new Function('browser', 'prev', 'pathToFileURL', 'settle', 'readResult', 'SOLO', 'DUO', 'return (async () => {\n' + code + '\n})();');
  let r4;
  try { r4 = await fn(browser, prev, pathToFileURL, settle, readResult, SOLO, DUO); } catch (e) { r4 = ['ERROR ' + e.message]; }
  await browser.close();
  for (const x of r4) console.log('FAILS ' + x.slice(0, 220));
  console.log(r4.length + ' failing');
})();
