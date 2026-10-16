const { open, load, text, settle } = require('./pw.js');
const cut = (t) => t.slice(t.lastIndexOf('VS')).slice(0, 4500);
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { duoAction: 'collide', colBounce: 'bounce' });
  console.log('=== bounce least\n' + cut(await text(page)));
  console.log('errors', errs);
  await browser.close();
})();
