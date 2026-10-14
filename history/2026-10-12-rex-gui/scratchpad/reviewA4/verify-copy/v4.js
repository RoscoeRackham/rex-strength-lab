const { open, chromium } = require('./h');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const heights = process.argv[2] ? process.argv[2].split(',').map(Number) : [1000, 1040, 1050, 1060, 1070, 1080, 1090, 1100, 1110, 1120, 1150];
  for (const h of heights) {
    const r = await open(null, { browser, w: 1920, h, wait: 2500, file: process.env.F || 'branch.html' });
    await r.page.evaluate(() => window.scrollTo(0, 400));
    await r.page.waitForTimeout(400);
    const o = await r.page.evaluate(() => {
      const a = document.querySelector('.panel-controls'), cue = document.querySelector('#more-below');
      const box = a.getBoundingClientRect(), c = cue.getBoundingClientRect();
      const gl = document.querySelector('#ground-sec .side-head').getBoundingClientRect();
      const gs = document.querySelector('#surface').getBoundingClientRect();
      const pw = document.querySelector('#powers').getBoundingClientRect();
      // what is actually visible at the label's center?
      const cx = gl.left + 10, cy = (gl.top + gl.bottom) / 2;
      const hit = cy < innerHeight ? document.elementFromPoint(cx, cy) : null;
      return { sticky: box.top, boxBottom: Math.round(box.bottom), cueTop: Math.round(c.top), cueH: Math.round(c.height), cueHidden: cue.hidden, cue: cue.textContent,
        groundLabel: [Math.round(gl.top), Math.round(gl.bottom)], surface: [Math.round(gs.top), Math.round(gs.bottom)], powersTop: Math.round(pw.top),
        hitAtGroundLabel: hit ? (hit.id || hit.className || hit.tagName) : null, scrollTop: a.scrollTop };
    });
    console.log(h, JSON.stringify(o));
    if (h === 1080) await r.page.screenshot({ path: __dirname + '/cue-1920x1080.png', clip: { x: 380, y: 880, width: 380, height: 200 } });
    await r.ctx.close();
  }
  await browser.close();
})();
