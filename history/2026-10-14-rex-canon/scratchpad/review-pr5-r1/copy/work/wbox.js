const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'); const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(path.join(__dirname, 'preview.html')).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ saveV: 3, action: 'weight' })));
  await page.reload(); await settled('bay');
  await page.click('#grow-what-krakatoa'); await page.waitForTimeout(800); await settled('bay');
  console.log(await page.evaluate(() => { const b = document.querySelector('#bay .growth-whatif'); return Array.from(b.children).map((c) => '[' + c.tagName + '.' + c.className + '] ' + c.textContent.replace(/ /g, ' ').slice(0, 300)).join('\n'); }));
  console.log('HINT:', await page.evaluate(() => { const h = document.getElementById('absorb-hint'); return h ? h.textContent + ' | visible:' + (h.offsetParent !== null) : null; }));
  // jump soft landing callout and tile together
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ saveV: 3, action: 'jump', softLanding: true })));
  await page.reload(); await settled('bay');
  console.log(await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile.shimmer, #bay .callout')).map((n) => n.textContent.replace(/ /g, ' ')).join('\n')));
  await browser.close();
})();
