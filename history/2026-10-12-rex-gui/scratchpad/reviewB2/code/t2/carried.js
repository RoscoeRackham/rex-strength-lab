const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(S + '/pagecmp/branch.html').href);
  for (const st of [{ cObj: 'baseball', cStyle: 'hard', cLogD: 2, logKg: Math.log10(1.81436948e23) }, { cObj: 'baseball', cStyle: 'hard', cLogD: 4.3, logKg: Math.log10(1.81436948e23) }, { cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 25 }]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ duoOpen: true, duoAction: 'catch' }, st));
    await page.reload(); await page.waitForTimeout(800);
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(500);
    for (let i = 0; i < 200; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)); if (!busy) break; await page.waitForTimeout(250); }
    const t = await page.evaluate(() => { const d = document.getElementById('duo-bay'); return { v: d.querySelector('.verdict').textContent, chips: Array.from(d.querySelectorAll('.status-row')).map((n) => n.textContent).join(' | '), tiles: Array.from(d.querySelectorAll('.tiles')).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' | '), bad: (d.textContent.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []).join(',') }; });
    console.log(JSON.stringify(st), '\n', JSON.stringify(t, null, 1));
  }
  console.log('errors', errs);
  await browser.close();
})();
