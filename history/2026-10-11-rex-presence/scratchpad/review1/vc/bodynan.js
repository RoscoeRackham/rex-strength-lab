const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(__dirname + '/head-preview.html').href);
  await page.waitForTimeout(2500);
  const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []);
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
  const res = [];
  for (const tab of SOLO.concat(DUO)) {
    await page.click(DUO.includes(tab) ? '#grp-duo' : '#grp-solo'); await page.click('#tab-' + tab); await page.waitForTimeout(DUO.includes(tab) ? 900 : 400);
    const b = bad(await page.evaluate(() => document.body.innerText)); if (b.length) res.push(tab + ':' + b.join(','));
  }
  console.log('body-level broken text on HEAD:', JSON.stringify(res));
  await browser.close();
})();
