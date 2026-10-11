const { open } = require('./render.js');
(async () => {
  const { browser, p } = await open(1280);
  const t = await p.evaluate(() => ['scoreCard', 'natCard', 'fatCard', 'ignores', 'key'].map((id) => '### ' + id + '\n' + document.getElementById(id).innerText).join('\n\n'));
  console.log(t);
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 });
  console.log('### tool\n' + await p.evaluate(() => document.getElementById('toolStatus').innerText + '\n' + document.getElementById('results').innerText.split('\n').slice(0, 12).join('\n') + '\n' + document.getElementById('checks').innerText));
  await browser.close();
})();
