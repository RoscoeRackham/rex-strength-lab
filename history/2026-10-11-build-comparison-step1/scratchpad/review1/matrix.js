'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
function audit() {
  const out = {};
  const de = document.documentElement;
  out.sw = de.scrollWidth; out.iw = window.innerWidth; out.cw = de.clientWidth;
  // elements whose right edge passes the viewport (visible ones)
  out.overflow = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect(); if (!r.width) return;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (el.closest('.sr,[hidden]')) return;
    if (r.right > de.clientWidth + 0.5 || r.left < -0.5) {
      // ignore if inside an overflow:auto/hidden ancestor that is within bounds
      let a = el.parentElement, clipped = false;
      while (a && a !== document.body) { const c = getComputedStyle(a); if (/(auto|hidden|scroll|clip)/.test(c.overflowX)) { const ar = a.getBoundingClientRect(); if (ar.right <= de.clientWidth + 0.5) { clipped = true; break; } } a = a.parentElement; }
      if (!clipped) out.overflow.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + String(el.className.baseVal != null ? el.className.baseVal : el.className).split(' ')[0]) + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
    }
  });
  // small text everywhere
  out.small = {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = walker.nextNode())) {
    const s = n.textContent.trim(); if (!s) continue;
    const el = n.parentElement; if (!el || el.closest('.sr, title, script, style, [hidden], details:not([open]) > :not(summary)')) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    let px = parseFloat(cs.fontSize);
    if (el instanceof SVGElement) { const ctm = el.getScreenCTM(); if (ctm) px *= Math.hypot(ctm.a, ctm.b); }
    if (px < 10.95) { const k = px.toFixed(1) + ' ' + (el.tagName.toLowerCase() + '.' + String(el.className.baseVal != null ? el.className.baseVal : el.className).split(' ')[0]); out.small[k] = (out.small[k] || 0) + 1; }
  }
  const d = document.getElementById('drawer');
  const dr = d.getBoundingClientRect();
  out.drawer = { hidden: d.hidden, display: getComputedStyle(d).display, h: Math.round(dr.height), top: Math.round(dr.top + scrollY), parent: d.parentElement.tagName + '#' + d.parentElement.id };
  const y = (id) => { const e = document.getElementById(id); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
  out.pos = { lineup: y('lineup'), firstStop: (document.querySelector('.stop') || {}).id, firstFig: Math.round(document.querySelector('.fig').getBoundingClientRect().top + scrollY), rexStop: y('rex-and-ollie'), rexFig: Math.round(document.querySelector('.fig[data-id="rex"]').getBoundingClientRect().top + scrollY), toScale: y('to-scale'), total: de.scrollHeight, vh: innerHeight };
  out.locH = Math.round(document.getElementById('locator').getBoundingClientRect().height);
  out.fpAxisH = Math.round(document.getElementById('fpAxis').getBoundingClientRect().height);
  // overlap among absolutely positioned labels in a container
  function overlaps(sel, scope) {
    const res = [];
    document.querySelectorAll(scope).forEach((host) => {
      const els = Array.from(host.querySelectorAll(sel)).filter((e) => e.getBoundingClientRect().width);
      const hr = host.getBoundingClientRect();
      for (let i = 0; i < els.length; i++) {
        const a = els[i].getBoundingClientRect();
        if (a.left < hr.left - 0.5 || a.right > hr.right + 0.5) res.push('out of host: "' + els[i].textContent + '" ' + Math.round(a.left - hr.left) + '..' + Math.round(a.right - hr.left) + ' / ' + Math.round(hr.width));
        for (let j = i + 1; j < els.length; j++) {
          const b = els[j].getBoundingClientRect();
          if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) res.push('"' + els[i].textContent + '" x "' + els[j].textContent + '"');
        }
      }
    });
    return res;
  }
  out.ov = {
    glanceTl: overlaps('.tl', '#glance'), locTl: overlaps('.tl', '#locTape'), clusters: overlaps('button', '#clusters'),
    gap: overlaps('.post,.mark,.lab,.end', '.gaptile'), fpAxis: overlaps('.lbls span, .tp b', '#fpAxis'),
  };
  // cluster buttons vs glance tape labels region
  // forest row: name vs value overlap
  out.fpRows = [];
  document.querySelectorAll('.fp-row').forEach((r) => { const nm = r.querySelector('.nm'), vl = r.querySelector('.vl'); if (!nm || !vl) return; const a = nm.getBoundingClientRect(), b = vl.getBoundingClientRect(); if (a.right > b.left + 0.5 && a.top < b.bottom && b.top < a.bottom && b.width) out.fpRows.push(nm.textContent.slice(0, 30)); if (vl.scrollWidth > vl.clientWidth + 1) out.fpRows.push('vl overflow ' + vl.textContent); });
  // text clipped: elements with scrollWidth > clientWidth and overflow hidden
  out.clipped = [];
  document.querySelectorAll('.plate .n, .plate .s, .plate .w, .plate .f, .chip, .seg button, .clusters button, .tag, .stop h3').forEach((e) => { if (e.scrollWidth > e.clientWidth + 1 && e.clientWidth) out.clipped.push(e.className + ' "' + e.textContent.slice(0, 30) + '" ' + e.scrollWidth + '>' + e.clientWidth); });
  // chips overflowing their plate
  document.querySelectorAll('.fig').forEach((f) => { const fr = f.getBoundingClientRect(); f.querySelectorAll('.plate *').forEach((c) => { const r = c.getBoundingClientRect(); if (r.width && (r.right > fr.right + 0.5 || r.left < fr.left - 0.5)) out.clipped.push('fig ' + f.dataset.id + ': ' + c.className + ' "' + c.textContent.slice(0, 25) + '" ' + Math.round(r.right - fr.right)); }); });
  return out;
}
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const res = {};
  for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1280, 900]]) {
    for (const [scheme, theme] of [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']]) {
      const key = w + 'x' + h + ' ' + scheme + (theme ? ' data-theme=' + theme : '');
      const { ctx, p, errs } = await open(browser, { w, h, scheme, theme, dpr: w < 500 ? 2 : 1 });
      const a = await p.evaluate(audit);
      a.errs = errs;
      res[key] = a;
      if (!theme || w === 390) await p.screenshot({ path: path.join(DIR, 'm-' + w + '-' + scheme + (theme ? '-dt' + theme : '') + '.png'), fullPage: false });
      if (w === 390 && !theme) await p.screenshot({ path: path.join(DIR, 'full-' + w + '-' + scheme + '.png'), fullPage: true });
      await ctx.close();
      console.log(key, JSON.stringify(a));
    }
  }
  await browser.close();
  require('fs').writeFileSync(path.join(DIR, 'matrix.json'), JSON.stringify(res, null, 1));
})();
