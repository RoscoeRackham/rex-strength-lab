// Runs parts of shots.js's pull request 4 block against a built page: node blk.js <shots.js> <ROOT with dist/ and test/> <mode>
// mode: 'r1' (review round 1's checks), 'r2' (review round 2's), 'all' (the whole block), or 'build+r2' (the build's
// checks before round 1's block, then round 2's)
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SHOTS = process.argv[2], ROOT = process.argv[3], MODE = process.argv[4] || 'r2';
const src = fs.readFileSync(SHOTS, 'utf8');
const a = src.indexOf('    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });\n    const errs = [];\n    page.on(\'pageerror\'', src.indexOf('BRIEF-canon.md item 4, pull request 4: contests'));
const colLine = "    const COL = { duoOpen: true, duoAction: 'collide' };";
const pre = src.slice(a, src.indexOf(colLine) + colLine.length);
const r1a = src.indexOf('    // ---- review round 1 of pull request 4'), r2a = src.indexOf('    // ---- review round 2 of pull request 4'), endA = src.indexOf("    if (errs.length) r4.push('page errors: '", r2a);
if (a < 0 || r1a < 0 || r2a < 0 || endA < 0) throw new Error('block not found');
const build = src.slice(src.indexOf(colLine) + colLine.length, r1a);
const parts = { all: build + src.slice(r1a, endA), r1: src.slice(r1a, r2a), r2: src.slice(r2a, endA), build: build, 'build+r2': build + src.slice(r2a, endA) };
const rest = parts[MODE];
if (rest == null) throw new Error('mode ' + MODE);
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
  for (const x of r4) console.log('FAILS ' + x.slice(0, 260));
  console.log(r4.length + ' failing');
})();
