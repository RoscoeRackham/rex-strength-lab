const { wrap, S } = require('./h.js');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const url = wrap(S + '/lab/dist/index.html', 'branch.html');
  for (const [label, st, byHand] of [['saved open, catch', { duoOpen: true, duoAction: 'catch' }, false], ['saved open, arm', { duoOpen: true, duoAction: 'arm' }, false], ['opened by hand, catch', { duoOpen: false, duoAction: 'catch' }, true]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript(() => {
      window.__frames = [];
      const rec = () => {
        const d = document.getElementById('duo'), b = document.getElementById('duo-bay');
        if (d) window.__frames.push({ t: Math.round(performance.now()), open: d.open, kids: b.children.length, txt: b.textContent.slice(0, 30), sel: (document.querySelector('#duo-tabs [aria-selected="true"]') || {}).id || null });
        requestAnimationFrame(rec);
      };
      requestAnimationFrame(rec);
    });
    await page.goto(url);
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload();
    await page.waitForTimeout(byHand ? 1500 : 3000);
    if (byHand) { await page.evaluate(() => { window.__frames = []; }); await page.click('#duo > summary'); await page.waitForTimeout(3000); }
    const f = await page.evaluate(() => window.__frames);
    const openFrames = f.filter((x) => x.open);
    const empty = openFrames.filter((x) => x.kids === 0);
    const firstContent = openFrames.find((x) => x.kids > 0);
    const firstReal = openFrames.find((x) => x.sel);
    console.log(label + ': open frames ' + openFrames.length + ', open-and-empty frames ' + empty.length + (empty.length ? ' (t=' + empty[0].t + '..' + empty[empty.length - 1].t + ')' : '') + '; first content ' + JSON.stringify(firstContent) + '; first tab selected ' + JSON.stringify(firstReal && { t: firstReal.t, sel: firstReal.sel, txt: firstReal.txt }));
    await page.close();
  }
  await browser.close();
})();
