// usage: node page.js '<json state>' [allout] [bay]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
const html = fs.readFileSync(process.env.DIST || path.join(D, 'repo/rex-strength-lab/dist/index.html'), 'utf8');
const prev = path.join(D, (process.env.TAG || 'p') + '-preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  const st = JSON.parse(process.argv[2]);
  await page.evaluate(s => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await page.reload(); await page.waitForTimeout(1200);
  const bay = process.argv[4] || (st.duoOpen ? 'duo-bay' : 'bay');
  const settle = async () => { for (let i = 0; i < 200; i++) { const busy = await page.evaluate(id => /working it out|Working out/i.test(document.getElementById(id).textContent), bay); if (!busy) return; await page.waitForTimeout(250); } };
  await settle();
  if (process.argv[3] === 'allout') { await page.selectOption(bay === 'duo-bay' ? '#duo-effort' : '#effort', 'allout'); await page.waitForTimeout(800); await settle(); }
  const r = await page.evaluate(id => { const bay = document.getElementById(id); const txt = n => n ? n.textContent.replace(/\s+/g, ' ').trim() : null; const all = s => Array.from(bay.querySelectorAll(s)).map(txt);
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout') }; }, bay);
  console.log(JSON.stringify(r, null, 1)); if (errs.length) console.log('ERRS', errs);
  await b.close();
})();
