const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const n of ['branch', 'main']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file://' + path.join(__dirname, 'pages', n + '.html'));
    await page.evaluate((n) => localStorage.setItem('rex-lab-v1', JSON.stringify(n === 'branch' ? { duoOpen: true, duoAction: 'arm' } : { group: 'duo', duoAction: 'arm' })), n);
    await page.reload(); await page.waitForTimeout(3000);
    const sel = n === 'branch' ? '#powers > summary' : '#comic-setup > summary';
    const target = n === 'branch' ? '#duo-bay' : '#bay';
    for (const frac of [0, 0.3, 0.6]) {
      const r = await page.evaluate(({ sel, target, frac }) => {
        const t = document.querySelector(target); const tb = t.getBoundingClientRect();
        window.scrollTo(0, tb.top + scrollY + frac * tb.height);
        const p = document.querySelector(sel).getBoundingClientRect(), a = document.querySelector('aside').getBoundingClientRect(), b = document.querySelector('#bolt-rex, #anchor');
        const bb = b ? b.getBoundingClientRect() : null;
        return { scrollY: Math.round(scrollY), asideTop: Math.round(a.top), asideBottom: Math.round(a.bottom), panelSummaryTop: Math.round(p.top), boltTop: bb ? Math.round(bb.top) : null, vh: innerHeight };
      }, { sel, target, frac });
      console.log(n, 'scrolled into the two-player results at', frac, JSON.stringify(r));
    }
    await page.close();
  }
  await browser.close();
})();
