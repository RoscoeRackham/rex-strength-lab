// Reconstructed shared harness (the copy-lens reviewer overwrote an earlier h.js here by accident; this restores the
// API the scripts in this folder use: open, tab, settle, setEffort, text, close). Loads lab/dist/index.html.
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
let browser = null;
const PAGE = path.join(S, 'page-shared.html');
function build() {
  const html = fs.readFileSync(path.join(S, 'lab/dist/index.html'), 'utf8');
  fs.writeFileSync(PAGE, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
}
async function settle(p) {
  for (let i = 0; i < 240; i++) { const t = await p.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) break; await p.waitForTimeout(250); }
  await p.waitForTimeout(200);
}
async function open(o) {
  o = o || {};
  if (!browser) { build(); browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
  const p = await browser.newPage({ viewport: { width: o.w || 1280, height: o.h || 900 }, colorScheme: o.scheme || 'light' });
  p.errs = [];
  p.on('console', (m) => { if (m.type() === 'error') p.errs.push(m.text()); });
  p.on('pageerror', (e) => p.errs.push('PAGEERROR ' + e.message));
  await p.goto(pathToFileURL(PAGE).href);
  await p.evaluate((st) => { localStorage.clear(); if (st) localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, o.state || null);
  await p.reload();
  await p.waitForTimeout(600);
  await settle(p);
  return p;
}
async function tab(p, id, duo) {
  if (!id) return;
  if (duo) await p.evaluate(() => { const d = document.getElementById('duo'); if (d && !d.open) d.open = true; });
  await p.waitForTimeout(300);
  await p.click('#tab-' + id).catch(() => {});
  await settle(p);
}
async function setEffort(p, e, duo) { await p.selectOption(duo ? '#duo-effort' : '#effort', e); await settle(p); }
async function text(p, sel) { return p.evaluate((s) => { const n = document.querySelector(s); return n ? n.innerText : ''; }, sel); }
async function close() { if (browser) await browser.close(); browser = null; }
module.exports = { open, tab, settle, setEffort, text, close };
