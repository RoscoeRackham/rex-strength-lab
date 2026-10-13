const { open, settle } = require('./lib.js');
(async () => {
  const cases = [
    ['default', null],
    ['baseball', { obj: 'baseball' }],
    ['bolted', { anchor: 'bolted' }],
    ['sand', { surface: 'sand' }],
    ['ub+recoil off', { unbreakable: false, ownRecoil: false }],
  ];
  for (const [name, st] of cases) {
    const { browser, page, errs } = await open(null, { state: st, tag: 'credit' });
    const t = await page.evaluate(() => { const b = document.querySelector('.effort-box, .effort-readout') || document.body; 
      const ps = Array.from(document.querySelectorAll('#bay p, main p')).map(p=>p.innerText).filter(x=>/Courtesy ceiling/.test(x));
      const lis = Array.from(document.querySelectorAll('.haz-list li')).map(l=>l.innerText);
      return { ps, lis }; });
    console.log('== ' + name); console.log(JSON.stringify(t, null, 1)); if (errs.length) console.log('ERR', errs);
    await browser.close();
  }
})();
