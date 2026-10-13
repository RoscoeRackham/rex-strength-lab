const show = require('./page.js');
(async () => {
  const r = await show({ logKg: 13, duoOpen: true, duoAction: 'arm' }, { duo: true, duoEffort: 'allout' });
  console.log(r.errs, '\n' + r.text.split('\n').filter(l => /quake|shake|net push|plaster|sound|harm|At this/i.test(l)).join('\n'));
})();
