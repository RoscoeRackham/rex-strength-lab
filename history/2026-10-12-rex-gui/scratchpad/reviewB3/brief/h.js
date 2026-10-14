// harness: node h.js cases.json  -> prints results
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const REPO = path.join(S, 'repo');
async function open() {
  const body = fs.readFileSync(path.join(REPO, 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(S, 'preview.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  const load = async (st, bay) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(700); await settle('bay'); if (st.duoOpen) await settle('duo-bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const text = (id) => page.evaluate((id) => document.getElementById(id).innerText, id || 'bay');
  const read = (id) => page.evaluate((id) => { const bay = document.getElementById(id); const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null); const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq') }; }, id || 'bay');
  return { browser, page, errs, settle, load, pick, text, read };
}
module.exports = { open };
