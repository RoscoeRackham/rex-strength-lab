// Interaction sequences on the branch page, then the same final saved state loaded fresh on main (and on the branch):
// after any sequence the results shown must equal what main shows for that saved state.
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = path.join(__dirname, '..');
const I = require(path.join(S, 'intended.js'));
const URL = { main: 'file://' + path.join(S, 'main.html'), branch: 'file://' + path.join(S, 'branch.html') };
const GRAB = (sel) => {
  const bay = document.querySelector(sel);
  const norm = (t) => t.replace(/\s+/g, ' ').trim();
  const q = (s) => Array.from(bay.querySelectorAll(s)).map((e) => norm(e.textContent));
  return { verdict: q('.verdict'), status: q('.status-row'), tiles: q('.tiles'), effort: q('.effort-read'), happens: q('.happens'), callout: q('.callout'), math: q('.math .eq') };
};
async function waitStable(page, sel, timeout = 120000) {
  const t0 = Date.now(); let last = null, same = 0;
  while (Date.now() - t0 < timeout) {
    const txt = await page.evaluate((s) => { const b = document.querySelector(s); return b ? b.textContent : null; }, sel);
    const ok = txt && !/working it out|working out/i.test(txt);
    if (ok && txt === last) { same++; if (same >= 3) return true; } else same = 0;
    last = txt; await page.waitForTimeout(150);
  }
  return false;
}
const SEQS = [
  ['open-at-load-mid-solo-search', { duoOpen: false, duoAction: 'collide', action: 'throw', logKg: 12, surface: 'granite', nowait: 1 }, [['toggleDuo'], ['wait', 20], ['click', '#tab-pull']]],
  ['open-close-open-fast', { duoOpen: false, duoAction: 'catch', cObj: 'bus', action: 'sprint', logKg: 10, nowait: 1 }, [['toggleDuo'], ['wait', 30], ['toggleDuo'], ['wait', 30], ['toggleDuo']]],
  ['duo-tab-then-close-then-rex-setting', { duoOpen: true, duoAction: 'arm', action: 'stomp', logKg: 9, nowait: 1 }, [['click', '#tab-catch'], ['wait', 30], ['toggleDuo'], ['select', '#surface', 'gravel'], ['wait', 100], ['toggleDuo']]],

  // [name, initial saved state, steps]; a step is [kind, ...]
  ['near-in-rex-bay', { duoOpen: true, duoAction: 'catch', action: 'throw', logKg: 8 }, [['open', '#bay details.effort-adjust'], ['fill', '#near', '40']]],
  ['near-in-duo-bay', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'jump', logKg: 7 }, [['open', '#duo-bay details.effort-adjust'], ['fill', '#duo-near', '200']]],
  ['bolt-ollie-arm', { duoOpen: true, duoAction: 'arm', action: 'pull', logKg: 6, surface: 'granite' }, [['openPowers'], ['check', '#bolt-ollie', true], ['wait', 300], ['check', '#bolt-rex', true]]],
  ['bolt-toggle-collide-midsearch', { duoOpen: true, duoAction: 'collide', colMode: 'push', action: 'sprint', logKg: 9 }, [['openPowers'], ['check', '#bolt-rex', true], ['wait', 50], ['check', '#bolt-ollie', true], ['wait', 50], ['check', '#bolt-rex', false]]],
  ['tab-midsearch-then-ground', { duoOpen: true, duoAction: 'catch', cObj: 'car', action: 'throw', logKg: 9 }, [['click', '#tab-weight'], ['wait', 30], ['select', '#surface', 'sand'], ['click', '#tab-stomp']]],
  ['close-midsearch-ground-reopen', { duoOpen: true, duoAction: 'collide', action: 'throw', logKg: 10 }, [['wait', 100], ['toggleDuo'], ['select', '#surface', 'ice'], ['wait', 200], ['toggleDuo']]],
  ['ollie-height-mass', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both', action: 'walk', walker: 'both', logKg: 6 }, [['openOllie'], ['fill', '#o-height', '5'], ['wait', 100], ['fill', '#o-mass', '9000']]],
  ['strength-chip-real', { duoOpen: true, duoAction: 'arm', action: 'lift', logKg: 5 }, [['openPowers'], ['clickChip', 0], ['wait', 50], ['click', '#mode-real'], ['wait', 50], ['clickChip', 3]]],
  ['comic-ground-switches', { duoOpen: true, duoAction: 'catch', action: 'clap', logKg: 11 }, [['openPowers'], ['check', '#ground-holds', true], ['check', '#sw-silent', true], ['check', '#sw-cool', true]]],
  ['duo-tab-cycle', { duoOpen: true, duoAction: 'arm', action: 'punch', logKg: 8, anchor: 'bolted' }, [['click', '#tab-wrestle'], ['wait', 40], ['click', '#tab-collide'], ['wait', 40], ['click', '#tab-catch'], ['wait', 40], ['click', '#tab-arm']]],
  ['resize-open', { duoOpen: true, duoAction: 'collide', action: 'throw', logKg: 7 }, [['resize', 700], ['wait', 400], ['resize', 1280]]],
  ['wangle-then-throw-angle', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'throw', logKg: 7, angle: 45 }, [['range', '#w-angle', '70'], ['wait', 300], ['range', '#angle', '20']]],
];
async function step(page, s) {
  const [k, a, b] = s;
  if (k === 'wait') return page.waitForTimeout(a);
  if (k === 'fill') { await page.fill(a, b); await page.press(a, 'Enter'); return; }
  if (k === 'open') return page.evaluate((sel) => { const d = document.querySelector(sel); if (d) d.open = true; }, a);
  if (k === 'openPowers') return page.evaluate(() => { document.getElementById('powers').open = true; });
  if (k === 'openOllie') return page.evaluate(() => { const d = document.getElementById('ollie-setup'); if (d) d.open = true; });
  if (k === 'check') return page.setChecked(a, b);
  if (k === 'click') return page.click(a);
  if (k === 'select') return page.selectOption(a, b);
  if (k === 'toggleDuo') return page.click('#duo > summary');
  if (k === 'clickChip') return page.evaluate((i) => document.querySelectorAll('#tier-chips .chip')[i].click(), a);
  if (k === 'resize') return page.setViewportSize({ width: a, height: 900 });
  if (k === 'range') return page.evaluate(([sel, v]) => { const e = document.querySelector(sel); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, [a, b]);
}
async function fresh(browser, variant, st) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const saved = Object.assign({}, st);
  if (variant === 'main') { saved.group = 'solo'; delete saved.duoOpen; delete saved.wAngle; }
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('x', 1); } }, JSON.stringify(saved));
  const page = await ctx.newPage();
  await page.goto(URL[variant]);
  await waitStable(page, '#bay');
  const solo = await page.evaluate(GRAB, '#bay');
  let duo;
  if (variant === 'main') {
    // Wrestle's throw on main uses the one angle
    if (st.wAngle != null && st.wAngle !== st.angle) await page.evaluate((a) => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); s.angle = a; s.group = 'duo'; localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st.wAngle).then(() => page.reload());
    else await page.click('#grp-duo');
    await waitStable(page, '#bay'); duo = await page.evaluate(GRAB, '#bay');
  } else { await waitStable(page, '#duo-bay'); duo = await page.evaluate(GRAB, '#duo-bay'); }
  await ctx.close();
  return { solo, duo };
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let FORM = I.SPRINT_STAND_FORMULA, BOLT = false;
  const mapA = (o) => JSON.parse(JSON.stringify(o), (k, v) => { if (typeof v !== 'string') return v; v = I.mapMain(v).split(I.SPRINT_MAIN_FORMULA).join(FORM); if (BOLT) v = v.replace(new RegExp(I.SPRINT_MAIN_STRENGTH.source, 'g'), (m, x) => I.SPRINT_BOLT_STRENGTH(x)); return v; });
  const strip = (o) => JSON.parse(JSON.stringify(o), (k, v) => (typeof v === 'string' ? v.replace(new RegExp(I.SPRINT_BOLT_EFFORT.source, 'g'), '').replace(new RegExp(I.SPRINT_TOO_GENTLE.source, 'g'), '').replace(/\s+/g, ' ').trim() : v));
  let bad = 0;
  for (const [name, st, steps] of SEQS.filter((x) => !process.env.ONLY || new RegExp(process.env.ONLY).test(x[0]))) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('x', 1); } }, JSON.stringify(st));
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(URL.branch);
    if (!st.nowait) await waitStable(page, '#bay');
    for (const s of steps) await step(page, s);
    await page.waitForTimeout(400);
    await waitStable(page, '#bay'); await waitStable(page, '#duo-bay');
    await page.waitForTimeout(800);
    await waitStable(page, '#bay'); await waitStable(page, '#duo-bay');
    const after = { solo: await page.evaluate(GRAB, '#bay'), duo: await page.evaluate(GRAB, '#duo-bay') };
    const fin = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
    await ctx.close();
    const fb = await fresh(browser, 'branch', fin), fm = await fresh(browser, 'main', fin);
    BOLT = fin.anchor === 'bolted'; FORM = BOLT ? I.SPRINT_BOLT_FORMULA : I.SPRINT_STAND_FORMULA;
    const r1 = JSON.stringify(after) === JSON.stringify(fb);
    const r2 = JSON.stringify(strip(after)) === JSON.stringify(strip(mapA(fm)));
    if (!r1 || !r2 || errs.length) bad++;
    console.log(name, '| after-sequence == branch fresh load:', r1, '| == main fresh load (mapped):', r2, errs.length ? '| errors ' + JSON.stringify(errs) : '');
    if (!r1) for (const g of ['solo', 'duo']) for (const k of Object.keys(after[g])) if (JSON.stringify(after[g][k]) !== JSON.stringify(fb[g][k])) console.log('   seq vs branch-fresh', g, k, '\n     seq  ', JSON.stringify(after[g][k]).slice(0, 400), '\n     fresh', JSON.stringify(fb[g][k]).slice(0, 400));
    if (!r2) for (const g of ['solo', 'duo']) for (const k of Object.keys(after[g])) if (JSON.stringify(strip(after[g][k])) !== JSON.stringify(strip(mapA(fm[g][k])))) console.log('   seq vs main-fresh', g, k, '\n     seq ', JSON.stringify(after[g][k]).slice(0, 400), '\n     main', JSON.stringify(mapA(fm[g][k])).slice(0, 400));
  }
  console.log(bad ? bad + ' sequences differ' : 'all sequences match');
  await browser.close();
})();
