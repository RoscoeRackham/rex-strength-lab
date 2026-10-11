// Shared Playwright harness: load page, drive controls, snapshot the bay.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PREVIEW = 'file://' + __dirname + '/preview.html';
async function open(opts) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: (opts && opts.w) || 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  if (opts && opts.state) await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, opts.state);
  await page.goto(PREVIEW);
  await page.waitForTimeout(300);
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
      if (cfg.angle != null && q('#angle')) { q('#angle').value = cfg.angle; fire(q('#angle'), 'input'); q('#tab-' + (cfg.tab || 'throw')).click(); }
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
        muted: all('p.muted, div.muted'),
        svg: all('svg', (n) => [...n.querySelectorAll('text')].map((x) => x.textContent).join(' | ')),
        legend: all('.ladder-legend'),
        math: all('.eq'),
        labels: all('label'),
        text: bay.innerText,
      };
    };
  });
  return { browser, page, errs };
}
module.exports = { open };
