const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const scenarios = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + path.join(__dirname, 'ui.html'));
  await page.waitForTimeout(300);
  for (const s of scenarios) {
    await page.evaluate((st) => { localStorage.setItem('dino-lab-v1', JSON.stringify(Object.assign({ logKg: Math.log10(511), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45, name: '' }, st))); }, s);
    await page.reload(); await page.waitForTimeout(250);
    const txt = await page.evaluate(() => {
      const q = (sel) => Array.from(document.querySelectorAll(sel)).map((n) => n.textContent.trim());
      return { verdict: q('#bay .verdict'), status: q('#bay .status'), tiles: q('#bay .tile').map((t) => t.replace(/\s+/g, ' ')), callout: q('#bay .callout'), happens: q('#bay .happens li'), hint: q('#mode-hint') };
    });
    console.log('\n### ' + JSON.stringify(s)); console.log(JSON.stringify(txt, null, 1));
  }
  console.log('page errors:', errs);
  await browser.close();
})();
