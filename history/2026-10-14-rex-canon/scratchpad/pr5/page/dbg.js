const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(pathToFileURL(path.join(__dirname, 'preview-look.html')).href);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ saveV: 3, action: 'throw', inf: true })));
  await page.reload(); await page.waitForTimeout(1500);
  console.log(await page.evaluate(() => { const g = document.getElementById('hero-glow'), cs = getComputedStyle(g), i = g.querySelector('i'), ci = getComputedStyle(i);
    return { hidden: g.hidden, st: g.dataset.strength, op: cs.opacity, disp: cs.display, blend: cs.mixBlendMode, n: g.children.length, rect: JSON.stringify(g.getBoundingClientRect()), irect: JSON.stringify(i.getBoundingClientRect()), ibg: ci.backgroundImage.slice(0, 80), itf: ci.transform, iop: ci.opacity, anim: ci.animationName, style: i.getAttribute('style') }; }));
  await browser.close();
})();
