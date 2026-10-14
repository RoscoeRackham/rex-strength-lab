// The shots.js two-player break-the-ground check, and a near = 3 m jump case, on a page
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
async function settle(page, id) { for (let i = 0; i < 600; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of process.argv.slice(2)) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(f).href);
    const run = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'duo-bay'); await page.selectOption('#duo-effort', 'ground'); await page.waitForTimeout(300); await settle(page, 'duo-bay'); return page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' ')); };
    const dg = await run({ duoOpen: true, duoAction: 'collide', anchor: 'bolted' });
    const shotsPass = /set aside for this test/.test(dg) && /Effort: /.test(dg) && /The least effort that breaks the ground/.test(dg) && !/Least disruptive already does this/.test(dg) && /On real ground, courtesy ceiling: .*?Past that, the ground breaks under Rex/.test(dg);
    const j = await run({ duoOpen: true, duoAction: 'collide', anchor: 'friction', colSrc: 'jump', logKg: 6.25, near: 3 });
    console.log(f, '| shots check passes:', shotsPass, '| near 3 m jump ceiling:', (j.match(/On real ground, courtesy ceiling:[^.]*\.[^.]*\./) || [j.slice(0, 200)])[0]);
    await page.close();
  }
  await browser.close();
})();
