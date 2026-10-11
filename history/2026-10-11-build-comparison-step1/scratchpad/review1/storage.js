'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const init = () => { Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('The operation is insecure.', 'SecurityError'); } }); };
  const { ctx, p, errs } = await open(browser, { w: 390, h: 844, fonts: false, init });
  const r = await p.evaluate(() => ({ figs: document.querySelectorAll('.fig').length, fp: document.querySelectorAll('.fp-row').length, val: document.getElementById('validation').textContent.slice(0, 60) }));
  await p.click('#hReal'); await p.click('#zHum');
  console.log('blocked storage:', JSON.stringify(r), 'errors:', JSON.stringify(errs), 'pressed after clicks:', await p.evaluate(() => [document.getElementById('hReal').getAttribute('aria-pressed'), document.getElementById('zHum').getAttribute('aria-pressed')]));
  await ctx.close();
  // persistence works when available
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await ctx2.newPage();
  const url = require('./lib').writeWrapped(null);
  await p2.goto(url); await p2.waitForTimeout(500);
  await p2.click('#vSide'); await p2.click('#zHum');
  await p2.reload(); await p2.waitForTimeout(800);
  console.log('after reload:', await p2.evaluate(() => [document.getElementById('vSide').getAttribute('aria-pressed'), document.getElementById('zHum').getAttribute('aria-pressed'), document.getElementById('modeNote').textContent.slice(0, 40)]));
  await ctx2.close(); await browser.close();
})();
