// code-2: round 2's scenario (typed, uncommitted distance in the element, then a resize): does Rex's bay get drawn
// while two-player mode is on, and does it keep its effort box?
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const V = __dirname;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const name of process.argv.slice(2)) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(pathToFileURL(V + '/pages/' + name + '.html').href);
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', action: 'throw' })));
    await page.reload();
    await page.waitForFunction(() => { const b = document.getElementById('duo-bay'); return b && b.querySelector('.verdict') && !/working it out/i.test(b.textContent); }, null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    const before = await page.evaluate(() => ({ rexEffort: !!document.querySelector('#bay .effort-read'), rexVerdict: (document.querySelector('#bay .verdict') || {}).textContent }));
    await page.evaluate(() => { const d = document.querySelector('#duo-bay details.effort-adjust'); if (d) d.open = true; });
    await page.focus('#duo-near'); await page.keyboard.press('Control+A'); await page.keyboard.type('50');
    await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(1500);
    const r = await page.evaluate(() => ({ nested: window.__nested || 0, near: JSON.parse(localStorage.getItem('rex-lab-v1')).near, rexEffortBox: !!document.querySelector('#bay .effort-read'), rexVerdict: ((document.querySelector('#bay .verdict') || {}).textContent || '').slice(0, 60) }));
    console.log(name.padEnd(8), 'before', JSON.stringify(before).slice(0, 90), '\n         after ', JSON.stringify(r), errs.length ? 'ERRS ' + errs : '');
    await page.close();
  }
  await browser.close();
})();
