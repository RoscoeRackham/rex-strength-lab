const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, '..', 'dist', 'preview.html');
  fs.writeFileSync(prev, wrapped);
  const out = path.join(__dirname, '..', 'shots'); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const only = process.argv[2];
  for (const [w, h, scheme] of [[1280, 900, 'light'], [390, 844, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await page.goto('file://' + prev);
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${w}x${h} ${scheme}: overflow=${overflow}px errors=${JSON.stringify(errs.slice(0, 5))}`);
    if (!only) await page.screenshot({ path: path.join(out, `full-${w}.png`), fullPage: true });
    for (const tab of (only ? [only] : ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull'])) {
      await page.click('#tab-' + tab);
      await page.waitForTimeout(150);
      const bay = await page.$('main.panel');
      await bay.screenshot({ path: path.join(out, `${tab}-${w}.png`) });
    }
    await page.close();
  }
  await browser.close();
})();
