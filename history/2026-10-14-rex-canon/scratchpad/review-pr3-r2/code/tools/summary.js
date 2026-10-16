const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const lab = path.resolve(process.argv[2]);
(async () => {
  const body = fs.readFileSync(path.join(lab, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'sum-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  let bad = 0, n = 0;
  const pct = (s) => Math.round(100 * s) + '%';
  for (const ub of [true, false]) for (const or of [true, false]) for (const kf of [true, false]) for (const sp of [true, false]) for (const air of [1, 0.5, 0]) for (const extra of [{}, { silentStrike: true, anchor: 'bolted' }]) {
    const st = Object.assign({ saveV: 3, action: 'weight', unbreakable: ub, ownRecoil: or, keepForm: kf, safePassenger: sp, airAbsorb: air }, extra);
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(250);
    const got = await page.$eval('#powers-sum', (x) => x.textContent);
    const all = ub && or && kf && sp && air === 1;
    let sw = all ? ['default powers on'] : [ub && 'unbreakable footing', or && 'own recoil', kf && 'things keep their form', sp && 'safe passenger', air > 0 && (air >= 1 ? 'drag-free throws' : 'air ' + pct(air) + ' absorbed')].filter(Boolean);
    if (extra.silentStrike) sw.push('silent strike');
    const parts = ['Comic book'].concat(sw.length || extra.anchor ? sw : ['switches off'], extra.anchor ? ['bolted: Rex'] : []);
    const want = parts.join(' · ');
    n++;
    if (got !== want) { bad++; console.log('DIFF', JSON.stringify(st), '\n  got ', got, '\n  want', want); }
    // the switches themselves reflect the state
    const sws = await page.evaluate(() => ['sw-unbreakable', 'sw-recoil', 'sw-keep', 'sw-passenger'].map((id) => document.getElementById(id).checked).join());
    if (sws !== [ub, or, kf, sp].join()) { bad++; console.log('SWITCHES', JSON.stringify(st), sws); }
  }
  console.log('summary combos', n, 'bad', bad);
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
