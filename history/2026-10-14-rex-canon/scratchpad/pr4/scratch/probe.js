const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const body = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const prev = path.join(__dirname, 'probe.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
const S = [
  ['collide sprint splat', { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint' }],
  ['collide sprint bounce', { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint', colBounce: 'bounce' }],
  ['collide jump', { duoAction: 'collide', colMode: 'charge', colSrc: 'jump' }],
  ['collide stomp 1e9', { duoAction: 'collide', colMode: 'charge', colSrc: 'stomp', logKg: 9 }],
  ['collide sprint Rex bolted', { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint', anchor: 'bolted' }],
  ['collide sprint Rex bolted real rock', { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint', anchor: 'bolted', unbreakable: false }],
  ['collide set', { duoAction: 'collide', colMode: 'charge', colSrc: 'set' }],
  ['collide jump real ground', { duoAction: 'collide', colMode: 'charge', colSrc: 'jump', unbreakable: false }],
  ['collide push', { duoAction: 'collide', colMode: 'push' }],
  ['collide push Rex bolted real', { duoAction: 'collide', colMode: 'push', anchor: 'bolted', unbreakable: false }],
  ['wrestle push', { duoAction: 'wrestle', wrestleMove: 'push' }],
  ['wrestle shove both', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }],
  ['wrestle lift', { duoAction: 'wrestle', wrestleMove: 'lift' }],
  ['wrestle throw', { duoAction: 'wrestle', wrestleMove: 'throw' }],
  ['arm', { duoAction: 'arm' }],
  ['arm keepForm off', { duoAction: 'arm', keepForm: false }],
  ['catch fireball case', { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 14, keepForm: false, airAbsorb: 0 }],
];
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  for (const [lab, st] of S) {
    errs.length = 0;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, st));
    await page.reload();
    for (let i = 0; i < 100; i++) { const busy = await page.evaluate(() => { const b = document.getElementById('duo-bay'); return !b || /working it out|Working out/i.test(b.textContent) || !b.querySelector('.verdict, .callout'); }); if (!busy) break; await page.waitForTimeout(100); }
    const v = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const x = b && b.querySelector('.verdict'); return x ? x.textContent.replace(/\s+/g, ' ').slice(0, 170) : '(no verdict)'; });
    const eff = await page.evaluate(() => { const e = document.querySelector('#duo-bay .effort-read'); return e ? e.textContent.replace(/\s+/g, ' ').slice(0, 110) : ''; });
    console.log((lab).padEnd(36), errs.length ? 'ERRORS: ' + Array.from(new Set(errs)).join(' | ').slice(0, 200) : 'no errors', '\n    verdict: ' + v + '\n    effort: ' + eff);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
