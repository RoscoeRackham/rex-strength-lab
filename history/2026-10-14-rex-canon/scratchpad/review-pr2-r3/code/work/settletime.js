const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const html = process.argv[2];
  const prev = path.join(path.dirname(html), 'preview-st-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const busy = (b) => page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), b);
  const wait = async (b) => { const t0 = Date.now(); while (await busy(b)) await page.waitForTimeout(50); return Date.now() - t0; };
  for (const [lab, st, pick] of [
    ['baseball 1e20 100 km plaster', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 5, logKg: 20 }, 'plaster'],
    ['partner toss 1e15 plaster', { duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg: 15 }, 'plaster'],
    ['shove inf real rock plaster', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted', unbreakable: false }, 'plaster'],
    ['fastball 1e20 plasma allout', { duoOpen: true, duoAction: 'catch', cStyle: 'hard', logKg: 20, keepForm: false, airAbsorb: 0.5 }, 'allout'],
    ['semi default', { duoOpen: true, duoAction: 'catch', cObj: 'semi' }, null],
    ['catch car 1e10 block', { duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 10 }, 'block'],
  ]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    const t0 = Date.now(); await page.reload(); await page.waitForTimeout(800); const a = await wait('duo-bay'); const tLoad = Date.now() - t0;
    let tp = 0; if (pick) { const t1 = Date.now(); await page.selectOption('#duo-effort', pick); await page.waitForTimeout(300); await wait('duo-bay'); tp = Date.now() - t1; }
    console.log(lab.padEnd(32), 'load+settle', tLoad, 'ms; pick+settle', tp, 'ms');
  }
  await browser.close(); fs.unlinkSync(prev);
})();
