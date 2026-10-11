const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, name] of [[1280, 900, '1280-modes'], [390, 844, '390-modes']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file://' + path.resolve(__dirname, '../mock.html'), { waitUntil: 'networkidle' });
    await p.click('#c-zoom button[data-v="zoom"]');
    await p.click('#c-size button[data-v="real"]');
    await p.click('#c-view button[data-v="side"]');
    await p.waitForTimeout(200);
    const el = await p.$('#h-rank');
    await el.scrollIntoViewIfNeeded();
    const box = await p.evaluate(() => { const r = document.querySelector('.rank').getBoundingClientRect(); return { y: r.top + window.scrollY, h: r.height }; });
    await p.screenshot({ path: path.resolve(__dirname, `../${name}.png`), fullPage: true, clip: { x: 0, y: box.y, width: w, height: Math.min(box.h, w < 500 ? 2600 : 2400) } });
    const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bad: /NaN|undefined|Infinity/.test(document.body.innerText) }));
    console.log(name, JSON.stringify(info), errs.length ? errs : 'ok');
    await p.close();
  }
  await b.close();
})();
