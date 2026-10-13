const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
(async () => {
  const body = fs.readFileSync(ROOT + '/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'p.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); }); page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href); await page.waitForTimeout(2000);
  console.log('verdict', await page.$eval('#bay .verdict', (n) => n.textContent));
  console.log('powers-sum', await page.$eval('#powers-sum', (n) => n.textContent), '| setup-sum', await page.$eval('#setup-sum', (n) => n.textContent), '| duo-sum', await page.$eval('#duo-sum', (n) => n.textContent));
  console.log('duo open?', await page.$eval('#duo', (n) => n.open), 'duo bay children', await page.$eval('#duo-bay', (n) => n.children.length));
  await page.click('#duo > summary'); await page.waitForTimeout(1500);
  console.log('duo verdict', await page.$eval('#duo-bay', (n) => (n.querySelector('.verdict') || n).textContent.slice(0, 200)));
  for (const t of ['wrestle', 'catch', 'collide']) { await page.click('#tab-' + t); await page.waitForTimeout(1200); console.log(t, await page.$eval('#duo-bay', (n) => (n.querySelector('.verdict') || n).textContent.slice(0, 160))); }
  await page.click('#tab-jump'); await page.waitForTimeout(600); console.log('jump', await page.$eval('#bay .verdict', (n) => n.textContent));
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  await page.check('#bolt-ollie'); await page.waitForTimeout(1500);
  console.log('collide bolted ollie', await page.$eval('#duo-bay .verdict', (n) => n.textContent.slice(0, 160)));
  console.log('powers-sum', await page.$eval('#powers-sum', (n) => n.textContent));
  console.log('ls', await page.evaluate(() => localStorage.getItem('rex-lab-v1')));
  console.log('errors', errs);
  await browser.close();
})();
