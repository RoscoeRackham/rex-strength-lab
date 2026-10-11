const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const results = {};
  for (const w of [390, 1280]) for (const mode of ['comic', 'real']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    await ctx.addInitScript((m) => localStorage.setItem('rex-lab-v1', JSON.stringify({ mode: m })), mode);
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    for (const action of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
      await page.click('#tab-' + action);
      const objs = await page.evaluate(() => document.querySelector('#obj') ? [...document.querySelectorAll('#obj option')].map(o => o.value) : [null]);
      for (const obj of (action === 'throw' || action === 'lift' || action === 'pull') ? objs : [null]) {
        if (obj) await page.selectOption('#obj', obj);
        for (const lg of [2.708, 4, 6, 9, 12, 16, 20, 24, 28, 31, 34, 'inf']) {
          const r = await page.evaluate((lg) => {
            if (lg === 'inf') { [...document.querySelectorAll('#tier-chips .chip')].find(c => c.textContent === '∞').click(); }
            else { const s = document.querySelector('#strength'); s.value = lg; s.dispatchEvent(new Event('input')); }
            const out = [];
            const bay = document.querySelector('#bay');
            for (const svg of bay.querySelectorAll('svg')) {
              const sr = svg.getBoundingClientRect(); if (sr.width < 30) continue;
              for (const t of svg.querySelectorAll('text')) { const q = t.getBoundingClientRect(); if (!q.width) continue; if (q.left < sr.left - 1 || q.right > sr.right + 1) out.push('SVGCLIP "' + t.textContent + '" ' + (q.left < sr.left - 1 ? 'L' + Math.round(q.left - sr.left) : 'R+' + Math.round(q.right - sr.right))); }
              // overlapping text labels
              const ts = [...svg.querySelectorAll('text')].map(t => [t, t.getBoundingClientRect()]).filter(x => x[1].width);
              for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) { const a = ts[i][1], b = ts[j][1]; const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 2 && oy > 3) out.push('OVERLAP "' + ts[i][0].textContent + '" x "' + ts[j][0].textContent + '"'); }
            }
            // mid-token breaks in tiles/verdict/status
            for (const e of bay.querySelectorAll('.tile .v, .tile .s, .status, .verdict')) {
              const tn = [...e.childNodes].find(n => n.nodeType === 3); if (!tn) continue;
              const txt = tn.textContent; let prevTop = null; const rg = document.createRange();
              for (let i = 0; i < txt.length; i++) { rg.setStart(tn, i); rg.setEnd(tn, i + 1); const rc = rg.getClientRects()[0]; if (!rc) continue; if (prevTop != null && rc.top > prevTop + 4) { const a = txt[i - 1], b = txt[i]; if (!/[\s\-–—·\/(]/.test(a) && !/\s/.test(b)) out.push('MIDBREAK [' + e.className + '] "' + txt.slice(Math.max(0, i - 12), i) + '|' + txt.slice(i, i + 12) + '"'); } prevTop = rc.top; }
            }
            if (document.documentElement.scrollWidth > document.documentElement.clientWidth) out.push('PAGE OVERFLOW');
            return out;
          }, lg);
          for (const x of r) { const k = `${w} ${mode} ${action}${obj ? ':' + obj : ''}`; const key = x; (results[key] = results[key] || new Set()).add(k + ' @' + lg); }
        }
      }
    }
    await ctx.close();
  }
  const out = Object.entries(results).map(([k, v]) => k + '\n    ' + [...v].slice(0, 4).join('; ') + (v.size > 4 ? ` (+${v.size - 4})` : ''));
  fs.writeFileSync(__dirname + '/sweepui.txt', out.join('\n'));
  console.log(out.length, 'distinct issues');
  await browser.close();
})();
