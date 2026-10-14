const show = require('./page.js');
(async () => {
  for (const eff of ['allout', 'plaster', 'least']) {
    const r = await show({ action: 'jump', inf: true, surface: 'concrete' }, { effort: eff });
    console.log('=====', eff, r.errs, '\n' + r.text.split('\n').filter(l => /shak|plaster|ground|supplie|bear|Effort|ceiling|rattle|unlimited/i.test(l)).slice(0, 14).join('\n'));
  }
})();
