// Lens item 6: the page passes takenBack exactly the run it shows. Spies on the page's own engine calls (window.DinoPhys
// as the page receives it) and, for every takenBack call, finds the move call whose result it was handed and checks the
// contexts, the object, the angle, whoA and the effort; then the tile's figures and the glows against that tally.
// usage: node spy.js <dist/index.html> [label]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', 'repo', 'rex-strength-lab', 'dist', 'index.html'), 'utf8');
const prev = path.join(__dirname, '..', 'spy-page.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const spyInit = () => {
  let v; window.__log = [];
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    const wrap = (o, k) => { const f = o[k]; if (typeof f !== 'function') return; o[k] = function (...args) { const res = f.apply(this, args); window.__log.push({ k, args, res }); return res; }; };
    for (const k of ['throwObject', 'jump', 'stomp', 'punch', 'clap', 'throwPartner', 'catchLeg', 'tossPartner', 'collide']) wrap(x, k);
    wrap(x.RESTRAINT, 'takenBack');
    v = x;
  } });
};
const STATES = [];
const solo = (st) => STATES.push(Object.assign({ duoOpen: false }, st));
const duo = (st) => STATES.push(Object.assign({ duoOpen: true }, st));
for (const effort of ['least', 'allout']) {
  for (const [obj, angle] of [['car', 45], ['person', 45], ['baseball', 20], ['pyramid', 90], ['bus', 70]]) solo({ action: 'throw', obj, angle, effort });
  solo({ action: 'jump', softLanding: true, effort }); solo({ action: 'stomp', effort }); solo({ action: 'punch', silentStrike: true, logKg: 9, effort }); solo({ action: 'clap', silentStrike: true, logKg: 9, effort });
  for (const who of ['rex', 'ollie']) duo({ duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: who, wAngle: 30, duoEffort: effort, logKg: 9 });
  for (const [cObj, cStyle, cLogD] of [['baseball', 'hard', 1], ['car', 'easy', 1.5], ['person', 'easy', 1], ['partner', 'easy', 1], ['partner', 'hard', 2]]) duo({ duoAction: 'catch', cObj, cStyle, cLogD, duoEffort: effort });
  for (const who of ['rex', 'ollie']) for (const colSrc of ['sprint', 'set']) duo({ duoAction: 'collide', colWho: who, colSrc, colGB: -3, duoEffort: effort });
}
// different bodies (the return leg worked out on its own), Ollie's own effort, a dense Rex, a different surface
duo({ duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, oM: 6000, duoEffort: 'allout' });
duo({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, oSame: false, oLogKg: 7, duoEffort: 'allout' });
duo({ duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'ollie', wAngle: 60, oM: 9000, duoEffort: 'allout', logKg: 10 });
duo({ duoAction: 'collide', colWho: 'rex', colSrc: 'set', colGB: -3, oM: 30000, duoEffort: 'allout' });
duo({ duoAction: 'collide', colWho: 'ollie', colSrc: 'set', colGB: -3, oEffortOwn: true, oEffortLogKg: 6, duoEffort: 'allout' });
solo({ action: 'throw', obj: 'car', angle: 45, m: 1e12, effort: 'allout', logKg: 12 });
solo({ action: 'stomp', surface: 'sand', effort: 'allout', logKg: 8 });
solo({ action: 'throw', obj: 'car', angle: 45, effort: 'custom', effortLogKg: 4.5 });
duo({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, duoEffort: 'custom', duoLogKg: 5 });

