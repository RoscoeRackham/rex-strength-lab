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
    const groundOk = await page.evaluate(() => { const s = document.getElementById('surface'); return !!s && document.getElementById('ground-sec').contains(s) && !document.getElementById('setup').contains(s) && !document.getElementById('powers').contains(s); });
    if (!groundOk) texts.push('the Ground menu is not in the Ground section');
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
    await page.addInitScript(countDuoCalls, { names: DUO_FNS });
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
    const colRead = async (anchor) => { await load(Object.assign({ duoOpen: true, duoAction: 'collide', anchor }, anchor === 'bolted' ? { colSrc: 'jump', logKg: 6 } : {})); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
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
    // the plaster preset on the other two-player tests: the shove's, the throw's and the catch's pushes into the ground
    // find an effort; an even arm wrestle is a dead heat (no pin, so no blow into the ground): a definite 'never'
    const dp = [];
    for (const [tab, extra, finds] of [['arm', { logKg: 12 }, false], ['wrestle', { wrestleMove: 'shove', logKg: 8 }, true], ['wrestle', { wrestleMove: 'throw', logKg: 8 }, true], ['catch', { cObj: 'car', cStyle: 'hard', logKg: 9 }, true]]) {
      await load(Object.assign({ duoOpen: true, duoAction: tab }, extra)); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      const t = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
      if (!(finds ? /Effort: .*The least effort that shakes the ground enough that plaster may crack/ : /Even all-out, this test doesn’t shake the ground/).test(t) || /undefined|NaN/.test(t)) dp.push(tab + (extra.wrestleMove || '') + ': ' + t.slice(0, 160));
    }
    if (dp.length) fail('two-player plaster presets: ' + dp.join(' ; ')); else okLog('the plaster preset finds an effort on Wrestle shove and throw and on Catch, and says never for an even arm wrestle');
    // the two-player 'Break the ground' sets Unbreakable footing aside, and its ceiling is on real ground too
    await load({ duoOpen: true, duoAction: 'collide', anchor: 'bolted' }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'ground');
    const dg = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
    const dgBay = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    if (!/set aside for this test/.test(dg) || !/Effort: /.test(dg) || !/The least effort that breaks the ground/.test(dg) || /Least disruptive already does this/.test(dg) || /The ground holds: their power/.test(dgBay) || !/On real ground, courtesy ceiling: .*?Past that, the ground breaks under Rex/.test(dg)) fail('two-player break the ground: ' + dg.slice(0, 400)); else okLog('two-player break the ground: an effort on real ground, the bay drawn on real ground, its ceiling where the rock cracks (' + dg.slice(0, 70) + '…)');
    // ...and that real-ground run still carries the hit into the ground (Collide's toGround option): standing, Ollie
    // jumps onto him, near people 3 m off, where the shaking comes before the rock cracks
    await load({ duoOpen: true, duoAction: 'collide', anchor: 'friction', colSrc: 'jump', logKg: 6.25, near: 3 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'ground');
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
  if (!only) {
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
      if (st.grow) { await page.evaluate(() => { document.getElementById('powers').open = true; }); await page.selectOption('#absorb', 'gradual'); await page.waitForTimeout(300); await page.click('#grow-what-' + st.grow); await page.waitForTimeout(400); await settle(page, 'bay'); growHead[st.grow] = await page.evaluate(() => (Array.from(document.querySelectorAll('#bay .growth-whatif p')).find((n) => /which becomes/.test(n.textContent)) || {}).textContent || ''); growHead[st.grow + 'Item'] = await page.evaluate(() => (Array.from(document.querySelectorAll('#bay .growth-whatif li, #bay .growth-whatif p')).find((n) => /^It becomes/.test(n.textContent)) || {}).textContent || ''); }
      const t = await page.evaluate(() => document.getElementById('bay').textContent.replace(/\u00a0/g, ' ').replace(/\s+/g, ' '));
      const off = offRule(t).concat(Array.from(t.matchAll(/[\d.,]+(?: [a-z]+illion)?(?:×|% of) the energy (?:it takes to blow|that holds) the Earth/g)).map((m) => m[0]));
      if (off.length) weightBad.push(JSON.stringify(st) + ': ' + off.join(' | '));
    }
    if (weightBad.length) fail('Weight tab energy comparisons outside the ladder rule: ' + weightBad.slice(0, 3).join(' || ')); else okLog('the Weight tab’s energy comparisons (dense matter, the Earth falling in, growth) keep to the ladder rule');
    // a rough rung's energy, and the mass it makes, is given to one figure in the growth what-if
    const oneFig = /: about \d(?: × 10[⁰¹²³⁴⁵⁶⁷⁸⁹]+)? J, which becomes about \d+(?:,0+)* (?:kg|t) of mass/;
    const oneFigItem = /^It becomes about \d+(?:,0+)* (?:kg|t) of new mass/;
    if (!oneFig.test(growHead.krakatoa || '') || !oneFig.test(growHead.chicxulub || '') || !oneFigItem.test(growHead.krakatoaItem || '') || !oneFigItem.test(growHead.chicxulubItem || '') || /\d,\d{3} t|\d\.\d+ m tall/.test(growHead.chicxulubItem || '')) fail('growth what-if: rough energies should be given to one figure: ' + JSON.stringify(growHead));
    else okLog('growth what-if gives the rough Krakatoa and dinosaur-killer energies, and the masses they make, to one figure: ' + growHead.krakatoa.slice(0, 90) + '…');
    // a milestone set by a rough rung (the dinosaur-killer) gives its dial point roughly
    await load({ action: 'punch' }, false); await page.waitForTimeout(4000);
    const chix = await page.evaluate(() => { const t = document.getElementById('ladder-viz').textContent; const i = t.indexOf('Punch out-hits the dinosaur-killer impact'); return i < 0 ? '' : t.slice(i, i + 80); });
    if (!/impactabout \d /.test(chix)) fail('the dinosaur-killer milestone should be given roughly: ' + chix); else okLog('the dinosaur-killer milestone is given roughly: ' + chix.slice(0, 70));
    // the sources table lists every rung with its status and a link
    const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table tbody tr')).map((tr) => ({ label: tr.cells[0].textContent, status: tr.cells[2].textContent, links: tr.cells[3].querySelectorAll('a').length })));
    const want = await page.evaluate(() => window.DINO_DATA.energyRefs.map((e) => 'Energy: ' + e.label));
    const missing = want.filter((l) => !rows.some((r) => r.label.startsWith(l) && r.status && r.links > 0));
    if (missing.length) fail('energy rungs missing from the sources table (or without a status or link): ' + missing.slice(0, 4).join(' | '));
    else okLog('the sources table lists all ' + want.length + ' energy rungs, each with a status and at least one link');
    if (errs.length) fail('page errors in the energy comparison checks: ' + errs.slice(0, 3).join(' | '));
    await page.close();
  }
  await browser.close();
  if (problems) { console.log('PROBLEMS: see above'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
