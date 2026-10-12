const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 844 } });
    await page.goto(pathToFileURL(__dirname + '/preview.html').href);
    await page.waitForTimeout(2500);
    const res = [];
    const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
    for (const tab of SOLO.concat(DUO)) { await page.click(DUO.includes(tab) ? '#grp-duo' : '#grp-solo'); await page.click('#tab-' + tab); await page.waitForTimeout(DUO.includes(tab) ? 900 : 400); res.push(tab + ':' + await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)); }
    console.log(w, res.join(' '));
    await page.close();
  }
  await browser.close();
})();
