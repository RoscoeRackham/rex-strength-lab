const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, s] of [[390, 844, 'light'], [390, 844, 'dark'], [1280, 900, 'dark']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: s });
    await p.goto(pathToFileURL(process.argv[2]).href);
    await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(1500);
    await p.evaluate(() => { document.getElementById('powers').open = true; });
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => { const n = document.getElementById('nkb-note'); const box = n.getBoundingClientRect(); const pw = document.getElementById('powers').getBoundingClientRect();
      const lab = ['nkb-rex', 'nkb-ollie'].map((id) => { const e = document.getElementById(id); const l = e.closest('label'); return { checked: e.checked, label: l.textContent, focusable: e.tabIndex, w: l.getBoundingClientRect().width, h: l.getBoundingClientRect().height }; });
      return { note: [box.left, box.right, pw.left, pw.right].map(Math.round), lab, over: document.documentElement.scrollWidth - document.documentElement.clientWidth, sum: document.getElementById('powers-sum').textContent }; });
    console.log(w, s, JSON.stringify(r));
    const el = await p.$('#nkb-lbl'); await el.scrollIntoViewIfNeeded();
    const f = await p.$('#powers'); await f.screenshot({ path: process.argv[3] + '/powers-' + w + '-' + s + '.png' });
  }
  await b.close();
})();
