const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [st, act] of [[{ group: 'duo', duoAction: 'arm' }, 'own'], [{ group: 'duo', duoAction: 'collide' }, 'own'], [{ group: 'duo', duoAction: 'arm' }, 'custom']]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, st);
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(__dirname + '/snap2/dist/preview.html').href);
    await page.waitForTimeout(600);
    if (act === 'own') {
      await page.evaluate(() => { const e = document.getElementById('o-effort-own'); e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true })); });
      await page.waitForTimeout(600);
      await page.evaluate(() => { const e = document.getElementById('o-effort-use'); e.value = 5; e.dispatchEvent(new Event('input', { bubbles: true })); });
      await page.waitForTimeout(1200);
    } else {
      await page.evaluate(() => { const e = document.getElementById('duo-effort-use'); e.value = 4.5; e.dispatchEvent(new Event('input', { bubbles: true })); });
      await page.waitForTimeout(1200);
    }
    const t = await page.evaluate(() => [...document.querySelectorAll('#bay .effort-read, #bay > .verdict, #bay .status-row')].map((e) => e.innerText.replace(/\n+/g, ' | ')).join('\n'));
    console.log('=====', JSON.stringify(st), act, '\n' + t);
    await ctx.close();
  }
  await browser.close();
})();
