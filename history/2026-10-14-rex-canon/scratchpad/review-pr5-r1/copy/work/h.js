// harness: node h.js scenarios.json out.json [width]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const { pathToFileURL } = require('url');
(async () => {
  const scen = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const width = Number(process.argv[4] || 1280);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(path.join(__dirname, 'preview.html')).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const out = [];
  for (const s of scen) {
    const st = Object.assign({ saveV: 3 }, s.st);
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload();
    await settled('bay'); if (st.duoOpen) await settled('duo-bay');
    const bay = st.duoOpen ? 'duo-bay' : 'bay';
    if (s.effort && s.effort !== 'least' && await page.$(st.duoOpen ? '#duo-effort' : '#effort')) {
      const sel = st.duoOpen ? '#duo-effort' : '#effort';
      await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay);
      await page.selectOption(sel, s.effort);
      await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 50, timeout: 60000 });
      await settled(bay);
    }
    if (s.click) { await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay); await page.click(s.click); await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 50, timeout: 60000 }); await settled(bay); }
    const r = await page.evaluate((b) => {
      const tx = (n) => n.textContent.replace(/ /g, ' ');
      const box = document.getElementById(b);
      const tiles = Array.from(box.querySelectorAll('.tile.shimmer')).map((t) => ({ k: tx(t.querySelector('.k')), v: tx(t.querySelector('.v')), s: Array.from(t.querySelectorAll('.s')).map(tx), last: t.parentElement.lastElementChild === t }));
      const hg = document.getElementById('hero-glow');
      const cg = document.querySelector('#duo-bay .glow');
      const verdict = box.querySelector('.verdict') ? tx(box.querySelector('.verdict')) : null;
      const items = Array.from(box.querySelectorAll('.happens li')).map(tx);
      const callouts = Array.from(box.querySelectorAll('.callout')).map(tx);
      const otherTiles = Array.from(box.querySelectorAll('.tile:not(.shimmer)')).map((t) => tx(t).replace(/\s+/g, ' '));
      return { tiles, hero: hg ? { hidden: hg.hidden, s: hg.dataset.strength } : null, col: cg ? { hidden: cg.hidden, s: cg.dataset.strength } : null, verdict, items, callouts, otherTiles, scrollW: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    }, bay);
    out.push(Object.assign({ name: s.name }, r));
    process.stderr.write('.');
  }
  out.push({ errs });
  fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
