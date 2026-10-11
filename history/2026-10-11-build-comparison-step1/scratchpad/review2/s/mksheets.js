// Make two test sheets with the page's own drawing code: a large Coleman sheet and a small soldier sheet.
const fs = require('fs');
const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 1280, 900, 'light');
  const out = await p.evaluate(() => {
    const D = window.COMPARE_DATA, calc = BuildCalc.create(D.builds);
    function sheet(id, px) {
      const r = calc.compute({ buildId: id, heightM: 1.8 }), g = {};
      BuildCalc.SITES.forEach((s) => { g[s] = r.girths[s].value; });
      const f = Figure.human(D.outline, 1.8, g, {}, { buttockFit: BuildCalc.FRUSTUM.M.buttock, armDeg: 45 }), y = f.dims.levels;
      const img = Figure.renderSheet({ front: f.front, side: f.side }, 1.8, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: px });
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);
      return c.toDataURL('image/png');
    }
    return { big: sheet('ronnie_coleman', 2000), small: sheet('ansur2_m_p50', 500) };
  });
  fs.writeFileSync(R + '/coleman-2000.png', Buffer.from(out.big.split(',')[1], 'base64'));
  fs.writeFileSync(R + '/soldier-500.png', Buffer.from(out.small.split(',')[1], 'base64'));
  console.log('ok');
  await ctx.close(); await b.close();
})();
