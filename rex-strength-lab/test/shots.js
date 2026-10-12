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
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
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
  const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []).concat(t.match(/dug[ -]in|claws dug|braced/gi) || []);
  // the sidebar, top to bottom (BRIEF-gui.md section 2) and what sits in Their powers (section 1)
  const SIDEBAR = ['strength', 'setup', 'ground-sec', 'powers'];
  const IN_POWERS = ['mode-comic', 'mode-real', 'mode-hint', 'bolt-rex', 'bolt-ollie', 'ground-holds', 'sw-gentle', 'sw-passenger', 'sw-silent', 'sw-soft', 'sw-cool', 'absorb', 'grow-chips', 'grow-s', 'grow-t'];
  for (const [w, h, scheme] of [[1280, 900, 'light'], [1280, 900, 'dark'], [390, 844, 'light'], [390, 844, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await page.addInitScript(countDuoCalls, { names: DUO_FNS });
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(3000);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const texts = [];
    // first load: the Rex + Ollie element is closed and nothing in it has been worked out
    const first = await page.evaluate(() => ({ open: document.getElementById('duo').open, calls: window.__duoCalls, kids: document.getElementById('duo-bay').children.length }));
    if (first.open || first.calls || first.kids) texts.push('first load: Rex + Ollie element ' + JSON.stringify(first));
    // the sidebar's order, Size and density open on a wide screen, and every power inside Their powers only
    const side = await page.evaluate((ids) => {
      const aside = document.querySelector('aside.panel-controls'), pos = ids.map((id) => { const n = document.getElementById(id); return n && aside.contains(n) ? Array.from(aside.querySelectorAll('*')).indexOf(n) : -1; });
      return { pos, setupOpen: document.getElementById('setup').open };
    }, SIDEBAR);
    if (side.pos.some((p) => p < 0) || side.pos.some((p, i) => i && p <= side.pos[i - 1])) texts.push('sidebar order ' + JSON.stringify(side.pos));
    if (w >= 920 && !side.setupOpen) texts.push('Size and density is closed on first load at ' + w + ' px');
    const placed = await page.evaluate((ids) => ids.filter((id) => { const n = document.getElementById(id); return !n || !document.getElementById('powers').contains(n) || document.getElementById('setup').contains(n) || document.getElementById('ollie-setup').contains(n); }), IN_POWERS);
    if (placed.length) texts.push('not in Their powers (or also elsewhere): ' + placed.join(', '));
    const gone = await page.evaluate(() => ['anchor', 'o-anchor', 'grp-solo', 'grp-duo', 'comic-setup'].filter((id) => document.getElementById(id)));
    if (gone.length) texts.push('retired controls still on the page: ' + gone.join(', '));
    const boltNames = await page.evaluate(() => ['bolt-rex', 'bolt-ollie'].map((id) => document.getElementById(id).getAttribute('aria-label')));
    if (boltNames[0] !== 'Bolted to the planet: Rex' || boltNames[1] !== 'Bolted to the planet: Ollie') texts.push('Bolted switch names ' + JSON.stringify(boltNames));
    if (!only) await page.screenshot({ path: path.join(out, `full-${w}-${scheme}.png`), fullPage: true });
    for (const tab of (only ? [only] : SOLO.concat(DUO))) {
      const duo = DUO.includes(tab);
      if (duo && !(await page.evaluate(() => document.getElementById('duo').open))) { await page.click('#duo > summary'); await page.waitForTimeout(300); }
      await page.click('#tab-' + tab);
      await page.waitForTimeout(duo ? 900 : 400);
      // the whole page, not only the bay, and folded parts too (closed <details> are left out of innerText)
      const t = await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return b.textContent; });
      const b = bad(t);
      if (b.length) texts.push(tab + ': ' + b.join(', '));
      const ovTab = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ovTab > 0) texts.push(tab + ': scrolls sideways ' + ovTab + ' px');
      // a two-player result never lands in Rex's bay, nor a solo one in the Rex + Ollie element
      const mixed = await page.evaluate(() => !!document.querySelector('#bay .duo-head, #bay #duo-effort, #duo-bay #effort'));
      if (mixed) texts.push(tab + ': one bay shows the other’s result');
      const shot = await page.$(duo ? '#duo' : 'main.panel');
      if (scheme === 'light' || w === 390) await shot.screenshot({ path: path.join(out, `${tab}-${w}-${scheme}.png`) });
    }
    if (!only) await page.screenshot({ path: path.join(out, `full-open-${w}-${scheme}.png`), fullPage: true });
    // each growth mode, with Their powers open (the page always opens on the endless ocean)
    if (!only) {
      await page.click('#tab-weight');
      await page.evaluate(() => { document.getElementById('powers').open = true; });
      for (const mode of ['gradual', 'instant', 'runaway']) {
        await page.selectOption('#absorb', mode); await page.waitForTimeout(300);
        const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (ov > 0) texts.push('growth ' + mode + ': scrolls sideways ' + ov + ' px');
      }
      await page.selectOption('#absorb', 'ocean');
      await page.evaluate(() => { document.getElementById('powers').open = false; });
    }
    const ov2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${w}x${h} ${scheme}: overflow=${Math.max(overflow, ov2)}px errors=${JSON.stringify(errs.slice(0, 5))} broken-text=${JSON.stringify(texts)}`);
    if (overflow > 0 || ov2 > 0 || errs.length || texts.length) problems++;
    await page.close();
  }
  if (!only) {
    // The page reorganisation leaves results unchanged (BRIEF-gui.md sections 1, 3 and 4): saved states and the Bolted
    // switches give the same verdict, status chips and tiles as main's page did (test/fixtures/page-before.json).
    // One wording fix since: the shoving match no longer lower-cases a name at the start of its verdict.
    const norm = (r) => JSON.stringify(Object.assign({}, r, { verdict: r.verdict && r.verdict.replace(/^(Pushing straight across: )(\w)/, (m, a, b) => a + b.toLowerCase()) }));
    const same = (id, got) => { if (norm(got) === norm(BEFORE[id])) okLog(id + ': same result as before'); else fail(id + ': result changed\n  before ' + norm(BEFORE[id]) + '\n  now    ' + norm(got)); };
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript(countDuoCalls, { names: DUO_FNS });
    await page.goto(pathToFileURL(prev).href);
    const load = async (st) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800); };
    const duoResult = async () => { await page.waitForTimeout(400); await settle(page, 'duo-bay'); return readResult(page, 'duo-bay'); };
    // section 1: real muscle, both bolted, powers off
    for (const tab of ['weight', 'jump']) { await load(Object.assign({ mode: 'real', anchor: 'bolted', oAnchor: 'bolted', action: tab }, POWERS_OFF)); await settle(page, 'bay'); same('s1-' + tab, await readResult(page, 'bay')); }
    await load(Object.assign({ mode: 'real', anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide' }, POWERS_OFF));
    same('s1-collide', await duoResult());
    // section 3: the Bolted switches give what the old menus gave, for each side, on Collide and Wrestle
    for (const tab of ['collide', 'wrestle']) {
      await load(Object.assign({ anchor: 'friction', oAnchor: 'friction', duoOpen: true, duoAction: tab }, POWERS_OFF));
      await page.evaluate(() => { document.getElementById('powers').open = true; });
      for (const [a, b] of [['friction', 'friction'], ['bolted', 'friction'], ['bolted', 'bolted'], ['friction', 'bolted'], ['friction', 'friction']]) {
        await page.setChecked('#bolt-rex', a === 'bolted'); await page.setChecked('#bolt-ollie', b === 'bolted');
        same('s3-' + tab + '-' + a + '-' + b, await duoResult());
      }
    }
    // a saved 'Claws dug in' loads as just standing, with no page errors
    await load(Object.assign({ anchor: 'braced', oAnchor: 'braced', duoOpen: true, duoAction: 'collide' }, POWERS_OFF));
    same('s3-collide-friction-friction', await duoResult());
    const braced = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return [s.anchor, s.oAnchor, document.getElementById('bolt-rex').checked, document.getElementById('bolt-ollie').checked]; });
    if (braced.join() !== 'friction,friction,false,false') fail('saved braced footing loads as ' + JSON.stringify(braced)); else okLog('saved braced footing loads as just standing, switches off');
    // section 4: a saved Rex + Ollie view opens the element once on its tab, then the old key is gone
    await load({ group: 'duo', duoAction: 'catch' });
    const s4 = await page.evaluate(() => ({ open: document.getElementById('duo').open, sel: (document.querySelector('#duo-tabs [aria-selected="true"]') || {}).id, saved: JSON.parse(localStorage.getItem('rex-lab-v1')) }));
    if (!s4.open || s4.sel !== 'tab-catch' || 'group' in s4.saved || s4.saved.duoOpen !== true) fail('saved group duo: ' + JSON.stringify({ open: s4.open, sel: s4.sel, group: s4.saved.group, duoOpen: s4.saved.duoOpen })); else okLog('saved group duo opens the element on Catch; the group key is dropped');
    same('s4-catch', await duoResult());
    // Ollie's settings inside the element change the two-player result and leave Rex's bay alone
    await load({ duoOpen: true, duoAction: 'arm', action: 'throw' });
    await settle(page, 'bay');
    const rexBefore = await readResult(page, 'bay'), duoBefore = await duoResult();
    await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
    await page.fill('#o-height', '6'); await page.press('#o-height', 'Enter');
    await page.waitForTimeout(300); await settle(page, 'bay');
    const rexAfter = await readResult(page, 'bay'), duoAfter = await duoResult();
    if (JSON.stringify(rexAfter) !== JSON.stringify(rexBefore) || JSON.stringify(duoAfter) === JSON.stringify(duoBefore)) fail('Ollie’s height: Rex’s bay ' + (JSON.stringify(rexAfter) === JSON.stringify(rexBefore) ? 'unchanged' : 'CHANGED') + ', two-player result ' + (JSON.stringify(duoAfter) === JSON.stringify(duoBefore) ? 'UNCHANGED' : 'changed'));
    else okLog('Ollie’s height changes the arm wrestle (' + duoAfter.verdict.slice(0, 60) + '…) and leaves Rex’s throw alone');
    if (errs.length) fail('page errors: ' + errs.slice(0, 3).join(' | '));
    await page.close();
    // closing the element stops its background search. Every two-player call is slowed to 60 ms here, so a search
    // can't finish inside a render's budget and goes on in the background ('working it out').
    const slow = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await slow.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
    await slow.goto(pathToFileURL(prev).href);
    await slow.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
    await slow.reload(); await slow.waitForTimeout(600);
    const busy = await slow.evaluate(() => /working it out/i.test(document.getElementById('duo-bay').textContent));
    await slow.click('#duo > summary');
    const c0 = await slow.evaluate(() => window.__duoCalls);
    await slow.waitForTimeout(3000);
    const c1 = await slow.evaluate(() => window.__duoCalls);
    // and Rex's bay keeps working meanwhile
    const rexOk = await slow.evaluate(() => !!document.querySelector('#bay .verdict'));
    if (!busy || c1 !== c0 || !rexOk) fail('closing the Rex + Ollie element: search ' + (busy ? 'was running' : 'NOT running') + ', ' + (c1 - c0) + ' two-player calls after closing, Rex’s bay ' + (rexOk ? 'fine' : 'EMPTY'));
    else okLog('closing the element stops its background search (no two-player calls in 3 s after closing; Rex’s bay unaffected)');
    await slow.close();
  }
  // the page shows what the engine computes: soft landing takes back the landing's impact on the ground, not its whole
  // energy; and the effort slider's right end is all-out
  if (!only) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'jump', softLanding: true })); });
    await page.reload(); await page.waitForTimeout(2500);
    const soft = await page.evaluate(() => {
      const t = document.getElementById('bay').textContent, m = t.match(/Soft landing: what the landing would put into the ground: ([\d.,]+)\s(k?)J/);
      return { shown: m ? Number(m[1].replace(/,/g, '')) * (m[2] === 'k' ? 1e3 : 1) : null, text: m ? m[0] : t.slice(0, 200) };
    });
    // the engine at the effort the page shows (its readout gives the mass lifted)
    const eff = await page.evaluate(() => { const m = document.getElementById('bay').textContent.match(/as hard as lifting ([\d.,]+)\s(t|kg)/); return m ? Number(m[1].replace(/,/g, '')) * (m[2] === 't' ? 1000 : 1) : null; });
    const want = await page.evaluate((kg) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g; const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
      const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), groundHolds: false, anchor: 'friction', softLanding: true, use: kg * g };
      const L = P.jump(c).landing; return { absorbed: L.absorbed, E: L.E }; }, eff);
    const okSoft = soft.shown && want.absorbed > 0 && Math.abs(soft.shown / want.absorbed - 1) < 0.02 && want.E > 2 * want.absorbed;
    console.log('soft landing on the page: ' + soft.text + ' (engine ' + (want.absorbed / 1e3).toPrecision(3) + ' kJ of ' + (want.E / 1e3).toPrecision(3) + ' kJ landing energy)');
    if (!okSoft) problems++;
    await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw' })); });
    await page.reload(); await page.waitForTimeout(2500);
    await page.evaluate(() => { document.querySelector('details.effort-adjust').open = true; });
    await page.focus('#effort-use'); await page.keyboard.press('End'); await page.waitForTimeout(400);
    const end = await page.evaluate(() => ({ spoken: document.getElementById('effort-use').getAttribute('aria-valuetext'), read: (document.querySelector('.effort-read b') || {}).textContent }));
    console.log('effort slider, End key: ' + JSON.stringify(end));
    if (end.spoken !== 'All-out' || !/100%|All-out/.test(end.read || '')) problems++;
    await page.close();
  }
  await browser.close();
  if (problems) { console.log('PROBLEMS: see above'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
