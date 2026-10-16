// the copy-2 check of test/shots.js's round-1 block, verbatim predicate, on a given page
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const body = fs.readFileSync(process.argv[2], 'utf8');
  const prev = process.argv[2].replace(/\.html$/, '.c8.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 120; i++) { if (!(await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id))) return; await page.waitForTimeout(250); } };
  const load = async (st) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800); await settle('bay'); };
  const duoTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
  const r1 = [];
  for (const [lab, st] of [['Ollie bolted', { oAnchor: 'bolted' }], ['both bolted', { oAnchor: 'bolted', anchor: 'bolted' }]]) {
    await load(Object.assign({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }, st)); await settle('duo-bay');
    const box = await duoTxt('.effort-read'), it = await duoTxt('.happens'), v = await duoTxt('.verdict'), tl = await duoTxt('.tiles');
    console.log(lab, '| tiles:', tl);
    if (/nothing of the shove reaches the ground|sliding to a stop|presses into the ground under their feet|footing on both sides|either one’s footing/.test(box + it + v) || !/The one shoved still presses on the ground through his feet or bolts, a steady push/.test(box) || !/Ollie’s bolts hold, so the push presses into the ground under him, and Rex’s push back goes to the endless ocean/.test(it)) r1.push('copy-2 FAIL ' + lab);
  }
  console.log(r1.length ? r1.join('; ') : 'copy-2 check PASSES');
  await browser.close();
})();
