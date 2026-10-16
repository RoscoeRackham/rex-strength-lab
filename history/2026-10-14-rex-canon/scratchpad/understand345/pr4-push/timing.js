const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const D = __dirname;
const body = fs.readFileSync(path.join(M, 'dist', 'index.html'), 'utf8');
const prev = path.join(D, 'preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
const NAMES = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const wrap = ({ names }) => {
  window.__t = {}; let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { const t0 = performance.now(); try { return f.apply(this, arguments); } finally { const e = window.__t[k] || (window.__t[k] = { n: 0, ms: 0 }); e.n++; e.ms += performance.now() - t0; } }; }
    v = x; } });
};
const CASES = [
  ['arm', {}], ['wrestle push', { wrestleMove: 'push' }], ['wrestle shove rex', { wrestleMove: 'shove', wrestleWho: 'rex' }], ['wrestle shove both', { wrestleMove: 'shove', wrestleWho: 'both' }],
  ['wrestle lift', { wrestleMove: 'lift' }], ['wrestle throw', { wrestleMove: 'throw' }], ['catch baseball 10m easy', {}], ['catch car 1km hard', { cObj: 'car', cLogD: 3, cStyle: 'hard' }],
  ['catch partner', { cObj: 'partner' }], ['collide sprint splat', { colMode: 'charge', colSrc: 'sprint' }], ['collide jump', { colMode: 'charge', colSrc: 'jump' }], ['collide set 0.1%', { colMode: 'charge', colSrc: 'set' }], ['collide push', { colMode: 'push' }],
];
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(wrap, { names: NAMES });
  await page.goto(pathToFileURL(prev).href);
  for (const [lab, st] of CASES) {
    const tab = lab.split(' ')[0];
    for (const extra of [{}, { logKg: 9 }]) {
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true, duoAction: tab }, st, extra));
      const t0 = Date.now();
      await page.reload();
      // wait until no 'working it out'
      let busyMs = 0;
      for (let i = 0; i < 240; i++) {
        const busy = await page.evaluate(() => { const b = document.getElementById('duo-bay'); return !b || /working it out|Working out/i.test(b.textContent) || !b.querySelector('.verdict, .callout'); });
        if (!busy) break; await page.waitForTimeout(100);
      }
      const wall = Date.now() - t0;
      const t = await page.evaluate(() => window.__t);
      const eff = await page.evaluate(() => { const e = document.querySelector('#duo-bay .effort-read'); return e ? e.textContent.replace(/\s+/g, ' ').slice(0, 160) : ''; });
      const tot = Object.values(t).reduce((a, x) => a + x.ms, 0);
      console.log((lab + (extra.logKg ? ' @1e9kg' : ' @dial')).padEnd(34), 'wall', wall, 'ms; engine', tot.toFixed(0), 'ms;', Object.entries(t).map(([k, x]) => k + ' ' + x.n + 'x ' + x.ms.toFixed(0) + 'ms').join(', '), '|', eff.slice(0, 110));
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
