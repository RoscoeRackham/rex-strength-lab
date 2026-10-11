const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + path.join(__dirname, 'ui.html'));
  const base = { inf: false, mode: 'comic', groundHolds: false, anchor: 'friction', H: 2, m: 180, obj: 'car', angle: 45, name: '' };
  const sc = [
    { action: 'stomp', surface: 'sand', logKg: Math.log10(100 * 907.18474) },
    { action: 'stomp', surface: 'sand', logKg: Math.log10(150e9 * 907.18474) },
    { action: 'jump', surface: 'sand', logKg: Math.log10(10 * 907.18474) },
    { action: 'jump', surface: 'sand', logKg: Math.log10(100 * 907.18474) },
  ];
  for (const s of sc) {
    await page.evaluate((st) => localStorage.setItem('dino-lab-v1', JSON.stringify(st)), Object.assign({}, base, s));
    await page.reload(); await page.waitForTimeout(300);
    const txt = await page.evaluate(() => { const q = (sel) => Array.from(document.querySelectorAll(sel)).map((n) => n.textContent.trim().replace(/\s+/g, ' ')); return { verdict: q('#bay .verdict'), tiles: q('#bay .tile'), happens: q('#bay .happens li') }; });
    console.log('\n### ' + JSON.stringify(s)); console.log(JSON.stringify(txt, null, 1));
  }
  console.log('page errors:', errs); await browser.close();
})();
