const H = require('./h.js');
// usage: node presets.js '<state json>' tabs presets
(async () => {
  const st = JSON.parse(process.argv[2] || '{}');
  const tabs = (process.argv[3] || 'throw,jump,stomp,punch,clap,sprint,pull').split(',');
  const presets = (process.argv[4] || 'least,ceiling,rattle,plaster,windows,ground,houses,block,allout').split(',');
  for (const t of tabs) {
    const p = await H.open(Object.assign({ action: t, group: 'solo' }, st));
    await H.waitDone(p);
    for (const pr of presets) {
      await H.setEffort(p, pr);
      await H.openAll(p);
      const txt = await p.evaluate(() => {
        const b = document.querySelector('#bay');
        const v = b.querySelector('.verdict'); const sr = b.querySelector('.status-row'); const er = b.querySelector('.effort-read');
        const gate = [...b.querySelectorAll('.callout')].map((x) => x.innerText).join(' / ');
        const happ = [...b.querySelectorAll('ul.happens li')].map((x) => '  • ' + x.innerText).join('\n');
        const tl = [...b.querySelectorAll('.tile')].map((x) => x.innerText.replace(/\n/g, ' | ')).join('\n  ');
        return (gate ? 'CALLOUT: ' + gate + '\n' : '') + 'VERDICT: ' + (v ? v.innerText : '-') + '\nCHIPS: ' + (sr ? sr.innerText.replace(/\n/g, ' / ') : '-') + '\nREADOUT: ' + (er ? er.innerText : '-') ;
      });
      console.log('=========== ' + t + ' / ' + pr + ' ' + JSON.stringify(st));
      console.log(txt);
    }
    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
