const { open } = require('./render.js');
(async () => {
  const { browser, p } = await open(1280);
  const g = await p.evaluate(() => ({ gaps: window.__bc.GAPS, top: window.__bc.HUMAN_TOP, meat: window.__bc.MEAT, kingpin: window.__bc.LIST.find((e) => e.id === 'kingpin').score, cage: window.__bc.LIST.find((e) => e.id === 'luke_cage').score, ramy: window.__bc.LIST.find((e) => e.id === 'big_ramy').score }));
  console.log(JSON.stringify(g, null, 1));
  await browser.close();
})();
