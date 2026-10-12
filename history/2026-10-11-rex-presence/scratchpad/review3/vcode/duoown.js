const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript(() => { if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ group: 'duo', duoAction: 'arm' })); sessionStorage.setItem('s', '1'); } });
  await page.goto(pathToFileURL(__dirname + '/preview.html').href);
  const settle = async () => { for (let i = 0; i < 600; i++) { if (!(await page.evaluate(() => /Working out|working it out/i.test(document.querySelector('#bay').textContent)))) return; await page.waitForTimeout(100); } };
  await page.waitForTimeout(1500); await settle();
  const read = () => page.evaluate(() => ({ st: JSON.parse(localStorage.getItem('rex-lab-v1')), read: (document.querySelector('#bay .effort-read') || {}).textContent, slider: (document.querySelector('#duo-effort-use') || {}).value, oSlider: (document.querySelector('#o-effort-use') || {}).value }));
  let s = await read(); console.log('default:', s.read, '| slider', s.slider);
  await page.click('#bay details.effort-adjust > summary');
  await page.waitForTimeout(300);
  // drag: focus the slider and move it with the keyboard (each press fires input)
  await page.focus('#duo-effort-use');
  const target = 4.41;
  for (let i = 0; i < 300; i++) { const v = Number(await page.$eval('#duo-effort-use', (x) => x.value)); if (v >= target - 1e-9) break; await page.keyboard.press('ArrowRight'); }
  await page.waitForTimeout(400); await settle(); await page.waitForTimeout(400);
  s = await read(); console.log('after drag:', s.read, '| duoEffort', s.st.duoEffort, 'duoLogKg', s.st.duoLogKg, '| slider', s.slider);
  await page.click('#o-effort-own');
  await page.waitForTimeout(600); await settle(); await page.waitForTimeout(400);
  s = await read(); console.log('after tick:', s.read, '| oEffortLogKg', s.st.oEffortLogKg, '| Ollie slider', s.oSlider, '| duoLogKg', s.st.duoLogKg);
  if (errs.length) console.log('ERR', errs);
  await browser.close();
})();
