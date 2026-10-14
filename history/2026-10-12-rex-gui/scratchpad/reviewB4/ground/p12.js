const show = require('./page.js');
(async () => {
  for (const st of [{ action: 'pull', obj: 'bus', ownRecoil: false }, { action: 'pull', obj: 'bus' }]) {
    const r = await show(st, { effort: 'plaster' });
    console.log('=====', JSON.stringify(st), r.errs, '\n' + r.text.split('\n').filter(l => /shak|plaster|rope|friction|planet|feet/i.test(l)).slice(0, 10).join('\n'));
  }
})();
