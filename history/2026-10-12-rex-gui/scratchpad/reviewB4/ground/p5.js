const fs = require('fs'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB4/ground/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(S + 'preview.html').href);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 13, duoOpen: true, duoAction: 'arm' })));
  await page.reload(); await page.waitForTimeout(1500);
  await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(800);
  await page.evaluate(() => { const d = document.querySelector('#duo-bay details.effort-adjust'); if (d) d.open = true; });
  await page.click('#o-effort-own'); await page.waitForTimeout(800);
  await page.evaluate(() => { const s = document.getElementById('o-effort-use'); s.value = '12.5'; s.dispatchEvent(new Event('input', { bubbles: true })); });
  for (let i = 0; i < 60; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/.test(t)) break; await page.waitForTimeout(1000); }
  await page.waitForTimeout(1500);
  const t = await page.evaluate(() => document.querySelector('#duo-bay').innerText);
  console.log(t.split('\n').filter(l => /quake|shake|net push|plaster|sound|harm|At this|ceiling|pin/i.test(l)).join('\n'));
  await browser.close();
})();
