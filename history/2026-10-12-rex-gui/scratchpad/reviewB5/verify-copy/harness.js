const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const pg = path.join(DIR, 'page.html');
fs.writeFileSync(pg, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
async function idle(page) {
  for (let i = 0; i < 400; i++) {
    const busy = await page.evaluate(() => /working it out|Working out/i.test(document.body.innerText));
    if (!busy) return true; await page.waitForTimeout(250);
  }
  return false;
}
module.exports = async function (cases) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(pg).href);
  const out = {};
  for (const c of cases) {
    const duo = !SOLO.includes(c.tab);
    const st = Object.assign({}, c.state, duo ? { duoOpen: true, duoAction: c.tab } : { action: c.tab });
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload(); await page.waitForTimeout(400); await idle(page);
    if (c.pre) { await page.evaluate(c.pre); await page.waitForTimeout(400); await idle(page); }
    if (c.pick) { await page.selectOption(duo ? '#duo-effort' : '#effort', c.pick); await page.waitForTimeout(400); await idle(page); }
    if (c.after) { await page.evaluate(c.after); await page.waitForTimeout(400); await idle(page); }
    await page.evaluate(() => document.querySelectorAll('details').forEach((d) => d.open = true));
    const id = duo ? 'duo-bay' : 'bay';
    const t = await page.evaluate((id) => document.getElementById(id).innerText, id);
    const eff = await page.evaluate((duo) => { const e = document.querySelector(duo ? '#duo-effort-box, .duo-effort' : '#effort-box, .effort-box'); return e ? e.innerText : ''; }, duo);
    out[c.id] = { bay: t, eff };
    if (c.shot) await page.screenshot({ path: path.join(DIR, c.id + '.png'), fullPage: true });
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
  return out;
};
