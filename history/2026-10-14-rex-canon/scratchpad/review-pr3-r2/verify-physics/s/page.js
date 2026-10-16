const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const DIST = process.env.DIST || (R + '/dist/index.html');
async function settle(page, id) { for (let i = 0; i < 160; i++) { const b = await page.evaluate((id) => { const e = document.getElementById(id); return e && /working it out|Working out/i.test(e.textContent); }, id); if (!b) return; await page.waitForTimeout(250); } throw new Error('busy'); }
module.exports = async function run(cases) {
  const html = fs.readFileSync(DIST, 'utf8');
  const f = path.join(__dirname, 'page-' + process.pid + '.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(f).href);
  const out = [];
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.state);
    await page.reload(); await page.waitForTimeout(900);
    const bay = c.state.duoOpen ? 'duo-bay' : 'bay';
    await settle(page, bay);
    if (c.effort) { await page.selectOption(c.state.duoOpen ? '#duo-effort' : '#effort', c.effort); await page.waitForTimeout(400); await settle(page, bay); }
    const t = await page.evaluate((id) => document.getElementById(id).textContent.replace(/\s+/g, ' '), bay);
    out.push({ name: c.name, text: t });
  }
  await browser.close(); fs.unlinkSync(f);
  if (errs.length) console.log('ERRS', errs.slice(0, 5));
  return out;
};
