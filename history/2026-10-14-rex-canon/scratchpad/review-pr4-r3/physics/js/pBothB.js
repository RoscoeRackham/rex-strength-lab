const { open, load, text, settle } = require('./pw.js');
const cut = (t) => t.slice(t.lastIndexOf('VS')).slice(0, 6000);
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both', oAnchor: 'bolted' }, null, async (p) => { await p.selectOption('#duo-effort', 'allout'); });
  console.log('=== both, Ollie bolted, all-out\n' + cut(await text(page)));
  console.log('errors', errs);
  await browser.close();
})();
