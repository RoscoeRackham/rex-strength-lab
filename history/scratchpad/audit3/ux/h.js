const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PREVIEW = 'file://' + __dirname + '/preview.html';
let browser;
async function B() { if (!browser) browser = await chromium.launch(Object.assign({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }, process.env.FONTS && process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {})); return browser; }
async function open(opts) {
  opts = opts || {};
  const b = await B();
  const ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport: { width: opts.w || 1280, height: opts.h || 900 }, colorScheme: opts.scheme || 'light', hasTouch: !!opts.touch, isMobile: !!opts.mobile, deviceScaleFactor: opts.dpr || 1, reducedMotion: opts.reducedMotion || 'no-preference' });
  if (opts.state !== undefined) await ctx.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', typeof s === 'string' ? s : JSON.stringify(s)); } catch (e) {} }, opts.state);
  if (opts.init) await ctx.addInitScript(opts.init);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(PREVIEW);
  await page.waitForTimeout(opts.wait == null ? 400 : opts.wait);
  await page.evaluate(() => {
    window.__set = function (cfg) {
      const q = (s) => document.querySelector(s);
      const fire = (n, ev) => n.dispatchEvent(new Event(ev, { bubbles: true }));
      if (cfg.size != null) { const b = [...document.querySelectorAll('#size-chips .chip')].find((x) => Number(x.dataset.h) === cfg.size); b.click(); }
      if (cfg.mode) q('#mode-' + cfg.mode).click();
      if (cfg.surface) { q('#surface').value = cfg.surface; fire(q('#surface'), 'change'); }
      if (cfg.groundHolds != null) { q('#ground-holds').checked = cfg.groundHolds; fire(q('#ground-holds'), 'change'); }
      if (cfg.anchor) { q('#anchor').value = cfg.anchor; fire(q('#anchor'), 'change'); }
      if (cfg.chip) { [...document.querySelectorAll('#tier-chips .chip')].find((x) => x.dataset.id === cfg.chip).click(); }
      else if (cfg.log != null) { q('#strength').value = cfg.log; fire(q('#strength'), 'input'); }
      if (cfg.tab) q('#tab-' + cfg.tab).click();
      if (cfg.obj && q('#obj')) { q('#obj').value = cfg.obj; fire(q('#obj'), 'change'); }
      if (cfg.angle != null && q('#angle')) { q('#angle').value = cfg.angle; fire(q('#angle'), 'input'); }
    };
    window.__snap = function () {
      const bay = document.querySelector('#bay');
      const t = (n) => (n ? n.textContent.trim() : null);
      const all = (sel, f) => [...bay.querySelectorAll(sel)].map(f || t);
      return {
        dial: [t(document.querySelector('#dial-big')), t(document.querySelector('#dial-force')), t(document.querySelector('#dial-who'))],
        verdict: t(bay.querySelector('.verdict')),
        chips: all('.status'),
        tiles: all('.tile', (n) => [t(n.querySelector('.k')), t(n.querySelector('.v')), t(n.querySelector('.s'))]),
        happens: all('.happens li'),
        callouts: all('.callout'),
        svg: all('svg', (n) => [...n.querySelectorAll('text')].map((x) => x.textContent).join(' | ')),
        aria: all('svg', (n) => n.getAttribute('aria-label')),
        math: all('.eq'),
      };
    };
  });
  return { page, ctx, errs };
}
async function close() { if (browser) await browser.close(); browser = null; }
module.exports = { open, close, B };