if (process.env.SPY3) { STATES.length = 0;
  duo({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, duoEffort: 'allout', logKg: 14 });
  duo({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 3, duoEffort: 'allout', logKg: 13 });
  duo({ duoAction: 'catch', cObj: 'person', cStyle: 'hard', cLogD: 4.5, duoEffort: 'allout', logKg: 12 });
} else if (process.env.SPY2) { STATES.length = 0;
  for (const who of ['rex', 'ollie']) duo({ duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: who, wAngle: 30, duoEffort: 'allout', logKg: 9 });
  for (const who of ['rex', 'ollie']) duo({ duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: who, wAngle: 50, duoEffort: 'allout', logKg: 9, oOwn: 7 });
  for (const [cObj, cStyle, cLogD] of [['baseball', 'hard', 1], ['car', 'easy', 1.5], ['person', 'hard', 4.5], ['partner', 'hard', 2]]) duo({ duoAction: 'catch', cObj, cStyle, cLogD, duoEffort: 'allout', logKg: 12 });
  duo({ duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, duoEffort: 'allout', logKg: 9, oOwn: 6 });
  for (const who of ['rex', 'ollie']) duo({ duoAction: 'collide', colWho: who, colSrc: 'sprint', duoEffort: 'allout', logKg: 9, oOwn: 7 });
  for (const who of ['rex', 'ollie']) duo({ duoAction: 'collide', colWho: who, colSrc: 'set', colGB: -3, duoEffort: 'allout', logKg: 9 });
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript(spyInit);
  await page.goto(pathToFileURL(prev).href);
  const bad = []; let n = 0;
  for (const st of STATES) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ saveV: 3 }, x))), st);
    await page.reload();
    const bay = st.duoOpen ? 'duo-bay' : 'bay';
    await page.waitForFunction((b) => { const e = document.getElementById(b); return e && e.children.length > 0 && !/working it out|Working out/i.test(e.textContent); }, bay, { timeout: 120000, polling: 50 });
    if (st.duoOpen && (st.oOwn || (st.duoEffort && st.duoEffort !== 'least'))) {
      const settleD = () => page.waitForFunction(() => { const e = document.getElementById('duo-bay'); return e && e.children.length > 0 && !/working it out|Working out/i.test(e.textContent); }, null, { timeout: 120000, polling: 50 });
      if (st.oOwn) { await page.evaluate(() => document.getElementById('o-own').click()); await page.waitForTimeout(300); await settleD();
        await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, st.oOwn); await page.waitForTimeout(600); await settleD(); }
      if (st.duoEffort && st.duoEffort !== 'least') { await page.selectOption('#duo-effort', st.duoEffort); await page.waitForTimeout(600); await settleD(); }
    }
    if (!st.duoOpen && st.effort && st.effort !== 'least') {
      await page.evaluate(() => { for (const n of document.getElementById('bay').children) n.r5old = true; });
      if (st.effort === 'custom') await page.evaluate((v) => { const sl = document.getElementById('effort-use'); sl.value = String(v); sl.dispatchEvent(new Event('input', { bubbles: true })); }, st.effortLogKg);
      else await page.selectOption('#effort', st.effort);
      await page.waitForFunction(() => Array.from(document.getElementById('bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 60000 });
    }
    await page.waitForTimeout(150);
    await page.waitForFunction((b) => { const e = document.getElementById(b); return e && !/working it out|Working out/i.test(e.textContent); }, bay, { timeout: 120000, polling: 50 });
    const res = await page.evaluate(([duoOpen]) => {
      const P = window.DinoPhys, D = window.DINO_DATA, L = window.EnergyLadder, log = window.__log;
      const tbs = log.filter((e) => e.k === 'takenBack');
      // the last takenBack for the bay on screen: solo moves vs duo moves
      const DUOM = ['wrestleThrow', 'catch', 'toss', 'collide'];
      const mine = tbs.filter((e) => (duoOpen ? DUOM.includes(e.args[0]) : !DUOM.includes(e.args[0])));
      const t = mine[mine.length - 1];
      if (!t) return { none: true, tile: !!document.querySelector((duoOpen ? '#duo-bay' : '#bay') + ' .tile.shimmer') };
      const [move, r, o] = t.args, tb = t.res, issues = [];
      const same = (a, b, keys) => keys.filter((k) => !(a[k] === b[k] || (typeof a[k] === 'number' && typeof b[k] === 'number' && Number.isNaN(a[k]) && Number.isNaN(b[k]))));
      const CK = ['F', 'use', 'mode', 'surface', 'anchor', 'airAbsorb', 'keepForm', 'unbreakable', 'ownRecoil', 'safePassenger', 'silentStrike', 'softLanding', 'noKnockback', 'groundHolds', 'meanIt'];
      const bodyEq = (a, b) => a === b || (a && b && a.m === b.m && a.H === b.H && a.build === b.build);
      const src = (k, pred) => log.filter((e) => e.k === k && pred(e));
      let shown = null;
      if (['throw', 'jump', 'stomp', 'punch', 'clap'].includes(move)) {
        const fn = move === 'throw' ? 'throwObject' : move;
        const m = src(fn, (e) => e.res === r);
        if (!m.length) issues.push('no ' + fn + ' call returned the tally\'s result');
        else { const a = m[m.length - 1].args; const d = same(a[0], o, CK); if (d.length) issues.push('ctx keys differ: ' + d.join(',')); if (!bodyEq(a[0].body, o.body)) issues.push('body differs');
          if (move === 'throw') { if (a[1] !== o.obj) issues.push('obj differs'); if (a[2] !== o.angle) issues.push('angle ' + a[2] + ' vs ' + o.angle); } shown = a; }
      } else if (move === 'wrestleThrow') {
        const m = src('throwPartner', (e) => e.res === r);
        if (!m.length) issues.push('no throwPartner call returned it');
        else { const a = m[m.length - 1].args; if (a[0] !== o.A) issues.push('A is not the thrower ctx'); if (a[1] !== o.B) issues.push('B is not the thrown ctx'); if (a[2] !== o.angle) issues.push('angle'); if (a[0].body.build !== o.whoA) issues.push('whoA ' + o.whoA + ' but thrower ' + a[0].body.build); }
      } else if (move === 'catch') {
        const ma = src('catchLeg', (e) => e.res === r.a);
        if (!ma.length) issues.push('no catchLeg for a');
        else { const a = ma[ma.length - 1].args; if (a[0] !== o.A || a[1] !== o.B) issues.push('a ctxs'); if (a[2] !== o.obj) issues.push('obj'); if (o.A.body.build !== 'rex' || o.whoA !== 'rex') issues.push('whoA'); }
        if (r.b && r.b !== r.a) { const mb = src('catchLeg', (e) => e.res === r.b); if (!mb.length) issues.push('no catchLeg for b'); else { const b = mb[mb.length - 1].args; if (b[0] !== o.B || b[1] !== o.A) issues.push('b ctxs'); } }
        // the round trip rule: b only after a clean catch
        const ok = (Lg) => Lg && Lg.result === 'caught' && Lg.catch && !Lg.catch.carried && !Lg.bursts && !(Lg.recoil && Lg.recoil.outOfRange);
        if (!!r.b !== ok(r.a)) issues.push('round trip rule: b ' + !!r.b + ' a ' + (r.a && r.a.result));
      } else if (move === 'toss') {
        const m = src('tossPartner', (e) => e.res === r);
        if (!m.length) issues.push('no tossPartner'); else { const a = m[m.length - 1].args; if (a[0] !== o.A) issues.push('A'); if (!bodyEq(a[1], o.B.body)) issues.push('B body'); if (o.whoA !== 'rex') issues.push('whoA'); }
      } else if (move === 'collide') {
        const m = src('collide', (e) => e.res === r);
        if (!m.length) issues.push('no collide'); else { const a = m[m.length - 1].args; if (a[0] !== o.A || a[1] !== o.B) issues.push('ctxs'); if (a[0].body.build !== o.whoA) issues.push('whoA ' + o.whoA + ' vs charger ' + a[0].body.build); }
      }
      // the tile: its value word from by.rex.E and each line's figure
      const tileEl = document.querySelector((duoOpen ? '#duo-bay' : '#bay') + ' .tile.shimmer');
      const gl = L.glow(tb.by.rex.E, D.energyRefs), word = gl.none ? 'none' : gl.text;
      const tileTxt = tileEl ? tileEl.textContent.replace(/ /g, ' ') : null;
      if (tb.E > 0 && !tileEl) issues.push('no tile though E > 0');
      if (!(tb.E > 0) && tileEl) issues.push('tile though E = 0');
      if (tileEl) { const v = tileEl.querySelector('.v').textContent.replace(/ /g, ' '); const want = duoOpen ? 'Rex: ' + word : word.charAt(0).toUpperCase() + word.slice(1); if (v !== want) issues.push('value ' + v + ' vs ' + want); }
      // glows
      const hg = document.getElementById('hero-glow');
      if (!duoOpen) { const s = Number(hg.dataset.strength); const want = gl.none ? 0 : gl.strength; if (Math.abs(s - want) > 1e-12) issues.push('header glow ' + s + ' vs ' + want); if (Math.abs(Number(hg.style.getPropertyValue('--glow')) - Math.sqrt(want)) > 1e-9) issues.push('--glow not sqrt'); }
      if (move === 'collide') { const cg = document.querySelector('#duo-bay .glow'); if (cg) { const s = Number(cg.dataset.strength); if (Math.abs(s - (gl.none ? 0 : gl.strength)) > 1e-12) issues.push('collide glow ' + s); } }
      return { move, E: tb.E, rex: tb.by.rex.E, ollie: tb.by.ollie.E, parts: Object.fromEntries(Object.entries(tb.parts).filter(([, x]) => x > 0)), F: shown && shown[0] ? shown[0].F : (o.A ? o.A.F : null), use: shown && shown[0] ? shown[0].use : (o.A ? o.A.use : null), issues, tile: tileTxt && tileTxt.slice(0, 260), nTb: tbs.length };
    }, [!!st.duoOpen]);
    n++;
    const lab = JSON.stringify(st);
    if (res.issues && res.issues.length) bad.push(lab + ' -> ' + res.issues.join('; '));
    console.log((res.issues && res.issues.length ? 'BAD  ' : 'ok   ') + lab.slice(0, 160) + ' | ' + (res.none ? 'no tally (tile ' + res.tile + ')' : res.move + ' E=' + (res.E === Infinity ? 'inf' : Number(res.E).toPrecision(3)) + ' rex=' + Number(res.rex).toPrecision(3) + ' ollie=' + Number(res.ollie).toPrecision(3) + ' ' + JSON.stringify(res.parts) + ' use=' + res.use + ' | ' + (res.tile || '-')));
  }
  console.log('\n' + n + ' states; ' + bad.length + ' with issues; page errors: ' + errs.length + ' ' + errs.slice(0, 3).join(' | '));
  for (const b of bad) console.log('ISSUE ' + b);
  await browser.close();
})();
