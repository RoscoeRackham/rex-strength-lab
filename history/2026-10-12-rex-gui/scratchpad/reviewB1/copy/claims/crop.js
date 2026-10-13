const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const S = __dirname;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, scheme] of [[390, 844, 'light'], [390, 844, 'dark']]) {
    const p = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    await p.goto(pathToFileURL(path.join(S, 'page-claims.html')).href);
    await p.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ airAbsorb: 0.3 })); });
    await p.reload(); await p.waitForTimeout(800);
    await p.evaluate(() => { document.getElementById('powers').open = true; });
    await p.waitForTimeout(300);
    const elh = await p.$('#powers');
    await elh.screenshot({ path: path.join(S, 'out', `pw-${w}-${scheme}.png`) });
    const info = await p.evaluate(() => { const g = (id) => { const n = document.getElementById(id); const s = getComputedStyle(n); const r = n.getBoundingClientRect(); return { color: s.color, fs: s.fontSize, w: r.width, right: r.right }; }; return { big: g('air-absorb-big'), read: g('air-absorb-read'), slider: g('air-absorb'), ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, bg: getComputedStyle(document.body).backgroundColor }; });
    console.log(w, scheme, JSON.stringify(info));
    await p.close();
  }
  await browser.close();
})();
