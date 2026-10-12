// usage: node pw.js '<json state overrides>' tab [evalJS] [shot.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const PREV = process.env.PREV || __dirname + '/repo/rex-strength-lab/dist/preview.html';
(async () => {
  const st = JSON.parse(process.argv[2] || '{}'), tab = process.argv[3] || 'throw', ev = process.argv[4], shot = process.argv[5];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(PREV).href);
  await page.evaluate((s) => { const cur = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(cur, s))); }, st);
  await page.goto(pathToFileURL(PREV).href);
  await page.waitForTimeout(800);
  const duo = ['arm', 'wrestle', 'catch', 'collide'].includes(tab);
  await page.click(duo ? '#grp-duo' : '#grp-solo');
  await page.click('#tab-' + tab);
  await page.waitForTimeout(+process.env.WAIT || 2500);
  if (ev) { const r = await page.evaluate(ev); if (r !== undefined) console.log('EVAL:', typeof r === 'string' ? r : JSON.stringify(r)); await page.waitForTimeout(+process.env.WAIT2 || 2500); }
  console.log(await page.evaluate(() => document.querySelector('#bay').innerText));
  if (shot) await (await page.$('main.panel')).screenshot({ path: shot });
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
