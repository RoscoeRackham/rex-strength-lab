const show = require('./page.js');
(async () => {
  const r = await show({ action: 'throw', obj: 'baseball', angle: 0, logKg: Math.log10(1.81436948e23) }, { effort: 'allout' });
  console.log(r.errs, '\n' + r.text.split('\n').filter(l => /shak|plaster|ground|planet|felt|rough/i.test(l)).slice(0, 16).join('\n'));
})();
