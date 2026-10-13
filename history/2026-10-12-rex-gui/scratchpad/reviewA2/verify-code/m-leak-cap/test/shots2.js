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
  const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []).concat(t.match(/dug[ -]in|claws dug|braced|comic switch|under Settings/gi) || []);
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
    const first = await page.evaluate(() => ({ open: document.getElementById('duo').open, calls: window.__duoCalls, drawn: !!document.querySelector('#duo-bay .verdict, #duo-bay .duo-head') }));
    if (first.open || first.calls || first.drawn) texts.push('first load: Rex + Ollie element ' + JSON.stringify(first));
    // Ollie's settings sit at the top of the Rex + Ollie element (before its tabs), and the sidebar holds only Rex's
    // sections and the shared ones
    const ol = await page.evaluate(() => { const duo = document.getElementById('duo'), tabs = document.getElementById('duo-tabs'), aside = document.querySelector('aside.panel-controls');
      const misplaced = ['ollie-setup', 'o-same', 'o-own', 'o-strength', 'o-height', 'o-density', 'o-mass'].filter((id) => { const n = document.getElementById(id); return !n || !duo.contains(n) || aside.contains(n) || !(n.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING); });
      const sections = Array.from(aside.querySelectorAll('details, .side-sec')).map((n) => n.id);
      return { misplaced, sections }; });
    if (ol.misplaced.length) texts.push('Ollie’s settings not at the top of the Rex + Ollie element: ' + ol.misplaced.join(', '));
    if (ol.sections.join() !== 'setup,ground-sec,powers') texts.push('sidebar sections ' + ol.sections.join());
    // anything carrying the hidden attribute takes no space (the host page has no [hidden] rule of its own)
    const shown = await page.evaluate(() => Array.from(document.querySelectorAll('[hidden]')).filter((n) => n.getClientRects().length).map((n) => n.id || n.tagName));
    if (shown.length) texts.push('hidden but shown: ' + shown.join(', '));
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
      // a two-player result never lands in Rex's bay, nor a solo one in the Rex + Ollie element; no id appears twice
      const mixed = await page.evaluate(() => !!document.querySelector('#bay .duo-head, #bay #duo-effort, #duo-bay #effort'));
      if (mixed) texts.push(tab + ': one bay shows the other’s result');
      const dups = await page.evaluate(() => { const seen = {}; for (const n of document.querySelectorAll('[id]')) seen[n.id] = (seen[n.id] || 0) + 1; return Object.keys(seen).filter((k) => seen[k] > 1); });
      if (dups.length) texts.push(tab + ': duplicate ids ' + dups.join(', '));
      const shot = await page.$(duo ? '#duo' : 'main.panel');
      if (scheme === 'light' || w === 390) await shot.screenshot({ path: path.join(out, `${tab}-${w}-${scheme}.png`) });
    }
    if (!only) await page.screenshot({ path: path.join(out, `full-open-${w}-${scheme}.png`), fullPage: true });
    if (!only) {
      // Rex's Throw and Wrestle's throw on screen together: separate controls (ids, labels) and separate angles
      await page.click('#tab-throw'); await page.click('#tab-wrestle'); await page.click('#wm-throw'); await page.waitForTimeout(600);
      const pair = await page.evaluate(() => { const seen = {}; for (const n of document.querySelectorAll('[id]')) seen[n.id] = (seen[n.id] || 0) + 1;
        const lab = (id) => { const n = document.getElementById(id); return n && n.labels ? n.labels.length : -1; };
        return { dups: Object.keys(seen).filter((k) => seen[k] > 1), labels: ['angle', 'w-angle'].map(lab) }; });
      if (pair.dups.length || pair.labels.join() !== '1,1') texts.push('Throw + Wrestle throw: duplicate ids ' + pair.dups.join(', ') + '; labels ' + pair.labels.join());
      const rexThrow = await page.$eval('#bay .verdict', (n) => n.textContent);
      await page.focus('#w-angle'); for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(800);
      const after = await page.evaluate(() => ({ rex: document.querySelector('#bay .verdict').textContent, focusIn: document.activeElement && document.activeElement.closest('#duo-bay') ? 'duo' : 'elsewhere' }));
      if (after.rex !== rexThrow || after.focusIn !== 'duo') texts.push('Wrestle’s angle slider: Rex’s Throw ' + (after.rex === rexThrow ? 'unchanged' : 'CHANGED') + ', focus ' + after.focusIn);
      await page.click('#wm-push');
      // on a wide screen the sticky sidebar scrolls on its own, so Their powers is in reach while reading either bay
      if (w >= 920) {
        await page.evaluate(() => window.scrollTo(0, document.getElementById('duo-bay').getBoundingClientRect().top + window.scrollY - 20));
        await page.focus('#powers > summary'); await page.waitForTimeout(200);
        const reach = await page.evaluate(() => { const r = document.querySelector('#powers > summary').getBoundingClientRect(), b = document.getElementById('duo-bay').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, vh: innerHeight, bayTop: b.top }; });
        if (reach.top < 0 || reach.bottom > reach.vh || reach.bayTop > reach.vh || reach.bayTop < -reach.vh) texts.push('Their powers out of reach while reading the Rex + Ollie element ' + JSON.stringify(reach));
        await page.evaluate(() => window.scrollTo(0, 0));
      }
    }
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
    // The whole result text is compared: verdict, chips, tiles, the effort box, what happens, the callouts and the
    // math. The only differences allowed are the intended text edits, applied to main's text first: dug-in footing
    // removed, the bolted case of walking drive stated, and the shoving match no longer lower-casing a name.
    const EDITS = [
      [/^(Pushing straight across: )(rex|ollie)\b/, (m, a, b) => a + b.charAt(0).toUpperCase() + b.slice(1)],
      [/ \(plus a little claw or boot bite if dug in\): /g, ', and none at all if he is bolted (he can’t step) or too heavy to walk: '],
      [/A heavier body, or one dug in, wins\./g, 'A heavier body wins.'],
      [/footing = μ m g \(\+ shear × buried area if dug in; unlimited if bolted\)\./g, 'footing = μ m g (unlimited if bolted).'],
      [/Drive = min\(strength, μ m g \+ ¼ shear × buried area if dug in\);/g, 'Drive = min(strength, μ m g);'],
    ];
    const edit = (t) => EDITS.reduce((x, [re, to]) => x.replace(re, to), t);
    const editAll = (r) => { const o = {}; for (const [k, v] of Object.entries(r)) o[k] = Array.isArray(v) ? v.map((x) => x && edit(x)) : v && edit(v); return JSON.stringify(o); };
    const same = (id, got) => { const was = editAll(BEFORE[id]), now = JSON.stringify(Object.fromEntries(Object.keys(BEFORE[id]).map((k) => [k, got[k]])));
      if (was === now) okLog(id + ': same result as before'); else fail(id + ': result changed\n  before ' + was + '\n  now    ' + now); };
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
    // Rex's bay is the same with the element open as closed: no two-player mode or effort cap reaches it
    const rexWith = async (duoOpen) => { await load({ duoOpen, duoAction: 'arm', action: 'throw' }); await settle(page, 'bay'); if (duoOpen) await duoResult();
      await page.click('#tab-jump'); await page.click('#tab-throw'); await page.waitForTimeout(400); await settle(page, 'bay'); return JSON.stringify(await readResult(page, 'bay')); };
    const rexShut = await rexWith(false), rexOpen = await rexWith(true);
    if (rexOpen !== rexShut) fail('Rex’s throw changes with the Rex + Ollie element open\n  closed ' + rexShut + '\n  open   ' + rexOpen);
    else okLog('Rex’s throw is the same with the Rex + Ollie element open or closed');
    if (errs.length) fail('page errors: ' + errs.slice(0, 3).join(' | '));
    await page.close();
    // Closing the element stops its background search. Every two-player call is slowed to 60 ms here, so a search
    // can't finish inside a render's budget and goes on in the background ('working it out'). The page closes the
    // element itself the moment it shows 'working it out', and the count of two-player calls is taken right then.
    const slowPage = async (onBusy) => {
      const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await pg.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
      await pg.addInitScript((what) => {
        document.addEventListener('toggle', (e) => { if (e.target.id === 'duo' && !e.target.open) window.__atClose = window.__duoCalls; }, true);
        const iv = setInterval(() => { const b = document.getElementById('duo-bay'); if (b && /Effort: working it out/i.test(b.textContent)) { clearInterval(iv); window.__busyAt = window.__duoCalls;
          if (what === 'close') document.getElementById('duo').open = false; else if (what.startsWith('rex-tab')) document.getElementById(what === 'rex-tab-weight' ? 'tab-weight' : 'tab-jump').click(); } }, 5);
      }, onBusy);
      await pg.goto(pathToFileURL(prev).href);
      await pg.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
      await pg.reload(); await pg.waitForTimeout(4000);
      const r = await pg.evaluate(() => ({ busyAt: window.__busyAt, atClose: window.__atClose, calls: window.__duoCalls, open: document.getElementById('duo').open, working: /working it out/i.test(document.getElementById('duo-bay').textContent), effort: /Effort: [\d.]+%/.test(document.getElementById('duo-bay').textContent), rex: !!document.querySelector('#bay .verdict') }));
      await pg.close();
      return r;
    };
    const left = await slowPage('none'), closed = await slowPage('close'), rexTab = await slowPage('rex-tab'), rexWeight = await slowPage('rex-tab-weight');
    if (left.busyAt == null || closed.atClose == null || closed.calls !== closed.atClose || !(closed.atClose < left.calls) || !closed.rex) fail('closing the Rex + Ollie element mid-search: ' + JSON.stringify({ left, closed }));
    else okLog('closing the element mid-search stops it (' + closed.atClose + ' two-player calls at closing and 4 s later; ' + left.calls + ' when left open); Rex’s bay unaffected');
    // and a redraw of Rex's bay (here a tab click) while the two-player search runs doesn't stop it
    if (rexTab.busyAt == null || rexTab.working || !rexTab.effort || rexTab.calls !== left.calls) fail('a Rex tab clicked mid-search: ' + JSON.stringify(rexTab));
    else okLog('a Rex tab clicked during the two-player search leaves it to finish (' + rexTab.calls + ' calls, the effort shown)');
    if (rexWeight.busyAt == null || rexWeight.working || !rexWeight.effort || rexWeight.calls !== left.calls) fail('a Rex tab without an effort (Weight) clicked mid-search: ' + JSON.stringify(rexWeight));
    else okLog('Rex’s Weight tab clicked during the two-player search leaves it to finish (' + rexWeight.calls + ' calls, the effort shown)');
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
