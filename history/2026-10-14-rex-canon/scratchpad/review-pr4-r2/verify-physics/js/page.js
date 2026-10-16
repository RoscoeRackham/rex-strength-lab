const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { ROOT } = require('./common.js');
const SCR = path.join(__dirname, '..');
async function open() {
  const html = fs.readFileSync(ROOT + '/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>';
  const f = path.join(SCR, 'page.html'); fs.writeFileSync(f, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(f).href);
  const settle = async (id) => { for (let i = 0; i < 160; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(900); await settle('bay'); if (st.duoOpen) { await page.waitForTimeout(300); await settle('duo-bay'); } };
  const pick = async (v) => { await page.selectOption('#duo-effort', v); await page.waitForTimeout(400); await settle('duo-bay'); };
  const txt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join(' / '), sel);
  const all = () => page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
  const ollieKg = async (logKg) => { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
    await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, logKg); await page.waitForTimeout(900); await settle('duo-bay'); };
  return { browser, page, load, pick, txt, all, ollieKg, errs, settle };
}
module.exports = { open };
