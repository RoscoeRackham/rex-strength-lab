const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 900]]) for (const sch of ['light', 'dark']) {
    const { ctx, p } = await open(b, w, h, sch);
    await p.evaluate(() => document.getElementById('tool').scrollIntoView());
    await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && /measures/.test(document.getElementById('targetStatus').textContent) && /pass|fail/.test(document.getElementById('validation').textContent), null, { timeout: 60000 });
    const r = await p.evaluate(() => {
      const tool = document.getElementById('tool'), tr = tool.getBoundingClientRect(), out = [];
      tool.querySelectorAll('*').forEach((el) => { const q = el.getBoundingClientRect(); if (!q.width) return; if (el.closest('.tbl-wrap') && el !== el.closest('.tbl-wrap')) return; if (q.right > tr.right + 0.5 || q.left < tr.left - 0.5) out.push(el.tagName + '#' + el.id + '.' + (el.className.baseVal != null ? el.className.baseVal : el.className) + ' ' + Math.round(q.right - tr.right)); });
      const tw = document.querySelector('#tool .tbl-wrap'); const scrollsX = tw.scrollWidth > tw.clientWidth;
      // gutter labels overlapping each other
      const gl = Array.from(document.querySelectorAll('#gutter span')).map((s) => ({ t: s.textContent, r: s.getBoundingClientRect() }));
      const ov = []; for (let i = 0; i < gl.length; i++) for (let j = i + 1; j < gl.length; j++) { const a = gl[i].r, b2 = gl[j].r; if (Math.min(a.bottom, b2.bottom) - Math.max(a.top, b2.top) > 0.5) ov.push(gl[i].t + '/' + gl[j].t); }
      const btns = ['tSoldier', 'tChoose'].map((id) => { const q = document.getElementById(id).getBoundingClientRect(); return id + ' ' + Math.round(q.left) + '-' + Math.round(q.right) + ' y' + Math.round(q.top); });
      return { out: out.slice(0, 6), scrollsX, ov, btns, sw: document.documentElement.scrollWidth };
    });
    console.log(w, sch, JSON.stringify(r));
    if (sch === 'light') await p.locator('#tool').screenshot({ path: `${R}/ux/tool-${w}.png` });
    await ctx.close();
  }
  await b.close();
})();
