// state migration and validators, closed/open behaviour
const { launch, url, settle, text } = require('./lib.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0;
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; if (delay) { const t = performance.now(); while (performance.now() - t < delay) {} } return f.apply(this, arguments); }; }
    v = x;
  } });
};
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(countDuoCalls, { names: DUO_FNS });
  await page.goto(url('branch.html'));
  const cases = [
    { group: 'duo' },
    { group: 'duo', duoOpen: false },
    { group: 'solo', duoOpen: true },
    { duoOpen: 'true' },
    { duoOpen: 1 },
    { duoOpen: null },
    { anchor: 'braced', oAnchor: 'braced' },
    { anchor: 'bogus', oAnchor: 7 },
    { duoAction: 'walk' },
    { duoAction: 'throw', group: 'duo' },
    { action: 'arm' },
  ];
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c);
    await page.reload(); await page.waitForTimeout(1500);
    const r = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return { open: document.getElementById('duo').open, saved: { group: s.group, duoOpen: s.duoOpen, anchor: s.anchor, oAnchor: s.oAnchor, duoAction: s.duoAction, action: s.action }, sel: (document.querySelector('#duo-tabs [aria-selected=true]') || {}).id || null, solosel: (document.querySelector('#tabs [aria-selected=true]') || {}).id || null, calls: window.__duoCalls, boltR: document.getElementById('bolt-rex').checked, boltO: document.getElementById('bolt-ollie').checked }; });
    console.log(JSON.stringify(c), '->', JSON.stringify(r));
  }
  // reload again after group duo: should stay open (duoOpen saved), group gone; then close, reload -> closed
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ group: 'duo' })));
  await page.reload(); await page.waitForTimeout(1000);
  await page.click('#duo > summary'); await page.waitForTimeout(300);
  await page.reload(); await page.waitForTimeout(1000);
  console.log('after closing and reloading:', await page.evaluate(() => ({ open: document.getElementById('duo').open, s: JSON.parse(localStorage.getItem('rex-lab-v1')).duoOpen })));
  console.log('errors', errs);
  await br.close();
})();
