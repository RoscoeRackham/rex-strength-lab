// helpers: open the page with a saved state, settle, read text
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
async function open(distFile) {
  const html = fs.readFileSync(distFile || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
  const f = path.join(S, 'page-' + process.pid + '.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(f).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!busy) return true; await page.waitForTimeout(250); } return false; };
  const load = async (st, id) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(id || 'bay'); };
  const text = (sel) => page.evaluate((s) => { const n = document.querySelector(s); return n ? n.textContent.replace(/\s+/g, ' ').trim() : null; }, sel);
  const pick = async (sel, v, id) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(id || 'bay'); };
  return { browser, page, errs, settle, load, text, pick, close: async () => { await browser.close(); fs.unlinkSync(f); } };
}
module.exports = { open };
