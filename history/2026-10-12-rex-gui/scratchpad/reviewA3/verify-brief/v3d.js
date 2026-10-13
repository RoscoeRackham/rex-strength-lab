const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const errs = [];
  for (const [w, h, scheme] of [[1280, 900, 'light'], [1280, 900, 'dark'], [390, 844, 'light'], [1920, 1300, 'light']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + D + '/fix3b.html'); await p.waitForTimeout(1500);
    await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(400);
    const s1 = await p.evaluate(() => { const m = document.querySelector('.more-below'); const r = m.getBoundingClientRect(); return { shown: getComputedStyle(m).display !== 'none', top: Math.round(r.top), bottom: Math.round(r.bottom), hscroll: document.documentElement.scrollWidth > innerWidth }; });
    if (w === 1280) await p.screenshot({ path: D + '/fix3b-' + scheme + '.png', clip: { x: 0, y: 600, width: 640, height: 300 } });
    await p.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; }); await p.waitForTimeout(300);
    const s2 = await p.evaluate(() => { const m = document.querySelector('.more-below'); return { shown: getComputedStyle(m).display !== 'none' }; });
    console.log(w + 'x' + h, scheme, JSON.stringify({ atTop: s1, atEnd: s2 }));
    await p.close();
  }
  console.log('errors', errs);
  await b.close();
})();
