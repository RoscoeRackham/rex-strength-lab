// With the Rex + Ollie element closed, settings changes, Rex's tabs, a record-book run and a resize run no two-player
// engine call. Then a set of corrupt saved states load without page errors.
const { chromium, CHROME, wrap, settle, readResult, S } = require('./h.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff', 'unlimitedClash'];
const countDuoCalls = ({ names }) => {
  window.__duoCalls = 0; window.__who = {};
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; window.__who[k] = (window.__who[k] || 0) + 1; return f.apply(this, arguments); }; }
    v = x;
  } });
};
(async () => {
  const src = process.argv[2] || S + '/work/rex-strength-lab/dist/index.html';
  const url = wrap(src, 'closed.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(countDuoCalls, { names: DUO_FNS });
  await page.goto(url);
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1500);
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  const steps = [
    ['strength chip', async () => { await page.click('#tier-chips .chip:nth-child(3)'); }],
    ['surface', async () => { await page.selectOption('#surface', 'gravel'); }],
    ['bolt rex', async () => { await page.setChecked('#bolt-rex', true); }],
    ['bolt ollie', async () => { await page.setChecked('#bolt-ollie', true); }],
    ['comic ground', async () => { await page.setChecked('#ground-holds', true); }],
    ['real mode', async () => { await page.click('#mode-real'); }],
    ['absorb', async () => { await page.selectOption('#absorb', 'instant'); }],
    ['tabs', async () => { for (const t of ['walk', 'lift', 'jump', 'sprint', 'pull', 'weight', 'throw']) { await page.click('#tab-' + t); await page.waitForTimeout(150); } }],
    ['walker both', async () => { await page.click('#tab-walk'); await page.waitForTimeout(200); const b = await page.$('#bay button:has-text("Both")'); if (b) await b.click(); }],
    ['resize', async () => { await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(500); await page.setViewportSize({ width: 1280, height: 900 }); }],
    ['record run', async () => { const b = await page.$('button.run'); if (b) await b.click(); }],
    ['strength drag', async () => { await page.focus('#strength'); for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight'); }],
  ];
  for (const [name, fn] of steps) {
    await fn(); await page.waitForTimeout(700);
    const r = await page.evaluate(() => ({ calls: window.__duoCalls, who: window.__who, open: document.getElementById('duo').open }));
    console.log((r.calls ? 'CALLS ' : 'none  ') + name + ' ' + JSON.stringify(r));
  }
  await page.waitForTimeout(2000);
  console.log('after 2 s: ' + JSON.stringify(await page.evaluate(() => window.__duoCalls)));
  console.log('errors: ' + JSON.stringify(errs));
  // corrupt saves
  const CASES = [
    { group: 'duo', duoOpen: 'x', duoAction: 'nope', anchor: 'braced', oAnchor: 7, wAngle: 'a', angle: 200 },
    { duoOpen: 1, anchor: 'Bolted', oAnchor: 'braced', group: 'solo' },
    { duoOpen: null, wAngle: 91, angle: 30 },
    { angle: 30, wrestleMove: 'throw', duoAction: 'wrestle', duoOpen: true },
    [1, 2, 3], 'str', 5, true, null,
  ];
  for (const c of CASES) {
    errs.length = 0;
    await page.evaluate((c) => localStorage.setItem('rex-lab-v1', JSON.stringify(c)), c);
    await page.reload(); await page.waitForTimeout(1200); await settle(page, 'bay');
    const r = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return { open: document.getElementById('duo').open, duoOpen: s.duoOpen, duoAction: s.duoAction, anchor: s.anchor, oAnchor: s.oAnchor, wAngle: s.wAngle, angle: s.angle, group: s.group, boltRex: document.getElementById('bolt-rex').checked, boltOllie: document.getElementById('bolt-ollie').checked, keys: Object.keys(s).filter((k) => /^\d+$/.test(k)) }; });
    if (r.open) await settle(page, 'duo-bay');
    console.log(JSON.stringify(c) + ' -> ' + JSON.stringify(r) + ' errors ' + JSON.stringify(errs));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
