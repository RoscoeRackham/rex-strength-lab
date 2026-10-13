const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  // Collide, stomp-launch source, default powers
  await load({ duoOpen: true, duoAction: 'collide', colSrc: 'stomp' });
  await settle('duo-bay');
  const t = await text('duo-bay');
  console.log(t.slice(0, 1500));
  console.log('ERRS', errs);
  await browser.close();
})();
