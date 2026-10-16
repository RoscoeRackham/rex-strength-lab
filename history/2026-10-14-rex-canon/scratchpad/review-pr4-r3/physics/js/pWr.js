const { open, load, text, settle } = require('./pw.js');
const cut = (t) => t.slice(t.indexOf('Just standing') > 0 ? t.lastIndexOf('VS') : 0).slice(0, 7000);
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { duoAction: 'wrestle', wrestleMove: 'push' }, null, async (p) => { await p.selectOption('#duo-effort', 'allout'); });
  console.log('=== match all-out\n' + cut(await text(page)));
  await load(page, { duoAction: 'wrestle', wrestleMove: 'push' }, 3, async (p) => { await p.selectOption('#duo-effort', 'allout'); });
  console.log('=== walkout all-out\n' + cut(await text(page)));
  console.log('errors', errs);
  await browser.close();
})();
