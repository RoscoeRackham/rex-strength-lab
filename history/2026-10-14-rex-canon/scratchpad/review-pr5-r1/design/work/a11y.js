const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const fs = require('fs');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const gb01 = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const scheme of ['light', 'dark']) {
    const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await pg.goto(url);
    await loadOn(pg, DUO({ action: 'stomp', logKg: 9, duoAction: 'collide', colSrc: 'set', colGB: gb01 }), 'allout');
    await pg.selectOption('#effort', 'allout'); await pg.waitForTimeout(500); await settledOn(pg, 'bay'); await settledOn(pg, 'duo-bay');
    const contrast = await pg.evaluate(() => {
      const parse = (c) => c.match(/[\d.]+/g).map(Number);
      const lum = (c) => { const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const bgOf = (n) => { while (n) { const c = getComputedStyle(n).backgroundColor; const p = parse(c); if (p.length < 4 || p[3] > 0) return p; n = n.parentElement; } return [255, 255, 255]; };
      const out = [];
      for (const t of document.querySelectorAll('.tile.shimmer')) for (const c of t.children) {
        const fg = parse(getComputedStyle(c).color), bg = bgOf(c); const L1 = lum(fg), L2 = lum(bg); out.push({ cls: c.className, fg: getComputedStyle(c).color, bg: 'rgb(' + bg.slice(0, 3).join(',') + ')', ratio: +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2), fs: getComputedStyle(c).fontSize });
      }
      // other tile for comparison
      const o = document.querySelector('#bay .tile:not(.shimmer)');
      const markup = Array.from(document.querySelectorAll('.tile.shimmer')).map((t) => t.tagName + '[' + Array.from(t.attributes).map((a) => a.name + '=' + a.value).join(' ') + '] > ' + Array.from(t.children).map((c) => c.tagName + '.' + c.className).join(','));
      const other = o.tagName + '[' + Array.from(o.attributes).map((a) => a.name + '=' + a.value).join(' ') + '] > ' + Array.from(o.children).map((c) => c.tagName + '.' + c.className).join(',');
      // focusable inside glow layers
      const foc = Array.from(document.querySelectorAll('.glow, .glow *')).filter((n) => n.tabIndex >= 0 || n.matches('a,button,input,select,textarea,[tabindex]'));
      const glows = Array.from(document.querySelectorAll('.glow')).map((g) => ({ ah: g.getAttribute('aria-hidden'), pe: getComputedStyle(g).pointerEvents, hidden: g.hidden, iPe: g.firstElementChild && getComputedStyle(g.firstElementChild).pointerEvents }));
      // elementFromPoint over an eye: does the glow catch the click?
      const hb = document.getElementById('hero-art').getBoundingClientRect();
      const hit = document.elementFromPoint(hb.x + 0.421 * hb.width, hb.y + 0.192 * hb.height);
      return { out, markup, other, foc: foc.length, glows, hit: hit && (hit.tagName + '.' + hit.className) };
    });
    console.log(scheme, JSON.stringify(contrast, null, 0));
    const a1 = await pg.locator('#bay').ariaSnapshot(); const a2 = await pg.locator('#duo-bay').ariaSnapshot(); const a3 = await pg.locator('header.hero').ariaSnapshot();
    if (scheme === 'light') {
      const pick = (a) => a.split('\n').filter((l) => /Shimmer|taken in|scalding|Rex: |Canon gives|faint glow|about a glow/i.test(l)).join('\n');
      console.log('--- solo aria:\n' + pick(a1)); console.log('--- duo aria:\n' + pick(a2)); console.log('--- header aria:\n' + a3.slice(0, 400));
      // tile order in row
      const rows = await pg.evaluate(() => Array.from(document.querySelectorAll('.tile.shimmer')).map((t) => Array.from(t.parentElement.children).map((c) => c.querySelector('.k') ? c.querySelector('.k').textContent : '?').join(' | ')));
      console.log('rows:', rows.join('\n'));
    }
    await pg.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
