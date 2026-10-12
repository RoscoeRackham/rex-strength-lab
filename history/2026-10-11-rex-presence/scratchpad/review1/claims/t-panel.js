const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(__dirname + '/snap2/dist/preview.html').href);
  await page.waitForTimeout(600);
  await page.evaluate(() => { document.getElementById('comic-setup').open = true; });
  for (const [id, v] of [['sw-silent', true], ['sw-soft', true]]) await page.evaluate(([id, v]) => { const e = document.getElementById(id); e.checked = v; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
  await page.evaluate(() => { const e = document.getElementById('absorb'); e.value = 'gradual'; e.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.waitForTimeout(400);
  console.log(await page.evaluate(() => document.getElementById('comic-setup').innerText));
  console.log('---- sources/assumptions with presence:');
  const t = await page.evaluate(() => document.body.innerText);
  const i = t.indexOf('Effort is not strength');
  console.log(t.slice(i - 200, i + 300));
  await browser.close();
})();
