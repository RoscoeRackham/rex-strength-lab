const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url'), { execSync } = require('child_process');
// Playwright: $PLAYWRIGHT, the cloud sandbox's copy, a local install, or a global `npm install -g playwright`.
const loadPlaywright = () => {
  for (const p of [process.env.PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright']) { if (p) try { return require(p); } catch (e) { /* next */ } }
  return require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
};
const { chromium } = loadPlaywright();
// Chromium: $CHROME, the cloud sandbox's build, or Playwright's own (npx playwright install chromium).
const CHROME = [process.env.CHROME, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => p && fs.existsSync(p));
const { readResult, settle } = require('./make-page-fixture.js');
const BEFORE = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'page-before.json'), 'utf8')).results;
// the two-player engine calls: none may run while the Rex + Ollie element is closed
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
// counts the page's calls to them (and can slow each one down, to force a search into the background)
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0;
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; if (delay) { const t = performance.now(); while (performance.now() - t < delay) { /* slow */ } } return f.apply(this, arguments); }; }
    v = x;
  } });
};
// the section 5 powers, off (BRIEF-gui.md section 5; these keys don't exist before it and are dropped on load)
const POWERS_OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
(async () => {
  const body = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, '..', 'dist', 'preview.html');
  fs.writeFileSync(prev, wrapped);
  const out = path.join(__dirname, '..', 'shots'); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  const only = process.argv[2];
  let problems = 0;
  const fail = (msg) => { problems++; console.log('PROBLEM ' + msg); };
  const okLog = (msg) => console.log('ok   ' + msg);
  // 1280 px and 390 px, light and dark; every tab of both bays. Fails on horizontal scroll (on any tab), console
  // errors, broken numbers (NaN, undefined, a bare Infinity) or dug-in footing (retired) in the page text.
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
  // (and the powers that section 5 of BRIEF-gui.md replaced: Comic ground, Gentle hold, Cool flight)
  const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []).concat(t.match(/dug[ -]in|claws dug|braced|comic switch|under Settings|comic ground|gentle hold|cool flight/gi) || []);
  // the sidebar, top to bottom (BRIEF-gui.md section 2) and what sits in Their powers (section 1)
  const SIDEBAR = ['strength', 'setup', 'ground-sec', 'powers'];
  const IN_POWERS = ['mode-comic', 'mode-real', 'mode-hint', 'bolt-rex', 'bolt-ollie', 'sw-unbreakable', 'sw-recoil', 'air-absorb', 'sw-keep', 'sw-passenger', 'sw-silent', 'sw-soft', 'absorb', 'grow-chips', 'grow-s', 'grow-t'];
  // BRIEF-gui.md section 5: the four default powers on the page
  if (!only) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href);
    const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
    const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
    const bayText = () => page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
    const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
    const chips = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .status-row .status, #bay .status-row > *')).map((n) => n.textContent.trim()));
    // a save from before section 5 (Comic ground off, Gentle hold off, Cool flight on) loads with all four powers on
    await load({ action: 'throw', groundHolds: false, gentleHold: false, coolFlight: true });
    const mig = await page.evaluate(() => ({ ub: document.getElementById('sw-unbreakable').checked, rec: document.getElementById('sw-recoil').checked, keep: document.getElementById('sw-keep').checked, air: document.getElementById('air-absorb').value }));
    const sv = await saved();
    if (!mig.ub || !mig.rec || !mig.keep || mig.air !== '100' || 'groundHolds' in sv || 'gentleHold' in sv || 'coolFlight' in sv || sv.airAbsorb !== 1 || sv.unbreakable !== true) fail('an old save with the retired switches: ' + JSON.stringify({ mig, saved: { groundHolds: sv.groundHolds, gentleHold: sv.gentleHold, coolFlight: sv.coolFlight, airAbsorb: sv.airAbsorb, unbreakable: sv.unbreakable } }));
    else okLog('an old save with Comic ground, Gentle hold and Cool flight loads with the four new powers on; the old keys are dropped');
    // the slider reads its value and what it means
    const readAir = () => page.evaluate(() => ({ big: document.getElementById('air-absorb-big').textContent, read: document.getElementById('air-absorb-read').textContent }));
    const r100 = await readAir();
    await page.evaluate(() => { document.getElementById('powers').open = true; const s = document.getElementById('air-absorb'); s.value = '30'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForTimeout(400); await settle(page, 'bay');
    const r30 = await readAir(), sv30 = await saved();
    if (r100.big !== '100%' || !/drag-free/.test(r100.read) || r30.big !== '30%' || !/air takes 70%/.test(r30.read) || !/booms/.test(r30.read) || Math.abs(sv30.airAbsorb - 0.3) > 1e-9) fail('Air resistance absorbed read-out: ' + JSON.stringify({ r100, r30, saved: sv30.airAbsorb }));
    else okLog('Air resistance absorbed reads ' + r100.big + ' (' + r100.read.slice(0, 40) + '…) and ' + r30.big + ' (' + r30.read.slice(0, 40) + '…)');
    // the presets set effort only: they never move the slider
    const moved = [];
    for (const e of ['rattle', 'plaster', 'windows', 'ground', 'houses', 'block', 'ceiling', 'allout', 'least']) {
      await pick('#effort', e);
      const st = await saved(), v = await page.$eval('#air-absorb', (n) => n.value);
      if (Math.abs(st.airAbsorb - 0.3) > 1e-9 || v !== '30') moved.push(e + ': ' + st.airAbsorb + '/' + v);
    }
    if (moved.length) fail('a preset moved the Air resistance absorbed slider: ' + moved.join('; ')); else okLog('no effort preset moves the Air resistance absorbed slider');
    // windows across the street: a level baseball at 100% never shatters them (no blast from its flight; a landing
    // fast enough to do it is past orbital speed, so it doesn't land), but with the air let through it does: the hint
    // shows. At 10,000 t it can't at 0% either: no hint.
    const hintRe = /Lower Air resistance absorbed/;
    await load({ action: 'throw', obj: 'baseball', angle: 0, logKg: 9, mode: 'comic' }); await pick('#effort', 'windows');
    const hintYes = await bayText();
    await load({ action: 'throw', obj: 'baseball', angle: 0, logKg: 7, mode: 'comic' }); await pick('#effort', 'windows');
    const hintNo = await bayText();
    if (!hintRe.test(hintYes) || !/At 100% air resistance absorbed, a throw makes no blast/.test(hintYes) || hintRe.test(hintNo) || !/Even all-out/.test(hintNo)) fail('the lower-the-slider hint: ' + JSON.stringify({ yes: (hintYes.match(/Even all-out[^.]*\.[^.]*\.[^.]*\./) || [hintYes.slice(0, 200)])[0], no: (hintNo.match(/Even all-out[^.]*\./) || [hintNo.slice(0, 200)])[0] }));
    else okLog('windows preset on a level baseball: the lower-the-slider hint at 10⁶ t (reachable at 0%), none at 10⁴ t (not reachable at 0% either)');
    // each power says where it changed a result
    await load({ action: 'throw' }); await pick('#effort', 'allout');
    const thr = (await chips()).join(' | ');
    await load({ action: 'stomp', logKg: 8 }); await pick('#effort', 'allout');
    const stp = (await chips()).join(' | ');
    const want = [[thr, 'No drag: their power'], [thr, 'His recoil goes into the planet: their power'], [thr, 'Held together by their power'], [stp, 'The ground holds: their power']];
    const missing = want.filter(([t, w]) => !t.includes(w));
    if (missing.length) fail('power labels missing: ' + missing.map(([t, w]) => w + ' in [' + t + ']').join('; ')); else okLog('the powers label their results: ' + want.map(([, w]) => w).join('; '));
    // break the ground: the preset sets Unbreakable footing aside for the move, and the stomp breaks it
    await load({ action: 'stomp' }); await pick('#effort', 'ground');
    const brk = await bayText();
    if (!/Unbreakable footing is set aside for this move/.test(brk) || /none: the ground holds/.test(brk) || !/The least effort that breaks the ground/.test(brk)) fail('break the ground with Unbreakable footing on: ' + brk.slice(0, 300));
    else okLog('break the ground on the Stomp tab: Unbreakable footing set aside for the move, and the ground breaks');
    // the All-Star Superman baseball, level, all-out: drag-free it leaves the Earth with no fireball; with the air at
    // 0% and Things keep their form off, today's story (a fireball, the ball vaporized)
    const allStar = { action: 'throw', obj: 'allstar', logKg: Math.log10(1.81436948e23) + 1e-12, angle: 0, mode: 'comic' };
    await load(allStar); await pick('#effort', 'allout');
    const as100 = await page.$eval('#bay .verdict', (n) => n.textContent);
    await load(Object.assign({}, allStar, { airAbsorb: 0, keepForm: false })); await pick('#effort', 'allout');
    const as0 = await page.$eval('#bay .verdict', (n) => n.textContent);
    if (!/leaves the Earth/.test(as100) || !/there is no fireball/.test(as100) || !/turns into a fireball/.test(as0)) fail('All-Star baseball: 100% ' + as100.slice(0, 200) + ' | 0% ' + as0.slice(0, 200));
    else okLog('All-Star baseball, level, all-out: at 100% "' + as100.slice(0, 70) + '…"; at 0% with Things keep their form off, a fireball');
    // the two-player tests offer the not-so-heroic presets, and on Collide 'risk cracking the plaster' finds an effort
    // (Rex bolted, Ollie charging: the hit's push into the unbreakable ground shakes it)
    const duoOpts = [];
    for (const tab of ['arm', 'wrestle', 'catch', 'collide']) {
      await load({ duoOpen: true, duoAction: tab }); await settle(page, 'duo-bay');
      const opts = await page.$$eval('#duo-effort option', (os) => os.map((o) => o.value));
      if (!['rattle', 'plaster', 'windows', 'ground', 'houses', 'block'].every((e) => opts.includes(e))) duoOpts.push(tab + ': ' + opts.join(','));
    }
    if (duoOpts.length) fail('two-player presets missing: ' + duoOpts.join('; ')); else okLog('every two-player test offers the not-so-heroic presets');
    // Rex bolted (the page's immovable object): the hit's momentum goes through his feet into the unbreakable ground.
    // Standing, his feet slide and the ground takes only his friction, so the honest answer is that it never does.
    const colRead = async (anchor) => { await load({ duoOpen: true, duoAction: 'collide', anchor }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      return page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' ')); };
    const colB = await colRead('bolted'), colF = await colRead('friction');
    if (!/Effort: /.test(colB) || !/The least effort that shakes the ground enough that plaster may crack/.test(colB)) fail('Collide, plaster preset, Rex bolted: ' + colB.slice(0, 300));
    else okLog('Collide, plaster preset, Rex bolted: ' + colB.slice(0, 90) + '…');
    if (!/Even all-out, this test doesn’t shake the ground enough that plaster may crack/.test(colF)) fail('Collide, plaster preset, Rex standing: ' + colF.slice(0, 300));
    else okLog('Collide, plaster preset, Rex standing: says it never does (his feet slide)');
    if (errs.length) fail('page errors in the powers checks: ' + errs.slice(0, 3).join(' | '));
    await page.close();
  }
  await browser.close();
  if (problems) { console.log('PROBLEMS: see above'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
