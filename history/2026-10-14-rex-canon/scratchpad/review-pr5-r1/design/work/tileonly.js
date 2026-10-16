const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
const list = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pg.goto(url);
  for (const [nm, st, eff] of list) {
    await loadOn(pg, st, eff);
    const r = await pg.evaluate((d) => { const b = document.getElementById(d ? 'duo-bay' : 'bay'); const t = b.querySelector('.tile.shimmer'); const h = document.getElementById('hero-glow'), c = document.querySelector('#duo-bay .glow');
      return { tile: t ? Array.from(t.children).map((x) => x.textContent.replace(/ /g, ' ')).join(' || ') : null, hero: h.hidden ? 0 : +h.dataset.strength, col: c ? (c.hidden ? 0 : +c.dataset.strength) : null, verdict: (b.querySelector('.verdict') || {}).textContent }; }, !!st.duoOpen);
    console.log('## ' + nm + '\n   verdict: ' + r.verdict + '\n   tile: ' + r.tile + '\n   hero ' + r.hero + ' col ' + r.col);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
