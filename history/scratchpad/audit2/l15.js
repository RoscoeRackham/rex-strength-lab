const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  const p = await ctx.newPage();
  await p.addInitScript(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'stomp' })); } catch (e) {} });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  console.log('reducedMotion match:', await p.evaluate(() => matchMedia('(prefers-reduced-motion: no-preference)').matches));
  console.log('action tab selected:', await p.evaluate(() => document.querySelector('[aria-selected=true]')?.id));
  // Math panel test
  const hasMath = await p.$('#bay details.math');
  console.log('math present', !!hasMath);
  await p.click('#bay details.math > summary');
  console.log('open after click:', await p.evaluate(() => document.querySelector('#bay details.math').open));
  // change slider via keyboard
  await p.focus('#strength');
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(400);
  console.log('open after ArrowRight on strength:', await p.evaluate(() => document.querySelector('#bay details.math')?.open));
  // Re-open and do a mouse drag
  await p.click('#bay details.math > summary');
  await (await p.$('#strength')).scrollIntoViewIfNeeded(); await p.waitForTimeout(200); const box = await (await p.$('#strength')).boundingBox(); console.log('box', JSON.stringify(box), 'vp', JSON.stringify(await p.evaluate(()=>[innerWidth, innerHeight, scrollY])));
  const y = box.y + box.height / 2;
  let x = box.x + box.width * 0.3;
  await p.mouse.move(x, y); await p.mouse.down();
  const samples = [];
  for (let i = 0; i < 30; i++) {
    x += 4;
    await p.mouse.move(x, y);
    // sample after two rAFs
    const o = await p.evaluate(() => new Promise(res => requestAnimationFrame(() => requestAnimationFrame(() => {
      const v = document.querySelector('#bay .verdict'); const t = document.querySelector('#bay .tiles');
      res([v && getComputedStyle(v).opacity, v && getComputedStyle(v).transform, t && getComputedStyle(t).opacity, document.querySelector('#strength').value]);
    }))));
    samples.push(o);
  }
  await p.mouse.up();
  console.log(samples.map(s => s.join(' | ')).join('\n'));
  await p.waitForTimeout(500);
  console.log('after settle opacity:', await p.evaluate(() => getComputedStyle(document.querySelector('#bay .verdict')).opacity));
  console.log('math open after drag:', await p.evaluate(() => document.querySelector('#bay details.math')?.open));
  // Realistic human drag: mouse moves every 16ms without awaiting sampling; sample via rAF loop
  await p.evaluate(() => { window.__op = []; const loop = () => { const v = document.querySelector('#bay .verdict'); if (v) window.__op.push(+getComputedStyle(v).opacity); if (window.__op.length < 400) requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
  x = box.x + box.width * 0.2; await p.mouse.move(x, y); await p.mouse.down();
  for (let i = 0; i < 60; i++) { x += 3; await p.mouse.move(x, y); await p.waitForTimeout(16); }
  await p.mouse.up();
  await p.waitForTimeout(300);
  const op = await p.evaluate(() => window.__op);
  const during = op.slice(5, 60);
  console.log('rAF-sampled opacity during drag: n=', during.length, 'min', Math.min(...during).toFixed(2), 'mean', (during.reduce((a,b)=>a+b,0)/during.length).toFixed(2), 'max', Math.max(...during).toFixed(2));
  console.log(op.slice(0, 80).map(v => v.toFixed(2)).join(' '));
  await b.close();
})();
