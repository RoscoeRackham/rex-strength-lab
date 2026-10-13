// Mouse: click a control that shows through the cue's transparent fade
const { wrap, launch, D } = require('./common');
const extra = process.argv[2] || '';
const url = wrap('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page-click' + (extra ? '-fix' : '') + '.html', extra);
(async () => {
  const b = await launch();
  for (const [w, h, sel, scroll] of [[1366, 768, '#density', 400], [1280, 900, '#density-chips button:nth-last-child(2)', 500]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto(url); await p.waitForTimeout(800);
    await p.evaluate(s => window.scrollTo(0, s), scroll); await p.waitForTimeout(300);
    const r = await p.evaluate(sel => {
      const el = document.querySelector(sel), cue = document.querySelector('#more-below'), er = el.getBoundingClientRect(), cr = cue.getBoundingClientRect();
      // a point on the control inside the cue's band but in its upper (mostly see-through) third
      const y = Math.max(er.top + 2, cr.top + 4), x = el.id === 'density' ? er.left + er.width * 0.2 : er.left + er.width / 2;
      const at = document.elementFromPoint(x, y);
      return { label: el.id || el.textContent, el: [Math.round(er.top), Math.round(er.bottom)], cue: cue.hidden ? 'hidden' : [Math.round(cr.top), Math.round(cr.bottom)], x: Math.round(x), y: Math.round(y), at: at && (at.id || at.textContent.slice(0, 20)),
        dens: document.querySelector('#density-big').textContent, st: Math.round(document.querySelector('.panel-controls').scrollTop) };
    }, sel);
    console.log(w + 'x' + h, 'before', JSON.stringify(r));
    await p.mouse.click(r.x, r.y); await p.waitForTimeout(800);
    const after = await p.evaluate(() => ({ dens: document.querySelector('#density-big').textContent, st: Math.round(document.querySelector('.panel-controls').scrollTop), cueHidden: document.querySelector('#more-below').hidden }));
    console.log('   after click', JSON.stringify(after));
    await p.screenshot({ path: `${D}/click-${w}x${h}${extra ? '-fix' : ''}.png`, clip: { x: 0, y: Math.max(0, r.y - 100), width: 420, height: 160 } });
    await ctx.close();
  }
  await b.close();
})();
