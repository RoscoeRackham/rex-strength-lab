// The throw at unlimited strength in comic mode: does a mouse drag of the effort slider move it?
const { launch, PREV, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const s = JSON.parse(process.argv[2] || '{"inf":true,"mode":"comic","action":"throw","group":"solo"}');
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((x) => localStorage.setItem('rex-lab-v1', x), JSON.stringify(s));
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(PREV);
  const busy = () => page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
  const t0 = Date.now();
  for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (!(await busy())) break; }
  console.log('settled after', Date.now() - t0, 'ms; busy now', await busy());
  await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details.effort-adjust')) d.open = true; });
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => { const s = document.querySelector('#effort-use'); const r = s.getBoundingClientRect(); return { min: s.min, max: s.max, value: s.value, vt: s.getAttribute('aria-valuetext'), r: [r.x, r.y, r.width, r.height].map(Math.round), disabled: s.disabled }; });
  console.log('slider', JSON.stringify(info));
  const el = await page.$('#effort-use');
  await el.scrollIntoViewIfNeeded();
  const box = await el.boundingBox();
  await page.screenshot({ path: OUT + 'comic-drag-before.png', clip: { x: 0, y: Math.max(0, box.y - 200), width: 1280, height: 400 } });
  const y = box.y + box.height / 2, x0 = box.x + 8, x1 = box.x + box.width - 8;
  const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e && (e.id || e.tagName + '.' + e.className); }, [x0 + (x1 - x0) * 0.1, y]);
  console.log('element under the drag start:', hit);
  await page.evaluate(() => { window.__n = 0; document.addEventListener('input', () => window.__n++, true); });
  await page.mouse.move(x0 + (x1 - x0) * 0.1, y);
  await page.mouse.down();
  for (let i = 0; i <= 30; i++) { await page.mouse.move(x0 + (x1 - x0) * (0.1 + 0.8 * i / 30), y); await page.waitForTimeout(16); }
  await page.mouse.up();
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => { const s = document.querySelector('#effort-use'); return { inputs: window.__n, value: s.value, vt: s.getAttribute('aria-valuetext'), read: document.querySelector('.effort-read').innerText.split('\n')[0] }; });
  console.log('after drag', JSON.stringify(after), errs);
  await ctx.close(); await b.close();
})();
