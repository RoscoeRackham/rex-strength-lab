const H = require('./h.js'); const fs = require('fs');
(async () => {
  const page = await H.open(1280, 900);
  const out = {};
  for (const [name, st] of [['default', {}], ['off', { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }]]) {
    await H.load(page, Object.assign({ action: 'throw' }, st));
    for (const tab of ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight']) {
      await page.click('#tab-' + tab); await H.settle(page);
      out[name + ':' + tab] = await H.fullText(page, '#bay');
    }
    out[name + ':powers'] = await H.fullText(page, '#powers');
  }
  for (const k in out) fs.writeFileSync(H.DIR + '/txt/' + k.replace(':', '_') + '.txt', out[k]);
  console.log(page.errs);
  await H.close();
})();
