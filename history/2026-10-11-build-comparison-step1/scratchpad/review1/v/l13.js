const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const [w, dark] of [[390, false], [1280, false], [390, true]]) {
    const p = await open(b, { width: w, height: 844, skel: 'host', dark });
    // pick a cell that has a same-row next sibling and a previous one
    const id = await p.evaluate(() => { const cells = Array.from(document.querySelectorAll('.figs')).find(g => g.children.length >= 3).children; return cells[1].dataset.id; });
    await p.evaluate((id) => { const c = document.querySelector('.fig[data-id="' + id + '"]'); c.previousElementSibling.focus(); c.scrollIntoView({ block: 'center' }); }, id);
    await p.keyboard.press('Tab'); await p.waitForTimeout(100);
    const info = await p.evaluate(() => { const a = document.activeElement, r = a.getBoundingClientRect(); return { id: a.dataset.id, fv: a.matches(':focus-visible'), r: [r.left, r.top, r.right, r.bottom].map(x => +x.toFixed(1)) }; });
    const pad = 8;
    const clip = { x: info.r[0] - pad, y: info.r[1] - pad, width: info.r[2] - info.r[0] + 2 * pad, height: info.r[3] - info.r[1] + 2 * pad };
    const buf = await p.screenshot({ clip, path: `${DIR}/l13-${w}-${dark ? 'dark' : 'light'}.png` });
    const chalk = dark ? [0x94, 0xB5, 0xFF] : [0x1F, 0x4F, 0xA6];
    const sides = await p.evaluate(async ({ b64, chalk, pad, wd, ht }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data; const is = (x, y) => { const i = (y * c.width + x) * 4; return Math.abs(d[i] - chalk[0]) < 35 && Math.abs(d[i + 1] - chalk[1]) < 35 && Math.abs(d[i + 2] - chalk[2]) < 35; };
      const count = (x0, x1, y0, y1) => { let n = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (is(x, y)) n++; return n; };
      // outline ring lies 2..4 px outside the cell
      return { left: count(pad - 4, pad - 1, pad, c.height - pad), right: count(c.width - pad + 1, c.width - pad + 4, pad, c.height - pad), top: count(pad, c.width - pad, pad - 4, pad - 1), bottom: count(pad, c.width - pad, c.height - pad + 1, c.height - pad + 4), cellH: c.height - 2 * pad, cellW: c.width - 2 * pad };
    }, { b64: buf.toString('base64'), chalk, pad });
    console.log(w, dark ? 'dark' : 'light', JSON.stringify(info), JSON.stringify(sides));
    await p._ctx.close();
  }
  await b.close();
})();
