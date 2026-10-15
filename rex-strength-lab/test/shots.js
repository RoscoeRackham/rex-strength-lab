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
// counts the page's calls to them (and can slow each one down, to force a search into the background). pin: run the
// page on an older build of the default bodies (OLD_BUILD), for comparisons with a page fixture written on it
const countDuoCalls = ({ names, delay, pin }) => {
  window.__duoCalls = 0;
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    if (pin) { x.BUILDS.rex.kV = x.BUILDS.ollie.kV = pin.kV; x.DEFAULT_BODIES.rex.m = x.DEFAULT_BODIES.ollie.m = pin.m; }
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; if (delay) { const t = performance.now(); while (performance.now() - t < delay) { /* slow */ } } return f.apply(this, arguments); }; }
    v = x;
  } });
};
// test/fixtures/page-before.json was written with the 3,007 kg bodies of 11 Oct 2026 (volume 0.10017 x height^3); the
// canon has been 3,000 kg since 13 Oct 2026 (BRIEF-canon.md item 1), so the pages compared with it run on that build
const OLD_BUILD = { kV: 0.10017, m: 3007 };
// the section 5 powers, off (BRIEF-gui.md section 5; these keys don't exist before it and are dropped on load), and Safe
// passenger off as on main's page (on by default since BRIEF-canon.md item 5: an unmarked save would load it on, so the
// save carries the current mark, which keeps it as the reader's choice)
// (and the two Never knocked back switches, on by default since BRIEF-canon.md item 4: no page-before case has a fireball
// in the game of catch, their one case, so either way gives the same; off, every power is off)
const POWERS_OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false, saveV: 3 };
(async () => {
  const body = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, '..', 'dist', 'preview.html');
  fs.writeFileSync(prev, wrapped);
  const out = path.join(__dirname, '..', 'shots'); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  // node test/shots.js <tab>: that tab only; node test/shots.js --pr4: only pull request 4's block (BRIEF-canon.md item 4)
  const PR4_ONLY = process.argv[2] === '--pr4', only = PR4_ONLY ? null : process.argv[2];
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
  const IN_POWERS = ['mode-comic', 'mode-real', 'mode-hint', 'bolt-rex', 'bolt-ollie', 'nkb-rex', 'nkb-ollie', 'nkb-note', 'sw-unbreakable', 'sw-recoil', 'air-absorb', 'sw-keep', 'sw-passenger', 'sw-silent', 'sw-soft', 'absorb', 'grow-chips', 'grow-s', 'grow-t'];
  for (const [w, h, scheme] of PR4_ONLY ? [] : [[1280, 900, 'light'], [1280, 900, 'dark'], [390, 844, 'light'], [390, 844, 'dark']]) {
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
    const groundOk = await page.evaluate(() => { const s = document.getElementById('surface'); return !!s && document.getElementById('ground-sec').contains(s) && !document.getElementById('setup').contains(s) && !document.getElementById('powers').contains(s); });
    if (!groundOk) texts.push('the Ground menu is not in the Ground section');
    const placed = await page.evaluate((ids) => ids.filter((id) => { const n = document.getElementById(id); return !n || !document.getElementById('powers').contains(n) || document.getElementById('setup').contains(n) || document.getElementById('ollie-setup').contains(n); }), IN_POWERS);
    if (placed.length) texts.push('not in Their powers (or also elsewhere): ' + placed.join(', '));
    const gone = await page.evaluate(() => ['anchor', 'o-anchor', 'grp-solo', 'grp-duo', 'comic-setup'].filter((id) => document.getElementById(id)));
    if (gone.length) texts.push('retired controls still on the page: ' + gone.join(', '));
    const boltNames = await page.evaluate(() => ['bolt-rex', 'bolt-ollie'].map((id) => document.getElementById(id).getAttribute('aria-label')));
    if (boltNames[0] !== 'Bolted to the planet: Rex' || boltNames[1] !== 'Bolted to the planet: Ollie') texts.push('Bolted switch names ' + JSON.stringify(boltNames));
    const nkbNames = await page.evaluate(() => ['nkb-rex', 'nkb-ollie'].map((id) => document.getElementById(id) && document.getElementById(id).getAttribute('aria-label')));
    if (nkbNames[0] !== 'Never knocked back: Rex' || nkbNames[1] !== 'Never knocked back: Ollie') texts.push('Never knocked back switch names ' + JSON.stringify(nkbNames));
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
    if (!only && !PR4_ONLY) {
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
        // the sidebar's own scroll box says what is below its edge: the cue shows, names Their powers, and clicking it
        // brings Their powers into view next to the Rex + Ollie element, then hides
        await page.evaluate(() => { document.querySelector('.panel-controls').scrollTop = 0; window.scrollTo(0, document.getElementById('duo-bay').getBoundingClientRect().top + window.scrollY - 20); });
        await page.waitForTimeout(300);
        const cue = await page.evaluate(() => { const c = document.getElementById('more-below'), r = c.getBoundingClientRect(); return { shown: !document.getElementById('more-wrap').hidden && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight, text: c.textContent }; });
        if (!cue.shown || !/Their powers/.test(cue.text)) texts.push('sidebar cue ' + JSON.stringify(cue));
        // click where the cue is drawn, as a mouse does (page.click would first scroll it into view inside the sidebar's
        // own scroll box, which scrolls the box to its end and hides the cue before the click lands)
        if (cue.shown) { const at = await page.$eval('#more-below', (c) => { const b = c.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); await page.mouse.click(at.x, at.y); }
        else await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; });
        await page.waitForTimeout(900);
        const reach = await page.evaluate(() => { const r = document.querySelector('#powers > summary').getBoundingClientRect(), b = document.getElementById('duo-bay').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, vh: innerHeight, bayTop: b.top, cueHidden: document.getElementById('more-wrap').hidden }; });
        if (reach.top < 0 || reach.bottom > reach.vh || reach.bayTop > reach.vh || !reach.cueHidden) texts.push('Their powers out of reach while reading the Rex + Ollie element ' + JSON.stringify(reach));
        await page.evaluate(() => window.scrollTo(0, 0));
        // and the mouse wheel over the sidebar still scrolls the page once the sidebar is at its end
        const sb = await page.$eval('.panel-controls', (a) => { const r = a.getBoundingClientRect(); return { x: r.x, y: r.y }; });
        await page.mouse.move(sb.x + 100, Math.min(400, h - 50));
        for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(80); }
        if (await page.evaluate(() => window.scrollY) === 0) texts.push('the mouse wheel over the sidebar does not scroll the page');
        await page.evaluate(() => window.scrollTo(0, 0));
      }
    }
    // each growth mode, with Their powers open (the page always opens on the endless ocean)
    if (!only && !PR4_ONLY) {
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
    // BRIEF-canon.md item 5: a person thrown on Throw and in the game of catch (a missed fastball shown), with Safe
    // passenger on by default, and Their powers open: no sideways scroll or broken text, and a picture of each
    if (!only && !PR4_ONLY) {
      for (const [id, st, sel] of [['throw-person', { action: 'throw', obj: 'person' }, 'main.panel'], ['catch-person', { duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true }, '#duo']]) {
        await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(st.duoOpen ? 2500 : 1500);
        const t = await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return b.textContent; });
        const b = bad(t), ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (b.length) texts.push(id + ': ' + b.join(', '));
        if (ov > 0) texts.push(id + ': scrolls sideways ' + ov + ' px');
        await (await page.$(sel)).screenshot({ path: path.join(out, `${id}-${w}-${scheme}.png`) });
      }
      await page.evaluate(() => { document.getElementById('powers').open = true; });
      await page.waitForTimeout(300);
      const ovP = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ovP > 0) texts.push('Their powers open: scrolls sideways ' + ovP + ' px');
      // (on a wide screen the sidebar is its own sticky scroll box: let it run full length for the picture)
      await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.style.position = 'static'; a.style.maxHeight = 'none'; a.style.overflow = 'visible'; });
      await (await page.$('#powers')).screenshot({ path: path.join(out, `powers-${w}-${scheme}.png`) });
      await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.style.position = a.style.maxHeight = a.style.overflow = ''; document.getElementById('powers').open = false; localStorage.clear(); });
    }
    const ov2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${w}x${h} ${scheme}: overflow=${Math.max(overflow, ov2)}px errors=${JSON.stringify(errs.slice(0, 5))} broken-text=${JSON.stringify(texts)}`);
    if (overflow > 0 || ov2 > 0 || errs.length || texts.length) problems++;
    await page.close();
  }
  if (!only && !PR4_ONLY) {
    // The page reorganisation leaves results unchanged (BRIEF-gui.md sections 1, 3 and 4): saved states and the Bolted
    // switches give the same verdict, status chips and tiles as main's page did (test/fixtures/page-before.json).
    // The whole result text is compared: verdict, chips, tiles, the effort box, what happens, the callouts and the
    // math. The only differences allowed are the intended text edits, applied to main's text first: dug-in footing
    // removed, the bolted case of walking drive stated, and the shoving match no longer lower-casing a name.
    const EDITS = [
      [/^(Pushing straight across: )(rex|ollie)\b/, (m, a, b) => a + b.charAt(0).toUpperCase() + b.slice(1)],
      [/ \(plus a little claw or boot bite if dug in\): /g, ', or under what the ground bears beneath his feet where it is too soft to carry him, and none at all if he is bolted (the sim keeps a bolted wrestler planted: he holds but doesn’t walk the other out) or too heavy to walk: '],
      [/Equal bodies on equal ground stay equal at any strength\. A heavier body, or one dug in, wins\./g, 'Equal bodies (same weight and feet) on equal ground stay equal at any strength. On firm ground the heavier one wins; where the ground is too soft to carry a body’s weight, his grip is capped by what it bears under his feet, so bigger feet help; and if either is bolted, nobody walks the other out.'],
      [/Hold = min\(strength, footing\); footing = μ m g \(\+ shear × buried area if dug in; unlimited if bolted\)\./g, 'Hold = min(strength, footing), or the footing alone if he is too heavy to stand; footing = μ × min(m g, what the ground under his feet bears). Bolted: unlimited, whatever his strength (the bolts hold, not his muscles).'],
      [/Drive = min\(strength, μ m g \+ ¼ shear × buried area if dug in\);/g, 'Drive = min(strength, μ × min(m g, what the ground under his feet bears));'],
      // B: Comic ground is now Unbreakable footing
      [/only Comic ground keeps the floor whole/g, 'only Unbreakable footing keeps the floor whole'],
    ];
    const edit = (t) => EDITS.reduce((x, [re, to]) => x.replace(re, to), t);
    // C (BRIEF-gui.md section 6) rewrote the energy comparisons: a new ladder of rungs and new wording. Both sides'
    // comparisons are set aside here; the ladder has its own checks (test/ladder.js and the section 6 block below).
    const OLD_SHORTS = ['the fastest pitch on record', 'a Corolla at 100 km/h', 'a hand grenade', 'the MOAB bomb', 'the Hiroshima bomb', 'Castle Bravo', 'the Tsar Bomba', 'the 1883 Krakatoa eruption', 'the dinosaur-killing asteroid', 'the Sun’s output for one second', 'the energy to blow Earth apart'];
    let CMP = null;
    const setAsideComparisons = (t) => (CMP ? t.replace(CMP, '‹compared›') : t);
    const makeCMP = (shorts) => {
      const any = OLD_SHORTS.concat(shorts).sort((a, b) => b.length - a.length).map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const NUM = '(?:[\\d.,]+(?: (?:million|billion|trillion|quadrillion|quintillion|sextillion|septillion))?(?: × 10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)?|10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)';
      return new RegExp('(?:≈ |about the same as |roughly the same as |(?:roughly )?' + NUM + '(?:×|% of) )(?:' + any + ')|beyond the ladder: (?:less|more) than its (?:smallest|top) rung \\((?:' + any + ')\\)', 'g');
    };
    const editAll = (r) => { const o = {}; for (const [k, v] of Object.entries(r)) o[k] = Array.isArray(v) ? v.map((x) => x && edit(x)) : v && edit(v); return JSON.stringify(o); };
    // Pull request B's corrections to the two-player courtesy ceiling (with the powers off too): where a test doesn't
    // judge the ground shaking, a 'none' ceiling says so (as the solo tabs do); and broken ground counts as harm, so with
    // Rex bolted on Collide the least disruptive effort stops where the rock around his bolts starts to crack (main's
    // page called an effort harmless while showing that rock cracking). Those Collide cases are compared all-out, with
    // the effort box checked on its own.
    // (each with the reason the page now gives: the shoving match's physics, or the powers being off)
    const PUSH_WHY = ' In a shoving match their pushes reach the ground equal and opposite, so no net push goes in to shake it, and nothing moves fast enough to make a blast.';
    const NO_SHAKE_JUDGED = new Map([['s3-wrestle-friction-friction', PUSH_WHY], ['s3-wrestle-friction-bolted', PUSH_WHY], ['s3-wrestle-bolted-friction', PUSH_WHY],
      ['s4-catch', ' The lab models the ground shaking in this test only through their powers (Unbreakable footing or They take their own recoil), and both are off.']]);
    const CAVEAT = [/(Nothing in this test does harm, even all-out, with the nearest people and buildings 5 m away\.)/g, (id) => '$1' + NO_SHAKE_JUDGED.get(id)];
    const same = (id, got, skip) => { const b = BEFORE[id], keys = Object.keys(b).filter((k) => !(skip || []).includes(k));
      const was = setAsideComparisons(JSON.stringify(Object.fromEntries(keys.map((k) => { const v = JSON.parse(editAll({ [k]: b[k] }))[k]; return [k, NO_SHAKE_JUDGED.has(id) && k === 'effort' ? v.map((x) => x && x.replace(CAVEAT[0], CAVEAT[1](id))) : v]; })))), now = setAsideComparisons(JSON.stringify(Object.fromEntries(keys.map((k) => [k, got[k]]))));
      if (was === now) okLog(id + ': same result as before' + (skip ? ' (all but ' + skip.join(', ') + ')' : '')); else fail(id + ': result changed\n  before ' + was + '\n  now    ' + now); };
    // Collide with Rex bolted, and the shoving match with both bolted: the least disruptive effort now stops where the
    // ground breaks (the rock cracks, or tears out around their bolts); all-out, the result is main's
    const boltedCollide = async (id, re) => {
      const least = (await readResult(page, 'duo-bay')).effort.join(' ');
      if (!(re || /Past that, the ground breaks under Rex\./).test(least)) fail(id + ': the least disruptive effort should stop where the ground breaks: ' + least.slice(0, 200)); else okLog(id + ': least disruptive stops where the ground breaks');
      await page.selectOption('#duo-effort', 'allout'); same(id + '-allout', await duoResult(), ['effort']);
      await page.selectOption('#duo-effort', 'least'); await duoResult();
    };
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript(countDuoCalls, { names: DUO_FNS, pin: OLD_BUILD });
    await page.goto(pathToFileURL(prev).href);
    CMP = makeCMP(await page.evaluate(() => window.DINO_DATA.energyRefs.map((e) => e.short)));
    const load = async (st) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800); };
    const duoResult = async () => { await page.waitForTimeout(400); await settle(page, 'duo-bay'); return readResult(page, 'duo-bay'); };
    // section 1: real muscle, both bolted, powers off
    for (const tab of ['weight', 'jump']) { await load(Object.assign({ mode: 'real', anchor: 'bolted', oAnchor: 'bolted', action: tab }, POWERS_OFF)); await settle(page, 'bay'); same('s1-' + tab, await readResult(page, 'bay')); }
    await load(Object.assign({ mode: 'real', anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide' }, POWERS_OFF));
    await duoResult(); await boltedCollide('s1-collide');
    // a saved bolted footing loads with its switch on, each side on its own
    const sw = async () => (await page.evaluate(() => [document.getElementById('bolt-rex').checked, document.getElementById('bolt-ollie').checked])).join();
    const swBoth = await sw();
    await load({ anchor: 'bolted', oAnchor: 'friction' }); const swRex = await sw();
    await load({ anchor: 'friction', oAnchor: 'bolted' }); const swOllie = await sw();
    if (swBoth !== 'true,true' || swRex !== 'true,false' || swOllie !== 'false,true') fail('saved bolted footing shows switches ' + [swBoth, swRex, swOllie].join(' | ')); else okLog('saved bolted footing loads with its Bolted switch on (both, Rex only, Ollie only)');
    // section 3: the Bolted switches give what the old menus gave, for each side, on Collide and Wrestle
    for (const tab of ['collide', 'wrestle']) {
      await load(Object.assign({ anchor: 'friction', oAnchor: 'friction', duoOpen: true, duoAction: tab }, POWERS_OFF));
      await page.evaluate(() => { document.getElementById('powers').open = true; });
      for (const [a, b] of [['friction', 'friction'], ['bolted', 'friction'], ['bolted', 'bolted'], ['friction', 'bolted'], ['friction', 'friction']]) {
        await page.setChecked('#bolt-rex', a === 'bolted'); await page.setChecked('#bolt-ollie', b === 'bolted');
        const got = await duoResult();
        if (tab === 'collide' && a === 'bolted') await boltedCollide('s3-' + tab + '-' + a + '-' + b);
        else if (tab === 'wrestle' && a === 'bolted' && b === 'bolted') await boltedCollide('s3-wrestle-bolted-bolted', /Past that, the ground tears out around their bolts\./);
        else same('s3-' + tab + '-' + a + '-' + b, got);
      }
    }
    // a saved 'Claws dug in' loads as just standing, with no page errors
    await load(Object.assign({ anchor: 'braced', oAnchor: 'braced', duoOpen: true, duoAction: 'collide' }, POWERS_OFF));
    same('s3-collide-friction-friction', await duoResult());
    const braced = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return [s.anchor, s.oAnchor, document.getElementById('bolt-rex').checked, document.getElementById('bolt-ollie').checked]; });
    if (braced.join() !== 'friction,friction,false,false') fail('saved braced footing loads as ' + JSON.stringify(braced)); else okLog('saved braced footing loads as just standing, switches off');
    // section 4: a saved Rex + Ollie view opens the element once on its tab, then the old key is gone
    await load(Object.assign({ group: 'duo', duoAction: 'catch' }, POWERS_OFF));
    const s4 = await page.evaluate(() => ({ open: document.getElementById('duo').open, sel: (document.querySelector('#duo-tabs [aria-selected="true"]') || {}).id, saved: JSON.parse(localStorage.getItem('rex-lab-v1')) }));
    if (!s4.open || s4.sel !== 'tab-catch' || 'group' in s4.saved || s4.saved.duoOpen !== true) fail('saved group duo: ' + JSON.stringify({ open: s4.open, sel: s4.sel, group: s4.saved.group, duoOpen: s4.saved.duoOpen })); else okLog('saved group duo opens the element on Catch; the group key is dropped');
    same('s4-catch', await duoResult());
    // an older save (no wAngle) keeps its Wrestle throw: Wrestle's own angle starts from Rex's
    await load(Object.assign({ angle: 30, wrestleMove: 'throw', duoOpen: true, duoAction: 'wrestle' }, POWERS_OFF));
    same('s4-wrestle-throw', await duoResult());
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
    // Rex's bay comes out the same with the Rex + Ollie element open or closed (no two-player mode or cap leaks into it)
    const rexWith = async (duoOpen) => { await load({ duoOpen, duoAction: 'arm', action: 'throw' }); await settle(page, 'bay'); if (duoOpen) await duoResult();
      await page.click('#tab-jump'); await page.click('#tab-throw'); await page.waitForTimeout(400); await settle(page, 'bay'); return JSON.stringify(await readResult(page, 'bay')); };
    const rexShut = await rexWith(false), rexOpen = await rexWith(true);
    if (rexOpen !== rexShut) fail('Rex’s throw changes with the Rex + Ollie element open\n  closed ' + rexShut + '\n  open   ' + rexOpen); else okLog('Rex’s throw is the same with the Rex + Ollie element open or closed');
    // a typed, uncommitted distance in the element commits when a redraw removes the box: Rex's bay must still be drawn as his
    await load({ duoOpen: true, duoAction: 'catch', action: 'throw' }); await settle(page, 'bay'); await duoResult();
    await page.evaluate(() => { const d = document.querySelector('#duo-bay details.effort-adjust'); if (d) d.open = true; });
    await page.focus('#duo-near'); await page.keyboard.press('Control+A'); await page.keyboard.type('50');
    await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(800); await settle(page, 'bay');
    const afterResize = await page.evaluate(() => ({ rex: !!document.querySelector('#bay .effort-read'), near: JSON.parse(localStorage.getItem('rex-lab-v1')).near }));
    await page.setViewportSize({ width: 1280, height: 900 });
    if (!afterResize.rex || afterResize.near !== 50) fail('a resize with a typed distance in the Rex + Ollie element: ' + JSON.stringify(afterResize)); else okLog('a resize with a typed distance in the element: the distance is taken and Rex’s bay stays his');
    // the element announces its verdict again on reopening, even when closed right after a redraw
    await load({ duoOpen: true, duoAction: 'arm' }); await duoResult();
    await page.evaluate(() => { window.__live = []; new MutationObserver(() => window.__live.push(document.getElementById('duo-live').textContent)).observe(document.getElementById('duo-live'), { childList: true, characterData: true, subtree: true }); });
    await page.click('#tab-collide'); await page.waitForTimeout(150); await page.click('#duo > summary'); await page.waitForTimeout(1200);
    const before = await page.evaluate(() => window.__live.length);
    await page.click('#duo > summary'); await page.waitForTimeout(400); await settle(page, 'duo-bay'); await page.waitForTimeout(900);
    const live = await page.evaluate(() => window.__live);
    if (before !== 0 || live.length < 1) fail('reopening the element: live region writes ' + JSON.stringify(live) + ' (' + before + ' while closed)'); else okLog('the element’s verdict is announced on reopening, not while it is closed');
    // reopening after a change made while it was closed never shows the old settings' result
    await page.click('#duo > summary'); await page.waitForTimeout(300);
    await page.click('#tier-chips .chip[data-id="spidey"]'); await page.waitForTimeout(300);
    await page.evaluate(() => { window.__atOpen = null; document.addEventListener('toggle', (e) => { if (e.target.id === 'duo' && e.target.open && window.__atOpen === null) window.__atOpen = document.getElementById('duo-bay').textContent.trim(); }, true); });
    await page.click('#duo > summary'); await page.waitForTimeout(100); await settle(page, 'duo-bay');
    const atOpen = await page.evaluate(() => window.__atOpen);
    if (!/^Working it out/.test(atOpen || '')) fail('reopening after a change showed: ' + (atOpen || '').slice(0, 120)); else okLog('reopening after a change shows Working it out, not the old result');
    // a typed, uncommitted distance in Rex's own box, then a resize: no page error, and the typed value is used
    await load({ action: 'stomp' }); await settle(page, 'bay');
    await page.evaluate(() => { const d = document.querySelector('#bay details.effort-adjust'); if (d) d.open = true; });
    const errsBefore = errs.length;
    await page.focus('#near'); await page.keyboard.press('Control+A'); await page.keyboard.type('50');
    await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(800); await settle(page, 'bay');
    const nearNow = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).near);
    await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300);
    if (errs.length > errsBefore || nearNow !== 50) fail('a resize with a typed distance in Rex’s bay: ' + JSON.stringify({ errors: errs.slice(errsBefore), near: nearNow })); else okLog('a resize with a typed distance in Rex’s bay: no page error, the distance is taken');
    if (errs.length) fail('page errors: ' + errs.slice(0, 3).join(' | '));
    await page.close();
    // The default mass moved from 3,007 kg to 3,000 kg (BRIEF-canon.md item 1): a fresh page uses 3,000 kg; a save from
    // before the version mark (saveV) with the old default loads as 3,000 kg; a marked save keeps a visitor's own 3,007 kg
    // (marked 2 or 3: the mark is 3 since Safe passenger went on by default, pull request 3, and every save is re-marked 3)
    {
      const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await pg.goto(pathToFileURL(prev).href);
      const after = async (st) => {
        await pg.evaluate((x) => { if (x) localStorage.setItem('rex-lab-v1', JSON.stringify(x)); else localStorage.clear(); }, st);
        await pg.reload(); await pg.waitForTimeout(500);
        return pg.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return [s.m, s.oM, s.saveV].join(); });
      };
      const fresh = await after(null), old = await after({ m: 3007, oM: 3007 }), older = await after({ m: 2700, oM: 2700 }), marked = await after({ m: 3007, oM: 3007, saveV: 2 }), marked3 = await after({ m: 3007, oM: 3007, saveV: 3 });
      if (fresh !== '3000,3000,3' || old !== '3000,3000,3' || older !== '3000,3000,3' || marked !== '3007,3007,3' || marked3 !== '3007,3007,3') fail('the default mass and its migration: fresh ' + fresh + ', older save ' + old + ', a 2,700 kg save ' + older + ', marked save ' + marked + ', marked 3 ' + marked3);
      else okLog('a fresh page and older saves with an old default (3,007 or 2,700 kg) use 3,000 kg; a save marked 2 or 3 keeps a visitor’s own 3,007 kg; every save is marked 3');
      // the Walk tab's elephant comparison follows the default mass (it once tested for 3,007 kg by hand)
      await after({ action: 'walk', walker: 'both' }); await pg.waitForTimeout(300);
      const walk = await pg.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));   // (\s takes the page's non-breaking spaces too)
      if (!/At 3,000 kg, Rex and Ollie each weigh about as much as an adult female African elephant\./.test(walk)) fail('the Walk tab at the default bodies lacks the elephant comparison at 3,000 kg');
      else okLog('the Walk tab compares the default 3,000 kg bodies with an adult female African elephant');
      await pg.close();
    }
    // Closing the element stops its background search. Every two-player call is slowed to 60 ms here, so a search
    // can't finish inside a render's budget and goes on in the background ('working it out'). The page closes the
    // element itself the moment it shows 'working it out', and the count of two-player calls is taken right then.
    const slowPage = async (onBusy) => {
      const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await pg.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60, pin: OLD_BUILD });
      await pg.addInitScript((what) => {
        document.addEventListener('toggle', (e) => { if (e.target.id === 'duo' && !e.target.open) window.__atClose = window.__duoCalls; }, true);
        const iv = setInterval(() => { const b = document.getElementById('duo-bay'); if (b && /Effort: working it out/i.test(b.textContent)) { clearInterval(iv); window.__busyAt = window.__duoCalls;
          if (what === 'close') document.getElementById('duo').open = false; else if (what.startsWith('rex-tab')) document.getElementById(what === 'rex-tab-weight' ? 'tab-weight' : 'tab-jump').click(); } }, 5);
      }, onBusy);
      await pg.goto(pathToFileURL(prev).href);
      await pg.evaluate((off) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true, duoAction: 'arm' }, off))), POWERS_OFF);
      await pg.reload(); await pg.waitForTimeout(4000);
      const r = await pg.evaluate(() => ({ busyAt: window.__busyAt, atClose: window.__atClose, calls: window.__duoCalls, open: document.getElementById('duo').open, working: /working it out/i.test(document.getElementById('duo-bay').textContent), effort: /Effort: [\d.]+%/.test(document.getElementById('duo-bay').textContent), rex: !!document.querySelector('#bay .verdict'),
        effortText: ((document.querySelector('#duo-bay .effort-read') || {}).textContent || '').replace(/\s+/g, ' ').trim(), verdict: ((document.querySelector('#duo-bay .verdict') || {}).textContent || '').replace(/\s+/g, ' ').trim() }));
      await pg.close();
      return r;
    };
    const left = await slowPage('none'), closed = await slowPage('close'), rexTab = await slowPage('rex-tab'), rexWeight = await slowPage('rex-tab-weight');
    if (left.busyAt == null || closed.atClose == null || closed.calls !== closed.atClose || !(closed.atClose < left.calls) || !closed.rex) fail('closing the Rex + Ollie element mid-search: ' + JSON.stringify({ left, closed }));
    else okLog('closing the element mid-search stops it (' + closed.atClose + ' two-player calls at closing and 4 s later; ' + left.calls + ' when left open); Rex’s bay unaffected');
    // and a redraw of Rex's bay (here a tab click) while the two-player search runs doesn't stop it
    if (rexTab.busyAt == null || rexTab.working || !rexTab.effort || rexTab.calls !== left.calls) fail('a Rex tab clicked mid-search: ' + JSON.stringify(rexTab));
    else okLog('a Rex tab clicked during the two-player search leaves it to finish (' + rexTab.calls + ' calls, the effort shown)');
    if (rexWeight.busyAt == null || rexWeight.working || !rexWeight.effort || rexWeight.calls !== left.calls) fail('Rex’s Weight tab (no effort) clicked mid-search: ' + JSON.stringify(rexWeight));
    else okLog('Rex’s Weight tab (no effort search) clicked during the two-player search leaves it to finish too');
    // a search finished in the background settles where main's page did (its probes are two-player runs)
    const want = BEFORE['s4-arm'], bgBad = [['left open', left], ['Rex tab', rexTab], ['Weight tab', rexWeight]].filter(([, r]) => r.verdict !== want.verdict || r.effortText !== want.effort[0]);
    if (bgBad.length) fail('a background two-player search settled elsewhere than main: ' + bgBad.map(([n, r]) => n + ': ' + r.effortText.slice(0, 80) + ' | ' + r.verdict).join(' ; ') + ' (main: ' + want.effort[0].slice(0, 80) + ' | ' + want.verdict + ')');
    else okLog('a background two-player search settles on main’s effort and result (' + want.effort[0].slice(0, 40) + '…)');
    // the sidebar cue on wide screens: keyboard focus never lands under it; it hides once everything fits; it names
    // Ground when Ground's heading is under it; it keeps an opaque backdrop in forced-colours mode
    const cuePage = async (vw, vh, opts) => { const pg = await browser.newPage(Object.assign({ viewport: { width: vw, height: vh } }, opts || {})); await pg.goto(pathToFileURL(prev).href); await pg.evaluate(() => localStorage.clear()); await pg.reload(); await pg.waitForTimeout(1500); return pg; };
    for (const [vw, vh] of [[1366, 768], [1280, 720]]) {
      const pg = await cuePage(vw, vh);
      const under = [];
      for (let i = 0; i < 60; i++) {
        await pg.keyboard.press('Tab');
        // what the reader sees after the next paint (the cue updates on the scroll that focusing causes)
        await pg.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
        const r = await pg.evaluate(() => { const a = document.activeElement, aside = document.querySelector('.panel-controls'); if (!a || !aside.contains(a)) return { inside: false }; const b = a.getBoundingClientRect(), hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return { inside: true, id: a.id || a.tagName, covered: !!hit && !!hit.closest('#more-wrap') }; });
        if (r.inside && r.covered) under.push(r.id);
        if (!r.inside && i > 20) break;
      }
      if (under.length) fail('at ' + vw + 'x' + vh + ' the sidebar cue covers focused controls: ' + under.join(', ')); else okLog('at ' + vw + 'x' + vh + ' no focused sidebar control sits under the cue');
      await pg.close();
    }
    { const pg = await cuePage(1280, 700); await pg.evaluate(() => window.scrollTo(0, 400)); await pg.waitForTimeout(200);
      await pg.click('#setup > summary'); await pg.waitForTimeout(400);
      const r = await pg.evaluate(() => ({ hidden: document.getElementById('more-wrap').hidden, fits: document.querySelector('.panel-controls').scrollHeight <= document.querySelector('.panel-controls').clientHeight + 4 }));
      if (r.fits && !r.hidden) fail('at 1280x700 the cue stays after everything fits'); else okLog('at 1280x700 the cue hides once the sidebar fits (' + JSON.stringify(r) + ')');
      await pg.close(); }
    { const pg = await cuePage(1920, 1080); await pg.evaluate(() => window.scrollTo(0, 400)); await pg.waitForTimeout(300);
      const r = await pg.evaluate(() => { const c = document.getElementById('more-below'), g = document.querySelector('#ground-sec .side-head').getBoundingClientRect(); return { text: c.textContent, hidden: document.getElementById('more-wrap').hidden, groundBelow: g.top + 12 > c.getBoundingClientRect().top }; });
      if (!r.hidden && r.groundBelow && !/Ground/.test(r.text)) fail('at 1920x1080 the cue leaves out Ground: ' + JSON.stringify(r)); else okLog('at 1920x1080 the cue names what is under it (' + r.text + ')');
      await pg.close(); }
    { const pg = await cuePage(1366, 768, { forcedColors: 'active' }); await pg.evaluate(() => window.scrollTo(0, 400)); await pg.waitForTimeout(300);
      const bg = await pg.evaluate(() => getComputedStyle(document.getElementById('more-below')).backgroundColor);
      if (/rgba\(\d+, \d+, \d+, 0\)|transparent/.test(bg)) fail('in forced colours the cue has no backdrop: ' + bg); else okLog('in forced colours the cue keeps an opaque backdrop (' + bg + ')');
      await pg.close(); }
  }
  // the page shows what the engine computes: soft landing takes back the landing's impact on the ground, not its whole
  // energy; and the effort slider's right end is all-out
  if (!only && !PR4_ONLY) {
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
    const want = await page.evaluate((kg) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g; const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
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
  // BRIEF-gui.md section 5: the four default powers on the page
  if (!only && !PR4_ONLY) {
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
    // houses a block away: a level car at 100% goes into orbit at a 10⁷ t dial (no landing, no drag; only his hand's own
    // air, too little), but with the air let through its drag does it: the hint shows. At 10⁶ t it can't at 0% either.
    const hintRe = /Lower Air resistance absorbed/;
    await load({ action: 'throw', obj: 'car', angle: 0, logKg: 10, mode: 'comic' }); await pick('#effort', 'block');
    const hintYes = await bayText();
    await load({ action: 'throw', obj: 'car', angle: 0, logKg: 9, mode: 'comic' }); await pick('#effort', 'block');
    const hintNo = await bayText();
    if (!hintRe.test(hintYes) || !/At 100% air resistance absorbed, a throw’s air \(the share its flight still meets, and his throwing hand’s own\) makes too little blast/.test(hintYes) || hintRe.test(hintNo) || !/Even all-out/.test(hintNo)) fail('the lower-the-slider hint: ' + JSON.stringify({ yes: (hintYes.match(/Even all-out[^.]*\.[^.]*\.[^.]*\./) || [hintYes.slice(0, 200)])[0], no: (hintNo.match(/Even all-out[^.]*\./) || [hintNo.slice(0, 200)])[0] }));
    else okLog('block preset on a level car: the lower-the-slider hint at 10⁷ t (reachable at 0%), none at 10⁶ t (not reachable at 0% either)');
    // the same in the game of catch (a car fastball, 100 m)
    const duoRead = () => page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 10 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'block');
    const cHintYes = await duoRead();
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 9 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'block');
    const cHintNo = await duoRead();
    if (!hintRe.test(cHintYes) || hintRe.test(cHintNo) || !/Even all-out/.test(cHintNo)) fail('the two-player lower-the-slider hint: ' + JSON.stringify({ yes: cHintYes.slice(0, 300), no: cHintNo.slice(0, 200) }));
    else okLog('game of catch, block preset on a car fastball: the hint at 10⁷ t, none at 10⁶ t');
    // moving the slider with the element open changes the two-player result (airAbsorb is part of its key)
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 10 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'block');
    const before = await duoRead();
    await page.evaluate(() => { document.getElementById('powers').open = true; const s = document.getElementById('air-absorb'); s.value = '0'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForTimeout(600); await settle(page, 'duo-bay');
    const after = await duoRead();
    if (before === after || hintRe.test(after) || !/Effort: /.test(after)) fail('moving the slider with the element open: ' + JSON.stringify({ before: before.slice(0, 160), after: after.slice(0, 160) }));
    else okLog('moving Air resistance absorbed to 0% redraws the two-player preset: ' + after.slice(0, 70) + '…');
    // each power says where it changed a result
    await load({ action: 'throw' }); await pick('#effort', 'allout');
    const thr = (await chips()).join(' | ');
    await load({ action: 'stomp', logKg: 8 }); await pick('#effort', 'allout');
    const stp = (await chips()).join(' | ');
    const want = [[thr, 'No drag: their power'], [thr, 'His recoil goes to the endless ocean: their power'], [thr, 'Held together by their power'], [stp, 'The ground holds: their power']];
    const missing = want.filter(([t, w]) => !t.includes(w));
    if (missing.length) fail('power labels missing: ' + missing.map(([t, w]) => w + ' in [' + t + ']').join('; ')); else okLog('the powers label their results: ' + want.map(([, w]) => w).join('; '));
    // BRIEF-canon.md items 2 and 7: their own recoil goes to their source, the endless ocean, not into the planet. With the
    // defaults (and with both Bolted switches on too) no tab or card sends their own recoil into the planet, keeps
    // 'still obeys Newton' or says momentum is never absorbed; each tab is read at the least disruptive effort and all-out
    // ('not into the planet' is the new wording and is allowed; Bolted's own push 'into the planet instead' has no recoil
    // words; Collide's incoming hits are pull request 4's)
    const RECOIL_PLANET = /(?:recoil|push back|pull back)[^.]*(?<!not )into the planet|the planet keeps (?:the|it|no)\b|still obeys Newton|momentum is never absorbed|no power absorbs momentum/gi;
    const pageText = () => page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return b.textContent.replace(/\s+/g, ' '); });
    const planet = [];
    for (const foot of [{ anchor: 'friction', oAnchor: 'friction' }, { anchor: 'bolted', oAnchor: 'bolted' }]) {
      for (const tab of SOLO.concat(DUO)) {
        const duo = DUO.includes(tab), st = Object.assign({}, foot, duo ? { duoOpen: true, duoAction: tab } : { action: tab });
        await load(st); if (duo) await settle(page, 'duo-bay');
        for (const e of ['least', 'allout']) {
          if (e === 'allout') { if (duo) await pick('#duo-effort', 'allout'); else if (await page.$('#effort')) await pick('#effort', 'allout'); else continue; }
          const hits = (await pageText()).match(RECOIL_PLANET);
          if (hits) planet.push(tab + ' (' + foot.anchor + ', ' + e + '): ' + Array.from(new Set(hits)).join(' | ').slice(0, 200));
        }
      }
    }
    const eyebrow = await page.$eval('.hero .eyebrow', (n) => n.textContent.trim());
    if (planet.length || eyebrow !== 'Indestructible · never tires · unlimited') fail('their own recoil into the planet, or the old wording (BRIEF-canon.md items 2 and 7): eyebrow "' + eyebrow + '"; ' + planet.slice(0, 6).join(' ; '));
    else okLog('no tab or card sends their own recoil into the planet or says momentum is never absorbed (friction and bolted, least disruptive and all-out); the eyebrow reads "' + eyebrow + '"');
    // Pull says where its ground shaking comes from: with the power on the rope's pull back goes to the endless ocean and
    // the shaking is his own steps' (on friction his grip caps it, so plaster never cracks); with it off the lab doesn't
    // count a pull's shaking and says why (never the generic 'doesn't model' text; review round 2 of pull request 2)
    await load({ action: 'pull' }); await pick('#effort', 'plaster');
    const pullOn = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
    await load({ action: 'pull', ownRecoil: false }); await pick('#effort', 'plaster');
    const pullOff = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
    if (!/Even all-out, this move doesn’t shake the ground enough that plaster may crack [^.]*\. They take their own recoil: the rope’s pull back on him goes to the endless ocean, so none of it reaches the ground\. The shaking the lab counts is from his own steps[^.]*\. His grip caps it/.test(pullOn) || /nothing of the pull reaches the ground/.test(pullOn) || /doesn’t model the ground shaking from this move/.test(pullOn + pullOff) || !/the lab doesn’t count it/.test(pullOff)) fail('Pull should say where its ground shaking comes from: on ' + pullOn.slice(0, 300) + ' | off ' + pullOff.slice(0, 260));
    else okLog('Pull says where its ground shaking comes from, with the power on (his own steps, capped by his grip; the rope’s pull back goes to the endless ocean) and off (a steady load the lab doesn’t count)');
    // the Throw tab at the default least disruptive car throw names the momentum his source takes back (the brief's
    // 22,000 kg·m/s), as the engine gives it at the effort the page shows
    await load({ action: 'throw' });
    const thrT = await bayText(), thrM = thrT.match(/goes into their source, the endless ocean: ([\d,]+) kg·m\/s, the car’s momentum/), thrUse = thrT.match(/as hard as lifting ([\d.,]+)\s(t|kg)/);
    const thrJ = thrUse ? await page.evaluate((kg) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g; const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
      const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: kg * g };
      const r = P.throwObject(c, D.objects.find((x) => x.id === 'car'), 45); return r.recoilAbsorbed ? r.recoilAbsorbed.J : null; }, Number(thrUse[1].replace(/,/g, '')) * (thrUse[2] === 't' ? 1000 : 1)) : null;
    const thrShown = thrM ? Number(thrM[1].replace(/,/g, '')) : null;
    if (!thrShown || !(thrJ > 0) || Math.abs(thrShown / thrJ - 1) > 0.03 || Math.abs(thrShown / 22000 - 1) > 0.03) fail('the default throw should name the momentum taken back (about 22,000 kg·m/s): shown ' + thrShown + ', engine ' + thrJ);
    else okLog('the default least disruptive car throw names the momentum his source takes back: ' + thrM[1] + ' kg·m/s (engine ' + Math.round(thrJ) + ')');
    // a catch the catcher's power keeps him planted in: the 10²⁰ kg fastball that carried him off at about 4,000 km/s
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 20 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
    const carried = await page.$eval('#duo-bay', (n) => n.textContent.replace(/\s+/g, ' '));
    if (!/He isn’t carried off: without it the catch would carry him off/.test(carried) || /[Cc]arries Ollie off|carries him off at|Ollie carried off/.test(carried)) fail('the catch at a 10²⁰ kg dial should keep Ollie planted: ' + ((carried.match(/[^.]*carr[^.]*\./g) || []).join(' ') || carried.slice(0, 300)));
    else okLog('a catch at a 10²⁰ kg dial: Ollie isn’t carried off (his stop goes to the endless ocean)');
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
    const as0text = await bayText();
    // at 0% with Things keep their form off, the page's text from before the powers (main)
    if (!/leaves the Earth/.test(as100) || !/no fireball around it/.test(as100) || !/turns into a fireball/.test(as0) || !/comes out as a fireball over roughly the first 27\.8 m of its path, about where it has swept up its own mass of air/.test(as0text)) fail('All-Star baseball: 100% ' + as100.slice(0, 200) + ' | 0% ' + as0.slice(0, 200));
    else okLog('All-Star baseball, level, all-out: at 100% "' + as100.slice(0, 70) + '…"; at 0% with Things keep their form off, main\'s fireball text');
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
    // (Ollie jumping onto him at a 1,000 t dial: the hit's push reaches the ground through Rex's legs, over at least a
    // limb's contact time)
    // Standing, Ollie's sprint into him (sideways) just slides his feet: the ground takes only his friction.
    // (BRIEF-canon.md item 4: with They take their own recoil on, a charger landing on a bolted Rex is the paradox, so only
    // his take-off shakes the ground, and at a 10^6 kg dial that never cracks plaster; pull request 4's block checks it.
    // The bolted case here is the physics it was written for, with the power off)
    const colRead = async (anchor) => { await load(Object.assign({ duoOpen: true, duoAction: 'collide', anchor }, anchor === 'bolted' ? { colSrc: 'jump', logKg: 6, ownRecoil: false } : {})); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      return page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' ')); };
    const colB = await colRead('bolted'), colF = await colRead('friction');
    if (!/Effort: /.test(colB) || !/The least effort that shakes the ground enough that plaster may crack/.test(colB)) fail('Collide, plaster preset, Rex bolted: ' + colB.slice(0, 300));
    else okLog('Collide, plaster preset, Rex bolted: ' + colB.slice(0, 90) + '…');
    if (!/Even all-out, this test doesn’t shake the ground enough that plaster may crack/.test(colF)) fail('Collide, plaster preset, Rex standing: ' + colF.slice(0, 300));
    else okLog('Collide, plaster preset, Rex standing: says it never does (his feet slide)');
    // with Things keep their form on, the game of catch never says the ball bursts or is destroyed (default fastball)
    await load({ duoOpen: true, duoAction: 'catch', cStyle: 'hard' }); await settle(page, 'duo-bay');
    const kf = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    if (/probably bursts|is destroyed/.test(kf.replace(/a real ball would probably burst/g, ''))) fail('catch with Things keep their form on says it bursts: ' + (kf.match(/[^.]*bursts[^.]*\./) || [''])[0]); else okLog('catch fastball with Things keep their form on: no burst or destroyed ball');
    // the plaster preset on the other two-player tests: the thrown partner's landing finds an effort; with the defaults
    // the shove's and the game of catch's own pushes go to their source (BRIEF-canon.md item 2), so nothing in them shakes
    // the ground and the page says why; with that power off and Bolted on, Unbreakable footing sends the shover's and
    // the catcher's pushes into the ground and they find an effort; an even arm wrestle is a dead heat (no pin, so no blow
    // into the ground): a definite 'never'
    const dp = [], RECOIL_WHY = /Even all-out, this test doesn’t shake the ground enough that plaster may crack [^.]*\. They take their own recoil: /;
    for (const [tab, extra, want] of [['arm', { logKg: 12 }, 'never'], ['wrestle', { wrestleMove: 'shove', logKg: 8 }, 'recoil'], ['wrestle', { wrestleMove: 'shove', logKg: 8, ownRecoil: false, anchor: 'bolted' }, 'finds'], ['wrestle', { wrestleMove: 'throw', logKg: 8 }, 'finds'],
      ['catch', { cObj: 'car', cStyle: 'hard', logKg: 9 }, 'recoil'], ['catch', { cObj: 'car', cStyle: 'hard', logKg: 9, ownRecoil: false, anchor: 'bolted', oAnchor: 'bolted' }, 'finds']]) {
      await load(Object.assign({ duoOpen: true, duoAction: tab }, extra)); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      const t = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
      if (!({ finds: /Effort: .*The least effort that shakes the ground enough that plaster may crack/, never: /Even all-out, this test doesn’t shake the ground/, recoil: RECOIL_WHY })[want].test(t) || /undefined|NaN/.test(t)) dp.push(tab + (extra.wrestleMove || '') + (extra.ownRecoil === false ? ' (own recoil off, bolted)' : '') + ': ' + t.slice(0, 200));
    }
    if (dp.length) fail('two-player plaster presets: ' + dp.join(' ; ')); else okLog('the plaster preset finds an effort on the Wrestle throw, and on the shove and Catch with They take their own recoil off and Bolted on; with it on (the default) those two say why they never shake the ground; never for an even arm wrestle');
    // ---- review round 1 of BRIEF-canon.md pull request 2 (research/reviews/canon-2-round1.json): each of these fails on
    // the page before its fix
    {
      const duoTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      const num = (x) => Number(String(x).replace(/,/g, ''));
      const r1 = [];
      // code-1: an unlimited shove into a bolted Ollie on real rock, Rex standing with his recoil taken: only the rock
      // around Ollie's bolts tears out (Rex stays put); not 'both sets of bolts' with Rex shoved off at light speed
      const shoveInf = { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted', unbreakable: false };
      await load(shoveInf); await settle(page, 'duo-bay');
      const infLeast = await duoTxt('.effort-read');
      await pick('#duo-effort', 'allout');
      const infV = await duoTxt('.verdict');
      if (!/the rock gives around Ollie’s bolts/.test(infV) || !/Rex’s push back goes to the endless ocean \(They take their own recoil\), so he stays put/.test(infV) || /both sets of bolts|shoves Rex and Ollie apart/.test(infV) || !/Past that, the rock tears out around Ollie’s bolts\./.test(infLeast)) r1.push('code-1, unlimited shove into a bolted Ollie: ' + infV.slice(0, 200) + ' | ' + infLeast.slice(0, 160));
      // copy-1: the default shove names Rex's push back, what Ollie leaves with and what his sliding feet hand the ground
      // (they add up; Ollie's share matches his speed; no 'equal and opposite share'); the power's hint states the rule
      await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }); await settle(page, 'duo-bay');
      const shH = await duoTxt('.happens'), shV = await duoTxt('.verdict');
      const shM = shH.match(/That push back on Rex \(([\d,]+) kg·m\/s\) goes to the endless ocean \(below\)\. Ollie leaves with ([\d,]+) kg·m\/s of it; the friction under his sliding feet hands the ground the rest \(([\d,]+) kg·m\/s\) while the push lasts\./), vO = shV.match(/Ollie flies back at ([\d.]+) m\/s/);
      const hint = await page.evaluate(() => document.getElementById('sw-recoil').parentElement.textContent.replace(/\s+/g, ' '));
      if (!shM || !vO || /equal and opposite share/.test(shH) || Math.abs(num(shM[2]) + num(shM[3]) - num(shM[1])) > 0.03 * num(shM[1]) || Math.abs(num(shM[2]) / (3000 * Number(vO[1])) - 1) > 0.02 || !(num(shM[3]) > 0.1 * num(shM[1]))
        || /as much momentum as what they set moving carries/.test(hint) || !/the whole push back of the move, the other way: the momentum of what they set moving or stop, plus whatever resists it while they push/.test(hint)) r1.push('copy-1, the shove\'s push back: ' + ((shH.match(/Newton’s third law[^/]*?(?=After|They take|$)/) || [shH.slice(0, 260)])[0]) + ' | hint ' + ((hint.match(/The endless ocean takes[^.]*\./) || [''])[0]));
      // copy-2: Ollie bolted (the shove stalls) and both bolted: the box and the item agree that the push presses into the
      // ground under Ollie and Rex's push back goes to the endless ocean; the toss with Ollie bolted describes no toss
      for (const [lab, st] of [['Ollie bolted', { oAnchor: 'bolted' }], ['both bolted', { oAnchor: 'bolted', anchor: 'bolted' }]]) {
        await load(Object.assign({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }, st)); await settle(page, 'duo-bay');
        // (review round 2, code-8: the tile too, and the math line: only Ollie's bolts hold; copy-4)
        const box = await duoTxt('.effort-read'), it = await duoTxt('.happens'), v = await duoTxt('.verdict'), tl = await duoTxt('.tiles'), mth = await duoTxt('details.math');
        if (/nothing of the shove reaches the ground|sliding to a stop|presses into the ground under their feet|footing on both sides|either one’s footing/.test(box + it + v + tl) || !/The one shoved still presses on the ground through his feet or bolts, a steady push/.test(box) || !/Ollie’s bolts hold, so the push presses into the ground under him, and Rex’s push back goes to the endless ocean/.test(it) || !/the shove is weaker than Ollie’s bolts/.test(tl) || /on both sides/.test(mth) || !/It moves nobody unless it beats Ollie’s bolts \(plus their gravity\); Rex’s push back goes to the endless ocean, so his own footing plays no part/.test(mth)) r1.push('copy-2, a stalled shove (' + lab + '): ' + v.slice(0, 100) + ' | ' + box.slice(-260) + ' | ' + it.slice(0, 260) + ' | tile ' + tl.slice(-80) + ' | math ' + mth.slice(-200));
      }
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', oAnchor: 'bolted' }); await settle(page, 'duo-bay');
      const tossB = await duoTxt('.effort-read');
      if (/the toss and the catch are Rex’s own pushes/.test(tossB)) r1.push('copy-2, the toss with Ollie bolted (it can\'t be done): ' + tossB.slice(-200));
      // copy-3: a bolted pull with the power off takes a fraction of a second all-out, not 'a steady load over seconds'
      await load({ action: 'pull', obj: 'car', anchor: 'bolted', ownRecoil: false }); await pick('#effort', 'allout');
      const plV = await page.$eval('#bay .verdict', (n) => n.textContent.replace(/\s+/g, ' ')), plB = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
      const plT = plV.match(/in ([\d.,]+ m?s)\./), plS = plB.match(/through his bolts into the planet, over the ([\d.,]+ m?s) the pull takes all-out, and his steps push his own body along\. With They take their own recoil off the lab doesn’t count a pull’s ground shaking/);
      if (/steady load over seconds/.test(plB) || !plT || !plS || plT[1] !== plS[1]) r1.push('copy-3, the bolted pull with the power off: ' + plV.slice(0, 60) + ' | ' + ((plB.match(/Bolted, the rope[^.]*\.[^.]*\./) || [plB.slice(0, 200)])[0]));
      // physics: a stomp standing with the power off is an upper bound too (his standing foot unloads), as bolted is;
      // with the power on it isn't
      const stompSay = async (st) => { await load(Object.assign({ action: 'stomp' }, st)); await pick('#effort', 'allout'); return page.$eval('#bay .happens', (n) => n.textContent.replace(/\s+/g, ' ')); };
      const st20 = await stompSay(Object.assign({ logKg: Math.log10(20000) }, POWERS_OFF)), stDef = await stompSay(POWERS_OFF), stOn = await stompSay({});
      if (!/his standing foot presses on it less by the part of the push that doesn’t lift him \(all of it here\)[^.]*so the shaking it gives is an upper bound/.test(st20) || !/his standing foot presses on it less by the part of the push that doesn’t lift him \(\d+% of the foot’s momentum here\)[^.]*upper bound/.test(stDef) || /upper bound/.test((stOn.match(/They take their own recoil: driving the foot[^.]*\.[^.]*\.[^.]*\./) || [''])[0]) || !/Nothing pulls on the ground through his standing foot/.test(stOn))
        r1.push('the stomp\'s upper bound, standing: off at 20,000 kg ' + ((st20.match(/The lab counts only[^.]*\./) || ['(none)'])[0]) + ' | off at the default ' + ((stDef.match(/The lab counts only[^.]*\./) || ['(none)'])[0]));
      // copy-4: a quick arm-wrestling pin with the power on names the momentum the swing's push backs leave in their source
      await load({ duoOpen: true, duoAction: 'arm' }); await settle(page, 'duo-bay');
      await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
      await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate(() => { const s = document.getElementById('o-strength'); s.value = '4.5'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
      await page.waitForTimeout(800); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const pinH = await duoTxt('.happens'), pinM = pinH.match(/table hands their momentum \(([\d,]+) kg·m\/s\)[^/]*on balance it takes ([\d,]+) kg·m\/s, up, the forearms’ momentum/);
      if (!pinM || pinM[1] !== pinM[2]) r1.push('copy-4, the quick pin\'s figure: ' + ((pinH.match(/Unbreakable footing: the ground under the table[^/]*/) || [pinH.slice(-300)])[0]));
      // (refuted, wording only) a catch that slams into Ollie: his arms stop part of it, his chest the rest, and the whole
      // catch is absorbed (canon)
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'bus', cLogD: 1, cStyle: 'hard' }); await settle(page, 'duo-bay');
      const slamH = await duoTxt('.happens');
      if (!/Ollie’s arms stop part of it and the rest slams into his chest\. A catch is absorbed whole \(canon\), so all of the bus’s momentum \([\d,]+ kg·m\/s\) goes into their source/.test(slamH)) r1.push('the catch slam\'s wording: ' + ((slamH.match(/They take their own recoil: (stopping|Ollie’s arms)[^.]*\.[^.]*\./) || [slamH.slice(0, 200)])[0]));
      if (r1.length) fail('review round 1 (pull request 2): ' + r1.join(' ;; ')); else okLog('review round 1 (pull request 2): the unlimited shove into a bolted Ollie tears only his rock; the shove names its push back, Ollie\'s share and his feet\'s; a stalled shove and a bolted toss say what happens; the bolted pull\'s time; the standing stomp\'s upper bound; the quick pin\'s figure; the catch slam\'s wording');
    }
    // ---- end of review round 1 of pull request 2
    // ---- review round 2 of BRIEF-canon.md pull request 2 (research/reviews/canon-2-round2.json): each of these fails on
    // the page before its fix (4ea43ef)
    {
      const duoTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      const soloTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      const num = (x) => Number(String(x).replace(/,/g, ''));
      const r2 = [];
      // copy-1: a bolted pull with the power on: his steps push his own body along and that is counted (it is the move,
      // not recoil): all-out at the default dial it cracks plaster near him, and at a 10⁶ kg dial the courtesy ceiling is
      // under the dial; no 'gently' and no 'Ground shaking: none'. On friction his grip caps them and nothing cracks.
      // (Review round 3 capped his steps by his legs, bolted too, and its re-check set that cap at the strength he uses, as
      // in a sprint: so at the default dial the car's steps crack plaster only out to about 1.6 m, short of the nearest
      // people, and it has no ceiling there.)
      await load({ action: 'pull', anchor: 'bolted' }); await pick('#effort', 'allout');
      const pbH = await soloTxt('.happens'), pbE = await soloTxt('.effort-read');
      const pbW = pbH.match(/It is his own body’s momentum, ([\d,]+) kg·m\/s over ([\d.,]+ m?s) \(his legs cap it: at most the strength he uses, /);
      if (!pbW || /gently/.test(pbH + pbE) || /Ground shaking: none/.test(pbE) || /nothing caps it/i.test(pbH + pbE) || !/enough that plaster may crack out to/.test(pbH)) r2.push('copy-1, the bolted pull: ' + ((pbH.match(/Bolted, his feet[^/]*?(?=Record pullers|$)/) || [pbH.slice(0, 300)])[0]) + ' | ' + pbE.slice(0, 200));
      await load({ action: 'pull', anchor: 'bolted', logKg: 6 });
      const pb6 = await soloTxt('.effort-read');
      if (!/Courtesy ceiling: [\d.]+% \(lifting [\d.,]+ t\)\. Past that, the ground shakes hard enough that plaster may crack/.test(pb6)) r2.push('copy-1, the bolted pull at 10⁶ kg: ' + pb6.slice(0, 200));
      // physics-pull-nothing-reaches-ground: a sliding load (the 511 kg bar) is called sliding, and only the rope's pull
      // back is said to stay off the ground
      await load({ action: 'pull', obj: 'bar511' });
      const barT = await page.$eval('#bay', (n) => n.textContent.replace(/\s+/g, ' '));
      if (/nothing of the pull reaches the ground/.test(barT) || /rolling/.test(barT.replace(/Rolling resistance/g, '')) || !/the load’s momentum plus the sliding resistance it overcame/.test(barT) || !/The load’s sliding presses on the ground too/.test(barT)) r2.push('physics-pull, the bar slides: ' + ((barT.match(/Nothing of the rope[^)]*\)[^)]*\)/) || [barT.slice(0, 200)])[0]));
      // copy-2: a bolted pull with the power off, at the default (least disruptive) effort: the box's time is labelled
      // all-out (the verdict gives the effort's own time)
      await load({ action: 'pull', anchor: 'bolted', ownRecoil: false });
      const plLv = await soloTxt('.verdict'), plLb = await soloTxt('.effort-read');
      if (!/the pull takes all-out/.test(plLb) || /over the [\d.,]+ m?s the pull takes\./.test(plLb) || !/in 9\.\d+ s\./.test(plLv)) r2.push('copy-2, the bolted pull\'s time at the default effort: ' + plLv.slice(0, 60) + ' | ' + ((plLb.match(/Bolted, the rope[^.]*\./) || [plLb.slice(0, 200)])[0]));
      await load({ action: 'pull', ownRecoil: false });
      const plFb = await soloTxt('.effort-read');
      if (!/all-out his footing \(about [\d.,]+ kN\) sets his pace/.test(plFb)) r2.push('copy-2, the friction pull\'s figures at the default effort: ' + plFb.slice(0, 260));
      // physics-hint-weight-in-ocean: the hint says the weight held up stays on their feet; the default throw (45 degrees)
      // names its momentum as the part that sets the car moving, its weight on his feet
      await load({ action: 'throw' });
      const thH = await soloTxt('.happens'), hint = await page.evaluate(() => document.getElementById('sw-recoil').parentElement.textContent.replace(/\s+/g, ' '));
      if (!/The weight of what they hold up while they push stays on their feet, as on the Lift tab\./.test(hint) || !/rolling or sliding, a shoved partner’s feet/.test(hint) || !/the part of that push that sets it moving goes into their source, the endless ocean: [\d,]+ kg·m\/s, the car’s momentum, back along the throw \(his arm’s comes back to him as the follow-through stops it; the car’s weight, which he holds up, rests on his feet\)/.test(thH)) r2.push('physics-hint, the weight on his feet: ' + ((hint.match(/The endless ocean takes[^.]*\.[^.]*\./) || [''])[0]) + ' | ' + ((thH.match(/They take their own recoil: the car[^)]*\)/) || [thH.slice(0, 200)])[0]));
      // copy-5: a throw that reaches the catcher as plasma isn't caught: an incoming hit, not his own push back (the hint,
      // the cards and the view say so)
      // (pull request 4: with Ollie's Never knocked back on, the default, he isn't moved; this check is for his switch off)
      await load({ duoOpen: true, duoAction: 'catch', cStyle: 'hard', logKg: 20, keepForm: false, airAbsorb: 0.5, oNoKnockback: false }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const pzV = await duoTxt('.verdict'), pzH = await duoTxt('.happens'), cards = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      const hint5 = await page.evaluate(() => document.getElementById('sw-recoil').parentElement.textContent.replace(/\s+/g, ' '));
      if (!/carries Ollie off/.test(pzV) || !/They take their own recoil doesn’t cover this: Ollie doesn’t catch it, it hits him, and an incoming hit isn’t his own push back\. That is Never knocked back’s case, and Ollie’s switch is off \(Their powers\), so it carries him off, as above\./.test(pzH) || /So they aren’t shoved back, launched or carried off/.test(hint5) || !/An incoming hit, such as a throw that reaches the catcher as plasma, isn’t their own push back/.test(hint5) || !/A throw that reaches him as plasma \(Things keep their form off, some of the air’s drag left\) isn’t caught: it hits him/.test(cards) || !/a throw that reaches the catcher as plasma hits him rather than being caught/.test(cards) || /They stay planted \(never shoved back, launched or carried off\)/.test(cards)) r2.push('copy-5, the plasma hit: ' + pzV.slice(-120) + ' | ' + ((pzH.match(/They take their own recoil doesn’t[^.]*\.[^.]*\.[^.]*\./) || ['(no item)'])[0]));
      // copy-4: the catch math with the catcher's power on: planted, no slide, the slam's speed
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'bus', cStyle: 'hard', cLogD: 1 }); await settle(page, 'duo-bay');
      const bm = await duoTxt('details.math');
      if (/he slides|Slide: the pair coasts|plus his own slide back/.test(bm) || !/Then his feet hold \(They take their own recoil: he is planted\)[^.]*; if that isn’t enough, it reaches his chest at v² = v₁² − 2d\(F − m g sin\(angle\)\)\/\(m \+ m_h\)/.test(bm)) r2.push('copy-4, the catch math: ' + ((bm.match(/Catch: first contact[^]*?(?=Nose heating|Launch:|$)/) || [bm.slice(0, 300)])[0]).slice(0, 400));
      // code-1: the game of catch's caveat says nothing pushes on the ground only where every leg's object reaches the
      // catcher; where it lands on and around him (the semi at the default dial) or hits the ground (a baseball at 10²⁰ kg,
      // 100 km apart) the lab doesn't judge that shaking, and the plaster preset doesn't say it never shakes the ground
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'semi' }); await settle(page, 'duo-bay');
      const semiB = await duoTxt('.effort-read');
      if (/nothing in this test pushes on the ground/.test(semiB) || !/The lab doesn’t judge the shaking where the semi lands or hits in this test\./.test(semiB)) r2.push('code-1, the semi lands on and around Ollie: ' + semiB.slice(-260));
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 5, logKg: 20 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      const hgV = await duoTxt('.verdict'), hgB = await duoTxt('.effort-read');
      if (!/hits the ground about/.test(hgV) || /nothing in this test pushes on the ground|Even all-out, this test doesn’t shake the ground/.test(hgB) || !/The lab doesn’t judge the shaking where the baseball lands or hits in this test\./.test(hgB)) r2.push('code-1, the baseball hits the ground: ' + hgB.slice(0, 300));
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg: 15 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      const tsV = await duoTxt('.verdict'), tsB = await duoTxt('.effort-read');
      if (!/doesn’t come back down/.test(tsV) || /the catch/.test(tsB) || !/the toss is Rex’s own push, so its push back goes to the endless ocean/.test(tsB)) r2.push('code-1, the toss with no catch: ' + tsV.slice(0, 80) + ' | ' + tsB.slice(0, 300));
      // code-3 (copy-3): an unlimited shove into a bolted Ollie on real rock: all-out the rock tears out, so no 'steady push'
      // caveat; the break-the-ground preset names Ollie's rock, not their feet
      const shoveInf = { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted', unbreakable: false };
      await load(shoveInf); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      const siP = await duoTxt('.effort-read');
      await pick('#duo-effort', 'ground');
      const siG = await duoTxt('.effort-read');
      if (/a steady push/.test(siP) || !/tears the rock out around Ollie’s bolts/.test(siG) || /under their feet/.test(siG)) r2.push('code-3, the unlimited shove into a bolted Ollie: ' + siP.slice(0, 260) + ' | ' + siG.slice(0, 160));
      // code-4: with every power at its default (Unbreakable footing on), the same shove has no physical answer, and only
      // Ollie is held: not 'one unbreakable system'
      await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted' }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const pxV = await duoTxt('.verdict');
      if (!/Ollie is bolted to ground that their power holds/.test(pxV) || /one unbreakable system/.test(pxV)) r2.push('code-4, the one-sided paradox: ' + pxV.slice(0, 200));
      // code-6: a catch Ollie can't hold up (Rex at 10⁵ kg lobs a car 30 m to Ollie at a 500 kg what-if strength): not
      // 'stopping it is Ollie's own push'
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cLogD: Math.log10(30), cStyle: 'easy', logKg: 5 }); await settle(page, 'duo-bay');
      await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
      await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate(() => { const s = document.getElementById('o-strength'); s.value = String(Math.log10(500)); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
      await page.waitForTimeout(800); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const chV = await duoTxt('.verdict'), chH = await duoTxt('.happens');
      if (!/can’t even hold the car up/.test(chV) || /stopping it is Ollie’s own push/.test(chH) || !/They take their own recoil: Ollie’s arms can’t hold it, so it slams into his chest\. A catch is absorbed whole \(canon\)/.test(chH)) r2.push('code-6, a catch he can\'t hold: ' + chV.slice(0, 120) + ' | ' + ((chH.match(/They take their own recoil: (stopping|Ollie’s arms)[^.]*\.[^.]*\./) || [chH.slice(0, 200)])[0]));
      // review round 3, code-2: round 2's fixes that had no covering check (each fails with its round 2 fix reverted):
      // (a) the default partner toss is caught, so its caveat names the catch (out.caught)
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'partner' }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      const tcB = await duoTxt('.effort-read');
      if (!/They take their own recoil: the toss and the catch are Rex’s own pushes, so their push back goes to the endless ocean and nothing reaches the ground to shake it\./.test(tcB) || /the toss is Rex’s own push,/.test(tcB)) r2.push('code-2 (a), the default partner toss is caught: ' + tcB.slice(0, 300));
      // (b) the default friction pull, all-out: his steps are capped by his grip (the Pull item's friction branch)
      await load({ action: 'pull' }); await pick('#effort', 'allout');
      const pfH = await soloTxt('.happens');
      if (!/It is his own body’s momentum, [\d,]+ kg·m\/s over [\d.,]+ m?s \(his grip caps it: his footing, [\d.,]+ kN, is the most his steps can push with\)/.test(pfH) || /bolted, nothing caps it|his legs cap it/.test(pfH)) r2.push('code-2 (b), the friction pull\'s steps: ' + ((pfH.match(/It is his own body’s momentum[^)]*\)/) || [pfH.slice(0, 300)])[0]));
      // (c) a bolted bus with the plaster preset: the effort box's reason is the bolted one (pullOnWhy), not his grip
      // (round 3 rewords it: his legs cap his steps; its re-check: at most the strength he uses, as in a bolted sprint)
      await load({ action: 'pull', obj: 'bus', anchor: 'bolted' }); await pick('#effort', 'plaster');
      const pbuE = await soloTxt('.effort-read');
      if (!/Bolted, his legs cap it: they push his own body with at most the strength he uses \(about [\d.,]+ [kM]N here, as in a bolted sprint\), so only a strong, quick pull shakes the ground\./.test(pbuE) || /His grip caps it|nothing caps it/.test(pbuE)) r2.push('code-2 (c), the bolted bus\'s reason: ' + pbuE.slice(0, 400));
      // (d) the courtesy-ceiling card: a pull's shaking counts only with the power on; not 'the lab counts neither'
      const cardTxt = await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return b.textContent.replace(/\s+/g, ' '); });
      if (!/A pull’s counts only with They take their own recoil on: the rope’s pull back then goes to the endless ocean, and the shaking is from his own steps/.test(cardTxt) || /the lab counts neither/.test(cardTxt)) r2.push('code-2 (d), the card: ' + ((cardTxt.match(/[^.]*or a pull \([^)]*\)[^.]*\./) || cardTxt.match(/A pull’s counts[^.]*\./) || ['(no pull sentence)'])[0]).slice(0, 300));
      // (e) the pull's hazard list: with the power on its shaking is his own steps'; with it off it isn't counted
      const hazOf = async (st) => { await load(Object.assign({ action: 'pull' }, st)); return soloTxt('.haz-list'); };
      const hzOn = await hazOf({}), hzOff = await hazOf({ ownRecoil: false });
      if (!/Ground shaking: from his own steps only \(the move itself/.test(hzOn) || !/Ground shaking: not counted with They take their own recoil off\./.test(hzOff) || /Ground shaking: none/.test(hzOn + hzOff)) r2.push('code-2 (e), the pull\'s hazard list: on ' + hzOn.slice(-300) + ' | off ' + hzOff.slice(-160));
      if (r2.length) fail('review round 2 (pull request 2): ' + r2.join(' ;; ')); else okLog('review round 2 (pull request 2): the bolted pull counts his steps; a sliding load slides; pull times labelled all-out; the weight he holds rests on his feet; a plasma hit is not his catch; the planted catcher\'s math; the game of catch says nothing pushes on the ground only where everything is caught; the unlimited shove into a bolted Ollie; the one-sided paradox; a catch he can\'t hold; (round 3, code-2) the caught partner toss, the friction pull\'s grip, the bolted pull\'s reason, the card and the hazard list');
    }
    // ---- end of review round 2 of pull request 2
    // ---- review round 3 of BRIEF-canon.md pull request 2 (research/reviews/canon-2-round3.json): each of these fails on
    // the page before its fix (54fadb8)
    {
      const duoTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      const soloTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      const visText = () => page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return b.textContent.replace(/\s+/g, ' '); });
      const num = (x) => Number(String(x).replace(/,/g, ''));
      const r3 = [];
      // physics-bolted-pull-legs-unbounded: Bolted removes the footing limit, not the muscle limit. With the power on his
      // legs move his own body with at most the strength he uses (its re-check, fixes-pull-legs-vs-sprint: the Sprint
      // tab's push-off, not the 1.4× leg rule for carrying weight up), so a light load is pulled at his own body's pace:
      // the bolted baseball's least disruptive pull takes 10 s (not 100 ms) and shakes nothing near him
      await load({ action: 'pull', obj: 'baseball', anchor: 'bolted' });
      const bbV = await soloTxt('.verdict'), bbS = await soloTxt('.status-row'), bbH = await soloTxt('.happens'), bbE = await soloTxt('.effort-read');
      if (!/Rex drags it 10 m in 9\.\d+ s\./.test(bbV) || !/His legs set the pace/.test(bbS) || !/His legs still move his own body, with at most the strength he uses \([\d.,]+ N\), as in a bolted sprint, so his own body sets the pace: he pulls with [\d.,]+ N of the [\d.,]+ N he could/.test(bbH) || !/Courtesy ceiling: none\./.test(bbE) || /plaster may crack|nothing caps it|1\.4×/i.test(bbE + bbH)) r3.push('legs, the bolted baseball at least effort: ' + bbV + ' | ' + bbS + ' | ' + bbE.slice(0, 220));
      // ... and all-out the bolted car: the engine's time; his steps' push (his body's momentum over the pull) at most
      // the dial (889.6 kN: all-out he uses all of it), not 1.4× (round 3) or 2.2× (round 2); his pace is the Sprint
      // tab's bolted push-off ÷ his mass; the math line names his legs' push; and the page says the pull has no
      // leg-speed limit, so he ends past his top sprint speed (the engine's figures)
      await load({ action: 'pull', anchor: 'bolted' }); await pick('#effort', 'allout');
      const bcV = await soloTxt('.verdict'), bcH = await soloTxt('.happens'), bcM = await soloTxt('details.math'), bcE = await soloTxt('.effort-read');
      const bcT = await page.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
        const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, r = P.pull(c, D.objects.find((x) => x.id === 'car')), sp = P.sprint(c);
        return { t: r.t10m, legs: r.walkPush.J / r.walkPush.T / r.usable, a: r.accel, aSprint: sp.accel, vEnd: r.vEnd, vTop: sp.vTop }; });
      const bcW = bcH.match(/It is his own body’s momentum, ([\d,]+) kg·m\/s over ([\d.]+) ms \(his legs cap it: at most the strength he uses, [\d.,]+ kN\)/), bcVt = bcV.match(/in ([\d.]+) ms\./);
      const bcS = bcH.match(/the pull leaves out two limits the Sprint tab has: how fast his legs can move, and the air’s drag on him\. So he ends the 10 m at ([\d.]+) m\/s, past his top sprint speed at this effort \(([\d.]+) m\/s\)/);
      if (!bcW || !bcVt || Math.abs(num(bcVt[1]) / (1000 * bcT.t) - 1) > 0.03 || num(bcW[1]) / (num(bcW[2]) / 1000) > 100 * 907.18474 * 9.80665 * 1.03 || !(bcT.legs <= 1 + 1e-12) || Math.abs(bcT.a / bcT.aSprint - 1) > 1e-9 || !/his legs’ push ÷ his mass, legs’ push = the strength he uses = [\d.,]+ kN \(the Sprint tab’s bolted push-off\)/.test(bcM) || /nothing caps it|1\.4×|1\.4 ×/i.test(bcH + bcE + bcM)
        || !bcS || Math.abs(num(bcS[1]) / bcT.vEnd - 1) > 0.03 || Math.abs(num(bcS[2]) / bcT.vTop - 1) > 0.03) r3.push('legs, the bolted car all-out: ' + bcV + ' (engine ' + (1000 * bcT.t).toFixed(0) + ' ms, legs ' + bcT.legs.toFixed(3) + '×, a ' + bcT.a.toFixed(1) + ' vs the sprint\'s ' + bcT.aSprint.toFixed(1) + ') | ' + ((bcH.match(/It is his own body’s momentum[^)]*\)/) || [bcH.slice(0, 200)])[0]) + ' | ' + (bcS ? bcS[0] : '(no leg-speed note)') + ' | ' + bcM.slice(-300));
      // ... and on friction at the least disruptive effort his legs, not his grip, set the car's pace; the walk sentence
      // gives his legs' push and the acceleration it allows (the legs' push ÷ his 3,000 kg, under 1 m/s², not his
      // footing's 5.9 m/s²: re-check, fixes-friction-walk-sentence-unchecked), and the math line names both caps, not
      // 54fadb8's min((pull − resistance) ÷ load mass, footing ÷ his mass) (re-check, fixes-friction-math-line-unchecked)
      await load({ action: 'pull' });
      const fcS = await soloTxt('.status-row'), fcH = await soloTxt('.happens'), fcM = await soloTxt('details.math');
      const fcW = fcH.match(/his legs’ push \(at most the strength he uses, ([\d.,]+) N, as in a sprint\), so they can speed it up by at most ([\d.]+) m\/s²/);
      if (!/His legs set the pace/.test(fcS) || !/but his own legs set the pace: he pulls with/.test(fcH) || !/\(his legs cap it: at most the strength he uses, [\d.,]+ N, less than his footing, [\d.,]+ kN\)/.test(fcH) || /1\.4×/.test(fcH)) r3.push('legs, the friction car at least effort: ' + fcS + ' | ' + ((fcH.match(/It is his own body’s momentum[^)]*\)/) || [fcH.slice(0, 200)])[0]));
      if (!fcW || !(num(fcW[2]) < 1) || Math.abs(num(fcW[2]) / (num(fcW[1]) / 3000) - 1) > 0.05 || /his footing \([\d.,]+ kN\) can speed his own body up/.test(fcH)) r3.push('legs, the friction walk sentence: ' + ((fcH.match(/He still walks[^²]*²/) || [fcH.slice(0, 200)])[0]));
      if (!/his feet push with the smaller of his footing, μ × his weight = [\d.,]+ kN, and his legs’ push, the strength he uses = [\d.,]+ N \(the Sprint tab’s push-off\)/.test(fcM) || /min\(\(pull − resistance\)|1\.4 ×/.test(fcM)) r3.push('legs, the friction math line: ' + fcM.slice(0, 400));
      // ... and at unlimited strength, bolted, all-out, his steps are still his legs' (re-check,
      // fixes-unlimited-bolted-steps-say-grip): never his grip or '∞ N' in a sentence
      await load({ action: 'pull', inf: true, anchor: 'bolted' }); await pick('#effort', 'allout');
      const uiH = await soloTxt('.happens');
      if (/his grip caps it/.test(uiH) || !/\(his legs cap it: at most the strength he uses, unbounded at unlimited strength\)/.test(uiH) || /∞ N/.test(uiH)) r3.push('legs, the unlimited bolted pull: ' + ((uiH.match(/It is his own body’s momentum[^)]*\)/) || [uiH.slice(0, 300)])[0]));
      // (on friction his footing sets the pace there: what he pulls with is of his unbounded strength, not '∞ N')
      await load({ action: 'pull', inf: true }); await pick('#effort', 'allout');
      const ufH = await soloTxt('.happens');
      if (/∞ N/.test(ufH) || !/his own footing sets the pace: he pulls with [\d.,]+ kN of his unbounded strength/.test(ufH) || !/\(his grip caps it: his footing, [\d.,]+ kN, is the most his steps can push with\)/.test(ufH)) r3.push('legs, the unlimited friction pull: ' + ufH.slice(0, 400));
      // ... and the courtesy-ceiling card says so
      const card = await visText();
      if (!/his legs push his own body with at most the strength he uses, as in a sprint, and on friction his grip caps them too, so it stays small; bolted, only his legs cap them, so only a strong, quick pull shakes the ground/.test(card) || /bolted, nothing does|at most 1\.4× the strength he uses/.test(card)) r3.push('legs, the card: ' + ((card.match(/A pull’s counts[^.]*\./) || ['(none)'])[0]));
      // physics-catch-allreach-unthrown-leg: a leg too weak to throw back throws nothing, so it lands nowhere: Ollie at a
      // 2,000 kg what-if strength, the car lobbed 30 m: everything thrown reaches the catcher, so nothing pushes on the
      // ground (not 'the lab doesn't judge where the car lands or hits')
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'easy', cLogD: Math.log10(30) }); await settle(page, 'duo-bay');
      await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
      await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate(() => { const s = document.getElementById('o-strength'); s.value = String(Math.log10(2000)); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
      await page.waitForTimeout(800); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      const wkV = await duoTxt('.verdict'), wkB = await duoTxt('.effort-read');
      if (!/Ollie can’t throw the car that far/.test(wkV) || !/Even all-out, this test doesn’t shake the ground enough that plaster may crack [^.]*\. They take their own recoil: the thrower’s push back and the catcher’s stop go to the endless ocean, so nothing in this test pushes on the ground to shake it\./.test(wkB) || /doesn’t judge/.test(wkB)) r3.push('allReach, a leg too weak to throw: ' + wkV.slice(-120) + ' | ' + wkB.slice(0, 300));
      // code-1: an unlimited shove into a bolted Ollie with the defaults (Unbreakable footing on), 'Break the ground': the
      // box is drawn on real rock, and says Unbreakable footing is set aside for it (judged at unlimited strength)
      await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted' }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'ground');
      const sgB = await duoTxt('.effort-read');
      if (!/Unbreakable footing is set aside for this test: they mean to break the ground/.test(sgB) || !/On real ground, courtesy ceiling/.test(sgB)) r3.push('code-1, the unlimited shove into a bolted Ollie, break the ground: ' + sgB.slice(0, 300));
      // copy-pull-version-history-phrase: no 'as before the power existed' on the page (the Pull tab with the power off,
      // friction and bolted, its hazard list and the card); the bolted box keeps its caveat
      await load({ action: 'pull', ownRecoil: false, anchor: 'bolted', obj: 'loco' });
      const vhB = await visText(), vhE = await soloTxt('.effort-read');
      await load({ action: 'pull', ownRecoil: false });
      const vhF = await visText();
      if (/before the power existed/.test(vhB + vhF) || !/With They take their own recoil off the lab doesn’t count a pull’s ground shaking, so a quick, hard pull may shake the ground more than the effort box says\./.test(vhE) || !/Ground shaking: not counted with They take their own recoil off\./.test(vhE)) r3.push('version-history phrase: ' + ((vhB.match(/[^.]*before the power existed[^.]*\./g) || [vhE.slice(0, 300)]).join(' | ')));
      // copy-card-bolted-pull-fraction-of-second: the card's bolted pull with the power off can be quick, with the
      // engine's own times at the page's default dial (a car 0.31 s, a locomotive about 2 s), not 'a fraction of a second'
      const qk = vhF.match(/or his bolts do over the pull, which all-out can be quick \((0\.\d+) s for a car at the page’s default dial; about (\d+) s for a locomotive, and longer at a low dial\)/);
      const qkT = await page.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
        const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'bolted' };
        return ['car', 'loco'].map((id) => P.pull(c, D.objects.find((x) => x.id === id)).t10m); });
      if (!qk || /all-out takes a fraction of a second/.test(vhF) || num(qk[1]) !== Number(qkT[0].toFixed(2)) || num(qk[2]) !== Math.round(qkT[1])) r3.push('the card\'s bolted pull times: ' + (qk ? qk[0] : ((vhF.match(/or his bolts do over the pull[^.]*\./) || ['(none)'])[0])) + ' (engine ' + qkT.map((x) => x.toFixed(2) + ' s').join(', ') + ')');
      if (r3.length) fail('review round 3 (pull request 2): ' + r3.join(' ;; ')); else okLog('review round 3 (pull request 2): his legs cap a pull\'s steps at the strength he uses, as in a sprint, bolted too (the bolted baseball and car, the friction car\'s steps, walk sentence and math, the unlimited bolted pull, the card; the pull\'s missing leg-speed limit); a leg too weak to throw lands nowhere; the unlimited shove\'s break-the-ground box sets Unbreakable footing aside; no version-history phrase; the card\'s bolted pull times');
    }
    // ---- end of review round 3 of pull request 2
    // ---- BRIEF-canon.md item 5, pull request 3: Safe passenger on by default, covering the landing and the drag. Each of
    // these fails on pull request 2's page.
    {
      const num = (x) => Number(String(x).replace(/,/g, ''));
      const soloTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      const duoAll = () => page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
      const OFF_SP = { saveV: 3, safePassenger: false };
      // the default, and the save mark (decision 2): a fresh page has it on and saves it; an unmarked save, or one
      // marked 2, with it off loads with it on (off was the old default); a save marked 3 keeps it off (a choice)
      const spState = async (st) => { await page.evaluate((x) => { if (x) localStorage.setItem('rex-lab-v1', JSON.stringify(x)); else localStorage.clear(); }, st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
        return page.evaluate(() => { const sv = JSON.parse(localStorage.getItem('rex-lab-v1')); return [document.getElementById('sw-passenger').checked, sv.safePassenger, sv.saveV].join(); }); };
      const spFresh = await spState(null), spOld = await spState({ safePassenger: false }), spTwo = await spState({ safePassenger: false, saveV: 2 }), spThree = await spState({ safePassenger: false, saveV: 3 });
      if (spFresh !== 'true,true,3' || spOld !== 'true,true,3' || spTwo !== 'true,true,3' || spThree !== 'false,false,3') fail('Safe passenger\'s default and the save mark (switch, saved, mark): fresh ' + spFresh + ', unmarked save with it off ' + spOld + ', marked 2 ' + spTwo + ', marked 3 ' + spThree);
      else okLog('Safe passenger is on on a fresh page and saved on; an unmarked save or one marked 2 with it off loads with it on; a save marked 3 keeps it off; every save is marked 3');
      // its place in Their powers: its own eyebrow, among the defaults, and the intro lists it as on by default
      const place = await page.evaluate(() => { const lab = document.getElementById('sw-passenger').closest('label'), prev = lab.previousElementSibling; return { brow: prev && prev.classList.contains('eyebrow') ? prev.textContent.trim() : null, hint: document.querySelector('#powers > p.hint').textContent.replace(/\s+/g, ' '), label: lab.textContent.replace(/\s+/g, ' ') }; });
      if (place.brow !== 'People they throw or catch' || !/Things keep their form, Safe passenger and Air resistance absorbed are on unless you turn them off/.test(place.hint) || !/feels only a manageable push, spread through their whole body, at the launch, in the air and when they land/.test(place.label) || /puts no g-force on them|the landing stay real/.test(place.label)) fail('Safe passenger in Their powers: ' + JSON.stringify(place).slice(0, 400));
      else okLog('Safe passenger has its own eyebrow (' + place.brow + '), the intro lists it as on by default, and its label covers the launch, the air and the landing');
      // the summary line: all five defaults read as one item; with Safe passenger off the others are listed without it;
      // with only Unbreakable footing off it is listed
      const sumOf = async (st) => { await load(st); return page.$eval('#powers-sum', (n) => n.textContent); };
      const sumFresh = await sumOf({ action: 'throw' }), sumOff = await sumOf(Object.assign({ action: 'throw' }, OFF_SP)), sumUb = await sumOf({ action: 'throw', saveV: 3, unbreakable: false });
      if (sumFresh !== 'Comic book · default powers on' || sumOff !== 'Comic book · unbreakable footing · own recoil · things keep their form · drag-free throws · never knocked back' || sumUb !== 'Comic book · own recoil · things keep their form · safe passenger · drag-free throws · never knocked back') fail('the Their powers summary: fresh "' + sumFresh + '", Safe passenger off "' + sumOff + '", Unbreakable footing off "' + sumUb + '"');
      else okLog('the Their powers summary counts Safe passenger among the default powers: "' + sumFresh + '"; off: "' + sumOff + '"');
      // the person throw at the defaults (decision 1; the brief's figures at 3,000 kg): least disruptive about 3.7% of
      // his strength (3.34 t), ceiling about 30% (27 t) from the landing's plaster; with it off, 0.37% (333 kg), the
      // person's g-force
      await load({ action: 'throw', obj: 'person' });
      const pOnE = await soloTxt('.effort-read'), pOnH = await soloTxt('.happens'), pOnT = await soloTxt('.tiles');
      await load(Object.assign({ action: 'throw', obj: 'person' }, OFF_SP));
      const pOffE = await soloTxt('.effort-read'), pOffH = await soloTxt('.happens');
      if (!/Effort: 3\.7% of his strength \(as hard as lifting 3\.34 t\)\. The gentlest push that lands the person 30 m away\./.test(pOnE) || !/Courtesy ceiling: 30% \(lifting 27 t\)\. Past that, the ground shakes hard enough that plaster may crack 5 m from where it lands\./.test(pOnE)
        || !/Effort: 0\.37% of his strength \(as hard as lifting 333 kg\)/.test(pOffE) || !/Courtesy ceiling: 0\.37% \(lifting 333 kg\)\. Past that, the person is pressed harder than amusement rides allow/.test(pOffE)) fail('the person throw\'s least effort and ceiling: on ' + pOnE.slice(0, 300) + ' | off ' + pOffE.slice(0, 200));
      else okLog('the person throw: least disruptive 3.7% (3.34 t), ceiling 30% (27 t) from the landing\'s plaster; with Safe passenger off 0.37% (333 kg), the person\'s g-force');
      // the landing (decisions 4 and 9): with it on the text names the energy taken back, as the engine gives it at the
      // effort shown, and the push that still reaches the ground; with it off, a fall the lab doesn't judge
      const useKg = (t) => { const m = t.match(/as hard as lifting ([\d.,]+)\s(t|kg)/); return m ? num(m[1]) * (m[2] === 't' ? 1000 : 1) : null; };
      const landOn = pOnH.match(/They land at ([\d.]+) m\/s, like falling ([\d.]+) m\. Safe passenger spreads the landing through them too and takes back its energy \(([\d.]+) kJ\), so they come down unharmed\. The landing’s push still reaches the ground, so it shakes the ground as a real landing does\./);
      const engLand = await page.evaluate((kg) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), o = D.objects.find((x) => x.id === 'person');
        const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, use: kg * g };
        const fn = P.RESTRAINT.MOVES.throw.passengerLanding, pl = fn && fn(P.throwObject(c, o, 45), { obj: o, safePassenger: true }); return pl ? pl.absorbed : null; }, useKg(pOnE));
      if (!landOn || !(engLand > 0) || Math.abs(num(landOn[3]) * 1000 / engLand - 1) > 0.01 || Math.abs(num(landOn[3]) - 14.6) > 0.05 || /The landing is still real/.test(pOnH) || !/Lands at ?18 m\/s ?14\.6 kJ taken back: Safe passenger/.test(pOnT)
        || !/The landing is still real: they hit the ground at [\d.]+ m\/s, like falling [\d.]+ m, unless someone catches them\. With Safe passenger off the lab doesn’t judge that fall\./.test(pOffH)) fail('the person\'s landing: on ' + ((pOnH.match(/They land at[^/]*/) || pOnH.match(/The landing is still real[^/]*/) || ['(none)'])[0]).slice(0, 300) + ' (engine ' + engLand + ' J) | off ' + ((pOffH.match(/The landing is still real[^/]*/) || ['(none)'])[0]).slice(0, 200));
      else okLog('the person\'s landing with Safe passenger on names the energy taken back (' + landOn[3] + ' kJ, the engine ' + (engLand / 1000).toFixed(1) + ' kJ) and the push that still shakes the ground; off, a fall the lab doesn\'t judge');
      // ... and where the flight would burn them (Things keep their form off, real air, a 10⁸ kg dial all-out), never
      // 'unharmed' (decision 6: Safe passenger doesn't cover heat)
      await load({ action: 'throw', obj: 'person', saveV: 3, keepForm: false, airAbsorb: 0, logKg: 8 }); await pick('#effort', 'allout');
      const hotH = await soloTxt('.happens'), hotE = await soloTxt('.effort-read');
      if (/so they come down unharmed/.test(hotH + hotE) || !/but it doesn’t cover the heating in flight \(below\), so the lab can’t say they come down unharmed/.test(hotH) || !/would melt or burn away/.test(hotH) || !/but not the heating in a flight this fast \(Things keep their form is off\)/.test(hotE)) fail('the hot person throw: ' + ((hotH.match(/They land at[^/]*/) || [hotH.slice(0, 200)])[0]).slice(0, 300) + ' | ' + ((hotE.match(/For a person[^/]*/) || ['(none)'])[0]));
      else okLog('a person thrown hot enough to burn (Things keep their form off) is never called unharmed; Safe passenger doesn\'t cover heat');
      // the effort box credits Safe passenger (decision 9): the same throw all-out with it off presses the person past
      // the ride limits; and its person line says what it covers
      await load({ action: 'throw', obj: 'person' });
      const crE = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
      if (!/Safe passenger is on, so it leaves out the person pressed past the ride limits\./.test(crE) || !/Past ride limits for the person: never, because Safe passenger is on\./.test(crE) || !/For a person, Safe passenger covers the launch, the air in flight and the landing\. The landing’s energy is taken back, so they come down unharmed; its push still reaches the ground, and the shaking from it counts\./.test(crE)
        || !/For a person this covers the launch and the air in flight only\. The landing is a fall unless someone catches them, and with Safe passenger off the lab doesn’t judge it \(its shaking still counts\)\./.test(pOffE)) fail('the effort box for a person: ' + crE.slice(0, 500));
      else okLog('the effort box credits Safe passenger with the person pressed past the ride limits, and says what it covers (on) and what the lab leaves out (off)');
      // review round 2 (code-ice-shaking-counts): on the ice and the steel deck, which have no ground-wave model, nothing
      // counts the landing's shaking: the person paragraph and the Impact line say so instead of 'counts' or 'the effort
      // box gives how far' (least effort, on and off, and a 10^9.15 kg dial all-out)
      const iceT = [];
      for (const st of [{ surface: 'ice' }, { surface: 'ice', safePassenger: false }, { surface: 'steel' }]) { await load(Object.assign({ action: 'throw', obj: 'person', saveV: 3 }, st)); iceT.push(await page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '))); }
      await load({ action: 'throw', obj: 'person', saveV: 3, surface: 'ice', logKg: 9.15 }); await pick('#effort', 'allout');
      iceT.push(await page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' ')));
      if (iceT.some((t) => /shaking from it counts|shaking still counts|effort box gives how far/.test(t)) || !/its push still reaches the ground \(the lab has no ground-wave model for the ice, so it can’t judge that shaking\)\./.test(iceT[0])
        || !/with Safe passenger off the lab doesn’t judge it\./.test(iceT[1]) || !/its push still reaches the ground \(the lab has no ground-wave model for the steel deck, so it can’t judge that shaking\)\./.test(iceT[2])
        || !/Its push still reaches the ground and shakes it \(the lab has no ground-wave model for the ice, so it can’t say how far\)\./.test(iceT[3])) fail('a person thrown on ice or steel (no ground-wave model): ' + iceT.map((t) => ((t.match(/For a person[^.]*\.[^.]*\.[^.]*\./) || ['(none)'])[0]) + ' | ' + ((t.match(/Impact:[^/]*?how far[^.]*\./) || [''])[0])).join(' || ').slice(0, 900));
      else okLog('a person thrown on ice or the steel deck: the effort box and the Impact line say the lab has no ground-wave model there, not that the shaking counts');
      // a very fast person (a 10^9.15 kg dial all-out, landing past 9.6 km/s): the energy taken back, so no blast; review
      // round 1 (physics-no-quake-claim): no 'no quake' (its push still shakes the ground); (physics-fast-landing-bearing)
      // its push is far more than the slab bears, so no 'no crater' either: the ground gives way where they land. Review
      // round 2: the ground bears the downward part (they come down at 45 degrees: about 120 m/s on the slab, 100 m/s
      // straight down), over their own stop with no 1 ms floor, so granite gives way there too (about 3,200 m/s at 45
      // degrees, 2,700 m/s straight down; the floor had it bearing to 13 km/s); a 10^7.5 kg dial lands at 1,510 m/s,
      // which granite bears
      await load({ action: 'throw', obj: 'person', logKg: 9.15 }); await pick('#effort', 'allout');
      const fastH = await soloTxt('.happens');
      await load({ action: 'throw', obj: 'person', logKg: 9.15, surface: 'granite' }); await pick('#effort', 'allout');
      const fastG = await soloTxt('.happens');
      await load({ action: 'throw', obj: 'person', logKg: 7.5, surface: 'granite' }); await pick('#effort', 'allout');
      const fastG75 = await soloTxt('.happens');
      const fastI = (fastH.match(/Impact:[^/]*/) || ['(no Impact item)'])[0], fastGI = (fastG.match(/Impact:[^/]*/) || ['(no Impact item)'])[0];
      if (!/Impact: [\d.]+ t TNT, all of it taken back by Safe passenger, so no blast where they land \(the ground still gives way under its push: above\)\. Its push still reaches the ground and shakes it \(the effort box gives how far\)\./.test(fastH) || /crater up to|quake/.test(fastH) || /no crater/.test(fastI)
        || !/They land at 10\.1 km\/s, like falling [\d.,]+ km\. Safe passenger spreads the landing through them too and takes back its energy \([\d.]+ GJ\), so they come down unharmed\. The landing’s push still reaches the ground, so it shakes the ground as a real landing does\. But past a landing of about 120 m\/s coming down at 45° \(about 100 m\/s straight down\), the downward part of that push is more than the concrete slab bears, even spread over their whole facing area, so the ground gives way where they land \(the lab doesn’t size the hole, and its shaking figures are rough there\)\./.test(fastH)
        || !/Impact: [\d.]+ t TNT, all of it taken back by Safe passenger, so no blast where they land \(the ground still gives way under its push: above\)\./.test(fastG) || /quake|no crater/.test(fastG)
        || !/But past a landing of about 3,200 m\/s coming down at 45° \(about 2,700 m\/s straight down\), the downward part of that push is more than granite bears/.test(fastG)
        || !/They land at 1,510 m\/s, like falling [\d.,]+ km\. Safe passenger spreads the landing through them too and takes back its energy \([\d.]+ MJ\), so they come down unharmed\. The landing’s push still reaches the ground, so it shakes the ground as a real landing does\./.test(fastG75) || /gives way/.test(fastG75)) fail('a very fast person\'s impact: concrete ' + fastI + ' | ' + ((fastH.match(/They land at[^/]*/) || ['(no landing)'])[0]).slice(0, 400) + ' | granite ' + fastGI + ' ' + ((fastG.match(/But past[^/]*/) || ['(no give-way)'])[0]).slice(0, 200) + ' | granite 10^7.5 ' + ((fastG75.match(/They land at[^/]*/) || ['(no landing)'])[0]).slice(0, 300));
      else okLog('a very fast person\'s impact: the energy taken back by Safe passenger, so no blast and no quake claim; past what the ground bears under the downward part of the push (on the slab about 120 m/s at 45°, 100 m/s straight down; on granite 3,200 m/s at 45°, 2,700 m/s straight down) the ground gives way where they land; granite bears a 1,510 m/s landing');
      // Catch with a person (decision 7): with it on, no ride-limit harm, even the fastball in real air (pull request 2
      // flagged its drag), and a miss comes down unharmed; with it off the default lob is past the ride limits
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', airAbsorb: 0, saveV: 3, safePassenger: true, cMiss: true }); await settle(page, 'duo-bay');
      const cOn = await duoAll();
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'person' }); await settle(page, 'duo-bay');
      const cLob = await duoAll();
      await load(Object.assign({ duoOpen: true, duoAction: 'catch', cObj: 'person' }, OFF_SP)); await settle(page, 'duo-bay');
      const cOff = await duoAll();
      const RIDE = /past ride limits|harder than amusement rides allow/;
      if (RIDE.test(cOn) || RIDE.test(cLob) || !/Safe passenger: throw, flight and catch spread through them/.test(cOn) || !/Safe passenger: throw, flight and catch spread through them/.test(cLob) || !/If Ollie misses, they land [\d.]+ m behind him at [\d.]+ m\/s\. Safe passenger spreads the landing through them and takes back its energy \([\d.]+ kJ\), so they come down unharmed, with no crater or blast\. Its push still reaches the ground and shakes it\./.test(cOn)
        || !/the throw presses the person harder than amusement rides allow/.test(cOff)) fail('Catch with a person: on ' + ((cOn.match(/[^.]*(?:ride limits|rides allow)[^.]*\./) || cOn.match(/If Ollie misses[^.]*\./) || [cOn.slice(0, 200)])[0]) + ' | lob ' + ((cLob.match(/[^.]*(?:ride limits|rides allow)[^.]*\./) || [''])[0]) + ' | off ' + ((cOff.match(/[^.]*rides allow[^.]*\./) || ['(no harm)'])[0]));
      else okLog('Catch with a person: with Safe passenger on no ride-limit harm (the lob, and the fastball in real air), and a miss comes down unharmed; with it off the lob is past the ride limits');
      // ---- review round 1 of pull request 3 (research/reviews/canon-3-round1.json)
      const r1 = [];
      // physics-catch-heat-unharmed / code-1: a missed person whose flight heats them (Things keep their form off, real
      // air, a 10^8 kg dial all-out: nose air 2,800 °C) is never called unharmed (decision 6), nor 'no harm' on the palm
      // tile; the Game of catch card says Safe passenger doesn't cover heating. (Its miss skims in nearly level at 156 m/s,
      // so since review round 2 the ground bears its downward push: 'with no crater or blast')
      await load({ saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: 1, logKg: 8, airAbsorb: 0, keepForm: false }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const cHot = await duoAll();
      const cards = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      if (/so they come down unharmed|no harm/.test(cHot) || !/Nose air [\d,]+ °C: skin melts/.test(cHot) || !/If Ollie misses, they land [\d.]+ m behind him at [\d.]+ m\/s\. Safe passenger takes back the landing’s energy \([\d.]+ MJ\) and spreads its push through them, with no crater or blast, but it doesn’t cover the heating in flight \(above\), so the lab can’t say they come down unharmed\./.test(cHot)
        || !/or more on the person \(Safe passenger: spread through them; it doesn’t cover the heating in flight\)/.test(cHot)
        || !/if the catch is missed they come down unharmed, the landing’s energy taken back and its push still reaching the ground\. Past what the ground bears under the downward part of that push \(from a landing at about 100 m\/s straight down on the concrete slab, an estimate; a fastball’s miss skims in nearly level and presses down far less\), the ground gives way where they land\. It doesn’t cover heating in a very fast flight \(Things keep their form does\): with that off and some of the air’s drag left, the lab can’t say they come down unharmed\./.test(cards)) r1.push('the hot person catch (code-1): ' + ((cHot.match(/If Ollie misses[^.]*\.[^.]*\.[^.]*\./) || ['(no miss callout)'])[0]) + ' | ' + ((cHot.match(/or more on the person[^)]*\)/) || ['(no tile)'])[0]));
      // physics-fast-landing-bearing: a missed person landing past what the slab bears comes down unharmed but the ground
      // gives way, so no 'no crater'; below it (the fastball at the default dial, 60 m/s), no crater or blast. Review
      // round 2 (physics-landground-angle): the ground bears the downward part of the push, so the fastball's miss at
      // 155 m/s, which skims in at 2 degrees (cLogD 2, logKg 8, air 0%), bears it: no crater or blast; the lob's miss at
      // 176 m/s, coming down at 45 degrees (cLogD 3.5, logKg 7), gives way
      await load({ saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: 2, logKg: 8, airAbsorb: 0 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const cSkim = await duoAll();
      await load({ saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'easy', cMiss: true, cLogD: 3.5, logKg: 7 }); await settle(page, 'duo-bay');
      const cBear = await duoAll();
      if (!/If Ollie misses, they land [\d.]+ m behind him at 176 m\/s\. Safe passenger spreads the landing through them and takes back its energy \([\d.]+ MJ\), so they come down unharmed, with no blast\. Its push still reaches the ground and shakes it\. But past a landing of about 120 m\/s coming down at 45° \(about 100 m\/s straight down\), the downward part of that push is more than the concrete slab bears, even spread over their whole facing area, so the ground gives way where they land \(the lab doesn’t size the hole\)\./.test(cBear)
        || /no crater/.test(cBear) || /gives way/.test(cOn) || /gives way/.test(cSkim) || !/If Ollie misses, they land [\d.]+ m behind him at 155 m\/s\. Safe passenger spreads the landing through them and takes back its energy \([\d.]+ MJ\), so they come down unharmed, with no crater or blast\. Its push still reaches the ground and shakes it\./.test(cSkim)) r1.push('the missed person past the slab\'s bearing (the lob at 45°) and below it (the fastball skimming in at 155 m/s): ' + ((cBear.match(/If Ollie misses[^.]*\.[^.]*\.[^.]*\.[^.]*\./) || ['(no miss callout)'])[0]) + ' | ' + ((cSkim.match(/If Ollie misses[^.]*\.[^.]*\.[^.]*\.[^.]*\./) || ['(no miss callout)'])[0]));
      // physics-catch-squash-person: with Safe passenger on the first hit squashes only his palms; off, his palms and the person
      if (/squashing his palms and the person/.test(cLob) || !/squashing his palms by about [\d.]+ cm to [\d.]+ cm \(an estimate; Safe passenger spreads the hit through the person, so they aren’t squashed\)\./.test(cLob) || !/squashing his palms and the person by about [\d.]+ cm to [\d.]+ cm \(an estimate\)\./.test(cOff)) r1.push('the first hit\'s squash: on ' + ((cLob.match(/squashing[^.]*\.[^.]*\./) || ['(none)'])[0]) + ' | off ' + ((cOff.match(/squashing[^.]*\./) || ['(none)'])[0]));
      // physics-hits-ground-exception: a person fired so fast, with no air (100% absorbed), that the chord runs underground
      // is landing under Safe passenger: its energy taken back (no crater, quake or blast, no blast block), its push real.
      // Review round 2: the ground bears the downward part, along the chord (0.13 degrees); below 100% with Things keep
      // their form off the fireball reading stays (its plasma and debris hit)
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 16, cLogD: 4.5 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const hgOn = await duoAll();
      await load({ saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 16, cLogD: 4.5, airAbsorb: 0.5, keepForm: false }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const hgHalf = await duoAll();
      if (!/The person hits the ground about [\d.]+ km from Rex, carrying [\d.]+ PJ \([\d.]+ Mt TNT\)\. That is their landing, and Safe passenger covers it: it takes back all of that energy, so no blast, and spreads the stop through them, so they come down unharmed\. Its push \(2\.4 billion kg·m\/s\) still reaches the ground and shakes it\. But past a landing of about 2,100 m\/s coming down at 0\.13° \(about 100 m\/s straight down\), the downward part of that push is more than the concrete slab bears/.test(hgOn)
        || /blasts a crater|quake|where it hits the ground/.test(hgOn) || !/Its plasma and debris hit the ground about [\d.]+ km from Rex, carrying [\d.]+ PJ \([\d.]+ Mt TNT\), the heat of the air it swept up on the way included, and blasts a crater up to [\d.]+ m across/.test(hgHalf) || !/\(where it hits the ground\)/.test(hgHalf) || /Safe passenger covers it/.test(hgHalf)) r1.push('the person who hits the ground: no air ' + ((hgOn.match(/The person hits the ground[^.]*\.[^.]*\.[^.]*\./) || ['(none)'])[0]) + ' | 50%, not kept ' + ((hgHalf.match(/(?:Its plasma and debris|The person) hit[^.]*\./) || ['(none)'])[0]));
      // code-2: the Throw tab's chip and drag sentence in real air say the drag is spread through them (pull request 2's
      // 'Safe passenger, but air drag' and 'covers only his push, not the air' must not come back)
      await load({ action: 'throw', obj: 'person', saveV: 3, airAbsorb: 0 }); await pick('#effort', 'allout');
      const dragAll = await page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' ')), dragH = await soloTxt('.happens');
      if (!/Safe passenger: a manageable push, spread through them/.test(dragAll) || /Safe passenger, but air drag/.test(dragAll) || !/Safe passenger spreads that through them too, so it stays a manageable push/.test(dragH) || /covers only his push/.test(dragH)) r1.push('the person throw in real air with Safe passenger on (the drag covered): ' + ((dragH.match(/In flight, air drag[^/]*/) || ['(none)'])[0]).slice(0, 250));
      // the Their powers card gives the bearing per ground, as the engine does
      if (!/the ground gives way where they land \(taking back the energy doesn’t take back the force, as with Soft landing\): from a landing straight down at about 100 m\/s on the concrete slab or asphalt, 140 m\/s on ice, 1\.8 km\/s on steel and 2\.7 km\/s on granite, and at 20–50 m\/s on sand, gravel and clay \(estimates; a slanting landing has to be faster, about 120 m\/s at 45° on the slab, and one that skims in nearly level presses down far less\)\./.test(cards)) r1.push('the Their powers card\'s bearing speeds');
      // review round 2 (code-r1-card-fixes-unchecked): round 1's two Game of catch card fixes, the first hit squashing
      // only his palms and the ground hit with no air as a landing (in round 2's wording: below 100% with Things keep
      // their form on too, the swept air real; the Earth-scale and unbounded push)
      if (!/A person thrown in the game of catch is covered by Safe passenger \(on by default\): the throw, the flight and the catch are spread through them \(so the first hit squashes only his palms\)/.test(cards)
        || !/A person thrown so fast that the straight chord runs underground is landing too, wherever they come through whole \(with all of the drag absorbed, or with Things keep their form on\): Safe passenger takes back their own energy, but their push is far more than the ground bears, so the ground gives way there\. Below 100% absorbed, the air they swept up \(its heat and its motion\) is real and blasts its own crater\. A push big enough to move the whole Earth carries real energy too \(at least what it gives the whole planet, counted as a blast\), and an unbounded push has no physical answer\./.test(cards)) r1.push('the Game of catch card: the squash and the ground hit as a landing');
      if (r1.length) fail('review round 1 (pull request 3): ' + r1.join(' ;; ')); else okLog('review round 1 (pull request 3): a missed person whose flight heats them is never called unharmed (callout, tile, card); past what the ground bears the ground gives way where a person lands (no "no crater"); the first hit squashes only his palms; a person who hits the ground with no air is a Safe passenger landing (below 100%, the fireball); the Throw tab\'s drag chip and sentence say the drag is spread through them; the cards give the bearing speeds, the squash and the ground hit as a landing');
      // ---- review round 2 of pull request 3 (research/reviews/canon-3-round2.json)
      const r2 = [];
      // physics-hits-ground-below-100: below 100% absorbed, a person kept whole (Things keep their form on) who hits the
      // ground: their own share is their landing, taken back; only the swept air's heat and motion blast a crater (at
      // 99.9%: 32 PJ their own, 672 TJ real, a 66 m crater, not the whole 32.7 PJ's 181 m; at 50% most of it is the air's)
      const hgOf = async (st) => { await load(Object.assign({ saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: 4.5 }, st)); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout'); return duoAll(); };
      const hg999 = await hgOf({ logKg: 16, airAbsorb: 0.999 }), hg50 = await hgOf({ logKg: 16, airAbsorb: 0.5 });
      if (!/The person hits the ground about [\d.]+ km from Rex, carrying 32\.7 PJ \(7\.8 Mt TNT\), the heat of the air it swept up on the way included\. Their own share, 32 PJ, is their landing, and Safe passenger covers it: it takes back that energy and spreads the stop through them, so they come down unharmed\. The rest, 672 TJ \(160 kt TNT\), is the air it swept up, its heat and its motion, and that is real: it hits the ground with them, and blasts a crater up to 66 m across/.test(hg999)
        || /181 m|\(where it hits the ground\)/.test(hg999) || !/\(the air it swept up, where it hits the ground\)/.test(hg999)
        || !/Their own share, 846 TJ, is their landing, and Safe passenger covers it[^.]*\. The rest, 31\.8 PJ \(7\.6 Mt TNT\), is the air it swept up, its heat and its motion, and that is real: it hits the ground with them, and blasts a crater up to 180 m across/.test(hg50)) r2.push('a kept person who hits the ground below 100%: 99.9% ' + ((hg999.match(/The person hits the ground[^.]*\.[^.]*\.[^.]*\.[^.]*\./) || ['(none)'])[0]).slice(0, 500) + ' | 50% ' + ((hg50.match(/Their own share[^.]*\.[^.]*\./) || ['(none)'])[0]));
      // physics-hits-ground-unbounded-push: an unbounded push has no physical answer, not 'shakes it'; at the top of the
      // dial (10^34 kg) the push moves the whole Earth at 18.2 m/s with at least 9.9 x 10^26 J, real, counted as a blast
      const hgInf = await hgOf({ inf: true }), hg34 = await hgOf({ logKg: 34 });
      if (!/carrying unbounded energy\. That is their landing: Safe passenger takes back its energy and spreads the stop through them\. But its push is unbounded: no ground, and no planet, can take that, so this has no physical answer and the lab can’t model it\./.test(hgInf) || /shakes it|so no blast/.test(hgInf)
        || !/Its push \(110 septillion kg·m\/s\) still reaches the ground, and it is far more than a shake: even taken by the whole Earth, it moves it at 18\.2 m\/s and gives it at least 9\.9 × 10²⁶ J \([^)]*\)\. That energy is real, not taken back \(any smaller part of the ground would get more\), so it counts as a blast at least that big where they land\./.test(hg34)
        || /so no blast|shakes it\./.test(hg34) || !/\(its push into the Earth, at least\)/.test(hg34)) r2.push('the unbounded and Earth-scale push: unlimited ' + ((hgInf.match(/carrying unbounded[^.]*\.[^.]*\.[^.]*\./) || ['(none)'])[0]) + ' | 10^34 ' + ((hg34.match(/Its push \([^)]*\)[^.]*\.[^.]*\./) || ['(none)'])[0]).slice(0, 400));
      if (r2.length) fail('review round 2 (pull request 3): ' + r2.join(' ;; ')); else okLog('review round 2 (pull request 3): a kept person who hits the ground below 100% has their own share taken back and only the swept air\'s blasts a crater; an unbounded push has no physical answer, and one that moves the whole Earth counts its least energy as a blast');
    }
    // ---- end of pull request 3's checks
    // the two-player 'Break the ground' sets Unbreakable footing aside, and its ceiling is on real ground too
    await load({ duoOpen: true, duoAction: 'collide', anchor: 'bolted' }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'ground');
    const dg = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
    const dgBay = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    if (!/set aside for this test/.test(dg) || !/Effort: /.test(dg) || !/The least effort that breaks the ground/.test(dg) || /Least disruptive already does this/.test(dg) || /The ground holds: their power/.test(dgBay) || !/On real ground, courtesy ceiling: .*?Past that, the ground breaks under Rex/.test(dg)) fail('two-player break the ground: ' + dg.slice(0, 400)); else okLog('two-player break the ground: an effort on real ground, the bay drawn on real ground, its ceiling where the rock cracks (' + dg.slice(0, 70) + '…)');
    // ...and that real-ground run still carries the hit into the ground (Collide's toGround option): standing, Ollie
    // jumps onto him, near people 3 m off, where the shaking comes before the rock cracks
    // (with They take their own recoil on, the charger doesn't slow, so any landing drives Rex into real ground: BRIEF-canon.md
    // item 4, decision 6. This check is for the physics it was written for, with the power off)
    await load({ duoOpen: true, duoAction: 'collide', anchor: 'friction', colSrc: 'jump', logKg: 6.25, near: 3, ownRecoil: false }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'ground');
    const dgR = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
    const dgRBay = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    if (!/On real ground, courtesy ceiling: .*?Past that, the hit, carried into the ground, shakes it/.test(dgR) || !/The hit shakes the ground/.test(dgRBay)) fail('two-player break the ground, standing: the real-ground ceiling should come from the hit carried into the ground, and the tab drawn on real ground should show that shaking: ' + dgR.slice(0, 300) + ' | ' + dgRBay.slice(0, 300)); else okLog('two-player break the ground, standing: the real-ground run carries the hit into the ground (its shaking sets the ceiling, and the tab shows it)');
    // a missed catch past 1% of light speed flies on with its energy (it doesn't 'land ∞ behind him at 0 m/s')
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 3, logKg: 15, cMiss: true }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
    const missT = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    if (!/If Ollie misses, it flies on with all of its energy/.test(missT) || /∞ behind/.test(missT)) fail('fast catch miss: ' + (missT.match(/If Ollie misses[^.]*\./) || ['(no miss text)'])[0]); else okLog('a missed throw past 1% of light speed flies on with its energy');
    // the break-the-ground preset sets Unbreakable footing aside only while it draws: switching tabs (which saves)
    // must leave the switch on and saved on
    await page.click('#tab-stomp'); await page.waitForTimeout(400); await settle(page, 'bay');
    const ubAfter = await page.evaluate(() => ({ sw: document.getElementById('sw-unbreakable').checked, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).unbreakable }));
    if (!ubAfter.sw || ubAfter.saved !== true) fail('Unbreakable footing left off after the two-player break-the-ground preset: ' + JSON.stringify(ubAfter)); else okLog('after the two-player break-the-ground preset, Unbreakable footing is still on and saved on');
    if (errs.length) fail('page errors in the powers checks: ' + errs.slice(0, 3).join(' | '));
    await page.close();
  }
  // BRIEF-gui.md section 6: the energy comparisons on the page
  if (!only && !PR4_ONLY) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href);
    // the page always opens on the least disruptive effort: each check picks all-out after loading
    const load = async (st, allout) => {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay');
      if (allout) { await page.selectOption('#effort', 'allout'); await page.waitForTimeout(400); await settle(page, 'bay'); }
    };
    // each Compared with tile, with the energy tile just before it (fmtSI: 3 figures, SI prefix or × 10ⁿ)
    const tiles = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t, i, all) => ({ k: (t.querySelector('.k') || {}).textContent, v: ((t.querySelector('.v') || {}).textContent || '').replace(/\u00a0/g, ' '), prev: i ? (all[i - 1].querySelector('.v') || {}).textContent : '' })).filter((t) => t.k === 'Compared with'));
    const SUPD = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
    const parseJ = (t) => {
      t = t.replace(/ /g, ' ').trim();
      let m = t.match(/^([\d.,]+)? ?(?:× )?10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+) J$/);
      if (m) return (m[1] ? Number(m[1].replace(/,/g, '')) : 1) * Math.pow(10, (m[2][0] === '⁻' ? -1 : 1) * Number(m[2].replace('⁻', '').split('').map((c) => SUPD[c]).join('')));
      m = t.match(/^([\d.,]+) ([kMGTPE]?)J$/);
      return m ? Number(m[1].replace(/,/g, '')) * ({ '': 1, k: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15, E: 1e18 })[m[2]] : NaN;
    };
    // the energy tile shows 3 figures (2 above 10²¹ J), so any energy within 5% of it is allowed
    const ladderText = (J) => page.evaluate((x) => Array.from({ length: 41 }, (_, i) => window.EnergyLadder.compare(x * (0.95 + 0.0025 * i), window.DINO_DATA.energyRefs).text), J);
    // any 'N× <rung>' or 'N% of <rung>' anywhere in a text that breaks the rule (Weight tab, catch, Collide)
    const shorts = await page.evaluate(() => window.DINO_DATA.energyRefs.map((e) => e.short));
    const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const RUNG_RE = new RegExp('(roughly )?([\\d.,]+)(?: ([a-z]+illion))?(×|% of) (?:' + shorts.map(esc).join('|') + ')', 'g');
    const offRule = (t) => Array.from(t.matchAll(RUNG_RE)).filter((m) => m[3] || (m[4] === '×' ? Number(m[2].replace(/,/g, '')) > 10 : Number(m[2].replace(/,/g, '')) < 10)).map((m) => m[0]);
    const bad = [], wrongRung = [], seen = new Set();
    for (const action of ['punch', 'clap', 'stomp']) for (const logKg of [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 34]) for (const mode of logKg >= 20 ? ['comic'] : ['comic', 'real']) {
      await load({ action, logKg, mode }, true);
      for (const t of await tiles()) {
        seen.add(t.v.replace(/[\d.]+/g, '#'));
        const m = t.v.match(/^(?:roughly )?([\d.]+)× /), sh = t.v.match(/^(?:roughly )?([\d.]+)% of /);
        const good = /^(about|roughly) the same as /.test(t.v) || /^beyond the ladder: /.test(t.v) || (m && Number(m[1]) <= 10) || (sh && Number(sh[1]) >= 10);
        if (!good || /≈/.test(t.v)) bad.push(action + ' at 10^' + logKg + ' kg (' + mode + '): ' + t.v);
        const J = parseJ(t.prev);
        if (!(J > 0) || !(await ladderText(J)).includes(t.v)) wrongRung.push(action + ' ' + logKg + ': ' + t.prev + ' → ' + t.v);
      }
    }
    if (bad.length || seen.size < 15 || ![...seen].some((x) => /^roughly /.test(x))) fail('Compared with tiles break the ladder rule, or cover too little of it: ' + (bad.slice(0, 4).join(' | ') || seen.size + ' wordings: ' + [...seen].join(' | ')));
    else okLog('every Compared with tile on Punch, Clap and Stomp, all-out from 10 kg to 10³⁴ kg, keeps to at most 10× or at least 10% (' + seen.size + ' wordings, rough ones included)');
    if (wrongRung.length) fail('a Compared with tile does not match the ladder for the energy beside it: ' + wrongRung.slice(0, 4).join(' | '));
    else okLog('each Compared with tile is the ladder’s wording for the energy shown beside it');
    // the Weight tab's own comparisons (dense matter, the Earth falling onto him) and the growth what-if keep to the rule
    const weightBad = [];
    // (growth what-ifs reset on every load, so those are clicked)
    const growHead = {};
    for (const st of [{ action: 'weight', H: 10, m: 1e27 }, { action: 'weight', H: 0.1, m: 1.1e13 }, { action: 'weight', m: 1e21 }, { action: 'weight', m: 1e24 }, { action: 'weight', grow: 'krakatoa' }, { action: 'weight', grow: 'chicxulub' }]) {
      await load(st, false);
      if (st.grow) {
        await page.evaluate(() => { document.getElementById('powers').open = true; }); await page.selectOption('#absorb', 'gradual'); await page.waitForTimeout(300); await page.click('#grow-what-' + st.grow); await page.waitForTimeout(400); await settle(page, 'bay');
        const textOf = (sel, re) => page.evaluate(([q, r]) => { const n = Array.from(document.querySelectorAll(q)).filter((x) => new RegExp(r).test(x.textContent)); return n.map((x) => x.textContent.replace(/\u00a0/g, ' ')).join(' | '); }, [sel, re]);
        growHead[st.grow] = await textOf('#bay .growth-whatif p', 'which becomes');
        growHead[st.grow + 'Table'] = await textOf('#bay .growth-whatif td[data-col]', '.');
        growHead[st.grow + 'Note'] = await textOf('#bay .growth-whatif li, #bay .growth-whatif p', '^Every figure below follows from that energy');
        growHead[st.grow + 'Item'] = await textOf('#bay .growth-whatif li, #bay .growth-whatif p', '^It becomes');
      }
      const t = await page.evaluate(() => document.getElementById('bay').textContent.replace(/\u00a0/g, ' ').replace(/\s+/g, ' '));
      const off = offRule(t).concat(Array.from(t.matchAll(/[\d.,]+(?: [a-z]+illion)?(?:×|% of) the energy (?:it takes to blow|that holds) the Earth/g)).map((m) => m[0]));
      if (off.length) weightBad.push(JSON.stringify(st) + ': ' + off.join(' | '));
    }
    if (weightBad.length) fail('Weight tab energy comparisons outside the ladder rule: ' + weightBad.slice(0, 3).join(' || ')); else okLog('the Weight tab’s energy comparisons (dense matter, the Earth falling in, growth) keep to the ladder rule');
    // a rough rung's energy, and the mass it makes, is given to one figure in the growth what-if
    const oneFig = /: about \d(?: × 10[⁰¹²³⁴⁵⁶⁷⁸⁹]+)? J, which becomes about \d+(?:,0+)* (?:kg|t) of mass/;
    const oneFigItem = /^It becomes about \d+(?:,0+)* (?:kg|t) of new mass/;
    // the dinosaur-killer's table: each mass to two figures at most
    // every cell is his unchanged figure (3.05 m, 1,060 kg/m³) or at most two figures
    const sigf = (x) => x.replace(/[,.]/g, '').replace(/^0+/, '').replace(/0+$/, '').length;
    const twoFig = (t) => t.split(' | ').every((c) => c === '3.05 m' || c === '1,060 kg/m³' || !/^[\d.,]+/.test(c) || sigf(c.match(/^[\d.,]+/)[0]) <= 2);
    if (!oneFig.test(growHead.krakatoa || '') || !oneFig.test(growHead.chicxulub || '') || !oneFigItem.test(growHead.krakatoaItem || '') || !oneFigItem.test(growHead.chicxulubItem || '') || /\d,\d*[1-9]\d* t|\d\.\d+ m tall|\d,\d*[1-9]\d* kg\/m³/.test(growHead.chicxulubItem || '') || !growHead.chicxulubTable || !twoFig(growHead.chicxulubTable) || !growHead.chicxulubNote) fail('growth what-if: rough energies should be given to one figure: ' + JSON.stringify(growHead));
    else okLog('growth what-if gives the rough Krakatoa and dinosaur-killer energies and masses to one figure, changed sizes to two, and says the rest is rough: ' + growHead.krakatoa.slice(0, 90) + '…');
    // a milestone set by a rough rung (the dinosaur-killer) gives its dial point roughly
    await load({ action: 'punch' }, false); await page.waitForTimeout(4000);
    const chix = await page.evaluate(() => { const t = document.getElementById('ladder-viz').textContent; const i = t.indexOf('Punch out-hits the dinosaur-killer impact'); return i < 0 ? '' : t.slice(i, i + 80); });
    if (!/impactabout [1-9]0* [a-z]+illion t/.test(chix)) fail('the dinosaur-killer milestone should be given roughly: ' + chix); else okLog('the dinosaur-killer milestone is given roughly: ' + chix.slice(0, 70));
    // the sources table lists every rung with its status and a link
    const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table tbody tr')).map((tr) => ({ label: tr.cells[0].textContent, status: tr.cells[2].textContent, links: tr.cells[3].querySelectorAll('a').length })));
    const want = await page.evaluate(() => window.DINO_DATA.energyRefs.map((e) => 'Energy: ' + e.label));
    const missing = want.filter((l) => !rows.some((r) => r.label.startsWith(l) && r.status && r.links > 0));
    if (missing.length) fail('energy rungs missing from the sources table (or without a status or link): ' + missing.slice(0, 4).join(' | '));
    else okLog('the sources table lists all ' + want.length + ' energy rungs, each with a status and at least one link');
    if (errs.length) fail('page errors in the energy comparison checks: ' + errs.slice(0, 3).join(' | '));
    await page.close();
  }
  // ---- BRIEF-canon.md item 4, pull request 4: contests (force moves: the other's push is real, only each one's own push
  // back goes to his source) and the two Never knocked back switches. Each check fails on pull request 3's page. Figures
  // at the 3,000 kg bodies and the page's default dial; the engine's own figures where a sentence quotes them.
  if (!only || PR4_ONLY) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href);
    const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); if (st.duoOpen) { await page.waitForTimeout(300); await settle(page, 'duo-bay'); } };
    const pick = async (v) => { await page.selectOption('#duo-effort', v); await page.waitForTimeout(300); await settle(page, 'duo-bay'); };
    const duoTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
    const duoAll = () => page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    // Ollie's own what-if strength (log10 kg), set as a reader does (the page resets it on every load)
    const ollieKg = async (logKg) => { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, logKg); await page.waitForTimeout(800); await settle(page, 'duo-bay'); };
    const num = (x) => Number(String(x).replace(/,/g, ''));
    const near = (a, b, tol) => Math.abs(a / b - 1) <= (tol || 0.01);
    // the engine at the page's defaults (comic, concrete, standing, the four default powers on, all-out at the dial)
    const eng = (code, arg) => page.evaluate(([c, a]) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g;
      const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
      try { return new Function('P', 'D', 'g', 'mk', 'a', c)(P, D, g, mk, a); } catch (e) { return { error: String(e) }; } }, [code, arg]);
    const r4 = [];
    const check = (label, cond, got) => { if (!cond) r4.push(label + ': ' + String(got).slice(0, 500)); };
    const COL = { duoOpen: true, duoAction: 'collide' };
    // Collide's charge (decisions 1, 2, 5): a charger who takes his own recoil doesn't slow; the one hit is carried along
    // at his speed (splat) or sent off at twice it (bounce), and his source supplies the momentum; the hit's freed energy
    // is taken back by default. With the power off, pull request 3's physics (knocked back at 8.97 m/s).
    {
      const e = await eng('const r = P.collide(mk({ body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) }), mk(), { source: "sprint" }); return { v: r.carry && r.carry.v, sup: r.carry && r.carry.supplied, slide: r.after && r.after.splat.slide, Q: r.h && r.h.Q };');
      await load(COL); await pick('allout');
      const v = await duoTxt('.verdict'), h = await duoTxt('.happens'), t = await duoTxt('.tiles');
      const m = v.match(/^Ollie hits Rex at ([\d.]+) m\/s and doesn’t slow: he takes his own recoil, so the push back from the hit goes to his source\. Rex is carried along at ([\d.]+) m\/s\. When Ollie stops, at the end of the squash, Rex slides ([\d.]+) m before he stops\.$/);
      const ms = h.match(/comes from Ollie’s source: (?:about )?([\d,]+) kg·m\/s in all\. That is canon’s case “their own recoil”/);
      check('Collide, the default sprint carries Rex along', m && near(num(m[2]), e.v) && near(num(m[3]), e.slide) && Math.abs(num(m[2]) - 18.1) < 0.05 && Math.abs(num(m[3]) - 27.3) < 0.05 && ms && near(num(ms[1]), e.sup, 0.02) && Math.abs(num(ms[1]) - 55000) < 600
        && /Energy freed at the hit ?499 kJ ?120 g TNT · taken back by default/.test(t) && !/Momentum is never lost/.test(h) && /How far Ollie carries him is up to Ollie/.test(h), v + ' | ' + (ms ? ms[0] : h.slice(0, 200)));
      await load(Object.assign({ colBounce: 'bounce' }, COL)); await pick('allout');
      const vb = await duoTxt('.verdict'), tb = await duoTxt('.tiles');
      check('Collide, the default bounce sends Rex off at twice the speed', /Rex bounces off him and is sent off at 36\.3 m\/s, twice his speed, and slides 102 m\./.test(vb) && /Ollie’s source supplies ?109,000 kg·m\/s/.test(tb), vb);
      await load(Object.assign({ ownRecoil: false }, COL)); await pick('allout');
      const vo = await duoTxt('.verdict'), ho = await duoTxt('.happens');
      check('Collide with They take their own recoil off (pull request 3\'s physics)', /^Ollie hits Rex at 18\.1 m\/s\. Rex is knocked back at 8\.97 m\/s and the two slide 6\.97 m before they stop\.$/.test(vo) && /Momentum is never lost/.test(ho) && !/doesn’t slow/.test(vo + ho) && m, vo);
    }
    // the paradox (decision 3), explained first, and no page error: Rex bolted (on ground Unbreakable footing holds), and
    // Ollie landing on him from above at a 10^9 kg dial (the jump and the stomp-launch)
    for (const [lab, st, held] of [['Rex bolted', { anchor: 'bolted' }, /Rex is bolted to ground that Unbreakable footing never lets break, and whatever push the ground can’t bear, their power supplies, so nothing limits his hold\./],
      ['the jump at a 10⁹ kg dial', { colSrc: 'jump', logKg: 9 }, /Ollie comes down on him from above, and the ground under Rex’s feet holds him up\. Unbreakable footing never lets it give/],
      ['the stomp-launch at a 10⁹ kg dial', { colSrc: 'stomp', logKg: 9 }, /Ollie comes down on him from above/]]) {
      const before = errs.length;
      await load(Object.assign({}, COL, st)); await pick('allout');
      const v = await duoTxt('.verdict'), all = await duoAll();
      // first: the verdict comes before every other result element (chips, tiles, the effort box, what happens)
      const first = await page.evaluate(() => { const b = document.getElementById('duo-bay'), vd = b.querySelector('.verdict'); if (!vd) return false; return Array.from(b.querySelectorAll('.status-row, .tiles, .effort-read, .happens, .callout, details.math')).every((n) => vd.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING); });
      check('Collide, the paradox explained first (' + lab + ')', first && /^No physical answer here, and the page isn’t broken: this is the canon’s ruling\. Ollie takes his own recoil, so nothing can slow him: the push back from his hit goes to his source\./.test(v) && held.test(v) && /One of them has to give, and neither can, so physics has no answer\.$/.test(v)
        && !/Bolted: Earth takes the blow|Calculation failed|The ground holds the blow/.test(all) && errs.length === before, v + ' | first ' + first + ' | ' + errs.slice(before).join(' '));
    }
    // Rex bolted on real rock (Unbreakable footing off): not held without limit, so the rock tears and he is carried
    await load(Object.assign({ anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
    { const v = await duoTxt('.verdict'); check('Collide, bolted on real rock: carried with a plug of rock', /Rex is bolted, but on real rock: the rock around his bolts tears out \(at about 697 kN\), and he is carried along at 18\.1 m\/s with a plug of rock\./.test(v), v); }
    // a set speed of 0.1% of light speed (300 km/s): carried at that speed, 135 TJ taken back; the windows preset means it
    {
      const colGB = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
      await load(Object.assign({ colSrc: 'set', colGB }, COL)); await pick('allout');
      const v = await duoTxt('.verdict'), t = await duoTxt('.tiles'), s = await duoTxt('.status-row');
      await pick('windows');
      const eb = await duoTxt('.effort-read'), sw = await duoTxt('.status-row'), tw = await duoTxt('.tiles');
      check('Collide at 0.1% of light speed: carried along, the energy taken back, real for the windows preset', /Rex is carried along at 300 km\/s\./.test(v) && /Ollie’s source supplies ?899 million kg·m\/s/.test(t) && /135 TJ ?32 kt TNT · taken back by default/.test(t) && /The hit’s energy is taken back: their power/.test(s)
        && /They mean it: the energy the hit frees, which is taken back by default, is real for this preset\./.test(eb) && /He means it: the hit’s energy is real/.test(sw) && /135 TJ ?32 kt TNT · real: he means it/.test(tw), v + ' | ' + eb.slice(0, 300));
    }
    // the two-player effort search: the slide harm with the one hit carried at the charger's speed (least disruptive
    // 4,260 kg-force, against pull request 3's 8,430); at a 10^9 kg jump the paradox leaves only Ollie's take-off
    await load(COL);
    { const b = await duoTxt('.effort-read'); check('Collide, least disruptive: Rex carried past the nearest people', /Courtesy ceiling: 4\.7% \(lifting 4\.26 t\)\. Past that, Rex is carried along at [\d.]+ m\/s and ends up [\d.]+ m away, past the nearest people 5 m away\./.test(b), b); }
    await load(Object.assign({ colSrc: 'jump', logKg: 9 }, COL));
    { const b = await duoTxt('.effort-read'); check('Collide, a 10⁹ kg jump: only the take-off shakes the ground', /Courtesy ceiling: 0\.12% \(lifting 1,210 t\)\. Past that, the charger’s take-off, pushed into the unbreakable ground, shakes it/.test(b), b); }
    // the thought experiment sets the charger's own recoil aside (decision 4)
    await load(Object.assign({ colImm: true }, COL)); await pick('allout');
    { const v = await duoTxt('.verdict'); check('Collide, the truly immovable thought experiment', /Ollie stops dead\. All 120 g TNT of his energy is freed at the hit\. \(The thought experiment sets Ollie’s own recoil aside too: it is about the test, not their powers\.\)/.test(v), v); }
    // Collide's steady push (decision 7): the pusher's own footing doesn't cap his push; the force between their hands is
    // the push that drives Rex back. Off: pull request 3's dead heat.
    {
      // (all-out: with the power on the least disruptive effort now stops where Rex's slide reaches the people, 5.47 t)
      await load(Object.assign({ colMode: 'push' }, COL)); await pick('allout');
      const v = await duoTxt('.verdict'), t = await duoTxt('.tiles'), h = await duoTxt('.happens');
      await load(Object.assign({ colMode: 'push', ownRecoil: false }, COL));
      const vo = await duoTxt('.verdict'), ho = await duoTxt('.happens');
      check('Collide, the steady push on and off', /^Ollie wins\. He pushes with 890 kN and Rex can hold only 17\.7 kN, so Rex is driven back\. Ollie takes his own recoil, so his push back goes to his source and his own footing \(17\.7 kN\) doesn’t cap his push\. Over the shove’s stroke \(2\.44 m\) that sends Rex off at 37\.6 m\/s, and he slides 109 m before he stops\.$/.test(v)
        && /Force between them ?890 kN ?the same both ways between their hands; Rex’s feet pass 17\.7 kN of it to the ground and the rest drives him back; Ollie’s side goes to his source/.test(t) && !/both forces end up in the ground/.test(h)
        && /^Dead heat\. Ollie pushes with 17\.7 kN and Rex holds 17\.7 kN\. Neither moves\./.test(vo) && /both forces end up in the ground/.test(ho), v + ' | ' + t.slice(-200) + ' | off ' + vo);
      // unlimited into a bolted Rex: the one-sided paradox (not 'one unbreakable system'); on real rock only Rex's rock tears
      await load(Object.assign({ colMode: 'push', inf: true, anchor: 'bolted' }, COL)); await pick('allout');
      const vp = await duoTxt('.verdict');
      await load(Object.assign({ colMode: 'push', inf: true, anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
      const vr = await duoTxt('.verdict'), all = await duoAll();
      check('Collide, an unlimited steady push into a bolted Rex', /^Nothing moves: Rex is bolted to ground that their power holds, so nothing can move him, and Ollie’s push back goes to the endless ocean/.test(vp) && !/one unbreakable system|from bolted feet/.test(vp)
        && /the rock gives around Rex’s bolts\. The bolts are comic, the rock isn’t: it tears out, and Rex leaves at just under light speed with a plug of rock, with unlimited energy\. Ollie’s push back goes to the endless ocean/.test(vr) && !/both sets of bolts|NaN/.test(all), vp + ' | ' + vr);
    }
    // the shoving match (decision 8): both shoved apart (26.6 m/s each, about 57 m), the item rewritten, and equal bodies
    // always shoved apart; the least disruptive effort now stops at both sliding past the people; off: the dead heat
    {
      const e = await eng('const r = P.pushMatch(mk(), mk({ body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, v: r.vA, s: r.slideA };');
      const W = { duoOpen: true, duoAction: 'wrestle' };
      await load(W);
      const b = await duoTxt('.effort-read');
      await pick('allout');
      const v = await duoTxt('.verdict'), h = await duoTxt('.happens');
      await load(Object.assign({ ownRecoil: false }, W));
      const vo = await duoTxt('.verdict'), ho = await duoTxt('.happens');
      const m = v.match(/They fly apart at ([\d.]+) m\/s each and slide about ([\d.]+) m\./);
      check('the shoving match, both shoved apart (on) and the dead heat (off)', e.o === 'bothShoved' && /^Pushing straight across, both are shoved apart\. They take their own recoil, so neither push costs the pusher his grip: each pushes with the effort he uses \(890 kN each\), about 50 times what holds the other \(17\.7 kN each\)\./.test(v) && m && near(num(m[1]), e.v) && Math.abs(num(m[1]) - 26.6) < 0.05 && near(num(m[2]), e.s, 0.005)
        && /a shoving match is decided at the feet of the one being pushed/.test(h) && !/To push forward, each one has to grip the ground/.test(h) && /Equal bodies on equal ground are always shoved apart with the power on: even the least effort the lab lets them use, enough to stand and walk \(as hard as lifting 2\.57 t each\), is more than either one’s grip on any ground here/.test(h)
        && /Courtesy ceiling: 8% \(lifting 7\.3 t\)\. Past that, both are shoved apart and end up past the nearest people 5 m away/.test(b)
        && /^Pushing straight across: dead heat\. Both are far stronger than their footing/.test(vo) && /A shoving match is decided at the feet\. To push forward, each one has to grip the ground/.test(ho), v + ' | ' + b.slice(0, 200) + ' | off ' + vo.slice(0, 100));
      // a bolted wrestler's push is real: he shoves the other off ('shovedOff')
      await load(Object.assign({ anchor: 'bolted' }, W)); await pick('allout');
      const vb = await duoTxt('.verdict'), tb = await duoTxt('.tiles');
      check('the shoving match, Rex bolted shoves Ollie off', /^Rex is bolted, so he can’t walk Ollie out, but his push is real \(a contest lets force move\): he shoves Ollie off at 37\.6 m\/s, and Ollie slides 109 m\. Ollie’s push \(890 kN\) can’t move Rex’s bolts\./.test(vb) && /Winner ?Rex ?Rex shoves Ollie off/.test(tb), vb);
      // a walk-out where only one push beats the other's grip: on gravel, Ollie at a what-if strength of 10^3.34 kg (about
      // 2,190 kg, on the slider's 0.01 steps); Rex's own feet set the pace (the Pull tab's rule), as the engine gives it
      const ew = await eng('const sf = D.surfaces.find((x) => x.id === "gravel"); const r = P.pushMatch(mk({ surface: sf }), mk({ surface: sf, F: Math.pow(10, 3.34) * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, t: r.t, a: r.accel };');
      await load(Object.assign({ surface: 'gravel' }, W)); await ollieKg(3.34); await pick('allout');
      const vw = await duoTxt('.verdict'), hw = await duoTxt('.happens'), mw = vw.match(/Rex walks Ollie out of the ring in ([\d.]+) s\./);
      check('the shoving match, a walk-out paced by the winner\'s feet', ew.o === 'walkOut' && mw && near(num(mw[1]), ew.t, 0.01) && /Rex’s own feet set the pace: they can speed his body up only so fast against Ollie’s push, so he holds back, pushing Ollie only as hard as keeps him at that pace \([\d.]+ kN\)\./.test(vw) && /Walking him out is paced by Rex’s own feet, as on the Pull tab/.test(hw), vw + ' (engine ' + ew.o + ' ' + ew.t + ' s)');
    }
    // Both at once (decision 9): each shoved by the other's shove; off: the stronger shove sets the push
    {
      const B = { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' };
      await load(B); await pick('allout');
      const v = await duoTxt('.verdict'), h = await duoTxt('.happens');
      await load(Object.assign({ ownRecoil: false }, B)); await pick('allout');
      const ho = await duoTxt('.happens');
      check('Both at once, on and off', /^They shove each other apart: each is shoved by the other’s shove, and each one’s push back goes to the endless ocean\. Ollie flies back at 21\.1 m\/s and slides [\d.]+ m; Rex flies back at 21\.1 m\/s and slides [\d.]+ m\./.test(v) && !/the stronger shove sets the push/.test(h) && /each is shoved by the other’s shove, worked out as on the Shove tab/.test(h)
        && /Both shove at once: the stronger shove sets the push/.test(ho), v + ' | ' + h.slice(0, 200));
    }
    // the Lift tab (decision 11): with the power on the lift models a partner who doesn't resist
    await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'lift' });
    { const h = await duoTxt('.happens'); await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'lift', ownRecoil: false }); const ho = await duoTxt('.happens');
      check('Lift, the partner who doesn\'t resist', /The lift models a partner who lets himself be lifted/.test(h) && !/that push stays between the two of them/.test(h) && /Ollie can’t make himself heavier by pushing down on Rex: that push stays between the two of them/.test(ho), h.slice(0, 200)); }
    // arm wrestling as built (reading B, decision 10): each pad holds the other's press; with the winner's power on, the
    // loser's pad can still break the table in a pin (review round 1); standing, his own footing doesn't cap his press, his
    // feet hold against the other's, and in a pin the loser's feet carry the force at his elbow (review round 2)
    {
      const A = { duoOpen: true, duoAction: 'arm' };
      await load(A);
      const h = await duoTxt('.happens');
      check('arm wrestling, each pad holds the other\'s press', /Each one’s own push back goes to his source \(They take their own recoil\), but the other’s press on him is real \(a contest lets force move\)\. Under the rules each grips the table’s peg with his free hand and rests his elbow on a pad bolted to the table, so each pad holds the other’s press/.test(h), h.slice(0, 300));
      // Ollie at 1 t, Things keep their form off: Rex's pad holds only Ollie's press, but Ollie's pad carries what turns his
      // forearm against Rex's hand (24.2 kN), past the table's 15.1 kN, so the pin breaks the table and they stand, as with
      // the power off (by Rex's pad there); review round 1 of pull request 4
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(3); await pick('allout');
      const vp = await duoTxt('.verdict'), hp = await duoTxt('.happens'), mp = await duoTxt('details.math .eq');
      await load(Object.assign({ keepForm: false, ownRecoil: false }, A)); await ollieKg(3); await pick('allout');
      const vpo = await duoTxt('.verdict');
      const ep = await eng('const r = P.armWrestle(mk({ keepForm: false }), mk({ keepForm: false, F: 1000 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { by: r.tableBreaksBy, lp: r.loserPadLoad, lat: r.tableLat, v: r.pin && r.pin.v };');
      check('arm wrestling, the loser\'s pad breaks the table in a pin with the power on', ep.by === 'pin' && ep.lp > ep.lat && /^The table can’t take the pin\. Rex’s arm \(222 kN\) beats Ollie’s \(2\.45 kN\), and forcing it down loads Ollie’s elbow pad with about 24\.2 kN \(what turns his forearm against Rex’s hand\), more than the 15\.1 kN the table carries\. It tears out\. Standing up, /.test(vp) && /he pins Ollie in 2\d(?:\.\d)? ms, dragging him along as he goes\. The back of Ollie’s hand swings down at 83 m\/s\./.test(vp)
        && /Forcing an arm down: the winner’s elbow pad holds the loser’s press, 2\.45 kN here\..*The loser’s pad still carries what turns his own forearm against the winner’s hand, about 24\.2 kN: that is a force on the loser, not anyone’s push back, so no power takes it\. That is more than the table carries, so the pin breaks it\./.test(hp) && !/never breaks the table|never tears the table/.test(hp + vp)
        && /= 24\.2 kN\./.test(mp) && /^The table can’t take the pin\. Rex’s arm \(222 kN\) beats Ollie’s \(2\.45 kN\), and forcing it down loads Rex’s elbow pad/.test(vpo), vp + ' | ' + hp.slice(0, 300) + ' | off ' + vpo.slice(0, 160));
      // standing (the table broken by both presses), equal: a dead heat at 222 kN, both pushed off their feet
      await load(Object.assign({ keepForm: false }, A)); await pick('allout');
      const vs = await duoTxt('.verdict'), ss = await duoTxt('.status-row');
      check('arm wrestling standing, both pushed off their feet', /Arm-wrestling standing up, it’s a dead heat at 222 kN: their arms are locked\. But each one’s press beats the other’s footing \(17\.7 kN\), so both are pushed off their feet, opposite ways, turning about their clasped hands\. The lab doesn’t follow that motion\./.test(vs) && /Rex’s feet slide/.test(ss) && /Ollie’s feet slide/.test(ss), vs + ' | ' + ss);
      // standing, Ollie at 200 short tons: his press isn't capped by his footing, so he pins Rex, and his own feet slide
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(Math.log10(200 * 907.18474)); await pick('allout');
      const vw = await duoTxt('.verdict');
      check('arm wrestling standing, the stronger press pins', /Standing up, Ollie’s push back goes to his source, so his footing doesn’t cap his press: he presses with his full 44\d kN\. That beats Rex’s arm \(222 kN\): he pins Rex in [\d.]+ ms, dragging him along as he goes\. Rex’s press is more than Ollie’s feet hold \(17\.7 kN\), so Ollie’s feet slide too\./.test(vw), vw);
    }
    // the two Never knocked back switches (decisions 12 and 15): in Their powers next to the Bolted pair, on by default,
    // each with its note; an old save loads with both on; the summary line lists them
    {
      const sw = async (st) => { await page.evaluate((x) => { if (x) localStorage.setItem('rex-lab-v1', JSON.stringify(x)); else localStorage.clear(); }, st); await page.reload(); await page.waitForTimeout(800);
        return page.evaluate(() => { const r = document.getElementById('nkb-rex'), o = document.getElementById('nkb-ollie'), sv = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); return r && o ? [r.checked, o.checked, sv.noKnockback, sv.oNoKnockback, document.getElementById('powers-sum').textContent].join('|') : 'missing'; }); };
      const fresh = await sw(null), old = await sw({ action: 'throw', saveV: 3 }), older = await sw({ action: 'throw' }), rexOff = await sw({ action: 'throw', noKnockback: false }), ollieOff = await sw({ action: 'throw', oNoKnockback: false });
      const place = await page.evaluate(() => { const r = document.getElementById('nkb-rex'), o = document.getElementById('nkb-ollie'), b = document.getElementById('bolt-ollie'), note = r && document.getElementById(r.getAttribute('aria-describedby') || 'x');
        return r && o ? { names: [r.getAttribute('aria-label'), o.getAttribute('aria-label')], inPowers: document.getElementById('powers').contains(r) && document.getElementById('powers').contains(o), afterBolted: !!(b.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_FOLLOWING), sameNote: o.getAttribute('aria-describedby') === r.getAttribute('aria-describedby'), note: note ? note.textContent.replace(/\s+/g, ' ') : '' } : null; });
      check('Never knocked back: on by default, an old save loads with both on, each switch named, next to Bolted, with its note', fresh === 'true|true|true|true|Comic book · default powers on' && old === 'true|true|true|true|Comic book · default powers on' && older === 'true|true|true|true|Comic book · default powers on'
        && rexOff === 'false|true|false|true|Comic book · unbreakable footing · own recoil · things keep their form · safe passenger · drag-free throws · never knocked back: Ollie' && ollieOff === 'true|false|true|false|Comic book · unbreakable footing · own recoil · things keep their form · safe passenger · drag-free throws · never knocked back: Rex'
        && place && place.names.join() === 'Never knocked back: Rex,Never knocked back: Ollie' && place.inPowers && place.afterBolted && place.sameNote
        && /In their contests \(arm wrestling, every Wrestle move, Collide, the partner toss\) they let force move: the other’s push on him is real, and only his own push back is taken \(They take their own recoil\)\. A catch is his own push too, so that power takes it back\. So this switch acts in one case only: a throw that reaches the catcher as a fireball or plasma in the game of catch \(Things keep their form off, some of the air’s drag left\), which hits him rather than being caught\./.test(place.note)
        // (review round 1 of pull request 4: only the motion freed as it stops at him is taken back; the air's heat stays real)
        && /the motion it frees as it stops at him is taken back unless he means it \(canon; the heat it made in the air on the way stays real\)/.test(place.note) && !/the energy it frees where he stands is taken back/.test(place.note),
        JSON.stringify({ fresh, old, older, rexOff, ollieOff, place }));
      // turning either off changes no result on any tab (each read at its default, least disruptive effort)
      const changed = [];
      for (const tab of SOLO.concat(DUO)) {
        const res = [];
        for (const k of [{}, { noKnockback: false }, { oNoKnockback: false }]) {
          await load(Object.assign(DUO.includes(tab) ? { duoOpen: true, duoAction: tab } : { action: tab }, k));
          res.push(JSON.stringify(await readResult(page, DUO.includes(tab) ? 'duo-bay' : 'bay')));
        }
        if (res[1] !== res[0] || res[2] !== res[0]) changed.push(tab + (res[1] !== res[0] ? ' (Rex off)' : '') + (res[2] !== res[0] ? ' (Ollie off)' : ''));
      }
      check('Never knocked back: turning either switch off changes no result on any tab at its defaults', !changed.length && fresh !== 'missing', changed.join(', '));
      // ... except the fireball case (Things keep their form off, some of the air's drag left, a 10^14 kg dial, a
      // fastball, all-out): on, Ollie isn't moved and its momentum goes to the endless ocean, and of the energy freed
      // where he stands only the air's heat is real; off, it carries him off; Rex's switch shows on the return leg
      const FB = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
      const ef = await eng('const o = D.objects.find((x) => x.id === "baseball"), F = 1e14 * g; const L = P.catchLeg(mk({ F, keepForm: false, airAbsorb: 0.5 }), mk({ F, keepForm: false, airAbsorb: 0.5, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) }), o, 10, "hard"); const f = L.fireball || {}; return { result: L.result, J: f.knockAbsorbed && f.knockAbsorbed.J, Egap: f.Egap, Earr: f.Earr };');
      await load(FB); await pick('allout');
      const von = await duoTxt('.verdict'), hon = await duoAll();
      await load(Object.assign({ oNoKnockback: false }, FB)); await pick('allout');
      const voff = await duoTxt('.verdict');
      await load(Object.assign({ noKnockback: false }, FB)); await pick('allout');
      const vrex = await duoTxt('.verdict');
      const mJ = von.match(/Never knocked back: it doesn’t move Ollie\. Its momentum \(([\d.,]+ million) kg·m\/s\) goes to the endless ocean, and stopping it frees 3\.63 TJ where he stands\./);
      check('Never knocked back: the fireball case shows each switch', mJ && ef.J > 1e6 && near(ef.J, 1.03e6, 0.01) && /422 GJ of it is heat already made in the air on the way: that is real\. The rest, 3\.21 TJ, is its motion, freed as it stops at him: canon takes a hit’s freed energy back by default/.test(hon) && near(ef.Egap, 4.22e11, 0.005) && near(ef.Earr, 3.21e12, 0.005)
        && /That is Never knocked back’s case, and Ollie’s switch is on \(Their powers\): he isn’t moved, and its momentum goes to the endless ocean\./.test(hon) && !/carries Ollie off/.test(von)
        // (review round 2 of pull request 4: the return leg reaches Rex the same way, but his switch is set the other way)
        && /It carries Ollie off at 343 m\/s\. He’s fine\./.test(voff) && /Thrown back, it reaches Rex as plasma too, but Rex’s Never knocked back is on \(Their powers\)\. Never knocked back: it doesn’t move Rex\./.test(voff)
        && /Never knocked back: it doesn’t move Ollie\./.test(vrex) && /Thrown back, it reaches Rex as plasma too, but Rex’s Never knocked back is off \(Their powers\)\. It carries Rex off at 343 m\/s\./.test(vrex), von + ' | off ' + voff.slice(-200) + ' | Rex off ' + vrex.slice(-200));
      // the cards: Their powers, Unstoppable force vs immovable object, Two-player effort, Game of catch
      const cards = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      check('the cards for pull request 4', /Never knocked back \(one switch each, both on by default; canon, the rulings of 14 Oct 2026\) means a hit from outside a contest doesn’t move him: its momentum goes to the endless ocean, even if he is bolted, and the motion it frees as it stops at him is taken back unless he means it \(the heat it made in the air on the way stays real\); in their contests \(arm wrestling, every Wrestle move, Collide, the partner toss\)/.test(cards)
        // (review round 1 of pull request 4: six powers on by default; the Newton card names the contests)
        && /so six powers are on unless the reader turns them off: Air resistance absorbed, Things keep their form, Unbreakable footing, They take their own recoil, Safe passenger and Never knocked back \(one switch each\)\./.test(cards) && !/five powers are on|every two-player test|the energy it frees where he stands is taken back/.test(cards)
        && /Where a push or hit has no physical answer \(canon: one held without limit by their powers, against a charger who can’t slow or an unlimited push\), the lab can’t judge its harm, and the page says so rather than calling it harmless\./.test(cards)
        && /A charger who takes his own recoil \(the default\) doesn’t slow: canon sends the push back from his own hit to his source/.test(cards) && /one of them has to give and neither can: canon rules that the collision has no physical answer/.test(cards)
        && /both shoved apart in the shoving match, or carried along at the charger’s speed in Collide/.test(cards) && /count only for a blast preset \(rattle, windows, houses, a block\), which the lab reads as meaning it/.test(cards)
        && /Never knocked back does \(one switch each, on by default\): he isn’t moved, and its momentum goes to the endless ocean, bolted too/.test(cards) && !/Never knocked back, (?:not|which isn’t) in the lab yet/.test(cards), '(card text)');
    }
    // ---- review round 1 of pull request 4 (research/reviews/canon-4-round1.json): each check fails on 238f570's page
    {
      // physics-carry-force-omits-hold-and-cap: the hit pushes with the squash's own force plus Rex's hold for the whole
      // squash, so force x time = what Ollie's source supplies; no cap, no 'the push rises until it gives'
      await load(COL);
      const t0 = await duoTxt('.tiles'), h0 = await duoTxt('.happens'), b0 = await duoTxt('svg text');
      const e0 = await eng('const r = P.collide(mk({ F: 4260 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) }), mk({ F: 4260 * g }), { source: "sprint" }); return { F: r.carry.F, T: r.carry.T, sup: r.carry.supplied, sq: r.contact.soft.F };');
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(1 / 299792458) }, COL)); await pick('allout');
      const h1 = await duoTxt('.happens'), t1 = await duoTxt('.tiles');
      check('review round 1: the carried hit\'s force includes the hold, uncapped', Math.abs(e0.F * e0.T / e0.sup - 1) < 1e-9 && /Force of the hit ?273 kN ?over 86 ms: the plush squash plus his footing \(estimates\)/.test(t0) && /pushes with about 273 kN: the squash’s own 255 kN plus the 17\.7 kN with which his footing holds Rex back, since Ollie can’t slow\. That force over that time is what Ollie’s source supplies\./.test(h0)
        && /The hit: squash plus his hold/.test(b0) && /Ollie’s source supplies ?14,100 kg·m\/s/.test(t1) && /what his footing hands the ground during the hit \(11,100 kg·m\/s\)/.test(h1) && /Force of the hit ?22\.4 kN/.test(t1) && !/the push rises until it gives|so here they are rough/.test(h0 + h1), t0.slice(0, 300) + ' | ' + t1.slice(-200));
      // physics-from-above-bolted-real-rock: landed on from above, a bolted Rex on real ground is held by the ground's
      // bearing (driven in, bolts and all), not torn loose with a plug of rock
      await load(Object.assign({ colSrc: 'jump', anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
      const sj = await duoTxt('.status-row'), hj = await duoTxt('.happens'), bj = await duoTxt('svg text'), tj = await duoTxt('.tiles');
      check('review round 1: from above, a bolted Rex on real ground is held by the ground\'s bearing', /Rex driven into the ground/.test(sj) && !/torn loose with a plug of rock|tears out/.test(sj + hj) && /the ground under his feet, which bears 1\.52 MN on the concrete slab \(from above, his bolts go down into it with him/.test(hj) && /What holds Rex: the ground/.test(bj) && /Ollie’s source supplies ?107,000 kg·m\/s/.test(tj), sj + ' | ' + hj.slice(0, 400));
      // duo-paradox-claimed-harmless and copy-paradox-coexist: a hit with no physical answer is never called harmless, and
      // the canon case isn't 'two settings that can't both hold'
      await load(Object.assign({ anchor: 'bolted' }, COL));
      const ep0 = await duoTxt('.effort-read'), hp0 = await duoTxt('.happens'), gp0 = await duoTxt('.case-grid td, .case-grid th, table td');
      await pick('windows');
      const ep1 = await duoTxt('.effort-read');
      check('review round 1: the paradox is never called harmless, and the canon case isn\'t two settings that can\'t both hold', /^All-out\. Nothing the lab can judge in this test does harm here/.test(ep0) && /Courtesy ceiling: none that the lab can judge\. The hit has no physical answer here \(the canon’s ruling\), so the lab can’t judge its harm; it judges only the charge \(its speed against sound\) and the charger’s take-off\./.test(ep0)
        && /The hit has no physical answer here \(the canon’s ruling\), so the lab can’t judge its harm; it judges only the charge \(its speed against sound\) and the charger’s take-off\. Even all-out, those don’t shatter windows 15 m away/.test(ep1) && !/Nothing in this test does harm|Even all-out, this test doesn’t|no cap needed/.test(ep0 + ep1)
        && /so physics has no answer here \(the canon’s ruling\)\./.test(hp0) && !/can’t both hold|can’t exist in the same universe/.test(hp0 + gp0), ep0.slice(0, 300) + ' | ' + ep1.slice(0, 300));
      // duo-steady-push-no-harm and copy-push-harm: the one driven back is followed and judged; unlimited, he flies off
      await load(Object.assign({ colMode: 'push' }, COL));
      const sp0 = await duoTxt('.effort-read'), st0 = await duoTxt('.tiles');
      await load(Object.assign({ colMode: 'push', inf: true }, COL)); await pick('allout');
      const sp1 = await duoTxt('.effort-read');
      // (and the presets' reasons with the power on: the one pushed hands the ground a friction drag; only he slides)
      await load(Object.assign({ colMode: 'push' }, COL)); await pick('plaster');
      const sp2 = await duoTxt('.effort-read');
      await pick('ground');
      const sp3 = await duoTxt('.effort-read');
      check('review round 1: the steady push follows and judges the one driven back', /Courtesy ceiling: 4\.1% \(lifting 3\.68 t\)\. Past that, Rex is driven back 2\.44 m and slides on, ending up 5\.\d+ m from where he stood, past the nearest people 5 m away\./.test(sp0) && /Rex is driven off at ?5\.\d+ m\/s ?over the shove’s stroke; slides/.test(st0)
        && /At this effort Rex is driven back faster than sound/.test(sp1) && !/Nothing in this test does harm|slow load, not a blow|no cap needed/.test(sp0 + sp1 + sp2)
        && /In the steady push the pusher’s push back goes to the endless ocean \(They take their own recoil\), and the one pushed hands the ground only a steady push through his feet or bolts, or a friction drag while he is driven back and slides, not a blow/.test(sp2) && /Standing, the one pushed slides long before the ground under him could break/.test(sp3) && !/their feet slide/.test(sp3), sp0.slice(0, 300) + ' | ' + sp1.slice(-200) + ' | ' + sp2.slice(0, 200) + ' | ' + sp3.slice(0, 200));
      // physics-steady-push-bolted-real-rock: past the rock's tear load Rex is torn loose and driven back, not held
      await load(Object.assign({ colMode: 'push', anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
      const vr1 = await duoTxt('.verdict'), sr1 = await duoTxt('.status-row');
      await load(Object.assign({ colMode: 'push', anchor: 'bolted' }, COL)); await pick('ground');
      const gr1 = await duoTxt('.effort-read');
      check('review round 1: a steady push past the rock\'s tear load tears a bolted Rex loose', /^Rex is bolted, but on real rock: Ollie’s push \(890 kN\) is more than the rock around his bolts takes \(about 697 kN\), so it tears out, and Rex is driven back with a plug of rock, held only by his feet \(17\.7 kN\)\./.test(vr1) && /Over the shove’s stroke \(2\.44 m\) that sends Rex off at 37\.6 m\/s/.test(vr1) && /Rex’s rock tears loose/.test(sr1) && !/his bolts hold|Rex holds unlimited/.test(vr1 + sr1)
        && /lifting 13\.5 t\)\. The least effort that breaks the rock around Rex’s bolts\./.test(gr1), vr1 + ' | ' + sr1 + ' | ' + gr1.slice(0, 200));
      // copy-push-bars-390: the steady push's bar labels fit at 390 px
      await page.setViewportSize({ width: 390, height: 844 });
      await load(Object.assign({ colMode: 'push' }, COL));
      const clip = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay svg')).flatMap((s) => { const sr = s.getBoundingClientRect(); return Array.from(s.querySelectorAll('text')).filter((t) => t.getBoundingClientRect().right > sr.right + 0.5 || t.getBoundingClientRect().left < sr.left - 0.5).map((t) => t.textContent); }));
      await page.setViewportSize({ width: 1280, height: 900 });
      check('review round 1: the steady push\'s bar labels fit at 390 px', !clip.length, clip.join(' | '));
      // copy-shovingmatch-paradox-nothing-moves and duo-one-sided-paradox-nothing-moves: at unlimited strength only the push
      // into bolts held without limit has no answer; the bolted one's own push shoves the other off
      const W = { duoOpen: true, duoAction: 'wrestle' };
      await load(Object.assign({ inf: true, oAnchor: 'bolted' }, W)); await pick('allout');
      const vw1 = await duoTxt('.verdict'), ew1 = await duoTxt('.effort-read');
      await load(Object.assign({ wrestleMove: 'shove', wrestleWho: 'both', inf: true, anchor: 'bolted' }, W)); await pick('allout');
      const vb1 = await duoTxt('.verdict'), eb1 = await duoTxt('.effort-read'), tb1 = await duoTxt('.tiles');
      check('review round 1: one bolted at unlimited strength, the other\'s push has no answer but his own is real', /^Ollie is bolted to ground that their power holds, so Rex’s unlimited push into his bolts meets a hold without limit: that push has no physical answer \(the canon’s ruling\), and it moves nobody\. Ollie’s own push on Rex is real \(a contest lets force move\), and Rex holds only 17\.7 kN, so Ollie shoves him off at just under light speed/.test(vw1) && /At this effort Rex is shoved off faster than sound/.test(ew1)
        && /^Rex is bolted to ground that their power holds, so Ollie’s unlimited shove into his bolts meets a hold without limit: that shove has no physical answer \(the canon’s ruling\), and it moves nobody\. Rex’s own shove on Ollie is real \(a contest lets force move\): Ollie leaves at just under light speed\./.test(vb1) && /At this effort someone flies off faster than sound/.test(eb1) && /Rex moves ?not at all ?bolted/.test(tb1) && !/Nothing moves/.test(vw1 + vb1), vw1 + ' | ' + vb1);
      // duo-ratio-long-digits: the ratio rounded, with separators
      await load(Object.assign({ logKg: 9, oLogKg: 9 }, W)); await pick('allout');
      { const v9 = await duoTxt('.verdict'); check('review round 1: the shoving match\'s ratio is rounded', /about 560,000 times what holds the other/.test(v9) && !/\d{6}/.test(v9.replace(/[\d,.]+ (?:m|kN|GN|km)/g, '')), v9); }
      // physics-shoving-match-bolted-rock-claim, copy-shovingmatch-torn-unbounded, duo-push-ground-preset-reason: a
      // single bolted wrestler's rock is checked at any strength, his hold once torn is his feet's, and the ground preset
      // names his bolts
      await load(Object.assign({ anchor: 'bolted', unbreakable: false }, W)); await pick('allout');
      const vk = await duoTxt('.verdict');
      await load(Object.assign({ inf: true, oAnchor: 'bolted', unbreakable: false }, W)); await pick('allout');
      const vk2 = await duoTxt('.verdict'), sk2 = await duoTxt('.status-row'), hk2 = await duoTxt('.happens');
      await load(Object.assign({ anchor: 'bolted' }, W)); await pick('ground');
      const gk = await duoTxt('.effort-read');
      await load(Object.assign({ anchor: 'bolted', unbreakable: false }, W)); await pick('plaster');
      const gk2 = await duoTxt('.effort-read');
      check('review round 1: a single bolted wrestler\'s rock tears past its tear load, and then only his feet hold him', /more than what holds the other \(Rex the rock around his bolts, about 697 kN, Ollie 17\.7 kN\)\. The rock around Rex’s bolts tears out, and from then on only his feet hold him \(17\.7 kN\)\. They fly apart at 26\.6 m\/s each/.test(vk) && !/can’t move Rex’s bolts/.test(vk)
        && /Ollie the rock around his bolts, about 697 kN/.test(vk2) && /Ollie holds 17\.7 kN once his rock tears/.test(sk2) && !/Ollie unbounded|Ollie holds unlimited/.test(vk2 + sk2 + hk2)
        && /The least effort that tears the rock out around Rex’s bolts\./.test(gk) && !/Standing, their feet slide/.test(gk)
        && /Even all-out, this test doesn’t shake the ground enough that plaster may crack 5 m away\. The lab counts a push through a bolted wrestler’s bolts as shaking where he shoves the other off over the stroke, a quick pulse\. None goes through them that way here/.test(gk2), vk + ' | ' + vk2.slice(0, 200) + ' | ' + gk.slice(0, 200) + ' | ' + gk2.slice(0, 300));
      // duo-shoving-shake-reason: a bolted winner's bolts hand the ground the loser's push over the push, a pulse the lab
      // counts (at a 10^6 kg dial it may crack plaster)
      await load(Object.assign({ anchor: 'bolted', logKg: 6, oLogKg: 6 }, W)); await pick('plaster');
      const pk = await duoTxt('.effort-read');
      check('review round 1: the push through a bolted winner\'s bolts shakes the ground', /The least effort that shakes the ground enough that plaster may crack 5 m away/.test(pk) && /At this effort the push through Rex’s bolts shakes the ground enough that plaster may crack 5 m away/.test(pk) && !/not a blow/.test(pk), pk.slice(0, 300));
      // copy-bothatonce-shove-tile: the shove that moves someone is the one shown, with its muscle basis
      await load(Object.assign({ wrestleMove: 'shove', wrestleWho: 'both', oAnchor: 'bolted' }, W)); await pick('allout');
      { const tb = await duoTxt('.tiles'), sb = await duoTxt('.status-row'); check('review round 1: Both at once shows the shove that moves Rex', /Ollie’s shove ?890 kN ?two hands/.test(tb) && !/Shove force ?299 kN/.test(tb) && /Comic mode: real muscle does better here/.test(sb), tb.slice(0, 200) + ' | ' + sb); }
      // duo-arm-loser-bolts-tear: a bolted loser's rock carries what reaches him in a standing pin (no tear here); since
      // review round 2 that is the force at his elbow, not his own press
      await load({ duoOpen: true, duoAction: 'arm', keepForm: false, unbreakable: false, oAnchor: 'bolted', logKg: 6 }); await ollieKg(Math.log10(90718.474)); await pick('allout');
      { const sa = await duoTxt('.status-row'), va = await duoTxt('.verdict'), ea = await eng('const r = P.armWrestle(mk({ F: 1e6 * g, keepForm: false, unbreakable: false }), mk({ keepForm: false, unbreakable: false, anchor: "bolted", body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, tB: r.tearB, PB: r.PB };');
        check('review round 1: a bolted loser\'s rock carries what reaches him in a standing pin', ea.o === 'pin' && ea.tB < 1 && /he pins Ollie in/.test(va) && !/Ground around Ollie’s bolts tears out/.test(sa), sa + ' | ' + JSON.stringify(ea)); }
      // copy-fireball-before-split: a fireball made before it reaches Ollie gives the split its verdict points to
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5, cLogD: 3 }); await pick('allout');
      { const hf = await duoTxt('.happens'), vf = await duoTxt('.verdict'); check('review round 1: the fireball made on the way gives the split', /its motion as it reaches him is taken back: below/.test(vf) && /Stopping it at Ollie frees 3\.63 TJ \(870 t TNT\) where he stands\. 3\.44 TJ of it is heat already made in the air on the way: that is real\. The rest, 192 GJ, is its motion, freed as it stops at him/.test(hf), hf.slice(-500)); }
      // duo-mutant-survivors: (a) decision 5's effect on the search (the default set speed: the slide, not the hit's air
      // blast); (b) a switch turned over in place gives what a fresh load gives (the search's key carries the switches);
      // (d) unequal strengths: each one's push back is his own push x t, as the engine gives it
      await load(Object.assign({ colSrc: 'set' }, COL));
      { const es = await duoTxt('.effort-read'); check('review round 1: the default set speed\'s ceiling is the carried slide, not the hit\'s blast', /Even at the least they need to stand and walk, Rex is carried along at 100 m\/s and ends up 516 m away, past the nearest people 5 m away\./.test(es) && !/air blast/.test(es), es.slice(0, 300)); }
      const FB2 = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
      await load(FB2); await pick('windows');
      await page.evaluate(() => { document.getElementById('nkb-ollie').click(); document.getElementById('nkb-rex').click(); }); await page.waitForTimeout(400); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
      const inPlace = JSON.stringify(await readResult(page, 'duo-bay'));
      await pick('allout');
      const vIn = await duoTxt('.verdict');
      await load(Object.assign({ noKnockback: false, oNoKnockback: false }, FB2)); await pick('windows');
      const fresh = JSON.stringify(await readResult(page, 'duo-bay'));
      check('review round 1: a Never knocked back switch turned over in place gives what a fresh load gives', inPlace === fresh && /It carries Ollie off at 343 m\/s/.test(vIn), inPlace.slice(0, 300) + ' || ' + fresh.slice(0, 300) + ' || ' + vIn.slice(-200));
      const eu = await eng('const r = P.pushMatch(mk(), mk({ F: 1e5 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { a: r.recoilAbsorbedA.J, b: r.recoilAbsorbedB.J, o: r.outcome };');
      await load(W); await ollieKg(5); await pick('allout');
      { const hu = await duoTxt('.happens'), mu = hu.match(/each one’s push back goes to the endless ocean \(Rex ([\d,]+) kg·m\/s, Ollie ([\d,]+) kg·m\/s, over the push\)/);
        check('review round 1: unequal pushes, each one\'s push back is his own', eu.o === 'bothShoved' && mu && near(num(mu[1]), eu.a, 0.02) && near(num(mu[2]), eu.b, 0.02) && eu.b > 1.05 * eu.a, (mu ? mu[0] : hu.slice(0, 300)) + ' ' + JSON.stringify(eu)); }
    }
    // ---- review round 2 of pull request 4 (research/reviews/canon-4-round2.json): each check fails with its fix reverted
    {
      const W = { duoOpen: true, duoAction: 'wrestle' }, A = { duoOpen: true, duoAction: 'arm' };
      // physics-carried-hit-energy-omits-hold-work: the splat frees the force of the hit over the squash, the hold's work
      // included (499 kJ at the default sprint; at 1 m/s 7.05 kJ beside 22.4 kN, not 1.5 kJ)
      await load(COL); await pick('allout');
      const qh = await duoTxt('.happens'), qm = await duoTxt('details.math .eq');
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(1 / 299792458) }, COL)); await pick('allout');
      const qt1 = await duoTxt('.tiles');
      check('review round 2: the carried hit frees the force of the hit over the squash', /The hit frees 499 kJ \(120 g TNT\): the force of the hit over the squash \(31 cm\)\. That is Rex’s motion energy as Ollie sees it, plus the work his footing does holding him back over the squash\./.test(qh)
        && /plus the hold × s \(in Ollie’s frame the ground under Rex moves with Ollie and pushes Rex back with the hold over the squash\) = 499 kJ\./.test(qm) && /the splat frees Q = F × s/.test(qm) && /Energy freed at the hit ?7\.05 kJ/.test(qt1) && /Force of the hit ?22\.4 kN/.test(qt1), qh.slice(-900) + ' | ' + qt1.slice(0, 300));
      // copy-source-supplied-two-figures: one rounding (three figures) for the source's supply across the view
      await load(COL);
      const ct = await duoTxt('.tiles'), ch = await duoTxt('.happens'), cm = await duoTxt('details.math .eq');
      await load(Object.assign({ colBounce: 'bounce' }, COL)); await pick('allout');
      const cbt = await duoTxt('.tiles'), cbh = await duoTxt('.happens'), cbm = await duoTxt('details.math .eq');
      check('review round 2: the source\'s supply has one figure on a view', /Ollie’s source supplies ?23,500 kg·m\/s/.test(ct) && /about 23,500 kg·m\/s in all/.test(ch) && /: 23,500 kg·m\/s\./.test(cm) && !/23,000/.test(ct + ch + cm)
        && /Ollie’s source supplies ?109,000 kg·m\/s/.test(cbt) && /everything Rex gains \(109,000 kg·m\/s\)/.test(cbh) && /: 109,000 kg·m\/s\./.test(cbm) && !/110,000/.test(cbt + cbh + cbm), ct.slice(-200) + ' | ' + cbt.slice(-200));
      // physics-carried-motion-air-below-1pct-c: sent off faster than sound below 1% of light speed, his ride heats real air
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(0.001 / Math.sqrt(1 - 1e-6)) }, COL)); await pick('allout');
      const ah = await duoTxt('.happens'), ab = await duoAll();
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(500 / 299792458), colBounce: 'bounce' }, COL)); await pick('allout');
      const ah5 = await duoTxt('.happens'), ab5 = await duoAll();
      // (a bounce off a 200 m/s charge sends Rex off at 400 m/s: the charge is below the speed of sound, his ride isn't)
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(200 / 299792458), colBounce: 'bounce' }, COL));
      const ae2 = await duoTxt('.effort-read');
      check('review round 2: a carried body faster than sound heats real air below 1% of light speed', /Carried at 300 km\/s, faster than sound, Rex’s body meets real air \(their own bodies do\)\. The air takes nearly all of his 135 TJ of motion \(32 kt TNT\) as he slides off/.test(ah) && /Damage radius if all of that energy went into the air as a blast \(Rex’s motion, heating the air as he slides off\)/.test(ab)
        && /Sent off at 1,000 m\/s, faster than sound, Rex’s body meets real air \(their own bodies do\)\. Of his 1\.5 GJ of motion the air takes 1\.45 GJ/.test(ah5) && /Damage radius if all of that energy went into the air as a blast \(Rex’s motion, heating the air as he slides off\)/.test(ab5)
        && /Rex is sent off faster than sound, and the air he heats as he slides off risks damage 5 m away/.test(ae2) && !/the hit’s air blast/.test(ae2), ah.slice(-700) + ' | ' + ah5.slice(-400) + ' | ' + ae2.slice(0, 300));
      // physics-steady-push-real-muscle-unlabelled: real muscle, the steady push's speed is an upper bound
      await load(Object.assign({ colMode: 'push', mode: 'real' }, COL)); await pick('allout');
      const rh = await duoTxt('.happens');
      check('review round 2: the steady push in real muscle is an upper bound', /With real muscle the push falls as the hands speed up, so this speed is an upper bound \(as in the shoving match\)\./.test(rh), rh.slice(-400));
      // physics-steady-push-lying-pusher: a pusher too weak to stand can't push, as in the shoving match
      await load(Object.assign({ colMode: 'push' }, COL)); await ollieKg(3.301); await pick('allout');
      const lv = await duoTxt('.verdict'), ls = await duoTxt('.status-row');
      check('review round 2: a pusher too weak to stand can\'t push', /^Ollie can’t push: at 3 t his strength \(19\.6 kN\) can’t stand him up \(see Weight\), so he lies flat, as in the shoving match\. Rex doesn’t move\.$/.test(lv) && /Ollie can’t stand, so he can’t push/.test(ls) && !/driven back/.test(lv), lv + ' | ' + ls);
      // physics-walkout-push-contradicts-motion: the walking winner holds back; his push is what keeps the loser at the pace
      const ewk = await eng('const r = P.pushMatch(mk(), mk({ F: 1000 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, wp: r.walkPush, J: r.recoilAbsorbedA && r.recoilAbsorbedA.J };');
      await load(W); await ollieKg(3); await pick('allout');
      const wv = await duoTxt('.verdict'), wt = await duoTxt('.tiles'), ws = await duoTxt('.status-row'), wh = await duoTxt('.happens');
      const wpm = wt.match(/Rex’s push ?([\d.]+) kN ?real on Ollie: what keeps him at the walking pace \(Rex could push 890 kN\); its push back goes to Rex’s source/), wjm = wh.match(/Its push back goes to his source \(They take their own recoil\): ([\d,]+) kg·m\/s over the walk-out/);
      check('review round 2: the walking winner holds back, and his push back is reported', ewk.o === 'walkOut' && wpm && near(num(wpm[1]) * 1000, ewk.wp, 0.005) && wjm && near(num(wjm[1]), ewk.J, 0.02) && /Rex holds 17\.7 kN · can push 890 kN/.test(ws) && /Rex could push with 890 kN/.test(wv) && !/Rex’s push \(890 kN\) beats/.test(wv) && !/Rex’s push ?890 kN ?real on Ollie/.test(wt), wv + ' | ' + wt + ' | ' + JSON.stringify(ewk));
      // copy-shoving-match-stroke-formula: both shoved, each moves about half the stroke; shoved off, the loser all of it
      await load(W); await pick('allout');
      const sh2 = await duoTxt('.happens'), sm2 = await duoTxt('details.math .eq');
      await load(Object.assign({ anchor: 'bolted' }, W)); await pick('allout');
      const sh3 = await duoTxt('.happens');
      await load(Object.assign({ inf: true, oAnchor: 'bolted' }, W)); await pick('allout');
      const sh4 = await duoTxt('.happens');
      check('review round 2: the shoving match\'s stroke is described as built', /until the gap between them has grown by the shove’s stroke \(2\.44 m, an estimate; here Rex moves 1\.22 m and Ollie 1\.22 m of it\)/.test(sh2) && /until x_Rex \+ x_Ollie = d = 2\.44 m/.test(sm2) && !/over the stroke d = 2\.44 m/.test(sm2)
        && /Ollie is pushed by Rex’s push, less his own hold, over the whole shove’s stroke \(2\.44 m, an estimate\) while their hands stay on each other; Rex doesn’t move\. Then Ollie slides to a stop/.test(sh3) && !/Each is pushed/.test(sh3)
        && /Rex meets it as a fireball/.test(sh4) && !/each slides to a stop on his feet/.test(sh4), sh2.slice(0, 600) + ' | ' + sh3.slice(0, 400));
      // physics-slide-harm-ignores-stroke (copy-push-distance-left-out-of-slide-harm): the Two-player effort card says the
      // search counts how far the push carries him (the ceilings are checked above: 3.68 t and 7.3 t)
      const cardsR2 = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      check('review round 2: the Two-player effort card counts the push\'s travel', /in the shoving match, the steady push and Collide’s charge it counts how far the push or the charge carries him too\)\./.test(cardsR2), '(card text)');
      // copy-bolted-winner-shake-not-shown: a bolted winner's bolts' pulse is shown, not only judged
      await load(Object.assign({ anchor: 'bolted', logKg: 6, oLogKg: 6 }, W)); await pick('plaster');
      const bs = await duoTxt('.status-row'), bh = await duoTxt('.happens');
      check('review round 2: the push through a bolted winner\'s bolts is shown', /The push through Rex’s bolts shakes the ground: plaster may crack out to/.test(bs) && /Bolted, Rex hands the ground Ollie’s push through his bolts: 140,000 kg·m\/s over 110 ms/.test(bh) && /his bolts hand the ground all of Ollie’s push \(140,000 kg·m\/s\)/.test(bh) && !/His feet hand the ground only what they hold against the other’s push \(Rex 140,000/.test(bh), bs + ' | ' + bh.slice(-600));
      // copy-empty-bar-caption: unlimited rows are listed, never 'Strength, footing and push: .'
      await load(Object.assign({ inf: true, anchor: 'bolted', oAnchor: 'bolted' }, W)); await pick('allout');
      const eb2 = await duoAll();
      check('review round 2: the shoving match\'s chart lists unlimited rows', /Strength, footing and push: Rex’s strength no limit · Rex’s push no limit · Ollie’s strength no limit · Ollie’s push no limit\./.test(eb2) && !/push: \./.test(eb2), eb2.slice(0, 400));
      // duo-both-at-once-bolts-pulse: Both at once with one bolted, the other's stalled shove presses on his bolts over the
      // stroke of his own real shove, a pulse into the ground (the shoving match's rule)
      const BB = { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' };
      await load(Object.assign({ anchor: 'bolted', logKg: 6, oLogKg: 6 }, BB)); await pick('plaster');
      const bp = await duoTxt('.effort-read'), bph = await duoTxt('.happens');
      await load(Object.assign({ oAnchor: 'bolted' }, BB)); await pick('rattle');
      const br2 = await duoTxt('.effort-read');
      check('review round 2: Both at once counts the shove pressing on the bolted one\'s bolts', /\(each as hard as lifting 3\d\d t\)\. The least effort that shakes the ground enough that plaster may crack 5 m away/.test(bp) && !/through his feet, a friction drag/.test(bp) && /Bolted, Rex doesn’t move: Ollie’s shove presses on his bolts for as long as Rex’s own shove drives Ollie off/.test(bph)
        && /\(each as hard as lifting 5\d\.\d t\)\. The least effort that rattles windows/.test(br2) && !/Even all-out, this test doesn’t rattle/.test(br2), bp.slice(0, 300) + ' | ' + br2.slice(0, 200));
      // duo-r2-mutant-survivors: (a) Both at once with Ollie bolted: one of them slides, not both; (b) no 'They mean it'
      // where nothing is meant (the paradox; a catch with no fireball)
      await load(Object.assign({ oAnchor: 'bolted' }, BB));
      const bo1 = await duoTxt('.effort-read');
      await load(Object.assign({ anchor: 'bolted' }, COL)); await pick('windows');
      const mn1 = await duoTxt('.effort-read');
      await load({ duoOpen: true, duoAction: 'catch', keepForm: false }); await pick('windows');
      const mn2 = await duoTxt('.effort-read');
      check('review round 2: Both at once with one bolted slides one of them, and nothing unmeant is called meant', /Past that, one of them slides 5\.17 m/.test(bo1) && !/both are shoved apart/.test(bo1) && !/They mean it/.test(mn1 + mn2), bo1.slice(0, 300) + ' | ' + mn1.slice(0, 200) + ' | ' + mn2.slice(0, 200));
      // duo-noanswer-follows-top: at an unlimited dial the jump's least disruptive effort is the paradox: the box says so
      await load(Object.assign({ colSrc: 'jump', inf: true }, COL));
      const nj = await duoTxt('.effort-read');
      await pick('windows');
      const njw = await duoTxt('.effort-read');
      check('review round 2: the no-answer caveat follows the effort shown, at an unlimited dial', /The hit has no physical answer here \(the canon’s ruling\), so the lab can’t judge its harm/.test(nj) && /The hit has no physical answer here/.test(njw) && !/Even all-out, this test doesn’t/.test(njw), nj.slice(0, 400) + ' | ' + njw.slice(0, 300));
      // physics-standing-pin-loser-elbow-force-unchecked: standing, the loser's feet (or his bolts' rock) carry the force at
      // his elbow; and at unlimited strength against a finite press it is unbounded, never NaN or 'about unlimited'
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(3); await pick('allout');
      const ps = await duoTxt('.status-row'), ph = await duoTxt('.happens');
      await load(Object.assign({ keepForm: false, unbreakable: false, oAnchor: 'bolted', logKg: 7 }, A)); await ollieKg(3); await pick('allout');
      const pb7 = await duoTxt('.status-row');
      await load(Object.assign({ keepForm: false, inf: true }, A)); await ollieKg(3); await pick('allout');
      const pu = await duoAll();
      check('review round 2: standing, the loser\'s feet carry the force at his elbow', /Ollie’s feet slide: what turns his forearm \(24\.2 kN\) beats 17\.7 kN/.test(ps) && !/Ollie’s feet hold/.test(ps) && /what reaches his body is the force at his elbow that turns his forearm against Rex’s hand, about 24\.2 kN/.test(ph)
        && /Ground around Ollie’s bolts tears out/.test(pb7) && /loads Ollie’s elbow pad with an unbounded force/.test(pu) && /he presses with unlimited force/.test(pu) && !/NaN|about unlimited|his full unlimited/.test(pu), ps + ' | ' + pb7 + ' | ' + pu.slice(0, 400));
      // copy-arm-one-bolted-unlimited-no-answer: one held without limit, the press into him has no answer, his own flings the
      // other off
      await load(Object.assign({ keepForm: false, anchor: 'bolted', inf: true }, A)); await pick('allout');
      const ov = await duoTxt('.verdict'), os = await duoTxt('.status-row'), ot = await duoTxt('.tiles');
      check('review round 2: arm wrestling, one bolted at unlimited strength flings the other off', /Rex is bolted to ground their power holds, so Ollie’s unlimited press into him has no physical answer \(the canon’s ruling\) and moves nobody\. Rex’s own unlimited press on Ollie is real, and Ollie’s feet hold only 17\.7 kN, so he is flung off at just under light speed, with unlimited energy\./.test(ov)
        && /Ollie’s feet slide: the other’s unlimited press/.test(os) && /Ollie is flung off/.test(ot) && !/meets a hold without limit: there is no physical answer/.test(ov), ov + ' | ' + os + ' | ' + ot.slice(0, 300));
      // copy-catch-switches-differ: the return leg reaches Rex the same way, but his switch is set the other way, and its
      // own radii are shown
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5, noKnockback: false }); await pick('allout');
      const kv = await duoTxt('.verdict'), ka = await duoAll();
      check('review round 2: the game of catch with the two switches set apart', /Thrown back, it reaches Rex as plasma too, but Rex’s Never knocked back is off \(Their powers\)\. It carries Rex off at 343 m\/s/.test(kv) && !/hits Rex the same way/.test(kv) && /\(the return throw: what it frees at Rex and as he rides on through the lower air\)/.test(ka), kv.slice(-400) + ' | ' + (ka.match(/Damage radius[^)]*\)/g) || []).join(' / '));
    }
    if (errs.length) r4.push('page errors: ' + errs.slice(0, 3).join(' | '));
    if (r4.length) fail('pull request 4 (contests and Never knocked back): ' + r4.join(' ;; ')); else okLog('pull request 4: Collide carries the one hit along (on) or knocks him back (off), explains the paradox first (bolted, a 10⁹ kg jump and stomp), carries a Rex bolted on real rock with a plug of rock, takes the hit\'s energy back unless a blast preset means it, and its search stops at the carried slide; the steady push, the shoving match (both shoved apart, shoved off, a walk-out), Both at once, the Lift and arm wrestling (reading B) say what the engine does, on and off; the two Never knocked back switches are on by default, named, noted, saved and listed, change no tab but the fireball case, which shows each one; the cards');
    await page.close();
  }
  await browser.close();
  if (problems) { console.log('PROBLEMS: see above'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
