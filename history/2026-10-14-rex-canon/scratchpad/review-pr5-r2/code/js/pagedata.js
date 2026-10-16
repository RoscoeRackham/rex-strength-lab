// render a dist/index.html and read the shimmer card, two tiles and the glows: node pagedata.js <dist/index.html> <tag>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync(process.argv[2], 'utf8');
const prev = path.join(__dirname, '..', 'pd-' + (process.argv[3] || 'x') + '.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const settle = (b) => page.waitForFunction((x) => { const e = document.getElementById(x); return e && e.children.length > 0 && !/working it out|Working out/i.test(e.textContent); }, b, { timeout: 60000 });
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ saveV: 3 }, x))), st); await page.reload(); await settle(st.duoOpen ? 'duo-bay' : 'bay'); await page.waitForTimeout(200); };
  const tile = (b) => page.evaluate((x) => { const t = document.querySelector('#' + x + ' .tile.shimmer'); return t ? t.textContent.replace(/ /g, ' ') : null; }, b);
  const card = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#assume > div')).find((d) => /The shimmer: what they take in shows/.test(d.textContent)); return b ? b.textContent.replace(/ /g, ' ') : null; });
  const m = card && card.match(/The level runs on a log scale[^]*?Past the flare/);
  console.log('CARD:', m ? m[0] : card);
  await load({ action: 'throw', obj: 'person', angle: 45 });
  console.log('THROW person least:', await tile('bay'), '| hero strength', await page.$eval('#hero-glow', (x) => x.dataset.strength));
  await load({ duoOpen: true, duoAction: 'collide', colWho: 'ollie', colSrc: 'set', colGB: -3, duoEffort: 'allout' });
  console.log('COLLIDE 0.1% c:', await tile('duo-bay'), '| glow strength', await page.$eval('#duo-bay .glow', (x) => x.dataset.strength));
  await browser.close();
})();
