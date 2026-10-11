const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = __dirname + '/n10-preview.html';
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + prev);
  await page.waitForTimeout(5000);
  const ls = await page.evaluate(() => { try { return localStorage.getItem('rex-lab-v1'); } catch (e) { return 'ERR ' + e; } });
  console.log('LS', ls);
  await page.click('#tab-jump'); await page.waitForTimeout(500);
  // open all details
  await page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
  await page.waitForTimeout(300);
  const txt = await page.evaluate(() => document.body.innerText);
  for (const line of txt.split('\n')) if (/Legs push|Strength means force|1\.4×|drives with|share|Comic|comic/i.test(line)) console.log('>>', line.slice(0, 400));
  console.log('errs', errs);
  await browser.close();
})();
