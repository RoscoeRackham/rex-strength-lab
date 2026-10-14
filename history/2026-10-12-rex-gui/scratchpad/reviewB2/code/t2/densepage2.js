const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [file, extra] of [['branch.html', {}]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(S + '/pagecmp/' + file).href);
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 2, logKg: 14, oM: 1e18, surface: 'concrete', anchor: 'bolted', oAnchor: 'bolted' }, extra));
    await page.reload(); await page.waitForTimeout(1000);
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(500);
    for (let i = 0; i < 200; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)); if (!busy) break; await page.waitForTimeout(250); }
    const t = await page.evaluate(() => { const d = document.getElementById('duo-bay'); const all = d.textContent.replace(/\s+/g, ' '); return { v: (d.querySelector('.verdict') || {}).textContent, chips: Array.from(d.querySelectorAll('.status-row')).map((n) => n.textContent).join(' | '), stop: (all.match(/(Stopping it puts|It hits Ollie with)[^.]*\./) || [''])[0], first: (all.match(/Catching is stopping momentum[^.]*\./) || [''])[0], tiles: Array.from(d.querySelectorAll('.tiles')).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' | ').slice(0, 400) }; });
    console.log(file, JSON.stringify(extra), '\n', JSON.stringify(t, null, 1));
    await page.close();
  }
  await browser.close();
})();
