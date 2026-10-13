const { open } = require('./pw.js');
(async () => {
  const W = await open(process.argv[2]);
  await W.load({ action: 'throw' });
  const t = await W.text('#bay .effort-read');
  console.log('DEFAULT THROW effort box:\n', t);
  await W.page.evaluate(() => { const d = document.querySelector('#bay details.haz-list'); if (d) d.open = true; });
  console.log('\nhazard list:', await W.text('#bay details.haz-list'));
  await W.load({ action: 'throw', unbreakable: false, ownRecoil: false });
  console.log('\nPOWERS unbreakable+ownRecoil OFF, effort box:\n', await W.text('#bay .effort-read'));
  console.log('errors', W.errs);
  await W.close();
})();
