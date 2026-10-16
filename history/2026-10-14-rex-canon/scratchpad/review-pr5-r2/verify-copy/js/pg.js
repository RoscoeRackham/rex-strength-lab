// usage: node pg.js '<json state>' [effort] [regex to extract]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..', 'repo', 'rex-strength-lab');
(async () => {
  const st = JSON.parse(process.argv[2]), effort = process.argv[3] || 'allout', re = process.argv[4] ? new RegExp(process.argv[4], 'g') : null;
  const html = fs.readFileSync(path.join(REPO, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'prev.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto(pathToFileURL(prev).href);
  const settled = (id) => pg.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
  await pg.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await pg.reload();
  await settled('bay'); if (st.duoOpen) await settled('duo-bay');
  const bay = st.duoOpen ? 'duo-bay' : 'bay';
  if (effort !== 'none') {
    const sel = st.duoOpen ? '#duo-effort' : '#effort';
    await pg.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay);
    await pg.selectOption(sel, effort);
    await pg.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 30, timeout: 60000 });
    await settled(bay);
  }
  const out = await pg.evaluate((b) => {
    const t = document.getElementById(b), sh = Array.from(t.querySelectorAll('.tile.shimmer')).map((x) => x.textContent.replace(/\s+/g, ' '));
    return { text: t.textContent.replace(/ /g, ' ').replace(/\s+/g, ' '), shimmer: sh, cards: (document.body.textContent || '').replace(/ /g, ' ').replace(/\s+/g, ' ') };
  }, bay);
  console.log('TILES:', JSON.stringify(out.shimmer));
  if (re) { const m = out.text.match(re); console.log('MATCH:', m ? m.join('\n---\n') : '(none)'); }
  else console.log('TEXT:', out.text.slice(0, 6000));
  if (process.env.CARDS) { const m = out.cards.match(new RegExp(process.env.CARDS, 'g')); console.log('CARDS:', m ? m.join('\n---\n') : '(none)'); }
  if (errs.length) console.log('ERRS', errs);
  await browser.close();
})();
