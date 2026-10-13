const show = require('./page.js');
(async () => {
  for (const [act, surface] of [['stomp', 'concrete'], ['jump', 'concrete'], ['throw', 'concrete'], ['stomp', 'sand'], ['jump', 'sand'], ['sprint', 'sand'], ['lift', 'sand']]) {
    const r = await show({ surface, action: act }, { effort: 'ground' });
    const lines = r.text.split('\n').filter(l => /ground|break|crack|crater|hole|sink|Unbreakable|real/i.test(l));
    console.log('=====', act, surface, r.errs, '\n' + lines.slice(0, 14).join('\n'));
  }
})();
