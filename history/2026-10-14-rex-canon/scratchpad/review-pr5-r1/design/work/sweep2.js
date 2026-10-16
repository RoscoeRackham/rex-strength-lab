const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const states = [];
for (const action of ['throw', 'jump', 'stomp', 'punch', 'clap']) for (const k of [5, 9, 14, 20, 'inf']) for (const eff of ['allout', 'least']) {
  if (eff === 'least' && k !== 9) continue;
  const st = Object.assign({ action, obj: 'car', softLanding: true, silentStrike: true }, k === 'inf' ? { inf: true } : { logKg: k });
  states.push([action + ' ' + k + ' ' + eff, st, eff]);
}
for (const k of [9, 14, 'inf']) for (const [nm, x] of [['wthrow', { duoAction: 'wrestle', wrestleMove: 'throw' }], ['catch car', { duoAction: 'catch', cObj: 'car' }], ['catch person', { duoAction: 'catch', cObj: 'person' }], ['toss', { duoAction: 'catch', cObj: 'partner' }], ['collide', { duoAction: 'collide' }]])
  states.push([nm + ' ' + k, DUO(Object.assign({ action: 'walk' }, x, k === 'inf' ? { inf: true } : { logKg: k })), 'allout']);
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const pg = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto(url);
  for (const [nm, st, eff] of states) {
    try { await loadOn(pg, st, eff); } catch (e) { console.log(nm, 'LOAD FAIL', e.message.slice(0, 100)); continue; }
    const r = await pg.evaluate((duo) => {
      const b = document.getElementById(duo ? 'duo-bay' : 'bay'), ts = b.querySelectorAll('.tile.shimmer'), t = ts[0];
      const h = document.getElementById('hero-glow'), c = document.querySelector('#duo-bay .glow');
      const txt = t ? t.textContent.replace(/ /g, ' ') : '';
      return { n: ts.length, last: t ? t.parentElement.lastElementChild === t : null, v: t ? t.querySelector('.v').textContent.replace(/ /g, ' ') : null, bad: /∞|NaN|undefined|Infinity/.test(txt), s0: t ? t.querySelectorAll('.s')[0].textContent.replace(/ /g, ' ').slice(0, 140) : '', hero: h.hidden ? 0 : +(+h.dataset.strength).toFixed(3), col: c ? (c.hidden ? 0 : +(+c.dataset.strength).toFixed(3)) : null, sx: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    }, !!st.duoOpen);
    const flag = (r.n > 1 || (r.n === 1 && !r.last) || r.bad || r.sx > 0) ? '  <<<' : '';
    console.log(nm.padEnd(22), 'n', r.n, 'v', String(r.v).padEnd(28), 'hero', r.hero, 'col', r.col, '|', r.s0, flag);
  }
  console.log('errs', errs.slice(0, 5));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
