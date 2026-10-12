// node drive.js '<state json>' [effort] [regex]; env ABSORB, W
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const url = pathToFileURL(__dirname + '/preview.html').href;
const st = JSON.parse(process.argv[2]);
const effort = process.argv[3];
const re = process.argv[4] ? new RegExp(process.argv[4], 'i') : null;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: Number(process.env.W || 1280), height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript((s) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('seeded', '1'); } }, st);
  await page.goto(url);
  const settle = async () => { for (let i = 0; i < 600; i++) { const p = await page.evaluate(() => /Working out|working it out/i.test(document.querySelector('#bay').textContent)); if (!p) return; await page.waitForTimeout(100); } };
  await settle();
  if (effort && effort !== '-') { await page.selectOption(st.group === 'duo' ? '#duo-effort' : '#effort', effort); await settle(); }
  if (process.env.ABSORB) { await page.evaluate((v) => { const s = document.querySelector('#absorb'); s.value = v; s.dispatchEvent(new Event('change')); }, process.env.ABSORB); await settle(); }
  await page.waitForTimeout(300);
  const parts = await page.evaluate(() => [...document.querySelectorAll('#bay p, #bay li, #bay .tile, #bay .verdict, #bay .callout, #bay summary')].map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
  const seen = new Set();
  for (const t of parts) { if (seen.has(t)) continue; seen.add(t); if (!re || re.test(t)) console.log('- ' + t.slice(0, 700)); }
  if (process.env.EVAL) console.log('EVAL', JSON.stringify(await page.evaluate(process.env.EVAL)));
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
