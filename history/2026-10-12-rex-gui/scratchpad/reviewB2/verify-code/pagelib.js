const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
async function open(htmlPath) {
  const body = fs.readFileSync(htmlPath || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const f = path.join(__dirname, 'page-' + process.pid + '.html'); fs.writeFileSync(f, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(f).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('still working'); };
  const load = async (st, bay) => { await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(x)); }, st); await page.reload(); await page.waitForTimeout(800); await settle(bay || 'bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const text = (id) => page.evaluate((id) => document.getElementById(id).textContent.replace(/\s+/g, ' '), id);
  const close = async () => { await browser.close(); fs.unlinkSync(f); };
  return { page, browser, errs, settle, load, pick, text, close };
}
module.exports = { open };
