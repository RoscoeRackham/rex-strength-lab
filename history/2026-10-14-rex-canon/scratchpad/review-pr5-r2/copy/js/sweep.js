// Round 2 copy lens: load many page states, dump the Shimmer tile(s), the header and Collide glow, and the bay text
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const HERE = __dirname, LAB = path.join(HERE, '..', 'repo', 'rex-strength-lab');
const html = fs.readFileSync(path.join(LAB, 'dist', 'index.html'), 'utf8');
const prev = path.join(HERE, '..', 'page.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false, silentStrike: false, softLanding: false };
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const STATES = JSON.parse(process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : '[]');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: Number(process.env.W || 1280), height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const out = [];
  for (const [label, st0, effort] of STATES) {
    const st = Object.assign({ saveV: 3 }, st0.off ? OFF : {}, st0);
    delete st.off; const click = st.click; delete st.click;
    await page.evaluate((x) => { localStorage.clear(); if (x) localStorage.setItem('rex-lab-v1', JSON.stringify(x)); }, label === 'DEFAULT' ? null : st);
    await page.reload();
    await settled('bay'); if (st.duoOpen) await settled('duo-bay');
    const bay = st.duoOpen ? 'duo-bay' : 'bay';
    if (click) { await page.evaluate(([b, c]) => { for (const n of document.getElementById(b).children) n.r5old = true; document.getElementById(c).click(); }, [bay, click]); await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 50, timeout: 60000 }); await settled(bay); }
    if (effort) {
      const sel = st.duoOpen ? '#duo-effort' : '#effort';
      await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, bay);
      await page.selectOption(sel, effort);
      await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 50, timeout: 60000 });
      await settled(bay);
    }
    const res = await page.evaluate((b) => {
      const tx = (n) => n.textContent.replace(/ /g, ' ');
      const box = document.getElementById(b);
      const tiles = Array.from(box.querySelectorAll('.tile.shimmer')).map((t) => ({ last: t.parentElement.lastElementChild === t, v: tx(t.querySelector('.v')), s: Array.from(t.querySelectorAll('.s')).map(tx) }));
      const hg = document.getElementById('hero-glow'); const cg = box.querySelector('.art-figure .glow');
      return { tiles, hero: { hidden: hg.hidden, s: hg.dataset.strength }, col: cg ? { hidden: cg.hidden, s: cg.dataset.strength } : null, verdict: (box.querySelector('.verdict') || { textContent: '' }).textContent, text: tx(box).replace(/\s+/g, ' ') };
    }, bay);
    if (label === 'DEFAULT') { res.cards = await page.evaluate(() => Array.from(document.querySelectorAll('#assume > div')).map((d) => d.textContent.replace(/\u00a0/g, ' '))); res.hintText = await page.evaluate(() => document.getElementById('absorb-hint').textContent); }
    out.push(Object.assign({ label, effort: effort || 'default' }, res));
    console.log('=== ' + label + ' [' + (effort || 'default') + ']  hero ' + JSON.stringify(res.hero) + (res.col ? ' col ' + JSON.stringify(res.col) : ''));
    console.log('    verdict: ' + res.verdict.slice(0, 300));
    for (const t of res.tiles) console.log('    TILE (last ' + t.last + ') ' + t.v + ' | ' + t.s.join(' | '));
    if (!res.tiles.length) console.log('    (no tile)');
  }
  fs.writeFileSync(path.join(HERE, '..', process.env.OUT || 'sweep.json'), JSON.stringify(out, null, 1));
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
