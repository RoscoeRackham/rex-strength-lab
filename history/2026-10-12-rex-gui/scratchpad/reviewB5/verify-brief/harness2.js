const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
async function open() {
  const body = fs.readFileSync(path.join(DIR, 'copy2/rex-strength-lab/dist/index.html'), 'utf8');
  const prev = path.join(DIR, 'page.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => { const n = document.getElementById(id); return !n || /working it out|Working out/i.test(n.textContent); }, id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  const load = async (st, bay) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(1000); await settle(bay || 'bay'); };
  const pick = async (sel, v, bay) => { await page.selectOption(sel, v); await page.waitForTimeout(400); await settle(bay || (sel === '#duo-effort' ? 'duo-bay' : 'bay')); };
  const slide = async (id, v, bay) => { await page.evaluate(([id, v]) => { const s = document.getElementById(id); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]); await page.waitForTimeout(800); await settle(bay || 'bay'); };
  const text = (id) => page.evaluate((id) => document.getElementById(id).innerText, id || 'bay');
  return { browser, page, load, pick, slide, text, settle, errs };
}
module.exports = { open };
