const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const RF = __dirname + '/';
const PAGES = { wt: RF + 'wt/dist/preview.html', head: RF + 'head/rex-strength-lab/dist/preview.html' };
let browser;
async function open(ver, st, w) {
  if (!browser) browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: w || 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, st || {});
  await page.goto(pathToFileURL(PAGES[ver]).href);
  await page.waitForTimeout(1500);
  page._errs = errs;
  return page;
}
const bay = async (page, ms) => { await page.waitForTimeout(ms || 2500); return page.evaluate(() => document.querySelector('#bay').innerText); };
const select = (page, id, v) => page.evaluate(([id, v]) => { const s = document.getElementById(id); s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
const range = (page, id, v) => page.evaluate(([id, v]) => { const s = document.getElementById(id); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const check = (page, id, on) => page.evaluate(([id, on]) => { const s = document.getElementById(id); s.checked = on; s.dispatchEvent(new Event('change', { bubbles: true })); }, [id, on]);
const click = (page, sel) => page.click(sel);
const close = async () => { if (browser) await browser.close(); };
const grep = (t, re) => t.split('\n').filter((l) => re.test(l)).join('\n');
module.exports = { open, bay, select, range, check, click, close, grep };
