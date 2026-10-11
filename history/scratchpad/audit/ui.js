// Usage: node ui.js '<json state>' [tab]  -> prints bay text
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
async function run(states) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const out = [];
  for (const st of states) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file://' + path.join(__dirname, 'page.html'));
    await page.evaluate((s) => localStorage.setItem('dino-lab-v1', JSON.stringify(s)), st);
    await page.reload();
    await page.waitForTimeout(400);
    const txt = await page.evaluate(() => document.querySelector('#bay').innerText);
    out.push({ st, txt, errs });
    await ctx.close();
  }
  await browser.close();
  return out;
}
module.exports = { run };
if (require.main === module) {
  const states = JSON.parse(process.argv[2]);
  run(Array.isArray(states) ? states : [states]).then((res) => { for (const r of res) { console.log('=== STATE', JSON.stringify(r.st)); console.log(r.txt); if (r.errs.length) console.log('ERRORS', r.errs); } });
}
