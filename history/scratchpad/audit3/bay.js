// usage: node bay.js '<settings json>' [clickFeatTitle]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const settings = process.argv[2]; const feat = process.argv[3];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto('file://' + __dirname + '/preview.html');
  if (settings) { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', s), settings); await page.reload(); }
  await page.waitForTimeout(1500);
  if (feat) {
    await page.evaluate((t) => { const a = [...document.querySelectorAll('article.feat')].find((x) => x.querySelector('.t').textContent === t); a.querySelector('button.run').click(); }, feat);
    await page.waitForTimeout(1500);
  }
  await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
  const out = await page.evaluate(() => {
    const bay = document.querySelector('#bay').cloneNode(true);
    bay.querySelectorAll('.objlist, [role=listbox], select').forEach((n) => n.remove());
    return 'STATE ' + localStorage.getItem('rex-lab-v1') + '\nMODE comic=' + document.querySelector('#mode-comic').getAttribute('aria-pressed') + ' real=' + document.querySelector('#mode-real').getAttribute('aria-pressed') + ' hint=' + document.querySelector('#mode-hint').innerText + '\nDIAL ' + document.querySelector('#dial-big').innerText + ' | ' + document.querySelector('#dial-force').innerText + ' | ' + document.querySelector('#dial-who').innerText + '\nTAB ' + (document.querySelector('[role=tab][aria-selected=true]') || {}).innerText + '\n' + document.querySelector('#bay').innerText;
  });
  console.log(out.replace(/OBJECT\n(?:.*· .*\n)+/, 'OBJECT [list]\n'));
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
