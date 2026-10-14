// usage: node page.js '<json state>' [effortValue] [duoEffortValue] [outname]
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const dir = __dirname;
const file = path.join(dir, 'page.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
async function run(st, effort, duoEffort, out, extra) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', s); } catch (e) {} }, JSON.stringify(st));
  await page.goto('file://' + file);
  const waitDone = async () => {
    for (let i = 0; i < 600; i++) {
      const t = await page.evaluate(() => document.body.innerText);
      if (!/working it out|Working out/i.test(t)) return;
      await page.waitForTimeout(250);
    }
  };
  await waitDone();
  if (effort) { await page.selectOption('#effort', effort); await page.waitForTimeout(300); await waitDone(); }
  if (duoEffort) { await page.selectOption('#duo-effort', duoEffort); await page.waitForTimeout(300); await waitDone(); }
  if (extra) { await extra(page); await waitDone(); }
  const text = await page.evaluate(() => document.body.innerText);
  if (out) fs.writeFileSync(path.join(dir, out + '.txt'), text);
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
  return text;
}
module.exports = { run };
if (require.main === module) {
  const st = JSON.parse(process.argv[2]);
  run(st, process.argv[3], process.argv[4], process.argv[5] || 'out').then(t => console.log(t.length));
}
