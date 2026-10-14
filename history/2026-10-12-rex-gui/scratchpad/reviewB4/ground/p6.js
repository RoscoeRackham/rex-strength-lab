const show = require('./page.js');
(async () => {
  for (const st of [{ anchor: 'friction', colSrc: 'sprint' }, { anchor: 'friction', colSrc: 'jump' }, { anchor: 'bolted', colSrc: 'sprint' }, { anchor: 'bolted', colSrc: 'jump', logKg: 6 }]) {
    const r = await show(Object.assign({ duoOpen: true, duoAction: 'collide' }, st), { duo: true, duoEffort: 'plaster' });
    console.log('=====', JSON.stringify(st), r.errs, '\n' + r.text.split('\n').filter(l => /plaster|shake|never|Effort|ceiling|ground/i.test(l)).slice(0, 12).join('\n'));
  }
})();
