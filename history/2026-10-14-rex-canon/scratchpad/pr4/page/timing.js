// timing.js <html> [reps]: the engine time the two-player effort search spends in two-player calls, per test, at the
// least disruptive effort (the default), from a fresh load until the search settles. Top-level calls only (a call
// inside another isn't counted twice). Prints JSON { test: { ms, calls, wall } } (medians over reps).
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const NAMES = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const TESTS = [
  ['arm', { duoAction: 'arm' }], ['arm keepForm off', { duoAction: 'arm', keepForm: false }],
  ['wrestle push', { duoAction: 'wrestle' }], ['wrestle shove', { duoAction: 'wrestle', wrestleMove: 'shove' }], ['wrestle both', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }],
  ['wrestle lift', { duoAction: 'wrestle', wrestleMove: 'lift' }], ['wrestle throw', { duoAction: 'wrestle', wrestleMove: 'throw' }],
  ['catch baseball', { duoAction: 'catch' }], ['catch car 1 km', { duoAction: 'catch', cObj: 'car', cLogD: 3 }], ['catch partner toss', { duoAction: 'catch', cObj: 'partner' }],
  ['catch fireball case', { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 }],
  ['collide sprint', { duoAction: 'collide' }], ['collide bounce', { duoAction: 'collide', colBounce: 'bounce' }], ['collide jump', { duoAction: 'collide', colSrc: 'jump' }],
  ['collide jump 10^9', { duoAction: 'collide', colSrc: 'jump', logKg: 9 }], ['collide stomp', { duoAction: 'collide', colSrc: 'stomp' }], ['collide set speed', { duoAction: 'collide', colSrc: 'set' }],
  ['collide Rex bolted', { duoAction: 'collide', anchor: 'bolted' }], ['collide push', { duoAction: 'collide', colMode: 'push' }],
];
(async () => {
  const file = process.argv[2], reps = Number(process.argv[3] || 3);
  const body = fs.readFileSync(file, 'utf8');
  const prev = path.join(path.dirname(path.resolve(file)), path.basename(file, '.html') + '.timing.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((names) => {
    window.__ms = 0; window.__n = 0; let depth = 0, v;
    Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
      for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { if (depth++ === 0) { window.__n++; const t = performance.now(); try { return f.apply(this, arguments); } finally { window.__ms += performance.now() - t; depth--; } } try { return f.apply(this, arguments); } finally { depth--; } }; }
      v = x;
    } });
  }, NAMES);
  await page.goto(pathToFileURL(prev).href);
  const out = {};
  const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  for (const [name, st] of TESTS) {
    const ms = [], calls = [], wall = [];
    for (let i = 0; i < reps; i++) {
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true }, s))), st);
      const t0 = Date.now();
      await page.reload(); await page.waitForTimeout(200); await settle(page, 'duo-bay');
      wall.push(Date.now() - t0);
      const r = await page.evaluate(() => ({ ms: window.__ms, n: window.__n }));
      ms.push(r.ms); calls.push(r.n);
    }
    out[name] = { ms: Math.round(med(ms)), calls: med(calls), wall: med(wall) };
  }
  await browser.close();
  console.log(JSON.stringify(out));
})().catch((e) => { console.error(e); process.exit(1); });
