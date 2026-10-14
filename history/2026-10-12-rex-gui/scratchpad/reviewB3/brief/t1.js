const { open } = require('./h.js');
(async () => {
  const H = await open();
  await H.load({});
  const pw = await H.page.evaluate(() => { document.getElementById('powers').open = true; return document.getElementById('powers').innerText; });
  console.log('=== POWERS PANEL\n' + pw);
  console.log('=== saved', await H.page.evaluate(() => localStorage.getItem('rex-lab-v1')));
  console.log('ERRS', H.errs);
  await H.browser.close();
})();
