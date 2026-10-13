// usage: node page.js '<json state>' [width] [selector]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const S = __dirname;
const html = process.env.PAGE || (S + '/repo/rex-strength-lab/dist/index.html');
(async () => {
  const st = JSON.parse(process.argv[2]); const W = Number(process.argv[3] || 1280); const sel = process.argv[4] || 'body';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(html).href);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await page.reload(); await page.waitForTimeout(2500);
  if (process.env.CLICK) { for (const c of process.env.CLICK.split('|')) { await page.click(c).catch((e) => console.log('click fail', c)); await page.waitForTimeout(1500); } }
  const txt = await page.evaluate((sel) => Array.from(document.querySelectorAll(sel)).map((e) => e.innerText).join('\n----\n'), sel);
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(txt); console.log('OVERFLOW', ov, 'ERRS', JSON.stringify(errs));
  if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT, fullPage: false });
  await browser.close();
})();
