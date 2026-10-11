const fs = require('fs'), path = require('path');
const root = '/home/user/dino-strength-sim';
const src = (f) => fs.readFileSync(path.join(root, 'src', f), 'utf8');
let html = src('app.html').replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js')).replace('__DINO_IMG__', '');
const out = path.join(__dirname, 'ui_f4.html');
fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + out); await page.waitForTimeout(300);
  for (const [kg, surface] of [[90718.474, 'sand'], [136077711000000, 'concrete'], [136077711000000, 'granite']]) {
    const st = { logKg: Math.log10(kg), inf: false, mode: 'comic', surface, groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45, name: '' };
    await page.evaluate((s) => localStorage.setItem('dino-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(300);
    const txt = await page.evaluate(() => {
      const q = (sel) => Array.from(document.querySelectorAll(sel)).map((n) => n.textContent.replace(/\s+/g, ' ').trim());
      return { tiles: q('#bay .tile').filter((t) => /Hole/.test(t)), happens: q('#bay .happens li').filter((t) => /punches/.test(t)) };
    });
    console.log(kg, surface, JSON.stringify(txt));
  }
  console.log('errors', errs);
  await browser.close();
})();
