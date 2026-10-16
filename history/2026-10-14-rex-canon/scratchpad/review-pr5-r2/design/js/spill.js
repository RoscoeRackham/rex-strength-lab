// same page state, glow on vs glow layer hidden: pixels changed outside each picture box, and where inside
const L = require('./lib.js'), fs = require('fs');
const { PNG } = (() => { try { return require('/opt/node22/lib/node_modules/playwright/node_modules/pngjs'); } catch (e) { return {}; } })();
(async () => {
  const browser = await L.launch();
  for (const [w, h] of [[1280, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const pg = await L.newPage(browser, { viewport: { width: w, height: h }, reducedMotion: 'reduce', colorScheme: scheme });
    await L.load(pg, { action: 'throw', obj: 'car', inf: true, duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4 }, 'allout');
    await L.settled(pg, 'duo-bay');
    for (const sel of ['#hero-art', '#duo-bay .art-figure .glow-art']) {
      await pg.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
      const r = await pg.evaluate((s) => { const q = document.querySelector(s).getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; }, sel);
      const m = 16, clip = { x: Math.max(0, r[0] - m), y: Math.max(0, r[1] - m), width: r[2] + 2 * m, height: r[3] + 2 * m };
      const on = await pg.screenshot({ clip });
      await pg.evaluate((s) => { document.querySelector(s + ' .glow').style.display = 'none'; }, sel);
      const off = await pg.screenshot({ clip });
      await pg.evaluate((s) => { document.querySelector(s + ' .glow').style.display = ''; }, sel);
      const res = await pg.evaluate(async ([a, b, ox, oy, rr]) => {
        const ld = async (s) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, im.width, im.height); };
        const A = await ld(a), B = await ld(b); let out = 0, inside = 0, minx = 1e9, miny = 1e9, maxx = -1, maxy = -1;
        for (let y = 0; y < A.height; y++) for (let x = 0; x < A.width; x++) { const i = 4 * (y * A.width + x); const d = Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2]));
          if (d > 2) { const px = x + ox, py = y + oy; const inB = px >= rr[0] && px < rr[0] + rr[2] && py >= rr[1] && py < rr[1] + rr[3]; if (inB) { inside++; const fx0 = (px - rr[0]) / rr[2], fy0 = (py - rr[1]) / rr[3]; if (fx0 < 0.14 || fx0 > 0.72 || fy0 > 0.52) { (window.__far = window.__far || []).push([+fx0.toFixed(3), +fy0.toFixed(3), d]); } const fx = (px - rr[0]) / rr[2], fy = (py - rr[1]) / rr[3]; minx = Math.min(minx, fx); maxx = Math.max(maxx, fx); miny = Math.min(miny, fy); maxy = Math.max(maxy, fy); } else out++; } }
        const far = window.__far || []; window.__far = []; return { out, inside, far: far.length, farMax: far.reduce((m, q) => Math.max(m, q[2]), 0), farSample: far.slice(0, 8), fx: [minx.toFixed(3), maxx.toFixed(3)], fy: [miny.toFixed(3), maxy.toFixed(3)] };
      }, [on.toString('base64'), off.toString('base64'), clip.x, clip.y, r]);
      console.log(w, scheme, sel, 'box', r.map((x) => +x.toFixed(1)).join(','), JSON.stringify(res));
    }
    await pg.close();
  }
  await browser.close();
})();
