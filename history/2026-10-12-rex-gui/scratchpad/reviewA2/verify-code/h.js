const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { pathToFileURL } = require('url');
async function settle(page, id) {
  for (let i = 0; i < 160; i++) {
    const busy = await page.evaluate((id) => { const b = document.getElementById(id); return !b || /working it out|Working out/i.test(b.textContent); }, id);
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}
async function rex(page, id = 'bay') {
  return page.evaluate((id) => {
    const b = document.getElementById(id); const t = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '(none)');
    return { verdict: t(b.querySelector('.verdict')), effort: t(b.querySelector('.effort-read')).slice(0, 80) };
  }, id);
}
async function open(browser, file, state, vp = { width: 1280, height: 900 }) {
  const page = await browser.newPage({ viewport: vp });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.errs = errs;
  await page.goto(pathToFileURL(file).href);
  await page.evaluate((s) => { localStorage.clear(); if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, state);
  await page.reload();
  await page.waitForTimeout(800);
  await settle(page, 'bay'); await settle(page, 'duo-bay');
  return page;
}
module.exports = { chromium, EXE, settle, rex, open };
