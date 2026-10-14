const fs = require('fs'), path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SRC = process.env.HTML || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html';
const html = fs.readFileSync(SRC, 'utf8');
const out = path.join(__dirname, 'wrap.html');
fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
async function open(opts) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: (opts && opts.w) || 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(out).href);
  const settle = async (id) => { for (let i = 0; i < 200; i++) { const t = await page.evaluate((x) => (document.getElementById(x) || document.body).textContent, id || 'bay'); if (!/working it out|Working out/i.test(t)) return; await page.waitForTimeout(250); } };
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle('bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(sel === '#duo-effort' ? 'duo-bay' : 'bay'); await settle('duo-bay'); };
  const text = (id) => page.evaluate((x) => document.getElementById(x).innerText, id || 'bay');
  return { browser, page, errs, settle, load, pick, text };
}
module.exports = { open };
