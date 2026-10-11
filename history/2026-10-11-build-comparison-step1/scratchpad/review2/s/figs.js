// One drawing height across all stops, both Figures modes and both views; no clipping; overflow.
const { launch, open, R } = require('./lib');
const SIZES = [[360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 900]];
function probe() {
  const out = { grids: [], clip: [], overflowX: [], plateOver: [] };
  const vw = document.documentElement.clientWidth;
  document.querySelectorAll('.figs').forEach((grid) => {
    const stop = grid.closest('.stop');
    const cells = Array.from(grid.querySelectorAll('.fig'));
    const info = cells.map((c) => {
      const svg = c.querySelector('svg'), r = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const s = Math.min(r.width / vb.width, r.height / vb.height);
      // figure paths: the <g> after the wall
      const g = svg.querySelector('g');
      const gb = g.getBoundingClientRect();
      const bb = g.getBBox();
      // clipped: drawn content outside svg element box
      const clipped = gb.left < r.left - 0.5 || gb.right > r.right + 0.5 || gb.top < r.top - 0.5 || gb.bottom > r.bottom + 0.5;
      return { id: c.getAttribute('data-id'), cellW: c.getBoundingClientRect().width, svgW: r.width, svgH: r.height, W: vb.width, VH: vb.height, scale: s, figH: gb.height, figW: gb.width, clipped, bbTop: bb.y, bbBot: bb.y + bb.height, bbL: bb.x, bbR: bb.x + bb.width };
    });
    out.grids.push({ stop: stop && stop.id, cols: getComputedStyle(grid).gridTemplateColumns.split(' ').length, wr: grid.style.getPropertyValue('--wr'), cells: info });
  });
  document.querySelectorAll('.plate').forEach((pl) => {
    const pr = pl.getBoundingClientRect();
    pl.querySelectorAll('*').forEach((el) => { const r = el.getBoundingClientRect(); if (r.width && (r.right > pr.right + 0.5 || r.left < pr.left - 0.5)) out.plateOver.push((pl.closest('[data-id]') || pl.closest('.limit') || {}).getAttribute && ((pl.closest('[data-id]') || {}).getAttribute ? (pl.closest('[data-id]') ? pl.closest('[data-id]').getAttribute('data-id') : 'limitcard') : '') + ' ' + el.className + ' "' + el.textContent.slice(0, 30) + '" ' + Math.round(r.right - pr.right)); });
  });
  out.sw = document.documentElement.scrollWidth; out.iw = window.innerWidth;
  return out;
}
(async () => {
  const b = await launch();
  const rows = [];
  for (const [w, h] of SIZES) {
    const { ctx, p } = await open(b, w, h, 'light');
    for (const heights of ['same', 'real']) for (const view of ['front', 'side']) {
      await p.click(heights === 'same' ? '#hSame' : '#hReal');
      await p.click(view === 'front' ? '#vFront' : '#vSide');
      const r = await p.evaluate(probe);
      const all = r.grids.flatMap((g) => g.cells.map((c) => Object.assign({ stop: g.stop, cols: g.cols }, c)));
      const scales = all.map((c) => c.scale), mn = Math.min(...scales), mx = Math.max(...scales);
      const svgH = Array.from(new Set(all.map((c) => c.svgH.toFixed(1))));
      const minScale = all.filter((c) => c.scale < mx - 0.001).map((c) => c.stop + ':' + c.id + ' ' + c.scale.toFixed(3) + ' (cell ' + c.cellW.toFixed(0) + ' px, needs ' + (c.W * mx).toFixed(0) + ')');
      const clipped = all.filter((c) => c.clipped).map((c) => c.stop + ':' + c.id);
      const outVB = all.filter((c) => c.bbTop < -0.5 || c.bbBot > c.VH + 0.5).map((c) => c.id + ' y ' + c.bbTop.toFixed(1) + '..' + c.bbBot.toFixed(1) + ' of ' + c.VH);
      console.log(`${w} ${heights}/${view}: svgH ${svgH.join(',')} scale ${mn.toFixed(3)}..${mx.toFixed(3)} | grids cols ${r.grids.map((g) => g.stop + '=' + g.cols + '(wr ' + g.wr + ')').join(' ')} | sw ${r.sw}/${r.iw}`);
      if (minScale.length) console.log('   smaller scale: ' + minScale.join('; '));
      if (clipped.length) console.log('   clipped: ' + clipped.join(', '));
      if (outVB.length) console.log('   outside viewBox vertically: ' + outVB.join(', '));
      if (r.plateOver.length) console.log('   plate overflow: ' + r.plateOver.slice(0, 8).join(' | '));
    }
    await ctx.close();
  }
  await b.close();
})();
