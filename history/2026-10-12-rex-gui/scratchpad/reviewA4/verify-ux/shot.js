const { wrap, launch, D } = require('./common');
const extra = process.argv[2] || '';
const tag = extra ? 'fix' : 'branch';
const url = wrap('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page-' + tag + '.html', extra);
(async () => {
  const b = await launch();
  for (const [w, h, target] of [[1024, 768, 'density'], [1280, 720, 'surface']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto(url); await p.waitForTimeout(800);
    for (let i = 0; i < 80; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(40); if (await p.evaluate(t => document.activeElement.id === t, target)) break; }
    const info = await p.evaluate(() => { const a = document.activeElement, r = a.getBoundingClientRect(); return { id: a.id, top: r.top, bottom: r.bottom, outline: getComputedStyle(a).outlineWidth + ' ' + getComputedStyle(a).outlineStyle, cueBg: getComputedStyle(document.querySelector('#more-below')).backgroundImage, sel: a.tagName === 'SELECT' ? a.options[a.selectedIndex].text : a.value }; });
    console.log(w + 'x' + h, JSON.stringify(info));
    await p.screenshot({ path: `${D}/${tag}-${w}x${h}-${target}.png`, clip: { x: 0, y: h - 160, width: 420, height: 160 } });
    if (target === 'surface') { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(300); console.log('  after ArrowDown, ground =', await p.evaluate(() => { const s = document.querySelector('#surface'); return s.options[s.selectedIndex].text; })); await p.screenshot({ path: `${D}/${tag}-${w}x${h}-${target}-after.png`, clip: { x: 0, y: h - 160, width: 420, height: 160 } }); }
    await ctx.close();
  }
  await b.close();
})();
