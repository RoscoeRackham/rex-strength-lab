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
    for (const action of []) for (const logKg of [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 34]) for (const mode of logKg >= 20 ? ['comic'] : ['comic', 'real']) {
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
      if (st.grow) { await page.evaluate(() => { document.getElementById('powers').open = true; }); await page.selectOption('#absorb', 'gradual'); await page.waitForTimeout(300); await page.click('#grow-what-' + st.grow); await page.waitForTimeout(400); await settle(page, 'bay'); growHead[st.grow] = (await page.evaluate(() => (Array.from(document.querySelectorAll('#bay .growth-whatif p')).find((n) => /which becomes/.test(n.textContent)) || {}).textContent || '')).replace(/\u00a0/g, ' '); growHead[st.grow + 'Table'] = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .growth-whatif td[data-col="Mass"]')).map((n) => n.textContent.replace(/\u00a0/g, ' ')).join(' | ')); growHead[st.grow + 'Item'] = (await page.evaluate(() => (Array.from(document.querySelectorAll('#bay .growth-whatif li, #bay .growth-whatif p')).find((n) => /^It becomes/.test(n.textContent)) || {}).textContent || '')).replace(/\u00a0/g, ' '); }
      const t = await page.evaluate(() => document.getElementById('bay').textContent.replace(/\u00a0/g, ' ').replace(/\s+/g, ' '));
      const off = offRule(t).concat(Array.from(t.matchAll(/[\d.,]+(?: [a-z]+illion)?(?:×|% of) the energy (?:it takes to blow|that holds) the Earth/g)).map((m) => m[0]));
      if (off.length) weightBad.push(JSON.stringify(st) + ': ' + off.join(' | '));
    }
    if (weightBad.length) fail('Weight tab energy comparisons outside the ladder rule: ' + weightBad.slice(0, 3).join(' || ')); else okLog('the Weight tab’s energy comparisons (dense matter, the Earth falling in, growth) keep to the ladder rule');
    // a rough rung's energy, and the mass it makes, is given to one figure in the growth what-if
    const oneFig = /: about \d(?: × 10[⁰¹²³⁴⁵⁶⁷⁸⁹]+)? J, which becomes about \d+(?:,0+)* (?:kg|t) of mass/;
    const oneFigItem = /^It becomes about \d+(?:,0+)* (?:kg|t) of new mass/;
    // the dinosaur-killer's table: each mass to two figures at most
    const twoFig = (t) => Array.from(t.matchAll(/([\d.,]+)(?: [a-z]+illion)? t \(/g)).every((m) => m[1].replace(/[,.]/g, '').replace(/^0+/, '').replace(/0+$/, '').length <= 2);
    if (!oneFig.test(growHead.krakatoa || '') || !oneFig.test(growHead.chicxulub || '') || !oneFigItem.test(growHead.krakatoaItem || '') || !oneFigItem.test(growHead.chicxulubItem || '') || /\d,\d*[1-9]\d* t|\d\.\d+ m tall/.test(growHead.chicxulubItem || '') || !growHead.chicxulubTable || !twoFig(growHead.chicxulubTable)) fail('growth what-if: rough energies should be given to one figure: ' + JSON.stringify(growHead));
    else okLog('growth what-if gives the rough Krakatoa and dinosaur-killer energies, and the masses they make, to one figure: ' + growHead.krakatoa.slice(0, 90) + '…');
    console.log('GROWHEAD ' + JSON.stringify(growHead));
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
  await browser.close();
  if (problems) { console.log('PROBLEMS: see above'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
