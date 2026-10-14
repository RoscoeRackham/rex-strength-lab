const show = require('./page.js');
(async () => {
  for (const [ang, eff] of [[0, 'allout'], [0, 'least'], [90, 'least']]) {
    const r = await show({ surface: 'sand', action: 'throw', obj: 'car', angle: ang }, { effort: eff });
    console.log('angle', ang, eff, r.errs, '\n', r.text.split('\n').filter(l => /drives his feet|bear|ground holds|Courtesy|this effort/i.test(l)).join('\n'), '\n');
  }
})();
