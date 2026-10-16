// every changed view at 390 and 1280 px, light and dark: the bay with its Shimmer tile (and the pictures)
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dist = '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', out = path.join(__dirname, 'views'); fs.mkdirSync(out, { recursive: true });
const prev = path.join(__dirname, 'preview-views.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + fs.readFileSync(dist, 'utf8') + '</body></html>');
const V = [
  ['throw', { action: 'throw', obj: 'car' }], ['throw-allout', { action: 'throw', obj: 'car' }, 'allout'], ['throw-inf', { action: 'throw', obj: 'car', inf: true }, 'allout'], ['throw-person', { action: 'throw', obj: 'person' }],
  ['jump-soft', { action: 'jump', softLanding: true }, 'allout'], ['stomp-allout', { action: 'stomp' }, 'allout'], ['stomp-1e9', { action: 'stomp', logKg: 9 }, 'allout'], ['punch-1e9', { action: 'punch', logKg: 9, silentStrike: true }, 'allout'], ['clap-1e9', { action: 'clap', logKg: 9, silentStrike: true }, 'allout'],
  ['weight-krakatoa', { action: 'weight' }, null, "document.getElementById('grow-what-krakatoa').click()"],
  ['wrestle-throw', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw' }, 'allout'], ['wrestle-throw-1e9', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', logKg: 9 }, 'allout'],
  ['catch-car', { duoOpen: true, duoAction: 'catch', cObj: 'car' }], ['catch-fireball', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 }, 'allout'], ['toss', { duoOpen: true, duoAction: 'catch', cObj: 'partner' }],
  ['collide', { duoOpen: true, duoAction: 'collide' }, 'allout'], ['collide-01c', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: -3 }, 'allout'], ['collide-gb4', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4 }],
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const settled = (pg, id) => pg.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const report = [];
  for (const [w, h] of [[1280, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const pg = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: 'reduce' });
    const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
    await pg.goto(pathToFileURL(prev).href);
    for (const [nm, st, effort, act] of V) {
      await pg.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await pg.reload(); await settled(pg, 'bay'); if (st.duoOpen) await settled(pg, 'duo-bay');
      const bay = st.duoOpen ? 'duo-bay' : 'bay';
      if (effort) { await pg.selectOption(st.duoOpen ? '#duo-effort' : '#effort', effort); await pg.waitForTimeout(250); await settled(pg, bay); }
      if (act) { await pg.evaluate(act); await pg.waitForTimeout(250); await settled(pg, bay); }
      const info = await pg.evaluate((b) => { const t = document.querySelector('#' + b + ' .tile.shimmer'); if (!t) return { none: true, sx: document.documentElement.scrollWidth - document.documentElement.clientWidth };
        const r = t.getBoundingClientRect(), row = t.parentElement.getBoundingClientRect(); const clipped = Array.from(t.querySelectorAll('*')).some((n) => n.scrollWidth > n.clientWidth + 1);
        return { w: r.width, rowW: row.width, clipped, sx: document.documentElement.scrollWidth - document.documentElement.clientWidth }; }, bay);
      report.push([nm, w, scheme, JSON.stringify(info)].join(' '));
      const t = await pg.$('#' + bay + ' .tile.shimmer');
      if (t) { await t.scrollIntoViewIfNeeded(); const tiles = await pg.$('#' + bay + ' .tile.shimmer >> xpath=..'); await tiles.screenshot({ path: path.join(out, `${nm}-${w}-${scheme}-tiles.png`) }); }
      if (nm === 'collide-gb4' || nm === 'throw-inf') await (await pg.$(st.duoOpen ? '#duo-bay .art-figure' : '#hero-art')).screenshot({ path: path.join(out, `${nm}-${w}-${scheme}-art.png`) });
    }
    if (errs.length) report.push('ERRORS ' + errs.join(' | '));
    await pg.close();
  }
  fs.writeFileSync(path.join(out, 'report.txt'), report.join('\n'));
  console.log(report.filter((x) => /clipped":true|"sx":[1-9]|ERRORS/.test(x)).join('\n') || 'no clipping, no sideways scroll, no errors');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
