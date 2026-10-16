const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url'), path = require('path');
const { settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/code/repo/rex-strength-lab/test/make-page-fixture.js');
const U = (n) => pathToFileURL(path.join(__dirname, n + '.html')).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(U('pr3'));
  for (const lg of [4, 5, 6, 7, 8, 9]) for (const d of [1, 2, 3]) {
    const st = { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: d, safePassenger: true, logKg: lg, airAbsorb: 0, keepForm: false };
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'duo-bay');
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(400); await settle(page, 'duo-bay');
    const t = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    const chips = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .status-row')).map((n) => n.textContent).join(' / '));
    const miss = (t.match(/If Ollie misses[^]*?shakes it\./) || [''])[0];
    const heat = (t.match(/[^.]*(?:melt|burn|char|scorch)[^.]*\./gi) || []).slice(0, 3).join(' ');
    console.log('lg', lg, 'D 10^' + d, '| chips:', chips.slice(0, 250), '| miss:', miss.slice(0, 200), '| heat:', heat.slice(0, 400));
  }
  console.log('errors', errs);
  await browser.close();
})();
