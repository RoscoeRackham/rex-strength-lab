const show = require('./page.js');
(async () => {
  const r = await show({ surface: 'sand', action: 'throw', obj: 'car', angle: 45, logKg: 6, ownRecoil: false }, { effort: 'allout' });
  console.log(r.errs, '\n' + r.text.split('\n').filter(l => /supplie|bear|their power|shak|plaster|from him|feet|slide|shoved/i.test(l)).slice(0, 16).join('\n'));
})();
