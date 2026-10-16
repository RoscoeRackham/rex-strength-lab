// quick look at the shimmer tile and glow in a set of states. node smoke.js [dist path]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dist = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html';
const prev = path.join(__dirname, 'preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + fs.readFileSync(dist, 'utf8') + '</body></html>');
const STATES = JSON.parse(process.env.STATES || '[]');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  for (const st of STATES) {
    const { pick, label, act, ...s } = st;
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, s)); await page.reload(); await settled('bay'); if (s.duoOpen) await settled('duo-bay');
    if (st.act) { await page.evaluate(st.act); await page.waitForTimeout(300); await settled(s.duoOpen ? 'duo-bay' : 'bay'); }
    if (pick) { const sel = s.duoOpen ? '#duo-effort' : '#effort'; await page.selectOption(sel, pick); await page.waitForTimeout(200); await settled(s.duoOpen ? 'duo-bay' : 'bay'); }
    const r = await page.evaluate((duo) => {
      const bay = document.getElementById(duo ? 'duo-bay' : 'bay');
      const t = bay.querySelector('.tile.shimmer');
      const row = t && t.parentElement;
      const hg = document.getElementById('hero-glow'), cg = document.querySelector('#duo-bay .glow');
      return { tile: t ? Array.from(t.children).map((n) => n.textContent.replace(/ /g, ' ')).join(' | ') : null, last: t ? row.lastElementChild === t : null, rowKeys: row ? Array.from(row.querySelectorAll('.k')).map((k) => k.textContent).join(', ') : null,
        hero: hg.hidden ? 0 : Number(hg.dataset.strength), col: cg ? (cg.hidden ? 0 : Number(cg.dataset.strength)) : null, verdict: (bay.querySelector('.verdict') || {}).textContent };
    }, !!s.duoOpen);
    console.log('== ' + (label || JSON.stringify(st)));
    console.log(JSON.stringify(r, null, 1));
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
