const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference', colorScheme: scheme });
  const p = await ctx.newPage();
  await p.addInitScript(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'lift' })); } catch (e) {} });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  const s = await p.$('#strength'); await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  const box = await s.boundingBox(); const y = box.y + box.height / 2;
  console.log('step attr', await p.evaluate(() => [document.querySelector('#strength').step, document.querySelector('#strength').min, document.querySelector('#strength').max]));
  await p.evaluate(() => { window.__op = []; window.__inputs = 0; document.querySelector('#strength').addEventListener('input', () => window.__inputs++);
    const loop = (t) => { const v = document.querySelector('#bay .verdict'); window.__op.push([t, v ? +getComputedStyle(v).opacity : -1]); if (window.__op.length < 300) requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
  let x = box.x + box.width * 0.25; await p.mouse.move(x, y); await p.mouse.down();
  for (let i = 0; i < 60; i++) { x += 2; await p.mouse.move(x, y); await p.waitForTimeout(16); }
  await p.mouse.up();
  await p.waitForTimeout(600);
  const op = await p.evaluate(() => window.__op); const n = await p.evaluate(() => window.__inputs);
  console.log(scheme, 'inputs', n, 'frames', op.length, 'value', await p.evaluate(() => document.querySelector('#strength').value));
  const vals = op.map(o => o[1]);
  const mid = vals.slice(10, Math.min(vals.length, 60));
  console.log('mid-drag opacity min/mean/max', Math.min(...mid).toFixed(2), (mid.reduce((a,b)=>a+b,0)/mid.length).toFixed(2), Math.max(...mid).toFixed(2));
  console.log(vals.map(v=>v.toFixed(2)).join(' '));
  // text colour contrast at 0.47
  const col = await p.evaluate(() => { const v = document.querySelector('#bay .verdict'); const cs = getComputedStyle(v); return [cs.color, getComputedStyle(document.body).backgroundColor, getComputedStyle(v.parentElement).backgroundColor, cs.fontSize, cs.fontWeight]; });
  console.log('colors', col);
  await ctx.close();
  }
  await b.close();
})();
