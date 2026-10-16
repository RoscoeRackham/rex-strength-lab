// node timing.js <dist html> <label> : wall time from reload to settled (both bays), and for picking presets, per state
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const file = process.argv[2], label = process.argv[3] || '';
  const prev = path.join(__dirname, 'pages', 'timing-' + label + '.html');
  fs.mkdirSync(path.dirname(prev), { recursive: true });
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(file, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const busy = () => page.evaluate(() => /working it out|Working out/i.test((document.getElementById('bay') || {}).textContent + ' ' + ((document.getElementById('duo-bay') || {}).textContent || '')));
  const waitSettled = async () => { await page.waitForTimeout(30); for (let i = 0; i < 1200; i++) { if (!(await busy())) return; await page.waitForTimeout(25); } };
  const CASES = [
    ['catch default', { duoOpen: true, duoAction: 'catch' }],
    ['catch real muscle', { duoOpen: true, duoAction: 'catch', mode: 'real' }],
    ['catch car fastball real', { duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', mode: 'real' }],
    ['catch bus hard 10 m', { duoOpen: true, duoAction: 'catch', cObj: 'bus', cStyle: 'hard', cLogD: 1 }],
    ['catch partner', { duoOpen: true, duoAction: 'catch', cObj: 'partner' }],
    ['catch 1e20 baseball', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 20 }],
    ['wrestle shove', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove' }],
    ['wrestle throw', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw' }],
    ['throw default', { action: 'throw' }],
    ['throw bolted real inf', { action: 'throw', anchor: 'bolted', mode: 'real', inf: true }],
  ];
  const PICKS = [['catch car fastball real', 'ground'], ['catch default', 'plaster'], ['catch default', 'allout'], ['wrestle shove', 'plaster'], ['wrestle throw', 'ground'], ['catch partner', 'ground']];
  const reps = Number(process.argv[4] || 3), out = {};
  for (let k = 0; k < reps; k++) {
    for (const [name, st] of CASES) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
      const t0 = Date.now(); await page.reload(); await page.waitForLoadState('load'); await waitSettled();
      (out[name] = out[name] || []).push(Date.now() - t0);
    }
    for (const [name, preset] of PICKS) {
      const st = CASES.find((c) => c[0] === name)[1];
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
      await page.reload(); await page.waitForLoadState('load'); await waitSettled();
      const t0 = Date.now(); await page.selectOption('#duo-effort', preset); await waitSettled();
      (out[name + ' -> ' + preset] = out[name + ' -> ' + preset] || []).push(Date.now() - t0);
    }
  }
  for (const [k, v] of Object.entries(out)) console.log(label.padEnd(8), k.padEnd(40), v.join(' / '), 'ms; median', v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)]);
  await browser.close();
})();
