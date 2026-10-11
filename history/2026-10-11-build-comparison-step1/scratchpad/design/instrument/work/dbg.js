const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file://' + __dirname + '/../mock.html');
  const r = await p.evaluate(() => {
    const row = document.querySelector('.row[data-id="ansur2_m_p50"]');
    const o = { row: row.getBoundingClientRect().height, gtr: getComputedStyle(row).gridTemplateRows };
    for (const c of row.children) { const bb = c.getBoundingClientRect(); o[c.className] = [Math.round(bb.top - row.getBoundingClientRect().top), Math.round(bb.height)]; }
    return o;
  });
  console.log(r); await b.close();
})();
