const { open, launch, DIR } = require('./h.js');
const { PNG } = (() => { try { return require('/opt/node22/lib/node_modules/playwright-core/node_modules/pngjs'); } catch (e) { return {}; } })();
(async () => {
  const b = await launch();
  for (const dark of [false, true]) {
    const p = await open(b, { width: 390, dark });
    // Tab until #hSame focused
    await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0,0); });
    for (const id of ['hSame', 'hReal', 'vFront', 'zHum']) {
      // keyboard focus: focus previous focusable then Tab
      await p.evaluate((id) => { const el = document.getElementById(id); const all = Array.from(document.querySelectorAll('a[href],button,select,input,[tabindex]')).filter(e => e.tabIndex >= 0 && !e.disabled && e.offsetParent); const i = all.indexOf(el); all[i-1].focus(); }, id);
      await p.keyboard.press('Tab');
      const info = await p.evaluate((id) => { const el = document.getElementById(id); const cs = getComputedStyle(el); const seg = el.parentElement; const r = el.getBoundingClientRect(), sr = seg.getBoundingClientRect(); return { active: document.activeElement.id, fv: el.matches(':focus-visible'), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor + ' off ' + cs.outlineOffset, segOverflow: getComputedStyle(seg).overflow, btn: [r.left, r.top, r.right, r.bottom].map(Math.round), seg: [sr.left, sr.top, sr.right, sr.bottom].map(Math.round) }; }, id);
      await p.evaluate((id) => document.getElementById(id).scrollIntoView({ block: 'center' }), id);
      const box = await p.evaluate((id) => { const r = document.getElementById(id).parentElement.getBoundingClientRect(); return { x: r.left - 10, y: r.top - 10, width: r.width + 20, height: r.height + 20 }; }, id);
      const buf = await p.screenshot({ clip: box, path: `${DIR}/l1-${dark ? 'dark' : 'light'}-${id}.png` });
      // count chalk pixels in the clip (outline colour)
      const chalk = dark ? [0x94, 0xB5, 0xFF] : [0x1F, 0x4F, 0xA6];
      const px = await p.evaluate(async ({ b64, chalk }) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data; const pts = [];
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4; if (Math.abs(d[i] - chalk[0]) < 30 && Math.abs(d[i+1] - chalk[1]) < 30 && Math.abs(d[i+2] - chalk[2]) < 30) pts.push([x, y]); }
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        return { n: pts.length, xr: [Math.min(...xs), Math.max(...xs)], yr: [Math.min(...ys), Math.max(...ys)], distinctX: [...new Set(xs)].sort((a,b)=>a-b) };
      }, { b64: buf.toString('base64'), chalk });
      console.log(dark ? 'dark' : 'light', id, JSON.stringify(info), 'chalk px in seg±10:', JSON.stringify(px));
    }
    await p._ctx.close();
  }
  await b.close();
})();
