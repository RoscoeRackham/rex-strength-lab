const show = require('./page.js');
(async () => {
  for (const s of ['concrete', 'sand']) {
    const r = await show({ action: 'jump', logKg: 20, surface: s }, { effort: 'allout' });
    console.log('=====', s, r.errs, '\n' + r.text.split('\n').filter(l => /leaves at|whole push|supplie|can bear|shak|plaster/i.test(l)).slice(0, 10).join('\n'));
  }
})();
