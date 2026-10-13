const { launch, url, settle, text, S } = require('./lib.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0;
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; if (window.__delay || delay) { const t = performance.now(); while (performance.now() - t < (window.__delay || delay)) {} } return f.apply(this, arguments); }; }
    v = x;
  } });
};
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(countDuoCalls, { names: DUO_FNS });
  await page.goto(url('branch.html'));
  // (d) settings changed while closed; reopen renders the current settings
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
  await page.reload(); await page.waitForTimeout(300); await settle(page, 'duo-bay');
  const v0 = await page.evaluate(() => document.querySelector('#duo-bay .verdict').textContent);
  await page.click('#duo > summary'); await page.waitForTimeout(300);
  const c0 = await page.evaluate(() => window.__duoCalls);
  await page.click('#tier-chips .chip:nth-child(3)'); await page.waitForTimeout(300);
  await page.selectOption('#surface', 'granite'); await page.waitForTimeout(300);
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  await page.check('#bolt-rex'); await page.waitForTimeout(1000);
  const c1 = await page.evaluate(() => window.__duoCalls);
  console.log('(d) calls while closed after 3 settings changes:', c1 - c0, ' duo-sum:', await page.evaluate(() => document.getElementById('duo-sum').textContent));
  await page.click('#duo > summary');
  // what is on screen just after reopening (before the deferred render runs)
  const early = await page.evaluate(() => (document.querySelector('#duo-bay .verdict') || document.getElementById('duo-bay')).textContent.slice(0, 120));
  await page.waitForTimeout(300); await settle(page, 'duo-bay');
  const v1 = await page.evaluate(() => document.querySelector('#duo-bay .verdict').textContent);
  // fresh load with the same state
  const st = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
  await page.reload(); await page.waitForTimeout(300); await settle(page, 'duo-bay');
  const v2 = await page.evaluate(() => document.querySelector('#duo-bay .verdict').textContent);
  console.log('(d) verdict before close:', v0.slice(0, 100));
  console.log('(d) just after reopen   :', early);
  console.log('(d) after reopen        :', v1.slice(0, 100));
  console.log('(d) fresh load          :', v2.slice(0, 100), v1 === v2 ? 'MATCH' : 'MISMATCH');
  // (a) load open with a slow engine: what shows before the two-player render finishes
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'collide' })));
  await page.addInitScript(() => { window.__delay = 150; });
  await page.reload();
  await page.waitForTimeout(150);
  const a = await page.evaluate(() => ({ kids: document.getElementById('duo-bay').children.length, txt: document.getElementById('duo-bay').textContent.slice(0, 80), sel: (document.querySelector('#duo-tabs [aria-selected=true]') || {}).id || null, open: document.getElementById('duo').open }));
  await page.screenshot({ path: S + '/a-load-open.png', clip: { x: 0, y: 0, width: 1280, height: 1800 }, fullPage: true });
  console.log('(a) soon after load with duoOpen:', JSON.stringify(a));
  console.log('errors', errs);
  await br.close();
})();
