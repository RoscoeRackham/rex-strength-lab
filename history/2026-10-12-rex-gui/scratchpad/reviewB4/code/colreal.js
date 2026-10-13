// Collide, Rex bolted, Ollie's charge, 'Break the ground' with Unbreakable footing on: what the effort box says vs the tab
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
async function settle(page, id) { for (let i = 0; i < 400; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => console.log('ERR', e.message));
  await page.goto(pathToFileURL('pages/branch.html').href);
  for (const st of JSON.parse(process.argv[2] || '[{}]')) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true, duoAction: 'collide', anchor: 'bolted' }, st));
    await page.reload(); await page.waitForTimeout(500); await settle(page, 'duo-bay');
    await page.selectOption('#duo-effort', process.argv[3] || 'ground'); await page.waitForTimeout(400); await settle(page, 'duo-bay');
    const r = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const t = (n) => n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; return { eff: t(b.querySelector('.effort-read')), verdict: t(b.querySelector('.verdict')), chips: Array.from(b.querySelectorAll('.status-row .status')).map(t), happens: Array.from(b.querySelectorAll('.happens li')).map(t).filter((x) => /ground|quake|push/i.test(x)) }; });
    console.log(JSON.stringify(st)); console.log(JSON.stringify(r, null, 1));
  }
  await browser.close();
})();
