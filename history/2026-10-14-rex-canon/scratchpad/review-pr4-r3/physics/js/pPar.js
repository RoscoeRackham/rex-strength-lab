const { open, load, text, settle } = require('./pw.js');
const cut = (t) => t.slice(t.lastIndexOf('VS')).slice(0, 5000);
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { duoAction: 'collide', anchor: 'bolted' });
  console.log('=== paradox bolted least\n' + cut(await text(page)));
  await load(page, { duoAction: 'collide', colSrc: 'jump', unbreakable: false }, null, async (p) => { await p.selectOption('#duo-effort', 'allout'); });
  console.log('=== jump real ground allout\n' + cut(await text(page)));
  console.log('errors', errs);
  await browser.close();
})();
