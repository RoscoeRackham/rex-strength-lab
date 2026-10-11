const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l02/';
const file = process.argv[2], tag = process.argv[3];
const presets = { def: null, spider: Math.log10(9071.8474), hulkSW: Math.log10(136077711000000), human: Math.log10(511), inf: 'inf', cap: Math.log10(362.873896) };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [320, 390, 768, 1280]) for (const [pn, lg] of Object.entries(presets)) {
    const ctx = await b.newContext({ viewport: { width: w, height: 844 } });
    const p = await ctx.newPage();
    if (lg != null) await p.addInitScript((lg) => { try { const st = { logKg: lg === 'inf' ? 34 : lg, inf: lg === 'inf', mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 }; if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('x', 1); } } catch (e) {} }, lg);
    await p.goto('file://' + file);
    await p.waitForTimeout(1000);
    const r = await p.evaluate(() => {
      const svg = document.querySelector('#ladder-viz svg'); const vb = svg.viewBox.baseVal;
      const texts = [...svg.querySelectorAll('text')].map(t => ({ t: t.textContent, bb: t.getBBox(), now: /^now/.test(t.textContent) }));
      const clipped = texts.filter(x => x.bb.x < -0.5 || x.bb.x + x.bb.width > vb.width + 0.5).map(x => x.t);
      const ov = []; for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) { const a = texts[i].bb, c = texts[j].bb; const ox = Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x), oy = Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y); if (ox > 1 && oy > 2) ov.push(texts[i].t + ' | ' + texts[j].t); }
      // is now text topmost? check it's last child
      const last = svg.lastElementChild; const nowEl = [...svg.querySelectorAll('text')].find(t => /^now/.test(t.textContent));
      const nb = nowEl.getBoundingClientRect(); const top = document.elementFromPoint(nb.left + nb.width / 2, nb.top + nb.height / 2);
      return { clipped, ov, nowCovered: !(top === nowEl || nowEl.contains(top)) ? (top && (top.closest('g') ? top.closest('g').textContent.slice(0, 40) : top.tagName)) : null, H: vb.height };
    });
    console.log(tag, w, pn, JSON.stringify(r));
    if (w === 390 && pn === 'def') await p.locator('#ladder-viz').screenshot({ path: D + tag + '-390.png' });
    await ctx.close();
  }
  await b.close();
})();
