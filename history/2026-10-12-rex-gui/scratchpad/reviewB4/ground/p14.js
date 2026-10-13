const show = require('./page.js');
(async () => {
  const r = await show({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'easy', cLogD: 1, surface: 'sand' }, { duo: true, duoEffort: 'rattle' });
  console.log(r.errs, '\n' + r.text.split('\n').filter(l => /feet hand|bear|supplie|shak|rattle|their power|Effort|would give|kg·m\/s/i.test(l)).slice(0, 14).join('\n'));
})();
