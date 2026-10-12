// Ollie's own effort after a drag of the shared effort slider: which value does the checkbox start him at?
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const url = pathToFileURL(__dirname + '/preview.html').href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript(() => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ group: 'duo', duoAction: 'arm' })); sessionStorage.setItem('x', '1'); } });
  await page.goto(url);
  await page.waitForTimeout(3000);
  const st = () => page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
  const read = () => page.evaluate(() => document.querySelector('.effort-read') && document.querySelector('.effort-read').textContent);
  console.log('start:', (await read()).slice(0, 200));
  const sl = await page.evaluate(() => { const s = document.querySelector('#duo-effort-use'); return { min: s.min, max: s.max, value: s.value }; });
  console.log('slider', sl);
  // open the folded controls, then drag the shared slider a few steps toward the gentle end
  await page.evaluate(() => { document.querySelector('#duo-effort-use').closest('details').open = true; });
  await page.focus('#duo-effort-use');
  const target = (Number(sl.min) + 1.0).toFixed(2);
  await page.evaluate((v) => { const s = document.querySelector('#duo-effort-use'); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }, target);
  await page.waitForTimeout(1500);
  console.log('after drag: duoEffort', (await st()).duoEffort, 'duoLogKg', (await st()).duoLogKg);
  console.log('readout:', (await read()).slice(0, 200));
  // now tick 'What-if: Ollie sets his own effort'
  await page.click('#o-effort-own');
  await page.waitForTimeout(1500);
  const s2 = await st();
  console.log('after tick: oEffortOwn', s2.oEffortOwn, 'oEffortLogKg', s2.oEffortLogKg, 'duoLogKg', s2.duoLogKg);
  console.log('readout:', (await read()).slice(0, 260));
  const so = await page.evaluate(() => { const s = document.querySelector('#o-effort-use'); return s && { value: s.value, text: s.getAttribute('aria-valuetext') }; });
  console.log('ollie slider', so, 'errors', errs);
  await browser.close();
})();
