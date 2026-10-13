const { open } = require('./h.js');
(async () => {
  const H = await open();
  for (const st of [{}, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, { airAbsorb: 0.3 }, { unbreakable: false }, { anchor: 'bolted', silentStrike: true }]) {
    await H.load(Object.assign({ action: 'throw' }, st));
    const s = await H.page.evaluate(() => document.querySelector('#powers summary').innerText.replace(/\s+/g, ' '));
    console.log(JSON.stringify(st), '=>', s);
  }
  await H.browser.close();
})();
