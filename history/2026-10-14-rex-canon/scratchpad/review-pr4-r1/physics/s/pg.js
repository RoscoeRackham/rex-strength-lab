const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/physics/repo/rex-strength-lab';
const OUT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/physics/page.html';
async function open() {
  const body = fs.readFileSync(path.join(R, 'dist', 'index.html'), 'utf8');
  fs.writeFileSync(OUT, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(OUT).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((x) => { const e = document.getElementById(x); return !e || /working it out|Working out/i.test(e.textContent); }, id); if (!busy) return; await page.waitForTimeout(250); } };
  const load = async (st, id) => { await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st); await page.reload(); await page.waitForTimeout(1500); await settle(id || 'duo-bay'); await page.waitForTimeout(300); await settle(id || 'duo-bay'); };
  const text = (id) => page.evaluate((x) => document.getElementById(x).innerText, id || 'duo-bay');
  return { browser, page, load, text, errs, settle };
}
module.exports = { open };
