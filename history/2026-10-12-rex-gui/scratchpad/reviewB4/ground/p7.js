const show = require('./page.js');
(async () => {
  for (const [act, eff, s] of [['jump', 'allout', 'sand'], ['jump', 'allout', 'concrete'], ['throw', 'allout', 'sand']]) {
    const r = await show({ surface: s, action: act, obj: 'car', angle: 45 }, { effort: eff });
    console.log('=====', act, eff, s, r.errs, '\n' + r.text.split('\n').filter(l => /supplie|bear|their power|shak|plaster|push-off|pushes off/i.test(l)).slice(0, 14).join('\n'));
  }
})();
