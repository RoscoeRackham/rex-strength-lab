const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/physics/repo/rex-strength-lab';
const page0 = path.join(__dirname, 'page.html');
async function open() {
  const html = fs.readFileSync(path.join(REPO, 'dist', 'index.html'), 'utf8');
  fs.writeFileSync(page0, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('file://' + page0);
  await page.waitForTimeout(500);
  return { browser, page, errs };
}
async function settle(page, id) {
  for (let i = 0; i < 300; i++) {
    const busy = await page.evaluate((id) => { const b = document.getElementById(id); return !b || /working it out|Working out/i.test(b.textContent); }, id || 'duo-bay');
    if (!busy) return;
    await page.waitForTimeout(100);
  }
}
async function load(page, st, oLog, extra) {
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true, saveV: 3 }, st));
  await page.reload();
  await page.waitForTimeout(700);
  if (oLog != null) {
    await page.evaluate(() => document.getElementById('o-own').click());
    await page.waitForTimeout(200);
    if (oLog === Infinity) await page.evaluate(() => { const e = document.getElementById('o-inf'); e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true })); });
    else await page.evaluate((v) => { const e = document.getElementById('o-strength'); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, oLog);
    await page.waitForTimeout(400);
  }
  if (extra) await extra(page);
  await page.waitForTimeout(300);
  await settle(page, 'bay');
  await settle(page, 'duo-bay');
}
const text = (page, id) => page.evaluate((id) => document.getElementById(id).innerText, id || 'duo-bay');
module.exports = { open, settle, load, text };
