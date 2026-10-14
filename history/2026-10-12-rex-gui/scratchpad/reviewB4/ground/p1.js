const show = require('./page.js');
(async () => {
  const r = await show({ surface: 'sand', action: 'throw', obj: 'car', angle: 90 }, { effort: 'allout' });
  console.log(r.errs, '\n', r.text.split('\n').filter(l => /drives his feet|bear|ground holds|shak|plaster/i.test(l)).join('\n'));
})();
