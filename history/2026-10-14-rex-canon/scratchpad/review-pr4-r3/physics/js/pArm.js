const { open, load, text, settle } = require('./pw.js');
(async () => {
  const { browser, page, errs } = await open();
  const base = { duoAction: 'arm', keepForm: false, unbreakable: false, oAnchor: 'bolted' };
  await load(page, Object.assign({ logKg: 7 }, base), 3, async (p) => { await p.selectOption('#duo-effort', 'allout'); });
  console.log('=== Rex 1e7 vs Ollie 1t bolted real rock, all-out\n' + (await text(page)).slice(0, 3500));
  await load(page, Object.assign({ logKg: 6.5 }, base), null, async (p) => { await p.selectOption('#duo-effort', 'allout'); });
  console.log('=== equal 10^6.5, Ollie bolted real rock, all-out\n' + (await text(page)).slice(0, 3500));
  console.log('errors', errs);
  await browser.close();
})();
