const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await pg.goto(pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href);
  await pg.evaluate(() => localStorage.clear()); await pg.reload(); await pg.waitForTimeout(1500);
  for (let i = 0; i < 40; i++) {
    await pg.keyboard.press('Tab');
    const r = await pg.evaluate(() => { const a = document.activeElement, aside = document.querySelector('.panel-controls'); if (!aside.contains(a)) return null; const b = a.getBoundingClientRect(), c = document.getElementById('more-below').getBoundingClientRect(), box = aside.getBoundingClientRect(); const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      return { id: a.id || a.tagName + ':' + a.textContent.slice(0, 20), top: Math.round(b.top), bottom: Math.round(b.bottom), cueTop: Math.round(c.top), cueBottom: Math.round(c.bottom), boxBottom: Math.round(box.bottom), scrollTop: aside.scrollTop, winY: scrollY, covered: !!hit && !!hit.closest('#more-wrap'), wrapHidden: document.getElementById('more-wrap').hidden }; });
    if (r) console.log(JSON.stringify(r));
  }
  await browser.close();
})();
