const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DIR = __dirname;
async function open() {
  const body = fs.readFileSync(path.join(DIR, 'lab', 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(DIR, 'preview.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle('bay'); if (st.duoOpen) await settle('duo-bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const text = (id) => page.evaluate((x) => document.getElementById(x).textContent.replace(/\s+/g, ' '), id);
  const items = (id) => page.evaluate((x) => { const b = document.getElementById(x); const t = (n) => n.textContent.replace(/\s+/g, ' ').trim(); return { verdict: b.querySelector('.verdict') ? t(b.querySelector('.verdict')) : null, status: Array.from(b.querySelectorAll('.status-row .status')).map(t), effort: Array.from(b.querySelectorAll('.effort-read')).map(t), happens: Array.from(b.querySelectorAll('.happens li')).map(t), callouts: Array.from(b.querySelectorAll('.callout')).map(t), math: Array.from(b.querySelectorAll('details.math .eq')).map(t), tiles: Array.from(b.querySelectorAll('.tile')).map(t) }; }, id);
  return { browser, page, errs, settle, load, pick, text, items };
}
module.exports = { open };
