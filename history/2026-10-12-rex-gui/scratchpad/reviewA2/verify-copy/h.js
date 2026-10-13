// usage: node h.js <page: new|main> '<json state>' <which: solo|duo> [more states...]
// Loads the page with the given saved state, waits for the effort search, prints the bay text.
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const V = __dirname;
const SRC = { new: path.join(V, 'proj/rex-strength-lab/dist/index.html'), main: path.join(V, 'main-index.html') };
function wrap(which) {
  const out = path.join(V, 'wrap-' + which + '.html');
  if (!fs.existsSync(out)) fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(SRC[which], 'utf8') + '</body></html>');
  return 'file://' + out;
}
async function run(page, which, state, bay) {
  const url = wrap(which);
  await page.goto(url);
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, state);
  await page.goto(url);
  const sel = bay === 'duo' ? (which === 'main' ? '#bay' : '#duo-bay') : '#bay';
  for (let i = 0; i < 600; i++) {
    const t = await page.evaluate((sel) => (document.querySelector(sel) || {}).innerText || '', sel);
    if (t && !/working it out/i.test(t)) break;
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(300);
  // open all math/details inside the bay so their text is in innerText
  await page.evaluate((sel) => { document.querySelectorAll(sel + ' details').forEach((d) => { d.open = true; }); }, sel);
  return page.evaluate((sel) => document.querySelector(sel).innerText, sel);
}
module.exports = { run, wrap };
if (require.main === module) {
  (async () => {
    const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
    const [which, st, bay] = process.argv.slice(2);
    console.log(await run(page, which, JSON.parse(st), bay));
    await browser.close();
  })();
}
