const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const DIR = __dirname;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file://' + path.join(DIR, 'pages', 'branch.html'));
    await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const r = (s) => { const n = document.querySelector(s); if (!n) return null; const b = n.getBoundingClientRect(); return { top: Math.round(b.top + scrollY), left: Math.round(b.left), w: Math.round(b.width), h: Math.round(b.height) }; };
      return {
        sum: document.getElementById('duo-sum').textContent, sumRect: r('#duo-sum'), summary: r('#duo > summary'), main: r('main.panel'), duo: r('#duo'), aside: r('aside'),
        powersSum: document.getElementById('powers-sum').textContent, setupSum: document.getElementById('setup-sum').textContent,
        setupOpen: document.getElementById('setup').open, powersOpen: document.getElementById('powers').open, duoOpen: document.getElementById('duo').open,
        tabsLabel: document.getElementById('tabs').getAttribute('aria-label'), duoTabsLabel: document.getElementById('duo-tabs').getAttribute('aria-label'),
        mainLabel: document.querySelector('main').getAttribute('aria-label'),
        lh: parseFloat(getComputedStyle(document.getElementById('duo-sum')).lineHeight),
      };
    });
    console.log(w, JSON.stringify(info, null, 1));
    await page.screenshot({ path: path.join(DIR, `look-${w}-closed.png`), fullPage: true });
    await page.click('#duo > summary'); await page.waitForTimeout(2500);
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('ollie-setup').open = true; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(DIR, `look-${w}-open.png`), fullPage: true });
    const duoShot = await page.$('#duo');
    await duoShot.screenshot({ path: path.join(DIR, `look-${w}-duo.png`) });
    const aside = await page.$('aside');
    await aside.screenshot({ path: path.join(DIR, `look-${w}-aside.png`) });
    console.log('errors', errs);
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
