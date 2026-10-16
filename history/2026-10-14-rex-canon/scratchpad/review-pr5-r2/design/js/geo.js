const L = require('./lib.js');
(async () => {
  const browser = await L.launch();
  const res = {};
  for (const [w, h] of [[1280, 900], [390, 844], [320, 700]]) {
    const pg = await L.newPage(browser, { viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    await L.load(pg, { action: 'walk', duoOpen: true, duoAction: 'collide', colMode: 'push' });
    const g = await pg.evaluate(() => { const R = (n) => n ? (({ x, y, width, height }) => [x, y, width, height].map((v) => +v.toFixed(2)))(n.getBoundingClientRect()) : null;
      return { heroImg: R(document.querySelector('header.hero img')), h1: R(document.querySelector('h1')), colImg: R(document.querySelector('#duo-bay .art-figure img')), colCap: R(document.querySelector('#duo-bay .art-figure figcaption')), sx: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    res[w] = g; await pg.close();
  }
  console.log(process.env.REPO ? 'BASE' : 'PR5', JSON.stringify(res));
  await browser.close();
})();
