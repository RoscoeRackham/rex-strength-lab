const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const widths = (process.argv[2] || '390').split(',').map(Number);
const modes = (process.argv[3] || 'comic,real').split(',');
const extra = process.argv[4] ? JSON.parse(process.argv[4]) : {};
const tag = process.argv[5] || 'x';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const results = {};
  for (const w of widths) for (const mode of modes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    await ctx.addInitScript((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ mode }, extra));
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file://' + __dirname + '/preview.html');
    await page.waitForTimeout(800);
    for (const action of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
      await page.click('#tab-' + action);
      const objs = await page.evaluate(() => document.querySelector('#obj') ? [...document.querySelectorAll('#obj option')].map(o => o.value) : [null]);
      for (const obj of objs) {
        if (obj) await page.selectOption('#obj', obj);
        for (const lg of [1, 2.708, 4, 6, 9, 12, 16, 20, 24, 28, 31, 34, 'inf']) {
          const r = await page.evaluate((lg) => {
            if (lg === 'inf') { [...document.querySelectorAll('#tier-chips .chip')].find(c => c.textContent === '∞').click(); }
            else { const s = document.querySelector('#strength'); s.value = lg; s.dispatchEvent(new Event('input')); }
            const out = [];
            const bay = document.querySelector('#bay');
            const txt = bay.innerText + ' ' + [...bay.querySelectorAll('[aria-label]')].map(n => n.getAttribute('aria-label')).join(' ') + ' ' + document.querySelector('#dial-big').textContent + ' ' + document.querySelector('#dial-force').textContent + ' ' + document.querySelector('#dial-who').textContent;
            for (const bad of ['NaN', 'undefined', 'Infinity', 'null', '−∞', '[object']) if (txt.includes(bad)) { const i = txt.indexOf(bad); out.push('BADTEXT ' + bad + ': "' + txt.slice(Math.max(0, i - 50), i + 30).replace(/\n/g, ' / ') + '"'); }
            for (const svg of bay.querySelectorAll('svg')) {
              const sr = svg.getBoundingClientRect(); if (sr.width < 30) continue;
              const vb = svg.viewBox.baseVal;
              if (vb && vb.width && Math.abs(vb.width - sr.width) > 2) out.push('SCALED svg vb ' + vb.width + ' drawn ' + Math.round(sr.width) + ' (' + (svg.getAttribute('aria-label') || '').slice(0, 20) + ')');
              for (const t of svg.querySelectorAll('text')) { const q = t.getBoundingClientRect(); if (!q.width) continue; if (q.left < sr.left - 1 || q.right > sr.right + 1 || q.top < sr.top - 1 || q.bottom > sr.bottom + 1) out.push('SVGCLIP "' + t.textContent + '" ' + (q.left < sr.left - 1 ? 'L' + Math.round(q.left - sr.left) : q.right > sr.right + 1 ? 'R+' + Math.round(q.right - sr.right) : 'V')); }
              const ts = [...svg.querySelectorAll('text')].map(t => [t, t.getBoundingClientRect()]).filter(x => x[1].width);
              for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) { const a = ts[i][1], b = ts[j][1]; const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 2 && oy > 3) out.push('OVERLAP "' + ts[i][0].textContent + '" x "' + ts[j][0].textContent + '"'); }
              // text over bars
              const bars = [...svg.querySelectorAll('rect')].map(r => r.getBoundingClientRect()).filter(r => r.width > 4 && r.height > 8 && r.height < 30);
              for (const [t, q] of ts) for (const b of bars) { const ox = Math.min(q.right, b.right) - Math.max(q.left, b.left), oy = Math.min(q.bottom, b.bottom) - Math.max(q.top, b.top); if (ox > 3 && oy > 4) out.push('TEXT-ON-BAR "' + t.textContent + '"'); }
            }
            for (const e of bay.querySelectorAll('.tile .v, .tile .s, .status, .verdict, .tile .k')) {
              const tn = [...e.childNodes].find(n => n.nodeType === 3); if (!tn) continue;
              const txt = tn.textContent; let prevTop = null; const rg = document.createRange();
              for (let i = 0; i < txt.length; i++) { rg.setStart(tn, i); rg.setEnd(tn, i + 1); const rc = rg.getClientRects()[0]; if (!rc) continue; if (prevTop != null && rc.top > prevTop + 4) { const a = txt[i - 1], b = txt[i]; if (!/[\s\-–—·\/(]/.test(a) && !/\s/.test(b)) out.push('MIDBREAK [' + e.className + '] "' + txt.slice(Math.max(0, i - 12), i) + '|' + txt.slice(i, i + 12) + '"'); } prevTop = rc.top; }
            }
            if (document.documentElement.scrollWidth > document.documentElement.clientWidth) out.push('PAGE OVERFLOW');
            return out;
          }, lg);
          for (const x of r) { const k = `${w} ${mode} ${action}${obj ? ':' + obj : ''}`; (results[x] = results[x] || new Set()).add(k + ' @' + lg); }
        }
      }
    }
    if (errs.length) (results['ERRORS ' + errs.slice(0, 3).join(' / ')] = new Set()).add(w + ' ' + mode);
    await ctx.close();
  }
  const out = Object.entries(results).map(([k, v]) => k + '\n    ' + [...v].slice(0, 4).join('; ') + (v.size > 4 ? ` (+${v.size - 4})` : ''));
  fs.writeFileSync(__dirname + '/sweepui-' + tag + '.txt', out.join('\n'));
  console.log(out.length, 'distinct issues');
  await browser.close();
})();
