// node drag.js head|main '<state json>'
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const [ver, st] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((s) => localStorage.setItem('rex-lab-v1', s), st);
  await page.goto(pathToFileURL(__dirname + '/' + ver + '-preview.html').href, { timeout: 300000 });
  await page.waitForTimeout(3000);
  const ts = await page.evaluate(async () => {
    const inp = document.querySelector('#strength'); const out = [];
    for (let i = 0; i < 12; i++) {
      const v = 20 + i * 9 / 11;
      const t0 = performance.now();
      inp.value = String(v); inp.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      out.push(Math.round(performance.now() - t0));
    }
    return out;
  });
  console.log(ver, st, JSON.stringify(ts));
  await browser.close();
})();
