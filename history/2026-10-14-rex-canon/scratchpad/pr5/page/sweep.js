const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dist = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', prev = path.join(__dirname, 'preview-sweep.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(dist, 'utf8') + '</body></html>');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false };
const states = [];
const dials = [{ logKg: 4.96 }, { logKg: 9 }, { logKg: 12 }, { inf: true }];
for (const d of dials) for (const pick of ['least', 'allout']) {
  for (const a of [{ action: 'throw', obj: 'car' }, { action: 'throw', obj: 'person' }, { action: 'throw', obj: 'baseball', angle: 0 }, { action: 'stomp' }, { action: 'jump', softLanding: true }, { action: 'punch', silentStrike: true }, { action: 'clap', silentStrike: true }])
    for (const pw of [{}, { anchor: 'bolted' }, OFF]) states.push(Object.assign({ pick }, d, a, pw));
  for (const a of [{ duoAction: 'wrestle', wrestleMove: 'throw' }, { duoAction: 'catch', cObj: 'car' }, { duoAction: 'catch', cObj: 'person', cStyle: 'hard' }, { duoAction: 'catch', cObj: 'partner' }, { duoAction: 'collide' }, { duoAction: 'collide', colWho: 'rex' }, { duoAction: 'collide', colSrc: 'jump' }])
    for (const pw of [{}, { anchor: 'bolted' }, OFF]) states.push(Object.assign({ duoOpen: true, pick: pick === 'least' ? 'least' : 'allout' }, d, a, pw));
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const out = [];
  for (const st of states) {
    const { pick, ...s } = st; const duo = !!s.duoOpen, bayId = duo ? 'duo-bay' : 'bay';
    const e0 = errs.length;
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, s)); await page.reload(); await settled('bay'); if (duo) await settled('duo-bay');
    if (pick === 'allout') { await page.selectOption(duo ? '#duo-effort' : '#effort', 'allout'); await page.waitForTimeout(150); await settled(bayId); }
    const r = await page.evaluate((id) => { const bay = document.getElementById(id), t = bay.querySelector('.tile.shimmer'); const g = id === 'bay' ? document.getElementById('hero-glow') : bay.querySelector('.glow');
      return { tile: t ? t.textContent.replace(/ /g, ' ') : null, last: t ? t.parentElement.lastElementChild === t : null, glow: g ? (g.hidden ? 0 : Number(g.dataset.strength)) : null, text: bay.textContent }; }, bayId);
    const bad = (r.tile || '').match(/∞|NaN|undefined|Infinity/g);
    out.push({ st, tile: r.tile, last: r.last, glow: r.glow, bad, errs: errs.slice(e0), plush: /heat in his (indestructible )?plush/.test(r.text), drawYet: /draw yet|drawn here yet/.test(r.text) });
  }
  fs.writeFileSync(path.join(__dirname, 'sweep-out.json'), JSON.stringify(out, null, 1));
  console.log('states', out.length, 'tiles', out.filter((x) => x.tile).length, 'bad', out.filter((x) => x.bad).length, 'notLast', out.filter((x) => x.tile && !x.last).length, 'errs', out.filter((x) => x.errs.length).length, 'drawYet', out.filter((x) => x.drawYet).length);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
