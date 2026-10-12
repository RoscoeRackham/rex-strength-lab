const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PREV = pathToFileURL(__dirname + '/preview.html').href;
const OUT = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review1/';
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
// open a page; theme: undefined (follow scheme) or 'dark'/'light' set as data-theme on <html> before scripts run
async function open(browser, w, h, scheme, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  if (opts.theme) await page.addInitScript((t) => { document.documentElement.setAttribute('data-theme', t); }, opts.theme);
  if (opts.storage) await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, opts.storage);
  await page.goto(PREV);
  await page.waitForTimeout(opts.wait || 1500);
  return { ctx, page, errs };
}
// in-page audit helpers
const AUDIT = `
window.__lum = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); const a = p.length > 3 ? p[3] : 1; const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return { L: 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]), a, rgb: p.slice(0,3) }; };
window.__bg = (el) => { let stack = []; for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); const b = s.backgroundColor; const l = __lum(b); if (l && l.a > 0) { stack.push(l); if (l.a >= 1) break; } } if (!stack.length) return __lum(getComputedStyle(document.body).backgroundColor); let base = stack.pop(); let rgb = base.rgb; while (stack.length) { const top = stack.pop(); rgb = rgb.map((v, i) => top.rgb[i] * top.a + v * (1 - top.a)); } return __lum('rgb(' + rgb.join(',') + ')'); };
window.__ratio = (a, b) => { const x = Math.max(a, b), y = Math.min(a, b); return (x + 0.05) / (y + 0.05); };
window.__textAudit = (root) => { const out = []; const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = walker.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const e = n.parentElement; if (!e || e.closest('[hidden]') ) continue; const r = e.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue; const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') continue; let fs = parseFloat(s.fontSize); const svg = e.closest('svg'); if (svg) { const vb = svg.viewBox && svg.viewBox.baseVal; if (vb && vb.width) fs = fs * svg.getBoundingClientRect().width / vb.width; } let col = s.color; if (svg) col = s.fill; const fg = __lum(col); const bg = __bg(e); let op = 1; for (let q = e; q; q = q.parentElement) op *= Number(getComputedStyle(q).opacity); const ratio = fg && bg ? __ratio(fg.L, bg.L) : null; out.push({ t: t.slice(0, 50), tag: e.tagName, cls: e.getAttribute('class'), fs: Math.round(fs * 10) / 10, ratio: ratio && Math.round(ratio * 100) / 100, bold: Number(s.fontWeight) >= 700, op, col, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }); } return out; };
`;
module.exports = { launch, open, AUDIT, OUT, PREV };
